---
title: "TB10 deferido — CI workflow + Lighthouse budget + Vercel deploy"
labels: [deferred-tech-debt, slice-6]
type: deferred
created: 2026-05-05
status: open
parent_issue: 0001
blocked_by: 0015
adrs_referenced: [0013]
---

## Por que está deferido

Decisão do Pak em 2026-05-05: TB10 original (CI workflow + Lighthouse budget + Vercel deploy) foi adiado pra a slice de deploy (S6.1 — "polimentos finais" no PRD original). Justificativa: validar tudo em localhost primeiro com Slice 1 completa (home + produto + carrinho + WhatsApp end-to-end). Não há valor em deployar agora um esqueleto sem feature.

S1.1 fecha com TB1–TB9 verdes + push pro remoto. CI workflow + deploy entram em S6.1.

## What needs to happen (na S6.1)

Trabalho ficou prototipado e revertido na branch `feat/s1.1-hello-ella` no commit `db0a2ef` (depois revertido). Quando S6.1 começar, recuperar via `git show db0a2ef -- .github/workflows/ci.yml lighthouserc.json` ou refazer do zero. Componentes esperados:

### CI workflow (`.github/workflows/ci.yml`)
- `actions/checkout@v4`
- `pnpm/action-setup@v4` (versão 10)
- `actions/setup-node@v4` (Node 22 LTS, cache pnpm)
- `pnpm install --frozen-lockfile`
- `pnpm type-check`
- `pnpm test` (Vitest unit)
- Cache Playwright browsers (`actions/cache@v4`, key=hash(pnpm-lock.yaml))
- `pnpm exec playwright install --with-deps chromium`
- `pnpm build`
- `pnpm test:e2e` (cobre e2e + a11y + visual)
- Upload Playwright report on failure (`actions/upload-artifact@v4`)
- `pnpm test:lh` (Lighthouse CI)
- Upload Lighthouse report on failure

### Lighthouse CI (`lighthouserc.json`)
Budget conforme ADR-0013 camada 7:
- `categories:performance` ≥ 0.95
- `largest-contentful-paint` ≤ 2000ms
- `cumulative-layout-shift` ≤ 0.05
- `total-blocking-time` ≤ 200ms

URLs: `/` e `/privacidade` na S1.1; expandir conforme slices avançam.

`startServerCommand: "pnpm start"`, `numberOfRuns: 1`, mobile preset (default).

### Vercel deploy
- Manual one-time: importar repo `IQtestPRO/Ella-Semi` no Vercel dashboard.
- Auto-detecta Next.js. Build command `pnpm build`. Install `pnpm install`.
- Auto-deploy: push em main → produção; PR → preview URL como check.
- Sem `vercel.json` (auto-detecção cobre tudo).

### Cross-platform visual baselines
Pendência conhecida: baselines locais foram geradas em Windows (`win32`). Quando CI rodar em Linux, threshold 2% (`maxDiffPixelRatio: 0.02` em `playwright.config.ts`) absorve diferenças de font rasterization. Decisão: começar com 2% e medir; apertar pra 0.1% (ADR-0013 inicial) só se cross-platform se mostrar consistente.

Alternativa: pré-gerar baselines Linux via Docker / WSL antes do primeiro CI run. Vai ficar pra avaliar em S6.1.

### Decisões abertas pra S6.1
- Decidir se Lighthouse roda contra localhost (CI Ubuntu) ou contra Vercel preview URL (mais autêntico, mais coordenação — `peter-evans/wait-for-vercel-preview` ou similar).
- Decidir se mantém threshold visual 2% (cross-platform) ou aperta pra 0.1% via Docker baselines.

## Acceptance criteria (S6.1)

- [ ] `.github/workflows/ci.yml` rodando 7 camadas em cada PR
- [ ] Lighthouse budget passa local + CI
- [ ] Vercel preview deploy automático em PR
- [ ] Vercel produção deploy automático em merge na main
- [ ] Cross-platform visual baselines resolvido (Docker/WSL pré-gerar OU threshold tuning OU ambas)

## Blocked by

S6.1 — "Polimentos finais" (slice de deploy do PRD).
