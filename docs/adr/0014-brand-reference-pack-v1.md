# ADR-0014 — Brand Reference Pack v1.0: tipografia hero + secundária + paleta secundária

- **Status**: aceito
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)
- **Slice de origem**: S1.2

## Contexto

A S1.1 entregou o esqueleto Next.js 15 com paleta primária pixel-amostrada da logo (`#FFD9CC`, `#D99A30`, `#251008` — ADR-0003 atualizada) e tipografia hero placeholder `DM Serif Display` apontada para "decidir em S1.2". A S1.2 fecha essas decisões de fundação visual e formaliza um **Brand Reference Pack** versionado que serve de input obrigatório de toda produção visual via Higgsfield CLI a partir de S1.3.

Ausência dessas decisões num só lugar versionado bloqueia tudo que vem depois:
- Geração de mídia Higgsfield drifta sem BIOS visual escrita;
- Componentes de UI das próximas slices não têm tokens semânticos de cor além das 3 primárias;
- Drift tipográfico potencial entre páginas se a fonte hero não estiver fixada.

S1.2 resolve com 5 decisões discretas registradas nesta ADR.

## Decisão

### 1. Tipografia hero — Bodoni Moda (Google Fonts)

Das 5 candidatas Didone-ish testadas (DM Serif Display, Bodoni Moda, Italiana, Cormorant Garamond, Playfair Display) num mockup gerado em `assets/brand/font-comparison.png` (S1.2 TB1, HTML+Playwright screenshot), **Bodoni Moda** foi escolhida por:

- Replica o contraste vertical extremo entre traços grossos e hairlines da logo bitmap;
- Estrutura de serif do "E" e proporção do "L" alinham com o lettering custom da logo;
- Mantém peso harmônico com a logo aplicada em escala pequena (header) e grande (hero).

Carregamento via `next/font/google` em `app/layout.tsx`, pesos `["400", "500"]`, subsets latin + latin-ext, display swap.

**Limitação aceita**: o "A" da logo tem perna alongada cursiva (custom lettering). Bodoni Moda tem "A" reto convencional. Decisão estética: logo aparece pequena no header como assinatura, "ELLA" tipografado em Bodoni grande no hero — mesma família visual, não cópia exata. Vetorização da logo com perna custom fica pra Fase 2 (ADR-0003 mantém).

### 2. Weight adaptativo mobile vs desktop

- **Mobile** (`max-width: 640px`): `font-weight: 500`. Hairlines de Bodoni são frágeis em LCD pequeno; weight 500 engrossa pra renderizar bem sem perder estilo.
- **Desktop** (`min-width: 641px`): `font-weight: 400`. Full contraste vertical Didone preservado.

Implementado em `app/globals.css` via media query mobile-first. Cobertura E2E em `tests/e2e/home.spec.ts` valida `getComputedStyle.fontWeight` por viewport.

### 3. Tipografia secundária — Inter (mantida)

Das alternativas avaliadas (Outfit, DM Sans, Manrope), Inter foi mantida por:

- Pareamento canônico: serif editorial alto contraste (Bodoni) + sans neutra humanista (Inter). Universo de referência (Mejuri, Catbird, Sézane) usa variantes desse padrão;
- Já cabeada em S1.1, sem custo de migração;
- Subset latin completo, suporte robusto a português, rendering consistente cross-platform.

Carregamento via `next/font/google` em `app/layout.tsx`, variable font, subset latin, display swap.

### 4. Paleta secundária — 4 cores warm derivadas

Tokens registrados em `app/globals.css` via `@theme` (Tailwind v4 native — não usa `tailwind.config.ts`):

| Token | Hex | HSL | Uso |
|---|---|---|---|
| `--color-salmao-claro` | `#FFF1ED` | hsl(15°, 100%, 96%) | Superfícies elevadas, cards, modais |
| `--color-areia` | `#F0DCC4` | hsl(30°, 60%, 85%) | Sub-superfícies, backgrounds alternativos |
| `--color-taupe` | `#8A6E5C` | hsl(25°, 21%, 45%) | Texto secundário, dividers, borders sutis |
| `--color-dourado-claro` | `#EFC78B` | hsl(35°, 75%, 74%) | Accent secundário, hover states, badges |

Coerência cromática: todos os hues entre 15-35° (warm rosa-laranja). Permite combinar 2-3 superfícies por tela sem competir.

Cobertura E2E em `tests/e2e/home.spec.ts` valida que cada token está disponível via `getPropertyValue` no `:root`.

### 5. Brand Reference Pack v1.0 como BIOS visual canônico

`assets/prompts/brand-reference.md` v1.0 codifica:

- Identidade da marca, tom canônico ("warm editorial soft glam"), universo de referência;
- Paleta primária + secundária com hex, HSL, uso, anti-cores explícitas;
- Tipografia hero + secundária com fallbacks e razão de escolha;
- Motifs (sparkle SVG, perna alongada do "A");
- Mood / atmosfera (iluminação, texturas, composição, vibe geral);
- Anti-prompts categorizados (estética, pessoa, joia, iluminação);
- Templates de prompt por modelo Higgsfield (Nano Banana Pro, Soul, Cinema Studio, background swap, Seedance);
- Manifest crosslink (`brandReferenceVersion` registrado em cada geração);
- Versão e histórico.

Cobertura unit em `tests/unit/brand-reference.test.ts` (8 testes) valida existência, frontmatter, 9 seções obrigatórias, decisões fechadas e anti-prompts presentes.

## Consequências

### Imediatas
- S1.3 (Soul Character "Modelo Ella") herda o pack como input obrigatório.
- Toda geração Higgsfield futura registra `brandReferenceVersion: "1.0"` em `assets/generated/manifest.json` — auditoria de drift cross-versão fica viável.
- Componentes de UI das próximas slices (S1.4+) já têm 7 tokens semânticos de cor (`--color-*`) e 2 de tipografia (`--font-hero`/`--font-body`) cabeados.

### Aceitas
- Drift tipográfico residual entre logo bitmap (lettering custom) e hero tipografado (Bodoni Moda). Resolvido só com vetorização Fase 2 (ADR-0003).
- Threshold visual regression continua em 2% pra absorver micro-diferenças de font rasterization (legado da decisão tática em ADR-0013).

### Inegociáveis (mudança exige ADR superando)
- **Esta ADR é o documento canônico das decisões visuais de fundação.** Mudar tipografia hero, secundária ou paleta secundária exige ADR nova superando ADR-0014. O pack v1.0 (`assets/prompts/brand-reference.md`) acompanha a versão da ADR.

## Notas

- Mockup de comparison persistido em `assets/brand/font-comparison.png` + reproduzível via `node scripts/generate-font-comparison.mjs`. HTML editável em `scripts/font-comparison.html` se for preciso reabrir comparison com outras candidatas em ADR futura.
- Decisão Pak (HITL) registrada no chat do Claude Code, não em PR (S1.2 fica em local-only branch — sem PR até S6.1, conforme issue 0018 / atualização ADR-0013).
- Próxima evolução esperada do pack: v2.0 quando catálogo crescer e padrões de prompt se consolidarem (provável S3+).
