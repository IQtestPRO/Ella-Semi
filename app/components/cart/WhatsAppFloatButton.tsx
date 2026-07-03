"use client";

import { type FC } from "react";
import { useCart } from "../../../lib/cart/store";
import { abrirWhatsAppComCarrinho } from "../../../lib/cart/whatsapp";
import { useSiteConfig } from "../SiteConfigProvider";

const WhatsAppGlyph: FC = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 32 32"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M16 3 C8.8 3 3 8.8 3 16 c0 2.5 0.7 4.9 2 7 L3 29 l6.2-1.9 c2 1.1 4.3 1.7 6.6 1.7 h0.2 c7.2 0 13-5.8 13-13 S23.2 3 16 3 z m0 23.6 c-2 0-3.9-0.5-5.6-1.5 l-0.4-0.2-4.2 1.3 1.3-4-0.3-0.5 c-1.1-1.7-1.6-3.7-1.6-5.7 0-5.9 4.8-10.7 10.8-10.7 2.9 0 5.5 1.1 7.6 3.1 2 2 3.1 4.7 3.1 7.6 0 5.9-4.9 10.7-10.7 10.7 z m5.9-8 c-0.3-0.2-1.9-0.9-2.2-1 -0.3-0.1-0.5-0.2-0.7 0.2-0.2 0.3-0.8 1-1 1.2 -0.2 0.2-0.4 0.2-0.7 0.1-0.3-0.2-1.4-0.5-2.6-1.6 -1-0.9-1.6-2-1.8-2.3 -0.2-0.3 0-0.5 0.1-0.6 0.1-0.1 0.3-0.4 0.5-0.5 0.2-0.2 0.2-0.3 0.3-0.5 0.1-0.2 0.1-0.4 0-0.5 -0.1-0.2-0.7-1.7-1-2.3 -0.2-0.6-0.5-0.5-0.7-0.5 -0.2 0-0.4 0-0.6 0 -0.2 0-0.6 0.1-0.8 0.4 -0.3 0.3-1.1 1.1-1.1 2.6 0 1.6 1.1 3.1 1.3 3.3 0.2 0.2 2.3 3.5 5.6 4.9 0.8 0.3 1.4 0.5 1.9 0.7 0.8 0.3 1.5 0.2 2 0.1 0.6-0.1 1.9-0.8 2.2-1.5 0.3-0.7 0.3-1.3 0.2-1.5 -0.1-0.2-0.3-0.3-0.6-0.4 z" />
  </svg>
);

/**
 * Floating Action Button — abre WhatsApp com a mensagem do carrinho já
 * montada (ou `wa.link/adq88g` se carrinho vazio). Substitui o chatbot
 * Ellen IA da S2.2 (ADR-0020 supersedes ADR-0019).
 *
 * - Position fixed bottom-right, z-index 30 (atrás do CartDrawer 40/50).
 * - Tap target 56x56 mobile / 64x64 desktop — ≥ HIG 44.
 * - Cor #25D366 (WhatsApp brand).
 * - Pulse ring sutil pra atrair atenção sem ser agressivo.
 */
export const WhatsAppFloatButton: FC = () => {
  const isHydrated = useCart((s) => s.isHydrated);
  const rawCount = useCart((s) => s.itemCount());
  const itemCount = isHydrated ? rawCount : 0;
  const config = useSiteConfig();

  const handleClick = () => {
    const items = useCart.getState().items;
    abrirWhatsAppComCarrinho(items, config);
  };

  const ariaLabel =
    itemCount > 0
      ? `Abrir WhatsApp com ${itemCount} ${itemCount === 1 ? "peça" : "peças"} do carrinho`
      : "Abrir WhatsApp com a Ellen";

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={ariaLabel}
      data-testid="whatsapp-float-button"
      className="fixed bottom-[calc(1.25rem+env(safe-area-inset-bottom))] right-5 z-30 inline-flex h-14 w-14 items-center justify-center rounded-full text-white shadow-lg hover:scale-105 active:scale-95 md:h-16 md:w-16"
      style={{
        backgroundColor: "#25D366",
        opacity: isHydrated ? 1 : 0,
        pointerEvents: isHydrated ? "auto" : "none",
        transition:
          "opacity 240ms var(--ease-out-soft), transform 200ms var(--ease-brand)",
      }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full"
        style={{
          backgroundColor: "#25D366",
          opacity: 0.35,
          animation: "ella-fab-pulse 2.4s ease-out infinite",
        }}
      />
      <span className="relative">
        <WhatsAppGlyph />
      </span>
    </button>
  );
};
