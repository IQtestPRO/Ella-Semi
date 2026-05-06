import { writeFile, readFile } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const url = process.argv[2];
const outId = process.argv[3];
if (!url || !outId) {
  console.error("Usage: node save-piloto.mjs <url> <outputId>");
  process.exit(1);
}

const outDir = resolve("assets/generated/personas");
const outWebp = resolve(outDir, `${outId}.webp`);
const manifestPath = resolve("assets/generated/manifest.json");

const res = await fetch(url);
if (!res.ok) {
  console.error(`Download failed: ${res.status}`);
  process.exit(1);
}
const buf = Buffer.from(await res.arrayBuffer());

const meta = await sharp(buf).metadata();
await sharp(buf).webp({ quality: 90 }).toFile(outWebp);

const manifest = JSON.parse(await readFile(manifestPath, "utf-8"));
const now = new Date().toISOString();
manifest.generations.push({
  id: outId,
  model: "nano-banana-pro",
  model_id: "nano_banana_2",
  prompt_ref: "assets/prompts/personas/modelo-ella-persona-tipo.md (master + variation: 3/4 portrait shoulders-up, no jewelry, pilot)",
  resolution: "2k",
  aspect_ratio: "4:5",
  dimensions: `${meta.width}x${meta.height}`,
  createdAt: now,
  layer: "atemporal",
  category: "persona-tipo-pilot",
  path: `assets/generated/personas/${outId}.webp`,
  source_url: url,
  personaVersion: "1.0",
  brandReferenceVersion: "1.0",
});
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

console.log(`✓ Saved ${outWebp} (${meta.width}x${meta.height})`);
console.log(`✓ Manifest updated`);
