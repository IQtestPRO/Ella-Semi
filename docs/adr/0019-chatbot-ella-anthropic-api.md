# ADR-0019 — Chatbot ELLA via Anthropic API server-side

- **Status**: aceito
- **Data**: 2026-05-06
- **Decisor**: Pak (com Claude)
- **Slice de origem**: S2.2

## Contexto

Pak pediu chatbot dentro do site pra conversar sobre semijoias da ELLA, tirar
dúvidas (banho, peças, cuidados) e **redirecionar compras pro WhatsApp**. Bot
deve "saber de cada coisa" do catálogo + ter capacidade de pesquisar na
internet quando precisar.

Opções avaliadas:

1. **Bot rule-based local** (sem AI). Rejeitada — não cobre "saber de cada
   coisa" nem pesquisa na internet.
2. **OpenAI / GPT-4**. Rejeitada — projeto já adota Anthropic via Claude Code
   (consistência), e Claude Sonnet 4.6 tem web search nativo.
3. **Anthropic API server-side** (route Next.js). ✅ Escolhida.

## Decisão

### 1. Modelo e tools

- **Modelo**: `claude-sonnet-4-6` (knowledge cutoff Jan 2026, fits domínio
  joalheria contemporânea).
- **Tool**: `web_search` (Anthropic nativo) pra dúvidas técnicas que precisam
  pesquisa (ex: "como cuidar de banho de ouro?", "diferença entre semijoia e
  bijuteria?").
- **Streaming**: SSE pra UI responsiva.
- **Prompt caching**: system prompt + catálogo passam por
  `cache_control: ephemeral` — economiza tokens em conversas longas e cobra
  apenas a delta da pergunta do usuário. Knowledge cutoff: ~5min TTL do cache.

### 2. Arquitetura

```
[Cliente] → fetch /api/chat (POST stream)
              ↓
      [API route Next.js]
              ↓
      Anthropic SDK (server-side, env ANTHROPIC_API_KEY)
              ↓ stream chunks
      [Cliente render mensagem do bot]
```

- **Chave**: `ANTHROPIC_API_KEY` em env var **server-only** (NUNCA prefixada
  com `NEXT_PUBLIC_`). Sem chave configurada, API responde 503 e UI mostra
  fallback "Falar com a Ellen direto pelo WhatsApp" como CTA primário.
- **Sem persistência**: conversa vive no Zustand runtime (não-persistido).
  Some quando o cliente fecha a aba. LGPD-friendly por design.
- **Rate limit**: a fazer em fase posterior se necessário (cache nesta slice
  é a defesa primária; rate-limit pode ser middleware Vercel).

### 3. System prompt — pilares

O system prompt (em `lib/chat/system-prompt.ts`) injeta:

- **Identidade**: persona "Ellen IA — assistente da ELLA Semijoias", calorosa,
  warm editorial, registra que é IA mas alinhada com a Ellen real.
- **Catálogo**: dump compacto JSON de todas peças ativas (slug, nome,
  categoria, preço, banho, tipo, sob-encomenda flag) — passa em system prompt
  com cache_control. Atualiza a cada deploy.
- **Regras inegociáveis**:
  1. **Sempre redirecionar pra WhatsApp** quando cliente expressa intenção de
     compra. CTA inline na resposta: "Posso te conectar com a Ellen pelo
     WhatsApp pra fechar o pedido?" + link `wa.link/adq88g`.
  2. **Nunca prometer preço fora do catálogo** — preços vivem em
     `data/products.json` e só esses valem.
  3. **Nunca prometer prazo de entrega** — frete combina pelo WhatsApp
     (ADR-0010).
  4. **Recomendar peças por slug** (não por descrição livre) pra cliente
     conseguir clicar e ver na rota `/[categoria]/[slug]`.
  5. **Tom**: warm editorial soft glam, calmo, premium, não-vendedor-agressivo.
- **Anti-prompts**: não falar mal de concorrente, não dar conselho jurídico,
  não inventar política de troca (refletir ADR-0011 + FAQ).

### 4. Fluxo "redirecionar pra WhatsApp"

Quando o cliente diz "quero comprar" / "vou levar":

- Bot sugere botão claro **"Falar com a Ellen WhatsApp"** linkando
  `wa.link/adq88g` ou (se houver itens no carrinho) `wa.me/<numero>?text=...`
  com a mensagem montada via `lib/cart/whatsapp.ts`.
- Bot **fecha** a conversa graciosamente: "Vai ser ótimo te ver lá. Qualquer
  coisa, me chama de novo."
- UI do Chatbot detecta links `wa.me|wa.link` em mensagens do bot e
  renderiza-os como **botão estilizado** em vez de link cru.

### 5. Custo + ativação

- Sem teto de créditos no projeto (ADR-0001), mas chatbot é a **primeira
  feature recorrente em custo** — anterior era one-shot generation.
- Bot é **opcional via env var**: se `ANTHROPIC_API_KEY` não está setado, o
  componente Chatbot fica visível mas em modo "indisponível" — botão
  redireciona direto pra `wa.link/adq88g`. Sem deploy de código pra ativar
  (mesmo padrão `NEXT_PUBLIC_META_PIXEL_ID`, ADR-0007).
- Pak decide quando ativar plugando a chave em Vercel env.

## Consequências

- **Cliente tira dúvidas 24/7** mesmo se Ellen não estiver no WhatsApp na
  hora.
- **Conversão pro WhatsApp** é o objetivo único do bot — não substitui
  atendimento humano, prepara a entrada.
- **Custo recorrente Anthropic** — Pak monitora via console.anthropic.com.
- **Sem persistência de conversa** — LGPD trivial; não há dado pessoal
  acumulado.
- **Catálogo no system prompt + cache** — aumenta token usage por chamada,
  mas cache torna a 2ª+ pergunta de cada sessão barata.
- **Web search ativo** — bot pode procurar respostas que não tem no system
  prompt (ex: tendências, cuidados específicos, comparações editoriais).
  Custo extra por search.

## Notas

- ADR-0001 já cobre política Higgsfield (qualidade prevalece). Anthropic API
  cai sob mesma filosofia: prefere modelo mais capaz ao mais barato.
  Sonnet 4.6 ≫ Haiku pra essa task.
- ADR-0007 estabeleceu padrão "feature opcional via env var". Esta ADR aplica
  o mesmo padrão pra chatbot.
- ADR-0010 fluxo wa.me sem bot continua válido — o "bot" desta ADR é IA, não
  o bot WhatsApp Business API que ADR-0010 vetou.
- Componente Chatbot tem feature flag explícita pra MOSTRAR/ESCONDER —
  default `true` se `ANTHROPIC_API_KEY` configurada.
