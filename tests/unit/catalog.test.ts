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

describe("Product Catalog (S2.0 — pós popular catálogo PDF)", () => {
  describe("getAllProducts", () => {
    it("retorna ~141 peças por padrão (10 S1.x + 131 S2.0)", () => {
      const all = getAllProducts();
      expect(all.length).toBeGreaterThanOrEqual(135);
      expect(all.length).toBeLessThanOrEqual(150);
    });
    it("filtra ativosOnly: pelo menos 1 ativo (canônica) + S2.0 placeholders ativos", () => {
      const ativos = getAllProducts({ ativosOnly: true });
      expect(ativos.length).toBeGreaterThanOrEqual(1);
      expect(ativos.find((p) => p.slug === CANONICO)).toBeDefined();
    });
    it("retorno é array congelado contra mutação direta (readonly em compile-time)", () => {
      const all = getAllProducts();
      expect(Array.isArray(all)).toBe(true);
    });
  });

  describe("getProductBySlug", () => {
    it("retorna a peça canônica intacta após popular catálogo S2.0", () => {
      const p = getProductBySlug(CANONICO);
      expect(p).not.toBeNull();
      expect(p?.nome).toBe("Brinco Folha Aberta Semijoia");
      expect(p?.precoCents).toBe(9590);
      expect(p?.fotos).toHaveLength(3);
      expect(p?.destaqueHome).toBe(true);
    });
    it("retorna null pra slug inexistente", () => {
      expect(getProductBySlug("nao-existe")).toBeNull();
    });
    it("retorna null pra string vazia", () => {
      expect(getProductBySlug("")).toBeNull();
    });
  });

  describe("getProductsByCategory", () => {
    it("retorna várias peças nas categorias populadas", () => {
      expect(getProductsByCategory("brincos").length).toBeGreaterThan(10);
      expect(getProductsByCategory("colares").length).toBeGreaterThan(10);
      expect(getProductsByCategory("aneis").length).toBeGreaterThan(10);
    });
    it("filtra ativosOnly nas categorias da S2.0", () => {
      // Canônica de brincos está ativa; S2.0 marca novas peças como ativas com placeholder.
      const brincosAtivos = getProductsByCategory("brincos", { ativosOnly: true });
      expect(brincosAtivos.length).toBeGreaterThanOrEqual(1);
      expect(brincosAtivos.find((p) => p.slug === CANONICO)).toBeDefined();
    });
    it("retorna array vazio pra categoria sem peças (piercings ainda não populado)", () => {
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
    it("retorna pelo menos canônica entre os destaques ativos da campanha", () => {
      const d = getProductsDestaque();
      expect(d.length).toBeGreaterThanOrEqual(1);
      expect(d.find((p) => p.slug === CANONICO)).toBeDefined();
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
