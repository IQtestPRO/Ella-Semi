"use client";

import { useEffect, useRef, type ReactNode } from "react";

/**
 * Reveal on-scroll das seções da home (lapidação S4).
 *
 * Wrapper client que observa a própria entrada no viewport (IntersectionObserver,
 * one-shot) e aplica `.is-visible` à primitiva `.ella-reveal` de globals.css.
 * `prefers-reduced-motion` é tratado no CSS (a seção nasce visível, sem transição).
 * Children continuam server-rendered — o wrapper não re-renderiza conteúdo.
 */
export function Reveal({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const show = () => el.classList.add("is-visible");

    if (!("IntersectionObserver" in window)) {
      show();
      return;
    }

    // Seção já (parcialmente) em tela no mount → revela direto. Cobre reload
    // no meio da página e qualquer edge case em que o IO não dispare.
    if (el.getBoundingClientRect().top < window.innerHeight) {
      show();
      return;
    }

    // threshold 0 + rootMargin -10%: dispara assim que a seção encosta nos
    // últimos 10% do viewport — em seções mais altas que a tela (mobile),
    // threshold proporcional atrasaria demais e deixaria buraco no scroll.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          show();
          io.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px -10% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="ella-reveal">
      {children}
    </div>
  );
}
