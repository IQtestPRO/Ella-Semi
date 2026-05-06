import Image from "next/image";
import Link from "next/link";
import type { Product } from "../../lib/schemas";
import { formatBRL } from "../../lib/format/currency";
import { PlaceholderProductImage } from "./product/PlaceholderProductImage";

type Props = {
  product: Product;
  eyebrow?: string;
  /**
   * If `true`, renders the discreet "MAIS VENDIDO" badge at the top-left of
   * the photo. Defaults to `product.maisVendido`. Pass `false` explicitly to
   * suppress (used by the MAIS VENDIDOS section itself, where the heading
   * already communicates the framing).
   */
  showMaisVendidoBadge?: boolean;
};

export function ProductCard({ product, eyebrow, showMaisVendidoBadge }: Props) {
  const foto = product.fotos[0];
  const preco = formatBRL(product.precoCents);
  const showBadge =
    showMaisVendidoBadge === undefined
      ? product.maisVendido === true
      : showMaisVendidoBadge && product.maisVendido === true;

  return (
    <Link
      href={`/${product.categoria}/${product.slug}`}
      className="group block w-full max-w-[320px]"
      aria-label={`${product.nome}, ${preco}, ${product.categoria}${
        product.maisVendido ? ", mais vendido" : ""
      }`}
    >
      <article className="flex flex-col gap-4">
        <div
          className="relative overflow-hidden bg-[var(--color-salmao-claro)]"
          style={{ aspectRatio: "4 / 5" }}
        >
          {foto ? (
            <Image
              src={foto.url}
              alt={foto.alt}
              width={foto.width}
              height={foto.height}
              sizes="(max-width: 640px) 320px, 320px"
              className="h-full w-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.02]"
            />
          ) : (
            <div className="absolute inset-0">
              <PlaceholderProductImage
                categoria={product.categoria}
                alt={`${product.nome} — foto em breve`}
                className="h-full w-full"
              />
            </div>
          )}
          {showBadge && (
            <span
              data-testid="mais-vendido-badge"
              className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[9px] uppercase shadow-sm"
              style={{
                backgroundColor: "rgba(255, 247, 238, 0.92)",
                color: "#A47525",
                letterSpacing: "0.16em",
                fontFamily:
                  "var(--font-secondary, Inter, system-ui, sans-serif)",
                fontWeight: 600,
                border: "0.5px solid rgba(217, 154, 48, 0.35)",
              }}
            >
              <span aria-hidden="true">★</span>
              <span>Mais vendido</span>
            </span>
          )}
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
