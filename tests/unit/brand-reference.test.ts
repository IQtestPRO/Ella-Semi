import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const PATH = "assets/prompts/brand-reference.md";

describe("Brand Reference Pack v1.0", () => {
  it("file exists", () => {
    expect(existsSync(PATH)).toBe(true);
  });

  const content = existsSync(PATH) ? readFileSync(PATH, "utf-8") : "";

  it("has YAML frontmatter with version 1.0", () => {
    expect(content).toMatch(/^---[\s\S]*?version:\s*['"]?1\.0['"]?[\s\S]*?---/m);
  });

  it("contains all 9 mandatory sections", () => {
    const sections = [
      "## 1. Identidade",
      "## 2. Paleta amostrada",
      "## 3. Tipografia",
      "## 4. Motifs",
      "## 5. Mood",
      "## 6. Anti-prompts",
      "## 7. Templates de prompt",
      "## 8. Manifest crosslink",
      "## 9. Versão",
    ];
    for (const s of sections) {
      expect(content).toContain(s);
    }
  });

  it("declares Bodoni Moda as hero font (TB1 decision)", () => {
    expect(content).toMatch(/Bodoni Moda/);
  });

  it("declares Inter as secondary font (TB3 decision)", () => {
    expect(content).toMatch(/Inter/);
  });

  it("declares all 4 secondary palette colors (TB4 decision)", () => {
    expect(content).toContain("#FFF1ED");
    expect(content).toContain("#F0DCC4");
    expect(content).toContain("#8A6E5C");
    expect(content).toContain("#EFC78B");
  });

  it("declares all 3 primary palette colors (S1.1 sampling)", () => {
    expect(content).toContain("#FFD9CC");
    expect(content).toContain("#D99A30");
    expect(content).toContain("#251008");
  });

  it("includes anti-prompts section with prohibited terms", () => {
    expect(content).toMatch(/futuristic/i);
    expect(content).toMatch(/cyberpunk/i);
    expect(content).toMatch(/Y2K/i);
  });
});
