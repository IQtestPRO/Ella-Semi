/**
 * mobile-screenshots.mjs — QA visual mobile (iPhone 390×844 @2x).
 * Uso: node scripts/mobile-screenshots.mjs <baseURL> <outDir>
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";

const base = process.argv[2] ?? "http://localhost:3000";
const out = resolve(process.argv[3] ?? ".scratch/mobile-shots");
mkdirSync(out, { recursive: true });

const PAGES = [
  { name: "home-top", path: "/", fullPage: false },
  { name: "home-full", path: "/", fullPage: true },
  { name: "produtos", path: "/produtos", fullPage: false },
  { name: "categoria-brincos", path: "/brincos", fullPage: false },
  { name: "produto", path: "/brincos/brinco-folha-aberta-semijoia", fullPage: false },
  { name: "produto-full", path: "/brincos/brinco-folha-aberta-semijoia", fullPage: true },
];

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  deviceScaleFactor: 2,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
});
const page = await ctx.newPage();

for (const p of PAGES) {
  await page.goto(base + p.path, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(1200); // entradas/reveals assentarem
  if (p.fullPage) {
    // Rola como usuário real: dispara os reveals on-scroll antes da captura.
    await page.evaluate(async () => {
      const step = window.innerHeight * 0.7;
      for (let y = 0; y < document.body.scrollHeight; y += step) {
        window.scrollTo(0, y);
        await new Promise((r) => setTimeout(r, 120));
      }
      window.scrollTo(0, 0);
    });
    await page.waitForTimeout(700);
  }
  await page.screenshot({
    path: `${out}/${p.name}.png`,
    fullPage: p.fullPage,
  });
  console.log("✓", p.name);
}

await browser.close();
console.log("→", out);
