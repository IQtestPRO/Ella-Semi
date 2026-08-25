/**
 * Leitura do nome de arquivo do lote `Imagensnovas` (ADR-0025).
 *
 * A Ellen batiza o arquivo com tudo o que a peça precisa:
 *   "EAL 456 Colar pedra natural azul com medalha $64,90.png"
 *    └cód┘ └──────────── nome da peça ────────────┘ └preço┘
 *
 * O mesmo produto aparece em várias fotos, com o nome digitado de formas
 * ligeiramente diferentes ("alga" / "algas", "(1)", "Coloar"). Aqui cada nome
 * vira {codigo, nome, precoCents, chave} — a `chave` agrupa as fotos da MESMA
 * peça, e cor diferente (azul/verde/bordô) gera chave diferente de propósito:
 * decisão do Pak é cadastrar cada cor como peça própria.
 */

export type NomeLido = {
  codigo: string;
  nome: string;
  precoCents: number | null;
  /** codigo + nome canônico — agrupa fotos da mesma peça. */
  chave: string;
};

/** Corrige o que a Ellen digita errado com frequência. */
const TYPOS: Array<[RegExp, string]> = [
  [/\bcoloar\b/gi, "Colar"],
  [/\bcoolar\b/gi, "Colar"],
  [/\bcrajevado\b/gi, "cravejado"],
  [/\bperola\b/gi, "pérola"],
  [/\bperolas\b/gi, "pérolas"],
  [/\bcoracao\b/gi, "coração"],
  [/\btres\b/gi, "três"],
  [/\bima\b/gi, "ímã"],
  [/\baco\b/gi, "aço"],
];

function tiraAcento(s: string): string {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "");
}

/**
 * Forma canônica para agrupar: sem acento, minúsculo, sem plural em palavras
 * que a Ellen alterna ("pingentes alga" == "pingente algas"), sem ruído.
 */
export function canonizar(nome: string): string {
  return tiraAcento(nome)
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean)
    // singulariza plurais simples: pingentes->pingente, algas->alga
    .map((p) => (p.length > 4 && p.endsWith("s") ? p.slice(0, -1) : p))
    .join(" ")
    .trim();
}

/**
 * Extrai código, nome e preço. Devolve `null` quando o arquivo não segue o
 * padrão (ex.: nomes UUID do Google Drive), que são tratados à parte.
 */
export function lerNomeArquivo(base: string): NomeLido | null {
  // tira sufixo de cópia "(1)", "(2)" e underscores/espaços de sobra no fim
  let s = base.replace(/\((\d+)\)\s*$/, "").replace(/[_\s]+$/, "").trim();

  const m = /^\s*([A-Z]{2,4})\s*(\d{2,6})\s+(.*)$/.exec(s);
  if (!m) return null;

  const codigo = `${m[1]} ${m[2]}`;
  let resto = m[3].trim();

  // A Ellen às vezes escreve a linha antes do nome ("LINHA FESTA  Choker …").
  resto = resto.replace(/^LINHA\s+[A-ZÀ-Ú]+\s+/i, "").trim();

  // preço no fim: "$64,90", "$ 64,90" ou sem cifrão ("49,90st" — sufixo
  // digitado por engano). Pode faltar de todo.
  let precoCents: number | null = null;
  const mp =
    /\$\s*([\d.,]+)\s*[a-z]{0,3}\s*$/i.exec(resto) ??
    /(?:^|\s)(\d{1,4}[.,]\d{2})\s*[a-z]{0,3}\s*$/i.exec(resto);
  if (mp) {
    resto = resto.slice(0, mp.index).trim();
    // reaproveita o parser tolerante já testado (ponto ou vírgula)
    const digitos = mp[1];
    const ultimoSep = Math.max(digitos.lastIndexOf(","), digitos.lastIndexOf("."));
    const casas = ultimoSep === -1 ? 0 : digitos.length - ultimoSep - 1;
    const inteiros =
      ultimoSep !== -1 && casas >= 1 && casas <= 2
        ? digitos.slice(0, ultimoSep).replace(/[.,]/g, "")
        : digitos.replace(/[.,]/g, "");
    const decimais =
      ultimoSep !== -1 && casas >= 1 && casas <= 2 ? digitos.slice(ultimoSep + 1) : "";
    const valor = Number(`${inteiros || "0"}.${decimais || "0"}`);
    precoCents = Number.isFinite(valor) ? Math.round(valor * 100) : null;
  }

  // limpa sobras de "$" solto e pontuação final
  resto = resto.replace(/\$/g, "").replace(/[\s_.-]+$/, "").trim();
  for (const [re, certo] of TYPOS) resto = resto.replace(re, certo);
  if (!resto) return null;

  // primeira letra maiúscula, resto como veio
  const nome = resto.charAt(0).toUpperCase() + resto.slice(1);

  // A chave ordena as palavras: "argola grossa prateado" e "prateado argola
  // grossa" são a MESMA peça descrita fora de ordem. Já cor diferente
  // ("azul" vs "bordo") muda o conjunto de palavras e continua sendo peça
  // própria — que é o que o Pak pediu.
  const chave = `${codigo}|${canonizar(nome).split(" ").sort().join(" ")}`;

  return { codigo, nome, precoCents, chave };
}

/** Tipo de peça a partir da primeira palavra do nome. */
export function categoriaDoNome(nome: string): string | null {
  const p = canonizar(nome).split(" ")[0] ?? "";
  if (/^(colar|cordao|choker|gargantilha|corrente)$/.test(p)) return "colares";
  if (/^(pulseira|bracelete|braceletes)$/.test(p)) return "pulseiras";
  if (/^(brinco|argola|argolinha)$/.test(p)) return "brincos";
  if (/^(conjunto|duo)$/.test(p)) return "conjuntos";
  if (/^(anel|aneis)$/.test(p)) return "aneis";
  if (/^(tornozeleira)$/.test(p)) return "tornozeleiras";
  if (/^(piercing)$/.test(p)) return "piercings";
  // "Trio"/"Duo" no lote da Ellen é sempre trio de brincos ou de argolas
  // (conferido nas fotos: "Trio brincos…", "Trio argolas…", "Trio ponto luz").
  if (/^(trio)$/.test(p)) return "brincos";
  return null;
}
