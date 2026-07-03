"use client";

import Image from "next/image";
import { useState } from "react";
import type { Product } from "../../../lib/schemas";
import { PlaceholderProductImage } from "./PlaceholderProductImage";

// gap-3 do track = 12px; entra no cálculo do índice pra não driftar com N fotos.
const GAP_PX = 12;

export function ProductGallery({ product }: { product: Product }) {
  const [idx, setIdx] = useState(0);
  // Vídeo de produto conta como um item da galeria (último slide).
  const temVideo = Boolean(product.videoUrl);
  const totalItens = product.fotos.length + (temVideo ? 1 : 0);
  const multi = totalItens > 1;

  // Peça sem foto (camada placeholder ADR-0016): a galeria mostra a silhueta
  // da marca em 4:5 — nunca fica vazia na página de decisão de compra.
  if (product.fotos.length === 0) {
    return (
      <div
        className="overflow-hidden bg-[var(--color-salmao-claro)]"
        style={{ aspectRatio: "4 / 5" }}
        role="region"
        aria-label={`Galeria — ${product.nome}`}
      >
        <PlaceholderProductImage
          categoria={product.categoria}
          alt={`${product.nome} — foto em breve`}
          className="h-full w-full"
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        role="region"
        aria-label={`Galeria — ${product.nome}`}
        // Mobile: carrossel com snap (1 foto por tela). Desktop: pilha editorial.
        className={
          multi
            ? "flex snap-x snap-mandatory gap-3 overflow-x-auto overscroll-x-contain [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:snap-none lg:flex-col lg:overflow-visible"
            : "flex flex-col gap-3"
        }
        tabIndex={multi ? 0 : undefined}
        onScroll={
          multi
            ? (e) =>
                setIdx(
                  Math.round(
                    e.currentTarget.scrollLeft /
                      (e.currentTarget.clientWidth + GAP_PX),
                  ),
                )
            : undefined
        }
      >
        {product.fotos.map((foto, fotoIdx) => (
          <div
            key={foto.url}
            className={`overflow-hidden bg-[var(--color-salmao-claro)] ${
              multi ? "w-full shrink-0 snap-center lg:shrink" : ""
            }`.trim()}
            style={{ aspectRatio: `${foto.width} / ${foto.height}` }}
          >
            <Image
              src={foto.url}
              alt={foto.alt}
              width={foto.width}
              height={foto.height}
              sizes="(max-width: 1024px) 100vw, 60vw"
              priority={fotoIdx === 0}
              className="h-full w-full object-cover"
            />
          </div>
        ))}
        {temVideo ? (
          <div
            className={`overflow-hidden bg-[var(--color-salmao-claro)] ${
              multi ? "w-full shrink-0 snap-center lg:shrink" : ""
            }`.trim()}
            style={{ aspectRatio: "3 / 4" }}
          >
            {/* Vídeo de produto (Cinema Studio) — vitrine viva, sem controles */}
            <video
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              poster={product.fotos[0]?.url}
              className="h-full w-full object-cover"
              aria-label={`Vídeo — ${product.nome}`}
            >
              <source src={product.videoUrl} type="video/mp4" />
            </video>
          </div>
        ) : null}
      </div>
      {multi ? (
        <span
          aria-hidden="true"
          className="absolute bottom-3 right-3 rounded-full bg-[var(--color-preto-warm)]/60 px-2.5 py-1 text-[11px] tabular-nums text-[var(--color-salmao-claro)] lg:hidden"
        >
          {idx + 1} / {totalItens}
        </span>
      ) : null}
    </div>
  );
}
