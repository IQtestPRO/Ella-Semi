# ADR-0031 — Arrastar a foto para mudar a ordem da vitrine

- **Status**: aceita
- **Data**: 2026-08-27
- **Pedido do Pak**: *"nessa parte, faça com que tenha como arrastar a imagem para ajustar a ordem no site"* (passo 3 da Vitrine, `/admin/campanha`).

---

## O `draggable` do HTML está fora

A resposta reflexa seria `draggable="true"` + `dragstart/dragover/drop`. Ela está errada aqui por um motivo simples: **HTML5 drag and drop não existe em navegador de celular.** Nenhum evento de `drag` dispara no toque — no iOS e no Android o gesto não vira arraste.

A Ellen mexe no painel pelo telefone. Um recurso que só funciona no computador dela não é o recurso pedido.

Então: **Pointer Events**, que são o mesmo evento para dedo, caneta e mouse. Sem biblioteca (dnd-kit e afins pesam mais que o problema — a lista tem 9 fotos).

## Dedo e mouse não têm a mesma gramática

O mesmo gesto significa coisas diferentes:

| Entrada | Começa a arrastar quando |
|---|---|
| Mouse | anda 6px com o botão apertado |
| Dedo | **segura 220ms** antes de mover (padrão iOS/Android) |

O atraso no dedo não é enfeite: sem ele, **toda rolagem da página com o dedo em cima de uma foto viraria um arraste**, e a Ellen não conseguiria descer a tela. Com ele, se ela mexer antes do tempo, desistimos do arraste e a página rola normal.

Uma vez arrastando, um listener `touchmove` **não-passivo** bloqueia a rolagem — o do React é passivo e o `preventDefault` não pega nele.

## Como se comporta

- A foto **descola** e segue o dedo (cópia em `position: fixed`, via portal no `body`, inclinada 3° e 8% maior). O lugar de onde ela saiu fica esmaecido.
- As outras **abrem espaço em tempo real**, ainda durante o arraste — ela vê o resultado antes de soltar. O número do selo acompanha.
- Soltar fora da grade não bagunça nada: `moverItem` devolve a ordem original para índice inválido.

## Tirar peça saiu do corpo da foto

Antes, **tocar na foto tirava a peça da vitrine**. Com arraste isso vira armadilha: o dedo que erra o gesto apaga a escolha. A remoção virou um ✕ explícito no canto, que não deixa o toque chegar ao arraste (`stopPropagation` no `pointerdown`).

O ✕ tem 28px, abaixo dos 44px que este painel usa como piso. É deliberado: a alternativa (área invisível de 44px sobre a foto) **aumentaria** a remoção acidental exatamente no canto de onde se pega a foto para arrastar — e aqui o erro custa caro. Como atenuante, desfazer é um toque: a peça continua logo abaixo, na grade de busca, e voltar é tocar nela.

## Quem não arrasta

Cada foto é alcançável por `Tab` e se move com as **setas do teclado**, anunciando "posição 3 de 9". Não é só acessibilidade — é a rede de segurança se o arraste falhar em algum aparelho.

## Verificação

`moverItem` é função pura e testada (7 casos, incluindo não-mutação e índice fora da lista). O caminho por teclado tem teste de componente. O arraste em si **não é testável em jsdom** (não há PointerEvent nem layout), então foi verificado em navegador de verdade, no painel real:

- **Mouse**: peça 1 → posição 3, as outras empurradas, nada perdido.
- **Dedo** (390px, toque real via CDP): idem, com a cópia seguindo o dedo e sumindo ao soltar.
- **Rolagem**: dedo que desce logo após encostar na foto **não** reordena.
- **Ponta a ponta**: arrastou → Salvar → a nova ordem está no Turso.

## Consequência

`GradeOrdenavel` é genérica (`ids` + `renderItem`). A galeria de fotos da peça (`MultiImageField`) ainda reordena por "Usar como capa" — pode passar a usar o mesmo arraste quando alguém pedir.
