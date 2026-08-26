"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { CartButton } from "./cart/CartButton";

export type NavLink = { href: string; label: string };

/**
 * Parte interativa do chrome (sticky + borda que aparece ao rolar). Recebe os
 * links prontos do servidor — assim uma categoria sem peça no ar nunca vira
 * um item de menu que leva a uma página vazia.
 */
export function HeaderChrome({ links }: { links: readonly NavLink[] }) {
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
            width={128}
            height={128}
            priority
            // Ellen pediu logo maior. Mobile-first: 72px no celular (era 56),
            // 88px do tablet pra cima (era 64). width/height dobrados para a
            // imagem continuar nítida em tela retina.
            className="h-[72px] w-[72px] md:h-[88px] md:w-[88px]"
          />
        </Link>

        <CartButton />
      </div>

      {/* Nav mobile-first: faixa rolável horizontal (nunca estoura a viewport
          em 360px) e centrada no desktop; cada Link com 44px de altura de
          toque. Barra de rolagem escondida. */}
      <nav
        aria-label="Categorias"
        className="flex items-center justify-start gap-2 overflow-x-auto px-5 pb-1.5 pt-0.5 [scrollbar-width:none] md:justify-center md:gap-3 md:overflow-visible [&::-webkit-scrollbar]:hidden"
      >
        {links.map((item, i) => (
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
