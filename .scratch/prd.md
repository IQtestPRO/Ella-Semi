---
title: PRD — Site ELLA Semijoias (Catálogo + Carrinho + Finalização WhatsApp)
labels: [needs-triage, feature]
created: 2026-05-05
status: open
adrs_referenced: [0001, 0002, 0003, 0004, 0005, 0006, 0007, 0008, 0009, 0010, 0012, 0013]
---

# PRD — Site ELLA Semijoias

## Problem Statement

Ellen Lopes vende joias e semijoias premium hoje **só pelo Instagram** (`@ella_usasemijoias`). O Instagram é canal de descoberta, mas:

- **Catálogo é escondido** dentro de stories e posts — cliente não consegue navegar peças por categoria, filtrar por banho, ou comparar preços de forma fluida.
- **Apresentação visual é fraca** comparada a marcas-referência (Mejuri, Catbird, Sézane). Foto improvisada quebra a percepção de "joia premium" mesmo quando a peça é boa.
- **Conversão é ~zero por descoberta orgânica** — cliente que descobre via Reels manda DM perguntando preço/disponibilidade, e a Ellen responde manualmente uma a uma.
- **Atendimento por DM cansa**: mesmas perguntas (preço, banho, prazo de entrega, troca, frete) repetidas por cliente diferente todo dia.
- **Sem domínio próprio**, a marca não constrói credibilidade nem aparece em busca orgânica do Google. Ela é "uma das mil lojas de joia no Instagram".

A Ellen quer **vender mais**, mas sem entrar em complexidade de e-commerce tradicional (gateway de pagamento, estoque automatizado, login de cliente, e-mail transacional, bot de WhatsApp). O atendimento humano dela é diferencial, não bug.

## Solution

Site-catálogo premium, **mobile-first**, hospedado na Vercel, ligado na bio do Instagram. **Sem checkout no site** — toda venda termina no WhatsApp da Ellen com mensagem pré-preenchida (template fixo, link `wa.me?text=`). Atendimento humano dela continua sendo o diferencial.

A apresentação visual é **a feature** do site:

- **Identidade Atemporal da Marca ELLA** (rosa salmão da logo + serif Didone-ish + sparkles dourados + "perna alongada do A" como assinatura) coerente em todas as páginas.
- **Pipeline visual único via Higgsfield CLI** (ADR-0006): toda foto/vídeo do site nasce do Higgsfield (Nano Banana Pro pra produto, Soul + Soul Character "Modelo Ella" pra peça em uso, Cinema Studio pra hero/Campanha). Sem stock, sem mistura.
- **Política "qualidade prevalece sobre economia" no Higgsfield** (ADR-0001): sem teto de créditos. Cinema Studio em hero é default, não exceção. Drift visual entre páginas é arquitetonicamente impossível.
- **Catálogo enxuto sem CMS** (JSON versionado em `data/products.json` + `data/campanha-atual.json`, ADR-0004) que permite a Ellen iterar sem servidor.
- **Campanha Atual** (Outono 2026 no lançamento) é uma seção sazonal alimentada por **um arquivo único**, sem histórico, sem rotas dinâmicas — trocar = editar 1 JSON + gerar mídia nova.
- **Carrinho local** (localStorage versionado `ella-cart-v1`) sem necessidade de conta.
- **Finalização via `wa.me` direto, sem bot, sem API, sem BSP** (ADR-0010). Ellen recebe a mensagem como conversa nova/recorrente, atende manualmente.

A primeira impressão do site **é o ponto único de conversão** — o "uau" precisa acontecer no scroll inicial.

## User Stories

### Cliente final (mulher madura, ~45–50, brasileira, descobriu pelo Instagram)

