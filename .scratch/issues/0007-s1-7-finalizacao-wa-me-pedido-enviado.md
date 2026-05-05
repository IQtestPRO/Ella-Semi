---
title: "S1.7 — Finalização wa.me + /pedido-enviado/PED-XXXXXX"
labels: [needs-triage, slice-1]
type: AFK
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0005, 0009, 0010, 0013]
user_stories: [15, 16, 17, 18, 25, 26, 27]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

Implementar 3 módulos profundos:

- **`WhatsApp Message Builder`** (pure function): `buildMessage(cart): string` montando o template canônico de **ADR-0010**:
  - Saudação literal "Olá, Ellen!"
  - Lista bullet `•` por item: nome editorial + variantes em parênteses (banho, tamanho, comprimento) + `× <qty>` apenas se >1 + sufixo " — sob encomenda — pagamento prévio" se `tipoFulfillment === 'sob-encomenda'` + preço "R$ XX,XX"
  - `*Total: R$ XX,XX*` com asteriscos pra bold no WhatsApp
  - Última linha: `Pedido feito pelo site · #<idPedido>`
- **`WhatsApp Link Builder`**: `buildWaMeUrl(message, phoneE164): URL` que URL-encoda e monta `https://wa.me/<E.164>?text=<encoded>`.
- **`Order`**: `generateOrderId()` → `PED-XXXXXX` (6 chars alfanuméricos maiúsculos, **excluindo** `0/O/1/I/L`, via `crypto.getRandomValues()`); `recordSnapshot(snapshot)` em `localStorage["ella-orders-v1"]`; `getSnapshotById(id)`.

CTA "Finalizar pelo WhatsApp" no CartPage agora é funcional: gera idPedido → monta mensagem → salva snapshot em `ella-orders-v1` → abre `wa.me/<NEXT_PUBLIC_WHATSAPP_NUMBER>?text=<encoded>` em **aba nova** via `window.open(url, '_blank')` → redireciona pra `/pedido-enviado/<idPedido>`.

Rota dinâmica `/pedido-enviado/[idPedido]`:

- **`OrderSentPage`**: sparkles dourados de celebração (motion mais forte — neste momento sobe a 10), ID grande em fonte hero, mensagem de status "Conversa com a Ellen foi aberta no WhatsApp. Se nada abriu, [clique aqui pra abrir manualmente] ou [copie a mensagem].", lista resumida do pedido (lê de `ella-orders-v1` por idPedido), botões "Continuar comprando" (→ home) e "Esvaziar carrinho" (limpa `ella-cart-v1` + redireciona).
- Fallback "[abrir manualmente]" reconstrói a `wa.me` URL e abre.
- Fallback "[copiar mensagem]" usa Clipboard API.

Env var `NEXT_PUBLIC_WHATSAPP_NUMBER` com placeholder `5500000000000` durante Slice 1; real entra em S6.1 sem deploy de código.

## Acceptance criteria

- [ ] **Módulo `WhatsApp Message Builder`** com unit tests + **snapshot test** `toMatchSnapshot()` com fixture canônica de cart com 4 itens (incluindo 1 sob-encomenda); snapshot committado, formato exato do template ADR-0010 preservado
- [ ] **Módulo `WhatsApp Link Builder`** com unit tests: encoding correto, caracteres especiais preservados (•, asteriscos, ×, acentos), URL válida, `wa.me/<E.164>` formato
- [ ] **Módulo `Order`** com unit tests: `generateOrderId` (6 chars, sem `0/O/1/I/L`, alfanumérico maiúsculo, ~10⁸ entropia, sem colisão em 1000 gerações local), `recordSnapshot` em `ella-orders-v1`, `getSnapshotById` (retorna snapshot ou null)
- [ ] CTA "Finalizar pelo WhatsApp" em `/carrinho` agora gera idPedido + abre `wa.me` + redireciona pra `/pedido-enviado/[id]` (end-to-end)
- [ ] Rota `/pedido-enviado/[idPedido]` renderiza `OrderSentPage`: ID grande, sparkles celebration, fallback "[abrir manualmente]" (link `wa.me` re-construído) + "[copiar mensagem]" (Clipboard API), lista do pedido
- [ ] "Esvaziar carrinho" limpa `ella-cart-v1` + redireciona pra home
- [ ] "Continuar comprando" redireciona pra home (mantém cart se houver)
- [ ] Reload em `/pedido-enviado/[id]` recupera snapshot de `ella-orders-v1` e re-renderiza pedido
- [ ] Integration test `OrderSentPage`: snapshot existe → renderiza; snapshot não existe → estado de erro
- [ ] **E2E completo da Slice 1** (fluxo crítico): home → produto canônico → adicionar carrinho → /carrinho → finalizar → window.open mockado verifica URL `wa.me` correta com mensagem encoded → redirect /pedido-enviado/PED-XXXXXX → ID exibido + sparkles renderizam
- [ ] Visual regression baselines (mobile + desktop) de `/pedido-enviado` (com fixture de pedido conhecido; sparkles com `mask:` no test mode)
- [ ] A11y axe sem violações
- [ ] Lighthouse ≥ 95
- [ ] `taste-skill (minimalist-ui)` + `emil-design-eng` aplicadas (sparkles celebration motion ≤300ms easing custom; `prefers-reduced-motion` respeitado)
- [ ] CONTEXT.md inalterado

## Blocked by

- #0006 (S1.6 Carrinho funcional)
