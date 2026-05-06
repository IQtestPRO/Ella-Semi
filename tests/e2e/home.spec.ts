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

test("body uses Inter via next/font", async ({ page }) => {
  await page.goto("/");
  const family = await page.evaluate(() => getComputedStyle(document.body).fontFamily);
  expect(family).toMatch(/Inter|system-ui|sans-serif/i);
});

test("home shows 'Em destaque agora' section with Folhas de Outono campaign", async ({ page }) => {
  await page.goto("/");
  const heading = page.getByText(/Em destaque agora · Folhas de Outono/);
  await expect(heading).toBeVisible();
});

test("home featured ProductCard shows canonical piece (Brinco Folha Aberta) with R$ 95,90", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { level: 2, name: "Brinco Folha Aberta Semijoia" }),
  ).toBeVisible();
  await expect(page.getByText("R$ 95,90")).toBeVisible();
});

test("home featured ProductCard links to /brincos/<slug> (placeholder route até S1.5)", async ({
  page,
}) => {
  await page.goto("/");
  const link = page.getByRole("link", {
    name: /Brinco Folha Aberta Semijoia.*R\$ 95,90.*brincos/,
  });
  await expect(link).toBeVisible();
  await expect(link).toHaveAttribute("href", "/brincos/brinco-folha-aberta-semijoia");
});

test("home featured photo is loaded and visible", async ({ page }) => {
  await page.goto("/");
  const img = page.getByAltText(/Brinco folha em ambiente warm-editorial sobre linho cru/);
  await expect(img).toBeVisible();
});

test("paleta secundária — CSS vars warm derivadas disponíveis", async ({ page }) => {
  await page.goto("/");
  const vars = await page.evaluate(() => {
    const cs = getComputedStyle(document.documentElement);
    return {
      salmaoClaro: cs.getPropertyValue("--color-salmao-claro").trim(),
      areia: cs.getPropertyValue("--color-areia").trim(),
      taupe: cs.getPropertyValue("--color-taupe").trim(),
      douradoClaro: cs.getPropertyValue("--color-dourado-claro").trim(),
    };
  });
  expect(vars.salmaoClaro).toBe("#fff1ed");
  expect(vars.areia).toBe("#f0dcc4");
  expect(vars.taupe).toBe("#8a6e5c");
  expect(vars.douradoClaro).toBe("#efc78b");
});

test("footer links to /privacidade and page renders 'Em breve'", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Privacidade" }).click();
  await expect(page).toHaveURL(/\/privacidade$/);
  await expect(page.getByRole("heading", { level: 1, name: "Em breve" })).toBeVisible();
});
