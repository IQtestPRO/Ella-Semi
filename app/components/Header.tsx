import Image from "next/image";
import Link from "next/link";
import { CartButton } from "./cart/CartButton";

export function Header() {
  return (
    <header className="relative flex items-center justify-between px-5 py-4 md:px-10">
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
    </header>
  );
}
