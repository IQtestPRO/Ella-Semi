# CLAUDE.md — Regras Permanentes Deste Projeto (ELLA Semijoias)

> Este arquivo é lei. Toda sessão do Claude Code que abrir neste repo carrega estas regras automaticamente. Não são sugestões.

---

## Princípio raiz

**Toda solicitação do usuário passa por uma skill antes de virar código.** Skills são obrigatórias, não opcionais.

Você nunca escreve código de aplicação direto. Você nunca "vai logo fazendo". Você nunca improvisa um fluxo só porque o pedido parece simples. O caminho é sempre: *entender → alinhar via skill → planejar via skill → executar via skill → revisar via skill*.

A regra existe porque o trabalho deste projeto é **lapidação contínua**, não velocidade bruta.

Adicionalmente, este é um **site-catálogo de joias e semijoias premium**. Sem checkout no site (toda venda termina no WhatsApp). Isso significa que **a apresentação visual é o ponto único de conversão** — qualidade prevalece sobre economia em todo trade-off.

---

## A marca

- **Marca**: ELLA Semijoias (caixa-alta no logo: "ELLA")
- **Fundadora**: Ellen Lopes (pessoa real — ELLA é marca, Ellen é pessoa, não confundir)
- **WhatsApp atendimento**: link curto `wa.link/adq88g` para atendimento geral; número direto E.164 para mensagem dinâmica do carrinho (a confirmar no grilling)
- **Identidade visual atemporal**: rosa salmão da logo + ELLA serif preta + sparkles dourados + perna alongada do "A". Não muda nunca.

---

## Skills disponíveis

### Engenharia — Matt Pocock (espinha do projeto)
- **`/grill-with-docs`** — Grilling antes de qualquer mudança. Alinha escopo, sharpening de jargão, atualiza `CONTEXT.md`, cria ADR.
- **`/grill-me`** — Grilling sem código. Discussões de produto, arquitetura, processo.
- **`/to-prd`** — Conversa atual → PRD → issue no tracker.
- **`/to-issues`** — Plano/PRD → issues vertical-slice independentes.
- **`/triage`** — Triagem de issues pelo state-machine de roles.
- **`/tdd`** — Red-green-refactor. **Único caminho permitido para escrever código de feature ou fix.**
- **`/diagnose`** — Loop disciplinado: reproduzir → minimizar → hipotetizar → instrumentar → consertar → teste de regressão.
- **`/zoom-out`** — Antes de mexer em código que você não escreveu nesta sessão.
- **`/improve-codebase-architecture`** — Achar oportunidades de deepening. Rodar periodicamente.
- **`/caveman`** — Modo ultra-comprimido. Use durante execução longa.
- **`/write-a-skill`** — Criar skills custom quando padrão se repete 3+ vezes.

### Frontend — Emil Kowalski + Leon Lin (Taste-Skill)
- **`emil-design-eng`** — Audita UI sob princípios Emil Kowalski: animações ≤300ms, easing custom, perceived performance. **Ativo em todo trabalho de UI.**
- **`taste-skill` com variante `minimalist-ui`** (ADR-0002) — Anti-slop frontend, calibrado para esta marca: clean editorial, warm monochrome, pastéis. Parâmetros: `DESIGN_VARIANCE=7`, `MOTION_INTENSITY=8`, `VISUAL_DENSITY=3`. Vocabulário do projeto: "warm editorial soft glam". **Ativo em todo trabalho de UI.**
- **`redesign-skill`** — Quando a tarefa é melhorar UI já existente.
- **`output-skill`** — Quando o agent estiver truncando código longo.

> **Mapeamento de aliases ↔ skills instaladas**: `taste-skill` = `design-taste-frontend`; `redesign-skill` = `redesign-existing-projects`; `output-skill` = `full-output-enforcement`. Quando invocar, use o nome real da skill instalada; quando documentar, use o alias deste arquivo.

### Geração de mídia — Higgsfield CLI (`higgsfield`)

**Política**: qualidade prevalece sobre economia (ADR-0001). Sem teto de créditos. Modelo escolhido por adequação à tarefa, não por preço.

**Pipeline único** (ADR-0006): **toda mídia visual do site é gerada via Higgsfield CLI**. Sem exceção produtiva. Stock photos, bancos de imagens (Unsplash/Pexels/etc.), Midjourney, DALL-E, Stable Diffusion local — **proibidos** como fonte de asset publicado. Foto real fornecida pela Ellen pode entrar como **input de background swap Higgsfield** para padronização visual, nunca como asset cru final.

