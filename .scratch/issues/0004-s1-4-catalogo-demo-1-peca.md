---
title: "S1.4 — Catálogo demo: 1 peça emblemática + 3 fotos + JSONs populados"
labels: [needs-triage, slice-1]
type: "HITL leve + AFK"
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0001, 0004, 0006, 0008, 0009, 0012, 0013]
user_stories: [7, 38, 39]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

Pak escolhe a **peça canônica** de demo a partir do catálogo PDF (sugestões: colar veneziana banho ouro, anel solitário, brinco argola — peça identitária warm-editorial; HITL leve ~5 min). Geração de **3 fotos Higgsfield** para a peça escolhida conforme **ADR-0008**:
- **Foto 1**: Nano Banana Pro, ambiente warm-editorial (mesa de mármore / linho cru / madeira clara), foco-produto.
- **Foto 2**: Nano Banana Pro, macro/close, mesma família visual da Foto 1, foco em detalhe (textura do banho, engaste, brilho).
- **Foto 3**: Soul + `reference_id` da Modelo Ella (ADR-0012) usando a peça, recorte adaptado por categoria (mão para anel/pulseira, lateral do rosto para brinco, pescoço para colar, etc.).

Implementação dos **3 módulos profundos puros** (com unit tests):
- **`Product Catalog`**: lê `data/products.json` + `data/campanha-atual.json` em build, expõe `getAllProducts`, `getProductBySlug`, `getProductsByCategory`, `getCampanhaAtual`, `getProductsDestaque`.
- **`Currency Format`**: `formatBRL(precoCents)` → "R$ XX,XX" BRL.
- **`Slug & Routing`**: `slugify`, `isValidProductSlug`, `categoryFromSlug`.

`data/products.json` populado com **a peça canônica** (schema completo conforme ADR-0009: slug atemporal, nome, categoria, banho, tipo, `precoCents`, `descricao`, `fotos[]` com paths, `variantes` se aplicável, `tags`, `promocao`, `tipoFulfillment` (provavelmente `'pronta-entrega'`), `destaqueHome: true`, `ativo: true`, `origem.{catalogoArquivo, pagina, letra}`, `cadastradoEm`, `atualizadoEm`).

`data/campanha-atual.json` populado com Outono 2026: `slug: "outono-2026"`, `nomeExibicao: "Outono na ELLA"`, `manifesto` literal da Ellen, `ctaTexto: "Ver peças desta estação"`, `produtosDestaqueSlugs: [<slug-da-peca>]`, `ativa: true`. Manifest atualizado com 3 entries `camada: "por-peca"`. Prompts de cada foto versionados em `assets/prompts/pecas/<slug>.md`.

## Acceptance criteria

- [ ] **HITL leve**: Pak escolhe e confirma peça canônica no PR (~5 min de decisão)
- [ ] 3 gerações Higgsfield para a peça (Foto 1, 2, 3 conforme ADR-0008)
- [ ] `data/products.json` contém 1 peça com schema completo (todos os campos da ADR-0004 + ADR-0009)
- [ ] `data/campanha-atual.json` populado com Outono 2026 + manifesto literal + `produtosDestaqueSlugs` + `ativa: true`
- [ ] `assets/generated/manifest.json` atualizado com 3 entries `camada: "por-peca"`, slug correto
- [ ] `assets/prompts/pecas/<slug>.md` versionado com os 3 prompts usados
- [ ] **Módulo `Product Catalog`** com unit tests: `getAllProducts`, `getProductBySlug`, `getProductsByCategory`, `getCampanhaAtual`, `getProductsDestaque`, edge cases (slug inválido, categoria vazia)
- [ ] **Módulo `Currency Format`** com unit tests: `formatBRL(0)` → "R$ 0,00", `formatBRL(8990)` → "R$ 89,90", `formatBRL(100000)` → "R$ 1.000,00", edge cases
- [ ] **Módulo `Slug & Routing`** com unit tests: `slugify`, `isValidProductSlug`, `categoryFromSlug`, edge cases (acentos, slugs reservados)
- [ ] Schema validation Zod (ou similar) no products.json + campanha-atual.json passando
- [ ] Coverage dos 3 módulos profundos ≥ 90% branches críticos
- [ ] Sem nova UI nesta slice (só dado/módulo); UI vem em S1.5
- [ ] CONTEXT.md inalterado

## Blocked by

- #0003 (S1.3 Soul Character "Modelo Ella")
