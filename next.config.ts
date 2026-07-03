import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  // AVIF além de WebP — ~20-30% menor (varredura: performance "next.config images").
  images: {
    formats: ["image/avif", "image/webp"],
  },
};

export default nextConfig;
