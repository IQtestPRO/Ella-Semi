import type { Product } from "../../../lib/schemas";

export function ProductJsonLd({ product }: { product: Product }) {
  const precoEfetivoCents = product.precoPromocionalCents ?? product.precoCents;
  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nome,
    description: product.descricao,
    image: product.fotos.map((f) => f.url),
    sku: product.slug,
    brand: { "@type": "Brand", name: "ELLA Semijoias" },
    category: product.categoria,
    offers: {
      "@type": "Offer",
      price: (precoEfetivoCents / 100).toFixed(2),
      priceCurrency: "BRL",
      availability: product.ativo
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `/${product.categoria}/${product.slug}`,
    },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "/" },
      {
        "@type": "ListItem",
        position: 2,
        name: product.categoria,
        item: `/${product.categoria}`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.nome,
        item: `/${product.categoria}/${product.slug}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
    </>
  );
}
