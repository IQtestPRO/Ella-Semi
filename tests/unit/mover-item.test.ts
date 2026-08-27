// @vitest-environment node
import { describe, it, expect } from "vitest";
import { moverItem } from "../../lib/mover-item";

describe("moverItem — reordenar arrastando (ADR-0031)", () => {
  const base = ["a", "b", "c", "d"];

  it("leva o primeiro para o fim empurrando o resto", () => {
    expect(moverItem(base, 0, 3)).toEqual(["b", "c", "d", "a"]);
  });

  it("leva o último para o começo", () => {
    expect(moverItem(base, 3, 0)).toEqual(["d", "a", "b", "c"]);
  });

  it("troca vizinhos", () => {
    expect(moverItem(base, 1, 2)).toEqual(["a", "c", "b", "d"]);
  });

  it("soltar no mesmo lugar não muda nada", () => {
    expect(moverItem(base, 2, 2)).toEqual(base);
  });

  it("índice fora da lista devolve a ordem original — arrastar para fora não bagunça", () => {
    expect(moverItem(base, 0, 9)).toEqual(base);
    expect(moverItem(base, -1, 2)).toEqual(base);
    expect(moverItem(base, 9, 0)).toEqual(base);
  });

  it("nunca mexe na lista recebida (o React precisa de array novo)", () => {
    const original = [...base];
    const saida = moverItem(base, 0, 3);
    expect(base).toEqual(original);
    expect(saida).not.toBe(base);
  });

  it("lista de 1 item aguenta o arraste", () => {
    expect(moverItem(["a"], 0, 0)).toEqual(["a"]);
  });
});
