---
title: "S1.3 — Soul Character \"Modelo Ella\" treinada (reference_id)"
labels: [needs-triage, slice-1]
type: HITL
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0001, 0006, 0008, 0012]
user_stories: [33, 41]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

Treinar o **Soul Character "Modelo Ella"** no Higgsfield Soul, persona definitiva conforme **ADR-0012** (mulher ~45–50 anos, brasileira, morena warm tan, cabelo escuro bem-estilizado, elegante warm-editorial, mãos cuidadas com manicure neutra, expressão serena, iluminação warm golden hour ou indoor janela). Iterar **8–12 gerações** via `higgsfield generate create soul --prompt "..."` usando o **prompt master** de `assets/prompts/soul-characters/modelo-ella.md` (já criado), ajustando ângulo/contexto a cada iteração mantendo identidade. Pak revisa convergência visualmente (rosto, etnia, idade, tom de pele consistentes através das gerações). `reference_id` final salvo em `data/higgsfield-references.json`. Imagem-controle baseline (sem peça, pose neutra) salva em `assets/generated/atemporal/modelo-ella-baseline.webp` para anti-drift checks futuros (ADR-0012). Manifest atualizado com 8–12 entries `camada: "atemporal"`. Política Higgsfield ADR-0001 (sem teto, sem aviso de batch) aplicada.

## Acceptance criteria

- [ ] 8–12 gerações Higgsfield Soul executadas (cada uma registrada no manifest com prompt, modelo `soul`, seed, data)
- [ ] **HITL**: Pak revisa convergência da identidade e aprova `reference_id` final no PR (rosto/idade/etnia/tom de pele estáveis através das iterações)
- [ ] `data/higgsfield-references.json` contém entry `modelo_ella` com: `reference_id`, `criado_em`, `versao: 1`, `anti_drift_check_em` inicial
- [ ] `assets/prompts/soul-characters/modelo-ella.md` log de calibração preenchido (tabela com cada geração: prompt, seed, resultado, aprovação)
- [ ] `assets/generated/atemporal/modelo-ella-baseline.webp` (1 imagem-controle pose neutra) committada
- [ ] `assets/generated/manifest.json` atualizado com todas as gerações (camada `atemporal`, modelo `soul`)
- [ ] Anti-drift baseline registrada para uso futuro (ADR-0012)
- [ ] Política Higgsfield ADR-0001 respeitada
- [ ] CONTEXT.md inalterado (Modelo Ella já documentada)
- [ ] Se calibração não convergir após 12 iterações, abrir grilling antes de continuar (não force solução; ADR-0012 protocolo)

## Blocked by

- #0002 (S1.2 Brand Reference Pack — paleta/iluminação entram no prompt master)
