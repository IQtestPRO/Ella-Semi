"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  videoSrc?: string;
  fallbackSrc?: string;
  /** Texto sobreposto centralizado. Default: tagline editorial. */
  text?: string;
};

/**
 * Banner intermediário entre seções da home (loop ambient sem pessoas).
 *
 * Pak: cena tactile linho cru sobre madeira clara, slow pan 4s, sparkles
 * dourados sutis flutuando. Texto Bodoni Moda branca centralizado.
 *
 * Comporta-se como Hero — gradient warm fallback sempre visível, video
 * autoplay muted loop playsinline por cima, prefers-reduced-motion troca
 * pra still webp.
 */
export function BannerMeio({
  videoSrc = "/banners/banner-meio.mp4",
  fallbackSrc = "/banners/banner-meio-fallback.webp",
  text = "Cada peça, uma história em ouro.",
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  const showVideo = !reduceMotion && !videoFailed;

  return (
    <section
      aria-label="Banner editorial"
      className="relative w-full overflow-hidden"
      style={{
        height: "clamp(280px, 38vh, 460px)",
        background:
          "linear-gradient(120deg, #F0DCC4 0%, #E8D2BB 45%, #D9BFA1 100%)",
      }}
      data-testid="banner-meio"
    >
      <img
        src={fallbackSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: showVideo ? 0 : 1, transition: "opacity 600ms ease" }}
        onError={(e) => {
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />

      {showVideo && (
        <video
          ref={videoRef}
          autoPlay
          muted
          loop
          playsInline
          poster={fallbackSrc}
          preload="metadata"
          className="absolute inset-0 h-full w-full object-cover"
          onError={() => setVideoFailed(true)}
          data-testid="banner-meio-video"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to bottom, rgba(37, 16, 8, 0.16) 0%, rgba(37, 16, 8, 0.32) 60%, rgba(37, 16, 8, 0.48) 100%)",
        }}
      />

      <div className="relative z-10 flex h-full items-center justify-center px-6 text-center">
        <p
          className="font-hero text-white"
          style={{
            fontSize: "clamp(22px, 3.4vw, 38px)",
            fontWeight: 400,
            letterSpacing: "0.02em",
            lineHeight: 1.25,
            textShadow: "0 2px 14px rgba(37, 16, 8, 0.45)",
            maxWidth: "22ch",
          }}
        >
          {text}
        </p>
      </div>
    </section>
  );
}
