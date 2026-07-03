import { cache } from "react";
import { db } from "../db";
import {
  CampanhaAtualSchema,
  ProductSchema,
  type CampanhaAtual,
  type Categoria,
  type Product,
} from "../schemas";
import type { Row } from "@libsql/client";

/**
 * Camada de leitura do catálogo — agora sobre Turso/libsql (ADR-0021,
 * supersede ADR-0004/0005 no ponto "JSON como armazenamento de produção").
 *
 * Mantém a MESMA API pública de antes, porém assíncrona: cada função retorna
 * Promise. Server Components fazem `await`. A carga total de produtos e a
 * campanha são memoizadas por request via React `cache()` — uma query por
 * request, igual ao comportamento antigo de cache em módulo.
 */

// ── Mapeamento de linha do banco -> domínio (validado por Zod) ──────────────

const num = (v: Row[string]): number => Number(v);
const optNum = (v: Row[string]): number | undefined =>
  v === null || v === undefined ? undefined : Number(v);
const optBool = (v: Row[string]): boolean | undefined =>
  v === null || v === undefined ? undefined : Number(v) === 1;
const parseJson = <T>(v: Row[string], fallback: T): T => {
  if (typeof v !== "string" || v.length === 0) return fallback;
  try {
    return JSON.parse(v) as T;
  } catch {
    return fallback;
  }
};

function rowToProduct(r: Row): Product {
  return ProductSchema.parse({
    slug: r.slug,
    nome: r.nome,
    codigo: r.codigo ?? undefined,
    categoria: r.categoria,
    banho: r.banho,
    tipo: r.tipo,
    precoCents: num(r.precoCents),
    precoPromocionalCents: optNum(r.precoPromocionalCents),
    descricao: r.descricao,
    fotos: parseJson(r.fotos, [] as Product["fotos"]),
    videoUrl: r.videoUrl ?? undefined,
    variantes: r.variantes
      ? parseJson(r.variantes, undefined as Product["variantes"])
      : undefined,
    tags: r.tags ? parseJson(r.tags, undefined as Product["tags"]) : undefined,
    promocao: Number(r.promocao) === 1,
    tipoFulfillment: r.tipoFulfillment,
    destaqueHome: Number(r.destaqueHome) === 1,
    maisVendido: Number(r.maisVendido) === 1,
    ativo: Number(r.ativo) === 1,
    origem: r.origem
      ? parseJson(r.origem, undefined as Product["origem"])
      : undefined,
    fonteFotoFraca: optBool(r.fonteFotoFraca),
    cadastradoEm: r.cadastradoEm,
    atualizadoEm: r.atualizadoEm,
  });
}

function rowToCampanha(r: Row): CampanhaAtual {
  return CampanhaAtualSchema.parse({
    slug: r.slug,
    nomeExibicao: r.nomeExibicao,
    manifesto: r.manifesto,
    heroVideo: r.heroVideo ?? undefined,
    heroImagem: r.heroImagem ?? undefined,
    ctaTexto: r.ctaTexto,
    produtosDestaqueSlugs: parseJson(r.produtosDestaqueSlugs, [] as string[]),
    ativa: Number(r.ativa) === 1,
    atualizadoEm: r.atualizadoEm,
  });
}

// ── Carga memoizada por request ─────────────────────────────────────────────

const loadProducts = cache(async (): Promise<readonly Product[]> => {
  const rs = await db.execute(
    "SELECT * FROM products ORDER BY ordem ASC, nome ASC",
  );
  return rs.rows.map(rowToProduct);
});

const loadCampanha = cache(async (): Promise<CampanhaAtual> => {
  const rs = await db.execute("SELECT * FROM campanha WHERE id = 1 LIMIT 1");
  if (rs.rows.length === 0) {
    throw new Error(
      "Campanha não encontrada no banco. Rode `node scripts/seed-db.mjs`.",
    );
  }
  return rowToCampanha(rs.rows[0]);
});

// ── API pública (igual à anterior, agora async) ─────────────────────────────

export type CatalogQueryOpts = { ativosOnly?: boolean };

export async function getAllProducts(
  opts?: CatalogQueryOpts,
): Promise<readonly Product[]> {
  const all = await loadProducts();
  return opts?.ativosOnly ? all.filter((p) => p.ativo) : all;
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (!slug) return null;
  const all = await loadProducts();
  return all.find((p) => p.slug === slug) ?? null;
}

export async function getProductsByCategory(
  categoria: Categoria,
  opts?: CatalogQueryOpts,
): Promise<readonly Product[]> {
  const all = await loadProducts();
  const filtered = all.filter((p) => p.categoria === categoria);
  return opts?.ativosOnly ? filtered.filter((p) => p.ativo) : filtered;
}

export async function getCampanhaAtual(): Promise<CampanhaAtual> {
  return loadCampanha();
}

export async function getProductsDestaque(): Promise<readonly Product[]> {
  const campanha = await loadCampanha();
  if (!campanha.ativa) return [];
  const slugSet = new Set(campanha.produtosDestaqueSlugs);
  const all = await loadProducts();
  // Preserva a ordem dos slugs definida na campanha (curadoria da Ellen).
  return campanha.produtosDestaqueSlugs
    .map((slug) => all.find((p) => p.slug === slug))
    .filter((p): p is Product => !!p && p.ativo && slugSet.has(p.slug));
}

export async function categoryFromSlug(slug: string): Promise<Categoria | null> {
  const p = await getProductBySlug(slug);
  return p?.categoria ?? null;
}

/**
 * Peças marcadas como `maisVendido: true` — alimentam a seção "MAIS VENDIDOS"
 * da home. Filtra apenas produtos ativos. S2.0 / ADR-0017.
 */
export async function getMaisVendidos(): Promise<readonly Product[]> {
  const all = await loadProducts();
  return all.filter((p) => p.ativo && p.maisVendido);
}

/**
 * Peças marcadas como `destaqueHome: true` — alimentam "Favoritas da Ella".
 * Curadoria editorial subjetiva da Ellen, distinta de `maisVendido`. ADR-0004.
 */
export async function getDestaqueHome(): Promise<readonly Product[]> {
  const all = await loadProducts();
  return all.filter((p) => p.ativo && p.destaqueHome);
}

/**
 * Contagem de produtos ativos por categoria — alimenta "Explore por Categoria".
 * Categorias com 0 peças são omitidas.
 */
export async function getCategoryCounts(): Promise<
  ReadonlyArray<{ categoria: Categoria; count: number }>
> {
  const all = await loadProducts();
  const counts = new Map<Categoria, number>();
  for (const p of all) {
    if (!p.ativo) continue;
    counts.set(p.categoria, (counts.get(p.categoria) ?? 0) + 1);
  }
  const order: Categoria[] = [
    "brincos",
    "colares",
    "pulseiras",
    "aneis",
    "conjuntos",
    "gargantilhas",
    "tornozeleiras",
    "piercings",
    "outros",
  ];
  return order
    .filter((c) => (counts.get(c) ?? 0) > 0)
    .map((c) => ({ categoria: c, count: counts.get(c) ?? 0 }));
}
