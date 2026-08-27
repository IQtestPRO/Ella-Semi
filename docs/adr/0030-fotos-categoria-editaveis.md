# ADR-0030 — Fotos das categorias editáveis no /admin, com corte automático

- **Status**: aceita
- **Data**: 2026-08-27
- **Pedido do Pak**: *"quero que no /admin tenha como alterar as imagens principais dos colares, brincos, pulseiras e conjuntos igual do print, para colocar a imagem que quiser. e já ajuste proporcionalmente de acordo com a imagem anexada"* + *"adicione entre conjuntos e todas as peças mais uma seção que é o mixes"*.

---

## Corte no upload, não no CSS

O card de categoria é **4:5 em pé**. A foto que a Ellen manda vem do celular (9:16), de print (16:9) ou quadrada do Instagram. Três caminhos possíveis:

1. `object-fit: cover` no CSS — o navegador corta pelo centro, que numa foto de joia costuma ser o vazio da mesa.
2. Pedir para ela mandar já em 4:5 — ela não sabe o que é 4:5, e não deveria precisar saber (ADR-0024).
3. **Cortar no envio, uma vez.** Escolhido.

`lib/imagem-proporcao.ts` usa `sharp` com `position: "attention"`, que escolhe o recorte pela região de maior detalhe — numa foto de joia, a joia. O corte roda **uma vez no upload**, não a cada visita.

Coberto por `tests/unit/imagem-proporcao.test.ts`: foto deitada, de celular, quadrada e já-4:5 saem todas em 4:5, sempre WebP. Testado ponta a ponta também: um PNG 1920×1080 enviado pelo painel virou 1280×1600 no banco.

## O que a Ellen vê

Bloco novo em **Textos e fotos do site → "Fotos dos quadradinhos de categoria"**, com atalho próprio no topo. Cinco campos (Colares, Brincos, Pulseiras, Conjuntos, Mixes), cada um com:

- a miniatura **no formato do card**, mostrando a foto que está no site agora — não "sem foto", que seria editar às cegas;
- botão "Enviar foto" (qualquer formato serve);
- "Voltar a foto original" quando ela tiver enviado uma.

`categoriasFotos` é uma setting nova (chave → URL). Campo vazio = usa a imagem da marca em `/assets/generated/categorias`. Ou seja: **o padrão continua bonito** se ela nunca mexer.

## Mixes com conteúdo

O menu só mostra categoria com peça (ADR-0025). Para a seção existir de fato, 7 peças que **já são combinação** (trio, dupla) foram para `mixes`: 5 trios de brincos, 1 trio de argolas e 1 pulseira dupla. Nenhuma peça avulsa foi tocada. Brincos: 27 → 21; Mixes: 0 → 7.

## Consequência

Todo lugar do site com foto de proporção fixa deveria usar `recortarNaProporcao` no upload. Hoje o hero e a faixa do meio ainda aceitam qualquer proporção e deixam o CSS resolver — é a próxima dívida a pagar quando alguém reclamar de foto cortada torta ali.
