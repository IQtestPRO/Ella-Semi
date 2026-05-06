import { test } from "@playwright/test";
import { expectNoWcagAaViolations } from "./helpers/a11y";

test("home has zero WCAG 2 AA violations", async ({ page }) => {
  await page.goto("/");
  await expectNoWcagAaViolations(page);
});

test("/privacidade has zero WCAG 2 AA violations", async ({ page }) => {
  await page.goto("/privacidade");
  await expectNoWcagAaViolations(page);
});

test("/brincos categoria index has zero WCAG 2 AA violations", async ({ page }) => {
  await page.goto("/brincos");
  await expectNoWcagAaViolations(page);
});
