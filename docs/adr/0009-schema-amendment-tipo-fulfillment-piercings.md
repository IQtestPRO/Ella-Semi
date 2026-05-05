# ADR-0009 — Schema Amendment: `tipoFulfillment` substitui `cordaoPersonalizado`; `piercings` no enum de categoria

- **Status**: aceito
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)
- **Supersede parcial de**: ADR-0004 (apenas no schema do `Product`)

## Contexto

ADR-0004 fixou o schema de `data/products.json`. Dois pontos do schema original sofreram crítica durante o grilling:

### Crítica 1 — `cordaoPersonalizado: boolean`
Era um booleano específico para cordões personalizados (gravação de nome, comprimento sob medida, escolha de banho). Implicava regra "pagamento prévio obrigatório" mas só servia pra cordão. Fechado em escopo: peças sob encomenda não-cordão (anel sob medida, pingente personalizado, conjunto montado a pedido) ficam de fora do guard.

Generalização proposta e aceita: substituir por **`tipoFulfillment: 'pronta-entrega' | 'sob-encomenda'`**. Comportamento e UI passam a depender do tipo, não da categoria de peça.

### Crítica 2 — falta de `piercings` no enum
Enum original tinha: `colares | aneis | brincos | pulseiras | conjuntos | gargantilhas | tornozeleiras | outros`. Joalheria moderna inclui `piercings` como categoria de produto distinta (cliente busca por "piercing" especificamente). Ficar em `outros` desclassifica.

## Decisão

### 1. Schema do Product — alterações

**Removido**:
```ts
cordaoPersonalizado: boolean;       // se true, **pagamento prévio obrigatório**
```

**Adicionado**:
```ts
tipoFulfillment: 'pronta-entrega' | 'sob-encomenda'; // default 'pronta-entrega'
```

**Enum `categoria` atualizado** (adiciona `piercings`):
```ts
categoria: 'colares' | 'aneis' | 'brincos' | 'pulseiras' | 'conjuntos'
         | 'gargantilhas' | 'tornozeleiras' | 'piercings' | 'outros';
```

### 2. Comportamento de `tipoFulfillment`

| Valor | Comportamento UI | Comportamento na mensagem WhatsApp |
|---|---|---|
| `'pronta-entrega'` (default) | Sem aviso adicional | Item listado normalmente |
| `'sob-encomenda'` | **Aviso na página da peça** ("Sob encomenda — pagamento prévio") + **aviso no carrinho** (linha do item recebe tag visual) | Linha do item ganha sufixo: `Anel Solitário (banho ouro) — sob encomenda — pagamento prévio — R$ 64,90` |

Aviso UI tem tom calmo e premium (não cria urgência alarmista): "Esta peça é feita sob encomenda. Confirmamos prazo e pagamento prévio com você no WhatsApp."

### 3. Default em produtos sem o campo

Produtos no `products.json` sem o campo explícito devem ser tratados como `'pronta-entrega'`. Migração: ao processar o catálogo PDF, **todas as peças nascem como `'pronta-entrega'`** salvo sinal explícito (texto "sob medida", "personalizado", "gravação", "comprimento personalizado" no PDF — Pak revisa caso a caso durante o processamento).

### 4. Categorias triadas durante processamento do PDF

- Toda peça que parecer "masculina" no catálogo (cordão grosso, pulseira chunky pesada, brinco unisex evidente) cai em `'outros'` + flag pro Pak no relatório de processamento. Pak decide se entra no site (cordões masculinos não entram na Fase 1; público feminino).
- `piercings` só recebe peça que claramente é piercing (helix, tragus, daith, septum, lóbulo simples). Se for brinco com aspecto de piercing mas a Ellen vende como brinco, fica em `brincos`.

## Consequências

- **Schema mais limpo**: um campo enumerado generaliza o que era especial-case-de-cordão.
- **Generalização útil**: anel sob medida, pingente personalizado, conjunto montado a pedido — tudo cabe em `'sob-encomenda'` sem novo campo.
- **UI consistente**: o aviso de "pagamento prévio" passa a ser uma regra de UI ligada a `tipoFulfillment`, não a `categoria`. Componente único cobre todos os casos.
- **Mensagem WhatsApp mais clara para a Ellen**: ela vê na primeira linha quais itens são pronta-entrega e quais exigem prepay, antes mesmo de abrir conversa com o cliente.
- **Migração futura simples**: se Fase 2 introduzir tipos novos (`'pre-venda'`, `'reserva'`), basta estender o enum.
- **`piercings` no catálogo desde o início**: SEO, navegação, filtragem. Cliente que busca "piercings ELLA" não cai no genérico `outros`.

## Notas

- ADR-0004 continua vigente em todo o resto. Apenas estes dois pontos do schema do `Product` ficam superseded por esta ADR.
- Pak vai revisar caso a caso quais peças do catálogo Outono 2026 são `'sob-encomenda'`. A hipótese padrão é "0 peças sob encomenda" salvo evidência no PDF.
- Esta ADR não cria nova UI; apenas declara que a UI existente (página de produto, carrinho, mensagem WhatsApp) **deve respeitar** o campo `tipoFulfillment`. Implementação fica na Slice 1.
