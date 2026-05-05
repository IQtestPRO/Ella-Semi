import type { Page } from "@playwright/test";

export async function prepareForScreenshot(page: Page): Promise<void> {
  await page.waitForLoadState("networkidle");
  await page.evaluate(() => document.fonts.ready);
}
