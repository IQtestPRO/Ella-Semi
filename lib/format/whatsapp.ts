/**
 * Normalização do número de WhatsApp da loja (ADR-0024).
 *
 * O `wa.me` só funciona com o número completo em E.164 (55 + DDD + número).
 * O painel aceitava "(21) 99624-9802", guardava "21996249802" e dizia
 * "Salvo! Já aparece no site" — e a partir dali nenhum pedido do carrinho
 * chegava, sem erro visível em lugar nenhum. Aqui o número é consertado na
 * entrada; o que não dá para consertar é recusado com aviso.
 */

/** Só os dígitos, sem +, espaço, parêntese ou traço. */
function digitos(entrada: string): string {
  return typeof entrada === "string" ? entrada.replace(/\D/g, "") : "";
}

/**
 * Devolve o número em E.164 (ex.: "5521996249802") ou `null` quando não há
 * como saber o número certo (curto demais / comprido demais).
 */
export function normalizarWhatsAppBR(entrada: string): string | null {
  const d = digitos(entrada);
  if (!d) return null;

  // Já veio com o código do Brasil: 55 + DDD (2) + número (8 ou 9)
  if (d.startsWith("55") && (d.length === 12 || d.length === 13)) return d;

  // DDD (2) + número (8 ou 9), faltando só o código do país
  if (d.length === 10 || d.length === 11) return `55${d}`;

  return null;
}

/** Formata para leitura humana: "5521996249802" -> "+55 21 99624-9802". */
export function formatarWhatsAppVisivel(numero: string): string {
  const d = digitos(numero);
  if (!d.startsWith("55") || (d.length !== 12 && d.length !== 13)) return numero;
  const ddd = d.slice(2, 4);
  const resto = d.slice(4);
  const meio = resto.length === 9 ? resto.slice(0, 5) : resto.slice(0, 4);
  const fim = resto.length === 9 ? resto.slice(5) : resto.slice(4);
  return `+55 ${ddd} ${meio}-${fim}`;
}
