---
title: "D1 — Processamento do catálogo PDF Outono 2026 → data/products.json"
labels: [needs-triage, data-prep]
type: HITL
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0004, 0006, 0008, 0009]
notes: "Não é /tdd. Etapa de dados explícita entre /to-issues e /tdd da Slice 3. Pak cola prompt dedicado quando esta issue for pega."
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias (seção "Etapa de dados").

## What to build

**Etapa de dados explícita — não é `/tdd`.** Pak vai colar prompt dedicado quando esta issue for pega.

**Input**: `assets/brand/catalogo-outono-2026.pdf` (24 páginas, 31MB, formato Canva).

**Outputs**:

1. **`data/products.json`** populado com **~90–120 peças** seguindo schema completo da ADR-0009:
   - `slug` atemporal (kebab-case, sem ano/estação no path), `nome`, `categoria` (enum 9 valores), `banho`, `tipo` (`semijoia` | `bijuteria`), `precoCents`, `precoPromocionalCents?`, `descricao` (stub editorial inicial), `fotos[]` (paths placeholder até batch Higgsfield rodar em S3.1), `variantes?`, `tags?`, `promocao` (boolean), `tipoFulfillment` (default `'pronta-entrega'`), `destaqueHome` (boolean — começa em `false` para todas exceto a peça canônica de S1.4), `ativo: true`, `origem.{catalogoArquivo: 'catalogo-outono-2026.pdf', pagina, letra}` para rastreabilidade, `cadastradoEm`, `atualizadoEm`.

2. **Imagens fonte rasterizadas/recortadas** das peças do PDF, salvas em `assets/brand/source-pdf-pages/<pagina>-<letra>.png` (input pra bg-swap Higgsfield em S3.1).

3. **Relatório de processamento** em `.scratch/processamento-catalogo-2026-05-XX.md`:
   - Total processado por categoria.
   - **Peças com foto-fonte questionável** (foco mole / luz dura / ambiguidade) — Pak revisa caso a caso, decide se gera do zero ou pede foto melhor pra Ellen.
   - **Peças que parecem masculinas** em `'outros'` + flag pra Pak decidir se entram (cordões grossos, pulseiras chunky pesadas).
   - **Peças `tipoFulfillment: 'sob-encomenda'`** se houver sinal no PDF (texto "personalizado" / "sob medida" / "gravação").
   - **Pendências para Ellen** atualizadas em `.scratch/perguntas-ellen.md` (itens 3, 10, 11, 12): peças com múltiplos banhos detectados, descrições editoriais que precisam input humano, etc.

**Sem unit tests** — saída é dado humano-revisado, não código runtime. **Sem CI checks novos** além de schema validation Zod do JSON. **Não toca código de runtime existente.**

Pak revisa o relatório e aprova/ajusta antes de S3.1 (Catálogo completo) começar.

## Acceptance criteria

- [ ] Pak cola prompt dedicado pra processamento (issue documenta o prompt usado nos comments)
- [ ] `data/products.json` populado com ~90–120 peças, schema válido conforme ADR-0009
- [ ] `assets/brand/source-pdf-pages/<pagina>-<letra>.png` para cada peça (input pra bg-swap futuro)
- [ ] `.scratch/processamento-catalogo-2026-05-XX.md` com relatório completo: total por categoria, peças questionáveis, masculinas, sob-encomenda, pendências Ellen
- [ ] **HITL**: Pak revisa relatório peça-a-peça (ou amostragem ampla) e aprova / pede ajustes antes de fechar issue
- [ ] `data/products.json` valida contra schema Zod — schema test em Vitest valida estrutura
- [ ] Sem mudanças em código runtime; só dados e referências
- [ ] CONTEXT.md inalterado (termos já documentados)
- [ ] Pendências da Ellen (itens 3, 10, 11, 12 de `.scratch/perguntas-ellen.md`) atualizadas com observações concretas do relatório
- [ ] `data/products.json` com peça canônica de S1.4 preservada (mantém `destaqueHome: true`)

## Blocked by

- #0004 (S1.4 Catálogo demo — schema do produto e Soul Character precisam estar definidos)
