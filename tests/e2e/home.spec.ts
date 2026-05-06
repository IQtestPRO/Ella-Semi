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

test("h1 ELLA uses Bodoni Moda via next/font", async ({ page }) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1, name: "ELLA" });
  const family = await h1.evaluate((el) => getComputedStyle(el).fontFamily);
  expect(family).toMatch(/Bodoni|Georgia|serif/i);
});

test("h1 ELLA — weight adaptativo (mobile 500, desktop 400)", async ({ page, viewport }) => {
  await page.goto("/");
  const h1 = page.getByRole("heading", { level: 1, name: "ELLA" });
  const weight = await h1.evaluate((el) => getComputedStyle(el).fontWeight);
  const expected = (viewport?.width ?? 0) <= 640 ? "500" : "400";
  expect(weight).toBe(expected);
});

test("footer links to /privacidade and page renders 'Em breve'", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Privacidade" }).click();
  await expect(page).toHaveURL(/\/privacidade$/);
  await expect(page.getByRole("heading", { level: 1, name: "Em breve" })).toBeVisible();
});