1. Como cliente que clica no link da bio do Instagram da Ellen no celular, quero ver imediatamente o nome da marca, o tom premium e uma chamada visual forte, para confirmar que cheguei no lugar certo e não em uma loja qualquer.
2. Como cliente, quero entender em 3 segundos que esta marca vende joias bonitas e que pareço a mulher que usaria essas peças, para sentir que pertenço a esse universo.
3. Como cliente que rola a home, quero ver a Campanha Atual em destaque (Outono 2026) com um manifesto curto e peças destaque, para conhecer a "cara" desta estação.
4. Como cliente, quero clicar em "Ver peças desta estação" e ir direto pro catálogo da campanha, para não perder tempo procurando.
5. Como cliente que rola mais a home, quero ver uma seleção curatorial de peças favoritas da marca, para ter um filtro humano antes de abrir o catálogo cheio.
6. Como cliente que rola até o fim da home, quero entender quem é a Ellen em 2 frases e como funciona a compra (3 passos: escolha → carrinho → WhatsApp), para reduzir ansiedade de "não tem checkout? funciona como?".
7. Como cliente que clica em uma peça, quero abrir uma página de produto com 3 fotos da peça (em ambiente, em detalhe macro, sendo usada por uma modelo), para visualizar a peça sob ângulos suficientes pra decidir.
8. Como cliente, quero deslizar entre as 3 fotos com gesto natural no celular (swipe), para navegar fluidamente sem botões pequenos.
9. Como cliente, quero ver o nome editorial da peça, preço grande, descrição rica (origem, banho, dimensões, peso, garantia) e variantes (tamanho de anel, comprimento de colar, banho), para ter todas as informações antes de decidir.
10. Como cliente em peça com variante, quero escolher o tamanho/comprimento/banho e ver o preço atualizar (se a variante muda preço), para confirmar exatamente o que vou comprar.
11. Como cliente em peça **sob encomenda** (`tipoFulfillment: 'sob-encomenda'`), quero ver um aviso claro mas não alarmante ("Sob encomenda — pagamento prévio. Confirmamos prazo no WhatsApp.") na página da peça e no carrinho, para não me surpreender depois.
12. Como cliente que decidiu, quero clicar em um CTA grande sticky no rodapé do mobile ("Adicionar ao carrinho · R$ XX,XX") com microinteração de sparkle, para ter feedback tátil/visual da escolha.
13. Como cliente, quero abrir o carrinho e ver foto pequena, nome, variante, preço unitário, qty (com +/−) e botão remover por linha, para revisar e ajustar antes de finalizar.
14. Como cliente, quero ver o subtotal e total no carrinho com tipografia da marca, para entender o gasto antes de continuar.
15. Como cliente, quero clicar em "Finalizar pelo WhatsApp" e ser levada direto pra conversa com a Ellen com a mensagem **já digitada** na caixa de input do WhatsApp, para só apertar enviar.
16. Como cliente, quero que a mensagem do WhatsApp tenha formato bonito (saudação calorosa "Olá, Ellen!", lista bullet das peças com variantes e preços, total em bold, ID do pedido `PED-XXXXXX`), para parecer mensagem profissional, não amadorística.
17. Como cliente que clicou no CTA mas o WhatsApp não abriu (problema de browser/mobile), quero estar em uma página `/pedido-enviado/PED-XXXXXX` com sparkles douradas de celebração, ID grande visível, e dois fallbacks: "[abrir manualmente no WhatsApp]" e "[copiar mensagem]", para conseguir finalizar mesmo se a abertura automática falhou.
18. Como cliente que recarregou a página de pedido enviado dias depois, quero conseguir ver o ID do pedido e o resumo do que enviei, para confirmar com a Ellen ("qual era o `PED-A1B2C3` que mandei?").
19. Como cliente que voltou ao site dias depois, quero que meu carrinho ainda esteja salvo (localStorage), para continuar de onde parei sem ter que adicionar tudo de novo.
20. Como cliente que abriu o site pela primeira vez, quero ver um banner discreto pedindo aceite/recusa de cookies de marketing, com link pra `/privacidade`, para ter controle sobre meus dados sem ser bombardeada.
21. Como cliente que recusou cookies, quero que o site continue funcionando 100% (Plausible cookie-less roda; Meta Pixel não dispara), para não ser punida por minha escolha de privacidade.
22. Como cliente que quer falar com a Ellen sem comprar, quero ver um botão flutuante de WhatsApp no canto inferior, levando ao link curto `wa.link/adq88g` (atendimento geral, sem texto pré-preenchido), para tirar dúvidas rápidas.
23. Como cliente em qualquer página, quero ver um footer rico com links pra Instagram, sobre, como comprar, política de troca, FAQ, contato, privacidade, para ter onde explorar se quiser entender a marca.
24. Como cliente em conexão 4G lenta, quero que o site carregue rápido (LCP ≤ 2.0s) com layout estável (CLS ≤ 0.05) e responsivo (INP < 200ms), para não desistir antes do "uau" aparecer.

### Ellen Lopes (fundadora, atendimento manual)

