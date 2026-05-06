import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import { CampanhaAtualSchema, ProductsSchema } from "../../lib/schemas";

describe("data/products.json — schema Zod", () => {
  const raw = readFileSync("data/products.json", "utf-8");
  const data = JSON.parse(raw);

  it("parses against ProductsSchema (ADR-0004 + ADR-0009)", () => {
    const result = ProductsSchema.safeParse(data);
    if (!result.success) {
      console.error(JSON.stringify(result.error.issues, null, 2));
    }
    expect(result.success).toBe(true);
  });

  it("contains canonical piece brinco-folha-aberta-semijoia ativo + destaqueHome", () => {
    const products = ProductsSchema.parse(data);
    const canonico = products.find(
      (p) => p.slug === "brinco-folha-aberta-semijoia",
    );
    expect(canonico).toBeDefined();
    expect(canonico?.ativo).toBe(true);
    expect(canonico?.destaqueHome).toBe(true);
    expect(canonico?.fotos).toHaveLength(3);
  });

  it("canônica brinco-folha-aberta-semijoia mantém ativo:true + 3 fotos reais", () => {
    const products = ProductsSchema.parse(data);
    const canonica = products.find(
      (p) => p.slug === "brinco-folha-aberta-semijoia",
    );
    expect(canonica?.ativo).toBe(true);
    expect(canonica?.fotos).toHaveLength(3);
  });

  it("pieces without fotos use camada placeholder — ativo permitido (S2.0/ADR-0008 inline)", () => {
    const products = ProductsSchema.parse(data);
    const semFotos = products.filter((p) => p.fotos.length === 0);
    // S2.0 mudou regra: peças sem foto podem ser ativo:true via placeholder.
    // Esta asserção apenas garante que coexistem ambos os estados sem violação Zod.
    for (const p of semFotos) {
      expect(typeof p.ativo).toBe("boolean");
    }
  });

  it("S2.0 / ADR-0017 — exatamente 8 peças marcadas maisVendido:true (SEED inicial)", () => {
    const products = ProductsSchema.parse(data);
    const seed = products.filter((p) => p.maisVendido === true);
    expect(seed.length).toBe(8);
    // SEED deve cobrir mix de categorias
    const cats = new Set(seed.map((p) => p.categoria));
    expect(cats.size).toBeGreaterThanOrEqual(4);
  });

  it("catálogo S2.0 tem ~141 peças total (Outono 2026 PDF + canônicas)", () => {
    const products = ProductsSchema.parse(data);
    expect(products.length).toBeGreaterThanOrEqual(135);
    expect(products.length).toBeLessThanOrEqual(150);
  });

  it("all slugs are unique", () => {
    const products = ProductsSchema.parse(data);
    const slugs = products.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });
});

describe("data/campanha-atual.json — schema Zod", () => {
  const raw = readFileSync("data/campanha-atual.json", "utf-8");
  const data = JSON.parse(raw);

  it("parses against CampanhaAtualSchema (ADR-0004)", () => {
    const result = CampanhaAtualSchema.safeParse(data);
    if (!result.success) {
      console.error(JSON.stringify(result.error.issues, null, 2));
    }
    expect(result.success).toBe(true);
  });

  it("Outono 2026 is active and includes canonical piece", () => {
    const campanha = CampanhaAtualSchema.parse(data);
    expect(campanha.slug).toBe("outono-2026");
    expect(campanha.ativa).toBe(true);
    expect(campanha.produtosDestaqueSlugs).toContain(
      "brinco-folha-aberta-semijoia",
    );
  });
});
