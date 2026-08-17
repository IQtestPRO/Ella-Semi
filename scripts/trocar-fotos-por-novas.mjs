/**
 * trocar-fotos-por-novas.mjs — decisão do Pak (2026-08-17):
 * REMOVER todas as fotos atuais dos produtos e usar APENAS as 45 fotos da
 * pasta `Imgenasnovas`.
 *
 * O que faz:
 *   1. Limpa `fotos` de TODOS os produtos (nenhuma imagem antiga permanece).
 *   2. Processa as 45 fotos novas (sharp -> WebP <=1600px -> BLOB em `images`).
 *   3. Atribui cada foto à peça cujo nome melhor descreve o que está na foto
 *      (casamento feito por análise visual — ver MAPA abaixo).
 *   4. Separa as fotos de corpo inteiro para a camada de marca (hero, faixa do
 *      meio e capas de categoria), gravando em /public.
 *
 * Peça sem foto nova fica com 0 fotos e o site mostra a silhueta da marca
 * (PlaceholderProductImage, ADR-0016).
 *
 * Idempotente: re-rodar limpa e refaz do zero.
 */
import { readFileSync, writeFileSync, mkdirSync, readdirSync } from "node:fs";
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

const SRC = resolve("Imgenasnovas");
const MAX_DIM = 1600;

// ── índice: #NN -> caminho do arquivo (ordem alfabética, igual ao mosaico) ──
function listarFotos() {
  const out = [];
  for (const dir of readdirSync(SRC, { withFileTypes: true })) {
    if (!dir.isDirectory()) continue;
    for (const f of readdirSync(join(SRC, dir.name))) {
      if (/\.jpe?g$/i.test(f)) out.push(join(SRC, dir.name, f));
    }
  }
  return out.sort();
}
const FOTOS = listarFotos();
if (FOTOS.length !== 45) {
  console.warn(`aviso: esperava 45 fotos, achei ${FOTOS.length}`);
}

/**
 * MAPA foto -> peça. A chave é o número do contact sheet; o valor é o código
 * da peça no catálogo (campo `codigo`). Casamento por leitura visual: cor da
 * pedra, formato do pingente e tipo de corrente conferidos contra o nome.
 */
const MAPA = {
  3: "18F",      // corrente longa dourada com moedinhas
  4: "21B",      // contas azul claro + medalha
  5: "22A",      // contas verde-água + medalha redonda
  6: "22A",      // (mesma peça, na modelo)
  7: "17B",      // pedras naturais claras + pingente gota
  8: "14A",      // corrente fina com olhos gregos
  11: "18E",     // bolinhas douradas + coração
  12: "10C",     // pedras naturais escuras + medalha
  13: "17A",     // elos + pedras roxas (cristal)
  15: "14A",     // olho grego (close no pescoço)
  16: "05D",     // turquesa + toggle + pingente turquesa
  17: "22F",     // azul claro + estrela-do-mar
  19: "21E",     // coral vermelho em galhos
  20: "CO324",   // corrente elos + pingente coração
  21: "22D",     // miçangas azul
  22: "07E",     // cordão + estrela-do-mar
  23: "23A",     // miçangas azul e verde com pingente
  24: "05B",     // pedras turquesa/azul + medalha
  26: "23E",     // pérola barroca + toggle
  27: "19B",     // corrente elos grandes
  28: "24H",     // contas verde + pingente
  29: "05G",     // corrente + coração bojudo
  30: "24H",     // (mesma peça verde, ângulo 2)
  31: "05D",     // (turquesa na modelo)
  32: "CO188",   // corrente bolinha + coração com pérola
  18: "23A",     // (miçangas azul e verde, na modelo)
  36: "21A",     // cascalho turquesa (conjunto na areia)
  37: "04D",     // pomba madrepérola  ← casamento exato
  38: "09J",     // cordão duplo de pérolas com pingentes
  39: "04B",     // pérolas miúdas por fio
  40: "22I",     // pérolas por fio espaçadas
  41: "05F",     // semijoia com pérola central
  42: "10B",     // longo com pingente pérola
  43: "08E",     // madrepérola salmão
  44: "09F",     // trio de correntes prateadas
  45: "06C",     // coração madrepérola  ← casamento exato
  2: "24D",      // contas verde escuro + pingente (cordão verde)
};

/** Fotos de corpo inteiro/ambiente — viram a camada de marca. */
const MARCA = {
  1: "public/hero/hero-fallback.webp",              // topo do site
  9: "public/hero/hero-fallback-portrait.webp",     // topo no celular (9:16)
  25: "public/banners/banner-meio-fallback.webp",   // faixa do meio
  10: "public/assets/generated/categorias/colares.webp",
  14: "public/assets/generated/categorias/brincos.webp",
  33: "public/assets/generated/categorias/pulseiras.webp",
  34: "public/assets/generated/categorias/conjuntos.webp",
  35: "public/assets/generated/categorias/gargantilhas.webp",
};

