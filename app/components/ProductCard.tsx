import Image from "next/image";
import Link from "next/link";
import type { Product } from "../../lib/schemas";
import { formatBRL } from "../../lib/format/currency";

type Props = {
  product: Product;
  eyebrow?: string;
};

export function ProductCard({ product, eyebrow }: Props) {
  const foto = product.fotos[0];
  const preco = formatBRL(product.precoCents);
  return (
    <Link
      href={`/${product.categoria}/${product.slug}`}
      className="group block w-full max-w-[320px]"
      aria-label={`${product.nome}, ${preco}, ${product.categoria}`}
    >
      <article className="flex flex-col gap-4">
        <div
          className="overflow-hidden bg-[var(--color-salmao-claro)]"
          style={{ aspectRatio: "4 / 5" }}
        >
          <Image
            src={foto.url}
            alt={foto.alt}
            width={foto.width}
            height={foto.height}
            sizes="(max-width: 640px) 320px, 320px"
            className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
          />
        </div>
        <div className="flex flex-col gap-1.5 px-1">
          {eyebrow && (
            <span className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-preto-warm)]/70">
              {eyebrow}
            </span>
          )}
          <h2 className="font-hero text-2xl leading-tight">{product.nome}</h2>
          <p className="text-base text-[var(--color-preto-warm)]/80">{preco}</p>
        </div>
      </article>
    </Link>
  );
}