25. Como Ellen, quero receber pedidos do site no meu WhatsApp como conversas normais, com mensagem **já formatada** (peças, preços, total, ID), para não precisar perguntar "o que você quer?".
26. Como Ellen, quero saber o ID do pedido (`PED-XXXXXX`) na mensagem, para correlacionar conversas com pedidos quando a cliente perguntar de novo dias depois.
27. Como Ellen, quero ver na mensagem se algum item é sob encomenda (sufixo "sob encomenda — pagamento prévio") **antes** de abrir conversa, para já saber que precisa confirmar prepay.
28. Como Ellen, quero pedir CEP e endereço **no chat** (não no site), para manter atendimento humano e flexibilidade negocial caso por caso.
29. Como Ellen, quero conseguir trocar a Campanha Atual editando **um único arquivo JSON** + gerando mídia nova (sem refactor de código), quando lançar Inverno 2026 ou outras estações.
30. Como Ellen, quero que o pixel do Instagram (Meta Pixel) ative no site assim que eu passar o ID, sem novo deploy de código (env var no Vercel), para começar retargeting quando estiver pronta.
31. Como Ellen, quero que o número do WhatsApp da loja entre no site da mesma forma (env var) quando eu confirmar o E.164, sem deploy, para o site nascer já apontando pro meu número certo.
32. Como Ellen, quero que o domínio `ellasemijoias.com.br` (ou o que escolhermos) entre quando eu comprar, sem refazer o site, para ter URL profissional na bio do Instagram.
33. Como Ellen, quero que o site mostre a Modelo Ella (mulher 45–50, morena, elegante warm-editorial) usando peças do meu jeito, **não** uma modelo plástica genérica de stock, para que cliente reconheça o tom da marca.
34. Como Ellen, quero conseguir editar texto de manifesto, política de troca, FAQ, sem precisar de deploy de código (MDX em `content/`), para corrigir/atualizar texto livremente.

### Pak (desenvolvedor solo)

35. Como Pak, quero rodar `pnpm test` localmente e ver unit tests + integration tests passarem em <30s, para iterar rápido em cada feature.
36. Como Pak, quero que CI rode E2E + visual regression + a11y + perf budget em cada PR, para não mergear regressão silenciosa.
37. Como Pak, quero ter cada decisão arquitetural significativa em ADR (`docs/adr/`), para abrir contexto rápido em sessões futuras do Claude Code.
38. Como Pak, quero que toda mídia gerada pelo Higgsfield seja registrada em `assets/generated/manifest.json` com prompt + modelo + seed + camada, para ser reproducível e auditável.
39. Como Pak, quero processar o catálogo PDF da Ellen em uma etapa explícita **entre** `/to-issues` e `/tdd` Slice 1 (não dentro do TDD), para separar trabalho de dado de trabalho de código.
40. Como Pak, quero que o relatório do processamento do PDF liste peças com foto-fonte questionável, peças que parecem masculinas, peças sob encomenda detectadas, para revisar caso a caso antes do batch Higgsfield.
41. Como Pak, quero que o Soul Character "Modelo Ella" seja treinado uma vez (8–12 calibrações) com `reference_id` persistido em `data/higgsfield-references.json`, para reutilizar em todas as ~270–360 fotos do catálogo sem drift.
42. Como Pak, quero que cada slice subsequente seja issue independente vertical (entrega valor end-to-end), para deploy incremental na Vercel sem big-bang final.

## Implementation Decisions

### Arquitetura geral

- **Stack** (ADR-0005): Next.js 15 App Router + Tailwind v4 + Motion + Zustand persist + Vercel Image + Vercel Blob (vídeos) + Google Fonts via `next/font` + Node 22 LTS + TS strict + pnpm.
- **Estrutura de dados** (ADR-0004): `data/products.json` + `data/campanha-atual.json` versionados em git. Schema simples sem entidade Coleção. Slug atemporal. URL `/campanha` fixa, não dinâmica.
- **Pipeline visual único** (ADR-0006): Higgsfield CLI exclusivo. Foto real da Ellen pode ser **input** de bg-swap, nunca asset cru publicado. Stock photos, Midjourney, etc. proibidos.
- **Identidade visual atemporal**: rosa salmão `~#F5C5B6` (amostrar do `assets/brand/logo.jpg`) + dourado mostarda `~#D4A24A` + serif Didone-ish (DM Serif Display / Bodoni Moda / Italiana — definir no Brand Reference Pack via comparação visual contra logo) + sans-serif (Inter ou Söhne) + sparkles SVG inline + "perna alongada do A".

