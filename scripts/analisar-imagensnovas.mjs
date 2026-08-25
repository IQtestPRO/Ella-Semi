/**
 * analisar-imagensnovas.mjs — passada SECA (não grava nada).
 * Lê os nomes de arquivo do lote, agrupa por peça e relata o que seria criado,
 * o que falta preço e o que não tem nome. Serve de conferência antes do import.
 */
import { readdirSync, statSync, writeFileSync } from "node:fs";
import { resolve, join, extname, basename } from "node:path";

const SRC = resolve("Imagensnovas");
const OUT = resolve(".scratch-import");

function listar(dir) {
  const out = [];
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) out.push(...listar(p));
    else if (/\.(png|jpe?g)$/i.test(e.name)) out.push(p);
  }
  return out;
}

// Importa o parser compilando na mão (o script roda em node puro).
const { lerNomeArquivo, categoriaDoNome } = await import(
  "../lib/import/nome-arquivo.ts"
).catch(async () => {
  // fallback: node não lê .ts direto — usa tsx se existir
  throw new Error("rode com: npx tsx scripts/analisar-imagensnovas.mjs");
});

const arquivos = listar(SRC);
const grupos = new Map();
const semNome = [];

for (const f of arquivos) {
  const base = basename(f, extname(f));
  const lido = lerNomeArquivo(base);
  if (!lido) {
    semNome.push(f);
    continue;
  }
  if (!grupos.has(lido.chave)) {
    grupos.set(lido.chave, {
      codigo: lido.codigo,
      nome: lido.nome,
      precoCents: lido.precoCents,
      categoria: categoriaDoNome(lido.nome),
      arquivos: [],
      pasta: f.includes("BIJUTERIAS") ? "BIJUTERIAS" : f.includes("DOURADO") ? "DOURADO" : "DRIVE",
    });
  }
  const g = grupos.get(lido.chave);
  g.arquivos.push(f);
  if (g.precoCents == null && lido.precoCents != null) g.precoCents = lido.precoCents;
}

// Preço faltando no arquivo? Herda de outra foto do MESMO código — a Ellen
// digita o preço em uma foto e esquece na outra.
const precoPorCodigo = new Map();
for (const g of grupos.values()) {
  if (g.precoCents != null && !precoPorCodigo.has(g.codigo)) {
    precoPorCodigo.set(g.codigo, g.precoCents);
  }
}
for (const g of grupos.values()) {
  if (g.precoCents == null && precoPorCodigo.has(g.codigo)) {
    g.precoCents = precoPorCodigo.get(g.codigo);
    g.precoHerdado = true;
  }
}

const lista = [...grupos.values()];
const semPreco = lista.filter((g) => g.precoCents == null);
const herdados = lista.filter((g) => g.precoHerdado);
const semCategoria = lista.filter((g) => !g.categoria);

console.log(`arquivos: ${arquivos.length}`);
console.log(`peças distintas: ${lista.length}`);
console.log(`fotos sem nome (UUID): ${semNome.length}`);
console.log("");
const porCat = {};
for (const g of lista) porCat[g.categoria ?? "(indefinida)"] = (porCat[g.categoria ?? "(indefinida)"] ?? 0) + 1;
console.log("POR CATEGORIA:");
for (const [c, n] of Object.entries(porCat).sort()) console.log(`  ${c.padEnd(16)} ${n}`);
console.log("");
console.log(`PREÇO HERDADO de outra foto do mesmo código (${herdados.length}):`);
for (const g of herdados)
  console.log(`  ${g.codigo}  ${g.nome} -> R$ ${(g.precoCents / 100).toFixed(2)}`);
console.log("");
console.log(`SEM PREÇO — ficam de fora (${semPreco.length}):`);
for (const g of semPreco) console.log(`  ${g.codigo}  ${g.nome}`);
console.log("");
console.log("CÓDIGOS COM MAIS DE UMA PEÇA (conferir se são variações de cor):");
const porCodigo = {};
for (const g of lista) (porCodigo[g.codigo] ??= []).push(g);
for (const [cod, gs] of Object.entries(porCodigo).sort()) {
  if (gs.length < 2) continue;
  console.log(`  ${cod} (${gs.length}):`);
  for (const g of gs) console.log(`      ${g.nome}  [${g.arquivos.length}f]`);
}
console.log("");
console.log(`SEM CATEGORIA — "Trio"/outros (${semCategoria.length}):`);
for (const g of semCategoria) console.log(`  ${g.codigo}  ${g.nome}  [${g.arquivos.length} foto(s)]`);

try {
  writeFileSync(
    join(OUT, "grupos.json"),
    JSON.stringify({ lista, semNome }, null, 1),
    "utf-8",
  );
} catch {
  // pasta pode não existir — o relatório no console já basta
}
