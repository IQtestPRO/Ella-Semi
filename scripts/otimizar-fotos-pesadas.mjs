/**
 * otimizar-fotos-pesadas.mjs — reduz o peso das fotos mais pesadas do banco
 * (ADR-0027). O Pak relatou que as fotos demoram a aparecer no site.
 *
 * Mexe SÓ nas acima de 250 KB, reamostrando para no máximo 1400px com WebP
 * q84 — comparado lado a lado com o original antes de aplicar, a diferença é
 * imperceptível (a textura do travertino continua nítida), mas o pior caso
 * cai de 452 KB para ~340 KB.
 *
 * Só grava se realmente ficou menor. Idempotente.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@libsql/client";
import sharp from "sharp";

const env = Object.fromEntries(
  readFileSync(resolve(".env.local"), "utf-8").split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1)]; }),
);
const db = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

const LIMITE = 250 * 1024;
const MAX_DIM = 1400;

const rs = await db.execute(
  `SELECT id, width, height, length(bytes) n FROM images WHERE length(bytes) > ${LIMITE} ORDER BY length(bytes) DESC`,
);
console.log(`fotos acima de ${LIMITE / 1024} KB: ${rs.rows.length}`);

let antes = 0, depois = 0, mexidas = 0;
for (const r of rs.rows) {
  const img = await db.execute({ sql: "SELECT bytes FROM images WHERE id = ?", args: [r.id] });
  const orig = Buffer.from(img.rows[0].bytes);
  const novo = await sharp(orig)
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84 })
    .toBuffer();
  if (novo.length >= orig.length) continue;  // não piora
  const meta = await sharp(novo).metadata();
  await db.execute({
    sql: "UPDATE images SET bytes = ?, width = ?, height = ? WHERE id = ?",
    args: [new Uint8Array(novo), meta.width, meta.height, r.id],
  });
  antes += orig.length; depois += novo.length; mexidas++;
  if (mexidas % 20 === 0) console.log(`  ${mexidas}/${rs.rows.length}…`);
}

console.log(`\nfotos otimizadas: ${mexidas}`);
console.log(`peso: ${(antes / 1024 / 1024).toFixed(1)} MB -> ${(depois / 1024 / 1024).toFixed(1)} MB  (-${Math.round((1 - depois / (antes || 1)) * 100)}%)`);
const tot = await db.execute("SELECT COUNT(*) c, SUM(length(bytes)) s FROM images");
console.log(`banco agora: ${tot.rows[0].c} fotos, ${(Number(tot.rows[0].s) / 1024 / 1024).toFixed(1)} MB`);