### Módulos profundos (com unit test cobrindo cada um)

| Módulo | Responsabilidade | API pública |
|---|---|---|
| **Cart** | Estado do carrinho + persistência `ella-cart-v1` | `addToCart`, `removeFromCart`, `updateQuantity`, `clearCart`, `getCart`, `subscribe` |
| **Order** | Geração `PED-XXXXXX`, snapshot em `ella-orders-v1`, lookup por ID | `generateOrderId`, `recordSnapshot`, `getSnapshotById` |
| **WhatsApp Message Builder** | Constrói texto literal da mensagem (template ADR-0010) | `buildMessage(cart): string` |
| **WhatsApp Link Builder** | Constrói `wa.me/<E.164>?text=<urlencoded>` | `buildWaMeUrl(message, phoneE164): URL` |
| **Product Catalog** | Lê JSONs em build, expõe queries tipadas | `getAllProducts`, `getProductBySlug`, `getProductsByCategory`, `getCampanhaAtual`, `getProductsDestaque` |
| **Analytics** | Fan-out condicional Plausible + Meta Pixel | `trackEvent(name, payload)` |
| **Consent** | Estado de cookie consent | `getConsent`, `setConsent`, `subscribe` |
| **Currency Format** | `precoCents → "R$ XX,XX"` BRL | `formatBRL(cents): string` |
| **Slug & Routing** | Slugify, validação, mapeamento categoria↔rota | `slugify`, `isValidProductSlug`, `categoryFromSlug` |
| **Validation** | Validação de carrinho antes de finalizar (qty>0, produto ativo, slug existente, sem órfãos) | `validateCartBeforeFinalize(cart, catalog): { valid, errors }` |

### Componentes UI (consumem módulos profundos)

- Home: `HomeHero`, `CampaignSection`, `FeaturedProducts`, `AboutShort`, `FooterRich`
- Produto: `ProductGallery` (swipeable mobile), `ProductHeader`, `ProductDescription`, `ProductVariantSelector`, `ProductStickyCTA`, `SobEncomendaNotice`
- Carrinho: `CartPage`, `CartLine`, `CartSummary`, `EmptyCartState`
- Pedido enviado: `OrderSentPage` (sparkles celebration), `OrderSentSummary`, `OrderSentFallbacks`
- Globais: `Header`, `Footer`, `Sparkles` (SVG animado), `WhatsAppFloatingButton`, `CookieBanner`

### Schema de dados (ADR-0004 + ADR-0009)

`Product`:
```ts
type Product = {
  slug: string;
  nome: string;
  categoria: 'colares' | 'aneis' | 'brincos' | 'pulseiras' | 'conjuntos'
           | 'gargantilhas' | 'tornozeleiras' | 'piercings' | 'outros';
  banho: 'ouro' | 'prata' | 'rodio' | 'ouro-rose' | 'a-confirmar';
  tipo: 'semijoia' | 'bijuteria';
  precoCents: number;
  precoPromocionalCents?: number;
  descricao: string;
  fotos: Array<{ url; alt; fonte; width; height }>;
  variantes?: Array<{ tipo; opcoes: Array<{ rotulo; precoCentsAjuste? }> }>;
  tags?: string[];
  promocao: boolean;
  tipoFulfillment: 'pronta-entrega' | 'sob-encomenda';
  destaqueHome: boolean;
  ativo: boolean;
  origem?: { catalogoArquivo; pagina; letra };
  cadastradoEm: string;
  atualizadoEm: string;
};
```

`CampanhaAtual` (arquivo único, sem histórico):
```ts
type CampanhaAtual = {
  slug: string;
  nomeExibicao: string;
  manifesto: string;
  heroVideo?: string;
  heroImagem?: string;
  ctaTexto: string;
  produtosDestaqueSlugs: string[];
  ativa: boolean;
  atualizadoEm: string;
};
```

### Persistência local (cliente)

- `localStorage["ella-cart-v1"]` — Cart serializado com schema versionado.
- `localStorage["ella-orders-v1"]` — Array de snapshots de pedidos enviados (para fallback "qual era o `PED-A1B2C3`?").
- `localStorage["ella-consent"]` — `'marketing' | 'essential-only'`. Default antes de decisão = `essential-only`.

