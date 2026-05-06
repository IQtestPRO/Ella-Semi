---
version: '1.1'
created: 2026-05-05
updated: 2026-05-05
decisores: [Pak]
adrs_relacionadas: [0001, 0002, 0003, 0006, 0008, 0012, 0013, 0014, 0015]
slice_origem: S1.2
slice_atualizacao: S1.3
---

# Brand Reference Pack — ELLA Semijoias v1.1

> **BIOS Visual da Marca.** Pré-requisito de toda produção visual via Higgsfield CLI.
> Mudança neste arquivo cascateia em toda mídia futura — exige ADR superando ADR-0014 (e ADR-0015 quando relevante à persona).
> Versão registrada em `assets/generated/manifest.json` campo `brandReferenceVersion` em cada geração.
>
> **v1.1 (S1.3, aditiva)**: adiciona §10 Persona-Tipo Modelo Ella + atualiza §7 templates pra Nano Banana Pro 2K como modelo único. Conteúdo v1.0 mantido inalterado nas seções 1–9.

---

## 1. Identidade

- **Marca**: ELLA Semijoias (caixa-alta no logo: "ELLA")
- **Fundadora**: Ellen Lopes (pessoa real — distinta da Modelo Ella, que é Soul Character gerada por IA — ADR-0012)
- **Tom editorial canônico**: **warm editorial soft glam** (CONTEXT.md)
  - *warm*: paleta quente (cremes, dourados, rosés, neutros amadeirados; nunca azulado/frio)
  - *editorial*: composição com respiro alto (`VISUAL_DENSITY=3`), tipografia premium, hierarquia clara
  - *soft*: curvas suaves, transições orgânicas, sem aresta dura, sem brutalismo
  - *glam acessível*: aspiracional convidativo — não fortaleza luxury fria
- **Universo de referência**: Mejuri, Catbird, Sézane, Maria Black, Vrai & Oro
- **Persona-arquétipo da cliente** (Modelo Ella, ADR-0012): mulher 45-50, brasileira, morena warm tan, cabelo escuro estilizado, elegante de luxo discreto, expressão serena, manicure neutra. Iluminação warm golden hour ou indoor janela.

---

## 2. Paleta amostrada (hex + RGB + uso)

### Primárias atemporais (ADR-0003 — fechadas em S1.1 via `scripts/sample-logo-color.mjs`, pixel-exact)

| Token (Tailwind v4) | Hex | RGB | Uso |
|---|---|---|---|
| `--color-salmao` | `#FFD9CC` | rgb(255, 217, 204) | Fundo principal, atmosfera warm de marca |
| `--color-dourado` | `#D99A30` | rgb(217, 154, 48) | Sparkles, accents primários, destaques sutis |
| `--color-preto-warm` | `#251008` | rgb(37, 16, 8) | Tipografia hero, texto base. **Não é preto puro nem cinza** — alto R, baixíssimo G/B → undertone marrom-avermelhado quente |

### Secundárias warm derivadas (S1.2 TB4 — coerência cromática hue 15-35)

| Token | Hex | HSL | Uso |
|---|---|---|---|
| `--color-salmao-claro` | `#FFF1ED` | hsl(15°, 100%, 96%) | Superfícies elevadas, cards, modais (rosa salmão diluído) |
| `--color-areia` | `#F0DCC4` | hsl(30°, 60%, 85%) | Sub-superfícies, backgrounds alternativos (warm tan) |
| `--color-taupe` | `#8A6E5C` | hsl(25°, 21%, 45%) | Texto secundário, dividers, borders sutis (preto warm clareado) |
| `--color-dourado-claro` | `#EFC78B` | hsl(35°, 75%, 74%) | Accent secundário, hover states, badges |

### Anti-cores (proibidas em produção visual e prompts Higgsfield)

