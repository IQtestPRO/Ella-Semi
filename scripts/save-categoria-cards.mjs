/**
 * save-categoria-cards.mjs — baixa as 6 gerações Nano Banana Pro 2K dos cards
 * de categoria (S4-lapidação), converte pra WebP e registra no manifest.
 * Uso: node scripts/save-categoria-cards.mjs
 */
import { mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { resolve } from "node:path";
import sharp from "sharp";

const JOBS = [
  { categoria: "brincos", id: "08b55cc0-1be1-4f4e-8cfe-fbd4b8729243", url: "https://d8j0ntlcm91z4.cloudfront.net/user_39R9UB7DxVV8WGIBrfY3jB2qFSD/hf_20260702_165056_08b55cc0-1be1-4f4e-8cfe-fbd4b8729243.png" },
  { categoria: "colares", id: "bf94b89d-7daf-46b0-a3b5-803448450555", url: "https://d8j0ntlcm91z4.cloudfront.net/user_39R9UB7DxVV8WGIBrfY3jB2qFSD/hf_20260702_165105_bf94b89d-7daf-46b0-a3b5-803448450555.png" },
  { categoria: "pulseiras", id: "27ae356e-2f12-48af-9cf7-5492417d1fbc", url: "https://d8j0ntlcm91z4.cloudfront.net/user_39R9UB7DxVV8WGIBrfY3jB2qFSD/hf_20260702_165111_27ae356e-2f12-48af-9cf7-5492417d1fbc.png" },
  { categoria: "aneis", id: "5d80ed22-07c9-4604-9000-7de8c1a6959a", url: "https://d8j0ntlcm91z4.cloudfront.net/user_39R9UB7DxVV8WGIBrfY3jB2qFSD/hf_20260702_165114_5d80ed22-07c9-4604-9000-7de8c1a6959a.png" },
  { categoria: "conjuntos", id: "d78f931d-40fc-4da7-95ac-21ab30e976dd", url: "https://d8j0ntlcm91z4.cloudfront.net/user_39R9UB7DxVV8WGIBrfY3jB2qFSD/hf_20260702_165119_d78f931d-40fc-4da7-95ac-21ab30e976dd.png" },
  { categoria: "gargantilhas", id: "9f4e6697-3946-4f88-acc8-0246a68d5035", url: "https://d8j0ntlcm91z4.cloudfront.net/user_39R9UB7DxVV8WGIBrfY3jB2qFSD/hf_20260702_165122_9f4e6697-3946-4f88-acc8-0246a68d5035.png" },
];

mkdirSync(resolve("assets/generated/categorias"), { recursive: true });
mkdirSync(resolve("public/assets/generated/categorias"), { recursive: true });

const manifestPath = resolve("assets/generated/manifest.json");
const manifest = JSON.parse(readFileSync(manifestPath, "utf-8"));

for (const job of JOBS) {
  const res = await fetch(job.url);
  if (!res.ok) throw new Error(`download falhou: ${job.categoria} ${res.status}`);
  const png = Buffer.from(await res.arrayBuffer());
  const { data, info } = await sharp(png)
    .webp({ quality: 84 })
    .toBuffer({ resolveWithObject: true });

  const rel = `assets/generated/categorias/${job.categoria}.webp`;
  writeFileSync(resolve(rel), data);
  writeFileSync(resolve(`public/${rel}`), data);
  console.log(`✓ ${job.categoria} — ${info.width}x${info.height}, ${(data.length / 1024).toFixed(0)}KB`);

  // idempotência: remove entrada antiga da mesma categoria antes de inserir
  manifest.generations = manifest.generations.filter(
    (g) => g.id !== `categoria-card-${job.categoria}`,
  );
  manifest.generations.push({
    id: `categoria-card-${job.categoria}`,
    model: "nano-banana-pro",
    model_id: "nano_banana_2",
    prompt_ref: `assets/prompts/categorias/cards-categorias-v1.md (${job.categoria})`,
    resolution: "2k",
    aspect_ratio: "1:1",
    dimensions: `${info.width}x${info.height}`,
    createdAt: new Date().toISOString(),
    layer: "atemporal",
    category: "categoria-card",
    path: rel,
    source_url: job.url,
    job_id: job.id,
  });
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
console.log("✓ manifest.json atualizado");
