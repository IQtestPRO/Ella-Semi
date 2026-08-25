/**
 * fundir-chokers-em-colares.mjs — decisão do Pak (25/08/2026):
 * "Junte os colares com chokers e deixe somente colares."
 *
 * Move toda peça de `gargantilhas` para `colares`. O nome da peça continua
 * dizendo "Choker" (é o nome do produto), mas o site passa a ter uma seção só.
 * O enum `gargantilhas` permanece no schema por compatibilidade histórica.
 * Idempotente.
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

const antes = await db.execute(
  "SELECT slug, nome, ativo FROM products WHERE categoria = 'gargantilhas'",
);
if (antes.rows.length === 0) {
  console.log("nenhuma peça em gargantilhas — nada a fazer.");
} else {
  console.log(`movendo ${antes.rows.length} peça(s) para colares:`);
  for (const r of antes.rows) {
    console.log(`  ${r.ativo ? "[no ar]  " : "[oculta] "} ${r.nome}`);
  }
  await db.execute({
    sql: "UPDATE products SET categoria = 'colares', atualizadoEm = ? WHERE categoria = 'gargantilhas'",
    args: [new Date().toISOString()],
  });
}

const cont = await db.execute(
  "SELECT categoria, COUNT(*) n FROM products WHERE ativo = 1 GROUP BY categoria ORDER BY categoria",
);
console.log("\nCATEGORIAS NO AR:");
for (const r of cont.rows) console.log(`  ${String(r.categoria).padEnd(14)} ${r.n}`);
