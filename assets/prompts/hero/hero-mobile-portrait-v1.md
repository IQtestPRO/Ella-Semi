# Hero Mobile Portrait 9:16 — v1 (S4-lapidação mobile, 2026-07-02)

- **Camada**: atemporal (marca) · **Uso**: hero da home em celular em pé
  (`app/components/home/Hero.tsx` — art direction via `<picture>` + matchMedia)
- **Imagem**: Nano Banana Pro (`nano_banana_2`) · 2K (1536×2752) · 9:16 →
  `public/hero/hero-fallback-portrait.webp` (job `4dee9131-…`)
- **Vídeo**: Cinema Studio 3.0 (`cinematic_studio_3_0`) · 1080p · 9:16 · 6s ·
  sem áudio · start_image = imagem acima → `public/hero/hero-loop-portrait.mp4`
  (job `890157d3-…`)

## Prompt (imagem)

> Warm editorial cinematic vertical photograph for a premium Brazilian
> demi-fine jewelry brand hero screen (mobile). Golden autumn leaves drifting
> through soft morning light in the top third; below, a fine 18k gold-plated
> necklace with a delicate leaf pendant resting on warm salmon-pink silk fabric
> with gentle folds. Color palette: warm salmon pink #FFD9CC, sand beige
> #F0DCC4, cream, soft golden glints. Dreamy shallow depth of field, luminous
> atmosphere, generous negative space in the center for overlay text, high-end
> fashion editorial. No people, no text, no watermark.

## Prompt (vídeo, image-to-video)

> Slow dreamy cinematic loop: golden autumn leaves drift gently downward
> through soft morning light, the delicate gold necklace glints softly as light
> shimmers across the salmon-pink silk, subtle fabric movement as if touched by
> a breeze. Camera almost still with a very slow, subtle push-in. Warm luminous
> atmosphere, high-end jewelry editorial, seamless gentle motion, no people,
> no text.

Nota: os assets portrait são o par mobile dos assets landscape default. Se a
Ellen trocar o hero no /admin, o override vale pro desktop e o mobile mantém o
par 9:16 da marca (condição `fallbackSrc === default` no componente).
