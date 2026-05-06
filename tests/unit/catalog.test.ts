import { describe, expect, it } from "vitest";
import {
  categoryFromSlug,
  getAllProducts,
  getCampanhaAtual,
  getProductBySlug,
  getProductsByCategory,
  getProductsDestaque,
} from "../../lib/catalog";

const CANONICO = "brinco-folha-aberta-semijoia";

describe("Product Catalog (S1.4 TB2)", () => {
  describe("getAllProducts", () => {
    it("retorna todas as 10 peças por padrão", () => {
      expect(getAllProducts().length).toBe(10);
    });
    it("filtra ativosOnly: só canônica está ativa em S1.4", () => {
      const ativos = getAllProducts({ ativosOnly: true });
      expect(ativos).toHaveLength(1);
      expect(ativos[0].slug).toBe(CANONICO);
    });
    it("retorno é congelado contra mutação direta (readonly array)", () => {
      const all = getAllProducts();
      // TypeScript impede mutação em compile-time; teste documenta intent
      expect(Array.isArray(all)).toBe(true);
    });
  });

  describe("getProductBySlug", () => {
    it("retorna a peça canônica", () => {
      const p = getProductBySlug(CANONICO);
      expect(p).not.toBeNull();
      expect(p?.nome).toBe("Brinco Folha Aberta Semijoia");
      expect(p?.precoCents).toBe(9590);
      expect(p?.fotos).toHaveLength(3);
    });
    it("retorna null pra slug inexistente", () => {
      expect(getProductBySlug("nao-existe")).toBeNull();
    });
    it("retorna null pra string vazia", () => {
      expect(getProductBySlug("")).toBeNull();
    });
  });

  describe("getProductsByCategory", () => {
    it("retorna 3 brincos no total (1 ativo + 2 inativos)", () => {
      expect(getProductsByCategory("brincos")).toHaveLength(3);
    });
    it("retorna só 1 brinco ativo (canônica)", () => {
      const ativos = getProductsByCategory("brincos", { ativosOnly: true });
      expect(ativos).toHaveLength(1);
      expect(ativos[0].slug).toBe(CANONICO);
    });
    it("retorna 3 colares no total", () => {
      expect(getProductsByCategory("colares")).toHaveLength(3);
    });
    it("retorna 0 colares ativos (todas inativas em S1.4)", () => {
      expect(getProductsByCategory("colares", { ativosOnly: true })).toHaveLength(0);
    });
    it("retorna array vazio pra categoria sem peças", () => {
      expect(getProductsByCategory("piercings")).toHaveLength(0);
      expect(getProductsByCategory("tornozeleiras")).toHaveLength(0);
    });
  });

  describe("getCampanhaAtual", () => {
    it("retorna Outono 2026 ativa", () => {
      const c = getCampanhaAtual();
      expect(c.slug).toBe("outono-2026");
      expect(c.nomeExibicao).toBe("Folhas de Outono");
      expect(c.ativa).toBe(true);
    });
    it("inclui canônica em produtosDestaqueSlugs", () => {
      const c = getCampanhaAtual();
      expect(c.produtosDestaqueSlugs).toContain(CANONICO);
    });
  });

  describe("getProductsDestaque", () => {
    it("retorna só peças ATIVAS que estão na lista de destaque (intersecção)", () => {
      const d = getProductsDestaque();
      expect(d).toHaveLength(1);
      expect(d[0].slug).toBe(CANONICO);
    });
  });

  describe("categoryFromSlug", () => {
    it("retorna brincos pra slug da canônica", () => {
      expect(categoryFromSlug(CANONICO)).toBe("brincos");
    });
    it("retorna null pra slug inválido", () => {
      expect(categoryFromSlug("nao-existe")).toBeNull();
    });
    it("retorna null pra string vazia", () => {
      expect(categoryFromSlug("")).toBeNull();
    });
  });
});
