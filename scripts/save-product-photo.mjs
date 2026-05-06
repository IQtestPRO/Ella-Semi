import { writeFile, readFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import sharp from "sharp";

const [url, slug, photoNumber, photoKind, aspectRatio, promptRef, personaFlag] =
  process.argv.slice(2);

if (!url || !slug || !photoNumber || !photoKind || !aspectRatio || !promptRef) {
  console.error(
    "Usage: node save-product-photo.mjs <url> <slug> <photoNumber> <photoKind> <ratio> <promptRef> [with-persona]",
  );
  process.exit(1);
}

const outDir = resolve(`assets/generated/products/${slug}`);
const filename = `${photoNumber}-${photoKind}.webp`;
const outPath = resolve(outDir, filename);
const manifestPath = resolve("assets/generated/manifest.json");

await mkdir(outDir, { recursive: true });

const res = await fetch(url);
if (!res.ok) {
  console.error(`Download failed: ${res.status}`);
  process.exit(1);
}
const buf = Buffer.from(await res.arrayBuffer());
const meta = await sharp(buf).metadata();
await sharp(buf).webp({ quality: 90 }).toFile(outPath);

const manifest = JSON.parse(await readFile(manifestPath, "utf-8"));
const entry = {
  id: `${slug}-${photoNumber}-${photoKind}`,
  model: "nano-banana-pro",
  model_id: "nano_banana_2",
  prompt_ref: promptRef,
  resolution: "2k",
  aspect_ratio: aspectRatio,
  dimensions: `${meta.width}x${meta.height}`,
  createdAt: new Date().toISOString(),
  layer: "por-peca",
  category: `produto-${photoKind}`,
  slug,
  path: `assets/generated/products/${slug}/${filename}`,
  source_url: url,
  brandReferenceVersion: "1.1",
};
if (personaFlag === "with-persona") {
  entry.personaVersion = "1.0";
}
manifest.generations.push(entry);
await writeFile(manifestPath, JSON.stringify(manifest, null, 2) + "\n");

console.log(`Saved ${outPath} (${meta.width}x${meta.height})`);
