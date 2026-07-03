# Handoff S4 — Painel /admin + Turso + varredura (2026-06-30)

## O que foi feito

### 1. Data layer migrado para Turso (ADR-0021)
- `lib/db.ts` — cliente libsql único (env `TURSO_DATABASE_URL` / `TURSO_AUTH_TOKEN`).
- Tabelas: `products`, `campanha` (id=1), `settings` (chave→JSON), `images` (BLOB).
- `scripts/seed-db.mjs` — importou os 141 produtos + campanha do JSON legado (idempotente; `--force` re-importa).
- `lib/catalog` reescrito **async/DB-backed** (mesma API pública, validação Zod, `cache()` por request).
- Páginas de dados com `export const dynamic = "force-dynamic"` → edição do admin aparece no próximo load.

### 2. Painel /admin (CMS para leigo, pt-BR)
- Login: **AdminEllen / Maritutu3010** (em `.env.local`: `ADMIN_USERNAME`/`ADMIN_PASSWORD`/`SESSION_SECRET`).
- Auth: cookie HMAC (`lib/auth`, Edge-safe) + `middleware.ts` protegendo `/admin` e `/api/admin`.
- Telas: Início (dashboard), Produtos (lista+busca, criar/editar/excluir, fotos, preço, destaques, visibilidade), Campanha (manifesto, mídia, peças em destaque, liga/desliga), Conteúdo do site (Hero, Banner, Sobre, FAQ, Contato/WhatsApp/redes, Rodapé, SEO).
- API: `/api/admin/{login,logout,products,products/[slug],settings,campanha,images}`.

### 3. Upload livre de imagens (ADR-0022)
- `lib/images.ts` — `sharp` (auto-EXIF + resize 1600 + WebP) → BLOB no Turso; servido em `/api/images/[id]`.
- Schema relaxado: `fotos` aceita qualquer quantidade; `fonte` ganha `upload-admin`.

### 4. Varredura total (workflow ultracode, 7 dimensões) + correções aplicadas
- **Crítico**: CTA "Adicionar ao carrinho" do produto era fake → agora adiciona de verdade; foco de teclado global (`:focus-visible`); número WhatsApp editável no admin com salvaguarda anti-placeholder; barra fixa não colide mais com o FAB no mobile.
- **Alto/médio**: `app/sitemap.ts`, `app/robots.ts`, `app/icon.tsx`, `app/opengraph-image.tsx`, AVIF no `next.config`; metadata com title template + OG + canonical; JSON-LD Organization/WebSite + URLs absolutas; Footer 404 corrigido (links via settings); "rolê"→"descer"; subtítulos de categoria atemporais; home mostra grade de destaques + manifesto.

## Estado
- **type-check**: limpo. **Testes**: 171/171 verde (catalog agora integra com Turso).
- E2E manual: login (307→login, 401 senha errada, 200+cookie, /admin protegido), CRUD round-trip (criar→aparece no site→excluir→404), upload protegido (401 sem cookie), slug com acentos OK.

