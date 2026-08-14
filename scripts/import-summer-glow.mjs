/**
 * import-summer-glow.mjs — cadastra a coleção SUMMER GLOW (catálogo Primavera
 * 2027) no Turso a partir de `docs/catalogo/summer-glow-canon.json`.
 *
 * Regra combinada com o Pak: "só adicionar as que faltam".
 *   - peça SEM `existente`  -> cria produto novo (com as fotos do catálogo)
 *   - peça COM `existente`  -> NÃO duplica; só alinha o produto já cadastrado
 *                              ao catálogo oficial (preço + código do catálogo)
 *
 * Uso: node scripts/import-summer-glow.mjs <dir-do-extract>
 *   <dir-do-extract> precisa conter imgs/ e codigo-fotos.json (saída do
 *   extract.py + casar.py rodados sobre o PDF).
 */
import { readFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { randomUUID } from "node:crypto";
import sharp from "sharp";
import { createClient } from "@libsql/client";

const EXTRACT = process.argv[2];
if (!EXTRACT) {
  console.error("uso: node scripts/import-summer-glow.mjs <dir-do-extract>");
  process.exit(1);
}
const IMG_DIR = join(EXTRACT, "imgs");
const MAX_DIM = 1600;

const env = Object.fromEntries(
  readFileSync(resolve(".env.local"), "utf-8").split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1)]; }),
);
const db = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

const canon = JSON.parse(readFileSync("docs/catalogo/summer-glow-canon.json", "utf-8"));
const codigoFotos = JSON.parse(readFileSync(join(EXTRACT, "codigo-fotos.json"), "utf-8"));

function slugify(s) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase()
    .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "") || "peca";
}

// Quantas peças aparecem em cada foto? A foto mais "dedicada" (menos peças)
// vira a capa do produto — é a que mostra a joia como protagonista.
const pecasPorFoto = new Map();
for (const arquivos of Object.values(codigoFotos)) {
  for (const a of arquivos) pecasPorFoto.set(a, (pecasPorFoto.get(a) ?? 0) + 1);
}

const imgCache = new Map();
async function processarImagem(arquivo, alt) {
  if (imgCache.has(arquivo)) return imgCache.get(arquivo);
  const buf = readFileSync(join(IMG_DIR, arquivo));
  const { data, info } = await sharp(buf)
    .rotate()
    .resize({ width: MAX_DIM, height: MAX_DIM, fit: "inside", withoutEnlargement: true })
    .webp({ quality: 84 })
    .toBuffer({ resolveWithObject: true });
  const id = randomUUID();
  await db.execute({
    sql: "INSERT INTO images (id, mime, bytes, width, height, alt, criadoEm) VALUES (?,?,?,?,?,?,?)",
    args: [id, "image/webp", new Uint8Array(data), info.width, info.height, alt, new Date().toISOString()],
  });
  const rec = { id, url: `/api/images/${id}`, width: info.width, height: info.height };
  imgCache.set(arquivo, rec);
  return rec;
}

/** O selo do catálogo vira frase de venda (a cliente precisa saber o que leva). */
const SELO_FRASE = {
  "SEMIJOIA": "Semijoia com garantia de 6 meses a 1 ano.",
  "CONJUNTO SEMIJOIA": "Conjunto (colar + brincos) em semijoia, com garantia de 6 meses a 1 ano.",
  "CONJUNTO": "Conjunto completo.",
  "TRIO": "Trio — vão três peças.",
  "CADA": "Preço por unidade.",
  "CORDÃO DUPLO": "Cordão duplo.",
  "BRACELETE ACRÍLICO": "Bracelete em acrílico.",
  "PERSONALIZADA": "Peça personalizada — a encomenda é feita após o pagamento.",
};

function banhoDe(nome) {
  if (/prate|prata/i.test(nome)) return "prata";
  if (/acr[íi]lico|couro|veludo|silicone/i.test(nome)) return "a-confirmar";
  return "ouro";
}

const ordemBase = Number(
  (await db.execute("SELECT COALESCE(MAX(ordem), -1) + 1 AS n FROM products")).rows[0].n,
);

