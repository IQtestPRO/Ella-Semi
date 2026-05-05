---
title: "S2.1 — /sobre minimal + 5 institucionais com placeholders MDX"
labels: [needs-triage, slice-2]
type: AFK
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0002, 0005, 0007, 0013]
user_stories: [6, 34]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

Construir as 6 páginas institucionais da Marca, todas com **placeholder MDX** (Ellen revisa depois sem deploy de código):

- **`/sobre`**: layout texto + sparkles, **sem retrato** (foto da Ellen Lopes adiada pra S6.1 — pendência #7). Conteúdo:
  - Frase grande tipográfica placeholder ("Joia que conta uma história. ELLA é sobre você." ou similar — pendência #1).
  - Bloco de texto curto: "Sou Ellen Lopes. Prazer em te atender!" + 2-3 parágrafos placeholder editorial sobre fundação, missão, atendimento humano via WhatsApp.
  - Decoração com sparkles SVG inline.

- **`/como-comprar`**: 3 passos visuais (escolha → carrinho → WhatsApp), microvídeos curtos placeholder (entrarão em S5.1 polish), tom amigável, desmistifica não ter checkout.

- **`/cuidados`**: guia de cuidados com banho, armazenamento, limpeza — texto placeholder editorial.

- **`/troca-e-devolucao`**: texto base com placeholders **literais** pra regras da Ellen (pendência #2 + ADR-0011 TODO até Ellen entregar texto literal).

- **`/faq`**: perguntas frequentes sobre banho, durabilidade, alergia, prazos, frete — placeholders.

- **`/contato`**: WhatsApp `wa.link/adq88g` + Instagram + email placeholder.

Todas as 6 páginas em **MDX** (`content/<slug>.mdx`) editável sem deploy de código (Ellen pode pedir alteração via Pak ou aprender Markdown). Layout segue `taste-skill (minimalist-ui)` + `emil-design-eng`. **Footer atualizado** com links reais (não mais placeholders).

## Acceptance criteria

- [ ] Rota `/sobre` renderiza layout texto + sparkles, sem retrato
- [ ] Rotas `/como-comprar`, `/cuidados`, `/troca-e-devolucao`, `/faq`, `/contato` renderizam MDX em `content/<slug>.mdx`
- [ ] Footer atualizado com links reais para todas as 6 rotas
- [ ] Texto placeholder em todas as 6 páginas marcado claramente como placeholder no comentário MDX (pra Ellen identificar onde editar)
- [ ] Integration test snapshot de cada página (renderiza sem erro)
- [ ] Visual regression baselines (mobile + desktop) das 6 páginas
- [ ] A11y axe sem violações em todas
- [ ] Lighthouse mobile ≥ 95 em todas
- [ ] `taste-skill (minimalist-ui)` + `emil-design-eng` aplicadas
- [ ] CONTEXT.md inalterado
- [ ] Pendência Ellen #1 (manifesto da Marca) referenciada no `/sobre` como TODO comment inline
- [ ] Pendência Ellen #2 (regras literais de troca) referenciada em `/troca-e-devolucao` como TODO comment inline + ADR-0011 ainda marcada TODO

## Blocked by

- #0009 (S1.9 Home completa — Footer precisa apontar pra rotas reais)
