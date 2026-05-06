"use client";

import { useMemo, useReducer } from "react";
import type { Product, Categoria } from "../../../lib/schemas";
import { ProductCard } from "../ProductCard";
import { SectionHeading } from "./SectionHeading";

type SortOption = "recent" | "price-asc" | "price-desc" | "alpha";

type FilterState = {
  categoria: Categoria | "todos";
  sort: SortOption;
};

type FilterAction =
  | { type: "set-categoria"; categoria: Categoria | "todos" }
  | { type: "set-sort"; sort: SortOption };

const initialState: FilterState = {
  categoria: "todos",
  sort: "recent",
};

function filterReducer(state: FilterState, action: FilterAction): FilterState {
  switch (action.type) {
    case "set-categoria":
      return { ...state, categoria: action.categoria };
    case "set-sort":
      return { ...state, sort: action.sort };
  }
}

const CHIP_LABELS: Array<{ value: Categoria | "todos"; label: string }> = [
  { value: "todos", label: "Todos" },
  { value: "brincos", label: "Brincos" },
  { value: "colares", label: "Colares" },
  { value: "pulseiras", label: "Pulseiras" },
  { value: "aneis", label: "Anéis" },
  { value: "conjuntos", label: "Conjuntos" },
  { value: "gargantilhas", label: "Gargantilhas" },
  { value: "tornozeleiras", label: "Tornozeleiras" },
];

const SORT_LABELS: Array<{ value: SortOption; label: string }> = [
  { value: "recent", label: "Mais recentes" },
  { value: "price-asc", label: "Menor preço" },
  { value: "price-desc", label: "Maior preço" },
  { value: "alpha", label: "A–Z" },
];

type Props = {
  products: readonly Product[];
};

/**
 * Seção "Todas as Peças · outono 2026" — grid filtrável client-side.
 *
 * Estado local via useReducer (decisão UI; não persistir em Zustand —
 * filtro é descartável por sessão). Filtro instantâneo client-side, sem
 * reload. Empty state quando categoria selecionada não tem peças.
 */
export function TodasAsPecas({ products }: Props) {
  const [state, dispatch] = useReducer(filterReducer, initialState);

  const visible = useMemo(() => {
    let result =
      state.categoria === "todos"
        ? [...products]
        : products.filter((p) => p.categoria === state.categoria);

    switch (state.sort) {
      case "recent":
        result.sort(
          (a, b) =>
            new Date(b.cadastradoEm).getTime() -
            new Date(a.cadastradoEm).getTime(),
        );
        break;
      case "price-asc":
        result.sort((a, b) => a.precoCents - b.precoCents);
        break;
      case "price-desc":
        result.sort((a, b) => b.precoCents - a.precoCents);
        break;
      case "alpha":
        result.sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
        break;
    }
    return result;
  }, [products, state.categoria, state.sort]);

  // Chips that have at least 1 product (when filtering "todos") get rendered.
  const visibleCategorias = useMemo(() => {
    const set = new Set<Categoria>();
    for (const p of products) set.add(p.categoria);
    return CHIP_LABELS.filter(
      (c) => c.value === "todos" || set.has(c.value as Categoria),
    );
  }, [products]);

  return (
    <section
      aria-labelledby="todas-as-pecas-heading"
      className="w-full px-5 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-[1280px]">
        <div id="todas-as-pecas-heading">
          <SectionHeading
            title="TODAS AS PEÇAS · outono 2026"
            subtitle="filtre por categoria · ordene como preferir"
          />
        </div>

        {/* Filter row */}
        <div
          className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
          role="toolbar"
          aria-label="Filtros do catálogo"
        >
          {/* Chips */}
          <ul
            className="-mx-1 flex flex-wrap gap-2"
            data-testid="categoria-chips"
          >
            {visibleCategorias.map(({ value, label }) => {
              const active = state.categoria === value;
              return (
                <li key={value}>
                  <button
                    type="button"
                    onClick={() =>
                      dispatch({ type: "set-categoria", categoria: value })
                    }
                    aria-pressed={active}
                    className="rounded-full px-4 py-2 transition-colors"
                    style={{
                      fontFamily:
                        "var(--font-secondary, Inter, system-ui, sans-serif)",
                      fontSize: "12px",
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      fontWeight: 500,
                      backgroundColor: active
                        ? "rgba(37, 16, 8, 0.92)"
                        : "rgba(255, 241, 237, 0.6)",
                      color: active
                        ? "#FFF1ED"
                        : "rgba(37, 16, 8, 0.78)",
                      border: active
                        ? "1px solid rgba(37, 16, 8, 0.92)"
                        : "1px solid rgba(138, 110, 92, 0.25)",
                    }}
                  >
                    {label}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Sort dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="sort-select"
              className="text-[var(--color-preto-warm)]/60"
              style={{
                fontFamily:
                  "var(--font-secondary, Inter, system-ui, sans-serif)",
                fontSize: "11px",
                letterSpacing: "0.18em",
                textTransform: "uppercase",
              }}
            >
              Ordenar:
            </label>
            <select
              id="sort-select"
              value={state.sort}
              onChange={(e) =>
                dispatch({
                  type: "set-sort",
                  sort: e.target.value as SortOption,
                })
              }
              className="rounded-sm bg-transparent px-3 py-2 outline-none focus:ring-2"
              style={{
                fontFamily:
                  "var(--font-secondary, Inter, system-ui, sans-serif)",
                fontSize: "12px",
                letterSpacing: "0.06em",
                color: "rgba(37, 16, 8, 0.92)",
                border: "1px solid rgba(138, 110, 92, 0.3)",
              }}
            >
              {SORT_LABELS.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Grid */}
        {visible.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-24 text-center">
            <p
              className="text-[var(--color-preto-warm)]/70"
              style={{
                fontFamily:
                  "var(--font-secondary, Inter, system-ui, sans-serif)",
                fontSize: "14px",
                letterSpacing: "0.04em",
              }}
              data-testid="empty-state"
            >
              Nenhuma peça nesta categoria — em breve.
            </p>
          </div>
        ) : (
          <ul
            className="grid grid-cols-2 gap-x-3 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-3"
            data-testid="todas-as-pecas-grid"
          >
            {visible.map((p) => (
              <li key={p.slug}>
                <ProductCard product={p} />
              </li>
            ))}
          </ul>
        )}

        {/* Visible count */}
        <p
          className="mt-8 text-center text-[var(--color-preto-warm)]/55"
          style={{
            fontFamily: "var(--font-secondary, Inter, system-ui, sans-serif)",
            fontSize: "11px",
            letterSpacing: "0.18em",
            textTransform: "uppercase",
          }}
          data-testid="visible-count"
        >
          {visible.length}{" "}
          {visible.length === 1 ? "peça encontrada" : "peças encontradas"}
        </p>
      </div>
    </section>
  );
}
