"use client";

import { type FC } from "react";
import { useCart } from "../../../lib/cart/store";

/**
 * Botão do header que abre o carrinho — substitui o Link estático que
 * antes ia pra /produtos. Mostra badge com contagem.
 */
export const CartButton: FC = () => {
  const isHydrated = useCart((s) => s.isHydrated);
  const rawCount = useCart((s) => s.itemCount());
  const open = useCart((s) => s.open);

  // Pre-hidratação: mantém estado neutro (0) pra casar com SSR. Após
  // localStorage carregar, atualiza pro valor real e re-renderiza.
  const itemCount = isHydrated ? rawCount : 0;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={
        itemCount > 0
          ? `Abrir carrinho com ${itemCount} ${itemCount === 1 ? "peça" : "peças"}`
          : "Abrir carrinho"
      }
      data-testid="header-cart-button"
      className="group relative inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-salmao-claro)] md:h-14 md:w-14"
    >
      {/* Bag icon */}
      <svg
        width="22"
        height="24"
        viewBox="0 0 22 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-[var(--color-preto-warm)] transition-colors group-hover:text-[#A47525]"
        aria-hidden="true"
      >
        <path d="M3 8 L4 22 L18 22 L19 8 Z" />
        <path d="M7 8 V6 a4 4 0 0 1 8 0 V8" />
        <path
          d="M11 13 L11.6 14.4 L13 15 L11.6 15.6 L11 17 L10.4 15.6 L9 15 L10.4 14.4 Z"
          fill="currentColor"
          stroke="none"
          opacity="0.85"
        />
      </svg>

      {/* Badge */}
      {itemCount > 0 && (
        <span
          aria-hidden="true"
          data-testid="cart-badge"
          className="absolute -right-0.5 -top-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5"
          style={{
            backgroundColor: "#D99A30",
            color: "#FFF1ED",
            fontSize: "10px",
            fontFamily:
              "var(--font-secondary, Inter, system-ui, sans-serif)",
            fontWeight: 600,
            letterSpacing: "0.02em",
          }}
        >
          {itemCount}
        </span>
      )}
    </button>
  );
};
