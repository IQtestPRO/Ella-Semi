import Link from "next/link";
import type { Product } from "../../../lib/schemas";
import { PRETTY_LABEL } from "../../../lib/categorias";
import { Footer } from "../Footer";
import { Header } from "../Header";
import { ProductDescription } from "./ProductDescription";
import { ProductGallery } from "./ProductGallery";
import { ProductHeader } from "./ProductHeader";
import { ProductJsonLd } from "./ProductJsonLd";
import { ProductStickyCTA } from "./ProductStickyCTA";
import { ProductVariantSelector } from "./ProductVariantSelector";
import { SobEncomendaNotice } from "./SobEncomendaNotice";

export function ProductPage({ product }: { product: Product }) {
  return (
    <>
      <ProductJsonLd product={product} />
      <Header />
      <main className="mx-auto grid max-w-6xl gap-8 px-4 pb-32 pt-6 lg:grid-cols-[minmax(0,1fr)_400px] lg:gap-12 lg:pb-12">
        {/* Mesmo dialeto de breadcrumb da rota /[categoria]: ELLA / categoria / peça. */}
        <nav
          aria-label="breadcrumb"
          className="text-[11px] uppercase tracking-[0.16em] text-[var(--color-preto-warm)]/60 lg:col-span-2"
        >
          <Link
            href="/"
            className="transition hover:text-[var(--color-preto-warm)]"
          >
            ELLA
          </Link>
          <span className="mx-2">/</span>
          <Link
            href={`/${product.categoria}`}
            className="transition hover:text-[var(--color-preto-warm)]"
          >
            {PRETTY_LABEL[product.categoria]}
          </Link>
          <span aria-hidden="true" className="mx-2 max-sm:hidden">
            /
          </span>
          <span
            aria-current="page"
            className="text-[var(--color-preto-warm)]/90 max-sm:hidden"
          >
            {product.nome}
          </span>
        </nav>
        <div className="lg:order-1">
          <ProductGallery product={product} />
        </div>
        <div className="flex flex-col gap-6 lg:order-2 lg:sticky lg:top-6 lg:self-start">
          <ProductHeader product={product} />
          <SobEncomendaNotice product={product} />
          <ProductVariantSelector product={product} />
          {/* Reassurance perto do CTA — peça em promoção não tem troca (ADR-0009/0011). */}
          <ul className="flex flex-col gap-1.5 border-y border-[var(--color-preto-warm)]/10 py-3 text-xs text-[var(--color-preto-warm)]/75">
            {[
              ...(product.promocao ? [] : ["Troca em 7 dias"]),
              "Garantia das semijoias",
              "Atendimento direto com a Ellen",
            ].map((item) => (
              <li key={item} className="flex items-center gap-2">
                <span aria-hidden="true" className="text-[var(--color-dourado)]">
                  ✦
                </span>
                {item}
              </li>
            ))}
          </ul>
          <ProductDescription product={product} />
          <div className="hidden lg:block">
            <ProductStickyCTA product={product} />
          </div>
        </div>
      </main>
      <div className="lg:hidden">
        <ProductStickyCTA product={product} />
      </div>
      <Footer />
    </>
  );
}
