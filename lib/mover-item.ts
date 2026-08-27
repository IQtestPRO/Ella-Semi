/**
 * Tira o item da posição `de` e encaixa em `para`, empurrando o resto — é o que
 * o olho espera quando se arrasta uma foto por cima das outras (ADR-0031).
 *
 * Índice fora da lista devolve a ordem original: arrastar para fora da grade
 * não pode bagunçar a vitrine da Ellen.
 */
export function moverItem<T>(lista: readonly T[], de: number, para: number): T[] {
  const copia = [...lista];
  if (de === para) return copia;
  if (de < 0 || para < 0 || de >= lista.length || para >= lista.length) {
    return copia;
  }
  const [item] = copia.splice(de, 1);
  copia.splice(para, 0, item);
  return copia;
}
