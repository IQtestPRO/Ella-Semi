/**
 * limpar-descricoes.mjs — tira o nome próprio e os travessões das descrições
 * das peças (ADR-0028).
 *
 * A descrição vai para a página da peça e para o Google, e 27 peças diziam
 * "Atendimento e pedido direto com a Ellen pelo WhatsApp" — justamente o que a
 * Ellen pediu para sair. O travessão também some: no celular ele quebra a
 * linha deixando um traço sozinho.
 *
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
const agora = new Date().toISOString();

function limpar(t) {
  return String(t)
    .replace(/Atendimento e pedido direto com a Ellen pelo WhatsApp\./g,
             "Atendimento e pedido direto pelo WhatsApp.")
    .replace(/\bcom a Ellen\b/g, "pelo WhatsApp")
    .replace(/\bpela Ellen\b/g, "pelo WhatsApp")
    .replace(/\bA Ellen\b/g, "Nossa equipe")
    .replace(/\s+—\s+/g, ", ")   // travessão no meio da frase
    .replace(/\s*—\s*/g, " ")     // sobra de travessão
    .replace(/\s{2,}/g, " ")
    .replace(/,\s*,/g, ",")
    .trim();
}

const rs = await db.execute(
  "SELECT slug, descricao FROM products WHERE descricao LIKE '%Ellen%' OR descricao LIKE '%—%'",
);
console.log(`peças com descrição a limpar: ${rs.rows.length}`);

let n = 0;
for (const r of rs.rows) {
  const nova = limpar(r.descricao);
  if (nova === r.descricao) continue;
  await db.execute({
    sql: "UPDATE products SET descricao = ?, atualizadoEm = ? WHERE slug = ?",
    args: [nova, agora, r.slug],
  });
  if (n < 3) console.log(`  ${r.slug}\n    -> ${nova}`);
  n++;
}
console.log(`\ndescrições ajustadas: ${n}`);

const resta = await db.execute(
  "SELECT COUNT(*) c FROM products WHERE ativo=1 AND (descricao LIKE '%Ellen%' OR descricao LIKE '%—%')",
);
console.log(`peças no ar ainda com nome/travessão: ${resta.rows[0].c}`);
