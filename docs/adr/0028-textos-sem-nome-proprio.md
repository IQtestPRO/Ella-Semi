# ADR-0028 — Textos do site sem nome próprio, rodapé enxuto e logo maior

- **Status**: aceita
- **Data**: 2026-08-26
- **Origem**: pedidos da Ellen por WhatsApp, repassados pelo Pak em print.

---

## O que a Ellen pediu

1. *"Tirar tbm meu nome. Colocar nossa equipe entrará com contato"*
2. *"Tirar meu nome é colocar: uma de nossas atendentes"*
3. *"Deixar só nome ELLA"* — rodapé sem a linha "warm editorial soft glam"
4. *"Deixar só ELLA SEMIJOIAS"* + *"não precisa colocar cidade nenhuma pq queremos vender pra Brasil todo"*
5. *"Aumentar logo"*

E o Pak circulou num print um **traço solto** no meio da resposta do FAQ.

## Decisões

### Nome próprio sai dos textos da cliente

O site tratava o atendimento como sendo pessoalmente da Ellen ("Abrimos a conversa com a Ellen", "A Ellen passa o valor", "Falar com a Ellen"). Agora fala como loja: **"nossa equipe"** e **"uma de nossas atendentes"**. Trocado em: as 6 respostas do FAQ, o CTA da seção Sobre, a descrição do catálogo, o rótulo do botão de WhatsApp (leitores de tela) e a mensagem que abre no WhatsApp (era *"Olá Ellen! Quero pedir:"*, virou *"Olá! Quero pedir:"*).

Também saiu da **história da marca**: "das mãos de Ellen Lopes Alves" virou apenas a origem em 1998. O pedido foi "tirar meu nome", sem ressalva.

**O `/admin` continua com o nome** ("Olá, Ellen 💛", "Favorita da Ella"): ali quem lê é ela mesma, não a cliente.

### Travessões removidos

O `—` no meio das frases quebrava a linha no celular deixando **um traço sozinho no começo da linha seguinte** — foi o que o Pak circulou. Substituídos por vírgula ou ponto em todos os textos do site. Não é preciosismo tipográfico: em tela de 390px o travessão é o caractere que mais gera quebra feia.

### Rodapé

`wordmarkTagline` passou a aceitar **string vazia** (era `min(1)`), e o componente não renderiza o parágrafo quando está vazia — senão sobra um bloco em branco embaixo do wordmark. `microcopy` virou **"ELLA SEMIJOIAS"**, sem cidade: a loja vende para o Brasil todo e citar Rio Bonito passava ideia de alcance local.

A cidade **continua na história da marca** (seção Sobre), onde é fato de origem e não promessa de alcance.

### Logo maior

72px no celular (era 56) e 88px no desktop (era 64), com `width`/`height` dobrados para 128 — a imagem precisa de resolução dobrada para não serrilhar em tela retina.
