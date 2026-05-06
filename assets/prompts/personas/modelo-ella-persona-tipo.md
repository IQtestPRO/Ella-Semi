---
version: 1.0
persona_tipo: "Modelo Ella"
mecanica: prompt-only
created: 2026-05-05
modelo_higgsfield: nano-banana-pro
resolucao: 2K
adrs_relacionadas: [0001, 0006, 0008, 0014, 0015]
slice_origem: S1.3
supersede: ADR-0012 (Soul Character único — descartada)
---

# Persona-Tipo "Modelo Ella" v1.0

> **Persona-tipo, não pessoa única.** Cada geração roda independente. Rostos podem variar entre peças do catálogo — variação é desejada e enriquece o site (mulher real ELLA representada em diversidade dentro da mesma estética).
>
> **Mecânica**: prompt-only via Higgsfield Nano Banana Pro 2K. Sem Soul Character treinado. Sem `reference_id` persistido. Sem rotação de modelos.
>
> **Cada geração é independente**. Zero anti-drift técnico — risco de drift entre páginas é zero por design (intencional).

---

## 0. Princípio governante

Toda Foto 3 (lifestyle com modelo usando peça — ADR-0008) carrega a **mesma persona-tipo**: mulher 45–50 anos, brasileira morena warm tan, elegante de luxo discreto, expressão serena, mãos cuidadas, contexto warm-editorial soft glam. **O rosto pode mudar entre peças** — a estética não.

A coerência do site vem da **fidelidade à persona-tipo descrita aqui**, não da identidade fixa de uma pessoa. Auditoria visual em S3.1 (a cada lote do catálogo) verifica aderência à persona-tipo, não consistência de rosto.

---

## 1. Identidade física (camadas obrigatórias)

| Camada | Especificação | Faixa aceitável |
|---|---|---|
| Idade aparente | 45–50 anos | Não 30, não 60. Linhas de expressão sutis OK e desejadas. |
| Etnia | Brasileira morena warm tan | Skin tone Fitzpatrick III–IV, undertone warm. Não pálida-rosada nem muito escura. |
| Cabelo | Escuro (castanho médio a chocolate), médio-longo | Ondas suaves naturais OU liso natural. Comprimento entre ombros e meio das costas. **Não** loiro, **não** ruivo, **não** muito curto, **não** platinum, **não** cores fashion. |
| Tipo corporal | Feminino, esguio-médio, postura elegante | Não muito magra modelística, não plus-size editorial. Corpo "real" elegante. |
| Rosto | Traços suaves harmônicos | Expressão serena (sorriso contido sutil OU olhar contemplativo). **Não** dramático, **não** fierce, **não** "high-fashion runway". |
| Pele | Warm tan saudável | Linhas de expressão sutis dos 45–50 anos visíveis e bem-cuidadas — **não** photoshop liso de 25 anos. |
| Mãos | Bem-cuidadas, dedos finos | Manicure neutra ou nude (rosado natural, bege, transparente). **Não** vermelho cereja, **não** preto, **não** unhas longas decoradas. |

---

## 2. Estética e styling (roupa + maquiagem)

### Roupa
- ✅ Linho cru, seda crua, cashmere, algodão pesado, malha de algodão
- ✅ Cores: cream, off-white, bege areia, taupe warm, dusty rose, dourado claro suave, terracota fosca
- ✅ Camisa de linho branca/off, vestido midi rosé/areia, blazer aberto sobre peça discreta, sweater leve
- ❌ Jeans azul (qualquer azul/denim)
- ❌ Preto puro (vestido preto curto, blazer all-black)
- ❌ Estampas competitivas (animal print, florais grandes, geométricos)
- ❌ Logos visíveis de outras marcas
- ❌ Roupa "fitness" ou "athleisure"

### Maquiagem
- ✅ Base discreta tom da pele
- ✅ Blush warm (pêssego, terracota leve) — **não** rosa-cereja saturado
- ✅ Máscara de cílios sutil, sem cílios postiços dramáticos
- ✅ Batom nude rosado, pêssego claro, ou sheer berry warm
- ❌ Smokey eye dramático, eyeliner gráfico
- ❌ Contour pesado modelo runway
- ❌ Batom escuro vinho/preto/roxo
- ❌ Glitter, glow chrome, makeup futurístico

