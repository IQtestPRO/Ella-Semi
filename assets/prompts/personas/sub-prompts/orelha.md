---
parent: assets/prompts/personas/modelo-ella-persona-tipo.md
sub_prompt: orelha
created: 2026-05-05
slice_origem: S1.3
---

# Sub-prompt: Orelha — Persona-Tipo Modelo Ella

> Importa por referência o master prompt em `modelo-ella-persona-tipo.md`. Substitui o `{VARIATION_HOOK}` com a especificação abaixo.

## Categorias de peça atendidas
- `brincos` — brinco visível na orelha (drop, stud, hoop, cluster)
- `piercings` — piercing em lóbulo, hélix, conch, tragus (depende da peça)

## Composição / crop
- Side profile ou 3/4 face crop mostrando uma orelha com a peça hero
- Cabelo penteado pra revelar a orelha (tucked behind, swept up, half-up bun)
- Soft golden hour side-light atravessando o cabelo e batendo na peça
- Expressão contemplativa olhando off-camera (lateral) OR direta serena
- Profundidade rasa — peça hero em foco, cabelo levemente blurred

## Variation hook (substitui `{VARIATION_HOOK}` no master prompt string)

```
Side profile or 3/4 face crop showing one ear with {JEWELRY}, hair styled
to reveal the ear (tucked behind ear OR swept up softly OR half-up bun),
soft golden hour side-light catching the earring detail, woman's
expression contemplative looking slightly off-camera OR serene direct
gaze, neck and shoulder visible suggesting natural posture, gentle
movement of hair caught in the light.
```

## Aspect ratio sugerido
- `4:5` portrait (default — mostra orelha + parte do rosto + ombro)
- `1:1` quadrado (alternativa pra crop mais apertado em brincos statement)

## Anti-prompts específicos do crop
- ❌ Cabelo cobrindo totalmente a orelha (esconde a peça)
- ❌ Multiple earrings layered de outras orelhas (peça hero é a única que importa)
- ❌ Crop tão apertado que perde contexto humano (vira foto de close-up de orelha desencarnada)
- ❌ Iluminação direta frontal apagando o detalhe da peça
- ❌ Ângulo bird's-eye dramático
- ❌ Hair spray brilhante (cabelo natural, não chrome)
