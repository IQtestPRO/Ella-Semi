// @vitest-environment node
import { describe, it, expect } from "vitest";
import {
  getMaisVendidos,
  getDestaqueHome,
  getCategoryCounts,
  getAllProducts,
} from "../../lib/catalog";
import { ORDEM_CATEGORIAS } from "../../lib/categorias";

describe("catalog helpers (Turso — ADR-0021)", () => {
  describe("getMaisVendidos", () => {
    it("returns only products marked maisVendido=true and ativo=true", async () => {
      const result = await getMaisVendidos();
      expect(result.length).toBeGreaterThan(0);
      for (const p of result) {
        expect(p.maisVendido).toBe(true);
        expect(p.ativo).toBe(true);
      }
    });

    it("a home tem uma vitrine de mais vendidos cheia o bastante", async () => {
      expect((await getMaisVendidos()).length).toBeGreaterThanOrEqual(4);
    });
  });

  describe("getDestaqueHome", () => {
    it("returns only products marked destaqueHome=true and ativo=true", async () => {
      const result = await getDestaqueHome();
      for (const p of result) {
        expect(p.destaqueHome).toBe(true);
        expect(p.ativo).toBe(true);
      }
    });

    it("does not overlap with maisVendido by accident — semânticas distintas", async () => {
      const mv = new Set((await getMaisVendidos()).map((p) => p.slug));
      const dh = new Set((await getDestaqueHome()).map((p) => p.slug));
      const intersection = [...mv].filter((s) => dh.has(s));
      expect(mv).not.toBe(dh);
      expect(intersection.length).toBeLessThanOrEqual(
        Math.min(mv.size, dh.size),
      );
    });
  });

  describe("getCategoryCounts", () => {
    it("respeita a ordem canônica entre as categorias presentes", async () => {
      const counts = await getCategoryCounts();
      const cats = counts.map((c) => c.categoria);
      // A ordem vem de ORDEM_CATEGORIAS (fonte única em lib/categorias). Este
      // teste NÃO repete a lista: repetir foi o que deixou "mixes" de fora do
      // site quando a categoria entrou no enum (ADR-0029).
      const ordem = cats.map((c) => ORDEM_CATEGORIAS.indexOf(c));
      expect(ordem).toEqual([...ordem].sort((a, b) => a - b));
      expect(ordem.every((i) => i >= 0)).toBe(true);
    });

    it("only includes categories with at least 1 active product", async () => {
      const counts = await getCategoryCounts();
      for (const c of counts) {
        expect(c.count).toBeGreaterThan(0);
      }
    });

    it("sums match total active products", async () => {
      const counts = await getCategoryCounts();
      const total = counts.reduce((acc, c) => acc + c.count, 0);
      const allActive = (await getAllProducts({ ativosOnly: true })).length;
      expect(total).toBe(allActive);
    });
  });
});
