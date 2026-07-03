import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { TodasAsPecas } from "../components/home/TodasAsPecas";
import { getAllProducts } from "../../lib/catalog";

// ISR: página servida do cache da CDN (rápida) e regenerada a cada 5min —
// e IMEDIATAMENTE quando a Ellen salva no /admin (revalidatePath nas mutações).
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Todas as peças",
  description:
    "Catálogo completo de semijoias da ELLA — filtre por categoria, ordene por preço ou nome. Pedido finaliza pelo WhatsApp com a Ellen.",
  alternates: { canonical: "/produtos" },
};

export default async function ProdutosRoute() {
  const products = await getAllProducts({ ativosOnly: true });

  return (
    <>
      <Header />
      <main className="min-h-[60vh] w-full">
        {/* -mb compensa o py-16/py-24 do TodasAsPecas: gap breadcrumb→heading de 32px, igual à rota /[categoria] */}
        <div className="mx-auto -mb-8 max-w-[1280px] px-5 pt-8 md:-mb-16 md:px-10 md:pt-12">
          <nav
            aria-label="breadcrumb"
            className="mb-0 text-[11px] uppercase tracking-[0.16em] text-[var(--color-preto-warm)]/60"
          >
            <Link
              href="/"
              className="transition hover:text-[var(--color-preto-warm)]"
            >
              ELLA
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-preto-warm)]/90">
              Todas as peças
            </span>
          </nav>
        </div>
        <TodasAsPecas products={products} />
      </main>
      <Footer />
    </>
  );
}
