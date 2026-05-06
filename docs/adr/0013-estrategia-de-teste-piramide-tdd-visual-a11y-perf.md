# ADR-0013 — Estratégia de Teste: Pirâmide TDD + Visual Regression + A11y + Performance Budget

- **Status**: aceito (política inegociável)
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)

## Contexto

CLAUDE.md exige `/tdd` como único caminho para escrever código de feature ou fix. Mas TDD por si só cobre lógica de módulo — não captura:

- **Regressão visual silenciosa** (componente que continua passando nos unit tests mas trocou cor, espaçamento ou tipografia sem ninguém perceber). Risco crítico em site orientado por design.
- **Acessibilidade** (WCAG AA é parte do briefing — não pode ser checklist mental que ninguém roda).
- **Performance** (LCP/CLS/INP/Lighthouse ≥ 95 são critérios da Marca; "otimização tardia" no fim do projeto chega quase sempre tarde demais).
- **Formato literal de string** (mensagem WhatsApp tem template específico em ADR-0010 com `•`, asteriscos pra bold, traços, quebras — qualquer mudança silenciosa quebra o tom da Marca na conversa cliente↔Ellen).

Sem cobertura nessas 4 dimensões, a Slice 1 sai bonita e a Slice 5 chega com bola de lama visual + perf degradada + a11y quebrada.

## Decisão

**Pirâmide de testes da ELLA tem 6 camadas obrigatórias.** PR que viola alguma sem ADR superando esta é anti-padrão.

### Camada 1 — Unit tests em TODOS os módulos profundos

Stack: **Vitest** (compatível com Next.js 15, mais rápido que Jest, suporta TS strict nativo).

Módulos profundos cobertos (lista exaustiva — vai pro PRD):
- `Cart` — adicionar/remover/atualizar qty/clear/persistência versionada
- `Order` — geração `PED-XXXXXX` (entropia, formato, sem chars confusos), snapshot, lookup
- `WhatsApp Message Builder` — pure function, monta texto literal a partir de carrinho
- `WhatsApp Link Builder` — concatena `wa.me/<E.164>?text=<encoded>`, preserva caracteres
- `Product Catalog` — queries em JSON tipado, slugs, filtros, edge cases (categoria vazia, slug inválido)
- `Analytics` — fan-out condicional (Plausible sempre, Meta Pixel só com consent + env ID)
- `Consent` — leitura/escrita de localStorage, default antes de decisão
- `Currency Format` — `precoCents → "R$ XX,XX"` BRL, edge cases (0, 100000, valores pequenos)
- `Slug & Routing` — slugify, validação, mapeamento categoria↔rota
- `Validation` — `validateCartBeforeFinalize` cobrindo qty, ativo, slug existente, item órfão

Fixtures compartilhadas em `tests/fixtures/` para cart, products.json mock, campanha-atual mock.

### Camada 2 — Snapshot test específico da mensagem WhatsApp

`WhatsApp Message Builder` ganha **um snapshot test dedicado** além dos unit tests:

```ts
test("mensagem WhatsApp — fixture canônica", () => {
  const cart = fixtureCart_3items_with_variants_and_sob_encomenda;
  expect(buildMessage(cart)).toMatchSnapshot();
});
```

Snapshot inicial é committado. Qualquer mudança no formato (`•` virou `-`, total perdeu asterisco, sufixo "sob encomenda" mudou) **falha o teste**. Atualizar snapshot exige **ato consciente** (`vitest -u` + revisão visual no diff do PR).

### Camada 3 — Integration tests dos componentes principais

Stack: **React Testing Library + msw** (Mock Service Worker para mockar Higgsfield ou qualquer fetch externo, se aparecer).

Componentes cobertos com integration tests (interação real, não snapshot):
- **`CartPage`** — adicionar/remover linha, atualizar qty, clicar finalizar (mock do `window.open`), validar mensagem no clipboard de fallback.
- **`ProductPage`** — galeria swipeable (gesture mock), CTA sticky atualiza preço com variante, aviso `tipoFulfillment === 'sob-encomenda'` aparece quando aplicável.
- **`OrderSentPage`** — recupera snapshot por ID, mostra ID grande, fallback "[abrir manualmente]" funciona, "esvaziar carrinho" limpa estado.
- **`CookieBanner`** — primeira visita mostra banner, aceitar/recusar grava consent, banner some, hyperlink "Cookies" no footer reabre.

### Camada 4 — E2E Playwright do fluxo crítico

Um único fluxo crítico na Slice 1 (mais cobertura é tentação prematura de exhaustividade):

```
home → click em produto destaque → produto carrega 3 fotos → click "Adicionar ao carrinho"
     → vai pra /carrinho → click "Finalizar pelo WhatsApp"
     → window.open chamado com URL wa.me correta + mensagem correta encoded
     → redirect pra /pedido-enviado/PED-XXXXXX → ID exibido + sparkles renderizam
```

Cada slice subsequente **adiciona** ao E2E só se introduzir fluxo crítico novo (ex.: Slice 4 adiciona `/campanha → click destaque → produto`, Slice 3 adiciona busca/filtro → produto).

### Camada 5 — Visual Regression via Playwright Screenshot

Stack: **Playwright** com `expect(page).toHaveScreenshot()` (built-in pixel diff).

Páginas cobertas inicialmente:
- Home (mobile 375×667 + desktop 1280×800)
- Página do produto (mobile + desktop)
- Carrinho (mobile + desktop)
- `/pedido-enviado/PED-XXXXXX` (mobile + desktop, com fixture de pedido conhecido)

Threshold inicial: **0.1%** de pixel diff (ajustável). Snapshots baseline são committados. Atualização requer revisão visual no PR.

