---
title: "S3.2 — Busca + ordenação no catálogo"
labels: [needs-triage, slice-3]
type: AFK
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0005, 0013]
user_stories: [5, 7, 9]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

### Busca global

Componente de **busca global** com input no header:
- **Mobile**: ícone de busca que abre overlay full-screen com input + lista de resultados.
- **Desktop**: input expansível inline no header.

**Matching**: busca em `nome`, `descricao`, `tags`, `categoria` de `data/products.json`. Implementação simples (filter em JS — catálogo de ~120 peças cabe em memória sem indexer). **Debounce 200ms** para evitar reflow excessivo.

**Resultados**: dropdown live tipo command-palette com até 8 sugestões + link "Ver todos os resultados" (rota dedicada `/busca?q=<termo>`). Highlighting opcional do termo buscado nos resultados.

**Acessibilidade**:
- Input com `aria-label="Buscar peças"` e `role="combobox"`.
- Lista de resultados com `role="listbox"`, items com `role="option"`.
- Navegação por teclado: ↑/↓ (navega), Enter (seleciona), Esc (fecha).
- Foco gerenciado corretamente (input → lista → produto).

### Ordenação

Em cada rota de categoria (S3.1): **dropdown de ordenação** com opções:
- "Relevância" (default — ordem do `data/products.json`)
- "Preço crescente" (ascending por `precoCents`)
- "Preço decrescente" (descending)
- "Lançamentos" (descending por `cadastradoEm`)

**Persistência da ordenação em URL query param**: `/colares?ordem=preco-asc`. Mudança de ordenação não recarrega página (client-side com router.replace). Combinável com filtros de S3.1.

## Acceptance criteria

- [ ] Componente de busca renderiza no header (mobile: overlay; desktop: inline expansível)
- [ ] Busca funciona em `nome` / `descricao` / `tags` / `categoria` com debounce 200ms
- [ ] Resultados em dropdown live (max 8 sugestões + link "Ver todos") OU rota `/busca?q=`
- [ ] Navegação por teclado funcional (↑/↓/Enter/Esc, foco correto)
- [ ] Ordenação dropdown em cada rota de categoria com 4 opções (Relevância, Preço asc, Preço desc, Lançamentos)
- [ ] Ordem persiste em URL (`?ordem=preco-asc`); navegação via histórico do browser respeita estado
- [ ] Combinação de busca/ordenação/filtros funciona corretamente
- [ ] Integration tests: busca encontra peça correta por nome/tag, ordenação por preço crescente/decrescente, busca combinada com filtros
- [ ] E2E: digita termo no header → vê sugestões → clica → vai pra produto
- [ ] A11y axe sem violações no input + dropdown
- [ ] Lighthouse mobile ≥ 95
- [ ] `taste-skill (minimalist-ui)` + `emil-design-eng` aplicadas (motion do dropdown ≤300ms easing custom; foco visível)
- [ ] CONTEXT.md inalterado

## Blocked by

- #0012 (S3.1 Catálogo completo — rotas e produtos disponíveis pra filtrar)
