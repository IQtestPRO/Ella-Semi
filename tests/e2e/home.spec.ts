import { expect, test } from "@playwright/test";

test("home renders ELLA wordmark", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "ELLA" })).toBeVisible();
});
