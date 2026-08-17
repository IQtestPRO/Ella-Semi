/**
 * O texto da vitrine prometia "colares, brincos, pulseiras e conjuntos", mas
 * brincos e pulseiras saíram do ar (só ficam peças com foto). Ajusta a frase
 * para o que a cliente realmente encontra.
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

const rs = await db.execute("SELECT manifesto FROM campanha WHERE id = 1");
if (!rs.rows.length) { console.log("sem campanha"); process.exit(0); }

const antes = rs.rows[0].manifesto;
const depois = antes
  .replace(/colares,\s*brincos,\s*pulseiras\s*e\s*conjuntos/gi, "colares, chokers e conjuntos")
  .replace(/brincos,\s*pulseiras\s*e\s*conjuntos/gi, "chokers e conjuntos");

if (antes === depois) {
  console.log("nada a mudar. texto atual:\n" + antes);
} else {
  await db.execute({
    sql: "UPDATE campanha SET manifesto = ?, atualizadoEm = ? WHERE id = 1",
    args: [depois, new Date().toISOString()],
  });
  console.log("ANTES : " + antes);
  console.log("DEPOIS: " + depois);
}
