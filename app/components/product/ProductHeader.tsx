import type { Product } from "../../../lib/schemas";
import { formatBRL } from "../../../lib/format/currency";

const BANHO_LABEL: Record<Product["banho"], string> = {
  ouro: "Banho ouro",
  prata: "Banho prata",
  rodio: "Banho ródio",
  "ouro-rose": "Banho ouro rosé",
  "a-confirmar": "Banho a confirmar",
};

const TIPO_LABEL: Record<Product["tipo"], string> = {
  semijoia: "Semijoia",
  bijuteria: "Bijuteria",
};

export function ProductHeader({ product }: { product: Product }) {
  const preco = formatBRL(product.precoCents);
  const promo = product.precoPromocionalCents
    ? formatBRL(product.precoPromocionalCents)
    : null;
  // Guard: só quantifica a oferta quando o desconto é real (evita "−0%").
  const pctDesconto = product.precoPromocionalCents
    ? Math.round((1 - product.precoPromocionalCents / product.precoCents) * 100)
    : 0;
  return (
    <header className="flex flex-col gap-3">
      <h1 className="font-hero text-4xl leading-tight md:text-5xl">{product.nome}</h1>
      <div className="flex items-baseline gap-3">
        {promo ? (
          <>
            <span className="font-hero text-2xl text-[var(--color-preto-warm)]">
              {promo}
            </span>
            <span className="text-base text-[var(--color-preto-warm)]/50 line-through">
              {preco}
            </span>
            {pctDesconto >= 1 ? (
              <span className="rounded-full bg-[var(--color-dourado-claro)] px-2 py-0.5 text-[11px] font-semibold tracking-wide text-[var(--color-preto-warm)]">
                −{pctDesconto}%
              </span>
            ) : null}
          </>
        ) : (
          <span className="font-hero text-2xl text-[var(--color-preto-warm)]">
            {preco}
          </span>
        )}
      </div>
      <p className="text-sm text-[var(--color-preto-warm)]/70">
        {BANHO_LABEL[product.banho]} · {TIPO_LABEL[product.tipo]}
        {product.codigo ? (
          <>
            {" · "}
            <span className="tabular-nums tracking-[0.06em]">
              Cód. {product.codigo}
            </span>
          </>
        ) : null}
      </p>
    </header>
  );
}
