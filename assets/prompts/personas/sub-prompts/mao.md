---
parent: assets/prompts/personas/modelo-ella-persona-tipo.md
sub_prompt: mao
created: 2026-05-05
slice_origem: S1.3
---

# Sub-prompt: Mão — Persona-Tipo Modelo Ella

> Importa por referência o master prompt em `modelo-ella-persona-tipo.md`. Substitui o `{VARIATION_HOOK}` com a especificação abaixo.

## Categorias de peça atendidas
- `aneis` — anel na mão (predominante mão esquerda 4º dedo, mas qualquer dedo aceitável)
- `pulseiras` — pulseira no pulso (mesma mão da peça hero quando combinado com anel; mão isolada quando peça única)

## Composição / crop
- Hand close-up, dedos visíveis, palma levemente voltada pra câmera
- Crop entre meio do antebraço e ponta dos dedos
- Mão em posição natural relaxada (não rígida, não dramática)
- Profundidade rasa — peça hero em foco, contexto blurred

## Variation hook (substitui `{VARIATION_HOOK}` no master prompt string)

```
Hand close-up of woman wearing {JEWELRY}, fingers naturally relaxed,
palm slightly facing viewer to reveal jewelry detail, hand resting on
warm surface (linen sheet OR light wood table OR morning coffee setup),
shallow focus on fingers, golden hour OR indoor window light catching
the jewelry, generous negative space around hand, serene gentle posture.
```

## Aspect ratio sugerido
- `4:5` portrait (default mobile-first, mostra ante-braço + mão completa)
- `1:1` quadrado (alternativa Instagram-friendly, crop mais apertado)

## Anti-prompts específicos do crop
- ❌ Mão em pose "high-fashion" (dedos esticados rígidos, gesto contraposto)
- ❌ Múltiplos anéis competidores na mão da peça hero (aceita 1-2 discretos em outros dedos, NÃO no dedo da peça)
- ❌ Unhas longas decoradas, esmalte vermelho/preto/cromado
- ❌ Surfaces cromadas, vidro espelhado, mármore preto
- ❌ Mão segurando objeto que compete (telefone, bolsa logada)
