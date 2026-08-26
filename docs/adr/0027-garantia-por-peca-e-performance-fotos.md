# ADR-0027 — Garantia por peça, hero do desktop e velocidade das fotos

- **Status**: aceita
- **Data**: 2026-08-26
- **Pedido do Pak**: *"coloque no /admin na peça a opção de colocar garantia ou não. só alguns possuem Garantia das semijoias"*, *"altere a imagem somente do desktop que foi errada e está cortando. mantenha o da versão mobile"*, *"faça as imagens aparecerem mais rápido, está demorando muito para as fotos carregarem no site publicado"*.

---

## 1. Garantia por peça

A página de produto listava **"Garantia das semijoias" em toda peça**, texto fixo. Só que o próprio FAQ da loja diz que bijuteria não tem garantia — e havia **42 bijuterias no ar** prometendo garantia que a Ellen não cumpre.

- Campo `temGarantia: boolean | null` no `ProductSchema` + coluna no Turso.
- `lib/garantia.ts` centraliza a regra, coberto por teste: escolha explícita da Ellen manda; sem escolha (`null`, estado das 122 peças já cadastradas), vale a regra da casa — **semijoia tem, bijuteria não**.
- Toggle "Esta peça tem garantia" no passo de estoque do `/admin`, já marcado conforme o tipo da peça.
- O selo na página virou **"Garantia da peça"** e só aparece quando é verdade.

Escolha deliberada: `null` herdando do tipo em vez de default `false`. Com `false`, as 122 peças perderiam a garantia silenciosamente; com `true`, a mentira continuaria nas bijuterias.

## 2. Hero do desktop

A imagem 16:9 do desktop era **um corte da foto vertical da modelo** e cortava a cabeça dela. Trocada pela still do colar de pedra azul sobre travertino (1254×1254 → 1920×1080), que tem composição horizontal nativa: nada é cortado e o centro é limpo para o wordmark.

O **mobile não foi tocado** (segue a 9:16 com a modelo, como o Pak pediu). Como as duas fotos têm brilho diferente, o scrim atrás do "ELLA" ganhou duas intensidades: 0,32 no celular e **0,50 no desktop**, porque o travertino é claro (brilho medido: 150/255 no centro) e engolia o texto branco.

## 3. Velocidade das fotos

Diagnóstico medido, não suposto:

- **A causa principal era `minimumCacheTTL`**, cujo padrão no Next é **60 segundos**. Passado isso, o otimizador descarta a versão pronta e refaz tudo — inclusive buscar o BLOB no Turso de novo. Com 122 peças na vitrine, quase toda visita caía em cache frio. Ajustado para **1 ano**, o que é seguro porque cada upload gera um id novo (URL imutável).
- **`deviceSizes`/`imageSizes` sob medida**: o Next gerava até 3840px de largura. Agora o teto é 1920 e as larguras batem com o que o layout realmente usa.
- **20 fotos acima de 250 KB** reamostradas para 1400px/q84: 6,3 MB → 4,7 MB (-25%). Comparei original e recomprimida lado a lado antes de aplicar — a textura do travertino continua nítida, diferença imperceptível. As demais 198 fotos **não foram tocadas**: o projeto prioriza qualidade sobre economia (ADR-0001), então só os outliers entraram.

Não mexido de propósito: trocar o BLOB do Turso por bucket externo resolveria a origem lenta de vez, mas quebraria o upload simples do `/admin` (ADR-0022) e exigiria a Ellen configurar serviço externo. Fica registrado como caminho se a lentidão voltar com o catálogo maior.
