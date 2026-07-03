"use client";

import { useEffect, type FC } from "react";
import { useCart } from "../../../lib/cart/store";
import { formatBRL } from "../../../lib/format/currency";
import { abrirWhatsAppComCarrinho } from "../../../lib/cart/whatsapp";
import { useSiteConfig } from "../SiteConfigProvider";
import { Sparkle } from "../Sparkle";

const TrashIcon: FC = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="2" y1="4" x2="14" y2="4" />
    <path d="M5 4 V2.5 a1 1 0 0 1 1-1 h4 a1 1 0 0 1 1 1 V4" />
    <path d="M3.5 4 L4.5 14 a1 1 0 0 0 1 1 h5 a1 1 0 0 0 1-1 L12.5 4" />
  </svg>
);

const CloseIcon: FC = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" aria-hidden="true">
    <line x1="5" y1="5" x2="15" y2="15" />
    <line x1="15" y1="5" x2="5" y2="15" />
  </svg>
);

const PlusMinus: FC<{ kind: "+" | "-" }> = ({ kind }) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden="true">
    <line x1="1.5" y1="5.5" x2="9.5" y2="5.5" />
    {kind === "+" && <line x1="5.5" y1="1.5" x2="5.5" y2="9.5" />}
  </svg>
);

const WhatsAppMiniGlyph: FC = () => (
  <svg width="18" height="18" viewBox="0 0 32 32" fill="currentColor" aria-hidden="true">
    <path d="M16 3 C8.8 3 3 8.8 3 16 c0 2.5 0.7 4.9 2 7 L3 29 l6.2-1.9 c2 1.1 4.3 1.7 6.6 1.7 h0.2 c7.2 0 13-5.8 13-13 S23.2 3 16 3 z m0 23.6 c-2 0-3.9-0.5-5.6-1.5 l-0.4-0.2-4.2 1.3 1.3-4-0.3-0.5 c-1.1-1.7-1.6-3.7-1.6-5.7 0-5.9 4.8-10.7 10.8-10.7 2.9 0 5.5 1.1 7.6 3.1 2 2 3.1 4.7 3.1 7.6 0 5.9-4.9 10.7-10.7 10.7 z m5.9-8 c-0.3-0.2-1.9-0.9-2.2-1 -0.3-0.1-0.5-0.2-0.7 0.2-0.2 0.3-0.8 1-1 1.2 -0.2 0.2-0.4 0.2-0.7 0.1-0.3-0.2-1.4-0.5-2.6-1.6 -1-0.9-1.6-2-1.8-2.3 -0.2-0.3 0-0.5 0.1-0.6 0.1-0.1 0.3-0.4 0.5-0.5 0.2-0.2 0.2-0.3 0.3-0.5 0.1-0.2 0.1-0.4 0-0.5 -0.1-0.2-0.7-1.7-1-2.3 -0.2-0.6-0.5-0.5-0.7-0.5 -0.2 0-0.4 0-0.6 0 -0.2 0-0.6 0.1-0.8 0.4 -0.3 0.3-1.1 1.1-1.1 2.6 0 1.6 1.1 3.1 1.3 3.3 0.2 0.2 2.3 3.5 5.6 4.9 0.8 0.3 1.4 0.5 1.9 0.7 0.8 0.3 1.5 0.2 2 0.1 0.6-0.1 1.9-0.8 2.2-1.5 0.3-0.7 0.3-1.3 0.2-1.5 -0.1-0.2-0.3-0.3-0.6-0.4 z" />
  </svg>
);