let criados = 0, atualizados = 0, i = 0;
const semFoto = [];

for (const p of canon.pecas) {
  const arquivos = (codigoFotos[p.cod] ?? [])
    .slice()
    .sort((a, b) => (pecasPorFoto.get(a) ?? 99) - (pecasPorFoto.get(b) ?? 99));

  // ── peça que JÁ existe no site: não duplica, só alinha ao catálogo ────────
  if (p.existente) {
    const r = await db.execute({
      sql: `UPDATE products
            SET precoCents = ?, codigo = ?, atualizadoEm = ?
            WHERE codigo = ?`,
      args: [p.precoCents, p.cod, new Date().toISOString(), p.existente],
    });
    if (r.rowsAffected > 0) {
      atualizados++;
      console.log(`= ${p.cod.padEnd(5)} já existia como ${p.existente} → preço/código alinhados ao catálogo`);
    } else {
      console.log(`! ${p.cod.padEnd(5)} marcado como existente (${p.existente}) mas não achei no banco`);
    }
    continue;
  }

  // ── peça nova ────────────────────────────────────────────────────────────
  if (arquivos.length === 0) semFoto.push(p.cod);

  const fotos = [];
  for (const arq of arquivos) {
    const varias = (pecasPorFoto.get(arq) ?? 1) > 1;
    const img = await processarImagem(arq, `${p.nome} — catálogo Summer Glow`);
    fotos.push({
      url: img.url,
      alt: `${p.nome} (cód. ${p.cod})${varias ? " — foto do catálogo com outras peças" : ""}`,
      fonte: "upload-admin",
      width: img.width,
      height: img.height,
    });
  }

  const slug = slugify(`${p.nome} ${p.cod}`);
  const frase = SELO_FRASE[p.selo] ?? "";
  const descricao =
    `${p.nome} (cód. ${p.cod}) — coleção Summer Glow. ` +
    (frase ? `${frase} ` : "") +
    "Atendimento e pedido direto com a Ellen pelo WhatsApp.";

  const now = new Date().toISOString();
  await db.execute({
    sql: `INSERT INTO products
      (slug, nome, codigo, categoria, banho, tipo, precoCents, precoPromocionalCents, descricao,
       fotos, variantes, tags, promocao, tipoFulfillment, destaqueHome, maisVendido,
       ativo, origem, fonteFotoFraca, cadastradoEm, atualizadoEm, ordem)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(slug) DO UPDATE SET
        nome=excluded.nome, codigo=excluded.codigo, categoria=excluded.categoria,
        precoCents=excluded.precoCents, descricao=excluded.descricao, fotos=excluded.fotos,
        tags=excluded.tags, tipoFulfillment=excluded.tipoFulfillment,
        ativo=excluded.ativo, atualizadoEm=excluded.atualizadoEm`,
    args: [
      slug,
      p.nome,
      p.cod,
      p.categoria,
      banhoDe(p.nome),
      /SEMIJOIA/.test(p.selo) ? "semijoia" : "bijuteria",
      p.precoCents,
      null,
      descricao,
      JSON.stringify(fotos),
      null,
      JSON.stringify(["summer-glow", "primavera-2027"]),
      0,
      p.selo === "PERSONALIZADA" ? "sob-encomenda" : "pronta-entrega",
      0,
      0,
      1,
      JSON.stringify({ catalogoArquivo: "CATALO_4 ella.PDF", pagina: Number(p.cod.slice(0, 2)), letra: p.cod.slice(2) }),
      null,
      now,
      now,
      ordemBase + i,
    ],
  });
  criados++;
  i++;
  console.log(`+ ${p.cod.padEnd(5)} ${p.nome.padEnd(42)} R$ ${(p.precoCents / 100).toFixed(2)}  ${fotos.length} foto(s)  /${p.categoria}/${slug}`);
}

console.log(`\n✓ ${criados} peças novas cadastradas`);
console.log(`✓ ${atualizados} peças já existentes alinhadas ao catálogo (sem duplicar)`);
console.log(`✓ ${imgCache.size} imagens processadas`);
if (semFoto.length) console.log(`⚠ sem foto: ${semFoto.join(", ")}`);
process.exit(0);
