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

  it("non-canonical pieces have ativo: false (S1.4 — fotos ausentes até S3.1)", () => {
    const products = ProductsSchema.parse(data);
    const naoCanonicas = products.filter(
      (p) => p.slug !== "brinco-folha-aberta-semijoia",
    );
    for (const p of naoCanonicas) {
      expect(
        p.ativo,
        `${p.slug} deve estar ativo:false até S3.1 gerar fotos`,
      ).toBe(false);
    }
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