**Modelos por contexto** (atualizado S1.3 / ADR-0015 — pipeline visual único):
- **TODA imagem do site** (Foto 1 produto, Foto 2 detalhe, Foto 3 lifestyle com Modelo Ella, background swap foto real Ellen, hero da Marca, hero da Campanha): **Nano Banana Pro** (`nano_banana_2`) em **resolução 2K obrigatória**.
- **Vídeos aspiracionais (hero da home, hero da Campanha Atual, hero da `/campanha`, qualquer cena ≥6s ou de marca)**: **Cinema Studio** — real optical physics.

**Input image obrigatório do catálogo PDF** (atualização S1.4 / ADR-0015 inline 2026-05-06):
- Toda **Foto 1/2/3 de peça do catálogo** usa `--image assets/brand/catalogo-pecas/<slug>.png` (foto-fonte extraída do PDF) como input pra Nano Banana Pro 2K → fidelidade de design ao catálogo da Ellen, drift técnico ~zero entre frames.
- Mecânica: `higgsfield generate create nano_banana_2 --image <path> --aspect_ratio <r> --resolution 2k --wait --prompt "<reframe + ambiente + lighting + anti>"`.
- Utility de extração PDF→PNG (`scripts/extract-catalogo-page.mjs`) implementada em S3.1 antes do batch.
- Exceção histórica única: peça canônica `brinco-folha-aberta-semijoia` da S1.4 TB1 foi gerada from-scratch ANTES desta política — Pak aprovou e não regerada.
- Geração from-scratch (sem input image) continua válida pra **camadas atemporal e sazonal** da Marca (hero da home, OG image, fundos institucionais — não-catálogo).

**Removidos do projeto** (S1.3 / ADR-0015): Higgsfield Soul (V2 / Cinematic / Location), Flux 2 / Flux Kontext, Kling, Seedance, GPT Image 2, Soul Character treinado, `data/higgsfield-references.json`.

**Regras de uso**:
- **Nunca** placeholder em produção (`https://placehold.co/...`, "lorem picsum", `<img src=""/>`). Higgsfield ou foto real da Ellen via bg-swap.
- Toda mídia em `assets/generated/<categoria>/<id>.{webp|mp4}` + metadata em `assets/generated/manifest.json` (model, model_id, prompt_ref, resolution, aspect_ratio, dimensions, layer, personaVersion, brandReferenceVersion). Reprodutibilidade obrigatória.
- Prompts versionados em `assets/prompts/*.md`. Trate prompt como código.
- **Persona-tipo prompt-only** pra entidades recorrentes (Modelo Ella em `assets/prompts/personas/modelo-ella-persona-tipo.md` — ADR-0015 substitui Soul Character treinado da ADR-0012). Cada geração roda independente.
- **Resolução 2K obrigatória** em toda geração de imagem (2048 px lado maior; ratios 4:5/1:1/16:9 conforme contexto). Sub-2K é anti-padrão.
- Iterar prompt antes de iterar modelo. (Não há rotação de modelos a iterar — Nano Banana Pro 2K é único.)
- **Sem aviso de batch grande nem estimativa de créditos** (ADR-0001 revoga essa regra).

---

## Arquitetura de dados (ADR-0004)

### Schema simples — sem coleções, sem pertinência, sem versionamento de produto

**`data/products.json`** — peças do site:

