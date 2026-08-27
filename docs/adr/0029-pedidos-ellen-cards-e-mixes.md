# ADR-0029 — Cards por categoria, categoria Mixes, logo sem moldura e textos da Ellen

- **Status**: aceita (com uma pendência)
- **Data**: 2026-08-27
- **Origem**: prints de WhatsApp da Ellen repassados pelo Pak.

---

## Pedidos e como foram atendidos

| Pedido dela | O que foi feito |
|---|---|
| *"Tirar o traço"* | O travessão do texto da vitrine virou dois-pontos. Varredura confirma zero `—` em qualquer texto do site. |
| *"Tirar essas fotos e add uma correspondente pra cada coisa"* | As 5 capas de categoria eram a **mesma modelo de corpo inteiro**. Geradas 5 novas no Higgsfield (`nano_banana_2`, 2K, 4:5), uma por tipo de peça. |
| *"Trocar essa parte"* | 3º parágrafo do Sobre reescrito com o texto que ela mandou. |
| *"Tirar 'do café da manhã ao jantar'"* | Virou "em qualquer ocasião". |
| *"Semijoias com garantia"* | Era "Semijoias com banho que dura". |
| *"Aumentar a letra de cima"* | ELLA do topo: `clamp(56px, 11vw, 132px)` → `clamp(72px, 15vw, 168px)`. Cresce mais no celular, que é onde ela olhou. |
| *"Incluir após conjunto MIXES"* | Categoria `mixes` criada em todo o sistema. **Pendente**: ver abaixo. |
| Logo dentro de um retângulo | Resolvido — ver abaixo. |

## A logo estava dentro de uma caixa

O arquivo era `logo.jpg`, e JPEG não tem transparência: a arte vinha com o **fundo salmão chapado** (`#FFD9CC`). Contra o cabeçalho — que é o mesmo salmão porém com `/85` e `backdrop-blur` — os dois tons não batiam, e o resultado era um retângulo visível em volta da marca. Foi o que o Pak circulou.

Solução: `logo.png` gerado a partir do JPEG, tornando o fundo transparente por distância de cor (tolerância 26, com alpha proporcional na borda para não serrilhar), recortado no bounding box da arte. Como a marca é horizontal (2.18:1), o header passou a usar **largura** (148px no celular, 184px no desktop) em vez de forçar um quadrado — assim ela aparece maior sem esticar.

Lição: **logo de marca não deve ser JPEG.** Fica registrado para quando a ADR-0003 (vetorização) for resolvida.

## Categoria Mixes

`mixes` entrou no enum de categoria e em todos os pontos que o TypeScript exigiu — e ele exigiu, o que foi útil: apontou `lib/categorias.ts` e a silhueta de placeholder, dois lugares que passariam batido. Ganhou silhueta própria (duas correntes sobrepostas + argola) e card com foto de mix.

**Pendência**: o menu do topo só mostra categoria que tem peça (ADR-0025 — senão a cliente toca e cai em página vazia). Como nenhuma peça está classificada como Mix, **"Mixes" ainda não aparece no menu**. Existem 9 candidatas naturais no catálogo (6 "Trio de brincos", "Trio de correntes", "Conjunto duo", "Pulseira dupla"), mas reclassificar produto é decisão de negócio: um trio de brincos pode continuar sendo brinco. Fica para o Pak decidir; a categoria está pronta e aparece sozinha assim que a primeira peça for marcada como Mix no /admin.
