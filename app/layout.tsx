import type { Metadata } from "next";
import type { ReactNode } from "react";
import { DM_Serif_Display, Inter } from "next/font/google";
import "./globals.css";

const fontHero = DM_Serif_Display({
  weight: "400",
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
      <body>{children}</body>
    </html>
  );
}
