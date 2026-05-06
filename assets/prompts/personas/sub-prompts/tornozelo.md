---
parent: assets/prompts/personas/modelo-ella-persona-tipo.md
sub_prompt: tornozelo
created: 2026-05-05
slice_origem: S1.3
---

# Sub-prompt: Tornozelo — Persona-Tipo Modelo Ella

> Importa por referência o master prompt em `modelo-ella-persona-tipo.md`. Substitui o `{VARIATION_HOOK}` com a especificação abaixo.
>
> **Nota**: tornozeleiras aparecem em <5% do catálogo. Sub-prompt escrito mas **validação empírica fica pra S3.1** quando peças desta categoria forem produzidas. Pak não roda amostra-piloto agora (TB2 cobre só mão/pescoço/orelha — tornozelo entra direto em produção quando peça aparecer).

## Categorias de peça atendidas
- `tornozeleiras` — tornozeleira de cordão fino, corrente, ou peça com pingente

## Composição / crop
- Lower leg + ankle close-up
- Pé descalço (sem sapato, sem meia) — joia tem que respirar
- Surface warm: terracotta tile, linho sobre piso, madeira clara, travertino
- Postura natural: sentada com perna esticada, perna cruzada, pé descansando em rug
- Profundidade rasa — peça hero em foco

## Variation hook (substitui `{VARIATION_HOOK}` no master prompt string)

```
Lower leg and ankle close-up of woman wearing {JEWELRY}, barefoot in
natural relaxed position (sitting on linen sheet OR resting foot on
travertine tile OR ankle on light wood floor), warm surface texture
visible (terracotta / linen / light wood), soft natural light from
window OR golden hour, shallow focus on the ankle jewelry, gentle
foot posture (toes relaxed, not pointed), light hair on lower leg
softly visible (natural skin, not airbrushed).
```

## Aspect ratio sugerido
- `4:5` portrait (default — mostra perna inferior completa + tornozelo + parte do pé)
- `1:1` quadrado (alternativa pra crop mais apertado mostrando só tornozelo)

## Anti-prompts específicos do crop
- ❌ Sapato visível (qualquer tipo — sandália, scarpin, tênis)
- ❌ Meia, meia-calça (peça tem que ficar contra pele)
- ❌ Pé "pointed" tipo bailarina (postura forçada)
- ❌ Saia/calça muito comprida cobrindo tornozelo
- ❌ Outras tornozeleiras layered competindo com peça hero
- ❌ Pintura nas unhas dos pés saturada (vermelho cereja, preto) — neutra/nude
- ❌ Surface frio (azulejo branco, mármore frio, concreto)
