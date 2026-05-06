# ADR-0020 — FAB WhatsApp substitui chatbot Anthropic

- **Status**: aceito
- **Data**: 2026-05-06
- **Decisor**: Pak (com Claude)
- **Slice de origem**: S2.3
- **Supersedes**: ADR-0019 (chatbot Anthropic)

## Contexto

ADR-0019 (S2.2) implementou chatbot Ellen IA via Anthropic API server-side
com prompt caching, catálogo no system prompt, redirecionamento pro WhatsApp
em intenção de compra, fallback gracioso sem chave. UI: FAB bottom-right com
sparkle dourado abrindo drawer de chat.

Pak testou e decidiu **remover o chatbot completamente** em favor de uma
ação mais direta: o mesmo botão flutuante, mas com **ícone WhatsApp**, que
**abre WhatsApp imediatamente** com a mensagem do carrinho já formatada (ou
atendimento geral se carrinho vazio).

Razões da reversão:

1. **Custo zero recorrente**. Chatbot tinha custo Anthropic API por conversa
   (mesmo com prompt caching). FAB WhatsApp é grátis.
2. **Conversão mais direta**. Click no FAB = WhatsApp aberto com mensagem
   pronta. Zero fricção de "explica pra IA o que quero comprar".
3. **Alinhamento com ADR-0010** (atendimento humano via WhatsApp como
   processo único de finalização). Bot ficava como camada intermediária
   redundante.
4. **Simplicidade de manutenção**. Sem env var pra gerenciar, sem chave em
   produção, sem cobrança Anthropic, sem rate-limit a se preocupar.
5. **Sem latência de IA**. WhatsApp abre instantâneo; chatbot tinha
   round-trip + streaming.

## Decisão

**Remover chatbot Ellen IA.** Substituir o FAB por um **botão flutuante
WhatsApp** com o seguinte comportamento:

### Mecânica do FAB

- **Posição**: `position: fixed; bottom: 5; right: 5;` (mesmo lugar do FAB
  do bot anterior — preserva familiaridade visual de quem testou ainda
  no S2.2).
- **Z-index**: 30 (abaixo do CartDrawer 40/50 — quando drawer aberto, FAB
  fica atrás do backdrop).
- **Tap target**: `h-14 w-14` (56x56 px, ≥ Apple HIG 44x44).
- **Ícone**: glyph WhatsApp oficial em SVG inline (sem dependência externa).
- **Cor**: verde WhatsApp `#25D366` no fundo do FAB; ícone branco. Pulse
  sutil opcional pra atrair atenção (ring expansion).

### Comportamento de click

```ts
function onClick() {
  const items = useCart.getState().items;
  if (items.length === 0) {
    window.open("https://wa.link/adq88g", "_blank", "noopener,noreferrer");
    return;
  }
  const { url, pedidoId, subtotalCents } = montarMensagemWhatsApp(items);
  salvarSnapshotPedido(pedidoId, items, subtotalCents);
  window.open(url, "_blank", "noopener,noreferrer");
}
```

- **Carrinho vazio** → `wa.link/adq88g` (atendimento geral).
- **Com itens** → mensagem URL-encoded com itens + subtotal + PED-XXXXXX.
  Snapshot salvo em localStorage `ella-orders-v1`. Carrinho **NÃO é limpo**
  pelo FAB (cliente pode estar testando).

### Diferença com botão "Finalizar pelo WhatsApp" do CartDrawer

- **FAB**: atalho rápido. Não limpa carrinho. Não fecha drawer (drawer
  geralmente fechado quando FAB é clicado).
- **Botão drawer**: finalização explícita. Limpa carrinho + fecha drawer
  (cliente declarou "fechei o pedido").

Ambos chamam o mesmo helper `finalizarPeloWhatsApp(items)` — diferença é a
limpeza opcional pós-redirect.

### Remoção do chatbot

- `app/components/chat/Chatbot.tsx` — deletado
- `lib/chat/store.ts` — deletado
- `lib/chat/system-prompt.ts` — deletado
- `app/api/chat/route.ts` — deletado
- `@anthropic-ai/sdk` — removido das deps
- `useChatbot` import no `CartDrawer` — removido. Botão "Falar com a Ellen
  IA" do drawer removido (deixa só "Finalizar pelo WhatsApp" como CTA único).

## Consequências

- **Site mais leve**: -1 dep, -1 API route, -1 client component, -1 store.
- **Conversão mais previsível**: cliente coloca peças → click FAB → WhatsApp
  abre com mensagem pronta. Zero ambiguidade.
- **Atendimento humano único** (alinhamento com ADR-0010 reforçado).
- **Reversível**: ADR-0019 marcada superseded mas conteúdo preservado. Se
  Pak quiser bot de volta no futuro, base técnica está documentada.
- **Sem latência IA**: WhatsApp abre em ~50ms (mobile share-sheet ou
  desktop tab) vs chatbot que dependia de TTFT do Anthropic + streaming.

## Notas

- Mobile-first preservado: FAB tem tap target 56x56. Não bloqueia conteúdo
  importante na home (posição bottom-right, fora dos cards e CTAs principais).
- Quando CartDrawer abre (mobile fullscreen, desktop right-panel), FAB fica
  atrás do backdrop por z-index — desaparece visualmente sem animação. UX
  ok.
- `data/products.json` continua sendo a fonte de verdade pra mensagem
  WhatsApp via `lib/cart/whatsapp.ts`. Sem mudança no schema.
- ADR-0010 (fluxo wa.me sem bot) continua vigente — esta ADR reforça a
  decisão original.
