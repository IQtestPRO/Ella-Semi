/**
 * aplicar-pedidos-ellen-2.mjs — segunda rodada de pedidos da Ellen (ADR-0029):
 *   "Tirar o traço"                         -> travessão no texto da vitrine
 *   "Trocar essa parte"                     -> 3º parágrafo do Sobre
 *   "Tirar 'do café da manhã ao jantar'"    -> "em qualquer ocasião"
 *   "Semijoias com garantia"                -> era "com banho que dura"
 * Espelha os defaults de lib/settings. Idempotente.
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

// ── Sobre ───────────────────────────────────────────────────────────────────
const atualSobre = JSON.parse(
  (await db.execute("SELECT valor FROM settings WHERE chave='sobre'")).rows[0].valor,
);
const sobre = {
  ...atualSobre,
  paragrafos: [
    "A ELLA nasceu em 1998, criando peças exclusivas e feitas à mão. Com o tempo, a loja cresceu para as semijoias, sempre com materiais de qualidade e o mesmo cuidado do primeiro dia.",
    "Nossa missão é embelezar e elevar a autoestima de mulheres que merecem o melhor dos acessórios. Semijoias com garantia, design contemporâneo e peças para acompanhar você em qualquer ocasião.",
    "Você escolhe a peça e, pelo WhatsApp, tem um atendimento personalizado com uma de nossas atendentes, sempre atenciosas e prontas para te ajudar.",
  ],
};
await db.execute({
  sql: `INSERT INTO settings (chave, valor, atualizadoEm) VALUES ('sobre', ?, ?)
        ON CONFLICT(chave) DO UPDATE SET valor=excluded.valor, atualizadoEm=excluded.atualizadoEm`,
  args: [JSON.stringify(sobre), agora],
});
console.log("sobre gravado:");
for (const p of sobre.paragrafos) console.log("  - " + p.slice(0, 76) + "…");

// ── Vitrine: tirar o travessão do texto ─────────────────────────────────────
const c = await db.execute("SELECT manifesto FROM campanha WHERE id = 1");
if (c.rows.length) {
  const antes = String(c.rows[0].manifesto);
  const depois = antes
    .replace(/\s+—\s+/g, ": ")
    .replace(/\s*—\s*/g, " ")
    .replace(/\s{2,}/g, " ")
    .trim();
  if (antes !== depois) {
    await db.execute({
      sql: "UPDATE campanha SET manifesto = ?, atualizadoEm = ? WHERE id = 1",
      args: [depois, agora],
    });
    console.log("\nvitrine (traço removido):\n  " + depois);
  } else {
    console.log("\nvitrine: já estava sem travessão");
  }
}

// ── conferência final ───────────────────────────────────────────────────────
let sujo = 0;
for (const r of (await db.execute("SELECT chave, valor FROM settings")).rows) {
  if (/—/.test(String(r.valor))) { console.log(`  ATENÇÃO: ${r.chave} ainda tem travessão`); sujo++; }
}
const cm = await db.execute("SELECT manifesto FROM campanha WHERE id=1");
if (cm.rows.length && /—/.test(String(cm.rows[0].manifesto))) { console.log("  ATENÇÃO: vitrine ainda tem travessão"); sujo++; }
console.log(sujo === 0 ? "\nsem travessão em nenhum texto do site." : `\n${sujo} pendência(s)`);
