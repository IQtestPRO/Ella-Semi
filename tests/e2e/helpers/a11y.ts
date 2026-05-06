import AxeBuilder from "@axe-core/playwright";
import { expect, type Page } from "@playwright/test";

export async function expectNoWcagAaViolations(page: Page): Promise<void> {
  const results = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa"])
    .analyze();
  if (results.violations.length > 0) {
    console.error(
      "WCAG violations:",
      JSON.stringify(
        results.violations.map((v) => ({
          id: v.id,
          impact: v.impact,
          description: v.description,
          nodes: v.nodes.map((n) => ({ html: n.html, target: n.target })),
        })),
        null,
        2,
      ),
    );
  }
  expect(results.violations).toEqual([]);
}
