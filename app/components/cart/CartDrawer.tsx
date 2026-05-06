"use client";

import { useEffect, type FC } from "react";
import { useCart } from "../../../lib/cart/store";
import { formatBRL } from "../../../lib/format/currency";
import {
  montarMensagemWhatsApp,
  salvarSnapshotPedido,
} from "../../../lib/cart/whatsapp";
import { useChatbot } from "../../../lib/chat/store";

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
  <svg
    width="20"
    height="20"
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    aria-hidden="true"
  >
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

export const CartDrawer: FC = () => {
  const items = useCart((s) => s.items);
  const isOpen = useCart((s) => s.isOpen);
  const close = useCart((s) => s.close);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const clear = useCart((s) => s.clear);
  const totalCents = useCart((s) => s.totalCents());
  const itemCount = useCart((s) => s.itemCount());
  const openChatbot = useChatbot((s) => s.open);

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
    const { url, pedidoId, subtotalCents } = montarMensagemWhatsApp(items);
    salvarSnapshotPedido(pedidoId, items, subtotalCents);
    window.open(url, "_blank", "noopener,noreferrer");
    clear();
    close();
  };

  const handleAbrirBot = () => {
    close();
    openChatbot();
  };

  return (
    <>
      {/* Backdrop */}
      <div
        aria-hidden={!isOpen}
        onClick={close}
        className="fixed inset-0 z-40 bg-black/35 transition-opacity duration-300"
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
        className="fixed right-0 top-0 z-50 flex h-full w-full max-w-md flex-col bg-[#FFF7EE] shadow-2xl transition-transform duration-300 ease-out"
        style={{
          transform: isOpen ? "translateX(0)" : "translateX(100%)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b px-6 py-5"
          style={{ borderColor: "rgba(138, 110, 92, 0.2)" }}>
          <h2
            className="font-hero"
            style={{
              fontSize: "26px",
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
            className="-mr-2 inline-flex h-9 w-9 items-center justify-center rounded-full transition-colors hover:bg-black/5"
            style={{ color: "var(--color-preto-warm, #251008)" }}
          >
            <CloseIcon />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 px-8 text-center">
              <p
                style={{
                  fontFamily: "var(--font-secondary, Inter, system-ui, sans-serif)",
                  fontSize: "14px",
                  letterSpacing: "0.02em",
                  color: "rgba(37, 16, 8, 0.6)",
                }}
              >
                Seu carrinho está vazio.
              </p>
              <a
                href="/produtos"
                onClick={close}
                className="text-[11px] uppercase tracking-[0.22em] transition"
                style={{
                  color: "var(--color-preto-warm, #251008)",
                  textDecoration: "underline",
                  textUnderlineOffset: "4px",
                }}
              >
                Ver todas as peças →
              </a>
            </div>
          ) : (
            <ul className="flex flex-col" data-testid="cart-items">
              {items.map((item) => (
                <li
                  key={item.slug}
                  className="flex gap-4 border-b px-6 py-5"
                  style={{ borderColor: "rgba(138, 110, 92, 0.15)" }}
                >
                  {/* Foto */}
                  <div
                    className="h-20 w-20 flex-shrink-0 overflow-hidden bg-[var(--color-salmao-claro)]"
                    style={{ borderRadius: "2px" }}
                  >
                    {item.fotoUrl ? (
                      <img
                        src={item.fotoUrl}
                        alt=""
                        className="h-full w-full object-cover"
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
                  <div className="flex flex-1 flex-col gap-2">
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
                        className="-mr-1 -mt-1 inline-flex h-7 w-7 items-center justify-center rounded-full transition-colors hover:bg-black/5"
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
                        aria-label="Diminuir quantidade"
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                        style={{
                          border: "1px solid rgba(138, 110, 92, 0.35)",
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
                        className="inline-flex h-7 w-7 items-center justify-center rounded-full"
                        style={{
                          border: "1px solid rgba(138, 110, 92, 0.35)",
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

        {/* Footer com subtotal + CTAs */}
        {items.length > 0 && (
          <div
            className="border-t px-6 py-5"
            style={{ borderColor: "rgba(138, 110, 92, 0.2)" }}
          >
            <div className="mb-4 flex items-baseline justify-between">
              <span
                style={{
                  fontFamily:
                    "var(--font-secondary, Inter, system-ui, sans-serif)",
                  fontSize: "11px",
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  color: "rgba(37, 16, 8, 0.65)",
                }}
              >
                Subtotal
              </span>
              <span
                className="font-hero"
                style={{
                  fontSize: "26px",
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
            <div className="flex flex-col gap-2.5">
              <button
                type="button"
                onClick={handleFinalizarWhatsApp}
                data-testid="cart-finalizar-whatsapp"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3.5 transition-colors"
                style={{
                  fontFamily:
                    "var(--font-secondary, Inter, system-ui, sans-serif)",
                  fontSize: "13px",
                  letterSpacing: "0.16em",
                  textTransform: "uppercase",
                  fontWeight: 600,
                  backgroundColor: "var(--color-preto-warm, #251008)",
                  color: "#FFF1ED",
                }}
              >
                <span>Finalizar pelo WhatsApp</span>
                <span aria-hidden="true">→</span>
              </button>
              <button
                type="button"
                onClick={handleAbrirBot}
                data-testid="cart-abrir-bot"
                className="inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 transition-colors"
                style={{
                  fontFamily:
                    "var(--font-secondary, Inter, system-ui, sans-serif)",
                  fontSize: "12px",
                  letterSpacing: "0.14em",
                  textTransform: "uppercase",
                  fontWeight: 500,
                  backgroundColor: "transparent",
                  color: "var(--color-preto-warm, #251008)",
                  border: "1px solid rgba(138, 110, 92, 0.45)",
                }}
              >
                <span>Falar com a Ellen IA</span>
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
