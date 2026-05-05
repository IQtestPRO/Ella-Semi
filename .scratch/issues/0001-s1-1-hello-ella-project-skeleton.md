---
title: "S1.1 — Hello ELLA: project skeleton on Vercel"
labels: [needs-triage, slice-1]
type: AFK
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0005, 0013]
user_stories: [1, 35, 36]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

Setup do projeto greenfield: **Next.js 15 App Router + Tailwind v4 + TypeScript strict + pnpm + Node 22 LTS** (ADR-0005). Deploy automático na Vercel free tier com subdomínio `vercel.app`. Página inicial placeholder mínima ("Hello ELLA") com a logo bitmap (`assets/brand/logo.jpg`), tipografia placeholder DM Serif Display via `next/font` (escolha real fica para S1.2), 1 sparkle SVG inline, fundo rosa salmão sólido amostrado por aproximação do logo. Footer mínimo com link `/privacidade` apontando para rota com texto "em breve". Toda a infraestrutura de teste da ADR-0013 cabeada e passando baselines: **Vitest** (unit) + **Playwright** (E2E + visual regression) + **@axe-core/playwright** (a11y) + **@lhci/cli** (perf budget). CI rodando os 7 layers em cada PR.

## Acceptance criteria

- [ ] `pnpm install` + `pnpm dev` rodam local sem warnings
- [ ] Home renderiza `<h1>ELLA</h1>` em DM Serif Display (placeholder), fundo rosa salmão, 1 sparkle SVG visível
- [ ] Logo `assets/brand/logo.jpg` aparece (header pequeno)
- [ ] Footer com link `/privacidade` (página "em breve")
- [ ] `pnpm test` (Vitest) passa com 1+ unit smoke test
- [ ] `pnpm test:e2e` passa com 1 E2E "home loads, ELLA visible"
- [ ] `pnpm test:a11y` (axe) sem violações em home + /privacidade
- [ ] `pnpm test:visual` gera baselines (mobile 375×667 + desktop 1280×800)
- [ ] Lighthouse CI roda no preview Vercel com budget LCP ≤ 2.0s, CLS ≤ 0.05, INP < 200ms, score ≥ 95
- [ ] Deploy automático: PR cria preview Vercel; merge no main faz deploy de produção
- [ ] CI workflow (GitHub Actions ou Vercel Build) executa as 7 camadas de teste; falha bloqueia merge
- [ ] CONTEXT.md inalterado
- [ ] Skills `taste-skill (minimalist-ui)` + `emil-design-eng` aplicadas conforme CLAUDE.md

## Blocked by

None — can start immediately.
