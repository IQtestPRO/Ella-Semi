# ADR-0005 — Stack: Next.js 15 + Tailwind v4 + Motion + Zustand + Vercel + JSON

- **Status**: aceito
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)

## Contexto

A Fase 1 do projeto Ella é um site-catálogo de joias (mobile-first, sem checkout, finalização via WhatsApp). Requisitos não-funcionais críticos:

- **Performance**: LCP ≤ 2.0s no 4G, CLS ≤ 0.05, INP < 200ms, Lighthouse mobile ≥ 95.
- **SEO**: schema.org `Product`/`Offer`/`BreadcrumbList`/`Organization` em superfícies relevantes; OG image otimizada para preview Instagram.
- **Mobile-first literal**: 375×667 baseline, gestos (swipeable galleries), sticky add-to-cart, bottom sheets.
- **Animação calibrada**: `MOTION_INTENSITY=8`, ≤300ms easing custom, sparkles em momentos chave, gestos da galeria, microcomplexidade na seção da Campanha Atual.
- **Catálogo simples** (ADR-0004): JSON versionado em `data/products.json` + `data/campanha-atual.json`. Sem CMS na Fase 1.
- **Solo founder**: cada decisão de stack precisa minimizar trabalho operacional contínuo (sem servidor pra manter, sem CI custom, sem dependências exóticas).

## Decisão

| Camada | Decisão | Alternativa rejeitada (por quê) |
|---|---|---|
| Framework | **Next.js 15 (App Router)** | Astro (menos integração Image/OG fora-da-caixa); Remix (ecossistema menor para essa carga); Vite + React Router (perde SSR/ISR/`next/image`) |
| Estilização | **Tailwind v4 + componentes shadcn-like (copy-paste)** | CSS Modules (lento pra iterar VISUAL_DENSITY=3 + MOTION_INTENSITY=8); vanilla CSS (mesmo problema); CSS-in-JS (hidratação extra, custo INP) |
| Animação | **Motion (ex-Framer Motion)** | CSS-only (não cobre gesto de swipe da galeria); GSAP (overkill para o escopo, licença comercial) |
| State carrinho | **Zustand com `persist` middleware (`localStorage`)** | Context+reducer (precisaria escrever persist+versionamento à mão); Jotai (overhead pra um único store de carrinho); Redux (boilerplate) |
| Imagens | **`next/image` + Vercel Image** | Cloudinary free (CDN externo, custo extra de config); imagens raw (sem otimização automática) |
| Vídeos | **Vercel Blob ou Cloudflare R2 servindo `<video>` com poster** | YouTube embed (UI feia, branding do YT); Vimeo Pro (custo recorrente) |
| Hospedagem | **Vercel free tier** | Netlify (similar, ecossistema menor para Next); self-hosted VPS (manutenção contínua não justifica) |
| Catálogo | **JSON versionado** (`data/products.json` + `data/campanha-atual.json`) | Sanity Studio (fora de escopo Fase 1 — rever em Fase 2 se Ellen quiser autonomia editorial); Contentful (mesmo motivo + paid) |
| Fontes | **Google Fonts via `next/font` (display swap)** | Self-host estático (mesmo resultado, mais setup); Adobe Fonts (custo recorrente) |
| Runtime | **Node 22 LTS (mín) ou 24 (current stable)** — `package.json` `engines.node: ">=22.0.0"`; `.nvmrc` "lts/jod" como floor recomendado para contributors; **Vercel produção usa 22 LTS por estabilidade**; local pode rodar 22 ou 24 sem fricção. Atualizado em 2026-05-05 (S1.1 setup) — a versão original "Node 22 LTS" estrita foi flexibilizada para evitar fricção com Node 24 already-stable. | Node 20 LTS (também válido, mas 22+ é o piso); Bun runtime (próprio framework não suporta nativo Vercel) |
| TypeScript | **`strict: true`** | non-strict (perde garantias do compilador na Fase 1) |
| Package manager | **pnpm** | npm (mais lento, lockfile menos determinístico); Yarn classic (legado); Bun (não maduro para package management Next.js) |

## Consequências

- **Stack monocultura Vercel**: hospedagem + Image + Blob + edge — facilita deploy e free tier cobre Fase 1, mas cria lock-in. Migração futura é possível mas custosa. Aceito.
- **Tailwind v4** ainda é versão recente (2025–2026). Pode haver pequenos rough-edges em integração com shadcn (que historicamente é v3). Mitigação: usar tokens de Tailwind v4 nativos e copy-paste só os componentes que valham, adaptando à v4.
- **Motion não-livre para uso comercial é falso** — confirmar licença atual da fork pós-Framer (era MIT na época Framer Motion, manteve-se com fork "Motion"). Risk-flag para checagem antes do primeiro `pnpm add`.
- **Zustand `persist` precisa de schema versioning** explicitado no carrinho (já especificado: `ella-cart-v1`). Mudança de schema futura requer migração escrita à mão.
- **`next/font`** evita CLS mas exige saber a fonte exata antes de codar (decisão de tipografia, ainda em aberto no grilling).
- **JSON catálogo sem CMS** significa que toda alteração de produto exige commit + deploy. Aceitável na Fase 1 (frequência baixa, Pak/Ellen iteram juntos). Em Fase 2, migrar pra Sanity vira ADR superando este ponto desta ADR.

## Notas

- Análises de bundle/performance acontecerão durante o desenvolvimento, não preventivamente — Lighthouse mobile ≥ 95 é critério de aceitação por página, não meta global negociável.
- Se algum item da stack se mostrar sub-ótimo na Slice 1, abrir ADR superando este ponto. Não fazer "swaps escondidos" sem ADR.
