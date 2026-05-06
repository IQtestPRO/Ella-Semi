"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
  /** Optional override for the video src (defaults to /hero/hero-loop.mp4) */
  videoSrc?: string;
  /** Optional override for the still fallback (defaults to /hero/hero-fallback.webp) */
  fallbackSrc?: string;
};

/**
 * Hero da Marca — ponte transitória ADR-0018.
 *
 * Renders a warm editorial cinematic loop. Falls back to a still image when
 * `prefers-reduced-motion` is set, OR when the video element fails to load
 * (e.g. before the Higgsfield Cinema Studio output is dropped into
 * /public/hero/). The static gradient + overlay always render, so the section
 * is never visually empty.
 */
export function Hero({
  videoSrc = "/hero/hero-loop.mp4",
  fallbackSrc = "/hero/hero-fallback.webp",
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
      aria-label="Hero ELLA — warm editorial soft glam"
      className="relative w-full overflow-hidden"
      style={{
        // 80vh desktop, 60vh mobile (clamped)
        height: "clamp(60vh, 80vh, 880px)",
        background:
          "linear-gradient(135deg, #F8E0CD 0%, #F0DCC4 35%, #E8D2BB 70%, #D9BFA1 100%)",
      }}
      data-testid="hero"
    >
      {/* Static fallback — always rendered as base layer */}
      <img
        src={fallbackSrc}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover"
        style={{ opacity: showVideo ? 0 : 1, transition: "opacity 600ms ease" }}
        onError={(e) => {
          // If fallback also fails, hide it (gradient remains visible)
          (e.currentTarget as HTMLImageElement).style.display = "none";
        }}
      />

      {/* Video layer — only when motion allowed and not failed */}
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
          data-testid="hero-video"
        >
          <source src={videoSrc} type="video/mp4" />
        </video>
      )}

      {/* Gradient overlay bottom→top for legibility */}
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(to top, rgba(37, 16, 8, 0.42) 0%, rgba(37, 16, 8, 0.08) 45%, transparent 75%)",
        }}
      />

      {/* Centered overlay text */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center">
        <h1
          className="font-hero text-white"
          style={{
            fontSize: "clamp(56px, 11vw, 132px)",
            fontWeight: "var(--hero-weight, 400)",
            letterSpacing: "0.03em",
            lineHeight: 1,
            textShadow: "0 2px 18px rgba(37, 16, 8, 0.35)",
          }}
        >
          ELLA
        </h1>

        {/* Sparkle dourado divider */}
        <div
          aria-hidden="true"
          className="mt-6 mb-5 flex items-center gap-3"
          style={{ opacity: 0.92 }}
        >
          <span
            className="block"
            style={{
              width: 32,
              height: 1,
              backgroundColor: "rgba(217, 154, 48, 0.55)",
            }}
          />
          <svg width="14" height="14" viewBox="-9 -9 18 18" fill="#D99A30">
            <path d="M0,-8 L1.6,-1.6 L8,0 L1.6,1.6 L0,8 L-1.6,1.6 L-8,0 L-1.6,-1.6 Z" />
          </svg>
          <span
            className="block"
            style={{
              width: 32,
              height: 1,
              backgroundColor: "rgba(217, 154, 48, 0.55)",
            }}
          />
        </div>

        <p
          className="text-white/95"
          style={{
            fontFamily: "var(--font-secondary, Inter, system-ui, sans-serif)",
            fontSize: "clamp(13px, 2.4vw, 16px)",
            letterSpacing: "0.22em",
            textTransform: "uppercase",
            fontWeight: 400,
            textShadow: "0 1px 6px rgba(37, 16, 8, 0.35)",
          }}
        >
          warm editorial soft glam · outono 2026
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ opacity: 0.7 }}
      >
        <span
          className="text-white"
          style={{
            fontFamily: "var(--font-secondary, Inter, system-ui, sans-serif)",
            fontSize: "10px",
            letterSpacing: "0.4em",
            textTransform: "uppercase",
            fontWeight: 300,
          }}
        >
          role
        </span>
        <svg
          width="14"
          height="22"
          viewBox="0 0 14 22"
          fill="none"
          stroke="white"
          strokeWidth="1.2"
          aria-hidden="true"
        >
          <path d="M7 1 L7 16 M2 11 L7 17 L12 11" strokeLinecap="round" />
        </svg>
      </div>
    </section>
  );
}
