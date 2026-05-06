import { existsSync, readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

const subs = ["mao", "pescoco", "orelha", "tornozelo"] as const;
const masterRef = "assets/prompts/personas/modelo-ella-persona-tipo.md";

describe("Sub-prompts persona-tipo (S1.3 TB3)", () => {
  for (const sub of subs) {
    const path = `assets/prompts/personas/sub-prompts/${sub}.md`;

    describe(sub, () => {
      it("file exists", () => {
        expect(existsSync(path)).toBe(true);
      });

      const content = existsSync(path) ? readFileSync(path, "utf-8") : "";

      it("references parent master in frontmatter", () => {
        expect(content).toMatch(new RegExp(`parent:\\s*${masterRef.replace(/\//g, "\\/")}`));
      });

      it(`declares sub_prompt: ${sub} in frontmatter`, () => {
        expect(content).toMatch(new RegExp(`sub_prompt:\\s*${sub}`));
      });

      it("includes 'Variation hook' section with substitute instruction", () => {
        expect(content).toMatch(/Variation hook/i);
        expect(content).toMatch(/\{VARIATION_HOOK\}/);
      });

      it("declares aspect_ratio recommendation (4:5 or 1:1)", () => {
        expect(content).toMatch(/4:5|1:1/);
      });

      it("includes 'Anti-prompts específicos' section", () => {
        expect(content).toMatch(/Anti-prompts/i);
      });
    });
  }
});
