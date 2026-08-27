/** Ajusta o 3º parágrafo do Sobre para a forma que a Ellen escreveu (ADR-0029). */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@libsql/client";
const env = Object.fromEntries(
  readFileSync(resolve(".env.local"), "utf-8").split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1)]; }),
);
const db = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });
const rs = await db.execute("SELECT valor FROM settings WHERE chave='sobre'");
const sobre = JSON.parse(rs.rows[0].valor);
sobre.paragrafos = sobre.paragrafos.map((p) =>
  p.replace(
    "com uma de nossas atendentes, sempre atenciosas e prontas para te ajudar.",
    "com um de nossos atendentes, sempre atenciosos e prontos para te ajudar.",
  ),
);
await db.execute({
  sql: "UPDATE settings SET valor = ?, atualizadoEm = ? WHERE chave = 'sobre'",
  args: [JSON.stringify(sobre), new Date().toISOString()],
});
console.log("3º parágrafo agora:\n  " + sobre.paragrafos[2]);