Regiões dinâmicas (sparkles animados, vídeo) recebem `mask:` para não falsificar diff. Vídeo do hero usa primeiro frame estático em modo de teste.

### Camada 6 — Acessibilidade automatizada via `@axe-core/playwright`

Em **toda página** do site, dentro do mesmo run Playwright:

```ts
test.beforeEach(async ({ page }) => {
  await page.goto(URL_DA_PAGINA);
  const results = await new AxeBuilder({ page }).analyze();
  expect(results.violations).toEqual([]);
});
```

WCAG AA é o conjunto-alvo (`tags: ['wcag2a', 'wcag2aa']`). Violações falham PR — **não há "warnings ignorados"** em a11y. Exceções pontuais (ex.: contraste em decorativo não-essencial) exigem ADR.

### Camada 7 — Lighthouse CI com Performance Budget

Stack: **`@lhci/cli`** rodando em GitHub Actions ou Vercel Build Step.

Budget Slice 1 (mobile simulado, 4G slow):
- **LCP ≤ 2.0s** (largest contentful paint)
- **CLS ≤ 0.05**
- **INP < 200ms**
- **Score Lighthouse mobile ≥ 95** (overall)

Budget falha → PR bloqueado. Ajuste de budget exige ADR (não basta "ah, ficou 92, deixa passar").

## Resumo das ferramentas

| Camada | Ferramenta | Roda em |
|---|---|---|
| Unit | Vitest | dev + CI (cada PR) |
| Snapshot WhatsApp | Vitest (toMatchSnapshot) | dev + CI |
| Integration | RTL + msw | dev + CI |
| E2E | Playwright | CI (cada PR) |
| Visual Regression | Playwright Screenshot | CI (cada PR) |
| A11y | @axe-core/playwright | CI (cada PR) |
| Performance | @lhci/cli | CI (cada PR) |

CI roda **tudo** em cada PR. Localmente, Pak roda `pnpm test` (unit + snapshot + integration) com frequência; E2E + visual + a11y + Lighthouse rodam sob demanda local (`pnpm test:e2e`, `pnpm test:visual`, etc.) e sempre no CI.

## Consequências

- **Bola de lama visual fica arquitetonicamente difícil**: regressão visual silenciosa entre Slice 3 e Slice 4 falha PR.
- **A11y deixa de ser checklist mental**: cada PR passa pelo axe-core antes de mergear.
- **Performance deixa de ser otimização tardia**: budget falha PR cedo.
- **Mensagem WhatsApp não é "consertada por engano"**: snapshot reforça que toda mudança é deliberada.
- **Custo de CI sobe**: Playwright + Lighthouse pesados. Aceito — qualidade > segundos de CI.
- **Stack de teste fica grande mas concentrada**: todo o adicional sobre TDD (visual + a11y + perf) cabe dentro de Playwright + axe + lhci. Sem stack exótica.
- **Snapshot updates exigem cuidado**: `vitest -u` e regenerar Playwright screenshots devem ser ato consciente. PRs que regeneram snapshots em massa sem justificar serão flagged.

## Notas

- Esta política aplica a **todas as Slices**. Slice 1 já entrega TODAS as 7 camadas funcionais — ainda que o E2E só tenha 1 fluxo, o aparato CI já está ligado.
- Visual regression e a11y/perf no Slice 1 começam **leves** (1 fluxo, 4 páginas, 4 critérios de perf). Crescem com cada slice (mais páginas, mais fluxos), mas o aparato não muda.
- Stack opcional futura: **Storybook** para componentes isolados — útil quando UI library do projeto crescer (Slice 4+). Não é parte desta ADR; abrir nova quando justificar.
- Esta ADR é **inegociável** por padrão. PR que reduz cobertura ou pula uma das 7 camadas sem ADR de revogação é anti-padrão e deve ser flagged em review.

## Atualização 2026-05-05 — execução local-only durante S1.1 a S5.x

Decisão Pak (no fim de S1.1 / TB10): **CI workflow GitHub Actions + Lighthouse CI + Vercel deploy adiados pra S6.1** (slice de deploy do PRD). Issue separada: `.scratch/issues/0018-tb10-deferred-ci-lighthouse-vercel.md`.

Motivação: validar Slice 1 completa em localhost (home + produto + carrinho + WhatsApp end-to-end) antes de gastar energia configurando deploy de esqueleto vazio. Aparato de teste continua **inegociável**, mas a *execução* muda durante a janela S1.1 → S5.x:

| Camada | Janela S1.1 → S5.x | Janela S6.1 em diante |
|---|---|---|
| Unit | `pnpm test` local em cada turno | + CI cada PR |
| Snapshot WhatsApp | `pnpm test` local | + CI cada PR |
| Integration | `pnpm test` local | + CI cada PR |
| E2E | `pnpm test:e2e` local sob demanda **antes de fechar slice** | + CI cada PR |
| Visual Regression | `pnpm test:visual` local sob demanda **antes de fechar slice** | + CI cada PR |
| A11y | `pnpm test:a11y` local sob demanda **antes de fechar slice** | + CI cada PR |
| Performance | rodar manual via Lighthouse Chrome DevTools antes de fechar slice (script `pnpm test:lh` recriado em S6.1) | + CI cada PR |

**Regra**: nenhuma slice S1.1 → S5.x fecha sem rodar visual + a11y + e2e local com tudo verde. Pak revisa baselines antes do commit. Quando S6.1 chegar, o aparato CI levanta e roda 7 camadas em todo PR daí pra frente.

A natureza inegociável da política não muda — só a porta de execução (local vs. CI) durante a janela inicial.
