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
  gargantilhas: "Gargantilhas",
  tornozeleiras: "Tornozeleiras",
  piercings: "Piercings",
  outros: "Outros",
};

/**
 * Seção "Explore por Categoria" da home.
 *
 * Cards usam a silhueta SVG do PlaceholderProductImage como assinatura visual
 * por categoria, sem o microcopy "FOTO EM BREVE" (apenas o motif). Click
 * navega pra rota /[categoria] que renderiza grid completo da categoria.
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
            return (
              <li key={categoria}>
                <Link
                  href={`/${categoria}`}
                  className="group block overflow-hidden rounded-sm bg-white transition-transform duration-300 ease-out hover:-translate-y-0.5"
                  aria-label={`${label} — ${count} ${
                    count === 1 ? "peça" : "peças"
                  }`}
                >
                  <div className="relative">
                    <PlaceholderProductImage
                      categoria={categoria}
                      showLabel={false}
                      alt=""
                      className="aspect-[4/3] md:aspect-square"
                    />
                  </div>
                  <div className="flex flex-col gap-1 px-4 py-4 md:px-5 md:py-5">
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
                        letterSpacing: "0.18em",
                        textTransform: "uppercase",
                      }}
                    >
                      {count} {count === 1 ? "peça" : "peças"}
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