```ts
type Product = {
  slug: string;             // "colar-veneziana-banho-ouro" (atemporal, sem ano/estação)
  nome: string;             // "Colar Veneziana Banho Ouro"
  categoria: 'colares' | 'aneis' | 'brincos' | 'pulseiras' | 'conjuntos' | 'gargantilhas' | 'tornozeleiras' | 'piercings' | 'outros';
  banho: 'ouro' | 'prata' | 'rodio' | 'ouro-rose' | 'a-confirmar';
  tipo: 'semijoia' | 'bijuteria';
  precoCents: number;
  precoPromocionalCents?: number;
  descricao: string;
  fotos: Array<{
    url: string;
    alt: string;
    fonte: 'higgsfield-bg-swap' | 'higgsfield-lifestyle' | 'higgsfield-detalhe' | 'foto-real-ellen-via-bg-swap';
    width: number;
    height: number;
  }>;
  variantes?: Array<{ tipo: 'tamanho' | 'cor' | 'comprimento'; opcoes: Array<{ rotulo: string; precoCentsAjuste?: number }> }>;
  tags?: string[];                    // ['promocao', 'lancamento', 'best-seller']
  promocao: boolean;                  // se true, **não pode trocar** (regra negocial — ADR-0009 e ADR-0011)
  tipoFulfillment: 'pronta-entrega' | 'sob-encomenda'; // ADR-0009. Default 'pronta-entrega'. Sob-encomenda exige pagamento prévio + UI de aviso na página e no carrinho.
  destaqueHome: boolean;              // curadoria editorial subjetiva → seção "Favoritas da Ella" (ADR-0004)
  maisVendido: boolean;               // default false. Histórico de venda real da loja física → seção "MAIS VENDIDOS" (S2.0 / ADR-0017)
  ativo: boolean;
  origem?: { catalogoArquivo: string; pagina: number; letra: string }; // rastreabilidade interna
  cadastradoEm: string;
  atualizadoEm: string;
};
```

**Não existe** `data/colecoes.json`. **Não existe** rota `/colecoes/[slug]`. Produto não tem campo `colecao`, `pertinencia`, `estacao` ou similar.

### Campanha Atual — entidade única, sem histórico

**`data/campanha-atual.json`** — uma seção sazonal alimentada por **um arquivo único**:

```ts
type CampanhaAtual = {
  slug: string;                   // "outono-2026"
  nomeExibicao: string;           // "Outono na ELLA"
  manifesto: string;              // texto curto da Ellen
  heroVideo?: string;             // path Higgsfield Cinema Studio
  heroImagem?: string;            // fallback/alternativa
  ctaTexto: string;               // "Ver peças desta estação"
  produtosDestaqueSlugs: string[]; // 6-10 slugs de products.json
  ativa: boolean;                 // false → seção some da home
  atualizadoEm: string;
};
```

**Aparece em 3 lugares só**:
1. **Home**: 1 seção "Campanha Atual" (banner com vídeo/imagem + manifesto + CTA). Some quando `ativa: false`.
2. **Catálogo**: filtro opcional "Em destaque agora" que filtra `produtosDestaqueSlugs`.
3. **`/campanha`** (URL fixa, **não dinâmica**, sem `[slug]`): página dedicada com hero, manifesto, grid dos produtos destaque. Trocar campanha → URL continua `/campanha`, conteúdo muda.

**Trocar campanha no futuro**: editar `data/campanha-atual.json` + gerar mídia nova via Higgsfield. Resto do site não é tocado. Sem histórico, sem rotas antigas, sem refactor.

---

## Stack (ADR-0005)

| Camada | Decisão | Motivo |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | SEO, ISR, Image, OG, ecossistema, Vercel free |
| Estilização | **Tailwind v4 + componentes shadcn-like (copy-paste)** | rapidez + design tokens + sem dependência pesada |
| Animação | **Motion (ex-Framer Motion)** | gestos, scroll-driven, page transitions |
| Carrinho | **Zustand com `persist` middleware (`localStorage`)** | leve, sem boilerplate, schema versionado |
| Imagens | **`next/image` + Vercel Image** | sem CDN externo na Fase 1 |
| Vídeos | **Vercel Blob ou Cloudflare R2 servindo `<video>` com poster** | preload otimizado, custo zero/baixo |
| Hospedagem | **Vercel free tier** | CI/CD trivial, edge, OG automático |
| Catálogo | **JSON versionado** (`data/products.json` + `data/campanha-atual.json`) | confirmado pela ADR-0004 |
| Fontes | **Google Fonts via `next/font` (display swap)** | self-hosting CSS, zero CLS, performance |
| Runtime | **Node ≥22** (22 LTS ou 24 current) | `package.json engines.node: ">=22.0.0"`; Vercel produção 22 LTS, local 22 ou 24 |
| TS | **strict mode** | obrigatório |
| Package manager | **pnpm** | rápido, lockfile determinístico |

---

## Tabela de roteamento — qual skill usar em cada pedido

