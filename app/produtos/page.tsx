import type { Metadata } from "next";
import Link from "next/link";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { TodasAsPecas } from "../components/home/TodasAsPecas";
import { getAllProducts } from "../../lib/catalog";

export const metadata: Metadata = {
  title: "Todas as peças — ELLA Semijoias",
  description:
    "Catálogo completo da Coleção Folhas de Outono — filtre por categoria, ordene por preço ou nome. Pedido finaliza pelo WhatsApp.",
};

export default function ProdutosRoute() {
  const products = getAllProducts({ ativosOnly: true });

  return (
    <>
      <Header />
      <main className="min-h-[60vh] w-full">
        <div className="mx-auto max-w-[1280px] px-5 pt-8 md:px-10 md:pt-12">
          <nav
            aria-label="breadcrumb"
            className="mb-6 text-[11px] uppercase tracking-[0.2em] text-[var(--color-preto-warm)]/60"
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
