import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const PATH = "assets/prompts/personas/modelo-ella-persona-tipo.md";

describe("Persona-Tipo Modelo Ella v1.0", () => {
  it("file exists", () => {
    expect(existsSync(PATH)).toBe(true);
  });

  const content = existsSync(PATH) ? readFileSync(PATH, "utf-8") : "";

  it("has YAML frontmatter with version 1.0 and prompt-only mecanica", () => {
    expect(content).toMatch(/^---[\s\S]*?version:\s*['"]?1\.0['"]?[\s\S]*?---/m);
    expect(content).toMatch(/mecanica:\s*prompt-only/);
  });

  it("declares Nano Banana Pro as único modelo + 2K resolution obrigatória", () => {
    expect(content).toMatch(/modelo_higgsfield:\s*nano-banana-pro/);
    expect(content).toMatch(/resolucao:\s*2K/);
  });

  it("supersedes ADR-0012 (Soul Character único — descartada)", () => {
    expect(content).toMatch(/ADR-0012/);
    expect(content).toMatch(/superseded by ADR-0015|supersede:\s*ADR-0012/i);
  });

  it("contains all 10 mandatory sections (camadas)", () => {
    const sections = [
      "## 0. Princípio",
      "## 1. Identidade física",
      "## 2. Estética e styling",
      "## 3. Iluminação",
      "## 4. Composição",
      "## 5. Mood",
      "## 6. Anti-prompts",
      "## 7. Modelo Higgsfield",
      "## 8. Master prompt string",
      "## 9. Variation hooks",
      "## 10. Versão",
    ];
    for (const s of sections) {
      expect(content).toContain(s);
    }
  });

  it("declares 4 sub-prompts (mão / pescoço / orelha / tornozelo)", () => {
    expect(content).toMatch(/mao\.md/);
    expect(content).toMatch(/pescoco\.md/);
    expect(content).toMatch(/orelha\.md/);
    expect(content).toMatch(/tornozelo\.md/);
  });

  it("master prompt string includes idade 45-50 + warm tan + serene", () => {
    expect(content).toMatch(/45-50\s+years\s+old/i);
    expect(content).toMatch(/warm\s+tan/i);
    expect(content).toMatch(/serene/i);
  });

  it("anti-prompts include forbidden persona attributes", () => {
    expect(content).toMatch(/20-30\s+years\s+old/i);
    expect(content).toMatch(/platinum\s+blonde/i);
    expect(content).toMatch(/fierce|runway/i);
  });
});
