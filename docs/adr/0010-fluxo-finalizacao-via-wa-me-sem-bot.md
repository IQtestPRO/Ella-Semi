# ADR-0010 — Fluxo de Finalização via `wa.me` Direto, Sem Bot ou API

- **Status**: aceito
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)

## Contexto

A finalização de compra na ELLA acontece **fora do site**, no aplicativo do WhatsApp da Ellen. Existe um espectro de implementações possíveis:

1. Link `wa.me` puro com `?text=` URL-encoded → cliente envia manualmente, Ellen atende manual.
2. WhatsApp Business API → bot recebe mensagem, registra pedido em backend.
3. Provedores BSP (Z-API, Twilio, 360dialog, Take Blip) → backend integra com WhatsApp via API, automatiza atendimento.
4. Click-to-Chat com pré-preenchimento + agendamento de follow-up via planilha.

Cada nível adiciona infraestrutura, custo e fricção operacional. A Ellen está iniciando o e-commerce e vende casualmente: cada cliente é uma conversa, sem volume hoje que justifique automação.

## Decisão

**Opção 1: link `wa.me` direto, sem bot, sem API, sem BSP. Atendimento 100% manual pela Ellen.**

### Mecânica do clique

1. Cliente clica em "Finalizar pelo WhatsApp" na página `/carrinho`.
2. Site executa, na ordem:
   - Gera `idPedido` no formato `PED-XXXXXX` — 6 caracteres alfanuméricos maiúsculos, **excluindo** `0/O/1/I/L` para reduzir confusão visual ao falar/datilografar.
   - Constrói o `snapshotPedido` (cópia profunda do estado do carrinho na hora) e salva em `localStorage` sob a chave `ella-orders-v1` (apenas leitura local — o backend não existe).
   - Constrói a mensagem formatada (template abaixo).
   - URL-encoda a mensagem.
   - Abre `https://wa.me/<NUMERO_E164>?text=<MENSAGEM_ENCODED>` em **aba nova** (`window.open(..., '_blank')`); em mobile, comportamento padrão `wa.me` redireciona ao app.
   - Redireciona o site (no contexto atual, mesma aba) para `/pedido-enviado/PED-XXXXXX`.
3. Cliente, no WhatsApp, vê a mensagem **já digitada na caixa de input**. Ela aperta enviar manualmente — **o site não envia em nome dela**.
4. Ellen recebe como conversa nova de um número desconhecido (cliente nova) ou em conversa existente (cliente recorrente). Atende manualmente, pede CEP/endereço, confirma frete, confirma forma de pagamento, segue normalmente o fluxo dela.

### Template da mensagem (formato literal, validado em `/grill-with-docs`)

```
Olá, Ellen! Quero finalizar este pedido pelo WhatsApp:

• Colar Veneziana (banho ouro) — R$ 89,90
• Anel Solitário (banho ródio) — tam. 16 — R$ 64,90
• Brinco Argola (banho ouro) × 2 — R$ 99,80
• Cordão Personalizado (gravação "Maria") — sob encomenda — pagamento prévio — R$ 159,90

*Total: R$ 414,50*

Pedido feito pelo site · #PED-A1B2C3
```

Regras de formatação:
- Saudação literal "Olá, Ellen!" (não "Olá!", não "Boa tarde", não "Oi").
- Lista bullet `•` por item.
- Item traz: nome editorial, variantes em parênteses (banho, tamanho, cor, comprimento), `× <qty>` apenas quando `qty > 1`, marcador de sob-encomenda quando `tipoFulfillment === 'sob-encomenda'`, preço em "R$ XX,XX" (vírgula decimal, BRL).
- `*Total*` envolto em asteriscos para render bold no WhatsApp.
- Última linha: `Pedido feito pelo site · #<ID>` — Ellen correlaciona conversa com pedido.
- **Nada de campo CEP** na mensagem — Ellen pede no chat (ADR-0010 reforça regra do briefing: P9 fechada como "frete a combinar pelo WhatsApp").

### Configuração do número

- Variável de ambiente: `NEXT_PUBLIC_WHATSAPP_NUMBER` (formato E.164, ex: `5521987654321`).
- **Slice 1**: placeholder fake `5500000000000`. Site funciona end-to-end, o `wa.me` abre, mas não vai para conta real até a Ellen passar o número.
- Quando Ellen entregar o número real: edita-se a env var no Vercel → redeploy automático → fluxo passa a apontar para a conta dela. **Sem deploy de código** (mesmo padrão da ADR-0007 para `NEXT_PUBLIC_META_PIXEL_ID`).
- **`wa.link/adq88g`** (link curto da bio do Instagram) **não** é usado no fluxo de finalização — esse link é só para o **botão flutuante de atendimento geral** (sem texto pré-preenchido).

