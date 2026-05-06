import { describe, expect, it } from "vitest";
import { isValidProductSlug, slugify } from "../../lib/routing/slug";

describe("slugify", () => {
  it("converte texto simples", () => {
    expect(slugify("Brinco Folha Aberta")).toBe("brinco-folha-aberta");
  });
  it("remove acentos", () => {
    expect(slugify("Brinco Pavé Zircônia")).toBe("brinco-pave-zirconia");
  });
  it("colapsa múltiplos espaços", () => {
    expect(slugify("Pulseira   Pearls   Douradas")).toBe("pulseira-pearls-douradas");
  });
  it("trima hyphens das pontas", () => {
    expect(slugify("  - test - ")).toBe("test");
  });
  it("remove caracteres especiais", () => {
    expect(slugify("Colar c/ Pendente!")).toBe("colar-c-pendente");
  });
  it("colapsa hyphens duplicados", () => {
    expect(slugify("a -- b -- c")).toBe("a-b-c");
  });
  it("retorna string vazia pra input vazio", () => {
    expect(slugify("")).toBe("");
  });
  it("preserva números", () => {
    expect(slugify("Outono 2026")).toBe("outono-2026");
  });
});

describe("isValidProductSlug", () => {
  it("aceita kebab-case lowercase", () => {
    expect(isValidProductSlug("brinco-folha-aberta-semijoia")).toBe(true);
  });
  it("aceita palavra única", () => {
    expect(isValidProductSlug("brinco")).toBe(true);
  });
  it("aceita números no meio", () => {
    expect(isValidProductSlug("colar-2-pendentes")).toBe(true);
  });
  it("aceita números no início (UUIDs / IDs numéricos)", () => {
    expect(isValidProductSlug("123-pendente")).toBe(true);
  });
  it("rejeita maiúsculas", () => {
    expect(isValidProductSlug("Brinco")).toBe(false);
  });
  it("rejeita underscores", () => {
    expect(isValidProductSlug("brinco_folha")).toBe(false);
  });
  it("rejeita espaços", () => {
    expect(isValidProductSlug("brinco folha")).toBe(false);
  });
  it("rejeita hyphen no início", () => {
    expect(isValidProductSlug("-brinco")).toBe(false);
  });
  it("rejeita hyphen no final", () => {
    expect(isValidProductSlug("brinco-")).toBe(false);
  });
  it("rejeita hyphens duplicados", () => {
    expect(isValidProductSlug("brinco--folha")).toBe(false);
  });
  it("rejeita string vazia", () => {
    expect(isValidProductSlug("")).toBe(false);
  });
  it("rejeita caracteres especiais", () => {
    expect(isValidProductSlug("brinco/folha")).toBe(false);
    expect(isValidProductSlug("brinco.folha")).toBe(false);
    expect(isValidProductSlug("brinco@folha")).toBe(false);
  });
});