- ❌ Cinza neutro frio (`#888`, `#999`, `#A0A0A0`)
- ❌ Azul / ciano (qualquer hue 180-260)
- ❌ Verde frio (qualquer hue 90-180 com sat > 30%)
- ❌ Magenta saturado, amarelo limão, salmão néon
- ❌ Branco puro (`#FFF`) — usar `--color-salmao-claro` em vez disso

---

## 3. Tipografia

### Hero (display) — **Bodoni Moda** (S1.2 TB1, decisão Pak)

- **Família**: Bodoni Moda (Google Fonts, variable font, opsz 6-96)
- **Carregamento**: `next/font/google` em `app/layout.tsx`, pesos `["400", "500"]`, subsets latin + latin-ext, display swap
- **Razão da escolha**: das 5 candidatas Didone-ish testadas (DM Serif Display, Bodoni Moda, Italiana, Cormorant Garamond, Playfair Display), Bodoni Moda foi a que melhor replicou o contraste vertical extremo entre traços grossos e hairlines da logo bitmap. Estrutura de serif do "E" e proporção do "L" alinham. Mantém peso harmônico com a logo em escala pequena (header) e grande (hero)
- **Limitação aceita**: o "A" da logo tem perna alongada cursiva (custom lettering). Bodoni Moda tem "A" reto convencional. Não pareiam pixel-perfect. Decisão estética: logo aparece pequena no header como assinatura, "ELLA" tipografado em Bodoni grande no hero — mesma família visual, não cópia exata. Vetorização da logo (perna custom) fica pra Fase 2 (ADR-0003)
- **Weight adaptativo (S1.2 TB2)**:
  - Mobile (≤640px): `font-weight: 500` — engrossa hairlines pra renderizar bem em LCD pequeno
  - Desktop (>640px): `font-weight: 400` — full contraste vertical Didone
- **Fallback CSS**: `Georgia, serif`
- **Aplicação**: `<h1>` em todas as páginas via seletor global em `globals.css`. H2/H3 também herdam a família via cascade (ajustes em weights/sizes virão conforme slices crescem)

### Secundária (sans-serif) — **Inter** (S1.2 TB3, mantida)

- **Família**: Inter (Google Fonts, variable font)
- **Carregamento**: `next/font/google` em `app/layout.tsx`, subset latin, display swap
- **Razão da escolha**: pareamento canônico — serif editorial alto contraste (Bodoni) + sans neutra humanista (Inter). Mejuri, Catbird, Sézane usam variantes desse padrão. Alternativas avaliadas (Outfit, DM Sans, Manrope) descartadas: muita proximidade ou warm geométrico que destoa
- **Pesos disponíveis**: 100-900 (variable), uso típico 400/500/600
- **Fallback CSS**: `system-ui, sans-serif`
- **Aplicação**: corpo, navegação, descrições de peça, badges, CTAs, footer, breadcrumbs

---

## 4. Motifs e elementos

- **Sparkle dourado** — SVG inline em `app/components/Sparkle.tsx`. 4 pontas, perna longa cursiva no eixo vertical. Cor `currentColor` → setada via `style={{ color: "var(--color-dourado)" }}`. Decorativo, `aria-hidden="true"`, `role="presentation"`. Tamanho passável via prop (default 24px)
- **Perna alongada do "A"** — assinatura sutil presente apenas no logo bitmap (custom lettering original). Aparece em escala pequena (header, footer, favicon futuro). Cascade visual: o "A" tipografado em Bodoni Moda no hero **não** replica essa perna — ela vive no logo como marca registrada, não na tipografia corrida
- **Logo bitmap** — `assets/brand/logo.jpg` (raster JPEG ~7.6 KB, ADR-0003). Usar via `next/image` com `priority` quando above-the-fold. Derivados otimizados (`logo@2x.webp`, `logo-og.png`) gerados conforme demanda

---

## 5. Mood / atmosfera (input pra prompts Higgsfield)

