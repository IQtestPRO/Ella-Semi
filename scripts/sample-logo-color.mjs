import sharp from "sharp";

const PATH = "assets/brand/logo.jpg";
const meta = await sharp(PATH).metadata();
console.log(`logo.jpg: ${meta.width}x${meta.height} ${meta.format}\n`);

// Load full raw RGB buffer for region scans
const { data: full, info } = await sharp(PATH)
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });
const W = info.width;
const H = info.height;

const px = (x, y) => {
  const i = (y * W + x) * 3;
  return [full[i], full[i + 1], full[i + 2]];
};
const hex = ([r, g, b]) =>
  "#" + [r, g, b].map((c) => c.toString(16).padStart(2, "0").toUpperCase()).join("");

// === bg-salmao: 5 flat regions far from wordmark/sparkles ===
console.log("— bg-salmao —");
const bgSamples = [
  ["top-left",        Math.floor(W * 0.10), Math.floor(H * 0.10)],
  ["top-center-left", Math.floor(W * 0.30), Math.floor(H * 0.10)],
  ["bottom-left",     Math.floor(W * 0.10), Math.floor(H * 0.85)],
  ["bottom-center",   Math.floor(W * 0.50), Math.floor(H * 0.90)],
  ["mid-far-left",    Math.floor(W * 0.05), Math.floor(H * 0.50)],
];
const bgHexes = new Set();
for (const [name, x, y] of bgSamples) {
  const c = px(x, y);
  bgHexes.add(hex(c));
  console.log(`  ${name.padEnd(18)} (${x},${y}): rgb(${c.join(",")}) = ${hex(c)}`);
}

// === preto-warm: scan center band (where ELLA wordmark sits), find darkest pixels ===
// Wordmark vertical center ~ y 0.45–0.55, horizontal across 0.20–0.80
console.log("\n— preto-warm (scan + top-3 mais escuros) —");
const darks = [];
for (let y = Math.floor(H * 0.40); y <= Math.floor(H * 0.60); y++) {
  for (let x = Math.floor(W * 0.20); x <= Math.floor(W * 0.80); x++) {
    const c = px(x, y);
    const lum = c[0] + c[1] + c[2];
    darks.push({ x, y, c, lum });
  }
}
darks.sort((a, b) => a.lum - b.lum);
const top5dark = darks.slice(0, 5);
for (const d of top5dark) {
  console.log(`  (${d.x},${d.y}): rgb(${d.c.join(",")}) = ${hex(d.c)} (lum=${d.lum})`);
}

// === dourado: scan upper-right region (sparkles area), find most golden pixels ===
// Sparkles ~ y 0.10–0.40, x 0.60–0.95
// Golden = high R, mid G, low B (R>G>B; R>180; G/R 0.5–0.8; B/R 0.2–0.5)
console.log("\n— dourado (scan + top-5 mais dourados) —");
const golds = [];
for (let y = Math.floor(H * 0.10); y <= Math.floor(H * 0.40); y++) {
  for (let x = Math.floor(W * 0.60); x <= Math.floor(W * 0.95); x++) {
    const [r, g, b] = px(x, y);
    if (r < 150 || r > 235) continue;       // exclude bg salmon (R=255) and pure black
    if (b > r * 0.7) continue;              // exclude grayish
    const goldness = r - b + (r - g) * 0.5; // higher = more saturated gold
    golds.push({ x, y, c: [r, g, b], goldness });
  }
}
golds.sort((a, b) => b.goldness - a.goldness);
const top5gold = golds.slice(0, 5);
for (const g of top5gold) {
  console.log(`  (${g.x},${g.y}): rgb(${g.c.join(",")}) = ${hex(g.c)} (gold=${g.goldness.toFixed(1)})`);
}

console.log("\n— Resumo —");
console.log(`  bg-salmao  : ${[...bgHexes].join(" / ")}`);
console.log(`  preto-warm : top-1 = ${hex(top5dark[0].c)}; mediana top-5 lum`);
console.log(`  dourado    : top-1 = ${hex(top5gold[0].c)}; cluster top-5`);
