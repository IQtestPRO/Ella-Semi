"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

const NAV = [
  { href: "/admin", label: "Início", exact: true },
  { href: "/admin/produtos", label: "Produtos" },
  { href: "/admin/campanha", label: "Campanha" },
  { href: "/admin/conteudo", label: "Conteúdo do site" },
];

export function AdminShell({
  children,
  title,
}: {
  children: ReactNode;
  title?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  function isActive(item: (typeof NAV)[number]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="min-h-screen bg-[var(--color-salmao-claro)]">
      {/* Topbar */}
      <header className="sticky top-0 z-20 border-b border-[var(--color-areia)] bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 md:px-6">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label="Abrir menu"
              className="rounded-lg border border-[var(--color-areia)] px-2.5 py-2 md:hidden"
            >
              <span className="block h-0.5 w-5 bg-[var(--color-preto-warm)]" />
              <span className="mt-1 block h-0.5 w-5 bg-[var(--color-preto-warm)]" />
              <span className="mt-1 block h-0.5 w-5 bg-[var(--color-preto-warm)]" />
            </button>
            <Link href="/admin" className="font-hero text-xl tracking-wide">
              ELLA <span className="text-sm font-normal text-[var(--color-taupe)]">painel</span>
            </Link>
          </div>
          <nav className="hidden items-center gap-1 md:flex">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                  isActive(item)
                    ? "bg-[var(--color-preto-warm)] text-[var(--color-salmao-claro)]"
                    : "text-[var(--color-preto-warm)] hover:bg-[var(--color-salmao-claro)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="hidden rounded-lg border border-[var(--color-areia)] px-3 py-2 text-sm font-medium text-[var(--color-preto-warm)] transition hover:border-[var(--color-taupe)] sm:inline-block"
            >
              Ver site ↗
            </a>
            <button
              type="button"
              onClick={logout}
              className="rounded-lg px-3 py-2 text-sm font-medium text-[var(--color-taupe)] transition hover:text-[var(--color-preto-warm)]"
            >
              Sair
            </button>
          </div>
        </div>
        {/* Mobile nav */}
        {open && (
          <nav className="flex flex-col gap-1 border-t border-[var(--color-areia)] px-4 py-3 md:hidden">
            {NAV.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`rounded-lg px-3 py-2.5 text-sm font-medium transition ${
                  isActive(item)
                    ? "bg-[var(--color-preto-warm)] text-[var(--color-salmao-claro)]"
                    : "text-[var(--color-preto-warm)] hover:bg-[var(--color-salmao-claro)]"
                }`}
              >
                {item.label}
              </Link>
            ))}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg px-3 py-2.5 text-sm font-medium text-[var(--color-preto-warm)]"
            >
              Ver site ↗
            </a>
          </nav>
        )}
      </header>

      <main className="mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-10">
        {title && (
          <h1 className="mb-6 text-2xl font-semibold text-[var(--color-preto-warm)] md:text-3xl">
            {title}
          </h1>
        )}
        {children}
      </main>
    </div>
  );
}
