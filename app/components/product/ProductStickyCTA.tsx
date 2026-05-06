"use client";

import { useState } from "react";
import type { Product } from "../../../lib/schemas";
import { formatBRL } from "../../../lib/format/currency";

export function ProductStickyCTA({
  product,
  precoAtual,
}: {
  product: Product;
  precoAtual?: number;
}) {
  const [feedback, setFeedback] = useState<string | null>(null);
  const preco = formatBRL(precoAtual ?? product.precoCents);

  function handleClick() {
    setFeedback("Adicionado ao carrinho");
    window.setTimeout(() => setFeedback(null), 2200);
  }

  return (
    <>
      <div
        className="fixed inset-x-0 bottom-0 z-30 border-t border-[var(--color-preto-warm)]/10 bg-[var(--color-salmao)] px-4 py-3 lg:static lg:border-0 lg:bg-transparent lg:p-0"
        data-testid="sticky-cta"
      >
        <button
          type="button"
          onClick={handleClick}
          aria-label={`Adicionar ${product.nome} ao carrinho, ${preco}`}
          className="flex w-full items-center justify-between rounded-md bg-[var(--color-preto-warm)] px-5 py-4 text-sm font-medium text-[var(--color-salmao-claro)] transition-transform duration-200 ease-out hover:scale-[1.005] active:scale-[0.99] lg:py-5"
        >
          <span>Adicionar ao carrinho</span>
          <span className="font-semibold">· {preco}</span>
        </button>
      </div>
      {feedback && (
        <div
          role="status"
          aria-live="polite"
          className="fixed inset-x-4 bottom-24 z-40 rounded-md bg-[var(--color-preto-warm)] px-4 py-3 text-center text-sm text-[var(--color-salmao-claro)] shadow-lg lg:bottom-8"
        >
          {feedback}
        </div>
      )}
    </>
  );
}
