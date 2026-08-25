/**
 * corrigir-auditoria.mjs — aplica o que a auditoria do catálogo apontou e que
 * NÃO depende de decisão do Pak (ADR-0026).
 *
 * 1. Tira da galeria foto que é de OUTRA joia (conferido a olho, uma a uma).
 * 2. Troca a capa quando o close do produto está na 2ª posição e a 1ª é um
 *    retrato onde a peça some.
 * 3. Junta duplicata de MESMO PREÇO: fica um cadastro no ar, o outro sai do
 *    site (ativo = 0, sem apagar do banco) e as fotos são somadas no que fica.
 *
 * O que NÃO está aqui, de propósito: duplicata com preço divergente e os casos
 * que dependem da Ellen (conjunto 05G, miçangas "com estrela"/"cauda de
 * baleia", códigos repetidos). Ver docs/adr/0026 e o relatório ao Pak.
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

const catalogo = JSON.parse(readFileSync(".scratch-audit/catalogo.json", "utf-8"));
const porSlug = new Map(catalogo.map((p) => [p.slug, p]));

/** arquivo exportado (0169.webp) -> id da imagem, dentro de uma peça */
function idsDe(slug, arquivos) {
  const p = porSlug.get(slug);
  if (!p) return new Set();
  return new Set(p.fotos.filter((f) => arquivos.includes(f.arquivo)).map((f) => f.imageId));
}

async function fotosAtuais(slug) {
  const rs = await db.execute({ sql: "SELECT fotos FROM products WHERE slug = ?", args: [slug] });
  return rs.rows.length ? JSON.parse(rs.rows[0].fotos || "[]") : [];
}
async function gravarFotos(slug, fotos) {
  await db.execute({
    sql: "UPDATE products SET fotos = ?, atualizadoEm = ? WHERE slug = ?",
    args: [JSON.stringify(fotos), agora, slug],
  });
}

// ── 1. fotos de outra joia (arquivo conferido visualmente) ──────────────────
const TIRAR = [
  { slug: "colar-pedra-natural-verde-com-medalha-eal-456", arquivos: ["0169.webp", "0171.webp", "0172.webp", "0173.webp"], motivo: "pingente gota / colares de outra cor" },
  { slug: "pulseira-de-couro-com-correntes-eal-458", arquivos: ["0226.webp", "0227.webp"], motivo: "outra pulseira (esferas e pingente de abelha)" },
  { slug: "colar-corrente-grossa-com-pingentes-abj-350", arquivos: ["0097.webp"], motivo: "corrente fina com 3 medalhas iguais" },
  { slug: "brinco-argola-aberta-com-perola-etu-102", arquivos: ["0004.webp"], motivo: "foto mostra colares, não brinco" },
  { slug: "brinco-redondo-com-perola-no-meio-etu-9676", arquivos: ["0022.webp"], motivo: "argola com pérola pendurada, outro modelo" },
  { slug: "colar-pedra-murano-verde-com-pingente-sol-coral-eal-844", arquivos: ["0155.webp"], motivo: "pulso com pulseiras turquesa" },
  { slug: "colar-pedra-natural-azul-com-medalha-eal-456", arquivos: ["0159.webp"], motivo: "colar verde com gota" },
  { slug: "colar-corrente-elos-dourado-eal-382", arquivos: ["0093.webp"], motivo: "corrente de elos diferente" },
];

console.log("=== FOTOS DE OUTRA JOIA ===");
let fotosTiradas = 0;
for (const t of TIRAR) {
  const ids = idsDe(t.slug, t.arquivos);
  if (!ids.size) { console.warn(`  ${t.slug}: fotos não encontradas`); continue; }
  const atuais = await fotosAtuais(t.slug);
  const mantidas = atuais.filter((f) => {
    const m = /\/api\/images\/([^/?]+)/.exec(f.url || "");
    return !(m && ids.has(m[1]));
  });
  if (!mantidas.length) { console.warn(`  ${t.slug}: ficaria sem foto, pulando`); continue; }
  await gravarFotos(t.slug, mantidas);
  fotosTiradas += atuais.length - mantidas.length;
  console.log(`  ${t.slug.slice(0, 52).padEnd(54)} ${atuais.length} -> ${mantidas.length}  (${t.motivo})`);
}

