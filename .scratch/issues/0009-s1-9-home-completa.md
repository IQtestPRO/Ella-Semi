---
title: "S1.9 — Home completa: Hero da Marca + Campanha Atual + Favoritas + Sobre + Footer"
labels: [needs-triage, slice-1]
type: HITL
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0001, 0004, 0005, 0006, 0007, 0008, 0012, 0013]
user_stories: [1, 2, 3, 4, 5, 6, 22, 23, 24]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

Construir a **home completa** da Marca ELLA, fechando a Slice 1 da PRD. Componentes:

- **`HomeHero`**: vídeo Cinema Studio 8–12s (autoplay/mute/loop/playsInline, fullbleed mobile via `object-cover`, **poster** otimizado para zero CLS), gerado via Higgsfield Cinema Studio com Modelo Ella + sparkles em momento chave (mood warm-editorial, golden hour, peça da Marca em destaque — não vinculado a Campanha). Manifesto eternal **placeholder** ("Joia que conta uma história. ELLA é sobre você." ou similar — Ellen revisa em S6).
- **`CampaignSection`**: banner com vídeo Cinema Studio Outono 2026 + manifesto literal da Ellen (do PDF) + ctaTexto "Ver peças desta estação" levando pra `/colares/<slug-da-peca-canonica>` como **fallback de Slice 1** (rota `/campanha` real chega em S4.1; link atualiza nessa altura).
- **`FeaturedProducts`** ("Favoritas da Ella"): lê `destaqueHome: true` de `data/products.json` (só tem 1 peça com flag true em S1.4, mostra ela + 3 cards "em breve" como placeholder visual).
- **`AboutShort`**: texto placeholder ("Sou Ellen Lopes. Prazer em te atender!" + 2-3 parágrafos de placeholder editorial).
- **`FooterRich`**: links para Instagram, /sobre (placeholder até S2.1), /como-comprar (placeholder), /cuidados (placeholder), /troca-e-devolucao (placeholder), /faq (placeholder), /contato (placeholder), /privacidade (real), Cookies (reabre banner).
- **`WhatsAppFloatingButton`**: botão flutuante no canto inferior linkando `wa.link/adq88g` (atendimento geral, sem text param).
- **Sparkles SVG inline** em momentos chave (HomeHero, CampaignSection transition), com `prefers-reduced-motion` respeitado (animação some).

**HITL**: Pak revisa visualmente os 2 vídeos Cinema Studio (hero da Marca + hero da Campanha) antes de mergear. Política Higgsfield ADR-0001 cobre.

Tracking: `view_campaign_page` placeholder até /campanha existir em S4.1 (instrumentação de S1.8 já preparada).

`taste-skill (minimalist-ui)` + `emil-design-eng` aplicadas em toda UI da home. Visual regression baseline da home (mobile + desktop) committada.

## Acceptance criteria

- [ ] **Higgsfield Cinema Studio**: 1 vídeo hero da Marca (8–12s, fullbleed mobile, autoplay/mute/loop) gerado, prompts versionados em `assets/prompts/`, manifest atualizado camada `atemporal`
- [ ] **Higgsfield Cinema Studio**: 1 vídeo hero da Campanha Atual Outono 2026 gerado (curto, ~8s), prompts versionados, manifest atualizado camada `sazonal`
- [ ] **HITL**: Pak revisa e aprova ambos os vídeos no PR antes de mergear
- [ ] `HomeHero` renderiza vídeo + manifesto placeholder + sparkles
- [ ] `CampaignSection` renderiza vídeo Outono 2026 + manifesto literal Ellen + CTA "Ver peças desta estação"
- [ ] `FeaturedProducts` lê `destaqueHome: true` e renderiza peça canônica + 3 cards placeholder "em breve"
- [ ] `AboutShort` com texto placeholder
- [ ] `FooterRich` com todos os links (alguns placeholders, mas presentes)
- [ ] `WhatsAppFloatingButton` linkando `wa.link/adq88g`
- [ ] Sparkles em pontos chave; `prefers-reduced-motion` respeitado (animação some)
- [ ] Integration test home: renderiza todos os componentes, link do FooterRich funcional
- [ ] **E2E final Slice 1**: home → click CTA da Campanha (ou featured product) → produto canônico → adicionar carrinho → /carrinho → finalizar → /pedido-enviado/PED-XXXXXX
- [ ] Visual regression baselines da home (mobile 375×667 + desktop 1280×800), com vídeos masked ou poster estático em test mode
- [ ] A11y axe sem violações
- [ ] Lighthouse mobile ≥ 95 (vídeo hero não pode quebrar LCP — usar `<video preload="metadata">` + poster otimizado, considerar `loading="lazy"` em vídeos abaixo do fold)
- [ ] `taste-skill (minimalist-ui)` + `emil-design-eng` aplicadas
- [ ] CONTEXT.md inalterado
- [ ] **Critério de release Slice 1**: todas as 7 camadas de teste de ADR-0013 passando no CI; deploy Vercel com `vercel.app` subdomínio navegável end-to-end

## Blocked by

- #0008 (S1.8 Analytics + Cookie Banner + /privacidade)