| Tipo de pedido | Sequência obrigatória |
|---|---|
| "Quero adicionar feature X" | `/grill-with-docs` → `/to-prd` → `/to-issues` → `/zoom-out` (se mexer em código existente) → `/tdd` |
| "Tem um bug em Y" | `/diagnose` → `/tdd` (com teste de regressão) |
| "Refatora isso" | `/zoom-out` → `/grill-with-docs` → `/tdd` |
| "Discute essa ideia" | `/grill-me` (não escreve código) |
| "Cria PRD" | `/to-prd` |
| "Quebra esse plano em tarefas" | `/to-issues` |
| "Triagem de issues" | `/triage` |
| "Não entendi essa parte do código" | `/zoom-out` |
| "Melhora o design / UI" | `redesign-skill` + `emil-design-eng` + `taste-skill` (minimalist-ui) |
| "Cria componente / tela nova" | `/tdd` + `taste-skill` (minimalist-ui) + `emil-design-eng` ativos |
| "Auditoria geral / código bagunçado" | `/improve-codebase-architecture` |
| "Preciso de foto de produto" | Higgsfield CLI com **Nano Banana Pro 2K** + reference da peça |
| "Preciso de foto com modelo / lifestyle / hero humano" | Higgsfield CLI com **Nano Banana Pro 2K** + persona-tipo via `assets/prompts/personas/modelo-ella-persona-tipo.md` (master) + sub-prompt da categoria |
| "Preciso de fundo / ambiente neutro" | Higgsfield CLI com **Nano Banana Pro 2K** (Flux removido em S1.3 / ADR-0015) |
| "Preciso de vídeo de marca / hero / `/campanha`" | Higgsfield CLI com **Cinema Studio** |
| "Preciso de microvídeo / loop curto / transição" | Higgsfield CLI com **Cinema Studio** (Seedance removido em S1.3 / ADR-0015) |
| ~~"Preciso de cena com diálogo / lipsync"~~ | ~~Kling 3.0~~ — removido em S1.3 / ADR-0015. Reabrir via ADR superando se aparecer demanda |
| "Trocar fundo / variar cenário de foto existente" | Higgsfield CLI **Nano Banana Pro 2K** (background swap), preservando o produto |
| "Trocar Campanha Atual" | Editar `data/campanha-atual.json` + gerar mídia via Higgsfield. Não mexer em produtos, não criar rotas novas |
| Pedido ambíguo | `/grill-me` antes de qualquer outra coisa |

**Se o pedido não cair em nenhuma linha, pergunte qual skill usar antes de prosseguir.** Não chute.

---

## Auto-check no início de cada turno

Antes de responder qualquer mensagem do usuário, rode mentalmente:

1. **Que tipo de pedido é esse?** (feature / bug / refator / discussão / UI / mídia / triagem / outro)
2. **Qual sequência de skills cobre, segundo a tabela?**
3. **`CONTEXT.md` está atualizado** com o jargão usado nesta conversa?
4. **Existe ADR relevante em `docs/adr/`?** Se a conversa contradiz ADR registrada, pare e levante.
5. **Estou prestes a escrever código sem skill?** Se sim, volte ao passo 2.
6. **Estou prestes a usar mídia em produção?** Se sim, ela está em `assets/generated/` com manifest, gerada via Higgsfield? Se não, pare.

Se algum passo detectar problema, **a resposta começa endereçando o problema**, não o pedido.

---

## Loop de lapidação

### Por turno
- Atualizar `CONTEXT.md` com jargão novo.
- Criar ADR em `docs/adr/NNNN-titulo.md` para qualquer decisão arquitetural não-trivial.
- Em mudanças de UI: rodar `emil-design-eng` + `taste-skill` (minimalist-ui) antes de considerar tarefa concluída.
- Em qualquer mídia adicionada/modificada: registrar prompt + modelo + seed + data em `assets/generated/manifest.json`.

### A cada 5 turnos significativos
- Rodar `/improve-codebase-architecture` e apresentar até 3 oportunidades de deepening priorizadas.
- Usuário decide qual atacar.

### Quando detectar bola de lama (acionamento imediato)
Sinais: nomes inconsistentes, função fazendo 3 coisas, módulo sem fronteira clara, teste flakeado, código duplicado em 2+ lugares, jargão novo não registrado, decisão arquitetural sem ADR.

Resposta: **interromper trabalho atual**, sinalizar problema, propor `/improve-codebase-architecture` ou `/grill-with-docs`. Usuário autoriza ou não.

---

## Anti-padrões — proibidos

