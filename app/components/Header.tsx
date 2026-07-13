"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartButton } from "./cart/CartButton";

// Categorias com estoque real (anéis sai até a Ellen cadastrar anéis).
const NAV_LINKS = [
  { href: "/colares", label: "Colares" },
  { href: "/brincos", label: "Brincos" },
  { href: "/pulseiras", label: "Pulseiras" },
  { href: "/conjuntos", label: "Conjuntos" },
  { href: "/produtos", label: "Todas as peças" },
] as const;

/**
 * Chrome persistente do site (lapidação S4): sticky com véu warm translúcido
 * (backdrop-blur) e borda hairline que só aparece ao rolar (scrollY > 8) —
 * logo + carrinho + nav mínima de texto sempre acessíveis, já que o carrinho
 * é o único funil e a nav de categorias antes só existia no meio da home.
 */
export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-30 border-b bg-[var(--color-salmao)]/85 backdrop-blur-md transition-[border-color] duration-200 ease-brand ${
        scrolled
          ? "border-[var(--color-preto-warm)]/[0.08]"
          : "border-transparent"
      }`}
    >
      <div className="relative flex items-center justify-between px-5 pt-3 md:px-10">
        {/* Spacer esquerdo balanceia o CartButton à direita pra logo ficar centralizado */}
        <div aria-hidden="true" className="h-12 w-12 md:h-14 md:w-14" />

        <Link
          href="/"
          aria-label="ELLA — voltar para a home"
          className="flex items-center justify-center"
        >
          <Image
            src="/brand/logo.jpg"
            alt="ELLA — joias e semijoias"
            width={64}
            height={64}
            priority
            className="h-14 w-14 md:h-16 md:w-16"
          />
        </Link>

        <CartButton />
      </div>

      {/* Nav mínima de texto — caminho persistente pro catálogo em toda página */}
      {/* Nav mobile-first: faixa rolável horizontal (nunca estoura a viewport
          em 360px) e centrada no desktop; cada Link com 44px de altura de
          toque. Barra de rolagem escondida. */}
      <nav
        aria-label="Categorias"
        className="flex items-center justify-start gap-2 overflow-x-auto px-5 pb-1.5 pt-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:justify-center md:gap-3 md:overflow-visible"
      >
        {NAV_LINKS.map((item, i) => (
          <span
            key={item.href}
            className="flex shrink-0 items-center gap-2 md:gap-3"
          >
            {i > 0 && (
              <span
                aria-hidden="true"
                className="text-[10px] text-[var(--color-preto-warm)]/35"
              >
                ·
              </span>
            )}
            <Link
              href={item.href}
              className="inline-flex min-h-[44px] items-center whitespace-nowrap text-[10px] font-medium uppercase tracking-[0.16em] text-[var(--color-preto-warm)]/70 transition-colors duration-200 ease-out-soft hover:text-[var(--color-preto-warm)] active:text-[var(--color-preto-warm)] md:text-[11px]"
            >
              {item.label}
            </Link>
          </span>
        ))}
      </nav>
    </header>
  );
}
