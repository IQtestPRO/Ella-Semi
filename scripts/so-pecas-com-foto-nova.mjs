/**
 * so-pecas-com-foto-nova.mjs — decisão do Pak (2026-08-17):
 * "Tudo que tiver sem foto, retire do site. Vai ter apenas os produtos das
 *  imagens que eu coloquei."
 *
 * Tira do ar (ativo = 0) toda peça sem foto e deixa o catálogo só com as que
 * têm foto nova. Também limpa as seções da home que poderiam apontar para
 * peça que saiu do ar (vitrine de destaque e "mais vendidos").
 *
 * Não apaga nada: a peça continua no banco e volta ligando "Aparecer no site"
 * no /admin (ou re-rodando com FOTOS novas).
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

// ── 1. fora do ar tudo que não tem foto ─────────────────────────────────────
const semFoto = await db.execute("SELECT COUNT(*) c FROM products WHERE ativo = 1 AND fotos = '[]'");
await db.execute({
  sql: "UPDATE products SET ativo = 0, atualizadoEm = ? WHERE fotos = '[]'",
  args: [agora],
});
console.log(`peças tiradas do site (sem foto): ${semFoto.rows[0].c}`);

// garante que toda peça COM foto está no ar
await db.execute({
  sql: "UPDATE products SET ativo = 1, atualizadoEm = ? WHERE fotos != '[]'",
  args: [agora],
});

const vivos = await db.execute(
  "SELECT slug, nome, categoria, maisVendido FROM products WHERE ativo = 1 ORDER BY categoria, nome",
);
console.log(`peças no site agora: ${vivos.rows.length}`);

// ── 2. vitrine de destaque só com peças que estão no ar ─────────────────────
const slugsVivos = new Set(vivos.rows.map((r) => r.slug));
const camp = await db.execute("SELECT produtosDestaqueSlugs FROM campanha WHERE id = 1");
if (camp.rows.length) {
  const atuais = JSON.parse(camp.rows[0].produtosDestaqueSlugs || "[]");
  let escolhidos = atuais.filter((s) => slugsVivos.has(s));
  // completa até 8 com peças que estão no ar, sem repetir
  for (const r of vivos.rows) {
    if (escolhidos.length >= 8) break;
    if (!escolhidos.includes(r.slug)) escolhidos.push(r.slug);
  }
  await db.execute({
    sql: "UPDATE campanha SET produtosDestaqueSlugs = ?, atualizadoEm = ? WHERE id = 1",
    args: [JSON.stringify(escolhidos), agora],
  });
  console.log(`vitrine de destaque: ${atuais.length} -> ${escolhidos.length} peças (todas no ar)`);
}

// ── 3. "mais vendidos" da home precisa ter peça no ar ───────────────────────
const mv = vivos.rows.filter((r) => r.maisVendido).length;
if (mv < 4) {
  const alvo = vivos.rows.slice(0, 8).map((r) => r.slug);
  for (const slug of alvo) {
    await db.execute({
      sql: "UPDATE products SET maisVendido = 1, atualizadoEm = ? WHERE slug = ?",
      args: [agora, slug],
    });
  }
  console.log(`"mais vendidos": ${mv} -> ${alvo.length} peças`);
} else {
  console.log(`"mais vendidos": ${mv} peças (ok)`);
}

// ── 4. relatório por categoria ──────────────────────────────────────────────
const porCat = {};
for (const r of vivos.rows) porCat[r.categoria] = (porCat[r.categoria] || 0) + 1;
console.log("\nCATEGORIAS NO SITE:");
for (const [c, n] of Object.entries(porCat).sort()) console.log(`  ${c.padEnd(16)} ${n}`);
const vazias = ["brincos", "colares", "pulseiras", "aneis", "conjuntos", "gargantilhas", "tornozeleiras", "piercings", "outros"]
  .filter((c) => !porCat[c]);
console.log("\nCATEGORIAS VAZIAS (somem do menu):", vazias.join(", ") || "nenhuma");
