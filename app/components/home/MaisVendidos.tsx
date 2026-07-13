import type { FC } from "react";
import type { Product } from "../../../lib/schemas";
import { ProductCard } from "../ProductCard";
import { SectionHeading } from "./SectionHeading";

type Props = {
  products: readonly Product[];
};

/**
 * Seção "MAIS VENDIDOS" da home.
 *
 * Surface UI alimentada por `product.maisVendido === true && product.ativo`.
 * Distinta de "Favoritas da Ella" (`destaqueHome`). S2.0 / ADR-0017.
 *
 * Layout:
 * - Mobile: scroll horizontal snap-x com peek (~80% de cada card visível)
 * - Desktop (md+): grid 4 colunas
 *
 * Cards mantêm o badge `★ Mais vendido` (default da prop `showMaisVendidoBadge`)
 * — heading da seção comunica framing geral, mas badge no card permite que ele
 * seja escaneado individualmente também.
 */
export const MaisVendidos: FC<Props> = ({ products }) => {
  if (products.length === 0) return null;

  return (
    <section
      aria-labelledby="mais-vendidos-heading"
      className="w-full px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div id="mais-vendidos-heading">
          <SectionHeading title="MAIS VENDIDOS" />
        </div>

        {/* Mobile: scroll horizontal snap */}
        <ul
          className="-mx-5 flex gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] md:hidden"
          style={{ scrollSnapType: "x mandatory" }}
          data-testid="mais-vendidos-scroll-mobile"
        >
          {products.map((p, i) => (
            <li
              key={p.slug}
              className="flex-none"
              style={{ scrollSnapAlign: "start", width: "78%" }}
            >
              <ProductCard
                product={p}
                showAddToCart
                priority={i < 2}
                sizes="(max-width: 640px) 80vw, 320px"
              />
            </li>
          ))}
        </ul>

        {/* Desktop: grid 4 cols */}
        <ul
          className="hidden grid-cols-2 gap-x-6 gap-y-12 md:grid lg:grid-cols-4"
          data-testid="mais-vendidos-grid-desktop"
        >
          {products.map((p, i) => (
            <li key={p.slug}>
              <ProductCard product={p} showAddToCart priority={i < 4} />
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
};
