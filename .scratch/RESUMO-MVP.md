# Resumo MVP — Handoff de sessão (2026-05-06)

> Documento canônico pra retomar trabalho do projeto Ella em nova sessão Claude Code.
> Lê esse + `CLAUDE.md` + `CONTEXT.md` + `docs/adr/0015-...md` + issue ativa do `.scratch/issues/`.

## Onde estamos agora

- **Branch atual**: `feat/s1.5-pagina-de-produto-navegavel` (push em `origin`)
- **Último commit**: `02224fa feat(s1.5): TB1 rota dinâmica /<categoria>/<slug> + ProductPage completa`
- **Slice ativa**: S1.5 (TB1 fechado, TB2/TB3 pendentes)
- **Repo remoto**: https://github.com/IQtestPRO/Ella-Semi.git
- **Site navega**: home → click ProductCard → `/brincos/brinco-folha-aberta-semijoia` → ProductPage com galeria + CTA toast

## Política de aceleração ATIVA (autorizada por Pak 2026-05-06)

> **TERMINA O SITE PRIMEIRO. Imagem perfeita depois.**

1. **NÃO pergunte** sobre coisas que CLAUDE.md/ADRs já cobrem — escolha melhor opção e segue.
2. **NÃO pergunte** sobre microinterações, layout secundário, hover, animações — `minimalist-ui` + `emil-design-eng` decidem.
3. **NÃO pause pra HITL** exceto:
   - Erro técnico irrecuperável
   - Decisão arquitetural que viola ADR existente
   - **Confirmação final ANTES de cada slice fechar** (mostra entrega, Pak valida 2-3 min)
4. **Política de teste mantida** (CLAUDE.md inegociável): unit + snapshot + integration + E2E + visual + a11y. Lighthouse deferido a S6.1 (issue 0018).
5. **Peça canônica `brinco-folha-aberta-semijoia`** = fixture única pra testes. Não regenerar fotos. Não bloqueia em "produto real ideal".
6. **NÃO regerar fotos** com input image do PDF — política nova `--image catálogo` é só pra S3.1+ (issue 0020). As 3 fotos da canônica ficam from-scratch.

## O que falta pra fluxo end-to-end navegável (MVP funcional)

Sequência sem pausa:

### S1.5 TB2 — ProductGallery swipeable
- Motion gesture (mobile swipe horizontal entre as 3 fotos)
- Dots indicator
- Keyboard arrow nav (← →)
- `prefers-reduced-motion` respeitado
- `pnpm add motion`
- Atualizar `app/components/product/ProductGallery.tsx`
- Visual baseline regenera

### S1.5 TB3 — RTL integration test
- React Testing Library + msw já listados em ADR-0013
- Test `ProductPage` com fixture: renderiza nome + preço + galeria + CTA → click → toast aparece
- `pnpm add -D @testing-library/react @testing-library/jest-dom jsdom`
- Vitest config: `environment: 'jsdom'` pros `tests/integration/`
- `tests/integration/ProductPage.test.tsx`

### S1.6 TB1 — Cart module + Validation module
- `lib/cart/index.ts` — Zustand persist com `ella-cart-v1`, schema versionado
  - `addToCart(slug, variant?, qty)`, `removeFromCart`, `updateQuantity`, `clearCart`, `getCart`, `subscribe`
  - `pnpm add zustand`
- `lib/validation/cart.ts` — `validateCartBeforeFinalize(cart, catalog)` retorna `{ valid, errors[] }`
  - Cobre: qty>0, produto ativo, slug existe, sem itens órfãos
- Unit tests Vitest pra ambos

### S1.6 TB2 — `/carrinho` rota + CartPage + ProductStickyCTA real
- `app/carrinho/page.tsx` — client component (consume Cart store)
- `app/components/cart/CartPage.tsx`, `CartLine.tsx`, `CartSummary.tsx`, `EmptyCartState.tsx`
- `ProductStickyCTA` chama `Cart.addToCart` (substitui toast por persistência real + feedback)

