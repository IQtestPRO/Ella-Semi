# Cards de categoria — v2 (ADR-0029)

Ellen pediu: *"Tirar essas fotos e add uma correspondente pra cada coisa. Tipo BRINCOS (colar uma foto de brinco) etc"*.

Antes, as 5 capas eram a mesma modelo de corpo inteiro — a cliente via o mesmo look em Brincos, Colares e Pulseiras. Agora cada capa mostra **a peça daquela categoria**.

Modelo: `nano_banana_2` (Nano Banana Pro), 2K, 4:5.

## Prompt base (comum às cinco)

> Warm editorial still-life product photo for a Brazilian fine jewelry brand: `<PEÇA>`, on a pale travertine stone slab with raw cream linen. Soft natural window light, long gentle shadows, dried sprig at the edge. Muted salmon, sand and warm beige palette. Shallow depth of field. **No people, no text, no logos.** Calm minimal luxury composition, vertical framing with generous negative space.

## `<PEÇA>` por categoria

| Categoria | Peça no prompt |
|---|---|
| brincos | a single pair of delicate gold hoop earrings with a small pearl |
| colares | a delicate gold chain necklace with a small round engraved medallion pendant, laid in a soft curve |
| pulseiras | three slim gold bracelets, one with tiny turquoise beads, in loose overlapping circles |
| conjuntos | a matching set of a gold pearl necklace and its pair of matching gold pearl stud earrings |
| mixes | two gold chains of different lengths, a beaded turquoise strand, small hoops and a slim bracelet, in a curated pile |

## Por que funciona com o site

Travertino + linho cru + luz lateral são exatamente o cenário das fotos de produto do catálogo Summer Glow, então as capas e as peças conversam. "No people" é deliberado: a capa da categoria mostra **o tipo de peça**, e a modelo fica para o topo do site.