### Iluminação
- ✅ **Warm golden hour** (luz natural ~1h antes do pôr do sol, tons âmbar-rosé)
- ✅ **Indoor janela neutra** (luz lateral suave, dia nublado ou janela com cortina translúcida)
- ❌ Flash duro frontal
- ❌ Luz fluorescente fria, LED com tint azulado
- ❌ Studio backlit alto-contraste estilo high-fashion editorial frio

### Texturas (de fundo, superfícies, props)
- ✅ Linho cru, mármore travertino warm, madeira clara (carvalho, freijó), papel artesanal/handmade, terracota fosca, cerâmica off-white texturizada
- ✅ Tecidos naturais com peso (algodão pesado, seda crua)
- ❌ Plástico brilhante, chrome cromado, vidro espelhado high-tech
- ❌ Granito polido frio, mármore preto, metal polido reflexivo

### Composição
- ✅ Respiro alto (`VISUAL_DENSITY=3`), centralização, simetria orgânica
- ✅ Negative space generoso, hierarquia clara
- ✅ Foco único por frame (peça hero centralizada), profundidade rasa
- ❌ Clutter, layout brutalist com elementos sobrepostos
- ❌ Y2K maximalismo, estampas competitivas
- ❌ Grid Bauhaus rígido

### Vibe geral
- ✅ Aspiracional **convidativo**, lifestyle warm-luxury, "domingo de manhã com café"
- ✅ Universo Mejuri/Catbird/Sézane: discreto, atemporal, confiante
- ❌ Fortaleza luxury fria (Cartier, Tiffany high-end editorial)
- ❌ Influencer flashy, ostentação, gold-plated maximalismo
- ❌ Y2K nostalgia, cyberpunk, futuristic minimal scandinavo frio

---

## 6. Anti-prompts (palavras a EVITAR em qualquer prompt Higgsfield)

### Estética
- "futuristic", "neon", "cyberpunk", "Y2K", "scandinavian minimal cold"
- "matte black", "industrial", "brutalist", "concrete", "raw"
- "high-tech", "glass office", "chrome polished"

### Pessoa (Modelo Ella é ADR-0012 — 45-50, morena warm tan, sofisticada serena)
- Modelos jovens (20-30 anos)
- Loiras platinum, cabelo descolorido
- Expressão "fierce", "edgy", "high-fashion runway"
- Maquiagem heavy contour, smokey eye dramático, lábios escuros

### Joia
- "costume jewelry", "bijouterie cheap", "plastic-looking"
- Logos competidores: Cartier, Tiffany, Pandora, Vivara, Swarovski
- Joia masculina: cordões grossos, anéis sello

### Iluminação
- "flash", "bright LED", "fluorescent", "studio backlit dramatic"
- "cold tone", "blue hour", "moonlight"

---

## 7. Templates de prompt por modelo Higgsfield

> Toda prompt importa este Brand Reference Pack como prefixo conceitual. Copiar literal não é necessário — o que importa é que mood, paleta e anti-prompts deste arquivo estejam refletidos.

### 7.1 Foto isolada de produto (Nano Banana Pro)
```
[peça] semijoia [banho], iluminação warm golden hour from window OR
indoor neutral window light, fundo [textura warm: linho cru / travertino /
papel handmade / madeira clara], composição centralizada respirosa,
foco único na peça, profundidade rasa,
mood editorial warm soft glam, paleta rosa salmão + dourado mostarda
ANTI: futuristic, cyberpunk, neon, plástico, matte black, cold tone, flash
```

### 7.2 Lifestyle com Modelo Ella (Soul + Soul Character "Modelo Ella" reference_id ADR-0012)
```
Modelo Ella usando [peça], [contexto: cozinha aconchegante / janela com café /
varanda warm sunset / casa com plantas], iluminação warm golden hour OR
indoor janela neutra, expressão serena, mood warm editorial soft glam,
luxo convidativo, paleta da marca
ANTI: jovem 20-30, loira platinum, fierce expression, smokey eye,
flash duro, runway, Y2K, cyberpunk
```

