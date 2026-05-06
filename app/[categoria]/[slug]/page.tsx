import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "../../components/product/ProductPage";
import {
  getAllProducts,
  getProductBySlug,
} from "../../../lib/catalog";
import type { Categoria } from "../../../lib/schemas";

type Params = { categoria: string; slug: string };

export async function generateStaticParams(): Promise<Params[]> {
  return getAllProducts({ ativosOnly: true }).map((p) => ({
    categoria: p.categoria,
    slug: p.slug,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) {
    return { title: "Peça não encontrada — ELLA Semijoias" };
  }
  return {
    title: `${product.nome} — ELLA Semijoias`,
    description: product.descricao,
    openGraph: {
      title: product.nome,
      description: product.descricao,
      images: product.fotos.length > 0 ? [product.fotos[0].url] : [],
    },
  };
}

export default async function ProductRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { categoria, slug } = await params;
  const product = getProductBySlug(slug);
  if (!product || product.categoria !== (categoria as Categoria) || !product.ativo) {
    notFound();
  }
  return <ProductPage product={product} />;
}
