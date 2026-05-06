---
slug: brinco-folha-aberta-semijoia
nome: Brinco Folha Aberta Semijoia
categoria: brincos
modelo_higgsfield: nano-banana-pro
modelo_id: nano_banana_2
resolucao: 2K
slice_origem: S1.4
adrs_relacionadas: [0001, 0006, 0008, 0014, 0015]
brand_reference_version: '1.1'
persona_version: '1.0'
---

# Prompts — Brinco Folha Aberta Semijoia

> 3 prompts canônicos da peça. Conforme ADR-0008 (3 fotos por peça uniforme) + ADR-0015 (Nano Banana Pro 2K como modelo único).
>
> Reproduzíveis via:
> ```bash
> higgsfield generate create nano_banana_2 --aspect_ratio <r> --resolution 2k --wait --prompt "<p>"
> ```

---

## Foto 1 — Peça em ambiente warm-editorial (foco-produto) {#foto-1-bg-swap}

- Aspect ratio: `4:5`
- Output: `assets/generated/products/brinco-folha-aberta-semijoia/01-bg-swap.webp`
- Camada (ADR-0008): produto-bg-swap

```
Single pair of gold-plated leaf-shaped open-leaf earrings, semijoia ouro,
leaf silhouette in warm yellow gold with delicate pavé crystal detail along
the leaf veins. Resting on a piece of raw cream linen sheet over light wood
surface with natural grain visible. Golden hour soft side-light from a window
catching the gold plating warmth and pavé sparkle. Composition centered with
generous negative space, shallow depth of field, photorealistic product
photography, mood serene editorial soft glam (Mejuri/Catbird/Sezane warm-luxury
universe), paleta rosa salmão e dourado mostarda com neutros warm.

ANTI: futuristic, cyberpunk, neon, plastic-looking, matte black industrial,
brutalist, flash photography, cold tone lighting (blue/cyan/cool), blue hour,
fluorescent or LED cool, chrome polished cold, multiple competing earrings or
other jewelry visible, costume jewelry cheap, visible logos of Cartier or
Tiffany or Pandora, men's jewelry, hands or models in frame.
```

---

## Foto 2 — Detalhe macro {#foto-2-detalhe}

- Aspect ratio: `1:1`
- Output: `assets/generated/products/brinco-folha-aberta-semijoia/02-detalhe.webp`
- Camada (ADR-0008): produto-detalhe

```
Extreme macro close-up of a single gold-plated leaf-shaped open-leaf earring,
semijoia ouro. Texture of warm yellow gold plating crisp and natural, delicate
pavé crystal detail along the leaf veins or edges visible catching golden hour
light, single earring isolated in frame. Same warm editorial ambient as wider
product shot — raw cream linen sheet on light wood surface visible blurred in
background, shallow depth of field with subject pin-sharp, photorealistic
jewelry detail photography, mood serene editorial soft glam, paleta dourado
mostarda warm.

ANTI: studio backlit dramatic, flash, futuristic, plastic-looking, matte black,
chrome cold, cyberpunk, neon, blue hour, fluorescent, LED cool, multiple
earrings, costume jewelry.
```

---

## Foto 3 — Modelo Ella usando peça (orelha) {#foto-3-lifestyle}

- Aspect ratio: `4:5`
- Output: `assets/generated/products/brinco-folha-aberta-semijoia/03-lifestyle.webp`
- Camada (ADR-0008): produto-lifestyle
- Persona: importa por referência o master de `assets/prompts/personas/modelo-ella-persona-tipo.md` + sub-prompt de `assets/prompts/personas/sub-prompts/orelha.md`. `{JEWELRY}` substituído por descrição concreta da peça hero. `{VARIATION_HOOK}` do master substituído pelo hook de orelha.

```
Brazilian woman, 45-50 years old, warm tan skin (Fitzpatrick III-IV warm
undertone), dark medium-long hair (chocolate to medium brown, soft natural
waves), soft harmonic facial features with subtle expression lines visible
(45-50 should look 45-50), serene contemplative expression, well-groomed hands
with neutral nude manicure, elegant natural posture.

Wearing warm editorial styling: linen blouse in cream and beige sand undertone.
Discreet natural makeup with warm peach blush and nude rosé lipstick.

Lighting: warm golden hour through window with soft side-light. Shallow depth
of field, generous negative space, composition rule of thirds.

Mood: serene editorial soft glam, aspirational and inviting, Sunday morning
with coffee energy, lifestyle warm-luxury (Mejuri / Catbird / Sezane universe),
photorealistic.

Side profile or 3/4 face crop showing one ear with a single gold-plated
leaf-shaped open-leaf earring with delicate pavé crystal detail (Brinco Folha
Aberta), hair styled to reveal the ear (tucked behind ear softly), soft golden
hour side-light catching the earring detail, expression contemplative looking
slightly off-camera, neck and shoulder visible suggesting natural posture.

ANTI: woman 20-30 years old, platinum blonde or fashion colors hair, fierce
or runway or edgy expression, heavy contour or smokey eye, dark dramatic
lipstick, long decorated nails, flash photography, cold tone lighting, blue
hour, fluorescent or LED cool, studio backlit dramatic, futuristic, cyberpunk,
Y2K aesthetic, neon, matte black industrial, brutalist, scandinavian minimal
cold, multiple earrings on the ear, hair covering the ear, costume jewelry
plastic-looking, visible logos.
```

---

## Notas de produção (S1.4 TB1, 2026-05-05)

- **Drift detectado entre Foto 1 e Foto 2**: forma da peça difere — Foto 1 e Foto 3 mostram leaf outline com vazados visíveis; Foto 2 mostra folha mais sólida com swirl/nervura central enrolada. Pak validou visualmente e decidiu se regenera Foto 2 ou aceita o set como está. Decisão registrada em commit subsequente.
- **Não usa input image** — geração from-scratch a partir de descrição textual da peça (sem foto-fonte do PDF).
- **Fonte do PDF**: `assets/brand/catalogo-outono-2026.pdf` página 6 letra D (referência humana, não consumida pelo modelo).
