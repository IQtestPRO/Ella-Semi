/**
 * import-produtos-reais.mjs — cadastra os produtos reais da Ellen no Turso.
 *
 * Entradas:
 *   .scratch/produtos-canon.json  — lista canônica (código, nome, preço, categoria)
 *   .scratch/match-result.json    — matching foto↔produto do workflow de visão
 *   img2-produtcs/*.jpeg          — fotos originais do WhatsApp
 *
 * Para cada produto: processa as fotos (sharp → WebP ≤1600px → BLOB na tabela
 * images), monta a galeria (capa = melhor qualidade; fotos com etiquetas
 * numeradas vão pro fim) e insere na tabela products com o código prefixado.
 * Idempotente: re-rodar atualiza pelo slug.
 */
import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { createClient } from "@libsql/client";

const env = Object.fromEntries(
  readFileSync(resolve(".env.local"), "utf-8").split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1)]; }),
);
const db = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

const canon = JSON.parse(readFileSync(".scratch/produtos-canon.json", "utf-8")).produtos;
const match = JSON.parse(readFileSync(".scratch/match-result.json", "utf-8")).resultados;

const IMG_DIR = "img2-produtcs";
const MAX_DIM = 1600;

function slugify(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "peca";
}

// ── 1. agrupa fotos por produto (principal + secundários) ───────────────────
const fotosPorCodigo = new Map(); // codigo -> [{arquivo, qualidade, numerada, descricao, principal}]
for (const r of match) {
  if (r.codigo === "SEM-MATCH") continue;
  const add = (cod, principal) => {
    if (!fotosPorCodigo.has(cod)) fotosPorCodigo.set(cod, []);
    fotosPorCodigo.get(cod).push({
      arquivo: r.arquivo,
      qualidade: r.qualidade,
      numerada: !!r.numerosMarcados,
      descricao: r.descricao,
      principal,
    });
  };
  add(r.codigo, true);
  for (const sec of r.codigosSecundarios ?? []) {
    if (sec && sec !== r.codigo) add(sec, false);
  }
}

// ── 2. processa cada arquivo UMA vez → images table ─────────────────────────
const imgCache = new Map(); // arquivo -> {id,url,width,height}
async function processarImagem(arquivo, alt) {
  if (imgCache.has(arquivo)) return imgCache.get(arquivo);
  const buf = readFileSync(join(IMG_DIR, arquivo));
  const { data, info } = await sharp(buf)
    .rotate()
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84 })
    .toBuffer({ resolveWithObject: true });
  const id = randomUUID();
  await db.execute({
    sql: "INSERT INTO images (id, mime, bytes, width, height, alt, criadoEm) VALUES (?,?,?,?,?,?,?)",
    args: [id, "image/webp", new Uint8Array(data), info.width, info.height, alt, new Date().toISOString()],
  });
  const rec = { id, url: `/api/images/${id}`, width: info.width, height: info.height };
  imgCache.set(arquivo, rec);
  return rec;
}

// ── 3. cadastra produtos ────────────────────────────────────────────────────
const ordemBase = Number(
  (await db.execute("SELECT COALESCE(MAX(ordem), -1) + 1 AS n FROM products")).rows[0].n,
);

let i = 0, ok = 0, semFoto = [];
for (const p of canon) {
  const fotosMeta = (fotosPorCodigo.get(p.codigo) ?? [])
    // capa: melhor qualidade primeiro; fotos numeradas (multi-produto) por último
    .sort((a, b) => {
      const q = { boa: 0, aceitavel: 1, ruim: 2 };
      return (a.numerada ? 10 : 0) + q[a.qualidade] - ((b.numerada ? 10 : 0) + q[b.qualidade]);
    });

  if (fotosMeta.length === 0) semFoto.push(p.codigo);

  const fotos = [];
  const vistos = new Set();
  for (const f of fotosMeta) {
    if (vistos.has(f.arquivo)) continue;
    vistos.add(f.arquivo);
    const img = await processarImagem(f.arquivo, `${p.nome} — foto do produto`);
    fotos.push({
      url: img.url,
      alt: `${p.nome}${f.numerada ? " (foto com outras peças)" : ""}`,
      fonte: "upload-admin",
      width: img.width,
      height: img.height,
    });
  }

  const slug = slugify(`${p.nome} ${p.codigo.replace(/^(BR|CO|CH|BRA|PL|CJ)/, "")}`);
  const isAco = /aço/i.test(p.nome);
  const isSilicone = /silicone/i.test(p.nome);
  const descBase = fotosMeta.find((f) => !f.numerada)?.descricao ?? "";
  const descricao =
    `${p.nome}${p.semCodigo ? "" : ` (cód. ${p.codigo})`}. ` +
    (descBase ? `${descBase} ` : "") +
    "Atendimento e pedido direto com a Ellen pelo WhatsApp.";

  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO products
      (slug, nome, codigo, categoria, banho, tipo, precoCents, precoPromocionalCents, descricao,
       fotos, variantes, tags, promocao, tipoFulfillment, destaqueHome, maisVendido,
       ativo, origem, fonteFotoFraca, cadastradoEm, atualizadoEm, ordem)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(slug) DO UPDATE SET
        nome=excluded.nome, codigo=excluded.codigo, categoria=excluded.categoria,
        precoCents=excluded.precoCents, descricao=excluded.descricao, fotos=excluded.fotos,
        variantes=excluded.variantes, ativo=excluded.ativo, atualizadoEm=excluded.atualizadoEm`,
    args: [
      slug,
      p.nome,
      p.semCodigo ? null : p.codigo,
      p.categoria,
      "ouro",
      isAco || isSilicone ? "bijuteria" : "semijoia",
      p.precoCents,
      null,
      descricao,
      JSON.stringify(fotos),
      p.variantes ? JSON.stringify(p.variantes) : null,
      JSON.stringify(["estoque-real"]),
      0,
      "pronta-entrega",
      0,
      0,
      1,
      null,
      null,
      now,
      now,
      ordemBase + i,
    ],
  });
  ok++;
  i++;
  console.log(`✓ ${p.codigo.padEnd(14)} ${p.nome} — ${fotos.length} foto(s) — /${p.categoria}/${slug}`);
}

console.log(`\n✓ ${ok} produtos cadastrados · ${imgCache.size} imagens processadas`);
if (semFoto.length) console.log(`⚠ sem foto casada: ${semFoto.join(", ")}`);
process.exit(0);