### Variáveis de ambiente (padrão "feature opcional via env var", ADR-0007)

| Env var | Slice 1 default | Comportamento se vazia |
|---|---|---|
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | `5500000000000` (placeholder fake) | `wa.me` abre conta inexistente, fluxo testável |
| `NEXT_PUBLIC_META_PIXEL_ID` | (vazio) | Pixel não-renderizado, no-op completo |
| `NEXT_PUBLIC_TIKTOK_PIXEL_ID` | (não criada na Slice 1) | — |
| `NEXT_PUBLIC_PLAUSIBLE_DOMAIN` | `vercel.app subdomain` ou domínio real | Plausible aponta ao domínio configurado |

### Mensagem WhatsApp — template canônico (ADR-0010)

```
Olá, Ellen! Quero finalizar este pedido pelo WhatsApp:

• Colar Veneziana (banho ouro) — R$ 89,90
• Anel Solitário (banho ródio) — tam. 16 — R$ 64,90
• Brinco Argola (banho ouro) × 2 — R$ 99,80
• Cordão Personalizado (gravação "Maria") — sob encomenda — pagamento prévio — R$ 159,90

*Total: R$ 414,50*

Pedido feito pelo site · #PED-A1B2C3
```

Snapshot test do `WhatsApp Message Builder` valida formato exato.

### ID de pedido — `PED-XXXXXX`

- 6 caracteres alfanuméricos maiúsculos.
- **Excluir** `0/O/1/I/L` para reduzir confusão visual.
- Gerado via `crypto.getRandomValues()` + filtro do conjunto permitido (~30 chars).

### Pipeline de mídia (ADR-0006 + ADR-0008 + ADR-0012)

- **3 fotos por peça uniforme** (Foto 1: peça em ambiente foco-produto / Foto 2: peça em ambiente foco-detalhe / Foto 3: Modelo Ella usando — adaptado por categoria).
- **Modelos Higgsfield**: Nano Banana Pro (Foto 1, 2 + bg-swap), Soul + Soul Character "Modelo Ella" (Foto 3), Cinema Studio (hero da Marca, hero da Campanha), Seedance 2.0 (microvídeos).
- **Soul Character "Modelo Ella"** (ADR-0012): persona definitiva (mulher ~45–50, morena, warm-editorial soft glam) treinada uma vez, `reference_id` persistido, anti-drift check a cada 20 peças.
- **Manifest** (`assets/generated/manifest.json`) registra cada geração com `camada` ("atemporal" | "sazonal" | "por-peca"), modelo, prompt, seed, data, slug da peça (se aplicável).

### Etapa de dados — Processamento do catálogo PDF

**Entre `/to-issues` e início do `/tdd` da Slice 1**, Pak cola prompt dedicado para o processamento do catálogo:

- Input: `assets/brand/catalogo-outono-2026.pdf` (24 páginas, 31MB).
- Outputs: `data/products.json` (~90–120 peças), `data/campanha-atual.json` (Outono 2026 + 6–10 destaques), assets de referência rasterizados em `assets/brand/source-pdf-pages/`, relatório `.scratch/processamento-catalogo-2026-05-XX.md`.
- Não é módulo runtime. Não tem unit tests. Saída humana-revisada antes da Slice 1 começar.

## Testing Decisions

### O que faz um bom teste

- Testa **comportamento externo**, não detalhe de implementação. Evita assertions sobre estrutura interna de objetos privados ou ordem de chamadas internas.
- Usa **fixtures realistas** (peça canônica, cart canônico, snapshot de pedido conhecido) em `tests/fixtures/`, compartilhadas entre unit/integration/E2E.
- Falha quando comportamento muda; passa quando refator preserva comportamento.
- **Snapshot tests só para conteúdo literal canônico** (mensagem WhatsApp, layout visual de página). Não snapshot de DOM aleatório.

### Pirâmide de testes (ADR-0013, política inegociável)

#### Camada 1 — Unit tests (Vitest) em todos os módulos profundos
- `Cart`, `Order`, `WhatsApp Message Builder`, `WhatsApp Link Builder`, `Product Catalog`, `Analytics`, `Consent`, `Currency Format`, `Slug & Routing`, `Validation`.
- Coverage alvo: branches críticas (≥ 90% para módulos profundos puros).
- Roda em `pnpm test` localmente + cada PR no CI.

