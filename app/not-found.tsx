import Link from "next/link";
import type { Metadata } from "next";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";

export const metadata: Metadata = {
  title: "Página não encontrada",
  robots: { index: false, follow: true },
};

/**
 * 404 da marca. Antes o projeto não tinha `not-found.tsx`: endereço errado caía
 * na tela crua do Next e ainda respondia HTTP 200 (soft 404), o que fazia o
 * Google indexar páginas fantasma. Aqui a pessoa recebe caminho de volta.
 */
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="flex min-h-[60svh] w-full flex-col items-center justify-center px-6 py-20 text-center">
        <span
          aria-hidden="true"
          className="text-[var(--color-dourado)]"
          style={{ fontSize: 28, lineHeight: 1 }}
        >
          ✦
        </span>
        <h1
          className="font-hero mt-5 text-[var(--color-preto-warm)]"
          style={{ fontSize: "clamp(30px, 7vw, 52px)", lineHeight: 1.1 }}
        >
          Esta página não existe
        </h1>
        <p className="mt-4 max-w-[42ch] text-[15px] leading-relaxed text-[var(--color-preto-warm)]/75">
          O endereço pode ter mudado, ou a peça que você procurava saiu do
          catálogo. Mas tem muita coisa bonita esperando por você.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            href="/produtos"
            className="inline-flex min-h-[48px] items-center rounded-full bg-[var(--color-preto-warm)] px-7 text-[12px] font-semibold uppercase tracking-[0.16em] text-[#FFF1ED] transition-[transform,background-color] duration-200 ease-brand hover:bg-[#3A2015] active:scale-[0.98]"
          >
            Ver todas as peças
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-[48px] items-center rounded-full border border-[var(--color-preto-warm)]/25 px-7 text-[12px] font-semibold uppercase tracking-[0.16em] text-[var(--color-preto-warm)] transition-[transform,border-color] duration-200 ease-brand hover:border-[var(--color-preto-warm)]/60 active:scale-[0.98]"
          >
            Voltar ao início
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
