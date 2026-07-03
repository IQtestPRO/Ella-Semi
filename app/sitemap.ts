import type { MetadataRoute } from "next";
import { getAllProducts } from "../lib/catalog";
import { SITE_URL } from "../lib/site";

// Regenerado a cada hora (lê o catálogo do Turso).
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getAllProducts({ ativosOnly: true });
  const now = new Date();

  const productUrls: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${SITE_URL}/${p.categoria}/${p.slug}`,
    lastModified: new Date(p.atualizadoEm),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const categorias = Array.from(new Set(products.map((p) => p.categoria)));
  const categoriaUrls: MetadataRoute.Sitemap = categorias.map((c) => ({
    url: `${SITE_URL}/${c}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "weekly", priority: 1 },
    {
      url: `${SITE_URL}/produtos`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    { url: `${SITE_URL}/privacidade`, lastModified: now, priority: 0.2 },
    ...categoriaUrls,
    ...productUrls,
  ];
}