- ❌ Escrever código sem `/grill-with-docs` ou `/grill-me` antes (exceto fixes triviais de typo / lint).
- ❌ Implementar feature sem `/tdd` (red-green-refactor obrigatório).
- ❌ Mexer em código existente sem `/zoom-out` antes.
- ❌ Inventar jargão. Use `CONTEXT.md`.
- ❌ Decisão arquitetural sem ADR.
- ❌ Pular `taste-skill` (minimalist-ui) / `emil-design-eng` em UI "porque é só um botão".
- ❌ Ignorar este arquivo "porque o pedido era simples".
- ❌ Nomes diferentes pra mesma coisa em arquivos / variáveis / commits.
- ❌ Verbosidade. Prefira `/caveman` em execução.
- ❌ Placeholders de imagem em produção (`placehold.co`, `lorem picsum`, `<img src=""/>`). Use Higgsfield ou foto real da Ellen.
- ❌ Gerar mídia sem registrar prompt + modelo + seed em manifest.
- ❌ Drift fora da persona-tipo (estética da Modelo Ella fora do range — idade ≠ 45–50, etnia errada, mood corporativo/fierce, styling não-warm-editorial). Rosto pode variar; estética não pode (S1.3 / ADR-0015).
- ❌ Treinar Soul Character ou criar `data/higgsfield-references.json` (ADR-0012 superseded por ADR-0015 — mecânica é prompt-only via Nano Banana Pro 2K).
- ❌ Usar modelo de imagem que não seja Nano Banana Pro 2K (Soul / Flux / Kling / Seedance / GPT Image / etc removidos em S1.3 / ADR-0015). Cinema Studio só pra vídeos.
- ❌ Gerar imagem em resolução abaixo de 2K (2048 px lado maior). Sub-2K é anti-padrão obrigatório (S1.3 / ADR-0015).
- ❌ Gerar Foto 1/2/3 de peça do catálogo from-scratch quando a foto-fonte do PDF está disponível como input image. Use `--image assets/brand/catalogo-pecas/<slug>.png` no Higgsfield CLI pra fidelidade de design (atualização S1.4 / ADR-0015 inline 2026-05-06). Exceção histórica única: brinco-folha-aberta-semijoia da S1.4 TB1.
- ❌ Escolher modelo Higgsfield mais barato em vez do mais adequado (ADR-0001).
- ❌ **Usar imagem ou vídeo em produção que não foi gerado via Higgsfield CLI** (ADR-0006). Stock photos, bancos de imagens (Unsplash/Pexels/etc.), Midjourney, DALL-E, Stable Diffusion local — proibidos como asset publicado. Exceção única: foto real fornecida diretamente pela Ellen, e ainda assim deve passar por background swap Higgsfield para padronização.
- ❌ Hardcoding de "Outono", "Folhas", "estação" em componentes ou rotas. Componentes leem `data/campanha-atual.json` dinamicamente.
- ❌ Slugs de produto com ano/estação no path (`/outono-2026/colar-veneziana`). Slugs são atemporais.
- ❌ Recriar entidade Coleção (descartada por ADR-0004). Site tem **um único** `data/products.json` + **uma única** `data/campanha-atual.json`. Sem coleções, sem pertinência, sem rotas dinâmicas de coleção.
- ❌ Adicionar `data/colecoes.json` ou rota `/colecoes/[slug]`. Decisão arquivada como descartada.

---

## ADRs ativas (resumo — texto completo em `docs/adr/`)

