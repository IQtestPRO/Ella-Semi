/**
 * classificar-mixes.mjs — dá conteúdo à categoria Mixes (ADR-0029).
 *
 * O Pak pediu a seção Mixes entre Conjuntos e Todas as peças. O menu só mostra
 * categoria que tem peça (senão a cliente toca e cai em página vazia), então a
 * seção precisa de peças de verdade.
 *
 * Entram as peças que JÁ SÃO combinação — trio, duo, dupla: são vendidas como
 * um conjunto de peças para usar juntas, que é exatamente o que "mix" quer
 * dizer na loja. Nenhuma peça avulsa é tocada.
 *
 * Idempotente. Para desfazer, basta reeditar a categoria no /admin.
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
const agora = new Date().toISOString();

const rs = await db.execute(`
  SELECT slug, codigo, nome, categoria FROM products
  WHERE ativo = 1 AND categoria != 'mixes'
    AND (nome LIKE 'Trio %' OR nome LIKE '%duo%' OR nome LIKE '%dupla%')
`);

console.log(`peças que são combinação: ${rs.rows.length}\n`);
for (const r of rs.rows) {
  await db.execute({
    sql: "UPDATE products SET categoria = 'mixes', atualizadoEm = ? WHERE slug = ?",
    args: [agora, r.slug],
  });
  console.log(`  ${String(r.codigo).padEnd(11)} ${r.nome.slice(0, 46).padEnd(48)} ${r.categoria} -> mixes`);
}

const porCat = await db.execute(
  "SELECT categoria, COUNT(*) n FROM products WHERE ativo = 1 GROUP BY categoria ORDER BY n DESC",
);
console.log("\nCATEGORIAS NO SITE:");
for (const r of porCat.rows) console.log(`  ${String(r.categoria).padEnd(14)} ${r.n}`);
