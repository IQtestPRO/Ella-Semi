---
title: "S1.8 — Analytics + Cookie Banner + /privacidade"
labels: [needs-triage, slice-1]
type: AFK
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0005, 0007, 0013]
user_stories: [20, 21, 30]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

Implementar 2 módulos profundos:

- **`Analytics`** (fan-out unificado): `trackEvent(name, payload)` que dispara **Plausible sempre cookie-less** (sem cookie, LGPD-compatível por design) **+ Meta Pixel só quando** `NEXT_PUBLIC_META_PIXEL_ID` está set **E** consent === `'marketing'`. Sem ID, no-op completo no Pixel (script não carrega — `MetaPixelScript()` retorna `null` se ID vazio). ADR-0007 padrão "feature opcional via env var".
- **`Consent`**: estado de cookie consent persistido em `localStorage["ella-consent"]` (`'marketing' | 'essential-only'`); default `essential-only` antes de decisão. `getConsent()`, `setConsent('accept' | 'reject')`, `subscribe`.

Componente **`CookieBanner`**: aparece em primeira visita (sem entry em `ella-consent`), texto curto + 2 botões ("Aceitar"/"Recusar"), some após decisão. Hyperlink "Cookies" no footer reabre.

Rota **`/privacidade`** em MDX (`content/privacidade.mdx`) com texto-base LGPD (placeholders pra Ellen revisar): dados coletados (Plausible: pageviews agregados, sem IP individual; Meta Pixel: events de comportamento se opt-in), retenção, direitos do titular (LGPD art. 18), contato (e-mail/WhatsApp da Ellen — placeholder), data da última atualização.

**Instrumentação retroativa** nas páginas existentes (S1.5–S1.7):
- `view_product` em `ProductPage`
- `add_to_cart` no CTA do `ProductPage`
- `whatsapp_finalize_click` no CTA do `CartPage`
- `view_campaign_page` placeholder (rota `/campanha` não existe ainda — instrumentar quando aparecer em S4.1)

Footer atualizado com link **"Cookies"** + `/privacidade` (este último já existia desde S1.1, agora com conteúdo MDX).

## Acceptance criteria

- [ ] **Módulo `Analytics`** com unit tests: dispara Plausible sempre, dispara Meta Pixel só com ID set + consent marketing, no-op se ID vazio, no-op se consent essential-only
- [ ] **Módulo `Consent`** com unit tests: default `essential-only`, `setConsent('accept')` persiste em `ella-consent`, `setConsent('reject')` idem, subscribe/unsubscribe
- [ ] `CookieBanner` aparece em primeira visita (testado em E2E)
- [ ] "Aceitar" grava `marketing` em `ella-consent` + Meta Pixel passa a disparar (validar com mock do `window.fbq`)
- [ ] "Recusar" grava `essential-only` + Meta Pixel **não dispara** (validar com mock do `window.fbq` que NÃO foi chamado)
- [ ] Hyperlink "Cookies" no footer reabre o banner para revogação
- [ ] Rota `/privacidade` renderiza MDX com texto-base LGPD; ainda placeholders pra Ellen
- [ ] Eventos instrumentados nas páginas existentes: `view_product`, `add_to_cart`, `whatsapp_finalize_click`
- [ ] Integration test `CookieBanner`: primeira visita mostra banner, decisão grava, recarga não mostra mais
- [ ] Env vars validadas: `NEXT_PUBLIC_PLAUSIBLE_DOMAIN`, `NEXT_PUBLIC_META_PIXEL_ID` (opcional — vazio = no-op)
- [ ] A11y axe sem violações no banner + na `/privacidade`
- [ ] Lighthouse mobile ≥ 95 com Plausible script (~1KB) e sem Pixel (no-op)
- [ ] `taste-skill (minimalist-ui)` + `emil-design-eng` aplicadas no banner
- [ ] CONTEXT.md inalterado (termos já documentados em ADR-0007)

## Blocked by

- #0007 (S1.7 Finalização wa.me + /pedido-enviado)
