---
title: "S4.1 — /campanha rota cheia + home com mídia final Outono 2026"
labels: [needs-triage, slice-4]
type: HITL
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0001, 0004, 0006, 0007, 0013]
user_stories: [3, 4, 29]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

Construir a **rota fixa `/campanha`** (não dinâmica, sem `[slug]`, conforme ADR-0004). Layout:

- **Hero Cinema Studio cheio**: 15–30s, full-width, autoplay/mute/loop, mood Outono 2026 — **gerado novo via Higgsfield**, mais robusto que o vídeo curto (~8s) da seção home da S1.9.
- **Manifesto longo Outono 2026**: texto literal da Ellen do PDF (já em `data/campanha-atual.json`), expandido se Ellen quiser adicionar mais.
- **Grid completa dos `produtosDestaqueSlugs`** da Campanha Atual (6–10 peças) com cards visuais ricos (foto principal + nome + preço + CTA "Ver peça"). Lê de `data/campanha-atual.json`.

**Atualizar o link CTA** "Ver peças desta estação" da `CampaignSection` na home (que em S1.9 apontava para produto canônico fallback) **para apontar agora pra `/campanha`**.

**Atualizar a `CampaignSection`** da home com mídia final Outono 2026 (substitui placeholder se houver).

**HITL**: Pak revisa o vídeo Cinema Studio cheio antes de mergear (vídeo é peso máximo de produção visual da Campanha — qualidade prevalece sobre economia, ADR-0001).

**Tracking**: `view_campaign_page` agora dispara em `/campanha` (instrumentação que foi preparada em S1.8 com placeholder).

## Acceptance criteria

- [ ] Rota fixa `/campanha` funcional (não tem `[slug]` — conteúdo lê de `data/campanha-atual.json`)
- [ ] **Higgsfield Cinema Studio**: 1 vídeo cheio (15–30s) gerado pra `/campanha`, prompts versionados, manifest atualizado camada `sazonal`
- [ ] **HITL**: Pak revisa e aprova vídeo cheio no PR antes de mergear
- [ ] Manifesto longo Outono 2026 renderiza em `/campanha` (texto literal da Ellen ou expandido)
- [ ] Grid completa dos `produtosDestaqueSlugs` (6–10 peças) renderizada com cards
- [ ] CTA "Ver peças desta estação" da home redireciona pra `/campanha` (substitui fallback da S1.9)
- [ ] CampaignSection da home com vídeo final Outono 2026 (não mais placeholder/curto)
- [ ] Tracking `view_campaign_page` dispara em `/campanha`
- [ ] Integration test `/campanha`: renderiza vídeo + manifesto + grid de peças destaque
- [ ] E2E: home → CTA Campanha → `/campanha` → vê grid → clica peça → /produto
- [ ] Visual regression baseline `/campanha` (mobile + desktop)
- [ ] A11y axe sem violações
- [ ] Lighthouse mobile ≥ 95 (vídeo de 15–30s exige cuidado: poster, preload metadata, lazy load fora do viewport inicial)
- [ ] `taste-skill (minimalist-ui)` + `emil-design-eng` aplicadas
- [ ] CONTEXT.md inalterado

## Blocked by

- #0012 (S3.1 Catálogo completo — peças destaque precisam existir como produtos navegáveis)
