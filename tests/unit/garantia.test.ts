// @vitest-environment node
import { describe, expect, it } from "vitest";
import { pecaTemGarantia } from "../../lib/garantia";

/**
 * "Garantia das semijoias" era texto fixo na página de TODA peça. Só que nem
 * toda peça tem: bijuteria não tem garantia (está escrito no próprio FAQ da
 * loja). A Ellen passa a decidir peça a peça no /admin.
 */
describe("pecaTemGarantia", () => {
  it("respeita a escolha da Ellen quando ela marcou", () => {
    expect(pecaTemGarantia({ temGarantia: true, tipo: "bijuteria" })).toBe(true);
    expect(pecaTemGarantia({ temGarantia: false, tipo: "semijoia" })).toBe(false);
  });

  it("sem escolha, segue a regra da loja: semijoia tem, bijuteria não", () => {
    expect(pecaTemGarantia({ tipo: "semijoia" })).toBe(true);
    expect(pecaTemGarantia({ tipo: "bijuteria" })).toBe(false);
  });

  it("trata null como 'não escolhido' (é o que vem do banco)", () => {
    expect(pecaTemGarantia({ temGarantia: null, tipo: "semijoia" })).toBe(true);
    expect(pecaTemGarantia({ temGarantia: null, tipo: "bijuteria" })).toBe(false);
  });

  it("não quebra com peça sem tipo definido", () => {
    expect(pecaTemGarantia({})).toBe(false);
    expect(pecaTemGarantia({ temGarantia: true })).toBe(true);
  });
});
