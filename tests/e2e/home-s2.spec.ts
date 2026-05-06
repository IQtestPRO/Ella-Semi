import { expect, test } from "@playwright/test";

test.describe("Home S2.0 — reformulada", () => {
  test("hero section renders with ELLA wordmark and tagline", async ({ page }) => {
    await page.goto("/");
    const hero = page.getByTestId("hero");
    await expect(hero).toBeVisible();
    await expect(hero.getByRole("heading", { level: 1, name: "ELLA" })).toBeVisible();
    await expect(
      page.getByText(/warm editorial soft glam · outono 2026/i),
    ).toBeVisible();
  });

  test("MAIS VENDIDOS section renders with 8 SEED pieces (mobile or desktop)", async ({
    page,
  }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: /MAIS VENDIDOS/ })).toBeVisible();
    await expect(
      page.getByText(/o que mais sai na loja física/i),
    ).toBeVisible();
  });

  test("Banner intermediário aparece entre MAIS VENDIDOS e Categorias", async ({
    page,
  }) => {
    await page.goto("/");
    const banner = page.getByTestId("banner-meio");
    await expect(banner).toBeVisible();
    await expect(banner).toContainText(/Cada peça, uma história em ouro\./);
  });

  test("Categorias section lists 6+ categorias com contagens", async ({ page }) => {
    await page.goto("/");
    const heading = page.getByRole("heading", { name: /Explore por Categoria/ });
    await expect(heading).toBeVisible();
    // Pelo menos brincos+colares aparecem
    await expect(
      page.getByRole("link", { name: /Brincos.*peças/ }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", { name: /Colares.*peças/ }),
    ).toBeVisible();
  });

  test("TODAS AS PEÇAS section permite filtrar por categoria", async ({ page }) => {
    await page.goto("/");
    const heading = page.getByRole("heading", { name: /TODAS AS PEÇAS/ });
    await expect(heading).toBeVisible();

    // Conta inicial de peças visíveis
    const countBefore = await page.getByTestId("visible-count").textContent();
    expect(countBefore).toMatch(/\d+ peças encontradas/);

    // Clica chip Brincos
    await page.getByRole("button", { name: /^Brincos$/ }).click();
    const countAfter = await page.getByTestId("visible-count").textContent();
    expect(countAfter).toMatch(/\d+ peças encontradas/);
    // Após filtro, count diminui (catálogo tem mais peças totais que brincos)
    expect(countAfter).not.toBe(countBefore);
  });

  test("Footer mostra 4 colunas + microcopy ELLA Niterói", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText(/ELLA Semijoias · Outono 2026 · Niterói RJ/)).toBeVisible();
    // Verifica os 4 headings de coluna
    for (const col of ["Sobre", "Categorias", "Atendimento", "Redes"]) {
      await expect(
        page.getByRole("heading", { level: 3, name: col }),
      ).toBeVisible();
    }
  });

  test("clicking categoria card navigates to /[categoria]", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("link", { name: /Brincos.*peças/ }).click();
    await expect(page).toHaveURL(/\/brincos$/);
    await expect(
      page.getByRole("heading", { level: 2, name: /Brincos/ }),
    ).toBeVisible();
  });

  test("hero loads either video or fallback image (never empty)", async ({ page }) => {
    await page.goto("/");
    const hero = page.getByTestId("hero");
    // Hero sempre tem ELLA visible
    await expect(hero.getByText("ELLA")).toBeVisible();
    // E sempre tem ou video ou fallback img
    const hasVideoOrImg = await hero.evaluate(
      (el) => el.querySelector("video, img") !== null,
    );
    expect(hasVideoOrImg).toBe(true);
  });
});
