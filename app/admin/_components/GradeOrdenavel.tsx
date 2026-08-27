"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { moverItem } from "../../../lib/mover-item";

/**
 * Grade de fotos que se reordena arrastando (ADR-0031).
 *
 * NAO usa o `draggable` do HTML: aquele arraste e de mouse e **nao existe no
 * celular** — e e do celular que a Ellen mexe no painel. Aqui e Pointer Event,
 * que e o mesmo evento para dedo, caneta e mouse.
 *
 * Duas gramaticas de gesto, porque dedo e mouse nao tem a mesma:
 * - Mouse: arrasta na hora, passados poucos pixels.
 * - Dedo: precisa SEGURAR um instante antes (padrao do iOS/Android). Sem isso,
 *   qualquer rolagem da pagina com o dedo em cima da foto viraria um arraste.
 *   Se ela mexer antes do tempo, desistimos do arraste e a pagina rola normal.
 */

/** Pixels que separam um clique de um arraste, no mouse. */
const LIMIAR_PX = 6;
/** Tempo segurando com o dedo antes de a foto "descolar". */
const SEGURAR_MS = 220;

type Pressao = {
  id: string;
  pointerId: number;
  /** Onde dentro da foto ela pegou — para a foto nao pular para o dedo. */
  offsetX: number;
  offsetY: number;
  largura: number;
  altura: number;
  inicioX: number;
  inicioY: number;
  dedo: boolean;
  ativo: boolean;
  timer: ReturnType<typeof setTimeout> | null;
};

type Fantasma = { x: number; y: number; w: number; h: number };

