---
parent: assets/prompts/personas/modelo-ella-persona-tipo.md
sub_prompt: pescoco
created: 2026-05-05
slice_origem: S1.3
---

# Sub-prompt: Pescoço — Persona-Tipo Modelo Ella

> Importa por referência o master prompt em `modelo-ella-persona-tipo.md`. Substitui o `{VARIATION_HOOK}` com a especificação abaixo.

## Categorias de peça atendidas
- `colares` — colar caindo no decote ou na clavícula
- `gargantilhas` — gargantilha justa no pescoço (decote alto OK)
- `conjuntos` — colar + brinco juntos (sub-prompt de pescoço prevalece se ambos visíveis)

## Composição / crop
- 3/4 portrait dos ombros até o peito alto
- Decote visível: blusa de linho aberta, camisa de seda crua aberta no primeiro botão, ou ombro descoberto suave
- Cabelo parcialmente sobre um ombro (não cobrindo o pescoço)
- Postura relaxada e ereta, não pose "studio"
- Profundidade rasa — peça hero (colar/gargantilha) em foco

## Variation hook (substitui `{VARIATION_HOOK}` no master prompt string)

```
3/4 portrait of woman from shoulders to upper chest, {JEWELRY} resting
naturally on collarbone or neckline, wearing open-collar warm editorial
top (linen blouse with open first buttons OR raw silk shirt OR off-shoulder
soft sweater), hair partially over one shoulder revealing the neckline,
soft side-light from window catching the jewelry detail, posture relaxed
upright, expression serene with subtle contained smile or contemplative.
```

## Aspect ratio sugerido
- `4:5` portrait (default — mostra peça completa + parte do rosto pra contextualizar)
- `1:1` quadrado (alternativa pra crop mais apertado em peças mid-length)

## Anti-prompts específicos do crop
- ❌ Decote profundo agressivo (peça hero é joia, não decote)
- ❌ Camisa fechada até o pescoço (esconde a peça)
- ❌ Cabelo cobrindo a clavícula
- ❌ Gola de tartaruga, scarf, qualquer coisa que compete com colar
- ❌ Maquiagem de pescoço/decote (highlight, glow chrome) — pele warm natural
- ❌ Outros colares/correntes layered competindo com peça hero
