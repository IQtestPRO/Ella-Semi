/**
 * importar-imagensnovas.mjs — cadastra as peças do lote `Imagensnovas` (ADR-0025).
 *
 * Fontes:
 *   Imagensnovas/**.png|jpg                      — fotos (nome = código + nome + preço)
 *   docs/catalogo/mapa-imagensnovas.json         — agrupamento por PEÇA REAL dos
 *                                                  códigos ambíguos (feito olhando as fotos)
 *   docs/catalogo/indice-conf-imagensnovas.json  — número da foto -> arquivo
 *   docs/catalogo/indice-semnome-imagensnovas.json — fotos UUID (sem nome)
 *
 * Regras (decisões do Pak):
 *   - categoria vem do TIPO da peça (colar/pulseira/brinco), nunca da cor da pasta;
 *   - Choker é colar;
 *   - cor diferente = peça diferente;
 *   - estoque começa null (sem controle) — a Ellen preenche no /admin;
 *   - foto sem nome só entra se casar com peça nomeada.
 *
 * Idempotente por slug: re-rodar atualiza em vez de duplicar.
 */
import { readFileSync, readdirSync } from "node:fs";
import { resolve, join, extname, basename } from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { createClient } from "@libsql/client";
import { lerNomeArquivo, categoriaDoNome } from "../lib/import/nome-arquivo.ts";

const env = Object.fromEntries(
  readFileSync(resolve(".env.local"), "utf-8").split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1)]; }),
);
const db = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

const SRC = resolve("Imagensnovas");
const MAX_DIM = 1600;
const agora = new Date().toISOString();

const MAPA = JSON.parse(readFileSync("docs/catalogo/mapa-imagensnovas.json", "utf-8")).codigos;
const INDICE = JSON.parse(readFileSync("docs/catalogo/indice-conf-imagensnovas.json", "utf-8"));
const porNumero = new Map(INDICE.map((i) => [i.n, i.arquivo]));

/** Fotos UUID que, olhando, são a MESMA peça de um código nomeado. */
const SEM_NOME_CASADAS = {
  5: "EAL 844",   // contas verde + pingente vermelho sol = pedra murano verde
  8: "ETU 9676",  // brinco redondo dourado com pérola
  13: "ETU 102",  // brinco argola aberta com pérola
};

function listar(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...listar(p));
    else if (/\.(png|jpe?g)$/i.test(e.name)) out.push(p);
  }
  return out;
}

function slugify(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "peca";
}

/** Banho/tipo pela pasta de origem (a Ellen separou por material). */
function atributosDaPasta(arquivo) {
  if (arquivo.includes("BIJUTERIAS")) return { tipo: "bijuteria", banho: "a-confirmar" };
  if (arquivo.includes("DOURADO")) return { tipo: "semijoia", banho: "ouro" };
  return { tipo: "semijoia", banho: "a-confirmar" };
}

// ── 1. lê e agrupa ──────────────────────────────────────────────────────────
const arquivos = listar(SRC);
const porChave = new Map();   // chave -> peça
const semNome = [];
const precoPorCodigo = new Map();

// Arquivos que têm só o código e o preço ("EAL 8614 $59,90.png", "EAL 8614.png"):
// são fotos extras de alguma peça daquele código, não peça nova.
const soCodigo = [];

for (const f of arquivos) {
  const base = basename(f, extname(f));
  const mSo = /^\s*([A-Z]{2,4})\s*(\d{2,6})\s*\$?\s*[\d.,]*\s*$/.exec(base);
  if (mSo) { soCodigo.push({ codigo: `${mSo[1]} ${mSo[2]}`, arquivo: f }); continue; }

  const lido = lerNomeArquivo(base);
  if (!lido) { semNome.push(f); continue; }
  if (lido.precoCents != null && !precoPorCodigo.has(lido.codigo)) {
    precoPorCodigo.set(lido.codigo, lido.precoCents);
  }
  if (!porChave.has(lido.chave)) {
    porChave.set(lido.chave, { ...lido, arquivos: [] });
  }
  porChave.get(lido.chave).arquivos.push(f);
}

// ── 2. aplica o mapa visual nos códigos ambíguos ────────────────────────────
const pecas = [];
const codigosMapeados = new Set(Object.keys(MAPA));

for (const [codigo, defs] of Object.entries(MAPA)) {
  for (const def of defs) {
    const arqs = def.fotos.map((n) => porNumero.get(n)).filter(Boolean);
    if (!arqs.length) { console.warn(`${codigo} "${def.nome}": sem fotos`); continue; }
    pecas.push({
      codigo,
      nome: def.nome,
      precoCents: precoPorCodigo.get(codigo) ?? null,
      arquivos: arqs,
    });
  }
}

// códigos com um nome só: vão como estão
for (const g of porChave.values()) {
  if (codigosMapeados.has(g.codigo)) continue;
  pecas.push({
    codigo: g.codigo,
    nome: g.nome,
    precoCents: g.precoCents ?? precoPorCodigo.get(g.codigo) ?? null,
    arquivos: g.arquivos,
  });
}

