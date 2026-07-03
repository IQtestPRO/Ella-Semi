"use client";

import { useEffect, useRef, useState, type FC } from "react";
import { useCart } from "../../../lib/cart/store";
import type { Product } from "../../../lib/schemas";

type Props = {
  product: Product;
  /** Visual variant. "floating" sobre a foto; "inline" dentro do card. */
  variant?: "floating" | "inline";
};

const BagPlus: FC = () => (
  <svg
    width="18"
    height="20"
    viewBox="0 0 22 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M3 8 L4 22 L18 22 L19 8 Z" />
    <path d="M7 8 V6 a4 4 0 0 1 8 0 V8" />
    <line x1="11" y1="13" x2="11" y2="17" />
    <line x1="9" y1="15" x2="13" y2="15" />
  </svg>
);

const Check: FC = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="3 9 7 13 15 5" />
  </svg>
);

const FEEDBACK_MS = 1200;

/**
 * Botão "+ adicionar ao carrinho" — variant `floating` sobre a foto do
 * card. Click adiciona ao carrinho e abre o drawer. Feedback visual de
 * 1.2s mostrando ✓ antes de voltar pro ícone.
 */
export const AddToCartButton: FC<Props> = ({ product, variant = "floating" }) => {
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);
  const [feedback, setFeedback] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup pendente se componente desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    add({
      slug: product.slug,
      nome: product.nome,
      precoCents: product.precoPromocionalCents ?? product.precoCents,
      categoria: product.categoria,
      fotoUrl: product.fotos[0]?.url,
    });
    open();
    setFeedback(true);
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setFeedback(false), FEEDBACK_MS);
  };

  if (variant === "inline") {
    return (
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Adicionar ${product.nome} ao carrinho`}
        data-testid="add-to-cart-button"
        className="inline-flex items-center gap-2 rounded-full px-4 py-2 transition-colors"
        style={{
          fontFamily: "var(--font-secondary, Inter, system-ui, sans-serif)",
          fontSize: "12px",
          letterSpacing: "0.16em",
          textTransform: "uppercase",
          fontWeight: 600,
          backgroundColor: feedback ? "#A47525" : "var(--color-preto-warm, #251008)",
          color: "#FFF1ED",
        }}
      >
        {feedback ? (
          <span className="ella-pop inline-flex">
            <Check />
          </span>
        ) : (
          <BagPlus />
        )}
        <span>{feedback ? "Adicionado" : "Adicionar ao carrinho"}</span>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      aria-label={`Adicionar ${product.nome} ao carrinho`}
      data-testid="add-to-cart-button"
      className="absolute bottom-3 right-3 inline-flex h-11 w-11 items-center justify-center rounded-full shadow-md transition-all duration-200 hover:scale-105 active:scale-95"
      style={{
        backgroundColor: feedback ? "#A47525" : "rgba(255, 247, 238, 0.96)",
        color: feedback ? "#FFF1ED" : "var(--color-preto-warm, #251008)",
        border: "1px solid rgba(217, 154, 48, 0.35)",
      }}
    >
      {feedback ? (
        <span className="ella-pop inline-flex">
          <Check />
        </span>
      ) : (
        <BagPlus />
      )}
    </button>
  );
};
