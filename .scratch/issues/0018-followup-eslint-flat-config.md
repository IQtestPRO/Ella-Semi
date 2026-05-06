---
title: "Follow-up — ESLint flat config (Next 16 + ESLint 10 + FlatCompat bug)"
labels: [improvement, deferred]
type: followup
created: 2026-05-05
status: open
parent_issue: 0001
adrs_referenced: []
---

## Why this is here

Durante S1.1 / TB10, tentamos cabear `pnpm lint` no CI. Combinação `Next 16 + ESLint 10 + @eslint/eslintrc.FlatCompat` quebra com `TypeError: Converting circular structure to JSON` (eslint-config-next 16 expõe um plugin `react` com referência circular que falha na validação do schema do compat layer).

Decisão pragmática: **adiar setup de lint** pra não bloquear S1.1. ADR-0013 não exige lint nas 7 camadas obrigatórias; type-check (`tsc --noEmit`) já roda no CI e cobre o essencial.

## What needs to happen

- Investigar versão de `eslint-config-next` que exporta flat config nativo (não via FlatCompat) — provavelmente versão futura do pacote.
- OU descer para `eslint@9` + `eslint-config-next@15` que funcionavam com `.eslintrc.json`.
- OU escrever flat config manualmente sem extender `next/core-web-vitals` (perde algumas regras Next-específicas mas evita o circular).

Critério de aceite: `pnpm lint` roda sem erro, CI workflow tem step de Lint, e o step bloqueia PR ao falhar.

## Impact

Sem lint:
- Type errors capturados ainda (tsc strict).
- Padrões React/JSX (a11y rules, hooks rules) **não** capturados.
- Convenções de import order, formatting **não** aplicadas.

Aceitável até aqui pelo escopo enxuto da S1.1 (1 página, 4 componentes). Crescer sem lint vira bola de lama; resolver antes do final da Slice 1 (idealmente como follow-up logo depois do merge da S1.1).
