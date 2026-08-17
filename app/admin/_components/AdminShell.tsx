"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import type { ReactNode } from "react";

/**
 * Casca do painel (ADR-0024).
 *
 * Menu SEMPRE visível — nada de esconder atrás de três tracinhos, porque quem
 * não conhece o símbolo não descobre que existe menu. Cada item tem um desenho
 * (emoji) + um nome em português comum: "Campanha"/"Conteúdo do site" eram
 * palavras de quem faz site, não de quem vende joia.
 */
const NAV = [
  { href: "/admin", label: "Início", icone: "🏠", exact: true },
  { href: "/admin/produtos", label: "Minhas peças", icone: "💍" },
  { href: "/admin/campanha", label: "Vitrine de destaque", icone: "⭐" },
  { href: "/admin/conteudo", label: "Textos e fotos do site", icone: "📝" },
];

export function AdminShell({
  children,
  title,
  subtitulo,
}: {
  children: ReactNode;
  title?: string;
  /** Frase curta dizendo o que essa tela muda no site. */
  subtitulo?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();

  function isActive(item: (typeof NAV)[number]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  async function logout() {
    if (!window.confirm("Sair do painel?")) return;
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--color-salmao-claro)]">
      <header className="sticky top-0 z-20 border-b border-[var(--color-areia)] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <Link href="/admin" className="font-hero text-xl tracking-wide">
            ELLA{" "}
            <span className="text-sm font-normal text-[var(--color-taupe)]">
              painel
            </span>
          </Link>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center rounded-xl border border-[var(--color-areia)] px-3 text-sm font-medium text-[var(--color-preto-warm)] transition hover:border-[var(--color-taupe)]"
            >
              Ver meu site ↗
            </a>
            <button
              type="button"
              onClick={logout}
              className="inline-flex min-h-[44px] items-center rounded-xl px-3 text-sm font-medium text-[var(--color-taupe)] transition hover:text-[var(--color-preto-warm)]"
            >
              Sair
            </button>
          </div>
        </div>

        {/* Menu sempre visível — rola de lado no celular, nunca some */}
        <nav
          aria-label="Seções do painel"
          className="flex gap-2 overflow-x-auto border-t border-[var(--color-areia)]/70 px-4 py-2 [scrollbar-width:none] md:mx-auto md:max-w-5xl md:px-6 [&::-webkit-scrollbar]:hidden"
        >
          {NAV.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={`inline-flex min-h-[48px] flex-shrink-0 items-center gap-2 whitespace-nowrap rounded-xl px-3.5 text-[15px] font-medium transition ${
                  active
                    ? "bg-[var(--color-preto-warm)] text-[var(--color-salmao-claro)]"
                    : "text-[var(--color-preto-warm)] hover:bg-[var(--color-salmao-claro)]"
                }`}
              >
                <span aria-hidden="true" className="text-lg">
                  {item.icone}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
        {title && (
          <header className="mb-6">
            <h1 className="text-2xl font-semibold text-[var(--color-preto-warm)] md:text-3xl">
              {title}
            </h1>
            {subtitulo && (
              <p className="mt-1.5 max-w-2xl text-[15px] leading-snug text-[var(--color-taupe)]">
                {subtitulo}
              </p>
            )}
          </header>
        )}
        {children}
      </main>
    </div>
  );
}