### 7.3 Hero / vídeo de marca (Cinema Studio)
```
Editorial coeso com Modelo Ella + peça hero, real optical physics,
warm golden hour OR indoor janela, lifestyle aspiracional convidativo,
composição respirosa simétrica, profundidade rasa,
sense of luxury discreto e atemporal,
paleta rosa salmão + dourado mostarda + neutros warm
ANTI: studio backlit cold, flash, futuristic, brutalist, runway high-fashion
```

### 7.4 Background swap de foto real Ellen (Nano Banana Pro)
```
preserve the subject [Ellen Lopes face/body] exactly,
replace background with [textura warm definida do template],
match warm golden hour OR indoor janela lighting to existing subject,
preserve subject color tones and skin warmth,
final mood: warm editorial soft glam
ANTI: cold tone, flash, futuristic, plastic
```

### 7.5 Microvídeo / loop curto / transição (Seedance 2.0 1080p)
```
[loop ~3s], [movimento sutil: hand reaching for jewelry / sparkle catching
light / cup of coffee being placed], warm golden hour, mood warm editorial
soft glam, paleta da marca, optical physics naturais
ANTI: futuristic motion graphics, neon, fast cuts, cyberpunk
```

---

## 8. Manifest crosslink

Toda mídia gerada usando este pack registra em `assets/generated/manifest.json`:

```json
{
  "id": "...",
  "model": "nano-banana-pro" | "soul" | "flux" | "cinema-studio" | "kling-3" | "seedance-2.0",
  "prompt": "...",
  "seed": "...",
  "createdAt": "ISO-8601",
  "layer": "atemporal" | "sazonal" | "por-peca",
  "brandReferenceVersion": "1.0"
}
```

Quando este pack evoluir (v2.0 superseding via ADR), versão sobe e mídia v1 fica marcada como "geração v1" — útil pra auditoria de drift cross-versão.

---

## 9. Versão e histórico

- **v1.0** — 2026-05-05 (S1.2)
  - Decisões fechadas: tipografia hero (Bodoni Moda) + secundária (Inter) + paleta secundária 4 cores
  - Decisor: Pak (HITL no chat — sem PR até S6.1)
  - ADRs relacionadas: 0001 (Higgsfield qualidade prevalece), 0002 (variante minimalist-ui ativa), 0003 (logo PNG-only Fase 1), 0006 (pipeline Higgsfield único), 0012 (Modelo Ella persona), 0013 (estratégia de teste), 0014 (Brand Reference Pack v1.0 — esta slice)
  - Slice de origem: S1.2 — Brand Reference Pack: paleta amostrada + tipografia confirmada

### Próximas evoluções esperadas (NÃO desta versão)

- **Vetorização da logo** → Fase 2 (ADR-0003 reabre). Resolve a perna alongada do "A".
- ~~**Soul Character "Modelo Ella" treinado** → S1.3 (ADR-0012).~~ **Substituído em v1.1 — ver §10.**
- **Pack v2.0** → quando catálogo crescer e padrões de prompt se consolidarem (provável S3+).

---

## 10. Persona-Tipo Modelo Ella + pipeline visual único (v1.1, S1.3)

### 10.1 Persona-Tipo prompt-only (substitui Soul Character — ADR-0015)

A mecânica de **Soul Character treinado** declarada na ADR-0012 foi descartada na S1.3. **Modelo Ella** é agora uma **persona-tipo prompt-only**: cada geração roda independente, rostos podem variar entre peças, a estética da persona-tipo (45–50, brasileira morena warm tan, elegante luxo discreto) é o que amarra coerência.

Especificação completa em `assets/prompts/personas/modelo-ella-persona-tipo.md` (master prompt + 11 seções estruturadas + master prompt string canônica + variation hooks).

