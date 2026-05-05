---
title: "S1.5 — Página de produto navegável (/<categoria>/<slug>)"
labels: [needs-triage, slice-1]
type: AFK
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0002, 0005, 0009, 0013]
user_stories: [7, 8, 9, 10, 11, 12]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

Rota dinâmica `/<categoria>/<slug>` (Next.js App Router) que renderiza a página de produto da peça canônica de S1.4. Componentes:

- **`ProductPage`**: orquestra layout mobile-first (375×667 baseline) e desktop.
- **`ProductGallery`** (swipeable mobile via Motion gesture): 3 fotos da peça com snap horizontal, indicador de página (dots), aspect ratio 4:5.
- **`ProductHeader`**: nome editorial em fonte hero + preço grande em formato BRL (`Currency Format`).
- **`ProductDescription`**: descrição rica, banho, dimensões (se houver), garantia.
- **`ProductVariantSelector`**: render só se `variantes?.length > 0`. Selecionar tamanho/comprimento/banho atualiza preço se variante tem `precoCentsAjuste`.
- **`ProductStickyCTA`**: botão sticky bottom mobile "Adicionar ao carrinho · R$ XX,XX", microinteração de sparkle no toque (≤300ms easing custom).
- **`SobEncomendaNotice`**: render só se `tipoFulfillment === 'sob-encomenda'`. Aviso calmo "Sob encomenda — pagamento prévio. Confirmamos prazo no WhatsApp."
- **`schema.org` Product + Offer + BreadcrumbList** em JSON-LD no `<head>`.

CTA "Adicionar ao carrinho" **temporário**: dispara toast/feedback visual mas **não persiste cart ainda** (cart real entra em S1.6). Tracking de eventos: nada ainda (eventos vêm em S1.8). `taste-skill (minimalist-ui)` + `emil-design-eng` aplicados em UI.

## Acceptance criteria

- [ ] Rota `/<categoria>/<slug>` resolve para a peça canônica; 404 para slug inexistente
- [ ] `ProductPage` renderiza nome editorial + preço + 3 fotos + descrição + variantes (se houver) + CTA sticky + aviso sob-encomenda (se aplicável)
- [ ] Galeria swipeable mobile com Motion gesture (swipe horizontal, snap, dots indicator)
- [ ] Variant selector atualiza preço quando aplicável
- [ ] CTA "Adicionar ao carrinho" mostra toast (não persiste — placeholder até S1.6)
- [ ] Schema.org Product + Offer + BreadcrumbList em JSON-LD válido (validar com Schema.org Validator)
- [ ] Integration test (RTL): renderiza ProductPage com fixture de peça, valida elementos chave, testa swipe gesture, testa clique no CTA → toast aparece
- [ ] Visual regression baseline (mobile 375×667 + desktop 1280×800) committada
- [ ] A11y axe sem violações (carousel acessível por teclado, aria-labels nas fotos)
- [ ] Lighthouse mobile ≥ 95
- [ ] `taste-skill (minimalist-ui)` aplicado: composição warm-editorial, hierarquia tipográfica
- [ ] `emil-design-eng` aplicado: animação ≤300ms, easing custom (não default), perceived performance (skeleton loading no carregamento inicial das fotos)
- [ ] CONTEXT.md inalterado

## Blocked by

- #0004 (S1.4 Catálogo demo)
