/**
 * atualizar-campanha-summer-glow.mjs — troca a Campanha Atual do site de
 * "Outono 2026" para a coleção do catálogo novo (SUMMER GLOW · Primavera 2027)
 * e aponta os destaques para peças reais dessa coleção.
 *
 * Roda `--dry` para só inspecionar (não escreve).
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@libsql/client";

const DRY = process.argv.includes("--dry");

const env = Object.fromEntries(
  readFileSync(resolve(".env.local"), "utf-8").split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1)]; }),
);
const db = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

// ── inspeção ───────────────────────────────────────────────────────────────
const schema = await db.execute("SELECT sql FROM sqlite_master WHERE name = 'campanha'");
console.log("── schema campanha ──\n" + schema.rows[0].sql + "\n");

const atual = await db.execute("SELECT * FROM campanha WHERE id = 1");
console.log("── campanha atual ──\n" + JSON.stringify(atual.rows[0], null, 1) + "\n");

const cats = await db.execute(
  "SELECT categoria, COUNT(1) AS n FROM products WHERE ativo = 1 GROUP BY categoria ORDER BY n DESC",
);
console.log("── produtos ativos por categoria ──");
for (const r of cats.rows) console.log(`   ${String(r.categoria).padEnd(14)} ${r.n}`);
const total = await db.execute("SELECT COUNT(1) AS n FROM products WHERE ativo = 1");
console.log(`   ${"TOTAL".padEnd(14)} ${total.rows[0].n}\n`);

// ── destaques: peças do Summer Glow com foto dedicada e apelo de vitrine ───
const DESTAQUES = [
  "conjunto-coracao-bojudo-05g",
  "colar-elos-retangulares-13c",
  "conjunto-riviera-coracoes-15c",
  "brinco-gota-lisa-04a",
  "colar-cascalho-turquesa-21a",
  "colar-buzios-com-medalhas-08a",
  "colar-pingente-espiral-cravejado-19a",
  "argola-lisa-media-06b",
];

const check = await db.execute({
  sql: `SELECT slug, nome, ativo FROM products WHERE slug IN (${DESTAQUES.map(() => "?").join(",")})`,
  args: DESTAQUES,
});
const achados = new Set(check.rows.map((r) => r.slug));
const faltando = DESTAQUES.filter((s) => !achados.has(s));
console.log("── destaques ──");
for (const r of check.rows) console.log(`   ✓ ${r.slug} (ativo=${r.ativo})`);
if (faltando.length) {
  console.error(`   ✗ NÃO ENCONTRADOS: ${faltando.join(", ")}`);
  process.exit(1);
}

if (DRY) {
  console.log("\n(dry-run — nada foi escrito)");
  process.exit(0);
}

// ── escrita ────────────────────────────────────────────────────────────────
const now = new Date().toISOString();
await db.execute({
  sql: `UPDATE campanha SET
          slug = ?, nomeExibicao = ?, manifesto = ?, ctaTexto = ?,
          produtosDestaqueSlugs = ?, ativa = 1, atualizadoEm = ?
        WHERE id = 1`,
  args: [
    "summer-glow-2027",
    "Summer Glow",
    "A coleção SUMMER GLOW chegou trazendo a energia dos dias ensolarados e o brilho de quem vive cada momento com elegância. São peças pensadas para o dia a dia e para os momentos especiais — colares, brincos, pulseiras e conjuntos que combinam entre si e acompanham você do sol ao pôr do sol.",
    "Ver as peças da coleção",
    JSON.stringify(DESTAQUES),
    now,
  ],
});
console.log("\n✓ campanha atualizada para SUMMER GLOW · Primavera 2027");

// hero: subtítulo da primeira tela
const hero = await db.execute("SELECT valor FROM settings WHERE chave = 'hero'");
const heroVal = hero.rows[0] ? JSON.parse(hero.rows[0].valor) : {};
const novoHero = {
  subtitulo: "summer glow · primavera 2027",
  videoUrl: heroVal.videoUrl ?? "/hero/hero-loop.mp4",
  fallbackUrl: heroVal.fallbackUrl ?? "/hero/hero-fallback.webp",
};
await db.execute({
  sql: `INSERT INTO settings (chave, valor, atualizadoEm) VALUES (?,?,?)
        ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor, atualizadoEm = excluded.atualizadoEm`,
  args: ["hero", JSON.stringify(novoHero), now],
});
console.log("✓ hero.subtitulo → \"summer glow · primavera 2027\"");
process.exit(0);
