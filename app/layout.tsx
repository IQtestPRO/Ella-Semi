import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";
import { Bodoni_Moda, Inter } from "next/font/google";
import "./globals.css";
import { GlobalUI } from "./components/GlobalUI";
import { getSetting } from "../lib/settings";
import { SITE_URL } from "../lib/site";
import { SiteConfigProvider } from "./components/SiteConfigProvider";

const fontHero = Bodoni_Moda({
  weight: ["400", "500"],
  // PT-BR é coberto por 'latin'; latin-ext adiciona glyphs sem uso (peso extra
  // no caminho do LCP textual). Varredura: performance "Bodoni latin-ext".
  subsets: ["latin"],
  variable: "--font-hero",
  display: "swap",
});

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

/**
 * Mobile-first (90% do tráfego é celular): theme-color pinta a UI do browser
 * de salmão (Android Chrome / iOS Safari 15+); viewportFit cover habilita
 * env(safe-area-inset-*) nos iPhones com notch/home indicator.
 */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#FFD9CC",
};

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSetting("seo");
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: seo.siteTitle, template: `%s — ${seo.siteTitle}` },
    description: seo.siteDescription,
    alternates: { canonical: "/" },
    openGraph: {
      type: "website",
      locale: "pt_BR",
      siteName: seo.siteTitle,
      title: seo.siteTitle,
      description: seo.siteDescription,
      url: SITE_URL,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.siteTitle,
      description: seo.siteDescription,
    },
  };
}

export default async function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  const [seo, marca] = await Promise.all([
    getSetting("seo"),
    getSetting("marca"),
  ]);

  // JSON-LD Organization + WebSite — reforça entidade de marca no Google.
  // Varredura: SEO "falta Organization/WebSite".
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: seo.siteTitle,
        url: SITE_URL,
        logo: `${SITE_URL}/brand/logo.jpg`,
        sameAs: [marca.instagram, marca.whatsappLinkGeral],
      },
      {
        "@type": "WebSite",
        name: seo.siteTitle,
        url: SITE_URL,
      },
    ],
  };

  return (
    <html lang="pt-BR" className={`${fontHero.variable} ${fontBody.variable}`}>
      <body>
        <SiteConfigProvider
          config={{
            whatsappNumero: marca.whatsappNumero,
            whatsappLinkGeral: marca.whatsappLinkGeral,
          }}
        >
          {children}
          <GlobalUI />
        </SiteConfigProvider>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </body>
    </html>
  );
}