#### Camada 2 — Snapshot test específico da mensagem WhatsApp
- `WhatsApp Message Builder` ganha um teste `toMatchSnapshot()` com fixture canônica.
- Snapshot inicial committado. Atualização exige `vitest -u` + revisão visual no PR.

#### Camada 3 — Integration tests (RTL + msw)
- `CartPage`, `ProductPage`, `OrderSentPage`.
- Mock de `window.open` para validar URL `wa.me` montada.
- msw para mockar fetches externos quando aparecerem.

#### Camada 4 — E2E Playwright (1 fluxo crítico na Slice 1)
- `home → produto destaque → 3 fotos carregam → adicionar carrinho → finalizar → window.open com URL correta + redirect /pedido-enviado/PED-XXXXXX → ID exibido + sparkles renderizam`.
- Cada slice subsequente adiciona ao E2E **só se introduzir fluxo crítico novo** (Slice 4: Campanha → produto; Slice 3: busca/filtro → produto).

#### Camada 5 — Visual Regression (Playwright Screenshot)
- Páginas iniciais: home, produto, carrinho, pedido-enviado (em mobile 375×667 + desktop 1280×800).
- Threshold: **0.1% pixel diff** (ajustável via ADR).
- Regiões dinâmicas (sparkles animados, vídeo) recebem `mask:` ou primeiro frame estático em modo de teste.
- Snapshots baseline committados; atualização revisada visualmente no PR.

#### Camada 6 — Acessibilidade (`@axe-core/playwright`)
- Cada página rodada via Playwright passa por axe.
- Tags: `wcag2a`, `wcag2aa`. Violações falham PR.
- Exceções pontuais exigem ADR (sem "warning ignorado").

#### Camada 7 — Performance budget (`@lhci/cli`)
- Budget Slice 1 (mobile 4G slow simulado): **LCP ≤ 2.0s**, **CLS ≤ 0.05**, **INP < 200ms**, **Lighthouse mobile score ≥ 95**.
- Budget falha → PR bloqueado.

### Prior art

Não há código existente neste repo (greenfield). Templates iniciais saem de `vitest --init`, `playwright codegen`, `@axe-core/playwright README`, `@lhci/cli sample config`. Fixtures de cart/order/products construídas durante Slice 1 e reutilizadas a partir daí.

### Cobertura por módulo (resumo)

| Módulo | Unit | Snapshot | Integration | E2E | Visual | A11y | Perf |
|---|---|---|---|---|---|---|---|
| Cart | ✅ | — | ✅ via CartPage | ✅ | — | — | — |
| Order | ✅ | — | ✅ via OrderSentPage | ✅ | — | — | — |
| WhatsApp Message Builder | ✅ | ✅ | — | ✅ (URL gerada) | — | — | — |
| WhatsApp Link Builder | ✅ | — | — | ✅ | — | — | — |
| Product Catalog | ✅ | — | ✅ via ProductPage | ✅ | — | — | — |
| Analytics | ✅ | — | ✅ via CookieBanner + páginas | — | — | — | — |
| Consent | ✅ | — | ✅ via CookieBanner | — | — | — | — |
| Currency Format | ✅ | — | — | — | — | — | — |
| Slug & Routing | ✅ | — | — | — | — | — | — |
| Validation | ✅ | — | ✅ via CartPage | ✅ | — | — | — |
| Páginas (home, produto, carrinho, pedido-enviado) | — | — | ✅ | ✅ | ✅ | ✅ | ✅ |

## Out of Scope

### Permanente (toda a vida do projeto, salvo nova ADR superando)

- **Gateway de pagamento** (PIX, cartão, boleto). Toda venda termina no WhatsApp.
- **Cálculo de frete via Correios/CEP**. Frete a combinar pelo WhatsApp (P9 fechada).
- **Conta de cliente / login / senha / e-mail transacional**. Carrinho é localStorage; sem identidade.
- **Bot de WhatsApp / WhatsApp Business API / Z-API / Twilio** (ADR-0010). Atendimento manual da Ellen é diferencial.
- **Tracking de pedido** (status "em produção", "enviado", "entregue"). Ellen comunica manualmente.
- **CMS visual completo** (Sanity Studio). JSON versionado é caminho para Fase 1+ até justificar mudança via ADR.
- **Stock photos / outras ferramentas de geração** (Midjourney, DALL-E, SD, Unsplash, Pexels) (ADR-0006).
- **Cordões masculinos** ou peças "masculinas" no catálogo Fase 1. Público feminino.

