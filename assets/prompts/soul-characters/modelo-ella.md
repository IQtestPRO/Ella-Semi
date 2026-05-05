# Soul Character — Modelo Ella

> Persona definitiva da modelo recorrente do site ELLA Semijoias. Treinada uma vez no Higgsfield Soul, reutilizada via `reference_id` em **toda** Foto 3 do catálogo (ADR-0008 + ADR-0012).

**Status do Soul Character**: ⏳ a treinar na Slice 1, antes do batch de fotos do catálogo.
**`reference_id`**: a definir após calibração; persistido em `data/higgsfield-references.json`.

---

## Prompt master (calibração inicial)

Use este prompt em **8–12 gerações iterativas** via `higgsfield generate create soul --prompt "..."` até convergir em identidade consistente. Em cada iteração, ajuste apenas o ângulo/contexto, mantendo a descrição da persona estável.

```
A Brazilian woman, around 45 to 50 years old, with warm tan skin and natural Brazilian features. She has dark hair, well-cared, naturally styled in a clean elegant updo or soft waves — never messy. Her expression is serene and amable, calm confident smile (never sensual, never corporate-cold). She is dressed in elegant warm-toned attire: a beige or soft camel blazer, a cream silk blouse, or a classic midi dress in earth tones. She projects discreet luxury — not ostentation, not youth-trendy. Soft natural makeup in warm tones, no heavy editorial makeup. Posture is relaxed but confident. Hands are well-cared with neutral nude manicure (essential — never colored polish). Lighting is natural warm: golden hour or indoor window light, soft diffused, with warm tonal quality. Background is warm-editorial: marble, raw linen, light wood, or simple warm neutral surface. The overall mood is "a mature woman who chooses to take care of herself and value herself — jewelry is part of her ritual".

Style: warm-editorial soft glam, premium, calm, intentional, not staged-stiff. Aspect ratio: 4:5.
```

---

## Anti-prompt (stop-words / negative concepts)

Inclua em **todas** as gerações:

```
Avoid: young woman 20-30 years old, bleach blonde hair, platinum blonde, fantasy hair colors, heavy editorial makeup, dark lipstick, dramatic eyeliner, glamour-evening style, low-cut dresses, sensual pose, model-plastic features, generic international model, corporate cold expression, stiff suit, office background, cold modernist minimalist white clinical environment, harsh studio lighting, cold blue light, fluorescent light, daylight CCT cold, busy props, oversized watch, multiple rings on other fingers, chunky bracelets from other brands, patterned scarves, streetwear, casual t-shirt, hoodie, y2k style, clean-girl-aesthetic, influencer pose, manicure with colored polish, French manicure with colored tip, long acrylic nails, jewelry not from the ELLA brand visible.
```

---

## Lighting spec

Aceitos:
- **Golden hour** (sunset light, ~2700K–3200K, soft diffused).
- **Indoor window light** (large window, soft daylight diffused through linen curtain or sheer).
- Warm interior incandescent (~2700K) com bounce em parede warm.

Rejeitados:
- Direct studio strobe.
- Cold daylight (>4500K).
- Fluorescent.
- Hard shadow / spotlight.
- Overcast cold.

---

## Background palette (sempre warm-editorial)

Aceitos: travertine marble, linho cru, light oak wood, rosa-salmão pastel da BIOS Visual, cream, off-white, warm taupe, warm grey beige.

Rejeitados: pure white clinical, cold grey, black, saturated colors competing with the piece, busy patterns, urban/concrete.

---

## Maquiagem / manicure (sempre)

- Maquiagem: pele uniforme com rubor warm sutil; olhos com nude/marrom suave; cílios naturais; lábios em nude warm fosco/satinado (nunca brilho intenso, nunca batom escuro).
- Manicure: **nude neutro** ou **transparente brilhoso natural** — nunca colorida, nunca French dramático, nunca acrílico longo. Comprimento natural-curto.

---

## Aspect ratios suportados

