import type { Product } from "../../../lib/schemas";

export function ProductDescription({ product }: { product: Product }) {
  return (
    <section
      aria-labelledby="product-description-heading"
      className="flex flex-col gap-3"
    >
      <h2
        id="product-description-heading"
        className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-preto-warm)]/70"
      >
        Sobre a peça
      </h2>
      <p className="text-base leading-relaxed text-[var(--color-preto-warm)]/85">
        {product.descricao}
      </p>
      {product.tags && product.tags.length > 0 && (
        <ul className="flex flex-wrap gap-2 pt-1" aria-label="Tags">
          {product.tags.map((tag) => (
            <li
              key={tag}
              className="rounded-full bg-[var(--color-salmao-claro)] px-3 py-1 text-xs text-[var(--color-preto-warm)]/70"
            >
              {tag}
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
