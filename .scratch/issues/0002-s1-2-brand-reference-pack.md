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

Sessão visual com Pak para definir o **Brand Reference Pack** do projeto. Mockup screenshot gerado com 3 candidatas serif (**DM Serif Display / Bodoni Moda / Italiana**) tipografando "ELLA" em alta resolução, comparada **lado-a-lado** com a logo `assets/brand/logo.jpg`. Pak revisa visualmente e escolhe a fonte mais aderente à perna alongada cursiva do "A". Paleta amostrada do logo via inspeção pixel: rosa salmão (~#F5C5B6), dourado mostarda (~#D4A24A), preto warm das letras. Documento `assets/prompts/brand-reference.md` formaliza as decisões: paleta exata em hex (mín. 3 cores), fonte hero confirmada com fallback, fonte secundária Inter, mood "warm editorial soft glam", anti-prompts pra Higgsfield, iluminação padrão (golden hour ou indoor janela). Tailwind tokens (`tailwind.config.ts`) atualizados com cores warm exatas (`salmao`, `mostarda`, `warm-black`) e `font-family` (`hero`, `body`). `next/font` configurada com a fonte hero escolhida + Inter (display swap, zero CLS). Visual regression baselines de S1.1 regeneradas com tipografia final.

## Acceptance criteria

- [ ] Mockup com 3 fontes lado-a-lado gerado em `assets/brand/font-comparison.png` (gerado via Higgsfield ou ferramenta de comparison apropriada)
- [ ] **HITL**: Pak revisa o mockup e aprova a fonte escolhida no PR (comentário com a escolha)
- [ ] `assets/prompts/brand-reference.md` contém: paleta amostrada (3+ hex codes), tipografia hero confirmada com fallback, tipografia secundária Inter, mood, anti-prompts (lista detalhada), iluminação padrão
- [ ] `tailwind.config.ts` com cores `salmao`, `mostarda`, `warm-black`, e font-family `hero` + `body`
- [ ] `next/font` carrega fonte hero + Inter com `display: 'swap'` e zero CLS
- [ ] Home da S1.1 re-renderiza com tipografia final
- [ ] Visual regression baseline da home regenerada (review aprovado no PR)
- [ ] Snapshot/unit test do tema (lê `tailwind.config.ts` e valida estrutura de tokens)
- [ ] Lighthouse mobile ≥ 95 com fonte real
- [ ] A11y axe sem violações
- [ ] CONTEXT.md atualizado se algum termo novo surgir (improvável)

## Blocked by

- #0001 (S1.1 Hello ELLA: project skeleton on Vercel)
