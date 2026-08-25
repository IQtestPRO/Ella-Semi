// @vitest-environment node
import { describe, expect, it, beforeEach } from "vitest";
import { useCart } from "../../lib/cart/store";

/**
 * Controle de estoque (ADR-0025).
 *
 * A Ellen informa quantas unidades tem de cada peça. Se a cliente tentar
 * levar mais do que existe, o carrinho segura na quantidade real — o pedido
 * que chega no WhatsApp nunca promete peça que a Ellen não tem.
 *
 * `estoque` ausente ou null = sem controle (vende à vontade).
 */

const PECA = {
  slug: "colar-teste",
  nome: "Colar de teste",
  precoCents: 5990,
  categoria: "colares" as const,
};

beforeEach(() => {
  useCart.getState().clear();
});

describe("carrinho respeita o estoque", () => {
  it("sem estoque definido, vende à vontade", () => {
    useCart.getState().add(PECA, 12);
    expect(useCart.getState().items[0].qty).toBe(12);
  });

  it("estoque null também é sem limite", () => {
    useCart.getState().add({ ...PECA, estoque: null }, 9);
    expect(useCart.getState().items[0].qty).toBe(9);
  });

  it("pedir 5 quando só tem 4 põe 4 no carrinho", () => {
    useCart.getState().add({ ...PECA, estoque: 4 }, 5);
    expect(useCart.getState().items[0].qty).toBe(4);
  });

  it("somar de um em um também para no teto", () => {
    const item = { ...PECA, estoque: 2 };
    useCart.getState().add(item);
    useCart.getState().add(item);
    useCart.getState().add(item); // terceira tentativa não passa de 2
    expect(useCart.getState().items[0].qty).toBe(2);
  });

  it("setQty acima do estoque trava no estoque", () => {
    useCart.getState().add({ ...PECA, estoque: 3 });
    useCart.getState().setQty(PECA.slug, 10);
    expect(useCart.getState().items[0].qty).toBe(3);
  });

  it("peça esgotada (estoque 0) não entra no carrinho", () => {
    useCart.getState().add({ ...PECA, estoque: 0 }, 1);
    expect(useCart.getState().items).toHaveLength(0);
  });

  it("setQty para 0 continua removendo a peça", () => {
    useCart.getState().add({ ...PECA, estoque: 5 }, 2);
    useCart.getState().setQty(PECA.slug, 0);
    expect(useCart.getState().items).toHaveLength(0);
  });

  it("guarda o estoque no item para a tela do carrinho poder avisar", () => {
    useCart.getState().add({ ...PECA, estoque: 4 }, 1);
    expect(useCart.getState().items[0].estoque).toBe(4);
  });

  it("estoque menor que o carrinho (Ellen baixou o estoque depois) é corrigido no setQty", () => {
    useCart.getState().add({ ...PECA, estoque: 8 }, 6);
    // a peça foi reposta para 2 e a cliente mexe na quantidade
    useCart.setState((s) => ({
      items: s.items.map((i) => ({ ...i, estoque: 2 })),
    }));
    useCart.getState().setQty(PECA.slug, 6);
    expect(useCart.getState().items[0].qty).toBe(2);
  });
});