---

## 3. Iluminação obrigatória

- ✅ **Warm golden hour through window** (luz natural lateral, ~1h antes do pôr do sol, tons âmbar-rosé)
- ✅ **Indoor janela neutra** (luz lateral suave, dia overcast, cortina translúcida)
- ❌ Flash duro frontal, ring light
- ❌ LED frio, fluorescente, lâmpada de teto direta
- ❌ Studio backlit dramatic high-fashion
- ❌ Blue hour, moonlight, dusk frio
- ❌ Mistura de fontes (luz mista cria undertone artificial)

---

## 4. Composição e enquadramento

- ✅ Centralização OR regra dos terços (peça hero ou pessoa no ponto áureo)
- ✅ Profundidade rasa (background levemente blurred, foco na peça)
- ✅ Respiro alto (`VISUAL_DENSITY=3`) — generoso negative space
- ✅ Crop específico por categoria de peça (sub-prompts em TB3 detalham mão/pescoço/orelha/tornozelo)
- ❌ Layout cluttered, props competitivos
- ❌ Composição simétrica rígida tipo institucional
- ❌ Brutalist/maximalist — Y2K, sobreposição
- ❌ Ângulos extremos (worm's eye, bird's eye dramatic)

---

## 5. Mood e atmosfera

- ✅ Serena, atemporal, **"domingo de manhã com café"** energy
- ✅ Aspiracional **convidativo** — universo Mejuri/Catbird/Sézane
- ✅ Lifestyle warm-luxury, discreto e confiante
- ❌ Fortaleza luxury fria (Cartier/Tiffany high-end editorial)
- ❌ Influencer flashy, ostentação visual
- ❌ Y2K nostalgia, futurístico, cyberpunk
- ❌ Editorial high-fashion fierce/edgy
- ❌ Vibe corporativa, profissional, escritório

---

## 6. Anti-prompts (cross-reference brand-reference.md sec 6)

Importa todos os anti-prompts do `assets/prompts/brand-reference.md` seção 6 (estética + pessoa + joia + iluminação) e adiciona:

- ❌ Mulher jovem 20–30 (rosto liso jovem, sem linhas de expressão)
- ❌ Cabelo loiro platinum, ruivo flamboyante, fashion colors (rosa, azul, prateado)
- ❌ Postura "modelo runway" (anguloso, fierce, contraposto extremo)
- ❌ Expressão "edgy", "powerful", "intimidating"
- ❌ Mãos com unhas longas (>5mm) ou unhas decoradas com arte
- ❌ Anéis múltiplos competidores na mesma mão da peça hero
- ❌ Tatuagens visíveis (pode haver, mas se aparecer não pode competir com peça)
- ❌ Acessórios de outras marcas visíveis (relógios de marca, bolsas de logo)

---

## 7. Modelo Higgsfield e resolução obrigatória

- **Modelo único**: Higgsfield Nano Banana Pro (ADR-0015)
  - Pipeline visual unificado: Foto 1 (produto) + Foto 2 (detalhe macro) + Foto 3 (lifestyle modelo) — todas Nano Banana Pro
  - Soul **removido** do projeto (ADR-0012 superseded)
  - Cinema Studio mantido só pra vídeos
- **Resolução obrigatória**: **2K** (2048 px lado maior)
  - Ratios por contexto: 4:5 retrato (mobile-first), 1:1 quadrado (Instagram-friendly), 16:9 paisagem (hero desktop)
  - Sub-2K é anti-padrão registrado em CLAUDE.md (S1.3 / ADR-0015)
- **Manifest**: cada geração registra em `assets/generated/manifest.json`:
  - `model: "nano-banana-pro"`
  - `prompt: <full prompt string>`
  - `seed: <seed value>`
  - `resolution: "2048x2048" | "2048x1638" | "1638x2048"`
  - `personaVersion: "1.0"` (este arquivo)
  - `brandReferenceVersion: "1.0"` (brand-reference.md)
  - `layer: "por-peca"` (Foto 3 é camada por-peça da ADR-0008)

---

## 8. Master prompt string (template canônico)

> Esta é a string base. Sub-prompts (TB3) preenchem `{VARIATION_HOOKS}` e adicionam camada específica de crop/contexto.

