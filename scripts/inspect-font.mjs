import { chromium } from "@playwright/test";

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 375, height: 667 } });
const page = await ctx.newPage();
await page.goto("http://127.0.0.1:3000/");
await page.evaluate(() => document.fonts.ready);
const result = await page.evaluate(() => {
  const h1 = document.querySelector("h1");
  if (!h1) return { error: "no h1" };
  const cs = getComputedStyle(h1);
  const loaded = [];
  for (const f of document.fonts) {
    loaded.push({ family: f.family, weight: f.weight, status: f.status });
  }
  return {
    fontFamily: cs.fontFamily,
    fontWeight: cs.fontWeight,
    fontSize: cs.fontSize,
    htmlClass: document.documentElement.className,
    bodoniMobileLoaded: document.fonts.check('500 48px "Bodoni Moda"'),
    bodoniDesktopLoaded: document.fonts.check('400 48px "Bodoni Moda"'),
    georgiaLoaded: document.fonts.check('400 48px Georgia'),
    fontFaceCount: document.fonts.size,
    fontFacesLoaded: loaded.filter((f) => f.status === "loaded"),
  };
});
console.log(JSON.stringify(result, null, 2));
await browser.close();
