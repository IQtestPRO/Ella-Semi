/**
 * Leitura tolerante de preço digitado à mão no /admin (ADR-0024).
 *
 * A pessoa que cadastra as peças usa o teclado do celular e pode digitar
 * "89,90" ou "89.90" — as duas precisam virar R$ 89,90. A implementação
 * anterior removia todo ponto antes de converter, então "89.90" virava 8990
 * reais (100x mais caro) e ia pro site assim.
 *
 * Regra: o separador decimal é o ÚLTIMO `,` ou `.` da string, desde que tenha
 * 1 ou 2 dígitos depois dele. Com 3 dígitos depois (ex.: "1.500") ele é
 * separador de milhar. Todos os outros separadores são descartados.
 */
export function parsePrecoParaCents(entrada: string): number {
  if (typeof entrada !== "string") return 0;

  // Mantém só dígitos e separadores — descarta "R$", espaços, letras.
  const limpo = entrada.replace(/[^\d.,]/g, "");
  if (!limpo || !/\d/.test(limpo)) return 0;

  const ultimoSep = Math.max(limpo.lastIndexOf(","), limpo.lastIndexOf("."));
  const casasDepois = ultimoSep === -1 ? 0 : limpo.length - ultimoSep - 1;

  let inteiros: string;
  let decimais: string;

  if (ultimoSep !== -1 && casasDepois >= 1 && casasDepois <= 2) {
    // Último separador é decimal ("89,90" / "89.90" / "1,5")
    inteiros = limpo.slice(0, ultimoSep).replace(/[.,]/g, "");
    decimais = limpo.slice(ultimoSep + 1);
  } else if (ultimoSep !== -1 && casasDepois > 2) {
    // Vírgula NUNCA é separador de milhar no Brasil: "89,999" é decimal e o
    // arredondamento resolve (-> 90,00). Já "1.500" com PONTO e 3 casas é
    // milhar, sem centavos.
    const ehPonto = limpo[ultimoSep] === ".";
    if (ehPonto && casasDepois === 3) {
      return Math.round(Number(limpo.replace(/[.,]/g, ""))) * 100;
    }
    inteiros = limpo.slice(0, ultimoSep).replace(/[.,]/g, "");
    decimais = limpo.slice(ultimoSep + 1);
  } else {
    // Sem separador nenhum: número inteiro de reais
    inteiros = limpo.replace(/[.,]/g, "");
    decimais = "";
  }

  const valor = Number(`${inteiros || "0"}.${decimais || "0"}`);
  if (!Number.isFinite(valor)) return 0;
  return Math.round(Math.abs(valor) * 100);
}

/** Formata centavos para dentro do campo de edição ("8990" -> "89,90"). */
export function centsParaCampo(cents: number): string {
  if (!Number.isFinite(cents)) return "";
  return (Math.abs(cents) / 100).toFixed(2).replace(".", ",");
}
