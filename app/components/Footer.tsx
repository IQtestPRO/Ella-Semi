import Link from "next/link";
import type { FC } from "react";

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

const COLUMNS: Array<{
  heading: string;
  links: Array<{ label: string; href: string; external?: boolean }>;
}> = [
  {
    heading: "Sobre",
    links: [
      { label: "A marca", href: "/sobre" },
      { label: "Manifesto", href: "/sobre#manifesto" },
      { label: "Privacidade", href: "/privacidade" },
    ],
  },
  {
    heading: "Categorias",
    links: [
      { label: "Brincos", href: "/brincos" },
      { label: "Colares", href: "/colares" },
      { label: "Pulseiras", href: "/pulseiras" },
      { label: "Anéis", href: "/aneis" },
      { label: "Conjuntos", href: "/conjuntos" },
    ],
  },
  {
    heading: "Atendimento",
    links: [
      {
        label: "WhatsApp",
        href: "https://wa.link/adq88g",
        external: true,
      },
      { label: "Política de troca", href: "/troca" },
      { label: "Sob encomenda", href: "/sob-encomenda" },
    ],
  },
  {
    heading: "Redes",
    links: [
      {
        label: "Instagram",
        href: "https://www.instagram.com/ella.semijoias",
        external: true,
      },
      { label: "Email", href: "mailto:contato@ella-semijoias.com.br" },
    ],
  },
];

export function Footer() {
  return (
    <footer
      role="contentinfo"
      className="w-full bg-[var(--color-preto-warm)] text-[#FFF1ED] mt-12"
    >
      {/* Sparkle divider top */}
      <div className="flex items-center justify-center py-8">
        <span
          className="block"
          style={{
            width: 56,
            height: 1,
            backgroundColor: "rgba(217, 154, 48, 0.45)",
          }}
        />
        <span className="mx-3">
          <Sparkle size={14} />
        </span>
        <span
          className="block"
          style={{
            width: 56,
            height: 1,
            backgroundColor: "rgba(217, 154, 48, 0.45)",
          }}
        />
      </div>

      <div className="mx-auto max-w-[1280px] px-6 pb-12 md:px-10">
        {/* Wordmark */}
        <div className="mb-12 text-center">
          <h2
            className="font-hero"
            style={{
              fontSize: "clamp(40px, 6vw, 64px)",
              fontWeight: 400,
              letterSpacing: "0.04em",
            }}
          >
            ELLA
          </h2>
          <p
            className="mt-2 text-[#FFF1ED]/70"
            style={{
              fontFamily:
                "var(--font-secondary, Inter, system-ui, sans-serif)",
              fontSize: "11px",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
            }}
          >
            warm editorial soft glam
          </p>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {COLUMNS.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <h3
                className="text-[#EFC78B]"
                style={{
                  fontFamily:
                    "var(--font-secondary, Inter, system-ui, sans-serif)",
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((l) => (
                  <li key={l.href}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[#FFF1ED]/85 transition hover:text-[#FFF1ED]"
                        style={{
                          fontFamily:
                            "var(--font-secondary, Inter, system-ui, sans-serif)",
                          fontSize: "13px",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {l.label}
                      </a>
                    ) : (
                      <Link
                        href={l.href}
                        className="text-[#FFF1ED]/85 transition hover:text-[#FFF1ED]"
                        style={{
                          fontFamily:
                            "var(--font-secondary, Inter, system-ui, sans-serif)",
                          fontSize: "13px",
                          letterSpacing: "0.02em",
                        }}
                      >
                        {l.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Microcopy */}
        <div
          className="mt-12 border-t pt-6 text-center text-[#FFF1ED]/55"
          style={{
            borderColor: "rgba(255, 241, 237, 0.12)",
            fontFamily: "var(--font-secondary, Inter, system-ui, sans-serif)",
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
        >
          ELLA Semijoias · Outono 2026 · Niterói RJ
        </div>
      </div>
    </footer>
  );
}
