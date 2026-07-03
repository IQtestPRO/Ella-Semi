"use client";

import { useState, type FC } from "react";
import { SectionHeading } from "./SectionHeading";

type FaqItem = {
  q: string;
  a: string;
};

type SobreContent = {
  titulo: string;
  subtitulo: string;
  paragrafos: string[];
  ctaTexto: string;
  ctaHref: string;
};

const Plus: FC<{ open: boolean }> = ({ open }) => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 14 14"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    aria-hidden="true"
    className="transition-transform duration-300 ease-brand"
    style={{
      transform: open ? "rotate(45deg)" : "rotate(0deg)",
    }}
  >
    <line x1="7" y1="1.5" x2="7" y2="12.5" />
    <line x1="1.5" y1="7" x2="12.5" y2="7" />
  </svg>
);

export function SobreNos({
  sobre,
  faq,
}: {
  sobre: SobreContent;
  faq: FaqItem[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      aria-labelledby="sobre-nos-heading"
      className="w-full bg-[var(--color-salmao-claro)] px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto grid max-w-[1180px] gap-16 md:grid-cols-2 md:gap-20">
        {/* Coluna 1 — Manifesto */}
        <div className="flex flex-col gap-6">
          <div id="sobre-nos-heading">
            <SectionHeading title={sobre.titulo} subtitle={sobre.subtitulo} />
          </div>
          <div
            className="flex flex-col gap-5 text-[var(--color-preto-warm)]/85"
            style={{
              fontFamily:
                "var(--font-secondary, Inter, system-ui, sans-serif)",
              fontSize: "15px",
              lineHeight: 1.7,
              letterSpacing: "0.01em",
            }}
          >
            {sobre.paragrafos.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          <a
            href={sobre.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="group mt-2 inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 transition-[filter,transform] duration-200 ease-brand hover:brightness-125 active:scale-[0.98]"
            style={{
              fontFamily:
                "var(--font-secondary, Inter, system-ui, sans-serif)",
              fontSize: "12px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 600,
              backgroundColor: "var(--color-preto-warm, #251008)",
              color: "#FFF1ED",
            }}
          >
            <span>{sobre.ctaTexto}</span>
            <span
              aria-hidden="true"
              className="transition-transform duration-200 ease-brand group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
        </div>

        {/* Coluna 2 — FAQ accordion */}
        <div className="flex flex-col gap-2">
          <h3
            className="mb-4 text-[var(--color-preto-warm)]/70"
            style={{
              fontFamily:
                "var(--font-secondary, Inter, system-ui, sans-serif)",
              fontSize: "11px",
              letterSpacing: "0.16em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Perguntas frequentes
          </h3>

          <ul className="flex flex-col" data-testid="faq-list">
            {faq.map((item, i) => {
              const open = openIndex === i;
              return (
                <li
                  key={item.q}
                  className="border-b"
                  style={{ borderColor: "rgba(138, 110, 92, 0.22)" }}
                >
                  <button
                    type="button"
                    onClick={() => setOpenIndex(open ? null : i)}
                    aria-expanded={open}
                    aria-controls={`faq-panel-${i}`}
                    className="flex w-full items-center justify-between gap-4 py-4 text-left transition-colors"
                    style={{
                      fontFamily:
                        "var(--font-secondary, Inter, system-ui, sans-serif)",
                      fontSize: "15px",
                      letterSpacing: "0.01em",
                      fontWeight: 500,
                      color: "var(--color-preto-warm, #251008)",
                    }}
                  >
                    <span>{item.q}</span>
                    <span className="flex-shrink-0 text-[var(--color-preto-warm)]/55">
                      <Plus open={open} />
                    </span>
                  </button>
                  <div
                    id={`faq-panel-${i}`}
                    role="region"
                    aria-labelledby={`faq-q-${i}`}
                    className="grid overflow-hidden"
                    style={{
                      gridTemplateRows: open ? "1fr" : "0fr",
                      transition: "grid-template-rows 300ms var(--ease-brand)",
                    }}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="pb-5 pr-8 text-[var(--color-preto-warm)]/75"
                        style={{
                          fontFamily:
                            "var(--font-secondary, Inter, system-ui, sans-serif)",
                          fontSize: "14px",
                          lineHeight: 1.65,
                          letterSpacing: "0.01em",
                          opacity: open ? 1 : 0,
                          transition: "opacity 220ms var(--ease-brand)",
                        }}
                      >
                        {item.a}
                      </p>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
