---
title: "S5.1 — Polimentos finais (cursor custom + microvídeos + a11y total + perf 2º round)"
labels: [needs-triage, slice-5]
type: AFK
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0001, 0006, 0013]
user_stories: [1, 2, 24, 36]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

Round final de polish antes de release público.

### Cursor custom desktop

Cursor custom no desktop em hero da Marca (home), CampaignSection, e `/campanha` — mouse sobre vídeo vira cursor warm sutil (círculo dourado discreto com sparkle no centro, ou similar). **Não invasivo**, opcional via `prefers-reduced-motion` (volta pro cursor padrão se o usuário pediu menos motion). Implementação CSS-only quando possível (sem JS pesado).

### Microvídeos Seedance 2.0

Microvídeos Seedance 2.0 1080p (<4s loops decorativos) em transições entre seções principais (sparkles ou warm light moves abrindo seções). 4–8 microvídeos no total, gerados via Higgsfield. Manifest atualizado camada `atemporal` (são da Marca, eternal).

### Performance 2º round

2º round de Lighthouse mobile em **todas** as páginas (home, /campanha, todas as 9 categorias, busca, /carrinho, /pedido-enviado, /sobre, 5 institucionais, /privacidade). Otimizações finais: lazy load de imagens fora do viewport, `<link rel="preload">` em fontes hero + asset crítico do hero, code-splitting de rotas pesadas, audit de bundle (Next.js bundle analyzer).

### A11y WCAG AA validado em **todas** as páginas

Não só Slice 1 — agora todas as páginas passam por axe via Playwright. Violações falham PR (ADR-0013). Foco visível em todos os componentes interativos. Contraste real validado (rosa salmão + dourado em alguns lugares pode precisar shadow ou outline — testar e corrigir).

### Vibração tátil

Vibração tátil leve `navigator.vibrate(10)` em CTAs principais ("Adicionar ao carrinho", "Finalizar pelo WhatsApp") — feature-detect (`if ("vibrate" in navigator)`) para devices que suportam, sem erro em devices sem suporte.

### Skeleton loaders

Skeleton loaders em vez de spinners em qualquer estado de loading (catálogo grande, busca lenta, vídeos pesados). Audit do `emil-design-eng` reforça perceived performance.

## Acceptance criteria

- [ ] Cursor custom desktop em hero da Marca, CampaignSection, `/campanha` (respeita `prefers-reduced-motion`)
- [ ] **Higgsfield Seedance 2.0**: 4–8 microvídeos 1080p (<4s loops) em transições, manifest atualizado camada `atemporal`
- [ ] Vibração tátil em CTAs principais (feature-detect; sem erro em devices sem suporte)
- [ ] Skeleton loaders em vez de spinners em qualquer estado de loading
- [ ] 2º round Lighthouse: **todas** as páginas mobile ≥ 95 (LCP, CLS, INP dentro do budget)
- [ ] A11y axe sem violações em **todas** as páginas (catálogo + busca + campanha + institucionais + carrinho + pedido-enviado + privacidade)
- [ ] Visual regression atualizada (microvídeos com `mask:` em test mode pra evitar flake)
- [ ] `emil-design-eng` audit aprovado em PR (revisão final de motion: animações ≤300ms, easing custom, perceived performance)
- [ ] Performance budget atende em todas as páginas (LCP, CLS, INP, score ≥ 95)
- [ ] CONTEXT.md inalterado

## Blocked by

- #0014 (S4.1 /campanha rota cheia — todas as superfícies do site existem agora pra polish final)
