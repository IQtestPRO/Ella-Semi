---
title: "S3.1 — Catálogo completo: 9 rotas de categoria + filtros"
labels: [needs-triage, slice-3]
type: AFK
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0001, 0004, 0005, 0006, 0008, 0009, 0013]
user_stories: [5, 7, 8, 9, 25]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

**9 rotas de categoria de catálogo**: `/colares`, `/aneis`, `/brincos`, `/pulseiras`, `/conjuntos`, `/gargantilhas`, `/tornozeleiras`, `/piercings`, `/outros`. Cada rota lista todas as peças `ativo: true` da categoria com card visual (foto principal + nome + preço em formato BRL).

**Header da categoria** com microvídeo Cinema Studio 4–6s loop específico da categoria (gerado via Higgsfield em batch — 9 vídeos, camada `atemporal` por serem da Marca, não da Campanha). Frase manifesto da categoria (placeholder editorial inicial).

**Filtros**:
- Desktop: sidebar lateral.
- Mobile: bottom sheet (Motion).
- Filtros: **banho** (multi-select: ouro / prata / ródio / ouro-rose / níquel), **faixa de preço** (range slider), **lançamentos** (toggle — peças com `cadastradoEm` nos últimos N dias), **em destaque agora** (toggle — filtra `produtosDestaqueSlugs` da Campanha Atual; some quando `ativa: false`).

**Hover/tap em produto** = sparkle dourado + zoom suave (≤300ms easing custom). **Sticky cart-summary** mobile no rodapé mostrando "X peças no carrinho · Ver carrinho".

**Bg-swap Higgsfield batch** produzindo Foto 1 + Foto 2 + Foto 3 para todas as ~90–120 peças (~270–360 gerações conforme **ADR-0008**). Manifest atualizado camada `por-peca`. Política Higgsfield ADR-0001 e ADR-0006 aplicadas (pipeline único, sem stock).

**Infraestrutura de rotas**: `app/[categoria]/page.tsx` com **static generation** a partir do `data/products.json` (ISR pode ser usado se necessário). Schema.org `BreadcrumbList` + `ItemList` em cada rota. Tracking: `view_category_page` (instrumentação adicional além de S1.8 — registrar como evento novo no Analytics).

## Acceptance criteria

- [ ] 9 rotas de categoria funcionais (`/colares` a `/outros`)
- [ ] Cada rota lista todas as peças `ativo: true && categoria === <cat>` ordenadas por relevância default
- [ ] **Higgsfield batch**: ~270–360 gerações executadas (Foto 1 + Foto 2 + Foto 3 para cada peça), manifest com camada `por-peca`, prompts versionados em `assets/prompts/pecas/<slug>.md`, anti-drift checks a cada 20 peças (ADR-0012)
- [ ] **Higgsfield Cinema Studio**: 9 microvídeos (~4-6s loop) por categoria, camada `atemporal`
- [ ] Filtros funcionais: banho (multi-select), preço (range), lançamentos (toggle), em-destaque-agora (toggle)
- [ ] Filtros desktop em sidebar; mobile em bottom sheet (Motion)
- [ ] Hover/tap em produto = sparkle + zoom ≤300ms easing custom
- [ ] Sticky cart-summary mobile no rodapé mostrando contagem
- [ ] Schema.org BreadcrumbList + ItemList em JSON-LD válido
- [ ] Integration tests: filtragem por banho funciona, filtragem por preço, combinação de filtros, sticky cart-summary atualiza
- [ ] E2E: home → categoria → filtra → escolhe peça → adicionar carrinho
- [ ] Visual regression baselines de cada categoria (mobile + desktop, com filtros aplicados em fixture)
- [ ] A11y axe sem violações em todas as 9 rotas
- [ ] Lighthouse mobile ≥ 95 em cada rota
- [ ] `taste-skill (minimalist-ui)` + `emil-design-eng` aplicadas
- [ ] Tracking `view_category_page` instrumentado (Analytics + Plausible custom event)
- [ ] CONTEXT.md atualizado se algum termo novo surgir (improvável)

## Blocked by

- #0010 (D1 Processamento do catálogo PDF — produtos.json populado)
- #0009 (S1.9 Home completa — sticky cart-summary, header consistente)