### Página `/pedido-enviado/PED-XXXXXX`

Conteúdo:
- **Hero da celebração**: sparkles dourados animados (`MOTION_INTENSITY=8` é mais forte aqui que no resto do site — celebra o funil), fundo rosa salmão da Marca.
- **ID do pedido grande e visível** (tipografia hero da Marca).
- **Mensagem de status**:
  > "Conversa com a Ellen foi aberta no WhatsApp. Se nada abriu, [clique aqui pra abrir manualmente] ou [copie a mensagem]."
- **Resumo do pedido enviado** (lê do `ella-orders-v1` por `idPedido`): lista de itens + total + ID. Para cliente revisar.
- **Ações**:
  - "Continuar comprando" → home.
  - "Esvaziar carrinho" → limpa `ella-cart-v1` e redireciona pra home.
  - **NÃO há "Reabrir WhatsApp"** automático — o link aberto no `[clique aqui pra abrir manualmente]` resolve esse caso (com `target="_blank"` nativo).

### Persistência local

- **`ella-cart-v1`**: estado do carrinho. Persiste 1 sessão (até `clearCart` explícito ou expiração de 30 dias). Se cliente voltar dias depois, o carrinho ainda está lá.
- **`ella-orders-v1`**: array de snapshots de pedidos enviados. Cada entrada: `{ idPedido, itens, total, dataEnvio, mensagemUsada }`. Não expira automaticamente. Cliente pode consultar histórico local. **Não há servidor que armazena isso** — é estado local apenas.

### O que **não** está incluído

- ❌ WhatsApp Business API ou registro de conta business.
- ❌ Provedor BSP (Z-API, Twilio, 360dialog, etc.).
- ❌ Webhook de "pedido enviado" para qualquer backend.
- ❌ Bot de atendimento automático (chatbot, GPT, etc.).
- ❌ Integração com sistema de pagamento (PIX, cartão, boleto).
- ❌ Cálculo de frete via Correios ou similar.
- ❌ E-mail de confirmação para o cliente.
- ❌ Sincronização de pedido com qualquer CRM.

Tudo isso pode entrar em **Fase 2+**, com nova ADR superando ou complementando esta.

## Consequências

- **Custo operacional zero**: não há serviço pago, não há infraestrutura para manter, não há monitoramento.
- **Atendimento humano da Ellen vira diferencial**: tom premium do "warm editorial soft glam" extende-se à conversa pelo WhatsApp. Cliente premium aprecia atendimento humano.
- **Limite claro de escala**: enquanto Ellen atende manual, ~50–80 pedidos/mês é teto razoável. Acima disso, abre-se ADR de Fase 2 com automação.
- **Risco de janela bloqueada do WhatsApp**: cliente que **não envia** a mensagem após `wa.me` abrir não gera pedido. Site não tem como saber. Solução: o snapshot fica em `ella-orders-v1` localmente, então cliente pode reabrir `/pedido-enviado/PED-XXXXXX` e clicar "abrir manualmente".
- **Privacidade**: como não há backend, dados do pedido **só existem no dispositivo do cliente** (`localStorage`) e na conversa do WhatsApp. Sem dado pessoal trafegando para servidor da Ella. Reforça LGPD-friendly da ADR-0007.
- **Cliente recorrente**: Ellen consegue ver no histórico do WhatsApp dela todas as conversas anteriores com aquele número, casando com o ID do pedido. Sem CRM, mas funcional para o volume atual.

## Notas

- O **separador alfanumérico** do ID (`PED-XXXXXX`) deve ser implementado com cuidado: `crypto.getRandomValues()` + filtro do conjunto permitido (sem 0/O/1/I/L). 6 chars do conjunto reduzido (~30 chars) dão ~7 × 10⁸ combinações — colisão local desprezível.
- O **`atualizadoEm`** do `CampanhaAtual` (ADR-0004) **não** é alterado por finalização de pedido — pedido é cliente-side, campanha é editorial.
- Mensagem do WhatsApp tem **limite prático** (não documentado oficialmente, mas ~3500 caracteres antes de a interface começar a truncar). Para carrinhos muito grandes (~30+ itens), eventualmente truncar a lista e adicionar "...e mais X itens. Detalhes no ID #PED-XXXXXX." Pendência de borda — improvável na prática para Ella, mas registrar.
- Esta ADR **substitui** qualquer interpretação anterior do briefing inicial sobre integração WhatsApp Business API.
