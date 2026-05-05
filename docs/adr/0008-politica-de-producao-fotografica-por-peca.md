# ADR-0008 — Política de Produção Fotográfica Uniforme: 3 Fotos por Peça

- **Status**: aceito (revisada em 2026-05-05; substitui versão anterior em tiers)
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)

## Contexto

A versão anterior desta ADR propunha **dois tiers**: top 20 peças destaque com 6 ângulos canônicos + restante com 3 ângulos. A intenção era criar curadoria visível e cortar volume de geração de ~600 para ~360. Pak reviu e decidiu **abandonar a hierarquia**:

- "Toda peça merece o mesmo tratamento."
- A hierarquia em tiers cria peça "mais pobre" que outra na percepção visual — exatamente o oposto do tom warm-editorial-soft-glam.
- A curadoria do que está em destaque na Marca é responsabilidade da **Campanha Atual** (`produtosDestaqueSlugs[]`) e do flag `destaqueHome`, não da fotografia. Misturar curadoria editorial com hierarquia fotográfica polui ambas.
- Ângulos como "peça em mão", "peça em escala/referência" e "lifestyle ambiente livre" estavam adicionando complexidade pra ganhar pouco — cliente final que quer detalhe pode pedir foto extra no WhatsApp.

A política revisada é mais simples, mais uniforme, e tem volume comparável (~270–360 gerações) sem o custo cognitivo do split.

## Decisão

**Toda peça do catálogo recebe exatamente 3 fotos.** Sem tiers, sem hierarquia.

### Foto 1 — Peça em ambiente, foco no produto

- **Modelo Higgsfield**: **Nano Banana Pro** com background em **ambiente warm-editorial** (mesa de mármore, linho cru, madeira clara, luz natural).
- **Não é "isolada em fundo branco"**: é peça em contexto bonito **com produto como protagonista absoluto**.
- Composição: peça centralizada ou em terço superior, profundidade de campo rasa, fundo levemente desfocado mas legível, paleta dentro da BIOS (warm cremes/dourados/rosés).
- Aspect ratio: 4:5 (mobile-first portrait).

### Foto 2 — Peça em ambiente, foco em detalhe

- **Modelo Higgsfield**: **Nano Banana Pro**, macro/close.
- Mostra textura do banho, engaste, brilho, sparkle natural da peça.
- **Mesma família visual da Foto 1** (mesmo ambiente, mesma paleta, mesma luz) — **ângulo e foco diferentes**.
- Aspect ratio: 4:5 ou 1:1 (decidir caso a caso por estética).

### Foto 3 — Modelo Ella usando a peça

- **Modelo Higgsfield**: **Soul** com Soul Character "Modelo Ella" (ADR-0012 fixa a persona).
- Adaptado por categoria:

| Categoria | Recorte da foto | Pose/contexto |
|---|---|---|
| `aneis`, `pulseiras`, `tornozeleiras` (mão), demais peças de mão/pulso | Mão da Modelo Ella, peça em destaque | Mão repousada em superfície warm (mesma família da Foto 1/2) ou gesto natural; manicure neutra |
| `brincos`, `piercings` | Lateral do rosto, orelha em foco | Cabelo arrumado revelando a peça; expressão serena |
| `colares`, `gargantilhas` | Pescoço/decote | Blusa/blazer/seda em tom warm; postura ereta confiante |
| `tornozeleiras` (tornozelo) | Tornozelo | Pose sentada elegante; sapato clássico tonal |
| `conjuntos` | Foco no item principal do conjunto | Ex.: conjunto colar+brinco → pescoço+orelha em meio plano; conjunto pulseira+anel → mãos cruzadas |
| `outros` | Caso a caso | Pak decide durante processamento |

- Aspect ratio: 4:5 (mobile-first), expansível para 9:16 quando vai para hero/destaque com mais respiro.

## Volume estimado

- ~90–120 peças × 3 fotos = **~270–360 gerações Higgsfield** para fotografia de produto.
- Exclui: hero da Marca, hero da Campanha Atual, microvídeos decorativos, Soul Character "Modelo Ella" calibração inicial (~10–20 gerações), Brand Reference Pack (~5 gerações).
- **Total geral Slice 1**: ~310–410 gerações. Política Higgsfield (ADR-0001) cobre.

## Consequências

- **Catálogo visualmente uniforme**: toda peça tem o mesmo peso de apresentação. Hierarquia editorial fica em outro lugar (Campanha Atual, `destaqueHome`).
- **Operação previsível**: sempre 3 prompts por peça, sempre os mesmos modelos por foto. Pipeline batch é trivial de scriptar.
- **Modelo Ella aparece em toda peça**: Soul Character precisa estar maduro **antes** do batch começar — calibração extra justificada (ADR-0012).
- **Galeria do produto**: 3 fotos é o suficiente para galeria swipeable mobile sem cansar o scroll. UI fica enxuta.
- **Sem ângulo "em escala"**: cliente que quer saber tamanho real lê a descrição (`dimensoes`, `peso`) ou pergunta no WhatsApp. Aceito.
- **Sem ângulo "em mão" para colares/brincos**: a Foto 3 cobre o "em modelo" para essas categorias.
- **Volume real provavelmente fica abaixo de 360** — algumas peças do PDF podem ser variantes da mesma peça (mesmo slug, banho diferente) e reusar fotos com bg/cor ajustada via bg-swap.

## Notas

- Esta ADR substitui a versão anterior do mesmo arquivo (`docs/adr/0008-...`). A versão anterior previa 6 ângulos para top 20 peças + 3 ângulos para restante. Diferença essencial: **uniformidade > curadoria fotográfica**.
- Política aplica **apenas à Camada Por Peça** (ADR-0004). Camada Atemporal (Marca) e Camada Sazonal (Campanha) seguem suas próprias regras.
- Cada uma das 3 fotos é gerada com prompt versionado em `assets/prompts/pecas/<slug-da-peca>.md` (template fixo derivado do `brand-reference.md`).
- Manifest registra cada geração com `camada: "por-peca"`, `pecaSlug`, `categoria` (uma de "produto-ambiente", "produto-detalhe", "produto-em-modelo"), modelo, prompt, seed, data.
- Modelo Ella usa Soul Character único, treinado uma vez antes do batch (ADR-0012). Durante geração de Foto 3 de cada peça, prompt referencia o `reference_id` do Soul Character.
- A regra "manicure neutra" da Modelo Ella é importante: aparece em fotos de mão de anel/pulseira; manicure colorida competiria com a peça e quebraria a paleta warm.
