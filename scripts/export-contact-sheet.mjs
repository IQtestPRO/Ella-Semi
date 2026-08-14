/**
 * export-contact-sheet.mjs — monta um mosaico (contact sheet) dos produtos
 * ATIVOS do site, cada miniatura rotulada com código + categoria, para
 * comparação visual contra um catálogo novo (evitar cadastrar peça duplicada).
 *
 * Saída: <OUT>/contact-sheet-N.webp  +  <OUT>/indice.json
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, join } from "node:path";
import sharp from "sharp";
import { createClient } from "@libsql/client";

const OUT = process.argv[2] ?? ".scratch/contact";
mkdirSync(OUT, { recursive: true });

const env = Object.fromEntries(
  readFileSync(resolve(".env.local"), "utf-8").split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1)]; }),
);
const db = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

// argv[3] opcional: filtra por tag (ex.: "summer-glow") para conferir só um lote
const TAG = process.argv[3];
const rs = await db.execute(
  TAG
    ? {
        sql: "SELECT slug, nome, categoria, codigo, precoCents, fotos FROM products WHERE ativo = 1 AND tags LIKE ? ORDER BY codigo",
        args: [`%"${TAG}"%`],
      }
    : "SELECT slug, nome, categoria, codigo, precoCents, fotos FROM products WHERE ativo = 1 ORDER BY categoria, codigo",
);
console.log(`produtos ativos${TAG ? ` (tag ${TAG})` : ""}: ${rs.rows.length}`);

const CELL = 300;      // lado da miniatura
const LABEL = 46;      // faixa de texto
const COLS = 7;
const PER_SHEET = 42;  // 7x6 por folha

async function bytesDaFoto(url) {
  const m = /^\/api\/images\/([A-Za-z0-9_-]+)$/.exec(url ?? "");
  if (m) {
    const r = await db.execute({ sql: "SELECT bytes FROM images WHERE id = ?", args: [m[1]] });
    const b = r.rows[0]?.bytes;
    return b ? Buffer.from(b) : null;
  }
  return null; // asset estático: ignorado no mosaico
}

const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

const itens = [];
for (const row of rs.rows) {
  const fotos = JSON.parse(row.fotos ?? "[]");
  itens.push({
    slug: row.slug, nome: row.nome, categoria: row.categoria,
    codigo: row.codigo ?? "", precoCents: row.precoCents,
    url: fotos[0]?.url ?? null,
  });
}
writeFileSync(join(OUT, "indice.json"), JSON.stringify(itens, null, 1), "utf-8");

let sheet = 0;
for (let ini = 0; ini < itens.length; ini += PER_SHEET) {
  const lote = itens.slice(ini, ini + PER_SHEET);
  const linhas = Math.ceil(lote.length / COLS);
  const W = COLS * CELL;
  const H = linhas * (CELL + LABEL);

  const composites = [];
  for (let i = 0; i < lote.length; i++) {
    const it = lote[i];
    const x = (i % COLS) * CELL;
    const y = Math.floor(i / COLS) * (CELL + LABEL);

    const raw = it.url ? await bytesDaFoto(it.url) : null;
    if (raw) {
      const thumb = await sharp(raw).resize(CELL, CELL, { fit: "cover" }).png().toBuffer();
      composites.push({ input: thumb, left: x, top: y });
    } else {
      const vazio = await sharp({
        create: { width: CELL, height: CELL, channels: 3, background: "#EFE3DA" },
      }).png().toBuffer();
      composites.push({ input: vazio, left: x, top: y });
    }

    const preco = (it.precoCents / 100).toFixed(2).replace(".", ",");
    const svg = `<svg width="${CELL}" height="${LABEL}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${CELL}" height="${LABEL}" fill="#251008"/>
      <text x="6" y="19" font-family="Arial" font-size="17" font-weight="bold" fill="#FFD9CC">${esc(it.codigo || "—")} · ${esc(it.categoria)}</text>
      <text x="6" y="39" font-family="Arial" font-size="15" fill="#FFF1ED">R$ ${preco} ${esc(it.nome.slice(0, 30))}</text>
    </svg>`;
    composites.push({ input: Buffer.from(svg), left: x, top: y + CELL });
  }

  sheet += 1;
  const nome = join(OUT, `contact-sheet-${sheet}.webp`);
  await sharp({ create: { width: W, height: H, channels: 3, background: "#FFFFFF" } })
    .composite(composites)
    .webp({ quality: 88 })
    .toFile(nome);
  console.log(`  ✓ ${nome}  (${lote.length} peças)`);
}
console.log("pronto.");
