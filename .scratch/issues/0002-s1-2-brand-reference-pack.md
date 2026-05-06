---
title: "S1.2 — Brand Reference Pack: paleta amostrada + tipografia confirmada"
labels: [needs-triage, slice-1]
type: HITL
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0001, 0003, 0006, 0013]
user_stories: [2, 38]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

Sessão visual com Pak para definir o **Brand Reference Pack** do projeto. Mockup screenshot gerado com **5 candidatas serif** (**DM Serif Display + Bodoni Moda + Italiana + Cormorant Garamond + Playfair Display**) tipografando "ELLA" + "Semijoias" em alta resolução, comparada **lado-a-lado** com a logo `assets/brand/logo.jpg`. Pak revisa visualmente e escolhe a fonte mais aderente à perna alongada cursiva do "A". Paleta primária **já fechada na S1.1** via amostragem pixel-exact (ADR-0003 atualizada): rosa salmão `#FFD9CC`, dourado mostarda `#D99A30`, preto warm `#251008`. S1.2 foca em **paleta secundária** (3-4 cores warm derivadas: off-white, taupe, areia) e **tipografia hero**. Documento `assets/prompts/brand-reference.md` formaliza as decisões: paleta completa, tipografia hero+secundária com fallback, mood "warm editorial soft glam", anti-prompts pra Higgsfield, iluminação padrão (golden hour ou indoor janela), templates de prompt por modelo. Tokens Tailwind v4 atualizados via `@theme` em `app/globals.css` (NÃO `tailwind.config.ts` — Tailwind v4 não usa). `next/font` configurada com a fonte hero escolhida + secundária (display swap, zero CLS). Visual regression baselines de S1.1 regeneradas com tipografia final.

> **Correções 2026-05-05** (decisão Pak):
> - 5 fontes em vez de 3 (Cormorant Garamond + Playfair Display adicionadas).
> - Paleta primária NÃO é amostrada nesta slice — já foi fechada na S1.1 via `scripts/sample-logo-color.mjs`. S1.2 herda como dado de entrada.
> - Tokens Tailwind v4 vão em `@theme` em `app/globals.css` (NÃO em `tailwind.config.ts` que não existe em v4). Issue original foi escrita antes da ADR-0005 fechar e está corrigida.
> - Lighthouse mobile ≥ 95 → **deferido pra S6.1** (issue 0018, junto com TB10/CI/Vercel). Performance entra quando deploy estiver real (Vercel edge), não localhost.

## Acceptance criteria

- [ ] Mockup com 5 fontes lado-a-lado gerado em `assets/brand/font-comparison.png` (HTML+Playwright screenshot, sem Higgsfield)
- [ ] **HITL**: Pak revisa o mockup e aprova a fonte escolhida no chat (S1.2 fica em local-only branch — sem PR até S6.1)
- [ ] **HITL**: Pak aprova paleta secundária (3-4 cores hex propostas)
- [ ] **HITL**: Pak confirma Inter como secundária ou aprova alternativa
- [ ] `assets/prompts/brand-reference.md` v1.0 contém: paleta primária+secundária (5+ hex codes), tipografia hero confirmada com fallback, tipografia secundária, mood, anti-prompts (lista detalhada), iluminação padrão, templates de prompt por modelo Higgsfield
- [ ] `app/globals.css` com `@theme { --color-salmao, --color-mostarda, --color-warm-black, --color-off-white, --color-taupe, --color-areia, --font-hero, --font-body }` (Tailwind v4 native tokens)
- [ ] `next/font` carrega fonte hero + secundária com `display: 'swap'` e zero CLS
- [ ] Home da S1.1 re-renderiza com tipografia final
- [ ] Visual regression baselines regeneradas (revisão Pak antes do commit)
- [ ] `pnpm test:e2e` / `:visual` / `:a11y` verdes locais
- [ ] ADR-0014 escrita formalizando decisões S1.2
- [ ] CONTEXT.md atualizado com vocabulário novo (off-white quase rosa, taupe, areia, Brand Reference Pack)
- [ ] Branch `feat/s1.2-brand-reference-pack` push'ada pro `origin`
- ⏭️ Lighthouse mobile ≥ 95 → S6.1 (issue 0018)

## Blocked by

- #0001 (S1.1 Hello ELLA: project skeleton on Vercel)
