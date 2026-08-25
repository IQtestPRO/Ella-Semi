import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // AVIF além de WebP — ~20-30% menor (varredura: performance "next.config images").
  images: {
    formats: ["image/avif", "image/webp"],
  },
  // Chokers viraram Colares (ADR-0025). Link antigo já compartilhado no
  // Instagram/WhatsApp continua funcionando em vez de dar 404.
  async redirects() {
    return [
      { source: "/gargantilhas", destination: "/colares", permanent: true },
      {
        source: "/gargantilhas/:slug",
        destination: "/colares/:slug",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
