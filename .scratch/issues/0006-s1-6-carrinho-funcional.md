---
title: "S1.6 — Carrinho funcional (Cart + Validation modules; CartPage; CTA real)"
labels: [needs-triage, slice-1]
type: AFK
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0005, 0009, 0013]
user_stories: [12, 13, 14, 19]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

Implementar 2 módulos profundos:

- **`Cart`** (Zustand persist com chave `ella-cart-v1`, schema versionado): `addToCart(productSlug, variant?, qty)`, `removeFromCart`, `updateQuantity`, `clearCart`, `getCart`, `subscribe`. Migração transparente futura quando schema mudar.
- **`Validation`**: `validateCartBeforeFinalize(cart, catalog): { valid: boolean, errors: ValidationError[] }`. Cobre qty>0, produto ainda `ativo: true`, slug ainda existe no catálogo, sem itens órfãos com slug inválido.

Conectar o **CTA real** da `ProductPage` ao `Cart.addToCart` (substitui o toast placeholder de S1.5 por persistência real + feedback visual). Página `/carrinho`:

- **`CartPage`**: orquestra layout.
- **`CartLine`**: por item — foto pequena, nome editorial, variante se houver, qty `+`/`−` (com a11y por teclado), preço unitário, subtotal por item, botão remover.
- **`CartSummary`**: subtotal, frete "a combinar pelo WhatsApp" (texto fixo), total destacado em fonte hero.
- **CTA grande** "Finalizar pelo WhatsApp" — **ainda não funcional**, só visual; S1.7 conecta.
- **`EmptyCartState`**: ilustração editorial leve + sparkle + CTA "Ver catálogo" (link pra `/colares` ou home).

`taste-skill (minimalist-ui)` + `emil-design-eng` aplicados em UI.

## Acceptance criteria

- [ ] **Módulo `Cart`** com unit tests: add/remove/update/clear, persistência localStorage `ella-cart-v1`, schema versionado, leitura inicial (cart vazio default), subscribe/unsubscribe
- [ ] **Módulo `Validation`** com unit tests: cart vazio inválido (sem errors), qty 0 → erro, slug inexistente → erro órfão, produto inativo → erro, cart válido → `valid: true`
- [ ] Coverage ≥ 90% branches críticos nos 2 módulos
- [ ] Rota `/carrinho` renderiza `CartPage` com `CartLine`s, `CartSummary`, `EmptyCartState` (estado vazio)
- [ ] CTA real em ProductPage adiciona ao Cart (validar com integration test)
- [ ] Cart persiste através de reload (testado em E2E)
- [ ] Integration test `CartPage`: adicionar item, atualizar qty (+/-), remover, validar que subtotal/total atualizam
- [ ] E2E: produto canônico → adicionar → /carrinho → mostra item → atualiza qty → remove → carrinho vazio
- [ ] Visual regression baselines: cart vazio + cart com 1 item + cart com 3 itens (mobile + desktop)
- [ ] A11y axe sem violações em `/carrinho` (qty buttons + remove button acessíveis por teclado)
- [ ] Lighthouse mobile ≥ 95
- [ ] `taste-skill (minimalist-ui)` + `emil-design-eng` aplicadas
- [ ] CONTEXT.md inalterado (termos já documentados)

## Blocked by

- #0005 (S1.5 Página de produto navegável)
