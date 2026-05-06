import type { FC, ReactNode } from "react";
import type { Categoria } from "../../../lib/schemas";

type SilhuetaProps = { className?: string };

const SilhuetaBrinco: FC<SilhuetaProps> = () => (
  <g>
    <path
      d="M-22,-32 Q-4,-44 8,-30 Q22,-12 14,12 Q4,32 -10,28 Q-26,18 -28,-4 Q-30,-22 -22,-32 Z"
      strokeLinejoin="round"
    />
    <path
      d="M-10,-26 Q0,-4 4,22"
      stroke="currentColor"
      strokeWidth="0.6"
      fill="none"
      opacity="0.5"
    />
  </g>
);

const SilhuetaColar: FC<SilhuetaProps> = () => (
  <g>
    <path
      d="M-58,-30 Q-30,-46 0,-46 Q30,-46 58,-30"
      stroke="currentColor"
      strokeWidth="1.4"
      fill="none"
    />
    <line x1="0" y1="-44" x2="0" y2="-2" stroke="currentColor" strokeWidth="0.8" />
    <path d="M-9,-2 Q-12,16 0,30 Q12,16 9,-2 Q4,-8 0,-8 Q-4,-8 -9,-2 Z" />
  </g>
);

const SilhuetaPulseira: FC<SilhuetaProps> = () => (
  <g>
    <ellipse cx="0" cy="0" rx="56" ry="22" fill="none" stroke="currentColor" strokeWidth="1.6" />
    <circle cx="-30" cy="-12" r="2.5" />
    <circle cx="0" cy="-18" r="2.5" />
    <circle cx="30" cy="-12" r="2.5" />
    <circle cx="-30" cy="12" r="2" />
    <circle cx="30" cy="12" r="2" />
  </g>
);

const SilhuetaAnel: FC<SilhuetaProps> = () => (
  <g>
    <circle cx="0" cy="6" r="26" fill="none" stroke="currentColor" strokeWidth="2" />
    <circle cx="0" cy="-22" r="6" />
    <circle cx="0" cy="-22" r="2.5" fill="#FFD9CC" />
  </g>
);

const SilhuetaConjunto: FC<SilhuetaProps> = () => (
  <g>
    <path
      d="M-46,-30 Q-22,-42 0,-42 Q22,-42 46,-30"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    <path d="M-7,-2 Q-10,14 0,26 Q10,14 7,-2 Q3,-7 0,-7 Q-3,-7 -7,-2 Z" />
    <path
      d="M-32,-2 Q-26,-10 -22,-2 Q-22,8 -28,12 Q-34,8 -32,-2 Z"
      opacity="0.85"
    />
    <path
      d="M22,-2 Q26,-10 32,-2 Q34,8 28,12 Q22,8 22,-2 Z"
      opacity="0.85"
    />
  </g>
);

const SilhuetaGargantilha: FC<SilhuetaProps> = () => (
  <g>
    <path
      d="M-50,-12 Q-28,-22 0,-22 Q28,-22 50,-12"
      stroke="currentColor"
      strokeWidth="2"
      fill="none"
    />
    <path
      d="M-50,-12 Q-28,-2 0,-2 Q28,-2 50,-12"
      stroke="currentColor"
      strokeWidth="0.8"
      fill="none"
      opacity="0.6"
    />
  </g>
);

const SilhuetaTornozeleira: FC<SilhuetaProps> = () => (
  <g>
    <path
      d="M-54,0 Q-30,-14 0,-14 Q30,-14 54,0"
      stroke="currentColor"
      strokeWidth="1.2"
      fill="none"
    />
    <circle cx="-30" cy="-9" r="1.6" />
    <circle cx="-15" cy="-13" r="1.6" />
    <circle cx="0" cy="-14" r="1.6" />
    <circle cx="15" cy="-13" r="1.6" />
    <circle cx="30" cy="-9" r="1.6" />
  </g>
);

const SilhuetaPiercing: FC<SilhuetaProps> = () => (
  <g>
    <circle cx="0" cy="-8" r="6" fill="none" stroke="currentColor" strokeWidth="2" />
    <line x1="0" y1="-2" x2="0" y2="22" stroke="currentColor" strokeWidth="2" />
    <circle cx="0" cy="-8" r="2.5" />
  </g>
);

const SilhuetaOutros: FC<SilhuetaProps> = () => (
  <g>
    <circle cx="0" cy="0" r="28" fill="none" stroke="currentColor" strokeWidth="1.4" />
    <path d="M-10,-4 L0,-14 L10,-4 L4,8 L-4,8 Z" />
  </g>
);

const SILHUETA_BY_CATEGORIA: Record<Categoria, FC<SilhuetaProps>> = {
  brincos: SilhuetaBrinco,
  colares: SilhuetaColar,
  pulseiras: SilhuetaPulseira,
  aneis: SilhuetaAnel,
  conjuntos: SilhuetaConjunto,
  gargantilhas: SilhuetaGargantilha,
  tornozeleiras: SilhuetaTornozeleira,
  piercings: SilhuetaPiercing,
  outros: SilhuetaOutros,
};

const Sparkle: FC = () => (
  <g transform="translate(168, 32)" fill="#D99A30" aria-hidden="true">
    <path d="M0,-9 L1.6,-1.6 L9,0 L1.6,1.6 L0,9 L-1.6,1.6 L-9,0 L-1.6,-1.6 Z" />
    <circle cx="0" cy="0" r="1.4" fill="#FFFFFF" opacity="0.7" />
  </g>
);

type Props = {
  categoria: Categoria;
  alt?: string;
  showLabel?: boolean;
  className?: string;
};

export const PlaceholderProductImage: FC<Props> = ({
  categoria,
  alt,
  showLabel = true,
  className = "",
}) => {
  const Silhueta = SILHUETA_BY_CATEGORIA[categoria] ?? SilhuetaOutros;
  const accessibleLabel =
    alt ?? `Foto em breve — ${categoria === "aneis" ? "anel" : categoria.replace(/s$/, "")}`;

  return (
    <div
      role="img"
      aria-label={accessibleLabel}
      data-categoria={categoria}
      className={`relative aspect-square overflow-hidden ${className}`.trim()}
      style={{
        background:
          "linear-gradient(135deg, #FFD9CC 0%, #F8E0CD 45%, #F0DCC4 100%)",
      }}
    >
      <svg
        viewBox="0 0 200 200"
        className="absolute inset-0 h-full w-full"
        aria-hidden="true"
      >
        <g transform="translate(100, 100)" fill="#8A6E5C" opacity="0.35">
          <Silhueta />
        </g>
        <Sparkle />
      </svg>
      {showLabel && (
        <span
          className="absolute bottom-[14%] left-1/2 -translate-x-1/2 select-none text-[9px] uppercase"
          style={{
            color: "#8A6E5C",
            letterSpacing: "0.32em",
            fontFamily: "var(--font-secondary, Inter, system-ui, sans-serif)",
            fontWeight: 300,
          }}
        >
          Foto em breve
        </span>
      )}
    </div>
  );
};
