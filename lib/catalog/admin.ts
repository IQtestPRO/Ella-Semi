import { z } from "zod";
import { db } from "../db";
import {
  CampanhaAtualSchema,
  ProductSchema,
  type CampanhaAtual,
  type Product,
} from "../schemas";

/**
 * Mutações de catálogo usadas pelo /admin (ADR-0021). Mantém a validação Zod
 * como porta de escrita: nada entra no banco sem bater com o schema de domínio.
 */

// ── Produtos ────────────────────────────────────────────────────────────────

export const ProductWriteSchema = ProductSchema.omit({
  cadastradoEm: true,
  atualizadoEm: true,
}).extend({
  // slug é opcional na criação (derivado do nome) e imutável depois (mantém
  // URLs e links estáveis para SEO).
  slug: ProductSchema.shape.slug.optional(),
});
export type ProductWriteInput = z.input<typeof ProductWriteSchema>;

function slugify(s: string): string {
  return (
    s
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "peca"
  );
}

async function slugExists(slug: string): Promise<boolean> {
  const rs = await db.execute({
    sql: "SELECT 1 FROM products WHERE slug = ? LIMIT 1",
    args: [slug],
  });
  return rs.rows.length > 0;
}

function bool(v: boolean): number {
  return v ? 1 : 0;
}
const jsonOrNull = (v: unknown) =>
  v === undefined || v === null ? null : JSON.stringify(v);

async function writeRow(p: Product, ordem: number): Promise<void> {
  await db.execute({
    sql: `INSERT INTO products
      (slug, nome, codigo, categoria, banho, tipo, precoCents, precoPromocionalCents, descricao,
       fotos, videoUrl, variantes, tags, promocao, tipoFulfillment, destaqueHome, maisVendido,
       ativo, origem, fonteFotoFraca, cadastradoEm, atualizadoEm, ordem)
      VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(slug) DO UPDATE SET
        nome=excluded.nome, codigo=excluded.codigo, categoria=excluded.categoria, banho=excluded.banho, tipo=excluded.tipo,
        precoCents=excluded.precoCents, precoPromocionalCents=excluded.precoPromocionalCents,
        descricao=excluded.descricao, fotos=excluded.fotos, videoUrl=excluded.videoUrl, variantes=excluded.variantes,
        tags=excluded.tags, promocao=excluded.promocao, tipoFulfillment=excluded.tipoFulfillment,
        destaqueHome=excluded.destaqueHome, maisVendido=excluded.maisVendido, ativo=excluded.ativo,
        origem=excluded.origem, fonteFotoFraca=excluded.fonteFotoFraca,
        atualizadoEm=excluded.atualizadoEm`,
    args: [
      p.slug,
      p.nome,
      p.codigo ?? null,
      p.categoria,
      p.banho,
      p.tipo,
      p.precoCents,
      p.precoPromocionalCents ?? null,
      p.descricao,
      JSON.stringify(p.fotos),
      p.videoUrl ?? null,
      jsonOrNull(p.variantes),
      jsonOrNull(p.tags),
      bool(p.promocao),
      p.tipoFulfillment,
      bool(p.destaqueHome),
      bool(p.maisVendido),
      bool(p.ativo),
      jsonOrNull(p.origem),
      p.fonteFotoFraca === undefined ? null : bool(p.fonteFotoFraca),
      p.cadastradoEm,
      p.atualizadoEm,
      ordem,
    ],
  });
}

export async function createProduct(input: ProductWriteInput): Promise<Product> {
  const data = ProductWriteSchema.parse(input);
  const base = data.slug && data.slug.length ? data.slug : slugify(data.nome);
  let slug = base;
  let i = 2;
  while (await slugExists(slug)) slug = `${base}-${i++}`;

  const now = new Date().toISOString();
  const product = ProductSchema.parse({
    ...data,
    slug,
    cadastradoEm: now,
    atualizadoEm: now,
  });

  const ordemRs = await db.execute(
    "SELECT COALESCE(MAX(ordem), -1) + 1 AS n FROM products",
  );
  await writeRow(product, Number(ordemRs.rows[0].n));
  return product;
}

export async function updateProduct(
  slug: string,
  input: ProductWriteInput,
): Promise<Product> {
  const existingRs = await db.execute({
    sql: "SELECT cadastradoEm, ordem FROM products WHERE slug = ? LIMIT 1",
    args: [slug],
  });
  if (existingRs.rows.length === 0) {
    throw new Error(`Produto não encontrado: ${slug}`);
  }
  const cadastradoEm = existingRs.rows[0].cadastradoEm as string;
  const ordem = Number(existingRs.rows[0].ordem);

  const data = ProductWriteSchema.parse(input);
  const product = ProductSchema.parse({
    ...data,
    slug, // slug imutável: ignora qualquer slug no payload
    cadastradoEm,
    atualizadoEm: new Date().toISOString(),
  });
  await writeRow(product, ordem);
  return product;
}

export async function deleteProduct(slug: string): Promise<void> {
  await db.execute({ sql: "DELETE FROM products WHERE slug = ?", args: [slug] });
}

// ── Campanha ────────────────────────────────────────────────────────────────

export const CampanhaWriteSchema = CampanhaAtualSchema.omit({
  atualizadoEm: true,
});
export type CampanhaWriteInput = z.input<typeof CampanhaWriteSchema>;

export async function updateCampanha(
  input: CampanhaWriteInput,
): Promise<CampanhaAtual> {
  const data = CampanhaWriteSchema.parse(input);
  const campanha = CampanhaAtualSchema.parse({
    ...data,
    atualizadoEm: new Date().toISOString(),
  });
  await db.execute({
    sql: `INSERT INTO campanha
      (id, slug, nomeExibicao, manifesto, heroVideo, heroImagem, ctaTexto, produtosDestaqueSlugs, ativa, atualizadoEm)
      VALUES (1,?,?,?,?,?,?,?,?,?)
      ON CONFLICT(id) DO UPDATE SET
        slug=excluded.slug, nomeExibicao=excluded.nomeExibicao, manifesto=excluded.manifesto,
        heroVideo=excluded.heroVideo, heroImagem=excluded.heroImagem, ctaTexto=excluded.ctaTexto,
        produtosDestaqueSlugs=excluded.produtosDestaqueSlugs, ativa=excluded.ativa, atualizadoEm=excluded.atualizadoEm`,
    args: [
      campanha.slug,
      campanha.nomeExibicao,
      campanha.manifesto,
      campanha.heroVideo ?? null,
      campanha.heroImagem ?? null,
      campanha.ctaTexto,
      JSON.stringify(campanha.produtosDestaqueSlugs),
      campanha.ativa ? 1 : 0,
      campanha.atualizadoEm,
    ],
  });
  return campanha;
}
