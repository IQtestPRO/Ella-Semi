/**
 * O rodapé lista categorias vindas das settings (editáveis no /admin). Como o
 * site passou a mostrar só as peças com foto, categorias vazias viravam link
 * para página sem nada. Aqui a coluna "Categorias" é reescrita com o que
 * realmente está no ar.
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

const LABEL = {
  colares: "Colares", brincos: "Brincos", pulseiras: "Pulseiras",
  gargantilhas: "Chokers", conjuntos: "Conjuntos", aneis: "Anéis",
  tornozeleiras: "Tornozeleiras", piercings: "Piercings", outros: "Outros",
};
const ORDEM = ["colares", "brincos", "pulseiras", "gargantilhas", "conjuntos", "aneis", "tornozeleiras", "piercings", "outros"];

const rs = await db.execute("SELECT categoria, COUNT(*) n FROM products WHERE ativo = 1 GROUP BY categoria");
const vivas = new Map(rs.rows.map((r) => [r.categoria, Number(r.n)]));

const st = await db.execute("SELECT valor FROM settings WHERE chave = 'footer'");
if (!st.rows.length) { console.log("footer não está nas settings — nada a fazer"); process.exit(0); }
const footer = JSON.parse(st.rows[0].valor);

const links = ORDEM.filter((c) => vivas.get(c)).map((c) => ({
  label: LABEL[c], href: `/${c}`, external: false,
}));

footer.colunas = footer.colunas.map((col) =>
  col.heading === "Categorias" ? { ...col, links } : col,
);

await db.execute({
  sql: `INSERT INTO settings (chave, valor, atualizadoEm) VALUES ('footer', ?, ?)
        ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor, atualizadoEm = excluded.atualizadoEm`,
  args: [JSON.stringify(footer), new Date().toISOString()],
});
console.log("rodapé -> categorias:", links.map((l) => l.label).join(", ") || "(nenhuma)");