export function GradeOrdenavel({
  ids,
  onReordenar,
  renderItem,
  rotuloItem,
  className,
}: {
  ids: string[];
  onReordenar: (novos: string[]) => void;
  /** `arrastando` e true so na copia que segue o dedo. */
  renderItem: (id: string, index: number, arrastando: boolean) => ReactNode;
  /** Nome legivel da peca, para o leitor de tela. */
  rotuloItem?: (id: string) => string;
  className?: string;
}) {
  // Os handlers vivem fora do ciclo de render (listeners globais), entao leem
  // o estado por ref para nunca enxergar uma ordem velha.
  const idsRef = useRef(ids);
  idsRef.current = ids;
  const onReordenarRef = useRef(onReordenar);
  onReordenarRef.current = onReordenar;

  const elementos = useRef(new Map<string, HTMLLIElement>());
  const pressao = useRef<Pressao | null>(null);

  const [arrastando, setArrastando] = useState<string | null>(null);
  const [fantasma, setFantasma] = useState<Fantasma | null>(null);
  const [montado, setMontado] = useState(false);
  useEffect(() => setMontado(true), []);

  /** Solta a foto: some o fantasma, a ordem que estiver na tela e a final. */
  function largar() {
    const p = pressao.current;
    if (p?.timer) clearTimeout(p.timer);
    pressao.current = null;
    setArrastando(null);
    setFantasma(null);
    document.body.style.userSelect = "";
  }

  /** Qual foto esta embaixo do dedo agora. */
  function indiceSob(x: number, y: number): number | null {
    for (const [id, el] of elementos.current) {
      const r = el.getBoundingClientRect();
      if (x >= r.left && x <= r.right && y >= r.top && y <= r.bottom) {
        const i = idsRef.current.indexOf(id);
        return i === -1 ? null : i;
      }
    }
    return null;
  }

  function acompanhar(x: number, y: number) {
    const p = pressao.current;
    if (!p) return;
    setFantasma({
      x: x - p.offsetX,
      y: y - p.offsetY,
      w: p.largura,
      h: p.altura,
    });
    // Reordena JA, enquanto ela arrasta: ela ve o resultado antes de soltar.
    const atual = idsRef.current.indexOf(p.id);
    const alvo = indiceSob(x, y);
    if (atual !== -1 && alvo !== null && alvo !== atual) {
      onReordenarRef.current(moverItem(idsRef.current, atual, alvo));
    }
  }

  function comecar(x: number, y: number) {
    const p = pressao.current;
    if (!p || p.ativo) return;
    p.ativo = true;
    setArrastando(p.id);
    document.body.style.userSelect = "none";
    acompanhar(x, y);
  }

  // Refs para os listeners globais chamarem sempre a versao atual.
  const acoes = useRef({ largar, indiceSob, acompanhar, comecar });
  acoes.current = { largar, indiceSob, acompanhar, comecar };

  useEffect(() => {
    function aoMover(e: PointerEvent) {
      const p = pressao.current;
      if (!p || e.pointerId !== p.pointerId) return;
      if (!p.ativo) {
        const dist = Math.hypot(e.clientX - p.inicioX, e.clientY - p.inicioY);
        if (dist < LIMIAR_PX) return;
        // Dedo que se move antes da hora esta rolando a pagina, nao arrastando.
        if (p.dedo) {
          acoes.current.largar();
          return;
        }
        acoes.current.comecar(e.clientX, e.clientY);
      }
      acoes.current.acompanhar(e.clientX, e.clientY);
    }

    function aoSoltar(e: PointerEvent) {
      const p = pressao.current;
      if (!p || e.pointerId !== p.pointerId) return;
      acoes.current.largar();
    }

    document.addEventListener("pointermove", aoMover);
    document.addEventListener("pointerup", aoSoltar);
    document.addEventListener("pointercancel", aoSoltar);
    return () => {
      document.removeEventListener("pointermove", aoMover);
      document.removeEventListener("pointerup", aoSoltar);
      document.removeEventListener("pointercancel", aoSoltar);
      document.body.style.userSelect = "";
    };
  }, []);

  // Durante o arraste a pagina nao pode rolar junto com o dedo. Precisa de
  // listener nao-passivo — o do React e passivo e o preventDefault nao pega.
  useEffect(() => {
    if (!arrastando) return;
    const segurar = (e: TouchEvent) => e.preventDefault();
    document.addEventListener("touchmove", segurar, { passive: false });
    return () => document.removeEventListener("touchmove", segurar);
  }, [arrastando]);

  function aoPressionar(e: React.PointerEvent<HTMLLIElement>, id: string) {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    const dedo = e.pointerType !== "mouse";
    const p: Pressao = {
      id,
      pointerId: e.pointerId,
      offsetX: e.clientX - r.left,
      offsetY: e.clientY - r.top,
      largura: r.width,
      altura: r.height,
      inicioX: e.clientX,
      inicioY: e.clientY,
      dedo,
      ativo: false,
      timer: null,
    };
    pressao.current = p;
    if (dedo) {
      p.timer = setTimeout(() => {
        if (pressao.current === p) acoes.current.comecar(p.inicioX, p.inicioY);
      }, SEGURAR_MS);
    }
  }

  /** Mesmo resultado sem arrastar: setas do teclado. */
  function aoTeclado(e: React.KeyboardEvent, index: number, id: string) {
    const passo =
      e.key === "ArrowLeft" || e.key === "ArrowUp"
        ? -1
        : e.key === "ArrowRight" || e.key === "ArrowDown"
          ? 1
          : 0;
    if (passo === 0) return;
    const destino = index + passo;
    if (destino < 0 || destino >= ids.length) return;
    e.preventDefault();
    onReordenar(moverItem(ids, index, destino));
    requestAnimationFrame(() => elementos.current.get(id)?.focus());
  }

  return (
    <>
      <ul className={className ?? "flex flex-wrap gap-2"}>
        {ids.map((id, i) => (
          <li
            key={id}
            ref={(el) => {
              if (el) elementos.current.set(id, el);
              else elementos.current.delete(id);
            }}
            tabIndex={0}
            aria-roledescription="Foto que pode ser arrastada para mudar a ordem"
            aria-label={`${rotuloItem?.(id) ?? id} — posicao ${i + 1} de ${ids.length}. Use as setas para mudar a ordem.`}
            data-arrastavel={id}
            onPointerDown={(e) => aoPressionar(e, id)}
            onKeyDown={(e) => aoTeclado(e, i, id)}
            className={`relative touch-manipulation select-none rounded-lg outline-none transition-opacity focus-visible:ring-2 focus-visible:ring-[var(--color-preto-warm)] focus-visible:ring-offset-2 ${
              arrastando === id ? "opacity-25" : ""
            }`}
            style={{ cursor: arrastando === id ? "grabbing" : "grab" }}
          >
            {renderItem(id, i, false)}
          </li>
        ))}
      </ul>

      {montado &&
        arrastando &&
        fantasma &&
        createPortal(
          <div
            aria-hidden="true"
            className="pointer-events-none fixed z-[60] rounded-lg shadow-2xl"
            style={{
              left: fantasma.x,
              top: fantasma.y,
              width: fantasma.w,
              height: fantasma.h,
              transform: "scale(1.08) rotate(-3deg)",
            }}
          >
            {renderItem(arrastando, idsRef.current.indexOf(arrastando), true)}
          </div>,
          document.body,
        )}
    </>
  );
}
