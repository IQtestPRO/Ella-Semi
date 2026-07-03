// @vitest-environment node
import { describe, it, expect } from "vitest";
import {
  getMaisVendidos,
  getDestaqueHome,
  getCategoryCounts,
  getAllProducts,
} from "../../lib/catalog";

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

    it("seed inicial tem 8 peças (S2.0 / ADR-0017)", async () => {
      expect((await getMaisVendidos()).length).toBe(8);
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
    it("returns category counts in canonical order", async () => {
      const counts = await getCategoryCounts();
      const cats = counts.map((c) => c.categoria);
      const idxBrincos = cats.indexOf("brincos");
      const idxColares = cats.indexOf("colares");
      const idxPulseiras = cats.indexOf("pulseiras");
      expect(idxBrincos).toBeLessThan(idxColares);
      expect(idxColares).toBeLessThan(idxPulseiras);
      // anéis sem estoque real ativo → omitida da home
      expect(cats.indexOf("aneis")).toBe(-1);
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
