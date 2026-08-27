import type { Categoria } from "./schemas";

/**
 * Label pt-BR canônico de cada categoria (plural, com acento).
 * Fonte única pra breadcrumbs/headings — evita renderizar o slug cru
 * ("aneis" sem acento). Consumidores existentes com maps locais
 * ([categoria]/page.tsx, Categorias.tsx) migram pra cá em follow-up.
 */
export const PRETTY_LABEL: Record<Categoria, string> = {
  brincos: "Brincos",
  colares: "Colares",
  pulseiras: "Pulseiras",
  aneis: "Anéis",
  conjuntos: "Conjuntos",
  mixes: "Mixes",
  gargantilhas: "Chokers",
  tornozeleiras: "Tornozeleiras",
  piercings: "Piercings",
  outros: "Outros",
};

/**
 * Ordem canônica em que as categorias aparecem para a cliente (menu do topo,
 * cards da home, contagens). É a ÚNICA lista de ordem do projeto.
 *
 * Existia uma cópia dela dentro de `getCategoryCounts`, e quando "mixes" entrou
 * no enum essa cópia ficou para trás — a categoria simplesmente nunca saía no
 * site, sem erro nenhum. `tests/unit/categorias-ordem.test.ts` agora quebra se
 * alguém acrescentar categoria no enum e esquecer daqui.
 */
export const ORDEM_CATEGORIAS: readonly Categoria[] = [
  "colares",
  "brincos",
  "pulseiras",
  "conjuntos",
  "mixes",
  "aneis",
  "gargantilhas",
  "tornozeleiras",
  "piercings",
  "outros",
] as const;