### S1.6 TB3 — Integration + E2E + a11y + visual
- E2E: produto canônico → adicionar → /carrinho mostra item → atualiza qty → remove → estado vazio
- Cart persiste através de reload (E2E)
- Visual baseline: cart vazio + cart com item

### S1.7 TB1 — Order + WhatsApp Message Builder + WhatsApp Link Builder
- `lib/order/index.ts` — `generateOrderId()` (PED-XXXXXX, 6 chars sem 0/O/1/I/L via `crypto.getRandomValues`); `recordSnapshot`; `getSnapshotById` (`ella-orders-v1`)
- `lib/whatsapp/message-builder.ts` — `buildMessage(cart): string` template ADR-0010 literal:
  - "Olá, Ellen!"
  - bullets `•` por item: nome + (variantes) + `× qty` se >1 + sufixo "— sob encomenda — pagamento prévio" se aplicável + preço
  - `*Total: R$ XX,XX*`
  - "Pedido feito pelo site · #PED-XXXXXX"
- `lib/whatsapp/link-builder.ts` — `buildWaMeUrl(message, phoneE164)` URL-encoded
- **Snapshot test** `toMatchSnapshot()` com fixture canônica de cart com 4 itens (ADR-0013 camada 2)
- Env var `NEXT_PUBLIC_WHATSAPP_NUMBER` placeholder `5500000000000`

### S1.7 TB2 — CTA Finalizar funcional + `/pedido-enviado/[id]` + OrderSentPage
- CartPage CTA "Finalizar pelo WhatsApp": gera idPedido → buildMessage → recordSnapshot → `window.open(waMeUrl, '_blank')` → router.push(`/pedido-enviado/${id}`)
- `app/pedido-enviado/[idPedido]/page.tsx` (client) — recupera snapshot por ID
- `app/components/order/OrderSentPage.tsx` — sparkles celebration motion, ID grande hero, fallback "[abrir manualmente]" + "[copiar mensagem]" (Clipboard API), lista resumida do pedido, botões "Continuar comprando" + "Esvaziar carrinho"

### S1.7 TB3 — E2E completo + a11y + visual
- E2E: home → produto → adicionar → /carrinho → Finalizar → `window.open` mockado verifica wa.me URL + mensagem encoded → redirect /pedido-enviado/PED-XXXXXX → ID + sparkles
- Visual baseline /pedido-enviado (sparkles com `mask:` no test mode)
- A11y axe

### Apresentação final (gate Pak)
Quando S1.5 TB2/TB3 + S1.6 + S1.7 fecharem com testes verdes, apresenta:
- `pnpm dev` rodando em http://127.0.0.1:3000
- Path absoluto pra Pak abrir
- Confirmação MVP funcional cumprido
- Lista commits/branches feitos
- Testes verdes count

Pak valida fluxo navegando, libera S3.1 (catálogo completo, ~435 gerações Higgsfield).

## Estado dos testes (após S1.5 TB1)

| Suite | Count |
|---|---|
| Unit (Vitest) | 98 |
| E2E home + product + a11y + visual | 50+ |
| Total | ~150 verdes |

Comando: `pnpm test && pnpm test:e2e`.

## ADRs/issues críticas pra ler

- `docs/adr/0001-...` — Higgsfield qualidade prevalece, sem teto
- `docs/adr/0008-...` — 3 fotos por peça (Foto 1/2/3) — atualização inline 2026-05-05 (Nano Banana Pro 2K único)
- `docs/adr/0010-...` — Fluxo wa.me sem bot (formato mensagem literal)
- `docs/adr/0013-...` — Estratégia de teste 7 camadas (CI deferido a S6.1)
- `docs/adr/0014-...` — Brand Reference Pack v1.1 (Bodoni Moda + Inter + paleta)
- `docs/adr/0015-...` — Persona-Tipo Modelo Ella + pipeline Nano Banana Pro 2K (atualização inline 2026-05-06 sobre input image)
- `.scratch/issues/0005-...` — S1.5 (atual)
- `.scratch/issues/0006-...` — S1.6
- `.scratch/issues/0007-...` — S1.7
- `.scratch/issues/0018-...` — TB10 deferido S6.1 (CI workflow + Vercel deploy)
- `.scratch/issues/0020-...` — S3.1 prep extract-catalogo-page utility

