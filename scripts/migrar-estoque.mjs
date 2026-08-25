/**
 * migrar-estoque.mjs — adiciona a coluna `estoque` na tabela products (ADR-0025).
 *
 * NULL = sem controle de estoque (vende à vontade), que é como todas as peças
 * existentes começam. A Ellen preenche peça a peça no /admin quando quiser
 * controlar. Idempotente: rodar de novo não faz nada.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@libsql/client";

const env = Object.fromEntries(
  readFileSync(resolve(".env.local"), "utf-8").split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1)]; }),
);
const db = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

const cols = await db.execute("PRAGMA table_info(products)");
const jaTem = cols.rows.some((r) => r.name === "estoque");

if (jaTem) {
  console.log("coluna `estoque` já existe — nada a fazer.");
} else {
  await db.execute("ALTER TABLE products ADD COLUMN estoque INTEGER");
  console.log("coluna `estoque` criada (NULL = sem controle).");
}

const total = await db.execute("SELECT COUNT(*) c FROM products");
const comControle = await db.execute("SELECT COUNT(*) c FROM products WHERE estoque IS NOT NULL");
console.log(`peças no banco: ${total.rows[0].c} | com estoque definido: ${comControle.rows[0].c}`);
