import { chromium } from "@playwright/test";
import { mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const htmlPath = resolve(__dirname, "font-comparison.html");
const outPath = resolve(__dirname, "..", "assets", "brand", "font-comparison.png");

await mkdir(dirname(outPath), { recursive: true });

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 1920, height: 1400 },
  deviceScaleFactor: 2,
});
const page = await ctx.newPage();
await page.goto(`file://${htmlPath.replace(/\\/g, "/")}`);
await page.evaluate(() => document.fonts.ready);
await page.waitForTimeout(500);
await page.screenshot({ path: outPath, fullPage: true });
await browser.close();

console.log(`Font comparison written to: ${outPath}`);