async function paraWebp(caminho, { largura = MAX_DIM, altura = null } = {}) {
  let p = sharp(caminho).rotate();
  const meta = await p.metadata();
  if (altura) {
    p = p.resize(largura, altura, { fit: "cover", position: "attention" });
  } else if (Math.max(meta.width, meta.height) > largura) {
    p = p.resize(largura, largura, { fit: "inside", withoutEnlargement: true });
  }
  const buf = await p.webp({ quality: 84 }).toBuffer();
  const m = await sharp(buf).metadata();
  return { buf, width: m.width, height: m.height };
}

// ── 1. limpa TODAS as fotos atuais ──────────────────────────────────────────
const antes = await db.execute("SELECT COUNT(*) c FROM products WHERE fotos != '[]'");
await db.execute({
  sql: "UPDATE products SET fotos = '[]', atualizadoEm = ?",
  args: [new Date().toISOString()],
});
console.log(`fotos antigas removidas de ${antes.rows[0].c} peças.`);

// ── 2. sobe as fotos novas e monta a galeria por código ─────────────────────
const porCodigo = new Map(); // codigo -> [foto,...]
let enviadas = 0;

for (const [numStr, codigo] of Object.entries(MAPA)) {
  const idx = Number(numStr) - 1;
  const caminho = FOTOS[idx];
  if (!caminho) { console.warn(`#${numStr}: arquivo não encontrado`); continue; }

  const { buf, width, height } = await paraWebp(caminho);
  const id = randomUUID();
  await db.execute({
    sql: "INSERT INTO images (id, bytes, mime, width, height, alt, criadoEm) VALUES (?, ?, ?, ?, ?, ?, ?)",
    args: [id, buf, "image/webp", width, height, "", new Date().toISOString()],
  });
  enviadas++;
  const foto = {
    url: `/api/images/${id}`,
    alt: "",
    fonte: "upload-admin",
    width,
    height,
  };
  if (!porCodigo.has(codigo)) porCodigo.set(codigo, []);
  porCodigo.get(codigo).push(foto);
}
console.log(`fotos novas enviadas ao banco: ${enviadas}`);

// ── 3. aplica nas peças (alt = nome da peça) ────────────────────────────────
let pecas = 0;
for (const [codigo, fotos] of porCodigo) {
  const rs = await db.execute({
    sql: "SELECT slug, nome FROM products WHERE codigo = ? LIMIT 1",
    args: [codigo],
  });
  if (!rs.rows.length) { console.warn(`código ${codigo}: peça não encontrada`); continue; }
  const { slug, nome } = rs.rows[0];
  const comAlt = fotos.map((f) => ({ ...f, alt: nome }));
  await db.execute({
    sql: "UPDATE products SET fotos = ?, atualizadoEm = ? WHERE slug = ?",
    args: [JSON.stringify(comAlt), new Date().toISOString(), slug],
  });
  pecas++;
}
console.log(`peças com foto nova: ${pecas}`);

// ── 4. camada de marca (arquivos em /public) ────────────────────────────────
for (const [numStr, destino] of Object.entries(MARCA)) {
  const caminho = FOTOS[Number(numStr) - 1];
  if (!caminho) continue;
  const ehPortrait = destino.includes("portrait");
  const ehCategoria = destino.includes("categorias");
  const opts = ehPortrait
    ? { largura: 1080, altura: 1920 }
    : ehCategoria
      ? { largura: 800, altura: 1000 }
      : { largura: 1920, altura: 1080 };
  const { buf } = await paraWebp(caminho, opts);
  mkdirSync(resolve(destino, ".."), { recursive: true });
  writeFileSync(resolve(destino), buf);
  console.log(`marca: ${destino}`);
}

// ── 5. limpa imagens órfãs (nenhum produto aponta para elas) ────────────────
const usadas = new Set();
const todas = await db.execute("SELECT fotos FROM products");
for (const r of todas.rows) {
  for (const f of JSON.parse(r.fotos || "[]")) {
    const m = /\/api\/images\/([^/?]+)/.exec(f.url || "");
    if (m) usadas.add(m[1]);
  }
}
// settings também podem apontar para imagens (hero/banner enviados pelo admin)
const st = await db.execute("SELECT valor FROM settings");
for (const r of st.rows) {
  for (const m of String(r.valor).matchAll(/\/api\/images\/([a-f0-9-]+)/g)) usadas.add(m[1]);
}
const ids = await db.execute("SELECT id FROM images");
let removidas = 0;
for (const r of ids.rows) {
  if (usadas.has(r.id)) continue;
  await db.execute({ sql: "DELETE FROM images WHERE id = ?", args: [r.id] });
  removidas++;
}
console.log(`imagens órfãs apagadas do banco: ${removidas}`);

const depois = await db.execute("SELECT COUNT(*) c FROM products WHERE ativo = 1 AND fotos != '[]'");
const semFoto = await db.execute("SELECT COUNT(*) c FROM products WHERE ativo = 1 AND fotos = '[]'");
console.log(`\nRESULTADO: ${depois.rows[0].c} peças ativas com foto nova, ${semFoto.rows[0].c} sem foto (mostram a silhueta da marca).`);
