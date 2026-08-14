# ADR-0023 — Catálogo SUMMER GLOW como fonte oficial de código e preço

- **Status**: aceita
- **Data**: 2026-07-05
- **Contexto**: S5 — entrada do catálogo `CATALO_4 ella.PDF` (25 páginas, coleção
  Summer Glow / Primavera 2027), enviado pelo Pak.

## Contexto

A Ellen passou a distribuir um **catálogo em PDF** com 127 peças. O catálogo é o
material de venda real: a página 3 instrui a cliente a anotar o código da peça
(`04A`, `05B`, …) e mandar no WhatsApp. O código do catálogo é, portanto, a chave
que a cliente usa para pedir.

O site já tinha 52 peças cadastradas a partir de fotos soltas de WhatsApp, com um
sistema de código próprio e paralelo (`CO763`, `BR3032`, `PL17857`, …) criado na
S4. Doze dessas peças aparecem também no catálogo novo — mesma peça, dois códigos.

## Decisão

1. **O código do catálogo é o código oficial da peça no site.** Peça nova entra
   com o código do PDF (`04A`); peça que já existia tem o código antigo
   **substituído** pelo do catálogo (ex.: `CO763` → `06C`) e o preço alinhado ao
   PDF. O slug permanece o mesmo — URL indexada não quebra.
2. **Não se duplica peça.** Quando a peça do catálogo já existe no site
   (identificada por preço idêntico + categoria + conferência visual), o produto
   existente é atualizado; nenhum registro novo é criado. Decisão do Pak em
   2026-07-05 ("só adicionar as que faltam").
3. **Dados vêm do texto real do PDF, não de OCR.** Código, preço e selo
   (`SEMIJOIA`, `TRIO`, `CONJUNTO`, `CADA`, `PERSONALIZADA`, `CORDÃO DUPLO`)
   são extraídos da camada de texto via PyMuPDF. Nome e categoria são atribuídos
   por análise visual das páginas renderizadas.
4. **Foto: casamento geométrico, não heurística de nome.** A etiqueta do código
   desenhada sobre a foto tem bbox contido no bbox da imagem; a repetição do
   código na legenda cai fora de qualquer imagem e é descartada. Isso casou
   127/127 peças sem órfãs. Quando a peça aparece em mais de uma foto, a capa é a
   foto com **menos peças** (a mais dedicada à joia).
5. **Foto compartilhada é aceita como asset publicado.** O catálogo fotografa
   várias peças por imagem; a peça é identificada pela etiqueta. O `alt` avisa
   ("foto do catálogo com outras peças"). Isso mantém fidelidade ao material real
   da Ellen — nada de recorte automático que possa cortar a peça errada.
6. **`selo` do catálogo vira frase de venda** na descrição (garantia, trio,
   preço por unidade, pagamento prévio em personalizada), conforme a página 25
   do PDF. `PERSONALIZADA` mapeia para `tipoFulfillment: 'sob-encomenda'`.

## Consequências

- 115 peças novas cadastradas; 12 alinhadas sem duplicar; 167 produtos ativos.
- A Campanha Atual passa de `outono-2026` para `summer-glow-2027` (ADR-0004
  continua valendo: um único registro, sem histórico, `/campanha` fixa).
- O hardcode `"TODAS AS PEÇAS · outono 2026"` foi removido de `TodasAsPecas`
  (era anti-padrão declarado no `CLAUDE.md`); o componente recebe o nome da
  campanha por prop, lido do banco.
- **Supersede parcialmente a S4**: o esquema de código `CO/BR/CH/BRA/PL/CJ +
  número` deixa de ser a chave de venda. Peças ainda não cobertas pelo catálogo
  mantêm o código antigo até aparecerem em um catálogo futuro.
- Reprodutibilidade: `docs/catalogo/summer-glow-canon.json` guarda a lista
  canônica (código, preço, selo, nome, categoria, e o `existente` de cada
  duplicata); `scripts/import-summer-glow.mjs` é idempotente por slug.

## Alternativas descartadas

- **Substituir os 52 antigos pelo catálogo** — descartado pelo Pak; peças fora do
  catálogo continuam em estoque.
- **Manter os dois códigos convivendo** — geraria duas peças iguais com preços
  diferentes na vitrine; erro de venda garantido.
- **Recortar a peça dentro da foto compartilhada** — sem caixa delimitadora da
  joia (só a posição da etiqueta), o recorte erraria o enquadramento.
