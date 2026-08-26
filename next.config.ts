import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  images: {
    // AVIF além de WebP — ~20-30% menor (varredura: performance "next.config images").
    formats: ["image/avif", "image/webp"],
    // O padrão do Next é 60 SEGUNDOS: passado esse tempo o otimizador joga a
    // versão otimizada fora e refaz tudo — inclusive buscar o BLOB no Turso de
    // novo. Como cada foto tem id imutável (upload novo = id novo), dá para
    // guardar por um ano. É o que fazia as fotos demorarem a aparecer.
    minimumCacheTTL: 31536000,
    // Larguras que o site realmente usa (cards em 2 col no celular, 4 no
    // desktop, galeria da peça). Sem isto o Next gera até 3840px — peso à toa.
    deviceSizes: [360, 420, 640, 828, 1080, 1280, 1920],
    imageSizes: [96, 128, 200, 256, 320, 384],
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
