"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatBRL } from "../../../lib/format/currency";

export type ProductRow = {
  slug: string;
  nome: string;
  codigo?: string;
  categoria: string;
  precoCents: number;
  precoPromocionalCents?: number;
  ativo: boolean;
  maisVendido: boolean;
  destaqueHome: boolean;
  promocao: boolean;
  fotoUrl?: string;
  /** null = sem controle de estoque; 0 = esgotada (ADR-0025). */
  estoque?: number | null;
};

/**
 * Lista de peças do painel (ADR-0024).
 *
 * Antes: 167 linhas numa rolagem só, foto de 56px, a maioria "sem foto"
 * (peças antigas escondidas), busca que não achava "coração" nem por código.
 * Agora: grade com foto grande (a pessoa reconhece a joia batendo o olho),
 * peças no site primeiro, e filtros ditos em português.
 */

const CATS = [
  { value: "", label: "Todos os tipos" },
  { value: "brincos", label: "Brincos" },
  { value: "colares", label: "Colares" },
  { value: "pulseiras", label: "Pulseiras" },
  { value: "aneis", label: "Anéis" },
  { value: "conjuntos", label: "Conjuntos" },
  { value: "mixes", label: "Mixes" },
  // `gargantilhas` saiu do filtro: chokers agora são colares (ADR-0025).
  { value: "tornozeleiras", label: "Tornozeleiras" },
  { value: "piercings", label: "Piercings" },
  { value: "outros", label: "Outros" },
];

type Situacao = "no-site" | "escondidas" | "esgotadas" | "todas";

const SITUACOES: Array<{ value: Situacao; label: string }> = [
  { value: "no-site", label: "Aparecendo no site" },
  { value: "escondidas", label: "Escondidas" },
  { value: "esgotadas", label: "Esgotadas (repor)" },
  { value: "todas", label: "Todas" },
];