// ── 2. capa: close do produto vem primeiro ──────────────────────────────────
const TROCAR_CAPA = [
  { slug: "trio-brincos-bolinhas-prata-eog-047", capa: "0040.webp" },
  { slug: "trio-brincos-ponto-de-luz-verde-efe-6665", capa: "0042.webp" },
];
console.log("\n=== CAPA (close do produto na frente) ===");
for (const t of TROCAR_CAPA) {
  const ids = idsDe(t.slug, [t.capa]);
  const atuais = await fotosAtuais(t.slug);
  const idx = atuais.findIndex((f) => {
    const m = /\/api\/images\/([^/?]+)/.exec(f.url || "");
    return m && ids.has(m[1]);
  });
  if (idx <= 0) { console.warn(`  ${t.slug}: já é capa ou não achei`); continue; }
  const nova = [atuais[idx], ...atuais.filter((_, i) => i !== idx)];
  await gravarFotos(t.slug, nova);
  console.log(`  ${t.slug.slice(0, 52).padEnd(54)} foto ${idx + 1} virou capa`);
}

// ── 3. duplicatas com o MESMO preço ─────────────────────────────────────────
/** grupos confirmados a olho; o script só age se os preços forem iguais. */
const GRUPOS = [
  { nome: "olho grego", slugs: ["choker-olho-grego-14a", "colar-semijoia-olho-grego-epb-002", "choker-semijoia-olho-grego-omg-167"] },
  { nome: "turquesa com pingente retangular", slugs: ["colar-contas-turquesa-com-pingente-eal-830", "colar-pingente-pedra-turquesa-05d"] },
  { nome: "corrente elos dourado", slugs: ["colar-corrente-elos-dourado-eal-382", "colar-elos-grandes-19b"] },
  { nome: "corrente com coração bojudo", slugs: ["colar-corrente-elos-com-pingente-coracao-eal-382", "colar-corrente-e-pingente-coracao-co324"] },
];

console.log("\n=== DUPLICATAS DE MESMO PREÇO (junta) ===");
const pendentes = [];
for (const g of GRUPOS) {
  const rs = await db.execute({
    sql: `SELECT slug, nome, codigo, precoCents, fotos, ativo FROM products WHERE slug IN (${g.slugs.map(() => "?").join(",")})`,
    args: g.slugs,
  });
  const itens = rs.rows.filter((r) => Number(r.ativo) === 1);
  if (itens.length < 2) { console.log(`  ${g.nome}: já resolvido`); continue; }

  const precos = new Set(itens.map((r) => Number(r.precoCents)));
  if (precos.size > 1) {
    pendentes.push({ grupo: g.nome, itens: itens.map((r) => ({ codigo: r.codigo, nome: r.nome, preco: Number(r.precoCents) / 100 })) });
    console.log(`  ${g.nome}: PREÇOS DIFERENTES -> deixado para o Pak decidir`);
    continue;
  }

  // fica o de galeria maior; empate -> o primeiro
  const ordenado = [...itens].sort(
    (a, b) => JSON.parse(b.fotos || "[]").length - JSON.parse(a.fotos || "[]").length,
  );
  const fica = ordenado[0];
  const saem = ordenado.slice(1);

  // junta as fotos de todos no que fica (sem repetir imagem)
  const vistos = new Set();
  const galeria = [];
  for (const r of [fica, ...saem]) {
    for (const f of JSON.parse(r.fotos || "[]")) {
      const m = /\/api\/images\/([^/?]+)/.exec(f.url || "");
      if (m && vistos.has(m[1])) continue;
      if (m) vistos.add(m[1]);
      galeria.push({ ...f, alt: fica.nome });
    }
  }
  await gravarFotos(fica.slug, galeria);
  for (const r of saem) {
    await db.execute({
      sql: "UPDATE products SET ativo = 0, atualizadoEm = ? WHERE slug = ?",
      args: [agora, r.slug],
    });
  }
  console.log(`  ${g.nome}: fica ${fica.codigo} "${String(fica.nome).slice(0, 34)}" com ${galeria.length} fotos | saem ${saem.map((r) => r.codigo).join(", ")}`);
}

if (pendentes.length) {
  console.log("\n=== PENDENTE (preço divergente) ===");
  for (const p of pendentes) {
    console.log(`  ${p.grupo}:`);
    for (const i of p.itens) console.log(`     ${String(i.codigo).padEnd(10)} R$ ${i.preco.toFixed(2).padStart(7)}  ${i.nome}`);
  }
}

console.log(`\nfotos de outra joia removidas: ${fotosTiradas}`);
const total = await db.execute("SELECT COUNT(*) n FROM products WHERE ativo = 1");
console.log(`peças no ar: ${total.rows[0].n}`);
