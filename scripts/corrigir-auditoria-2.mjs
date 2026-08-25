/**
 * corrigir-auditoria-2.mjs — segunda leva de correções da auditoria (ADR-0026).
 *
 * 1. Junta CO324 + EAL 382 "corrente com coração bojudo" (mesma joia, mesmo
 *    preço; o slug real do CO324 não tinha o prefixo do código).
 * 2. Diferencia dois brincos que estavam com o MESMO nome no site — a cliente
 *    não tinha como saber qual era qual: um é de pressão, o outro é argola.
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

// ── 1. junta a duplicata do coração bojudo ──────────────────────────────────
const FICA = "colar-corrente-elos-com-pingente-coracao-eal-382"; // 3 fotos
const SAI = "colar-corrente-e-pingente-coracao-324";             // 1 foto

const rs = await db.execute({
  sql: "SELECT slug, nome, codigo, precoCents, fotos, ativo FROM products WHERE slug IN (?, ?)",
  args: [FICA, SAI],
});
const fica = rs.rows.find((r) => r.slug === FICA);
const sai = rs.rows.find((r) => r.slug === SAI);

if (fica && sai && Number(sai.ativo) === 1) {
  if (Number(fica.precoCents) !== Number(sai.precoCents)) {
    console.log("preços diferentes — não junto sem o Pak decidir");
  } else {
    const vistos = new Set();
    const galeria = [];
    for (const r of [fica, sai]) {
      for (const f of JSON.parse(r.fotos || "[]")) {
        const m = /\/api\/images\/([^/?]+)/.exec(f.url || "");
        if (m && vistos.has(m[1])) continue;
        if (m) vistos.add(m[1]);
        galeria.push({ ...f, alt: fica.nome });
      }
    }
    await db.execute({
      sql: "UPDATE products SET fotos = ?, atualizadoEm = ? WHERE slug = ?",
      args: [JSON.stringify(galeria), agora, FICA],
    });
    await db.execute({
      sql: "UPDATE products SET ativo = 0, atualizadoEm = ? WHERE slug = ?",
      args: [agora, SAI],
    });
    console.log(`coração bojudo: fica ${fica.codigo} com ${galeria.length} fotos | sai ${sai.codigo}`);
  }
} else {
  console.log("coração bojudo: já resolvido");
}

// ── 2. nomes iguais em brincos diferentes ───────────────────────────────────
const RENOMEAR = [
  { slug: "brinco-semijoia-cravejado-quadrado-epk-13980", nome: "Brinco semijoia quadrado cravejado (de pressão)" },
  { slug: "brinco-semijoia-cravejado-quadrado-epk-15828", nome: "Brinco semijoia argola quadrada cravejada" },
];
for (const r of RENOMEAR) {
  const res = await db.execute({
    sql: "UPDATE products SET nome = ?, descricao = ?, atualizadoEm = ? WHERE slug = ? AND ativo = 1",
    args: [r.nome, r.nome, agora, r.slug],
  });
  console.log(`renomeado: ${r.slug} -> "${r.nome}" (${res.rowsAffected} linha)`);
}

const total = await db.execute("SELECT COUNT(*) n FROM products WHERE ativo = 1");
console.log(`\npeças no ar: ${total.rows[0].n}`);