/** Tira acento e caixa: "Coração" acha "coracao" e vice-versa. */
function normalizar(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

export function ProductsTable({ products }: { products: ProductRow[] }) {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("");
  const [situacao, setSituacao] = useState<Situacao>("no-site");

  const noSite = products.filter((p) => p.ativo).length;
  const escondidas = products.length - noSite;
  const esgotadas = products.filter((p) => p.estoque === 0).length;

  const filtered = useMemo(() => {
    const needle = normalizar(q);
    return products
      .filter((p) => {
        if (situacao === "no-site" && !p.ativo) return false;
        if (situacao === "escondidas" && p.ativo) return false;
        if (situacao === "esgotadas" && p.estoque !== 0) return false;
        if (cat && p.categoria !== cat) return false;
        if (needle) {
          const alvo = normalizar(`${p.nome} ${p.codigo ?? ""}`);
          if (!alvo.includes(needle)) return false;
        }
        return true;
      })
      // Peça com foto primeiro — é a que dá pra reconhecer de relance.
      .sort((a, b) => {
        const fa = a.fotoUrl ? 0 : 1;
        const fb = b.fotoUrl ? 0 : 1;
        if (fa !== fb) return fa - fb;
        return a.nome.localeCompare(b.nome, "pt-BR");
      });
  }, [products, q, cat, situacao]);

  const campo =
    "min-h-[48px] w-full rounded-xl border border-[var(--color-areia)] bg-white px-4 text-base text-[var(--color-preto-warm)] outline-none transition focus:border-[var(--color-dourado-claro)] focus:ring-2 focus:ring-[var(--color-dourado-claro)]/40";

  return (
    <div className="flex flex-col gap-5">
      {/* Botão de criar — grande e primeiro, é a ação positiva */}
      <Link
        href="/admin/produtos/novo"
        className="inline-flex min-h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[var(--color-preto-warm)] px-5 text-base font-semibold text-[var(--color-salmao-claro)] transition hover:opacity-90 sm:w-auto sm:self-start"
      >
        <span aria-hidden="true" className="text-lg">
          ＋
        </span>
        Cadastrar peça nova
      </Link>

      {/* Busca e filtros, cada um com rótulo escrito */}
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--color-preto-warm)]">
            Procurar peça
          </span>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Escreva o nome, ex.: coração"
            className={campo}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--color-preto-warm)]">
            Tipo de peça
          </span>
          <select
            value={cat}
            onChange={(e) => setCat(e.target.value)}
            className={campo}
          >
            {CATS.map((c) => (
              <option key={c.value} value={c.value}>
                {c.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-[var(--color-preto-warm)]">
            Mostrar
          </span>
          <select
            value={situacao}
            onChange={(e) => setSituacao(e.target.value as Situacao)}
            className={campo}
          >
            {SITUACOES.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
                {s.value === "no-site" ? ` (${noSite})` : ""}
                {s.value === "escondidas" ? ` (${escondidas})` : ""}
                {s.value === "esgotadas" ? ` (${esgotadas})` : ""}
              </option>
            ))}
          </select>
        </label>
      </div>

      <p className="text-[15px] text-[var(--color-taupe)]">
        {filtered.length === 0
          ? "Nenhuma peça encontrada."
          : `${filtered.length} peça${filtered.length === 1 ? "" : "s"} aqui. Toque numa peça para editar.`}
      </p>

      {/* Grade com foto grande: reconhecer a joia é o caminho mais rápido */}
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {filtered.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/admin/produtos/${p.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[var(--color-areia)] bg-white transition hover:border-[var(--color-dourado-claro)] hover:shadow-md"
            >
              <div className="relative aspect-[4/5] overflow-hidden bg-[var(--color-salmao-claro)]">
                {p.fotoUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={p.fotoUrl}
                    alt={p.nome}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="flex h-full w-full items-center justify-center px-2 text-center text-sm text-[var(--color-taupe)]">
                    Sem foto
                  </span>
                )}
                {!p.ativo && (
                  <span className="absolute left-2 top-2 rounded-full bg-[var(--color-preto-warm)]/85 px-2.5 py-1 text-[11px] font-semibold text-[var(--color-salmao-claro)]">
                    Escondida
                  </span>
                )}
                {p.maisVendido && p.ativo && p.estoque !== 0 && (
                  <span className="absolute left-2 top-2 rounded-full bg-[var(--color-dourado-claro)] px-2.5 py-1 text-[11px] font-semibold text-[#5c3d0a]">
                    ⭐ Mais vendido
                  </span>
                )}
                {/* Estoque (ADR-0025): esgotada pede reposição; poucas unidades avisam */}
                {p.estoque === 0 ? (
                  <span className="absolute inset-x-0 bottom-0 bg-[#8c1d18]/90 py-1 text-center text-[11px] font-semibold text-white">
                    Esgotada — repor
                  </span>
                ) : typeof p.estoque === "number" ? (
                  <span className="absolute right-2 top-2 rounded-full bg-white/92 px-2 py-1 text-[11px] font-semibold text-[var(--color-preto-warm)]">
                    {p.estoque} un.
                  </span>
                ) : null}
              </div>
              <div className="flex flex-1 flex-col gap-1 p-3">
                <span className="line-clamp-2 text-[15px] font-medium leading-snug text-[var(--color-preto-warm)]">
                  {p.nome}
                </span>
                <span className="text-[15px] text-[var(--color-taupe)]">
                  {p.promocao && p.precoPromocionalCents ? (
                    <>
                      <s className="opacity-60">{formatBRL(p.precoCents)}</s>{" "}
                      <strong className="text-[var(--color-preto-warm)]">
                        {formatBRL(p.precoPromocionalCents)}
                      </strong>
                    </>
                  ) : (
                    formatBRL(p.precoCents)
                  )}
                </span>
                <span className="mt-auto pt-2 text-sm font-semibold text-[var(--color-preto-warm)] underline underline-offset-4">
                  Editar
                </span>
              </div>
            </Link>
          </li>
        ))}
      </ul>

      {filtered.length === 0 && (
        <div className="rounded-2xl border border-dashed border-[var(--color-areia)] px-4 py-10 text-center">
          <p className="text-[15px] text-[var(--color-taupe)]">
            Não achei nenhuma peça com o que você escreveu.
          </p>
          <button
            type="button"
            onClick={() => {
              setQ("");
              setCat("");
              setSituacao("todas");
            }}
            className="mt-3 inline-flex min-h-[48px] items-center rounded-xl border border-[var(--color-areia)] px-4 text-[15px] font-medium text-[var(--color-preto-warm)] transition hover:border-[var(--color-taupe)]"
          >
            Mostrar todas as peças
          </button>
        </div>
      )}
    </div>
  );
}
