"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

// CartDrawer e WhatsAppFloatButton são puramente client-side. Carregam
// após hidratação pra reduzir JS inicial e evitar mismatch de SSR com
// Zustand persist.
const CartDrawer = dynamic(
  () => import("./cart/CartDrawer").then((m) => m.CartDrawer),
  { ssr: false },
);

const WhatsAppFloatButton = dynamic(
  () =>
    import("./cart/WhatsAppFloatButton").then((m) => m.WhatsAppFloatButton),
  { ssr: false },
);

/**
 * Container global — carrinho drawer + FAB WhatsApp. Renderizado em todas
 * as rotas via `app/layout.tsx`. Substituiu chatbot da S2.2 (ADR-0020).
 */
export function GlobalUI() {
  const pathname = usePathname();
  // O painel /admin não mostra carrinho nem FAB do WhatsApp.
  if (pathname?.startsWith("/admin")) return null;
  return (
    <>
      <CartDrawer />
      <WhatsAppFloatButton />
    </>
  );
}