- **ADR-0001** — Política Higgsfield: qualidade prevalece sobre economia. Sem teto de créditos. Sem aviso de batch grande. Sem estimativa de custo por execução. Modelo por adequação, não por preço.
- **ADR-0002** — Variante de estilo `minimalist-ui` ativa. `industrial-brutalist-ui` e `high-end-visual-design` removidas. "Soft" registrada como vocabulário ("warm editorial soft glam").
- **ADR-0003** — Logo PNG-only Fase 1. Vetorização (SVG) registrada como risco crítico a resolver antes de produção em escala (print, aplicações grandes). Mobile-first em PNG/WebP de alta resolução resolve Fase 1.
- **ADR-0004** — Schema simples. Sem entidade Coleção. `data/products.json` + `data/campanha-atual.json` (1 arquivo, 1 campanha ativa por vez, sem histórico). Slug atemporal. URL `/campanha` fixa, não dinâmica. Trocar campanha = editar 1 JSON + gerar mídia nova.
- **ADR-0005** — Stack: Next.js 15 (App Router) + Tailwind v4 + Motion + Zustand persist + Vercel Image + Vercel Blob/R2 + Vercel hosting + Google Fonts via next/font + JSON versionado + Node 22 LTS + TypeScript strict + pnpm.
- **ADR-0006** — Pipeline Higgsfield único. Toda mídia visual do site nasce do Higgsfield CLI. Stock photos, bancos free, ferramentas alternativas de geração — proibidos como asset publicado. Foto real da Ellen entra como input de background swap, nunca como asset cru.
- **ADR-0007** — Analytics + Privacidade: Plausible cloud + Meta Pixel via env var opcional (`NEXT_PUBLIC_META_PIXEL_ID`). Cookie banner opt-in pra marketing; Plausible roda sempre cookie-less. Rota `/privacidade` em MDX. Padrão "feature opcional via env var sem deploy de código" como convenção do projeto.
- **ADR-0008** (revisada) — Política de produção fotográfica **uniforme**: 3 fotos por peça (peça em ambiente foco-produto, peça em ambiente foco-detalhe, Modelo Ella usando a peça adaptada por categoria). Sem hierarquia. Total estimado ~270–360 gerações Higgsfield para o catálogo Outono 2026.
- **ADR-0009** — Schema amendment: `cordaoPersonalizado: boolean` removido; `tipoFulfillment: 'pronta-entrega' | 'sob-encomenda'` introduzido. Adicionada `piercings` ao enum `categoria`. Supersede ponto específico do schema da ADR-0004.
- **ADR-0010** — Fluxo wa.me sem bot: finalização gera `PED-XXXXXX` local, monta mensagem URL-encoded, abre `wa.me/<E.164>?text=...` em aba nova. Sem WhatsApp Business API, sem Z-API/Twilio. Ellen atende manualmente. Snapshot de pedido salvo em `localStorage` (`ella-orders-v1`).
- **ADR-0012** — ⛔ **superseded by ADR-0015** (S1.3, 2026-05-05). Soul Character "Modelo Ella" único: descartado. Substituído por Persona-Tipo prompt-only via Nano Banana Pro 2K. Conteúdo histórico preservado em `docs/adr/0012-...`.
- **ADR-0013** — Estratégia de teste: 7 camadas obrigatórias (Vitest unit + snapshot WhatsApp + RTL integration + Playwright E2E + visual regression + a11y axe-core + Lighthouse perf budget). Atualização 2026-05-05: durante S1.1–S5.x execução é local-only (`pnpm test:e2e`/`:visual`/`:a11y` antes de fechar slice); CI workflow + Lighthouse + Vercel deploy ativam em S6.1.
- **ADR-0014** — Brand Reference Pack v1.0 (S1.2). Tipografia hero **Bodoni Moda** com weight adaptativo (500 mobile / 400 desktop), tipografia secundária **Inter** mantida, paleta secundária 4 cores warm derivadas (`--color-salmao-claro` `#FFF1ED`, `--color-areia` `#F0DCC4`, `--color-taupe` `#8A6E5C`, `--color-dourado-claro` `#EFC78B`). `assets/prompts/brand-reference.md` v1.0 como BIOS visual canônico — input obrigatório de toda geração Higgsfield a partir de S1.3. **Atualizado em S1.3 pra v1.1 com §10 persona-tipo + pipeline visual único Nano Banana Pro 2K.**
- **ADR-0015** — Persona-Tipo Modelo Ella + Pipeline Visual Único Nano Banana Pro 2K (S1.3, supersedes ADR-0012, atualiza ADR-0008). Modelo Ella vira persona-tipo prompt-only (sem Soul Character treinado, sem `reference_id`). Nano Banana Pro 2K como modelo único de imagem (Foto 1+2+3 + bg-swap). Cinema Studio mantém pra vídeos. Soul/Flux/Kling/Seedance removidos. Resolução 2K obrigatória. Sub-prompts em `assets/prompts/personas/sub-prompts/{mao,pescoco,orelha,tornozelo}.md`. **Atualização inline 2026-05-06 (S1.4)**: input image obrigatório do catálogo PDF (`--image assets/brand/catalogo-pecas/<slug>.png`) pra toda Foto 1/2/3 do catálogo a partir de S3.1; from-scratch ainda válido pra camadas atemporal e sazonal da Marca. Exceção histórica: `brinco-folha-aberta-semijoia` da S1.4 TB1.

---

## Manutenção de ADRs (precedente registrado 2026-05-05)