Sub-prompts em `assets/prompts/personas/sub-prompts/{mao,pescoco,orelha,tornozelo}.md` — cada um importa por referência o master, substitui só o `{VARIATION_HOOK}` da master prompt string com o ângulo/crop específico da categoria de peça.

### 10.2 Pipeline visual único: Nano Banana Pro 2K (substitui §7 templates)

ADR-0015 declara **Higgsfield Nano Banana Pro (`nano_banana_2`)** como modelo **único** de imagem do projeto. Os templates da §7 que referenciavam Soul / Flux / Soul Cinematic / Kling pra fotos ficam **superseded** pela tabela abaixo.

| Tipo de imagem | Modelo | Resolução |
|---|---|---|
| Foto 1 — produto isolado | Nano Banana Pro (`nano_banana_2`) | 2K |
| Foto 2 — detalhe macro | Nano Banana Pro | 2K |
| Foto 3 — lifestyle com Modelo Ella | Nano Banana Pro | 2K |
| Background swap foto real Ellen | Nano Banana Pro | 2K |
| Vídeo aspiracional / hero / `/campanha` | Cinema Studio (`cinematic_studio_video_v2`) | mantém |

**Removidos do projeto** (não usar mais): Soul (V2 / Cinematic / Location), Flux 2, Flux Kontext, Kling, Seedance, GPT Image 2, Soul Character treinado, `data/higgsfield-references.json`.

### 10.3 Resolução obrigatória: 2K

Toda geração de imagem em **2K** (2048 px lado maior). Ratios por contexto: `4:5` portrait (default mobile-first), `1:1` quadrado (Instagram-friendly), `16:9` paisagem (hero desktop). **Sub-2K é anti-padrão** registrado em CLAUDE.md.

### 10.4 Manifest entry padrão (atualizado em v1.1)

```json
{
  "id": "...",
  "model": "nano-banana-pro",
  "model_id": "nano_banana_2",
  "prompt_ref": "assets/prompts/personas/<sub>.md OR ad-hoc inline",
  "input_image_ref": "assets/brand/catalogo-pecas/<slug>.png (S3.1+) OR ausente em geração from-scratch",
  "resolution": "2k",
  "aspect_ratio": "4:5 | 1:1 | 16:9",
  "dimensions": "WxH",
  "createdAt": "ISO-8601",
  "layer": "atemporal | sazonal | por-peca",
  "category": "...",
  "path": "assets/generated/<sub>/<id>.webp",
  "personaVersion": "1.0",
  "brandReferenceVersion": "1.1"
}
```

> **Nota 2026-05-06 (atualização ADR-0015 inline)**: a partir de S3.1, toda Foto 1/2/3 do catálogo usa `--image assets/brand/catalogo-pecas/<slug>.png` (foto-fonte extraída do PDF) como input pra Nano Banana Pro 2K — fidelidade de design ao catálogo da Ellen. Geração from-scratch é exceção histórica (peça canônica `brinco-folha-aberta-semijoia` da S1.4 TB1) ou caso de geração não-catálogo (camadas atemporal e sazonal). Campo `input_image_ref` no manifest registra a procedência.

### 10.5 Versão e histórico v1.1

- **v1.1** — 2026-05-05 (S1.3, aditiva sobre v1.0)
  - Persona-Tipo Modelo Ella prompt-only substituiu Soul Character único (ADR-0015 supersede ADR-0012)
  - Nano Banana Pro 2K como pipeline visual único pra todas as 3 fotos por peça
  - Resolução 2K obrigatória
  - Decisor: Pak (HITL no chat)
  - ADRs relacionadas: ADR-0015 (esta atualização) + ADR-0008 atualização inline
  - Slice de origem da atualização: S1.3 — Persona-Tipo Modelo Ella

### Próximas evoluções esperadas (NÃO desta versão, post v1.1)

- **Vetorização da logo** → Fase 2 (ADR-0003 reabre).
- **Pack v2.0** → quando catálogo crescer (provável S3+) — possível restruturação completa, não aditiva.
