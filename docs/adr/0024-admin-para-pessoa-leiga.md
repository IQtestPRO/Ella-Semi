# ADR-0024 — Painel /admin para pessoa leiga (criança ou idoso)

- **Status**: aceita
- **Data**: 2026-08-17
- **Contexto de origem**: pedido do Pak — *"deixe o painel do /admin ser mais intuitivo, para uma criança e um idoso conseguir mexer… tire algumas coisas que ficam confusas e com muita informação… que seja fácil alterar o nome dos produtos e já vir com a foto exata do produto que está alterando"*.
- **Relaciona**: ADR-0021 (Turso + /admin), ADR-0022 (upload livre de imagens).

---

## Contexto

O painel foi construído em S4 com rótulos em pt-BR e alvos de toque razoáveis, mas partindo do vocabulário de quem faz site. Uma auditoria com 5 inspetores independentes (uma tela cada) + síntese, sob a ótica de "criança de 10 / idoso de 75, zero conhecimento técnico", levantou **75 achados**. Três padrões se repetiram:

1. **Editar às cegas.** O editor de peça mostrava só campos de texto — a pessoa trocava o nome de um colar sem ver de qual colar se tratava.
2. **Vocabulário de fora.** "Hero", "banner", "FAQ", "SEO", "campanha", "manifesto", "identificador", "etiquetas", "cole a URL de um .mp4".
3. **Campo morto e valor errado em silêncio.** Campos que gravavam no banco sem mudar nada no site, e dois defeitos que publicavam dado errado sem aviso.

## Decisão

O painel passa a obedecer 7 princípios:

1. **Nunca editar às cegas** — toda tela mostra a foto e o nome do que está sendo mexido.
2. **Todo campo diz onde aparece no site**; campo que não muda nada visível sai da tela.
3. **Zero jargão** no caminho principal. Proibidos: hero, banner, home, FAQ, SEO, URL, .mp4, campanha, manifesto, slug, identificador, tag/etiqueta, acessibilidade.
4. **Um nome só para cada coisa**, do menu ao site ("Aparecer no site" nunca vira "Oculta").
5. **Menos informação** — número que não leva a ação é apagado; recurso avançado vai para gaveta fechada.
6. **Nada some com um toque** — apagar pede confirmação dizendo o que vai sumir; salvar não joga a pessoa para outra tela.
7. **Toque grande e letra legível** — mínimo 44px, rótulo permanente acima do campo (nunca só placeholder).

### Mudanças estruturais

| Antes | Agora |
|---|---|
| Menu: Início · Produtos · Campanha · Conteúdo do site | Início · Minhas peças · Vitrine de destaque · Textos e fotos do site (com ícone, sempre visível, sem hambúrguer) |
| Editor: parede de campos | 4 passos numerados (nome com **foto ao lado**, preço, fotos, onde aparece) + "Opções avançadas" fechado |
| Lista: 167 linhas, foto de 56px, maioria "sem foto" | Galeria com foto grande, peças no site primeiro, busca sem acento e por código |
| Entrada: 4 números não clicáveis | Caminhos grandes + peças mexidas por último **com foto** |
| Conteúdo: 7 blocos numa rolagem | Atalhos no topo, blocos na ordem do site, rodapé e Google em gaveta |
| Vitrine: lista de texto + 4 campos mortos | Escolha por foto, com ordem numerada e prévia |

### Correções de defeito (cada uma com teste)

- **`lib/format/preco.ts`** — digitar `89.90` publicava **R$ 8.990,00** (o parser apagava todo ponto). Agora ponto e vírgula funcionam, e milhar (`1.500`) é distinguido de decimal. `tests/unit/preco-input.test.ts`.
- **`lib/format/whatsapp.ts`** — `(21) 99624-9802` era salvo como `21996249802` (sem o 55): o painel dizia "Salvo!" e **todo pedido do carrinho parava de chegar**. O número agora é completado e validado, com prévia e botão de teste. `tests/unit/whatsapp-numero.test.ts`.
- **Peça nova nascia como "Brincos"** — um colar cadastrado sem tocar no campo ia para a página de Brincos. Agora o tipo começa vazio e o salvamento é bloqueado até ser escolhido.
- **Campo "(opcional)" que impedia salvar** — `HeroSchema.videoUrl`/`BannerMeioSchema.videoUrl` eram `.min(1)`; apagar o campo (o rótulo autorizava) travava com "Dados inválidos". Agora é opcional de verdade, e o site trata vídeo vazio mostrando só a foto.
- **Soft 404** — `/campanha` e qualquer endereço errado respondiam **HTTP 200**. Categoria fora do enum agora dá 404 real (`dynamicParams = false`) e existe `app/not-found.tsx` com a cara da marca. Para peça inexistente a rota é ISR com slug vindo do banco, então não dá para fixar a lista: aplicado `robots: noindex` para o Google não indexar página fantasma.

### Campos removidos da tela (dado preservado no banco)

`campanha.heroImagem`, `campanha.heroVideo`, `campanha.ctaTexto` e o slug interno: verificado por busca no código que **nenhum componente público os lê**. Continuam sendo gravados como estavam ao salvar, para não perder dado nem quebrar o schema.

## Consequências

- O caminho principal do painel fica curto e óbvio; quem precisa de controle fino abre "Opções avançadas".
- Textos do painel viram parte do contrato: mudar um rótulo exige manter o mesmo nome em todas as telas (princípio 4).
- Dois parsers ganham teste unitário — preço e WhatsApp passam a ser código com rede de proteção, não regex inline no componente.
- Não foi implementado nesta rodada (registrado como dívida): confirmação em caixa própria com miniatura no lugar do `window.confirm` do navegador, aviso de "alteração não salva" ao sair da página, e bloqueio do botão salvar enquanto uma foto ainda sobe.