| Uso | AR | Modelo Higgsfield |
|---|---|---|
| Foto 3 (catálogo, padrão) | 4:5 | Soul + reference_id |
| Hero da Marca / hero geral | 9:16 (mobile) e 16:9 (desktop) | Soul + reference_id |
| Detalhe próximo (rosto/orelha/mão isolada) | 1:1 | Soul + reference_id |
| Lifestyle ambiente livre (quando necessário) | 3:2 ou 16:9 | Soul + reference_id |

---

## Templates de prompt por categoria de peça

> Substitua `<PEÇA>` pela descrição exata da peça (ex: "delicate gold-plated rose gold thin chain necklace with small heart pendant").
> Sempre referenciar o Soul Character via `--reference <reference_id>` na CLI.

### Mão + anel/pulseira/relógio (categorias `aneis`, `pulseiras`, `tornozeleiras` mão)

```
A close-up of the right hand of [Modelo Ella persona via reference_id], wearing <PEÇA>. Hand resting on a warm marble surface or raw linen, soft golden hour light from upper left. Hand pose is natural, relaxed, fingers slightly apart. Manicure is neutral nude. Background warm-editorial, slightly out of focus. Aspect ratio 4:5.
```

### Lateral do rosto + brinco/piercing (categorias `brincos`, `piercings`)

```
A side profile close-up of the face and ear of [Modelo Ella persona via reference_id], wearing <PEÇA> in the ear. Hair is naturally styled and arranged to reveal the earring clearly. Soft window light from the left, warm tones. Expression serene, lips relaxed in soft natural smile. Background warm-editorial, slightly out of focus. Aspect ratio 4:5.
```

### Pescoço + colar/gargantilha (categorias `colares`, `gargantilhas`)

```
A medium close-up of the neck and decollete of [Modelo Ella persona via reference_id], wearing <PEÇA>. She wears a warm-toned silk blouse or cream blazer with neckline that lets the necklace rest naturally. Posture upright confident, head slightly turned. Soft golden hour light. Background warm-editorial, slightly out of focus. Aspect ratio 4:5.
```

### Tornozelo + tornozeleira (categoria `tornozeleiras` quando tornozelo)

```
A close-up of the right ankle of [Modelo Ella persona via reference_id], wearing <PEÇA>, while seated elegantly with legs crossed at the ankle. She wears a classic tonal shoe (warm beige, nude pump, or simple loafer in caramel). Floor is warm wood or warm marble. Soft warm window light. Aspect ratio 4:5.
```

### Conjunto (categoria `conjuntos`)

```
A medium plan focusing on the primary item of the conjunto. For necklace + earring set: medium close-up showing neck/decollete and side of face/ear simultaneously. For bracelet + ring set: hands crossed showing both pieces. [Modelo Ella persona via reference_id], warm-editorial styling consistent with prior prompts. Aspect ratio 4:5.
```

---

## Procedimento de anti-drift check

A cada **20 peças geradas**, gere uma imagem-controle com **prompt master sem peça** (só a Modelo Ella em pose neutra) e compare visualmente com a primeira imagem-controle gerada após calibração inicial.

Critérios de drift:
- Rosto: estrutura óssea, formato dos olhos, formato do nariz, formato da boca, distância entre olhos.
- Etnia/tom de pele: deve permanecer "morena warm tan", nem mais clara, nem mais escura.
- Idade aparente: deve permanecer 45–50.
- Cabelo: tom escuro consistente.

Se houver drift detectado:
1. **Pare o batch.**
2. Abra grilling com Pak.
3. Possível causa: prompt saiu da família, ou Higgsfield atualizou modelo Soul.
4. Re-calibrar Soul Character ou ajustar prompt template antes de continuar.

---

## Gerações de calibração — log

Manter abaixo, conforme cada geração de calibração inicial vai acontecendo:

| # | Data | Prompt usado | Seed | Resultado | Aprovado? |
|---|---|---|---|---|---|
| 1 | TBD | master | TBD | TBD | TBD |
| ... | | | | | |

`reference_id` final, após convergência: **TBD** — preencher em `data/higgsfield-references.json` e nesta tabela.
