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
  gargantilhas: "Chokers",
  tornozeleiras: "Tornozeleiras",
  piercings: "Piercings",
  outros: "Outros",
};
