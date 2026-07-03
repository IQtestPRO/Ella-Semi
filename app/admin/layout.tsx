import type { Metadata } from "next";
import type { ReactNode } from "react";

// O painel nunca deve ser indexado por buscadores.
export const metadata: Metadata = {
  title: "Painel ELLA",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return children;
}
