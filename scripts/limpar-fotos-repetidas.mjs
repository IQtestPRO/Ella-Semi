/**
 * limpar-fotos-repetidas.mjs — tira da galeria a MESMA foto repetida.
 *
 * O Pak notou na "Pulseira fina com pingentes diversos": duas fotos idênticas
 * (mesmo braço, mesma pose) na mesma peça. Acontece porque a Ellen manda o
 * mesmo print duas vezes com nomes de arquivo diferentes.
 *
 * A lista vem de `.scratch-audit/fotos-repetidas.json`, gerada por comparação
 * de impressão digital da imagem (dHash + aHash). Mantém sempre a primeira
 * ocorrência. Idempotente.
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

const repetidas = JSON.parse(
  readFileSync(".scratch-audit/fotos-repetidas.json", "utf-8"),
);
const catalogo = JSON.parse(readFileSync(".scratch-audit/catalogo.json", "utf-8"));
const porSlug = new Map(catalogo.map((p) => [p.slug, p]));
const agora = new Date().toISOString();

let pecasAjustadas = 0, fotosRemovidas = 0;

for (const r of repetidas) {
  const peca = porSlug.get(r.slug);
  if (!peca) continue;

  // arquivo exportado -> id da imagem no banco
  const idsDescartar = new Set(
    peca.fotos.filter((f) => r.descartar.includes(f.arquivo)).map((f) => f.imageId),
  );
  if (!idsDescartar.size) continue;

  const rs = await db.execute({
    sql: "SELECT fotos FROM products WHERE slug = ?",
    args: [r.slug],
  });
  if (!rs.rows.length) continue;

  const atuais = JSON.parse(rs.rows[0].fotos || "[]");
  const mantidas = atuais.filter((f) => {
    const m = /\/api\/images\/([^/?]+)/.exec(f.url || "");
    return !(m && idsDescartar.has(m[1]));
  });
  if (mantidas.length === atuais.length) continue;
  if (mantidas.length === 0) { console.warn(`${r.codigo}: ficaria sem foto, pulando`); continue; }

  await db.execute({
    sql: "UPDATE products SET fotos = ?, atualizadoEm = ? WHERE slug = ?",
    args: [JSON.stringify(mantidas), agora, r.slug],
  });
  console.log(`${String(r.codigo).padEnd(10)} ${r.nome.slice(0, 44).padEnd(46)} ${atuais.length} -> ${mantidas.length} fotos`);
  pecasAjustadas++;
  fotosRemovidas += atuais.length - mantidas.length;
}

console.log(`\npeças ajustadas: ${pecasAjustadas} | fotos repetidas removidas: ${fotosRemovidas}`);

// as imagens ficaram órfãs no banco: limpa
const usadas = new Set();
for (const row of (await db.execute("SELECT fotos FROM products")).rows) {
  for (const f of JSON.parse(row.fotos || "[]")) {
    const m = /\/api\/images\/([^/?]+)/.exec(f.url || "");
    if (m) usadas.add(m[1]);
  }
}
for (const row of (await db.execute("SELECT valor FROM settings")).rows) {
  for (const m of String(row.valor).matchAll(/\/api\/images\/([a-f0-9-]+)/g)) usadas.add(m[1]);
}
let orfas = 0;
for (const row of (await db.execute("SELECT id FROM images")).rows) {
  if (usadas.has(row.id)) continue;
  await db.execute({ sql: "DELETE FROM images WHERE id = ?", args: [row.id] });
  orfas++;
}
console.log(`imagens órfãs apagadas: ${orfas}`);
