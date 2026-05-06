# Hero da Marca — v1.0 (S2.0 / ADR-0018 ponte transitória)

- **Modelo Higgsfield**: `cinematic_studio_3_0`
- **Aspect ratio**: 16:9 (1920x1080)
- **Duration**: 6 segundos (loop seamless)
- **Status**: ponte transitória até Ellen entregar arquivo de foto-real autorizado (ADR-0018)

## Master prompt

```
warm editorial autumn cinematic — Brazilian woman, Fitzpatrick III warm tan,
45-50 years old with subtle visible expression lines, dark chocolate brown
hair with discreet auburn highlights, serene editorial soft glam mood
(Mejuri/Catbird/Sézane reference), gentle contemplative half-smile, softly
touching a delicate gold stylized leaf earring, golden hour soft warm
sidelight from the left, ambient indoor scene with raw linen fabric texture
in defocused background, shallow depth of field, slow zoom-in over 6 seconds
seamless loop, 1920x1080, NO TEXT, NO BRAND VISIBLE, soft glam Brazilian
editorial, warm color grading (cremes, golds, rosés — never blue/cool),
cinematic film grain, premium fashion campaign aesthetic
```

## Anti-prompt (camadas)

- NO young woman 20-30 (must read 45-50)
- NO blonde hair / NO straight long hair
- NO cool tones / NO blue light / NO sterile lighting
- NO corporate fierce fashion mood / NO stiff posing
- NO logo / NO text overlay / NO brand reveal
- NO product close-up dominating frame (jewelry stays subtle, woman is hero)

## Comando

```bash
higgsfield generate create cinematic_studio_3_0 \
  --aspect_ratio 16:9 \
  --duration 6 \
  --prompt "<master prompt acima>"
```

## Output esperado

- `public/hero/hero-loop.mp4` (vídeo principal autoplay muted playsinline)
- `public/hero/hero-fallback.webp` (frame still para `prefers-reduced-motion`)
- Manifest entry: model `cinematic_studio_3_0`, layer `atemporal`, brandReferenceVersion `1.1`, personaVersion `modelo-ella-v1`

## Nota de transição

Quando Ellen entregar arquivo de foto-real autorizado, substituir hero-loop.mp4
e hero-fallback.webp por arquivos novos (mesmas dimensões 1920x1080) e atualizar
manifest entry com `fonte: "foto-real-ellen"`. Componente Hero não muda.
