# ADR-0021 — Data layer Turso + painel /admin (CMS para a Ellen)

- **Status**: aceito
- **Data**: 2026-06-30
- **Decisor**: Pak (com Claude)
- **Slice de origem**: S4 (admin)
- **Supersedes**: ADR-0004 e ADR-0005 **no ponto específico** "JSON versionado como
  armazenamento de produção". Mantém todo o resto dessas ADRs (modelo de dados,
  stack Next/Tailwind/Motion/Zustand/Vercel).

## Contexto

O catálogo e o conteúdo do site eram arquivos JSON de build-time
(`data/products.json` + `data/campanha-atual.json`), lidos de forma síncrona por
`lib/catalog`. Editar exigia mexer no repositório e fazer deploy — inacessível
para a Ellen, que não é técnica.

Pak pediu um **/admin onde uma pessoa leiga controla tudo do site** (produtos,
campanha, banners, "sobre mim", FAQ, WhatsApp, rodapé, SEO) e as mudanças
**aparecem no site automaticamente**, inclusive na versão publicada na Vercel
(onde o filesystem é read-only em runtime — não dá pra gravar JSON).

## Decisão

1. **Turso (libsql) como source of truth.** `lib/db.ts` cria um cliente único a
   partir de `TURSO_DATABASE_URL`/`TURSO_AUTH_TOKEN`. Tabelas: `products`,
   `campanha` (linha única id=1), `settings` (chave→JSON), `images` (BLOB).
2. **`lib/catalog` vira async/DB-backed**, mantendo a MESMA API pública (agora
   `Promise`), com validação Zod na leitura e memoização por request via React
   `cache()`. Server Components fazem `await`. Páginas de dados usam
   `export const dynamic = "force-dynamic"` → toda edição aparece no próximo
   carregamento, sem plumbing de revalidação (as mutações ainda chamam
   `revalidatePath` como reforço).
3. **Camada `settings` (CMS)** em `lib/settings`: cada chave (hero, bannerMeio,
   sobre, faq, footer, marca, seo) tem schema Zod + DEFAULT igual ao conteúdo
   hardcoded original. Componentes públicos (Hero, BannerMeio, SobreNos, Footer)
   passam a ler dessas settings; o número de WhatsApp chega aos Client Components
   via `SiteConfigProvider`.
4. **Auth do /admin**: sessão por cookie HMAC-assinado (`lib/auth`, Edge-safe via
   Web Crypto), `middleware.ts` protege `/admin` e `/api/admin`. Credenciais e
   segredo em env vars (`ADMIN_USERNAME`, `ADMIN_PASSWORD`, `SESSION_SECRET`).
5. **Seed único** (`scripts/seed-db.mjs`) importa os 141 produtos + campanha do
   JSON legado uma vez (idempotente, guarda anti-clobber). Os JSON legados
   permanecem no repo como semente/histórico, não como fonte de produção.

## Consequências

- Local e produção compartilham o mesmo banco Turso (uma fonte de verdade). As
  env vars vão no `.env.local` (gitignored) e nas Environment Variables da Vercel.
- `force-dynamic` troca cache estático por leitura por request — aceitável para um
  catálogo boutique; garante "atualiza na hora" sem risco de página velha.
- `data/*.json` deixam de ser editados em produção. Continuam válidos como seed.
- Reversível: o JSON legado e o seed permitem reconstruir o estado inicial.

## Manutenção de ADRs

Decisória (muda "o quê/por quê" do armazenamento) → ADR nova superando, conforme
a regra do `CLAUDE.md`. ADR-0004/0005 ficam marcadas como superseded **apenas no
ponto de armazenamento**; o modelo de dados e a stack seguem vigentes.
