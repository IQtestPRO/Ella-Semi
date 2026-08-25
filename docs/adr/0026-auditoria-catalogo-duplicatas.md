# ADR-0026 — Auditoria do catálogo: duplicatas, galerias trocadas e capas

- **Status**: aceita (com pendências registradas)
- **Data**: 2026-08-25
- **Pedido do Pak**: *"veja imagens se tem alguma duplicada, igual está na Pulseira fina com pingentes diversos… coloque agentes e subagentes para analisar todo o site vendo se há duplicadas, imagens que estão juntas mas são produtos diferentes etc… se tudo de cordão está na área de cordão"*.
- **Relaciona**: ADR-0025 (lote Imagensnovas), ADR-0021 (Turso).

---

## Como foi auditado

Três camadas, porque nenhuma sozinha resolve:

1. **Impressão digital de imagem** (dHash + aHash sobre as 238 fotos no ar). Acha foto repetida e foto compartilhada entre peças — barato e determinístico, mas não distingue "mesma joia" de "foto parecida".
2. **8 agentes com visão**, cada um com um lote de folhas de contato: 17 folhas de duplicata (peças que dividem foto, lado a lado) e 20 folhas de galeria (cada linha = a galeria de uma peça). Instrução: julgar pela JOIA — material, cor da pedra, formato do pingente, tipo de corrente — nunca pelo nome do arquivo nem pelo cenário da foto.
3. **Conferência minha, imagem por imagem**, antes de qualquer remoção.

## O que a auditoria encontrou

- **13 duplicatas confirmadas** de 17 grupos (4 eram só foto parecida). A causa: o lote de 17/08 (nomes do catálogo da Ellen) e o de 25/08 (nomes da fornecedora) trazem **as mesmas joias**, então a mesma peça foi cadastrada 2 ou 3 vezes.
- **10 galerias exibindo foto de outra joia** — o defeito mais grave para venda. Casos reais: um brinco cuja 2ª foto mostrava dois colares; um colar verde cuja galeria tinha colar azul e colar escuro; uma pulseira de couro com fotos de outra pulseira (com pingente de abelha).
- **11 fotos repetidas** dentro da mesma galeria (a mesma imagem duas vezes) — incluindo a "Pulseira fina com pingentes diversos" que o Pak notou, cuja galeria inteira era a mesma foto duplicada.
- **2 capas ruins**: retrato de rosto onde o brinco ocupa ~1% do quadro, tendo o close do produto na 2ª posição.
- **2 peças diferentes com nome idêntico** ("Brinco semijoia cravejado quadrado": um de pressão, outro argola).
- **Categorias 100% corretas** — nenhuma pulseira em colares, nenhum cordão fora do lugar.

## Decisão — o que foi corrigido automaticamente

Só o que é inequívoco e não muda preço:

- **18 fotos removidas**: 12 que eram de outra joia + 6 repetidas dentro da galeria (mais 8 numa primeira passada, total 26 no dia).
- **Capa trocada** em EOG 047 e EFE 6665: o close do produto passa a ser a miniatura do catálogo.
- **4 duplicatas de MESMO preço juntadas**: fica um cadastro no ar com a galeria somada; o outro sai do site com `ativo = 0` (nada é apagado do banco). Foram: olho grego (14A/EPB 002/OMG 167), turquesa com pingente retangular (EAL 830/05D), corrente de elos (EAL 382/19B) e coração bojudo (EAL 382/CO324).
- **Nomes diferenciados** nos dois brincos quadrados.

Catálogo passou de 127 para **122 peças no ar**; fotos repetidas dentro de galeria: **zero**.

## Pendências que NÃO podem ser decididas sem o Pak

Registradas de propósito — mexer nelas às cegas dá prejuízo:

1. **11 duplicatas com preço divergente.** A mesma joia está no ar por dois ou três valores; em três casos a diferença é grande (R$ 139,90 × R$ 49,90 × R$ 69,90). Só o Pak sabe qual preço vale. Enquanto isso, **as duas versões seguem publicadas** — preferi catálogo com duplicata a catálogo com preço errado.
2. **Conjunto 05G (R$ 159,90)** usa a foto do colar de R$ 79,90. Se o conjunto inclui brinco, é produto legítimo e precisa de foto própria; se não, é a mesma peça pelo dobro.
3. **Miçangas "com estrela" / "com cauda de baleia"** (23A, 22D): o nome promete um pingente que não aparece em foto nenhuma. Ou o nome está errado, ou falta a foto certa.
4. **Códigos reaproveitados**: EAL 456 (5 peças), EAL 382 (4), EAL 830 (2), EAL 841 (2). É como a fornecedora numera a linha, mas atrapalha o atendimento — a Ellen pede um código e pode vir outra peça.

## Consequências

- Duplicata de catálogo tem causa estrutural: **lotes diferentes da mesma coleção com nomenclaturas diferentes**. Todo lote novo precisa passar pelo detector de impressão digital ANTES do import, não depois.
- O detector (`.scratch-audit/dupes.py`, reproduzível a partir de `scripts/` + dump) deve virar etapa fixa do processo de import.
- Foto compartilhada entre cadastros é sinal barato e confiável de duplicata; nome e código não são.
