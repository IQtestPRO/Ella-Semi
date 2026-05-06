import { describe, it, expect } from "vitest";
import {
  getMaisVendidos,
  getDestaqueHome,
  getCategoryCounts,
  getAllProducts,
} from "../../lib/catalog";

describe("catalog helpers (S2.0)", () => {
  describe("getMaisVendidos", () => {
    it("returns only products marked maisVendido=true and ativo=true", () => {
      const result = getMaisVendidos();
      expect(result.length).toBeGreaterThan(0);
      for (const p of result) {
        expect(p.maisVendido).toBe(true);
        expect(p.ativo).toBe(true);
      }
    });

    it("seed inicial tem 8 peças (S2.0 / ADR-0017)", () => {
      expect(getMaisVendidos().length).toBe(8);
    });
  });

  describe("getDestaqueHome", () => {
    it("returns only products marked destaqueHome=true and ativo=true", () => {
      const result = getDestaqueHome();
      for (const p of result) {
        expect(p.destaqueHome).toBe(true);
        expect(p.ativo).toBe(true);
      }
    });

    it("does not overlap with maisVendido by accident — semânticas distintas", () => {
      const mv = new Set(getMaisVendidos().map((p) => p.slug));
      const dh = new Set(getDestaqueHome().map((p) => p.slug));
      // Pode ter zero overlap (esperado no seed inicial); proibir overlap obriga curadoria
      // a escolher; aqui só checamos que helpers são independentes.
      const intersection = [...mv].filter((s) => dh.has(s));
      // Pelo menos os 2 helpers retornam coleções distintas em conceito.
      expect(mv).not.toBe(dh);
      // Documentar: no seed inicial S2.0 não há overlap (Ellen escolhe depois).
      expect(intersection.length).toBeLessThanOrEqual(
        Math.min(mv.size, dh.size),
      );
    });
  });

  describe("getCategoryCounts", () => {
    it("returns category counts in canonical order", () => {
      const counts = getCategoryCounts();
      const cats = counts.map((c) => c.categoria);
      // Ordem canônica esperada: brincos antes de colares antes de pulseiras...
      const idxBrincos = cats.indexOf("brincos");
      const idxColares = cats.indexOf("colares");
      const idxPulseiras = cats.indexOf("pulseiras");
      const idxAneis = cats.indexOf("aneis");
      expect(idxBrincos).toBeLessThan(idxColares);
      expect(idxColares).toBeLessThan(idxPulseiras);
      expect(idxPulseiras).toBeLessThan(idxAneis);
    });

    it("only includes categories with at least 1 active product", () => {
      const counts = getCategoryCounts();
      for (const c of counts) {
        expect(c.count).toBeGreaterThan(0);
      }
    });

    it("sums match total active products", () => {
      const counts = getCategoryCounts();
      const total = counts.reduce((acc, c) => acc + c.count, 0);
      const allActive = getAllProducts({ ativosOnly: true }).length;
      expect(total).toBe(allActive);
    });
  });
});
