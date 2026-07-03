"use client";

import { useState } from "react";
import type { Product, Variante } from "../../../lib/schemas";
import { formatBRL } from "../../../lib/format/currency";

type Props = {
  product: Product;
  onSelectionChange?: (precoCentsAtual: number, selecao: Record<string, string>) => void;
};

const TIPO_LABEL: Record<Variante["tipo"], string> = {
  tamanho: "Tamanho",
  cor: "Cor",
  comprimento: "Comprimento",
};

export function ProductVariantSelector({ product, onSelectionChange }: Props) {
  const variantes = product.variantes ?? [];
  const [selecao, setSelecao] = useState<Record<string, string>>(() =>
    Object.fromEntries(variantes.map((v) => [v.tipo, v.opcoes[0].rotulo])),
  );

  if (variantes.length === 0) return null;

  function selecionar(tipo: Variante["tipo"], rotulo: string) {
    const next = { ...selecao, [tipo]: rotulo };
    setSelecao(next);
    if (onSelectionChange) {
      const ajusteTotal = variantes.reduce((acc, v) => {
        const opcao = v.opcoes.find((o) => o.rotulo === next[v.tipo]);
        return acc + (opcao?.precoCentsAjuste ?? 0);
      }, 0);
      // Base promocional quando existir — senão a promo se perde ao variar.
      const baseCents = product.precoPromocionalCents ?? product.precoCents;
      onSelectionChange(baseCents + ajusteTotal, next);
    }
  }

  return (
    <div className="flex flex-col gap-4">
      {variantes.map((variante) => (
        <fieldset key={variante.tipo} className="flex flex-col gap-2">
          <legend className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-preto-warm)]/70">
            {TIPO_LABEL[variante.tipo]}
          </legend>
          <div className="flex flex-wrap gap-2">
            {variante.opcoes.map((opcao) => {
              const ativo = selecao[variante.tipo] === opcao.rotulo;
              const ajuste = opcao.precoCentsAjuste ?? 0;
              return (
                <button
                  key={opcao.rotulo}
                  type="button"
                  aria-pressed={ativo}
                  onClick={() => selecionar(variante.tipo, opcao.rotulo)}
                  className={`rounded-full border px-4 py-2 text-sm transition-[color,background-color,border-color,transform] duration-200 ease-brand active:scale-[0.96] ${
                    ativo
                      ? "border-[var(--color-preto-warm)] bg-[var(--color-preto-warm)] text-[var(--color-salmao-claro)]"
                      : "border-[var(--color-preto-warm)]/30 bg-transparent text-[var(--color-preto-warm)] hover:border-[var(--color-preto-warm)]/70"
                  }`}
                >
                  {opcao.rotulo}
                  {ajuste > 0 && (
                    <span className="ml-1 text-xs opacity-70">
                      (+{formatBRL(ajuste)})
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