### Fora da Slice 1 (entram em slices subsequentes — ver Roadmap)

- `/sobre` com retrato da Ellen Lopes — Slice 2 (texto-only) → Slice 6 (foto/persona quando Ellen autorizar).
- Páginas institucionais (`/como-comprar`, `/cuidados`, `/troca-e-devolucao`, `/faq`, `/contato`) — Slice 2.
- Catálogo completo (~90–120 peças, todas as categorias com filtros, busca, ordenação) — Slice 3.
- `/campanha` rota fixa cheia (hero Cinema Studio + manifesto longo + grid completa) — Slice 4.
- Cursor custom no desktop em hero/Campanha, microvídeos Seedance em transições, otimizações finais — Slice 5.
- Domínio próprio + número WhatsApp real + Pixel ID real + revisão final de copy da Ellen — Slice 6.

### Decisões adiadas para Fase 2+ (com ADR superando esta)

- Lookbook editorial acumulativo (`/lookbook/<slug>`).
- Sanity Studio para autonomia editorial da Ellen.
- Wishlist + compartilhamento de produto.
- Reviews por peça.
- Programa de indicação.
- Integração Instagram Shopping.
- Automação WhatsApp (bot oficial Meta).
- A/B testing de hero.

## Further Notes

### Roadmap até "Slice N" do release público

- **Etapa de dados (entre `/to-issues` e `/tdd` Slice 1)** — Processamento do catálogo PDF da Ellen (Pak cola prompt dedicado). Outputs: `data/products.json`, `data/campanha-atual.json`, assets de referência, relatório de processamento.

- **Slice 1 — Vertical fatia mínima end-to-end**
  - Setup do projeto + Brand Reference Pack + Soul Character "Modelo Ella" treinado.
  - Home (hero da Marca + Campanha Atual + favoritas + sobre curto + footer).
  - **Uma página de produto real** (1 peça emblemática do Outono 2026 com 3 fotos Higgsfield já produzidas).
  - `/carrinho` + fluxo de finalização wa.me + `/pedido-enviado/PED-XXXXXX`.
  - Plausible cloud + Meta Pixel armado e silencioso + Cookie Banner + `/privacidade` MDX.
  - Deploy Vercel free com `vercel.app` subdomain.
  - **Critério de aceitação**: Lighthouse mobile ≥ 95, A11y axe sem violações, E2E do fluxo crítico passando, Visual Regression baseline gerada, todas as 7 camadas de teste no CI.

- **Slice 2 — `/sobre` mínima + páginas institucionais com placeholders**
  - `/sobre` com texto + sparkles, sem retrato.
  - `/como-comprar`, `/cuidados`, `/troca-e-devolucao`, `/faq`, `/contato` com texto-base + placeholders pra Ellen revisar.

- **Slice 3 — Catálogo completo**
  - Todas as ~90–120 peças do PDF processadas.
  - Batch Higgsfield (~270–360 gerações ADR-0008) + manifest atualizado.
  - Rotas `/colares`, `/aneis`, `/brincos`, `/pulseiras`, `/conjuntos`, `/gargantilhas`, `/tornozeleiras`, `/piercings`, `/outros`.
  - Filtros (banho, preço, lançamentos, "em destaque agora"), busca, ordenação.

- **Slice 4 — `/campanha` cheia + Campanha Atual na home com mídia final**
  - Página `/campanha` (rota fixa) com hero Cinema Studio + manifesto + grid dos `produtosDestaqueSlugs`.
  - Seção da Campanha Atual na home substituindo placeholder por mídia final Outono 2026.

- **Slice 5 — Polimentos finais**
  - Cursor custom no desktop em hero/Campanha.
  - Microvídeos Seedance 2.0 em transições.
  - Otimizações de performance (segundo round Lighthouse).
  - A11y WCAG AA validado em **todas** as páginas (não só Slice 1).

- **Slice 6 — Domínio + variáveis reais + revisão de copy**
  - Domínio próprio (quando Ellen confirmar).
  - `NEXT_PUBLIC_WHATSAPP_NUMBER` real.
  - `NEXT_PUBLIC_META_PIXEL_ID` real (se Ellen tiver/quiser).
  - Revisão final de copy com texto literal da Ellen (manifesto da Marca, política de troca, FAQ, sobre completo se houver foto/persona).

### ADRs ativas referenciadas neste PRD

