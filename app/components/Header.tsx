import { getCategoryCounts } from "../../lib/catalog";
import { HeaderChrome, type NavLink } from "./HeaderChrome";
import type { Categoria } from "../../lib/schemas";
import { ORDEM_CATEGORIAS } from "../../lib/categorias";

/**
 * Chrome persistente do site. O menu é montado a partir das categorias que
 * REALMENTE têm peça no ar — categoria vazia não vira link, senão a cliente
 * toca em "Brincos" e cai numa página sem nada (decisão do Pak 2026-08-17:
 * o site mostra apenas as peças que têm foto).
 */
const LABEL: Partial<Record<Categoria, string>> = {
  colares: "Colares",
  brincos: "Brincos",
  pulseiras: "Pulseiras",
  conjuntos: "Conjuntos",
  mixes: "Mixes",
  aneis: "Anéis",
  tornozeleiras: "Tornozeleiras",
  piercings: "Piercings",
  outros: "Outros",
};


export async function Header() {
  const counts = await getCategoryCounts();
  const comPeca = new Map(counts.map((c) => [c.categoria, c.count]));

  const links: NavLink[] = ORDEM_CATEGORIAS.filter((c) => (comPeca.get(c) ?? 0) > 0).map(
    (c) => ({ href: `/${c}`, label: LABEL[c] ?? c }),
  );
  links.push({ href: "/produtos", label: "Todas as peças" });

  return <HeaderChrome links={links} />;
}
