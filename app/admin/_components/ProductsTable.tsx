"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatBRL } from "../../../lib/format/currency";

export type ProductRow = {
  slug: string;
  nome: string;
  categoria: string;
  precoCents: number;
  precoPromocionalCents?: number;
  ativo: boolean;
  maisVendido: boolean;
  destaqueHome: boolean;
  promocao: boolean;
  fotoUrl?: string;
};

const CATS = [
  { value: "", label: "Todas as categorias" },
  { value: "brincos", label: "Brincos" },
  { value: "colares", label: "Colares" },
  { value: "pulseiras", label: "Pulseiras" },
  { value: "aneis", label: "Anéis" },
  { value: "conjuntos", label: "Conjuntos" },
  { value: "gargantilhas", label: "Chokers" },
  { value: "tornozeleiras", label: "Tornozeleiras" },
  { value: "piercings", label: "Piercings" },
  { value: "outros", label: "Outros" },
];

function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "gold" | "muted" | "warn";
}) {
  const tones: Record<string, string> = {
    neutral: "bg-[var(--color-salmao-claro)] text-[var(--color-preto-warm)]",
    gold: "bg-[var(--color-dourado-claro)]/30 text-[#7a5a12]",
    muted: "bg-[var(--color-areia)]/60 text-[var(--color-taupe)]",
    warn: "bg-[#b3261e]/10 text-[#b3261e]",
  };
  return (
    <span
      className={`inline-block rounded-full px-2 py-0.5 text-[11px] font-medium ${tones[tone]}`}
    >
      {children}
    </span>
  );
}

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return products.filter((p) => {
      if (cat && p.categoria !== cat) return false;
      if (needle && !p.nome.toLowerCase().includes(needle)) return false;
      return true;
    });
  }, [products, q, cat]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Buscar peça pelo nome…"
          className="w-full rounded-xl border border-[var(--color-areia)] bg-white px-4 py-3 outline-none focus:border-[var(--color-dourado-claro)] focus:ring-2 focus:ring-[var(--color-dourado-claro)]/40 sm:max-w-xs"
        />
        <select
          value={cat}
          onChange={(e) => setCat(e.target.value)}
          className="rounded-xl border border-[var(--color-areia)] bg-white px-4 py-3 outline-none focus:border-[var(--color-dourado-claro)]"
        >
          {CATS.map((c) => (
            <option key={c.value} value={c.value}>
              {c.label}
            </option>
          ))}
        </select>
        <Link
          href="/admin/produtos/novo"
          className="rounded-xl bg-[var(--color-preto-warm)] px-5 py-3 text-center text-sm font-semibold text-[var(--color-salmao-claro)] transition hover:opacity-90 sm:ml-auto"
        >
          + Nova peça
        </Link>
      </div>

      <p className="text-sm text-[var(--color-taupe)]">
        {filtered.length} peça{filtered.length === 1 ? "" : "s"}
      </p>

      <ul className="flex flex-col gap-2">
        {filtered.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/admin/produtos/${p.slug}`}
              className="flex items-center gap-4 rounded-xl border border-[var(--color-areia)] bg-white p-3 transition hover:border-[var(--color-dourado-claro)]"
            >
              <div className="h-14 w-14 flex-shrink-0 overflow-hidden rounded-lg bg-[var(--color-salmao-claro)]">
                {p.fotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.fotoUrl}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center text-[10px] text-[var(--color-taupe)]">
                    sem foto
                  </span>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="truncate font-medium text-[var(--color-preto-warm)]">
                  {p.nome}
                </div>
                <div className="mt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-sm text-[var(--color-taupe)]">
                    {p.promocao && p.precoPromocionalCents
                      ? `${formatBRL(p.precoPromocionalCents)}`
                      : formatBRL(p.precoCents)}
                  </span>
                  {!p.ativo && <Badge tone="warn">Oculta</Badge>}
                  {p.maisVendido && <Badge tone="gold">Mais vendido</Badge>}
                  {p.destaqueHome && <Badge tone="neutral">Favorita</Badge>}
                  {p.fotoUrl ? null : <Badge tone="muted">Sem foto</Badge>}
                </div>
              </div>
              <span className="text-sm text-[var(--color-taupe)]">Editar →</span>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <p className="rounded-xl border border-dashed border-[var(--color-areia)] px-4 py-10 text-center text-sm text-[var(--color-taupe)]">
          Nenhuma peça encontrada.
        </p>
      )}
    </div>
  );
}
