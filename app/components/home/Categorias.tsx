import Image from "next/image";
import Link from "next/link";
import type { FC } from "react";
import type { Categoria } from "../../../lib/schemas";
import { PlaceholderProductImage } from "../product/PlaceholderProductImage";
import { SectionHeading } from "./SectionHeading";

type Props = {
  counts: ReadonlyArray<{ categoria: Categoria; count: number }>;
};

const PRETTY_LABEL: Partial<Record<Categoria, string>> = {
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

/**
 * Categorias com fotografia editorial gerada via Higgsfield Nano Banana Pro 2K
 * (assets/prompts/categorias/cards-categorias-v1.md). Categorias fora deste
 * set caem na silhueta SVG da marca (ADR-0016).
 */
const CARD_IMAGE: Partial<Record<Categoria, string>> = {
  brincos: "/assets/generated/categorias/brincos.webp",
  colares: "/assets/generated/categorias/colares.webp",
  pulseiras: "/assets/generated/categorias/pulseiras.webp",
  aneis: "/assets/generated/categorias/aneis.webp",
  conjuntos: "/assets/generated/categorias/conjuntos.webp",
  gargantilhas: "/assets/generated/categorias/gargantilhas.webp",
};

/**
 * Seção "Explore por Categoria" da home.
 *
 * Cards com foto editorial warm (Higgsfield 2K) — zoom sutil no hover e véu
 * warm que clareia, com easing custom da marca. Click navega pra /[categoria].
 *
 * Layout:
 * - Mobile: grid 2 colunas
 * - Desktop (md+): grid 3 colunas
 */
export const Categorias: FC<Props> = ({ counts }) => {
  if (counts.length === 0) return null;

  return (
    <section
      aria-labelledby="categorias-heading"
      className="w-full bg-[var(--color-salmao-claro)] px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div id="categorias-heading">
          <SectionHeading
            title="Explore por Categoria"
            subtitle="navegue pelas peças da coleção"
          />
        </div>

        <ul className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
          {counts.map(({ categoria, count }) => {
            const label = PRETTY_LABEL[categoria] ?? categoria;
            const img = CARD_IMAGE[categoria];
            return (
              <li key={categoria}>
                <Link
                  href={`/${categoria}`}
                  className="group block overflow-hidden border border-transparent bg-white transition-[transform,border-color] duration-300 ease-brand hover:-translate-y-0.5 hover:border-[var(--color-areia)]"
                  aria-label={`${label} — ${count} ${
                    count === 1 ? "peça" : "peças"
                  }`}
                >
                  <div className="relative overflow-hidden">
                    {img ? (
                      <div className="relative aspect-[4/3] md:aspect-square">
                        <Image
                          src={img}
                          alt=""
                          fill
                          sizes="(max-width: 768px) 50vw, 33vw"
                          className="object-cover transition-transform duration-300 ease-brand group-hover:scale-[1.04]"
                        />
                        {/* Véu warm que clareia no hover — second read da marca */}
                        <div
                          aria-hidden="true"
                          className="absolute inset-0 bg-[var(--color-preto-warm)]/8 transition-opacity duration-300 group-hover:opacity-0"
                        />
                      </div>
                    ) : (
                      <PlaceholderProductImage
                        categoria={categoria}
                        showLabel={false}
                        alt=""
                        aspectClassName="aspect-[4/3] md:aspect-square"
                      />
                    )}
                  </div>
                  <div className="flex items-end justify-between gap-2 px-4 py-4 transition-colors duration-300 ease-out-soft group-hover:bg-[var(--color-salmao-claro)]/50 md:px-5 md:py-5">
                    <div className="flex flex-col gap-1">
                      <h3
                        className="font-hero text-[var(--color-preto-warm)]"
                        style={{
                          fontSize: "clamp(20px, 2.6vw, 26px)",
                          fontWeight: 400,
                          letterSpacing: "0.01em",
                        }}
                      >
                        {label}
                      </h3>
                      <span
                        className="text-[var(--color-preto-warm)]/60"
                        style={{
                          fontFamily:
                            "var(--font-secondary, Inter, system-ui, sans-serif)",
                          fontSize: "11px",
                          letterSpacing: "0.16em",
                          textTransform: "uppercase",
                        }}
                      >
                        {count} {count === 1 ? "peça" : "peças"}
                      </span>
                    </div>
                    <span
                      aria-hidden="true"
                      className="mb-1 text-[var(--color-taupe)] opacity-0 transition-all duration-300 ease-brand group-hover:translate-x-0 group-hover:opacity-100 md:-translate-x-1"
                    >
                      →
                    </span>
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
};
