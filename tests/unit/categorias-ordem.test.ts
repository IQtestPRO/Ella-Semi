// @vitest-environment node
import { describe, expect, it } from "vitest";
import { ORDEM_CATEGORIAS, PRETTY_LABEL } from "../../lib/categorias";
import { CategoriaSchema } from "../../lib/schemas";

/**
 * A ordem das categorias estava copiada em 4 arquivos. Quando "mixes" entrou no
 * enum, `getCategoryCounts` continuou com a lista antiga — resultado: a
 * categoria nunca apareceria no menu nem nos cards, mesmo com peças cadastradas,
 * e sem nenhum erro. Estes testes travam isso: se alguém acrescentar categoria
 * no enum e esquecer da ordem/label, o teste quebra.
 */
describe("ordem canônica de categorias", () => {
  it("cobre TODAS as categorias do enum, sem faltar nenhuma", () => {
    const doEnum = [...CategoriaSchema.options].sort();
    const daOrdem = [...ORDEM_CATEGORIAS].sort();
    expect(daOrdem).toEqual(doEnum);
  });

  it("não repete categoria", () => {
    expect(new Set(ORDEM_CATEGORIAS).size).toBe(ORDEM_CATEGORIAS.length);
  });

  it("toda categoria tem label em português", () => {
    for (const c of CategoriaSchema.options) {
      expect(PRETTY_LABEL[c], `falta label de "${c}"`).toBeTruthy();
    }
  });

  it("mixes vem logo depois de conjuntos (pedido da Ellen)", () => {
    const i = ORDEM_CATEGORIAS.indexOf("conjuntos");
    expect(ORDEM_CATEGORIAS[i + 1]).toBe("mixes");
  });
});
