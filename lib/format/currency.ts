const formatter = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatBRL(precoCents: number): string {
  if (!Number.isFinite(precoCents) || !Number.isInteger(precoCents)) {
    throw new Error(`formatBRL: esperado inteiro finito; recebeu ${precoCents}`);
  }
  if (precoCents < 0) {
    throw new Error(`formatBRL: esperado não-negativo; recebeu ${precoCents}`);
  }
  return formatter.format(precoCents / 100).replace(/ /g, " ");
}
