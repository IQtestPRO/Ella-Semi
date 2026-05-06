import Image from "next/image";
import type { Product } from "../../../lib/schemas";

export function ProductGallery({ product }: { product: Product }) {
  return (
    <div
      className="flex flex-col gap-3"
      role="region"
      aria-label={`Galeria — ${product.nome}`}
    >
      {product.fotos.map((foto, idx) => (
        <div
          key={foto.url}
          className="overflow-hidden bg-[var(--color-salmao-claro)]"
          style={{ aspectRatio: `${foto.width} / ${foto.height}` }}
        >
          <Image
            src={foto.url}
            alt={foto.alt}
            width={foto.width}
            height={foto.height}
            sizes="(max-width: 1024px) 100vw, 60vw"
            priority={idx === 0}
            className="h-full w-full object-cover"
          />
        </div>
      ))}
    </div>
  );
}
