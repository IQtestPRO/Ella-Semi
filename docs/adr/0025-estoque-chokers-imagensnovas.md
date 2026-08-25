# ADR-0025 — Controle de estoque, fusão Chokers→Colares e lote Imagensnovas

- **Status**: aceita
- **Data**: 2026-08-25
- **Pedido do Pak**: *"Junte os colares com chokers e deixe somente colares. Adicione também seções de Pulseira e brinco… analise cada imagem, o nome e o preço de cada imagem que está na pasta… faça um controle de estoque no /admin, para que o administrador consiga colocar e ter um controle de estoque fácil"*.
- **Relaciona**: ADR-0021 (Turso + /admin), ADR-0022 (upload livre), ADR-0024 (painel para leiga).

---

## 1. Controle de estoque

`Product.estoque: number | null`. **null/ausente = sem controle** (vende à vontade), que é como todas as peças começam — a Ellen preenche quando quiser limitar. **0 = esgotada**: a peça continua no site, com selo "Esgotada", sem botão de comprar (decisão do Pak: peça esgotada some do carrinho, não do site).

O teto é aplicado no **carrinho** (`lib/cart/store.ts`), não só na tela: `add()` e `setQty()` limitam a quantidade ao estoque, e peça com estoque 0 nunca entra. Assim o pedido que chega no WhatsApp jamais promete peça que a Ellen não tem.

Onde aparece para a cliente:
- página da peça: *"Últimas 4 unidades"* e, no teto, *"Você já tem 4 no carrinho — é tudo o que temos desta peça"* + botão desabilitado;
- carrinho: botão "+" apagado + *"Só temos 4 unidades desta peça."*;
- vitrine: faixa "Esgotada" sobre a foto quando estoque = 0.

No `/admin`, virou o **passo 3 do editor** ("Quantas você tem?"), com a frase explicando o efeito em português comum. A lista de peças mostra "N un." / "Esgotada — repor" e ganhou o filtro **"Esgotadas (repor)"**.

Limite conhecido: o carrinho vive no `localStorage`. Se a Ellen baixar o estoque enquanto a cliente já tem a peça no carrinho, a correção acontece na próxima interação com a página. Sem checkout no site, a conferência final é da Ellen no WhatsApp — aceitável.

## 2. Chokers viraram Colares

Toda peça de `gargantilhas` passou para `colares` (15 peças). O nome continua dizendo "Choker" — é o nome do produto, não a seção. O enum `gargantilhas` **permanece** no schema (dado histórico), mas sumiu de toda a UI: menu, filtros da vitrine e selects do admin.

`/gargantilhas` e `/gargantilhas/:slug` ganharam **redirect 308** para `/colares` — link já compartilhado no Instagram/WhatsApp não pode virar 404.

## 3. Lote `Imagensnovas` (95 peças novas)

222 imagens. O nome do arquivo é a fonte de tudo: `EAL 456 Colar pedra natural azul com medalha $64,90.png`.

**Parser** (`lib/import/nome-arquivo.ts`, 18 testes): extrai código, nome e preço; corrige os erros recorrentes da Ellen (`Coloar→Colar`, `crajevado→cravejado`, acentos), aceita preço com ou sem cifrão e com sufixo digitado por engano (`$49,90st`), e ignora sufixo de cópia `(1)`.

**Categoria vem do TIPO da peça**, nunca da cor da pasta — as pastas DOURADO/BIJUTERIAS definem só `banho` e `tipo` (semijoia/bijuteria). Colar/Cordão/**Choker**→colares · Pulseira→pulseiras · Brinco/Argola/**Trio**→brincos · Conjunto/Duo→conjuntos.

**Agrupamento**: a chave ordena as palavras do nome, então "argola grossa prateado" e "prateado argola grossa" são a mesma peça, enquanto "azul" e "bordô" continuam peças diferentes (decisão do Pak: cada cor é uma peça).

**Conferência visual obrigatória**: o texto sozinho separava demais — o código EAL 456 tinha 13 nomes diferentes que, olhando as fotos, são **5 cores** da mesma peça; e EAL 382 tinha nomes iguais para uma corrente dourada e uma **prateada**. O agrupamento real está em `docs/catalogo/mapa-imagensnovas.json`, feito a partir das folhas de conferência numeradas (índice em `docs/catalogo/indice-conf-imagensnovas.json`).

Resultado: **95 peças** (62 colares, 27 brincos, 5 pulseiras, 1 conjunto), 201 fotos. Com isso **Brincos e Pulseiras voltaram ao menu** (que já é dinâmico desde a decisão de 17/08). Catálogo no ar: **127 peças**.

**Fora**: 21 fotos sem nome nem preço (arquivos UUID do Drive). Três delas casavam visualmente com peças nomeadas e entraram como foto extra; as outras são peças que ainda precisam de nome e preço da Ellen. O zip `PRATA` veio **vazio** (só a pasta).

## Consequências

- `estoque` é o primeiro campo do produto que muda o comportamento do carrinho — qualquer nova superfície de compra precisa respeitar `tetoDe()`.
- O import depende de um mapa curado à mão. Lote novo = nova rodada de conferência visual; não dá para confiar só no nome do arquivo.
- O menu do site é dinâmico: categoria sem peça some sozinha, categoria que ganha peça reaparece sem deploy.
