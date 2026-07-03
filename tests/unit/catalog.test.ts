// @vitest-environment node
import { describe, expect, it } from "vitest";
import {
  categoryFromSlug,
  getAllProducts,
  getCampanhaAtual,
  getProductBySlug,
  getProductsByCategory,
  getProductsDestaque,
} from "../../lib/catalog";

// Integração contra o Turso semeado (ADR-0021). O catálogo é async/DB-backed.
const CANONICO = "colar-coracao-madreperola-semijoia-763"; // CO763, produto real

describe("Product Catalog (Turso — ADR-0021)", () => {
  describe("getAllProducts", () => {
    it("retorna o catálogo completo (141 seed Outono + 52 produtos reais)", async () => {
      const all = await getAllProducts();
      expect(all.length).toBeGreaterThanOrEqual(190);
      expect(all.length).toBeLessThanOrEqual(260);
    });
    it("filtra ativosOnly: pelo menos 1 ativo (canônica)", async () => {
      const ativos = await getAllProducts({ ativosOnly: true });
      expect(ativos.length).toBeGreaterThanOrEqual(1);
      expect(ativos.find((p) => p.slug === CANONICO)).toBeDefined();
    });
    it("retorno é array", async () => {
      const all = await getAllProducts();
      expect(Array.isArray(all)).toBe(true);
    });
  });

  describe("getProductBySlug", () => {
    it("retorna a peça canônica intacta", async () => {
      const p = await getProductBySlug(CANONICO);
      expect(p).not.toBeNull();
      expect(p?.nome).toBe("Colar coração madrepérola semijoia");
      expect(p?.precoCents).toBe(9890);
      expect(p?.codigo).toBe("CO763");
      expect(p?.fotos.length).toBeGreaterThanOrEqual(1);
      expect(p?.maisVendido).toBe(true);
    });
    it("retorna null pra slug inexistente", async () => {
      expect(await getProductBySlug("nao-existe")).toBeNull();
    });
    it("retorna null pra string vazia", async () => {
      expect(await getProductBySlug("")).toBeNull();
    });
  });

  describe("getProductsByCategory", () => {
    it("retorna várias peças nas categorias populadas", async () => {
      expect((await getProductsByCategory("brincos")).length).toBeGreaterThan(10);
      expect((await getProductsByCategory("colares")).length).toBeGreaterThan(10);
      expect((await getProductsByCategory("aneis")).length).toBeGreaterThan(10);
    });
    it("filtra ativosOnly nas categorias", async () => {
      const colaresAtivos = await getProductsByCategory("colares", {
        ativosOnly: true,
      });
      expect(colaresAtivos.length).toBeGreaterThanOrEqual(1);
      expect(colaresAtivos.find((p) => p.slug === CANONICO)).toBeDefined();
    });
    it("retorna array vazio pra categoria sem peças", async () => {
      expect(await getProductsByCategory("piercings")).toHaveLength(0);
      expect(await getProductsByCategory("tornozeleiras")).toHaveLength(0);
    });
  });

  describe("getCampanhaAtual", () => {
    it("retorna Outono 2026 ativa", async () => {
      const c = await getCampanhaAtual();
      expect(c.slug).toBe("outono-2026");
      expect(c.nomeExibicao).toBe("Folhas de Outono");
      expect(c.ativa).toBe(true);
    });
    it("destaca produtos reais em produtosDestaqueSlugs", async () => {
      const c = await getCampanhaAtual();
      expect(c.produtosDestaqueSlugs.length).toBeGreaterThanOrEqual(6);
      expect(c.produtosDestaqueSlugs).toContain(
        "conjunto-semijoia-perolas-cravejadas-10642",
      );
    });
  });

  describe("getProductsDestaque", () => {
    it("retorna destaques reais ativos da campanha", async () => {
      const d = await getProductsDestaque();
      expect(d.length).toBeGreaterThanOrEqual(6);
      expect(
        d.find((p) => p.slug === "conjunto-semijoia-perolas-cravejadas-10642"),
      ).toBeDefined();
    });
  });

  describe("categoryFromSlug", () => {
    it("retorna brincos pra slug da canônica", async () => {
      expect(await categoryFromSlug(CANONICO)).toBe("colares");
    });
    it("retorna null pra slug inválido", async () => {
      expect(await categoryFromSlug("nao-existe")).toBeNull();
    });
    it("retorna null pra string vazia", async () => {
      expect(await categoryFromSlug("")).toBeNull();
    });
  });
});
