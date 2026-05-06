import {
  getAllProducts,
  getCampanhaAtual,
  getCategoryCounts,
  getMaisVendidos,
  getProductsDestaque,
} from "../lib/catalog";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { Categorias } from "./components/home/Categorias";
import { Hero } from "./components/home/Hero";
import { MaisVendidos } from "./components/home/MaisVendidos";
import { ProductCard } from "./components/ProductCard";

export default function HomePage() {
  const campanha = getCampanhaAtual();
  const destaques = getProductsDestaque();
  const maisVendidos = getMaisVendidos();
  const categoryCounts = getCategoryCounts();
  const allActiveProducts = getAllProducts({ ativosOnly: true });

  return (
    <>
      <Header />
      <main className="flex flex-col">
        <Hero />

        <MaisVendidos products={maisVendidos} />

        <Categorias counts={categoryCounts} />

        {destaques.length > 0 && (
          <section
            aria-labelledby="destaque-heading"
            className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-6 py-16"
          >
            <header className="flex flex-col items-center gap-2 text-center">
              <span
                id="destaque-heading"
                className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--color-preto-warm)]/70"
              >
                Em destaque agora · {campanha.nomeExibicao}
              </span>
            </header>
            <ProductCard product={destaques[0]} eyebrow={campanha.nomeExibicao} />
          </section>
        )}

        {/* Grid Filtrável + Banner são adicionados em commits seguintes. */}
        <noscript>
          <p>Catálogo completo: {allActiveProducts.length} peças.</p>
        </noscript>
      </main>
      <Footer />
    </>
  );
}
