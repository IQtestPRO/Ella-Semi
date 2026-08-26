/**
 * Garantia por peça (ADR-0027).
 *
 * A página de produto exibia "Garantia das semijoias" em TODA peça, mas o
 * próprio FAQ da loja diz que bijuteria não tem garantia — ou seja, o site
 * prometia algo que a Ellen não cumpre em parte do catálogo.
 *
 * Agora a Ellen decide peça a peça no /admin. Quando ela não decidiu nada
 * (`undefined`/`null`, que é o estado das 122 peças já cadastradas), vale a
 * regra da casa: semijoia tem garantia, bijuteria não.
 */
export type PecaComGarantia = {
  temGarantia?: boolean | null;
  tipo?: "semijoia" | "bijuteria" | string;
};

export function pecaTemGarantia(peca: PecaComGarantia): boolean {
  if (typeof peca.temGarantia === "boolean") return peca.temGarantia;
  return peca.tipo === "semijoia";
}
