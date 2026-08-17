import { describe, expect, it } from "vitest";
import { parsePrecoParaCents, centsParaCampo } from "../../lib/format/preco";

/**
 * A Ellen digita o preço no celular. O teclado dela oferece ponto E vírgula, e
 * ela não sabe qual o site espera. Qualquer uma das duas formas precisa dar o
 * mesmo preço — publicar 100x mais caro por causa de um ponto é inaceitável.
 */
describe("parsePrecoParaCents", () => {
  it("aceita vírgula como decimal (jeito brasileiro)", () => {
    expect(parsePrecoParaCents("89,90")).toBe(8990);
    expect(parsePrecoParaCents("0,50")).toBe(50);
    expect(parsePrecoParaCents("1,5")).toBe(150);
  });

  it("aceita PONTO como decimal — o bug dos 100x", () => {
    expect(parsePrecoParaCents("89.90")).toBe(8990);
    expect(parsePrecoParaCents("0.50")).toBe(50);
    expect(parsePrecoParaCents("1.5")).toBe(150);
  });

  it("entende ponto de milhar (3 casas depois)", () => {
    expect(parsePrecoParaCents("1.500")).toBe(150000);
    expect(parsePrecoParaCents("1.500,00")).toBe(150000);
    expect(parsePrecoParaCents("1.500,90")).toBe(150090);
    expect(parsePrecoParaCents("12.000")).toBe(1200000);
  });

  it("aceita número inteiro sem separador", () => {
    expect(parsePrecoParaCents("89")).toBe(8900);
    expect(parsePrecoParaCents("1500")).toBe(150000);
  });

  it("ignora R$, espaços e lixo digitado junto", () => {
    expect(parsePrecoParaCents("R$ 89,90")).toBe(8990);
    expect(parsePrecoParaCents(" 89,90 ")).toBe(8990);
    expect(parsePrecoParaCents("89,90reais")).toBe(8990);
  });

  it("devolve 0 para vazio ou texto sem número", () => {
    expect(parsePrecoParaCents("")).toBe(0);
    expect(parsePrecoParaCents("   ")).toBe(0);
    expect(parsePrecoParaCents("abc")).toBe(0);
    expect(parsePrecoParaCents(",")).toBe(0);
  });

  it("nunca devolve negativo nem quebrado", () => {
    expect(parsePrecoParaCents("-50")).toBe(5000);
    expect(Number.isInteger(parsePrecoParaCents("89,999"))).toBe(true);
  });

  it("arredonda centavos corretamente", () => {
    expect(parsePrecoParaCents("89,999")).toBe(9000);
    expect(parsePrecoParaCents("89,994")).toBe(8999);
  });
});

describe("centsParaCampo", () => {
  it("mostra no formato brasileiro para edição", () => {
    expect(centsParaCampo(8990)).toBe("89,90");
    expect(centsParaCampo(50)).toBe("0,50");
    expect(centsParaCampo(150000)).toBe("1500,00");
  });

  it("ida e volta preserva o valor", () => {
    for (const cents of [50, 8990, 150000, 9990, 1]) {
      expect(parsePrecoParaCents(centsParaCampo(cents))).toBe(cents);
    }
  });
});
