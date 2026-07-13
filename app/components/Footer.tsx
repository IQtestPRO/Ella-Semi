import Link from "next/link";
import type { FC } from "react";
import { getSetting } from "../../lib/settings";

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
 * Rodapé — conteúdo (colunas, tagline, microcopy) vem das `settings` (banco),
 * editável pela Ellen no /admin. Links externos abrem em nova aba; internos
 * usam next/link. ADR-0021.
 */
export async function Footer() {
  const footer = await getSetting("footer");

  return (
    <footer
      role="contentinfo"
      className="w-full bg-[var(--color-preto-warm)] text-[#FFF1ED]"
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
            {footer.wordmarkTagline}
          </p>
        </div>

        {/* Columns */}
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
          {footer.colunas.map((col) => (
            <div key={col.heading} className="flex flex-col gap-3">
              <h3
                className="text-[#EFC78B]"
                style={{
                  fontFamily:
                    "var(--font-secondary, Inter, system-ui, sans-serif)",
                  fontSize: "11px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                }}
              >
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-0.5">
                {col.links.map((l) => (
                  <li key={`${l.label}-${l.href}`}>
                    {l.external ? (
                      <a
                        href={l.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex min-h-[44px] items-center text-[#FFF1ED]/85 transition-colors duration-200 ease-out-soft hover:text-[#FFF1ED] active:opacity-70"
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
                        className="flex min-h-[44px] items-center text-[#FFF1ED]/85 transition-colors duration-200 ease-out-soft hover:text-[#FFF1ED] active:opacity-70"
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
            letterSpacing: "0.16em",
            textTransform: "uppercase",
          }}
        >
          {footer.microcopy}
        </div>
      </div>
    </footer>
  );
}
