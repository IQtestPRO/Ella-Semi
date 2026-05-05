import { expect, test } from "@playwright/test";
import { prepareForScreenshot } from "./helpers/visual";

test("home — visual baseline", async ({ page }) => {
  await page.goto("/");
  await prepareForScreenshot(page);
  await expect(page).toHaveScreenshot("home.png", { fullPage: true });
});

test("/privacidade — visual baseline", async ({ page }) => {
  await page.goto("/privacidade");
  await prepareForScreenshot(page);
  await expect(page).toHaveScreenshot("privacidade.png", { fullPage: true });
});
