"use client";

import { createContext, useContext, type ReactNode } from "react";

/**
 * Config pública do site que precisa chegar nos Client Components (carrinho,
 * FAB). É lida server-side das `settings` (banco) no layout e injetada aqui,
 * para que o número de WhatsApp editável pela Ellen no /admin valha sem
 * depender de env var em tempo de build.
 */
export type SiteConfig = {
  whatsappNumero: string;
  whatsappLinkGeral: string;
};

const DEFAULT_CONFIG: SiteConfig = {
  whatsappNumero: "5500000000000",
  whatsappLinkGeral: "https://wa.link/adq88g",
};

const SiteConfigContext = createContext<SiteConfig>(DEFAULT_CONFIG);

export function SiteConfigProvider({
  config,
  children,
}: {
  config: SiteConfig;
  children: ReactNode;
}) {
  return (
    <SiteConfigContext.Provider value={config}>
      {children}
    </SiteConfigContext.Provider>
  );
}

export function useSiteConfig(): SiteConfig {
  return useContext(SiteConfigContext);
}
