/**
 * migrar-garantia.mjs — coluna `temGarantia` na tabela products (ADR-0027).
 * NULL = a Ellen não decidiu; o site aplica a regra da casa (semijoia tem,
 * bijuteria não). Idempotente.
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
const existe = cols.rows.some((r) => r.name === "temGarantia");
if (existe) {
  console.log("coluna temGarantia já existe");
} else {
  await db.execute("ALTER TABLE products ADD COLUMN temGarantia INTEGER");
  console.log("coluna temGarantia criada");
}

const n = await db.execute(
  "SELECT COUNT(*) c FROM products WHERE ativo = 1 AND temGarantia IS NULL",
);
const porTipo = await db.execute(
  "SELECT tipo, COUNT(*) c FROM products WHERE ativo = 1 GROUP BY tipo",
);
console.log(`peças no ar sem decisão explícita: ${n.rows[0].c} (seguem a regra da casa)`);
for (const r of porTipo.rows) console.log(`  ${r.tipo}: ${r.c}`);