```
Brazilian woman, 45-50 years old, warm tan skin (Fitzpatrick III-IV warm undertone),
dark medium-long hair (chocolate to medium brown, soft natural waves OR naturally
straight, between shoulders and mid-back), soft harmonic facial features with subtle
expression lines visible, serene contemplative expression OR contained sutile smile,
well-groomed hands with neutral nude manicure (rosé natural, beige, or transparent),
elegant natural posture.

Wearing warm editorial styling: [linen / silk / cashmere / cotton in cream, off-white,
beige sand, warm taupe, dusty rose, soft gold tones, terracotta]. Discreet natural
makeup with warm peach blush and nude rosé lipstick.

Lighting: [warm golden hour through window with soft side-light OR indoor neutral
window light on overcast day]. Shallow depth of field, generous negative space,
composition centered or rule of thirds.

Mood: serene editorial soft glam, aspirational and inviting, "Sunday morning with
coffee" energy, lifestyle warm-luxury (Mejuri / Catbird / Sézane / Maria Black /
Vrai & Oro universe), photorealistic.

{VARIATION_HOOK}

Resolution: 2K (2048 px longer side), ratio [4:5 portrait | 1:1 square | 16:9 landscape].

ANTI: woman 20-30 years old, platinum blonde or fashion colors hair, fierce/runway
or edgy expression, heavy contour or smokey eye, dark dramatic lipstick, long
decorated nails, flash photography, cold tone lighting (blue/cyan/cool), blue hour,
fluorescent or LED cool, studio backlit dramatic, futuristic, cyberpunk, Y2K
aesthetic, neon, matte black industrial, brutalist, scandinavian minimal cold,
visible tattoos competing with jewelry, multiple competing rings on hero hand,
costume jewelry plastic-looking, visible logos of Cartier / Tiffany / Pandora /
Vivara / Swarovski, men's jewelry style.
```

---

## 9. Variation hooks (onde sub-prompts ancoram)

Os sub-prompts da TB3 vão preencher `{VARIATION_HOOK}` da Master Prompt String com camada específica:

| Sub-prompt | Hook a injetar | Categoria de peça atendida |
|---|---|---|
| `mao.md` | "Hand close-up holding/wearing [JEWELRY], shallow focus on fingers, [SCENE: morning coffee table / linen surface / window-lit hand]" | Anéis, pulseiras |
| `pescoco.md` | "3/4 shoulder-up portrait showing collarbone and neckline, [JEWELRY] resting on collarbone, soft side-light, [SCENE: linen blouse open / silk shirt / off-shoulder sweater]" | Colares, gargantilhas, conjuntos |
| `orelha.md` | "Side profile or 3/4 face showing ear with [JEWELRY], hair styled to reveal earring, soft golden hour side-light, [SCENE: tucking hair behind ear / contemplative profile]" | Brincos, piercings |
| `tornozelo.md` | "Lower leg and ankle close-up wearing [JEWELRY], natural foot positioning on warm surface (terracotta / linen / wood), [SCENE: sitting on linen sheet / barefoot on travertine]" | Tornozeleiras |

> Sub-prompts NÃO duplicam o master — eles importam por referência (`# importa modelo-ella-persona-tipo.md` no topo).

---

## 10. Versão e histórico

- **v1.0** — 2026-05-05 (S1.3)
  - Decisão fechada: persona-tipo prompt-only (substitui Soul Character único da ADR-0012)
  - Modelo: Nano Banana Pro 2K como pipeline visual único
  - Decisor: Pak (HITL no chat)
  - ADRs relacionadas: ADR-0001 (Higgsfield qualidade prevalece), ADR-0006 (Pipeline Higgsfield Único), ADR-0008 (3 fotos por peça — revisada nesta slice), ADR-0014 (Brand Reference Pack v1.0), **ADR-0015** (esta slice — Persona-Tipo + pipeline Nano Banana Pro 2K)
  - Slice de origem: S1.3 — Persona-Tipo Modelo Ella

### Próximas evoluções esperadas

- Auditoria visual periódica em S3.1 (cada lote do catálogo): aderência à persona-tipo, **não** consistência de rosto.
- v2.0 quando padrões de prompt se consolidarem com base em produção real (S3+).
