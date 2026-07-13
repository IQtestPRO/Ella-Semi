import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ProductPage } from "../../components/product/ProductPage";
import { getProductBySlug } from "../../../lib/catalog";
import { formatBRL } from "../../../lib/format/currency";
import type { Categoria } from "../../../lib/schemas";

// ISR: página servida do cache da CDN (rápida) e regenerada a cada 5min —
// e IMEDIATAMENTE quando a Ellen salva no /admin (revalidatePath nas mutações).
export const revalidate = 300;

type Params = { categoria: string; slug: string };

const CATEGORIA_LABEL: Record<string, string> = {
  brincos: "Brinco",
  colares: "Colar",
  pulseiras: "Pulseira",
  aneis: "Anel",
  conjuntos: "Conjunto",
  gargantilhas: "Gargantilha",
  tornozeleiras: "Tornozeleira",
  piercings: "Piercing",
  outros: "Peça",
};

const BANHO_LABEL: Record<string, string> = {
  ouro: "banho de ouro",
  prata: "banho de prata",
  rodio: "banho de ródio",
  "ouro-rose": "banho de ouro rosé",
  "a-confirmar": "semijoia",
};

/**
 * Description SEO única por peça (combina nome + banho + preço) — evita as
 * ~141 meta descriptions duplicadas que o campo `descricao` genérico gerava.
 * Varredura: SEO/conteúdo "descricao duplicada".
 */
function metaDescription(nome: string, banho: string, precoCents: number): string {
  const banhoTxt = BANHO_LABEL[banho] ?? "semijoia";
  return `${nome} em ${banhoTxt}. ${formatBRL(precoCents)}. Atendimento e pedido direto pelo WhatsApp com a Ellen — ELLA Semijoias, Rio Bonito RJ.`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return { title: "Peça não encontrada" };
  }
  const desc = metaDescription(product.nome, product.banho, product.precoCents);
  const canonical = `/${product.categoria}/${product.slug}`;
  return {
    title: product.nome,
    description: desc,
    alternates: { canonical },
    openGraph: {
      title: product.nome,
      description: desc,
      type: "website",
      url: canonical,
      images: product.fotos.length > 0 ? [product.fotos[0].url] : undefined,
    },
  };
}

export default async function ProductRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { categoria, slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || product.categoria !== (categoria as Categoria) || !product.ativo) {
    notFound();
  }
  return <ProductPage product={product} />;
}
