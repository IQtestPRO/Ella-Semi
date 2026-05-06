"use client";

import dynamic from "next/dynamic";

// CartDrawer e Chatbot são puramente client-side. Carregam após hidratação
// para reduzir JS inicial e evitar mismatch de SSR com Zustand persist.
const CartDrawer = dynamic(
  () => import("./cart/CartDrawer").then((m) => m.CartDrawer),
  { ssr: false },
);

const Chatbot = dynamic(
  () => import("./chat/Chatbot").then((m) => m.Chatbot),
  { ssr: false },
);

/**
 * Container global — carrinho drawer + chatbot flutuante. Renderizado em
 * todas as rotas via app/layout.tsx.
 */
export function GlobalUI() {
  return (
    <>
      <CartDrawer />
      <Chatbot />
    </>
  );
}
