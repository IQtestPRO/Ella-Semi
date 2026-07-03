# Cards de Categoria — v1 (S4-lapidação, 2026-07-02)

- **Modelo**: Nano Banana Pro (`nano_banana_2`) · **Resolução**: 2K (2048×2048) · **Aspect**: 1:1
- **Camada**: atemporal (marca — "Explore por Categoria" da home). From-scratch permitido (ADR-0015).
- **Uso**: `app/components/home/Categorias.tsx` via `/assets/generated/categorias/<categoria>.webp`
- **Manifest**: `assets/generated/manifest.json` ids `categoria-card-*`

## Template base (linguagem visual única do set)

> Warm editorial still-life macro photograph for a premium Brazilian demi-fine
> jewelry brand. {PEÇA}, arranged on warm cream travertine stone with soft
> crumpled ivory linen fabric, bathed in gentle morning window light. Color
> palette: warm salmon pink #FFD9CC, sand beige #F0DCC4, soft cream. Subtle
> golden light glints sparkling on the polished metal. Shallow depth of field,
> generous clean negative space, minimalist composition, high-end product
> photography. No people, no hands, no text, no watermark.

## {PEÇA} por categoria

| categoria | peça |
|---|---|
| brincos | A pair of delicate 18k gold-plated leaf-shaped drop earrings |
| colares | A fine 18k gold-plated venetian chain necklace with a small delicate pendant, elegantly coiled in a soft S-curve |
| pulseiras | Two stacked 18k gold-plated chain bracelets, one with tiny freshwater pearls, gently overlapping |
| aneis | Three stacked minimalist 18k gold-plated rings, one with delicate pavé zirconia stones, arranged in a small elegant cluster |
| conjuntos | A matching jewelry set: 18k gold-plated pendant necklace and matching pair of earrings, composed together in an elegant arrangement |
| gargantilhas | An 18k gold-plated choker necklace lying flat in a gentle open curve |

Categorias sem imagem (tornozeleiras, piercings, outros) caem no
`PlaceholderProductImage` (assinatura SVG — ADR-0016). Gerar v2 delas quando
essas categorias forem populadas.
