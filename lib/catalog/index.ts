import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import {
  CampanhaAtualSchema,
  ProductsSchema,
  type CampanhaAtual,
  type Categoria,
  type Product,
} from "../schemas";

let _products: readonly Product[] | null = null;
let _campanha: CampanhaAtual | null = null;

function loadProducts(): readonly Product[] {
  if (_products === null) {
    const raw = readFileSync(resolve("data/products.json"), "utf-8");
    _products = ProductsSchema.parse(JSON.parse(raw));
  }
  return _products;
}

function loadCampanha(): CampanhaAtual {
  if (_campanha === null) {
    const raw = readFileSync(resolve("data/campanha-atual.json"), "utf-8");
    _campanha = CampanhaAtualSchema.parse(JSON.parse(raw));
  }
  return _campanha;
}

export type CatalogQueryOpts = { ativosOnly?: boolean };

export function getAllProducts(opts?: CatalogQueryOpts): readonly Product[] {
  const all = loadProducts();
  return opts?.ativosOnly ? all.filter((p) => p.ativo) : all;
}

export function getProductBySlug(slug: string): Product | null {
  if (!slug) return null;
  return loadProducts().find((p) => p.slug === slug) ?? null;
}

export function getProductsByCategory(
  categoria: Categoria,
  opts?: CatalogQueryOpts,
): readonly Product[] {
  const filtered = loadProducts().filter((p) => p.categoria === categoria);
  return opts?.ativosOnly ? filtered.filter((p) => p.ativo) : filtered;
}

export function getCampanhaAtual(): CampanhaAtual {
  return loadCampanha();
}

export function getProductsDestaque(): readonly Product[] {
  const campanha = loadCampanha();
  if (!campanha.ativa) return [];
  const slugSet = new Set(campanha.produtosDestaqueSlugs);
  return loadProducts().filter((p) => p.ativo && slugSet.has(p.slug));
}

export function categoryFromSlug(slug: string): Categoria | null {
  return getProductBySlug(slug)?.categoria ?? null;
}