- **Edit inline em ADR existente é permitido** quando a mudança é **executiva/tática** (onde, quando, como — ex.: "CI roda em S6.1 em vez de já no Slice 1"). Use uma seção `## Atualização YYYY-MM-DD` no fim da ADR. Histórico fica via `git log` da ADR.
- **Mudança decisória** que invalida ou contradiz a decisão original (o que, por quê — ex.: "trocar Vercel por Cloudflare Pages", "remover camada visual da pirâmide") **exige ADR nova superando**. ADR antiga marcada `Status: superseded by ADR-XXXX`.
- **Em dúvida, trate como decisória** → crie ADR nova. É barato.
- Critério prático pra distinguir: se uma sessão futura do Claude lendo a ADR original tomaria a decisão errada sem ler a atualização, é decisória → ADR nova. Se a atualização só esclarece "como/quando" sem mudar "o quê", é tática → edit inline.
- **Precedente concreto**: 2026-05-05, S1.1 fechada — ADR-0013 ganhou seção "Atualização" sobre execução local-only durante S1.1–S5.x. Política de teste (decisória — quais camadas, qual obrigatoriedade) inalterada; só a porta de execução (tática — local vs CI) mudou. Edit inline aceito por Pak.

---

## Configurações deste projeto

- **Marca**: ELLA Semijoias
- **Fundadora**: Ellen Lopes
- **Issue tracker**: local (`.scratch/`)
- **Path de docs**: `docs/`
- **Labels de triagem**: `bug`, `feature`, `improvement`, `urgent`, `blocked`, `question`
- **DESIGN_VARIANCE**: 7
- **MOTION_INTENSITY**: 8
- **VISUAL_DENSITY**: 3
- **Variante de estilo ativa**: `minimalist-ui` (vocabulário: "warm editorial soft glam")
- **Higgsfield CLI**: instalada e autenticada (`higgsfield auth status` → OK)
- **Modelos Higgsfield** (S1.3 / ADR-0015 — pipeline visual unificado):
  - **Toda imagem do site**: **Nano Banana Pro** (`nano_banana_2`) em **2K obrigatório**
  - **Vídeo aspiracional / hero / microvídeo**: **Cinema Studio**
  - Removidos: Soul (V2/Cinematic/Location), Flux 2/Kontext, Kling, Seedance, GPT Image 2, Soul Character treinado
- **Resolução de imagem**: 2K obrigatório (sub-2K é anti-padrão)
- **Política de créditos**: sem teto (ADR-0001)
- **Pipeline visual**: único via Higgsfield Nano Banana Pro 2K (ADR-0006 + ADR-0015)
- **Persona-tipo escrita**: `assets/prompts/personas/modelo-ella-persona-tipo.md` (master) + `assets/prompts/personas/sub-prompts/{mao,pescoco,orelha,tornozelo}.md`. Mecânica prompt-only — sem Soul Character treinado, sem `data/higgsfield-references.json`.
- **Path de mídia gerada**: `assets/generated/`
- **Path de prompts versionados**: `assets/prompts/`
- **Path de assets de marca**: `assets/brand/` (logo, catálogo PDF como referência)
- **Campanha Atual ativa no lançamento**: Outono 2026 (`outono-2026`)
- **Stack runtime**: Node ≥22 (22 LTS ou 24 current) + TypeScript strict + pnpm
- **Hospedagem**: Vercel free tier
- **Domínio**: a confirmar no grilling

---

## Comportamento em caso de dúvida

1. **Não improvise.** Pergunte.
2. **Não pule etapa "porque o usuário tem pressa".** Pressa produz bola de lama.
3. **Cite este arquivo na pergunta** ("o `CLAUDE.md` exige X aqui — confirma que faço Y antes?").

---

## Lembrete final — 5 gaps que estas regras fecham

1. *O agent não fez o que eu queria* → resolvido por `/grill-with-docs`.
2. *O agent é prolixo* → resolvido por `CONTEXT.md` + `/caveman`.
3. *O código não funciona* → resolvido por `/tdd` + `/diagnose`.
4. *Construímos uma bola de lama* → resolvido por `/improve-codebase-architecture` + ADRs + lapidação contínua.
5. *A apresentação visual estraga o produto* → resolvido por `taste-skill` (minimalist-ui) + `emil-design-eng` + Higgsfield CLI sem teto + pipeline visual único.

Toda regra acima existe pra fechar um desses 5 gaps. Se você se pegar prestes a violar uma, está reabrindo um deles.

**Lapidação é o trabalho. Sempre.**
