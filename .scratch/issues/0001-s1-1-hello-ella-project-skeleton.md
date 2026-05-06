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

Setup do projeto greenfield: **Next.js 15 App Router + Tailwind v4 + TypeScript strict + pnpm + Node 22 LTS** (ADR-0005). Página inicial placeholder mínima ("Hello ELLA") com a logo bitmap (`assets/brand/logo.jpg`), tipografia placeholder DM Serif Display via `next/font` (escolha real fica para S1.2), 1 sparkle SVG inline, fundo rosa salmão sólido amostrado por aproximação do logo. Footer mínimo com link `/privacidade` apontando para rota com texto "em breve". Infra de teste obrigatória da ADR-0013 cabeada e passando **localmente**: **Vitest** (unit) + **Playwright** (E2E + visual regression) + **@axe-core/playwright** (a11y).

> **Escopo revisado 2026-05-05** (decisão Pak): CI workflow GitHub Actions, Lighthouse budget, e Vercel deploy foram **adiados pra S6.1** (slice de deploy). Issue separada: `.scratch/issues/0018-tb10-deferred-ci-lighthouse-vercel.md`. Justificativa: validar Slice 1 completa em localhost antes de deployar esqueleto vazio.

## Acceptance criteria

- [x] `pnpm install` + `pnpm dev` rodam local sem warnings
- [x] Home renderiza `<h1>ELLA</h1>` em DM Serif Display (placeholder), fundo rosa salmão, 1 sparkle SVG visível
- [x] Logo `assets/brand/logo.jpg` aparece (header pequeno)
- [x] Footer com link `/privacidade` (página "em breve")
- [x] `pnpm test` (Vitest) passa com 1+ unit smoke test
- [x] `pnpm test:e2e` passa com 1+ E2E "home loads, ELLA visible"
- [x] `pnpm test:a11y` (axe) sem violações em home + /privacidade (WCAG 2 AA)
- [x] `pnpm test:visual` gera baselines (mobile 375×667 + desktop 1280×800) e passa contra elas
- [x] Branch `feat/s1.1-hello-ella` push'ada pro remote `origin` (`IQtestPRO/Ella-Semi`)
- [x] CONTEXT.md inalterado
- [x] Skills `taste-skill (minimalist-ui)` + `emil-design-eng` aplicadas conforme CLAUDE.md
- ⏭️ Lighthouse CI + GitHub Actions workflow + Vercel deploy → **S6.1** (issue 0018)

## Blocked by

None — can start immediately.
