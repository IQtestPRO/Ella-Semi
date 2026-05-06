import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Bodoni_Moda, Inter } from "next/font/google";
import "./globals.css";
import { GlobalUI } from "./components/GlobalUI";

const fontHero = Bodoni_Moda({
  weight: ["400", "500"],
  subsets: ["latin", "latin-ext"],
  variable: "--font-hero",
  display: "swap",
});

const fontBody = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "ELLA Semijoias",
  description: "Joias e semijoias premium — atendimento direto pelo WhatsApp.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fontHero.variable} ${fontBody.variable}`}>
      <body>
        {children}
        <GlobalUI />
      </body>
    </html>
  );
}