export const CartDrawer: FC = () => {
  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const totalCents = useCart((s) => s.totalCents());
  const itemCount = useCart((s) => s.itemCount());
  const config = useSiteConfig();

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    }
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, close]);

  const handleFinalizarWhatsApp = () => {
    if (items.length === 0) return;
    abrirWhatsAppComCarrinho(items, config);
    clear();
    close();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!isOpen}
        onClick={close}
        className="fixed inset-0 z-40 bg-black/35 transition-opacity duration-300 ease-brand"
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? "auto" : "none",
        }}
      />

      {/* Drawer */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrinho"
        data-testid="cart-drawer"
        inert={!isOpen}
        aria-hidden={!isOpen}
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#FFF7EE] shadow-2xl transition-transform duration-300 ease-brand will-change-transform"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
          pointerEvents: isOpen ? "auto" : "none",
        }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between border-b px-5 py-4 md:px-6 md:py-5"
          style={{ borderColor: "rgba(138, 110, 92, 0.2)" }}
        >
          <h2
            className="font-hero"
            style={{
              fontSize: "clamp(22px, 5vw, 26px)",
              fontWeight: 400,
              letterSpacing: "0.02em",
              color: "var(--color-preto-warm, #251008)",
            }}
          >
            Seu carrinho
            {itemCount > 0 && (
              <span
                className="ml-3 inline-flex h-6 min-w-6 items-center justify-center rounded-full px-2"
                style={{
                  backgroundColor: "#D99A30",
                  color: "#FFF1ED",
                  fontSize: "11px",
                  fontFamily: "var(--font-secondary, Inter, system-ui, sans-serif)",
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                {itemCount}
              </span>
            )}
          </h2>
          <button
            type="button"
            onClick={close}
            aria-label="Fechar carrinho"
            className="-mr-2 inline-flex h-11 w-11 items-center justify-center rounded-full transition-colors hover:bg-black/5"
            style={{ color: "var(--color-preto-warm, #251008)" }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-5 px-8 text-center">
              <Sparkle size={26} />
              <p
                className="font-hero"
                style={{
                  fontSize: "22px",
                  fontWeight: 400,
                  lineHeight: 1.3,
                  color: "var(--color-preto-warm, #251008)",
                  maxWidth: "16ch",
                }}
              >
                Sua próxima peça favorita está no catálogo.
              </p>
              <a
                href="/produtos"
                onClick={close}
                className="inline-flex items-center justify-center rounded-full bg-[var(--color-preto-warm)] px-7 py-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-[#FFF1ED] transition-[background-color,transform] duration-200 ease-brand hover:bg-[#3A2015] active:scale-[0.98]"
                style={{
                  fontFamily: "var(--font-secondary, Inter, system-ui, sans-serif)",
                }}
              >
                Ver todas as peças
              </a>
            </div>
          ) : (
            <ul className="flex flex-col" data-testid="cart-items">
              {items.map((item) => (
                <li
                  key={item.slug}
                  className="flex gap-3 border-b px-5 py-4 md:gap-4 md:px-6 md:py-5"
                  style={{ borderColor: "rgba(138, 110, 92, 0.15)" }}
                >
                  {/* Foto */}
                  <div
                    className="h-20 w-20 flex-shrink-0 overflow-hidden bg-[var(--color-salmao-claro)] md:h-24 md:w-24"
                    style={{ borderRadius: "2px" }}
                  >
                    {item.fotoUrl ? (
                      <img
                        src={item.fotoUrl}
                        alt=""
                        className="h-full w-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />
                    ) : (
                      <div
                        className="h-full w-full"
                        style={{
                          background:
                            "linear-gradient(135deg, #FFD9CC 0%, #F0DCC4 100%)",
                        }}
                      />
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex flex-1 flex-col gap-1.5 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p
                        className="font-hero text-[var(--color-preto-warm)]"
                        style={{
                          fontSize: "15px",
                          lineHeight: 1.3,
                          fontWeight: 400,
                        }}
                      >
                        {item.nome}
                      </p>
                      <button
                        type="button"
                        onClick={() => remove(item.slug)}
                        aria-label={`Remover ${item.nome} do carrinho`}
                        className="-mr-1 -mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5"
                        style={{ color: "rgba(37, 16, 8, 0.5)" }}
                      >
                        <TrashIcon />
                      </button>
                    </div>
                    <span
                      style={{
                        fontFamily:
                          "var(--font-secondary, Inter, system-ui, sans-serif)",
                        fontSize: "13px",
                        color: "rgba(37, 16, 8, 0.7)",
                      }}
                    >
                      {formatBRL(item.precoCents)}
                    </span>
                    <div className="mt-1 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => setQty(item.slug, item.qty - 1)}
                        aria-label={
                          item.qty === 1
                            ? `Remover ${item.nome}`
                            : "Diminuir quantidade"
                        }
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(138,110,92,0.35)] transition-[background-color,border-color,transform] duration-150 ease-brand hover:border-[var(--color-dourado)] hover:bg-[rgba(217,154,48,0.08)] active:scale-95"
                        style={{
                          color: "var(--color-preto-warm, #251008)",
                        }}
                      >
                        <PlusMinus kind="-" />
                      </button>
                      <span
                        className="min-w-6 text-center"
                        style={{
                          fontFamily:
                            "var(--font-secondary, Inter, system-ui, sans-serif)",
                          fontSize: "13px",
                          fontWeight: 500,
                        }}
                      >
                        {item.qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => setQty(item.slug, item.qty + 1)}
                        aria-label="Aumentar quantidade"
                        className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(138,110,92,0.35)] transition-[background-color,border-color,transform] duration-150 ease-brand hover:border-[var(--color-dourado)] hover:bg-[rgba(217,154,48,0.08)] active:scale-95"
                        style={{
                          color: "var(--color-preto-warm, #251008)",
                        }}
                      >
                        <PlusMinus kind="+" />
                      </button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer com subtotal + CTA WhatsApp */}
        {items.length > 0 && (
          <div
            className="border-t px-5 py-4 md:px-6 md:py-5"
            style={{ borderColor: "rgba(138, 110, 92, 0.2)" }}
          >
            <div className="mb-4 flex items-baseline justify-between">
              <span
                style={{
                  fontFamily:
                    "var(--font-secondary, Inter, system-ui, sans-serif)",
                  fontSize: "11px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  color: "rgba(37, 16, 8, 0.65)",
                }}
              >
                Subtotal
              </span>
              <span
                className="font-hero"
                style={{
                  fontSize: "clamp(22px, 5vw, 26px)",
                  fontWeight: 400,
                  color: "var(--color-preto-warm, #251008)",
                }}
                data-testid="cart-subtotal"
              >
                {formatBRL(totalCents)}
              </span>
            </div>
            <p
              className="mb-4 text-center"
              style={{
                fontFamily:
                  "var(--font-secondary, Inter, system-ui, sans-serif)",
                fontSize: "11px",
                letterSpacing: "0.04em",
                color: "rgba(37, 16, 8, 0.55)",
              }}
            >
              Frete a combinar pelo WhatsApp.
            </p>
            <button
              type="button"
              onClick={handleFinalizarWhatsApp}
              data-testid="cart-finalizar-whatsapp"
              className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 transition-[filter,transform] duration-200 ease-brand hover:brightness-105 active:scale-[0.98] active:brightness-95"
              style={{
                fontFamily:
                  "var(--font-secondary, Inter, system-ui, sans-serif)",
                fontSize: "13px",
                letterSpacing: "0.16em",
                textTransform: "uppercase",
                fontWeight: 600,
                backgroundColor: "#25D366",
                color: "#FFFFFF",
              }}
            >
              <WhatsAppMiniGlyph />
              <span>Finalizar pelo WhatsApp</span>
            </button>
          </div>
        )}
      </aside>
    </>
  );
};
