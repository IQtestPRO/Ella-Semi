import { expect, test } from "@playwright/test";
import { expectNoWcagAaViolations } from "./helpers/a11y";
import { prepareForScreenshot } from "./helpers/visual";

const PRODUCT_URL = "/brincos/brinco-folha-aberta-semijoia";

test("/<categoria>/<slug> da peça canônica renderiza ProductPage completa", async ({
  page,
}) => {
  await page.goto(PRODUCT_URL);
  await expect(
    page.getByRole("heading", { level: 1, name: "Brinco Folha Aberta Semijoia" }),
  ).toBeVisible();
  await expect(page.getByText("R$ 95,90").first()).toBeVisible();
  await expect(page.getByText(/Banho ouro · Semijoia/)).toBeVisible();
  await expect(page.getByText(/Brinco em formato folha aberta/)).toBeVisible();
});

test("ProductPage galeria mostra 3 fotos com alts", async ({ page }) => {
  await page.goto(PRODUCT_URL);
  await expect(
    page.getByAltText(/Brinco folha em ambiente warm-editorial sobre linho cru/),
  ).toBeVisible();
  await expect(
    page.getByAltText(/Detalhe macro do brinco folha/),
  ).toBeVisible();
  await expect(
    page.getByAltText(/Modelo Ella usando brinco folha/),
  ).toBeVisible();
});

test("ProductPage CTA Sticky existe com preço formatado", async ({ page }) => {
  await page.goto(PRODUCT_URL);
  const ctaButton = page.getByRole("button", {
    name: /Adicionar Brinco Folha Aberta Semijoia ao carrinho, R\$ 95,90/,
  });
  await expect(ctaButton.first()).toBeVisible();
});

test("ProductPage CTA click mostra toast (placeholder até S1.6)", async ({ page }) => {
  await page.goto(PRODUCT_URL);
  const ctaButton = page
    .getByRole("button", { name: /Adicionar.*ao carrinho.*R\$ 95,90/ })
    .first();
  await ctaButton.click();
  await expect(page.getByRole("status")).toContainText("Adicionado ao carrinho");
});

test("ProductPage tem JSON-LD schema.org Product + BreadcrumbList", async ({ page }) => {
  await page.goto(PRODUCT_URL);
  const ldScripts = await page
    .locator('script[type="application/ld+json"]')
    .allTextContents();
  expect(ldScripts.length).toBeGreaterThanOrEqual(2);
  const types = ldScripts.map((s) => JSON.parse(s)["@type"]);
  expect(types).toContain("Product");
  expect(types).toContain("BreadcrumbList");
});

test("ProductPage rota inválida (slug inexistente) retorna 404", async ({ page }) => {
  const res = await page.goto("/brincos/slug-inexistente", {
    waitUntil: "load",
  });
  expect(res?.status()).toBe(404);
});

test("ProductPage rota com categoria errada retorna 404", async ({ page }) => {
  const res = await page.goto("/colares/brinco-folha-aberta-semijoia", {
    waitUntil: "load",
  });
  expect(res?.status()).toBe(404);
});

test("ProductPage WCAG 2 AA — zero violations", async ({ page }) => {
  await page.goto(PRODUCT_URL);
  await expectNoWcagAaViolations(page);
});

test("ProductPage visual baseline", async ({ page }) => {
  await page.goto(PRODUCT_URL);
  await prepareForScreenshot(page);
  await expect(page).toHaveScreenshot("product-canonica.png", { fullPage: true });
});
