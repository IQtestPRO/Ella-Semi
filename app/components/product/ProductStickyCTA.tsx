"use client";

import type { Product } from "../../../lib/schemas";
import { formatBRL } from "../../../lib/format/currency";
import { useCart } from "../../../lib/cart/store";

export function ProductStickyCTA({
  product,
  precoAtual,
}: {
  product: Product;
  precoAtual?: number;
}) {
  const add = useCart((s) => s.add);
  const open = useCart((s) => s.open);
  // Preço promocional vale no rótulo E no add() — nunca cobrar o cheio em promo.
  const precoCents =
    precoAtual ?? product.precoPromocionalCents ?? product.precoCents;
  const preco = formatBRL(precoCents);
  const mostraRiscado = Boolean(product.precoPromocionalCents) && precoAtual == null;

  function handleClick() {
    // Adiciona de verdade ao carrinho e abre o drawer (varredura: CTA fake).
    add({
      slug: product.slug,
      nome: product.nome,
      precoCents,
      categoria: product.categoria,
      fotoUrl: product.fotos[0]?.url,
    });
    open();
  }

  return (
    // pr extra no mobile pra não colidir com o FAB do WhatsApp (varredura).
    <div
      // pb com safe-area: a barra não cola no home indicator do iPhone
      className="fixed inset-x-0 bottom-0 z-40 border-t border-[var(--color-preto-warm)]/10 bg-[var(--color-salmao)] px-4 pt-3 pr-20 pb-[calc(0.75rem+env(safe-area-inset-bottom))] lg:static lg:border-0 lg:bg-transparent lg:p-0 lg:pr-0"
      data-testid="sticky-cta"
    >
      <button
        type="button"
        onClick={handleClick}
        aria-label={`Adicionar ${product.nome} ao carrinho, ${preco}`}
        className="flex w-full items-center justify-between rounded-full bg-[var(--color-preto-warm)] px-6 py-4 text-sm font-medium text-[var(--color-salmao-claro)] transition-[background-color,transform] duration-200 ease-brand hover:bg-[var(--color-preto-warm)]/90 active:scale-[0.98] lg:py-5"
      >
        <span>Adicionar ao carrinho</span>
        <span className="flex items-baseline gap-2">
          {mostraRiscado ? (
            <span className="text-xs text-[var(--color-salmao-claro)]/50 line-through">
              {formatBRL(product.precoCents)}
            </span>
          ) : null}
          <span className="font-semibold">· {preco}</span>
        </span>
      </button>
    </div>
  );
}