// ── 3. anexa as fotos sem nome que casam ────────────────────────────────────
const semNomeOrdenado = [...semNome].sort();
for (const [nStr, codigo] of Object.entries(SEM_NOME_CASADAS)) {
  const arq = semNomeOrdenado[Number(nStr) - 1];
  if (!arq) continue;
  const alvo = pecas.find((p) => p.codigo === codigo);
  if (alvo) alvo.arquivos.push(arq);
}
const semNomeSobrando = semNomeOrdenado.filter(
  (_, i) => !SEM_NOME_CASADAS[i + 1],
);

// fotos "só código" entram na primeira peça daquele código
let extrasAnexadas = 0;
for (const { codigo, arquivo } of soCodigo) {
  const alvo = pecas.find((p) => p.codigo === codigo);
  if (alvo) { alvo.arquivos.push(arquivo); extrasAnexadas++; }
  else console.warn(`foto "${basename(arquivo)}": nenhuma peça com o código ${codigo}`);
}

// ── 4. grava ────────────────────────────────────────────────────────────────
let criadas = 0, semPreco = 0, fotosEnviadas = 0;
const porCategoria = {};

for (const p of pecas) {
  const categoria = categoriaDoNome(p.nome);
  if (!categoria) { console.warn(`sem categoria: ${p.codigo} ${p.nome}`); continue; }
  if (p.precoCents == null) { semPreco++; console.warn(`sem preço, pulando: ${p.codigo} ${p.nome}`); continue; }

  const { tipo, banho } = atributosDaPasta(p.arquivos[0]);
  const slug = `${slugify(p.nome)}-${slugify(p.codigo)}`;

  // fotos -> WebP -> BLOB
  const fotos = [];
  for (const arq of p.arquivos) {
    const buf = await sharp(arq).rotate()
      .resize(MAX_DIM, MAX_DIM, { fit: "inside", withoutEnlargement: true })
      .webp({ quality: 84 }).toBuffer();
    const meta = await sharp(buf).metadata();
    const id = randomUUID();
    await db.execute({
      sql: "INSERT INTO images (id, mime, bytes, width, height, alt, criadoEm) VALUES (?,?,?,?,?,?,?)",
      args: [id, "image/webp", buf, meta.width, meta.height, p.nome, agora],
    });
    fotos.push({
      url: `/api/images/${id}`, alt: p.nome, fonte: "upload-admin",
      width: meta.width, height: meta.height,
    });
    fotosEnviadas++;
  }

  await db.execute({
    sql: `INSERT INTO products
      (slug, nome, codigo, categoria, banho, tipo, precoCents, precoPromocionalCents, descricao,
       fotos, videoUrl, variantes, tags, estoque, promocao, tipoFulfillment, destaqueHome, maisVendido,
       ativo, origem, fonteFotoFraca, cadastradoEm, atualizadoEm, ordem)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(slug) DO UPDATE SET
        nome=excluded.nome, codigo=excluded.codigo, categoria=excluded.categoria,
        banho=excluded.banho, tipo=excluded.tipo, precoCents=excluded.precoCents,
        descricao=excluded.descricao, fotos=excluded.fotos, ativo=excluded.ativo,
        atualizadoEm=excluded.atualizadoEm`,
    args: [
      slug, p.nome, p.codigo, categoria, banho, tipo, p.precoCents, null, p.nome,
      JSON.stringify(fotos), null, null, null, null, 0, "pronta-entrega", 0, 0,
      1, null, null, agora, agora, 900 + criadas,
    ],
  });
  criadas++;
  porCategoria[categoria] = (porCategoria[categoria] ?? 0) + 1;
}

console.log(`\nPEÇAS CADASTRADAS: ${criadas}`);
for (const [c, n] of Object.entries(porCategoria).sort()) console.log(`  ${c.padEnd(14)} ${n}`);
console.log(`fotos enviadas: ${fotosEnviadas} (${extrasAnexadas} eram só código, viraram foto extra)`);

// limpa imagens que ficaram sem dono (re-execuções do import)
const usadas = new Set();
for (const r of (await db.execute("SELECT fotos FROM products")).rows) {
  for (const f of JSON.parse(r.fotos || "[]")) {
    const m = /\/api\/images\/([^/?]+)/.exec(f.url || "");
    if (m) usadas.add(m[1]);
  }
}
for (const r of (await db.execute("SELECT valor FROM settings")).rows) {
  for (const m of String(r.valor).matchAll(/\/api\/images\/([a-f0-9-]+)/g)) usadas.add(m[1]);
}
let orfas = 0;
for (const r of (await db.execute("SELECT id FROM images")).rows) {
  if (usadas.has(r.id)) continue;
  await db.execute({ sql: "DELETE FROM images WHERE id = ?", args: [r.id] });
  orfas++;
}
console.log(`imagens órfãs apagadas: ${orfas}`);
console.log(`peças puladas por falta de preço: ${semPreco}`);
console.log(`\nFOTOS SEM NOME QUE FICARAM DE FORA (${semNomeSobrando.length}) — precisam de nome e preço:`);
for (const f of semNomeSobrando) console.log(`  ${basename(f)}`);

const total = await db.execute("SELECT categoria, COUNT(*) n FROM products WHERE ativo = 1 GROUP BY categoria ORDER BY categoria");
console.log("\nCATÁLOGO NO AR:");
for (const r of total.rows) console.log(`  ${String(r.categoria).padEnd(14)} ${r.n}`);