| ADR | Tema |
|---|---|
| ADR-0001 | Política Higgsfield: qualidade prevalece sobre economia |
| ADR-0002 | Variante de estilo `minimalist-ui` |
| ADR-0003 | Logo PNG-only Fase 1 (vetorização como risco crítico) |
| ADR-0004 | Schema simples + Campanha Atual sem histórico |
| ADR-0005 | Stack Next.js 15 + Tailwind v4 + Motion + Zustand + Vercel + JSON |
| ADR-0006 | Pipeline Higgsfield único (sem stock, sem outras ferramentas) |
| ADR-0007 | Analytics + Privacidade (Plausible + Meta Pixel via env var) |
| ADR-0008 | Política de produção fotográfica uniforme (3 fotos por peça) |
| ADR-0009 | Schema amendment: `tipoFulfillment` + `piercings` |
| ADR-0010 | Fluxo de finalização via wa.me sem bot |
| ADR-0011 | **(TODO — pendente texto literal da Ellen sobre política de troca)** |
| ADR-0012 | Soul Character "Modelo Ella" persona definitiva |
| ADR-0013 | Estratégia de teste (pirâmide TDD + visual + a11y + perf) |

### Pendências da Ellen (não bloqueiam Slice 1)

Lista completa em `.scratch/perguntas-ellen.md`. Resumo de quais afetam quais slices:

| # | Pendência | Bloqueia Slice 1? | Caminho de unblock |
|---|---|---|---|
| 1 | Manifesto da Marca eternal | ❌ não | Placeholder editorial → swap-in MDX |
| 2 | Regras literais de troca (ADR-0011) | ❌ não | Slice 2 → swap-in MDX |
| 3 | Foto real disponibilidade (catálogo) | ❌ não para Slice 1 (1 peça); ⚠️ parcialmente para Slice 3 | Hipótese de trabalho 100% PDF; gera do zero se peça com foto-fonte ruim |
| 4 | Pixel ID Meta | ❌ não | Env var `NEXT_PUBLIC_META_PIXEL_ID` opcional |
| 5 | Número WhatsApp E.164 | ❌ não | Env var `NEXT_PUBLIC_WHATSAPP_NUMBER` (placeholder fake `5500000000000`) |
| 6 | Domínio | ❌ não | Vercel subdomain durante Slice 1 |
| 7 | Foto Ellen Lopes /sobre | ❌ não para Slice 1 | Slice 2 (texto-only) → Slice 6 (foto/persona) |
| 8 | Manifesto Outono 2026 final | ❌ não | Pak já passou texto literal do PDF |
| 9 | Fonte da logo | ❌ não | Brand Reference Pack faz comparação visual entre 3 candidatas |
| 10 | Variantes de banho — quais peças | ❌ não para Slice 1 (1 peça); ⚠️ Slice 3 | Durante processamento do PDF + revisão Ellen |
| 11 | Peças sob-encomenda — quais | ❌ não para Slice 1; ⚠️ Slice 3 | Idem |
| 12 | Peças "masculinas" — confirmar | ❌ não para Slice 1; ⚠️ Slice 3 | Idem |

**Conclusão**: zero pendências bloqueiam Slice 1. Slice 3 tem 4 pendências em estado "parcialmente bloqueado" (10, 11, 12, e parte de 3) — mitigáveis durante o processamento do PDF + revisão da Ellen no relatório.

### Convenções e arquivos de referência

- `CLAUDE.md` — regras permanentes do projeto (skills, ADRs, anti-padrões).
- `CONTEXT.md` — léxico do domínio (Marca, Ellen Lopes, Modelo Ella, Campanha Atual, peça, banho, etc.).
- `docs/adr/NNNN-*.md` — decisões arquiteturais.
- `assets/brand/` — logo + catálogo PDF (referências de marca).
- `assets/prompts/` — prompts versionados (Brand Reference Pack, Soul Characters, peças).
- `assets/generated/` — mídia gerada pelo Higgsfield + manifest.
- `data/` — JSONs da camada de dados (`products.json`, `campanha-atual.json`, `higgsfield-references.json`).
- `.scratch/` — issue tracker local + pendências da Ellen + relatórios de processamento.

### Próximo passo

Após autorização do Pak revisando este PRD, disparar `/to-issues` para quebrar em vertical slices independentes. Antes do `/tdd` Slice 1, Pak cola prompt dedicado para a etapa de dados (processamento do catálogo PDF).
