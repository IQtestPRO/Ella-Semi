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

test("home shows sparkle SVG with brand gold color", async ({ page }) => {
  await page.goto("/");
  const sparkle = page.getByTestId("sparkle").first();
  await expect(sparkle).toBeVisible();
  const color = await sparkle.evaluate((el) => getComputedStyle(el).color);
  expect(color).toBe("rgb(217, 154, 48)");
});

test("h1 ELLA uses DM Serif Display via next/font", async ({ page }) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1, name: "ELLA" });
  const family = await h1.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family).toMatch(/DM_Serif_Display|Georgia|serif/i);
});
