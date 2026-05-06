import type { FC, ReactNode } from "react";

type Props = {
  /** Heading principal — Bodoni Moda */
  title: string;
  /** Subheading microcopy — Inter */
  subtitle?: string;
  /** Conteúdo adicional alinhado à direita (chips, sort, CTA) — opcional */
  rightSlot?: ReactNode;
  /** Tag semântica do heading (defaults to h2) */
  as?: "h2" | "h3";
};

const Sparkle: FC<{ size?: number }> = ({ size = 12 }) => (
  <svg
    width={size}
    height={size}
    viewBox="-9 -9 18 18"
    fill="#D99A30"
    aria-hidden="true"
  >
    <path d="M0,-8 L1.6,-1.6 L8,0 L1.6,1.6 L0,8 L-1.6,1.6 L-8,0 L-1.6,-1.6 Z" />
  </svg>
);

/**
 * Heading canônico das seções da home.
 *
 * - Bodoni Moda no título principal
 * - Sparkle dourado divider sobre o título
 * - Subtitle Inter uppercase tracking 0.16em
 *
 * Pattern reutilizável pra MAIS VENDIDOS, Favoritas da Ella, Categorias,
 * Todas as Peças, etc.
 */
export const SectionHeading: FC<Props> = ({
  title,
  subtitle,
  rightSlot,
  as: Tag = "h2",
}) => {
  return (
    <header className="mb-10 flex flex-col gap-3 md:mb-14 md:flex-row md:items-end md:justify-between">
      <div className="flex flex-col gap-2.5">
        <div className="flex items-center gap-2.5">
          <span
            className="block"
            style={{
              width: 28,
              height: 1,
              backgroundColor: "rgba(217, 154, 48, 0.5)",
            }}
          />
          <Sparkle />
          <span
            className="block"
            style={{
              width: 28,
              height: 1,
              backgroundColor: "rgba(217, 154, 48, 0.5)",
            }}
          />
        </div>
        <Tag
          className="font-hero text-[var(--color-preto-warm)]"
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            lineHeight: 1.05,
            letterSpacing: "0.02em",
            fontWeight: 400,
          }}
        >
          {title}
        </Tag>
        {subtitle && (
          <p
            className="text-[var(--color-preto-warm)]/70"
            style={{
              fontFamily:
                "var(--font-secondary, Inter, system-ui, sans-serif)",
              fontSize: "13px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 400,
            }}
          >
            {subtitle}
          </p>
        )}
      </div>
      {rightSlot && <div className="flex flex-shrink-0">{rightSlot}</div>}
    </header>
  );
};
