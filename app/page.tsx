import { getCampanhaAtual, getProductsDestaque } from "../lib/catalog";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { ProductCard } from "./components/ProductCard";
import { Sparkle } from "./components/Sparkle";

export default function HomePage() {
  const campanha = getCampanhaAtual();
  const destaques = getProductsDestaque();
  return (
    <>
      <Header />
      <main className="flex flex-col items-center gap-16 px-6 py-12">
        <section className="flex flex-col items-center gap-4">
          <h1 className="text-5xl">ELLA</h1>
          <Sparkle size={32} />
        </section>

        {destaques.length > 0 && (
          <section
            aria-labelledby="destaque-heading"
            className="flex w-full max-w-md flex-col items-center gap-6"
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
      </main>
      <Footer />
    </>
  );
}
