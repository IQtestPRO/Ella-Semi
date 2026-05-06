import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="relative flex items-center justify-between px-5 py-4 md:px-10">
      {/* Spacer esquerdo (mantém logo central no eixo desktop, e aria-balance no mobile) */}
      <div aria-hidden="true" className="w-12 md:w-16" />

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

      <Link
        href="/produtos"
        aria-label="Ver todas as peças do catálogo"
        className="group inline-flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:bg-[var(--color-salmao-claro)] md:h-14 md:w-14"
        data-testid="header-produtos-link"
      >
        {/* Ícone shopping bag minimalist editorial — SVG inline ~700B */}
        <svg
          width="22"
          height="24"
          viewBox="0 0 22 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-[var(--color-preto-warm)] transition-colors group-hover:text-[#A47525]"
          aria-hidden="true"
        >
          {/* Bag body */}
          <path d="M3 8 L4 22 L18 22 L19 8 Z" />
          {/* Handle arc */}
          <path d="M7 8 V6 a4 4 0 0 1 8 0 V8" />
          {/* Sparkle interior accent */}
          <path d="M11 13 L11.6 14.4 L13 15 L11.6 15.6 L11 17 L10.4 15.6 L9 15 L10.4 14.4 Z" fill="currentColor" stroke="none" opacity="0.85" />
        </svg>
      </Link>
    </header>
  );
}
