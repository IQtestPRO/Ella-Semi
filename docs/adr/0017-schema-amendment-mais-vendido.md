# ADR-0017 — Schema Amendment: `maisVendido`; corte de `destaque`; naming `products.json` mantido

- **Status**: aceito
- **Data**: 2026-05-06
- **Decisor**: Pak (com Claude)
- **Slice de origem**: S2.0
- **Supersede parcial de**: ADR-0004 (schema `Product`); ADR-0009 (extensão schema)

## Contexto

S2.0 introduz seção "MAIS VENDIDOS" na home — peças que mais saem na loja física da Ellen. Dado externo objetivo (histórico real de venda), distinto de curadoria editorial subjetiva.

Plano original da S2.0 propunha **dois campos novos** (`maisVendido`, `destaque`) + manter `destaqueHome`. Grilling identificou:

1. `destaqueHome` (ADR-0004) já cumpre função curatorial → seção "Favoritas da Ella".
2. `destaque` proposto era "placeholder pra futuro" — sem semântica clara, sem dono, sem surface UI definida.
3. Plano colidia palavra "favorit*" em duas seções (`maisVendido` rotulado como "favoritos da loja" + `destaqueHome` rotulado "Favoritas da Ella").
4. Plano escrevia `data/produtos.json` (pt) — inconsistente com `data/products.json` (en) que existe no repo, com ADR-0004, ADR-0009, CONTEXT.md, e todos os imports.

## Decisão

### 1. Adicionar `maisVendido: boolean` ao schema

```ts
maisVendido: boolean; // default false. Histórico de venda real da loja física da Ellen.
```

Default `false`. Marcação manual da Ellen baseada em dados de venda físicos.

### 2. NÃO adicionar `destaque: boolean`

Abstração além do que a tarefa requer (CLAUDE.md veta). Quando demanda concreta de curadoria editorial nova surgir, cria flag específica nascida do problema real (ex: `heroPick`, `colecaoCapsula`).

### 3. Manter `destaqueHome` intacto

Semântica preservada → seção "Favoritas da Ella" da home. Independente de `maisVendido` e da Campanha Atual.

### 4. Manter `data/products.json` em inglês

Não renomear pra `produtos.json`. Renomear cascataria em todos os imports + exigiria ADR superando ADR-0004 sem ganho real.

### 5. Separação semântica das duas seções da home

| Surface UI | Campo | Semântica | Quem marca |
|---|---|---|---|
| **MAIS VENDIDOS** (sub: "o que mais sai na loja física") | `maisVendido: true` | dado objetivo loja física | Ellen via histórico de venda |
| **Favoritas da Ella** | `destaqueHome: true` | curadoria editorial subjetiva | Ellen via gosto pessoal |

Palavra "favorit*" reservada apenas pra seção curatorial (`destaqueHome`).

## Consequências

- Schema S2.0 com **2 flags de destaque** (não 3).
- 10 peças existentes recebem `maisVendido: false` no backfill explícito.
- Peças novas (popular catálogo PDF S2.0) nascem com `maisVendido: false` por default.
- Marcação inicial das ~8 peças com `maisVendido: true` SEED é decisão da Ellen — ou Claude marca SEED inicial mix de categorias e faixas de preço.
- UI das duas seções (MAIS VENDIDOS + Favoritas da Ella) implementada em commits subsequentes da S2.0.

## Notas

- ADR-0009 continua vigente exceto pela extensão do schema `Product`.
- Typo `produtos.json` no plano da sessão registrado aqui como correção pra evitar repetição em sessões futuras.
- Esta ADR não introduz UI; declara apenas o schema.
- Próxima slice (S2.0 segunda metade) constrói as duas seções da home consumindo os 2 campos.
