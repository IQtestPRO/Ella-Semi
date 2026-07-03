/**
 * seed-db.mjs — cria o schema no Turso e importa o catálogo inicial.
 *
 * Uso:
 *   node scripts/seed-db.mjs           # cria tabelas; importa produtos/campanha SÓ se vazias
 *   node scripts/seed-db.mjs --force   # re-importa produtos/campanha do JSON (sobrescreve!)
 *
 * As `settings` NÃO são semeadas aqui de propósito: `lib/settings` cai nos
 * defaults quando a chave falta, então o site funciona sem elas e a primeira
 * edição no /admin persiste o valor. Produtos/campanha são semeados do JSON
 * legado (`data/*.json`) uma única vez (ADR-0021).
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@libsql/client";

const FORCE = process.argv.includes("--force");

// ── env (.env.local, parse manual — script standalone fora do Next) ─────────
function loadEnv() {
  try {
    const raw = readFileSync(resolve(".env.local"), "utf-8");
    for (const line of raw.split(/\r?\n/)) {
      if (!line || line.startsWith("#") || !line.includes("=")) continue;
      const i = line.indexOf("=");
      const k = line.slice(0, i).trim();
      const v = line.slice(i + 1).trim();
      if (!(k in process.env)) process.env[k] = v;
    }
  } catch {
    // sem .env.local — confia nas env vars do ambiente (ex.: CI/Vercel)
  }
}
loadEnv();

const url = process.env.TURSO_DATABASE_URL;
const authToken = process.env.TURSO_AUTH_TOKEN;
if (!url) {
  console.error("✗ TURSO_DATABASE_URL não definido (.env.local ou env vars).");
  process.exit(1);
}

const db = createClient({ url, authToken });

const bool = (v) => (v ? 1 : 0);
const jsonOrNull = (v) =>
  v === undefined || v === null ? null : JSON.stringify(v);

async function createSchema() {
  await db.batch(
    [
      `CREATE TABLE IF NOT EXISTS products (
        slug TEXT PRIMARY KEY,
        nome TEXT NOT NULL,
        categoria TEXT NOT NULL,
        banho TEXT NOT NULL,
        tipo TEXT NOT NULL,
        precoCents INTEGER NOT NULL,
        precoPromocionalCents INTEGER,
        descricao TEXT NOT NULL,
        fotos TEXT NOT NULL DEFAULT '[]',
        variantes TEXT,
        tags TEXT,
        promocao INTEGER NOT NULL DEFAULT 0,
        tipoFulfillment TEXT NOT NULL DEFAULT 'pronta-entrega',
        destaqueHome INTEGER NOT NULL DEFAULT 0,
        maisVendido INTEGER NOT NULL DEFAULT 0,
        ativo INTEGER NOT NULL DEFAULT 1,
        origem TEXT,
        fonteFotoFraca INTEGER,
        cadastradoEm TEXT NOT NULL,
        atualizadoEm TEXT NOT NULL,
        ordem INTEGER NOT NULL DEFAULT 0
      )`,
      `CREATE INDEX IF NOT EXISTS idx_products_categoria ON products (categoria)`,
      `CREATE INDEX IF NOT EXISTS idx_products_ativo ON products (ativo)`,
      `CREATE TABLE IF NOT EXISTS campanha (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        slug TEXT NOT NULL,
        nomeExibicao TEXT NOT NULL,
        manifesto TEXT NOT NULL,
        heroVideo TEXT,
        heroImagem TEXT,
        ctaTexto TEXT NOT NULL,
        produtosDestaqueSlugs TEXT NOT NULL DEFAULT '[]',
        ativa INTEGER NOT NULL DEFAULT 1,
        atualizadoEm TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS settings (
        chave TEXT PRIMARY KEY,
        valor TEXT NOT NULL,
        atualizadoEm TEXT NOT NULL
      )`,
      `CREATE TABLE IF NOT EXISTS images (
        id TEXT PRIMARY KEY,
        mime TEXT NOT NULL,
        bytes BLOB NOT NULL,
        width INTEGER NOT NULL,
        height INTEGER NOT NULL,
        alt TEXT NOT NULL DEFAULT '',
        criadoEm TEXT NOT NULL
      )`,
    ],
    "write",
  );
  console.log("✓ schema criado/verificado (products, campanha, settings, images)");
}

async function seedProducts() {
  const countRs = await db.execute("SELECT COUNT(*) AS n FROM products");
  const n = Number(countRs.rows[0].n);
  if (n > 0 && !FORCE) {
    console.log(`• products já tem ${n} linhas — pulando (use --force p/ reimportar)`);
    return;
  }

  const raw = readFileSync(resolve("data/products.json"), "utf-8");
  const products = JSON.parse(raw);
  if (!Array.isArray(products)) throw new Error("products.json não é array");

  const stmts = products.map((p, idx) => ({
    sql: `INSERT INTO products
      (slug, nome, categoria, banho, tipo, precoCents, precoPromocionalCents, descricao,
       fotos, variantes, tags, promocao, tipoFulfillment, destaqueHome, maisVendido,
       ativo, origem, fonteFotoFraca, cadastradoEm, atualizadoEm, ordem)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(slug) DO UPDATE SET
        nome=excluded.nome, categoria=excluded.categoria, banho=excluded.banho, tipo=excluded.tipo,
        precoCents=excluded.precoCents, precoPromocionalCents=excluded.precoPromocionalCents,
        descricao=excluded.descricao, fotos=excluded.fotos, variantes=excluded.variantes,
        tags=excluded.tags, promocao=excluded.promocao, tipoFulfillment=excluded.tipoFulfillment,
        destaqueHome=excluded.destaqueHome, maisVendido=excluded.maisVendido, ativo=excluded.ativo,
        origem=excluded.origem, fonteFotoFraca=excluded.fonteFotoFraca,
        atualizadoEm=excluded.atualizadoEm, ordem=excluded.ordem`,
    args: [
      p.slug,
      p.nome,
      p.categoria,
      p.banho,
      p.tipo,
      p.precoCents,
      p.precoPromocionalCents ?? null,
      p.descricao,
      JSON.stringify(p.fotos ?? []),
      jsonOrNull(p.variantes),
      jsonOrNull(p.tags),
      bool(p.promocao),
      p.tipoFulfillment ?? "pronta-entrega",
      bool(p.destaqueHome),
      bool(p.maisVendido),
      bool(p.ativo),
      jsonOrNull(p.origem),
      p.fonteFotoFraca === undefined ? null : bool(p.fonteFotoFraca),
      p.cadastradoEm,
      p.atualizadoEm,
      idx,
    ],
  }));

  await db.batch(stmts, "write");
  console.log(`✓ ${products.length} produtos importados`);
}

async function seedCampanha() {
  const countRs = await db.execute("SELECT COUNT(*) AS n FROM campanha");
  const n = Number(countRs.rows[0].n);
  if (n > 0 && !FORCE) {
    console.log("• campanha já existe — pulando (use --force p/ reimportar)");
    return;
  }

  const raw = readFileSync(resolve("data/campanha-atual.json"), "utf-8");
  const c = JSON.parse(raw);

  await db.execute({
    sql: `INSERT INTO campanha
      (id, slug, nomeExibicao, manifesto, heroVideo, heroImagem, ctaTexto, produtosDestaqueSlugs, ativa, atualizadoEm)
      VALUES (1,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET
        slug=excluded.slug, nomeExibicao=excluded.nomeExibicao, manifesto=excluded.manifesto,
        heroVideo=excluded.heroVideo, heroImagem=excluded.heroImagem, ctaTexto=excluded.ctaTexto,
        produtosDestaqueSlugs=excluded.produtosDestaqueSlugs, ativa=excluded.ativa, atualizadoEm=excluded.atualizadoEm`,
    args: [
      c.slug,
      c.nomeExibicao,
      c.manifesto,
      c.heroVideo ?? null,
      c.heroImagem ?? null,
      c.ctaTexto,
      JSON.stringify(c.produtosDestaqueSlugs ?? []),
      bool(c.ativa),
      c.atualizadoEm,
    ],
  });
  console.log("✓ campanha importada");
}

async function main() {
  console.log(`→ Turso: ${url.replace(/\/\/.*@/, "//")}`);
  await createSchema();
  await seedProducts();
  await seedCampanha();
  console.log("✓ seed concluído");
  process.exit(0);
}

main().catch((e) => {
  console.error("✗ seed falhou:", e);
  process.exit(1);
});
