import {
  getCampanhaAtual,
  getCategoryCounts,
  getMaisVendidos,
  getProductsDestaque,
} from "../lib/catalog";
import { getSetting } from "../lib/settings";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import { BannerMeio } from "./components/home/BannerMeio";
import { Categorias } from "./components/home/Categorias";
import { Hero } from "./components/home/Hero";
import { MaisVendidos } from "./components/home/MaisVendidos";
import { SobreNos } from "./components/home/SobreNos";
import { ProductCard } from "./components/ProductCard";
import { Reveal } from "./components/Reveal";

// ISR: página servida do cache da CDN (rápida) e regenerada a cada 5min —
// e IMEDIATAMENTE quando a Ellen salva no /admin (revalidatePath nas mutações).
export const revalidate = 300;

export default async function HomePage() {
  const [
    campanha,
    destaques,
    maisVendidos,
    categoryCounts,
    hero,
    banner,
    sobre,
    faq,
  ] = await Promise.all([
    getCampanhaAtual(),
    getProductsDestaque(),
    getMaisVendidos(),
    getCategoryCounts(),
    getSetting("hero"),
    getSetting("bannerMeio"),
    getSetting("sobre"),
    getSetting("faq"),
  ]);

  return (
    <>
      <Header />
      <main className="flex flex-col">
        <Hero
          subtitulo={hero.subtitulo}
          videoSrc={hero.videoUrl}
          fallbackSrc={hero.fallbackUrl}
        />

        <Reveal>
          <MaisVendidos products={maisVendidos} />
        </Reveal>

        <Reveal>
          <BannerMeio
            text={banner.texto}
            videoSrc={banner.videoUrl}
            fallbackSrc={banner.fallbackUrl}
          />
        </Reveal>

        <Reveal>
          <Categorias counts={categoryCounts} />
        </Reveal>

        {campanha.ativa && destaques.length > 0 && (
          <Reveal>
          <section
            aria-labelledby="destaque-heading"
            className="w-full bg-[var(--color-salmao-claro)]/50 px-5 py-16 md:px-10 md:py-24"
          >
            <div className="mx-auto flex max-w-[1180px] flex-col gap-8">
              <header className="flex flex-col items-center gap-3 text-center">
                <span
                  id="destaque-heading"
                  className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[var(--color-preto-warm)]/70"
                >
                  Em destaque agora · {campanha.nomeExibicao}
                </span>
                <p className="max-w-xl text-[15px] leading-relaxed text-[var(--color-preto-warm)]/80">
                  {campanha.manifesto}
                </p>
              </header>
              <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-12">
                {destaques.map((p, i) => (
                  <li key={p.slug}>
                    <ProductCard product={p} eyebrow={campanha.nomeExibicao} priority={i < 2} />
                  </li>
                ))}
              </ul>
            </div>
          </section>
          </Reveal>
        )}

        <Reveal>
          <SobreNos
            sobre={sobre}
            faq={faq.itens}
          />
        </Reveal>
      </main>
      <Footer />
    </>
  );
}
