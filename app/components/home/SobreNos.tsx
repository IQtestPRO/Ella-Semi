"use client";

import { useState, type FC } from "react";
import { SectionHeading } from "./SectionHeading";

type FaqItem = {
  q: string;
  a: string;
};

const FAQ: FaqItem[] = [
  {
    q: "Como compro uma peça?",
    a: "Você adiciona a peça ao carrinho e clica em finalizar pelo WhatsApp. Abrimos a conversa com a Ellen direto no app, com sua escolha já formatada — sem cadastro, sem checkout no site.",
  },
  {
    q: "Vocês entregam pra todo Brasil?",
    a: "Sim. O frete é combinado pelo WhatsApp junto com seu endereço. A Ellen passa o valor antes de fechar o pedido.",
  },
  {
    q: "As peças têm garantia?",
    a: "Semijoias têm garantia de 6 meses a 1 ano contra defeitos de fabricação. A garantia não cobre mau uso nem pinos de brincos. Bijuterias não têm garantia.",
  },
  {
    q: "Posso trocar uma peça depois?",
    a: "Sim — exceto peças em promoção, que não são trocadas. Pra trocar, fala com a Ellen no WhatsApp em até 7 dias da entrega.",
  },
  {
    q: "Como funcionam peças sob encomenda?",
    a: "Cordões personalizados (gravação, comprimento sob medida) e peças sob encomenda exigem pagamento prévio. A Ellen confirma prazo e valor antes de iniciar a produção.",
  },
  {
    q: "Atendimento personalizado?",
    a: "Direto pela Ellen no WhatsApp. Você pode pedir foto extra de uma peça, tirar dúvida sobre tamanho, ou montar um look — atendimento humano, sem bot.",
  },
];

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
    className="transition-transform duration-300"
    style={{
      transform: open ? "rotate(45deg)" : "rotate(0deg)",
    }}
  >
    <line x1="7" y1="1.5" x2="7" y2="12.5" />
    <line x1="1.5" y1="7" x2="12.5" y2="7" />
  </svg>
);

export function SobreNos() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section
      aria-labelledby="sobre-nos-heading"
      className="w-full bg-[var(--color-salmao-claro)] px-5 py-20 md:px-10 md:py-28"
    >
      <div className="mx-auto grid max-w-[1180px] gap-16 md:grid-cols-2 md:gap-20">
        {/* Coluna 1 — Manifesto */}
        <div className="flex flex-col gap-6">
          <div id="sobre-nos-heading">
            <SectionHeading
              title="Sobre a ELLA"
              subtitle="warm editorial soft glam"
            />
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
            <p>
              A ELLA nasceu em Niterói pra mulheres que escolhem peças pra
              acompanhar o dia inteiro — do café da manhã ao jantar. Semijoias
              com banho que dura, design contemporâneo e atendimento direto
              com a Ellen.
            </p>
            <p>
              Sem checkout impessoal. Você escolhe, finaliza pelo WhatsApp, e a
              gente conversa. Cada peça sai com cuidado — porque cada peça
              continua uma história em ouro.
            </p>
          </div>

          <a
            href="https://wa.link/adq88g"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2 inline-flex w-fit items-center gap-2 rounded-full px-5 py-3 transition-colors"
            style={{
              fontFamily:
                "var(--font-secondary, Inter, system-ui, sans-serif)",
              fontSize: "12px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
              fontWeight: 600,
              backgroundColor: "var(--color-preto-warm, #251008)",
              color: "#FFF1ED",
            }}
          >
            <span>Falar com a Ellen</span>
            <span aria-hidden="true">→</span>
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
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              fontWeight: 600,
            }}
          >
            Perguntas frequentes
          </h3>

          <ul className="flex flex-col" data-testid="faq-list">
            {FAQ.map((item, i) => {
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
                      fontSize: "14px",
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
                    className="grid overflow-hidden transition-all duration-300 ease-out"
                    style={{
                      gridTemplateRows: open ? "1fr" : "0fr",
                    }}
                  >
                    <div className="overflow-hidden">
                      <p
                        className="pb-5 pr-8 text-[var(--color-preto-warm)]/75"
                        style={{
                          fontFamily:
                            "var(--font-secondary, Inter, system-ui, sans-serif)",
                          fontSize: "13.5px",
                          lineHeight: 1.65,
                          letterSpacing: "0.01em",
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
