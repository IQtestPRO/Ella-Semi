import { expect, test } from "@playwright/test";

test("home renders ELLA wordmark", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1, name: "ELLA" })).toBeVisible();
});

test("home body uses rosa salmão da marca (#FFD9CC)", async ({ page }) => {
  await page.goto("/");
  const bg = await page.evaluate(() => getComputedStyle(document.body).backgroundColor);
  expect(bg).toBe("rgb(255, 217, 204)");
});

test("home header shows logo bitmap", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("img", { name: /ELLA/i })).toBeVisible();
});
