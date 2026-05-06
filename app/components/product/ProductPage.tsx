import type { Product } from "../../../lib/schemas";
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
        <div className="lg:order-1">
          <ProductGallery product={product} />
        </div>
        <div className="flex flex-col gap-6 lg:order-2 lg:sticky lg:top-6 lg:self-start">
          <ProductHeader product={product} />
          <SobEncomendaNotice product={product} />
          <ProductVariantSelector product={product} />
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
