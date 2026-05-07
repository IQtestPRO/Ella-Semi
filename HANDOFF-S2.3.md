# Handoff S2.3 — 2026-05-06

> Pak vai reiniciar o PC. Tudo committado e pushed. Próxima sessão começa daqui.

## Estado atual

- **Branch**: `feat/s2.0-reforma-home`
- **HEAD local = origin**: `a0e4d5e`
- **Working tree**: clean (nothing to commit)
- **Tests**: 171/171 verde (Vitest + RTL + jsdom)
- **Typecheck**: OK
- **Servidor (porta 3003)**: testado, 13/15 rotas 200 — 2 timeouts foram lentidão de **dev compilation** (Next 15 + 141 produtos = ~80s primeira request), não erros.

## Como retomar após reiniciar

```powershell
cd "C:\Users\Arthu\Desktop\CLAUD.IA\ELLA PROJECT"
pnpm install        # confere deps (rápido, só valida lockfile)
pnpm dev
```

Se aparecer "porta 3000 ocupada" — sem problema, Next sobe em 3001/3002. Acessa a URL que aparecer no log.

Para forçar 3000:
```powershell
# Se algum processo estiver segurando 3000:
Get-NetTCPConnection -LocalPort 3000 | Select-Object -ExpandProperty OwningProcess | ForEach-Object { Stop-Process -Id $_ -Force }
pnpm dev
```

## Últimos 5 commits da S2.x

| Commit | Slice | Resumo |
|---|---|---|
| `a0e4d5e` | S2.3 polish | Lapidar AddToCartButton + FAB aria-label dinâmico + metadataBase + keyframes globals.css |
| `04b98ad` | S2.3 fix | Hydration mismatch CartButton aria-label (guard isHydrated) |
| `c1e8c8d` | S2.3 | FAB WhatsApp substitui chatbot + ADR-0020 + mobile polish |
| `91250b1` | S2.2 | Carrinho funcional + chatbot Ellen IA (revertido em S2.3) + remove subtítulo MAIS VENDIDOS |
| `03a00ad` | S2.1 | Home encurtada + rota /produtos + Sobre Nós/FAQ |

## Ordem das seções da home (atual)

1. Header (logo central + ícone bag à direita → abre carrinho)
2. Hero (vídeo Higgsfield Cinema Studio, 6s loop)
3. MAIS VENDIDOS (8 peças SEED, sem subtítulo)
4. Banner "Cada peça, uma história em ouro"
5. Explore por Categoria (6 cards)
6. Em destaque agora · Folhas de Outono (canônica)
7. Sobre a ELLA + FAQ (manifesto + accordion 6 perguntas)
8. Footer (4 colunas + microcopy Niterói)

Plus globais (em todas rotas):
- CartDrawer (slide right, abre via header bag)
- WhatsAppFloatButton (FAB bottom-right verde)

## Rotas

- `/` — home
- `/produtos` — todas as peças com filtros + sort
- `/[categoria]` — index categoria (brincos, colares, ...)
- `/[categoria]/[slug]` — página produto individual
- `/privacidade` — política

## ADRs ativas dessa sessão

- **ADR-0016** — Camada placeholder SVG silhouette (S2.0)
- **ADR-0017** — Schema amendment `maisVendido` (S2.0)
- **ADR-0018** — Hero ponte transitória persona-tipo (S2.0)
- **ADR-0019** — ⛔ superseded by ADR-0020 (chatbot removido)
- **ADR-0020** — FAB WhatsApp substitui chatbot (S2.3, atual)

## Pontas soltas conhecidas

- `pnpm build` quebra com Node 24 (`WasmHash` bug Next 15.5). Para deploy Vercel, usar Node 22 LTS. `pnpm dev` funciona em ambos.
- Servidor velho na porta 3000 (PID 24044 quando reportado) — vai morrer no reboot.
- `NEXT_PUBLIC_WHATSAPP_NUMBER` ainda em placeholder `5500000000000`. Quando Ellen passar número real, edita `.env.local` e Vercel env vars.
- `data/products.json` tem 141 peças. 8 marcadas `maisVendido:true` no SEED (Ellen revisa quais são as reais depois). Canônica `brinco-folha-aberta-semijoia` única com 3 fotos reais; resto usa placeholder SVG.
- `pnpm build` teste real ainda pendente (preciso Node 22 LTS pro WasmHash).

## Próximas frentes possíveis (sem ordem)

- Deploy Vercel (precisa Node 22 LTS local pra rodar build).
- Ellen entregar foto-real autorizada → substituir `public/hero/hero-loop.mp4` + `hero-fallback.webp` (mesmas dimensões 1920x1080) + atualizar manifest.
- Ellen marcar peças `maisVendido` reais via edit em `data/products.json`.
- S3.1 batch Higgsfield: gerar 3 fotos por peça pras 131 que estão com placeholder. Utility `extract-catalogo-page.mjs` (planejado) extrai PNG do PDF e usa como `--image` input do Nano Banana Pro 2K.
- Lighthouse + visual regression específico da home reformulada (Playwright specs já criados em `tests/e2e/home-s2.spec.ts`, falta rodar).