## Anti-padrões importantes (recap CLAUDE.md)

- ❌ Treinar Soul Character — ADR-0012 superseded por ADR-0015 (persona-tipo prompt-only)
- ❌ Usar modelo de imagem ≠ Nano Banana Pro 2K
- ❌ Gerar imagem sub-2K
- ❌ Drift de estética da persona-tipo (rosto pode variar; idade/etnia/mood não)
- ❌ Placeholders de imagem em produção (use Higgsfield ou foto real Ellen via bg-swap)
- ❌ Implementar feature sem `/tdd` (red-green-refactor)
- ❌ Decisão arquitetural sem ADR (edit inline aceito só pra mudança tática — precedente registrado em CLAUDE.md "Manutenção de ADRs")

## Branches existentes (linear, sem merge na main)

```
main
  ↑ (sem merge — política Pak: tudo fica em branch até S6.1)
feat/s1.1-hello-ella                          ← S1.1 fechada
feat/s1.2-brand-reference-pack                ← S1.2 fechada
feat/s1.3-persona-tipo-modelo-ella            ← S1.3 fechada
feat/s1.4-catalogo-demo-1-peca                ← S1.4 fechada
feat/s1.5-pagina-de-produto-navegavel  ◀ ATUAL (TB1 fechado)
```

Próximas branches a criar:
- `feat/s1.6-carrinho-funcional` (deriva de s1.5)
- `feat/s1.7-finalizacao-wa-me-pedido-enviado` (deriva de s1.6)

## Comando pra retomar em nova sessão

Cole isso na nova sessão (após `/clear`):

> Continuação MVP S1 — política de aceleração ATIVA conforme `.scratch/RESUMO-MVP.md`. Lê esse arquivo + CLAUDE.md + CONTEXT.md + ADR-0015 + issues 0005/0006/0007.
>
> Estado: branch `feat/s1.5-pagina-de-produto-navegavel`, S1.5 TB1 fechado em commit `02224fa`, site navega home → ProductCard → /brincos/<slug> → ProductPage com galeria + CTA toast.
>
> Procede sem pausa: S1.5 TB2 (gallery swipeable) → S1.5 TB3 (RTL integration) → S1.6 (carrinho) → S1.7 (wa.me + /pedido-enviado).
>
> NÃO regerar fotos da peça canônica (Pak aprovou as 3 atuais). NÃO pausar pra HITL exceto erro técnico irrecuperável OU final de slice (mostra entrega, Pak valida 2-3min). Testes 7 camadas mantidos (Lighthouse deferido S6.1).
>
> Quando S1.5 TB2/TB3 + S1.6 + S1.7 fecharem verdes, me apresenta fluxo end-to-end navegável em pnpm dev pra eu validar.

## Notas operacionais

- **Webpack flake recorrente** (Next 15 + Node 24 WasmHash bug) — ataca aleatoriamente. Resolve com: `Remove-Item -Recurse -Force .next, node_modules\.cache; Get-Process node | Stop-Process -Force`. Não é bug do nosso código.
- **`scripts/save-product-photo.mjs`** + **`scripts/save-piloto.mjs`** — utilities pra Higgsfield → WebP + manifest. Reusáveis em S3.1.
- **`scripts/inspect-font.mjs`** — debug ad-hoc de font loading via `document.fonts` API.
- **Tailwind v4 `@theme` auto-ref** — `--font-hero: var(--font-hero)` é circular; classe `font-hero` gerada não funciona. Workaround: `.font-hero` em CSS regular do `globals.css`.
- **`networkidle` Playwright + next/image** = timeout. Helper `prepareForScreenshot` agora aguarda `images.complete` por elemento.

---

**Última atualização**: 2026-05-06 (S1.5 TB1 fechada)
**Próxima sessão deve**: ler esse doc + executar comando acima