## Para publicar na Vercel
1. Project → Settings → Environment Variables: copiar do `.env.local` →
   `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `ADMIN_USERNAME`, `ADMIN_PASSWORD`,
   `SESSION_SECRET`, `NEXT_PUBLIC_WHATSAPP_NUMBER`, `NEXT_PUBLIC_SITE_URL`.
2. `pnpm build` exige **Node 22 LTS** local (bug WasmHash do Next 15.5 no Node 24). `pnpm dev` roda nos dois.
3. Acessar `/admin` na URL publicada, logar e editar — muda na hora.

## Pontas soltas
- Número de WhatsApp real da Ellen: setar em Conteúdo → Contato (ou env). Enquanto for placeholder, o carrinho cai no link geral `wa.link/adq88g`.
- Imagens ficam no Turso (BLOB). Se o volume crescer muito, migrar `lib/images` para Vercel Blob/R2 sem mudar a interface.
- `pnpm build` real ainda pendente de validar (precisa Node 22 LTS).

---

## S4.1 — Lapidação total + mobile-first wow (2026-07-02)

### Varredura de lapidação (workflow: 7 lentes + verificação adversarial → 46 achados aplicados)
- **Vocabulário de motion da marca**: tokens `--ease-brand` / `--ease-out-soft` no `@theme` + primitivas `.ella-sparkle` (twinkle no hover), `.ella-pop` (feedback sucesso), `.ella-rise` (entrada hero), `.ella-reveal` (on-scroll via `Reveal.tsx`), `.ella-shimmer` (loading). Zero `ease` default sobrando.
- **Cards**: ProductCard com hierarquia de preço + hover dourado #A47525; título clamp; PlaceholderProductImage com prop `aspectClassName` (fim do conflito de aspect); sparkle reage ao hover.
- **Botões/CTAs**: press states (`active:scale`) em tudo; CTA do produto virou pill com preço promocional (rótulo E carrinho); +/− do drawer 44px; empty state do carrinho com sparkle + CTA.
- **Drawer**: `inert` quando fechado (a11y), easing da marca, badge do header com pop ao mudar contagem.
- **Home**: seções com reveal on-scroll; hero com entrada coreografada (stagger 0/120/200ms); Header sticky com blur + **nav** (Colares · Brincos · Anéis · Todas as peças).
- **Produto**: carrossel mobile com snap + contador "1/N"; breadcrumb; reassurance perto do CTA; galeria nunca vazia (placeholder 4:5).
- **Tipografia**: labels uppercase padronizados em 0.16em; line-height 1.15 + text-wrap balance nos headings.

### Higgsfield (Nano Banana Pro 2K + Cinema Studio 3.0)
- **6 cards de categoria** (1:1 2K): `assets/generated/categorias/*.webp` + `public/...` — prompts em `assets/prompts/categorias/cards-categorias-v1.md`, manifest atualizado.
- **Hero mobile 9:16**: imagem 1536×2752 (`hero-fallback-portrait.webp`) + vídeo Cinema Studio 6s 1080p (`hero-loop-portrait.mp4`, comprimido 19,9MB→0,7MB via ffmpeg-static). Art direction: `<picture>` + matchMedia em `Hero.tsx` — celular em pé recebe o par 9:16; se a Ellen trocar o hero no admin, override vale pro desktop e o mobile mantém o par da marca. Prompts em `assets/prompts/hero/hero-mobile-portrait-v1.md`.

### Mobile-first (90% do tráfego)
- `viewport` export: `themeColor #FFD9CC` (browser warm), `viewportFit: cover`.
- Safe-area iPhone: CTA fixo do produto e FAB WhatsApp respeitam `env(safe-area-inset-bottom)`.
- Anti-zoom iOS: todos os inputs/selects ≥16px no mobile (admin `fieldClass`, uploader, footer editor, sort select público).
- `-webkit-tap-highlight-color: transparent` + `touch-action: manipulation` em a/button.
- QA visual: `scripts/mobile-screenshots.mjs` (Playwright 390×844 @2x, com scroll real) — shots em `.scratch/mobile-shots/`.

### Estado: type-check limpo · 171/171 testes · smoke 200 em /, /produtos, /brincos, /admin/login, /sitemap.xml

---

## S4.2 — Produtos REAIS no site (2026-07-02, noite)

- **52 produtos reais** da Ellen cadastrados no Turso a partir de 60 fotos de WhatsApp (`img2-produtcs/`), com matching visual foto↔legenda feito peça a peça (Fable 5 multimodal; lista canônica em `.scratch/produtos-canon.json`, matching em `.scratch/match-result.json`).
- **Campo `codigo`** novo (BR/CO/CH/BRA/PL/CJ + número, ex. CO763): coluna no Turso + Zod + admin + página da peça ("Cód. CO763"). 49 com código; 3 sem código nos prints (brinco meia flor, colar terço cravejado, colar Murano vermelha).
- **Campo `videoUrl`** novo: vídeo de produto como último item da galeria (autoplay muted loop) + campo no admin.
- **Estúdio Higgsfield i2i** (prompts em `assets/prompts/pecas/estudio-produtos-reais-v1.md`): 10 capas lapidadas com a foto real como referência (fidelidade conferida) — 5 substituições (CO15830, BR102, CJ1107, BRA129, CO544) e 5 capas editoriais novas (CJ10642, CJ18161, BRA14671, CO13334, CH006). **3 vídeos Cinema Studio** (CJ10642, CJ18161, BRA14671) comprimidos a ~0,5MB em `public/assets/generated/products/videos/`.
- Teste de contagem do catálogo atualizado (193 = 141 seed + 52 reais). 171/171 verdes.
- **Pendências**: 1 foto sem match (`16.36.50 (3).jpeg` — travertino numerada, peças sem legenda); peças secundárias sem legenda na `16.36.50 (2).jpeg`; decidir destino dos 141 seed sem foto (placeholder) agora que os reais existem.
