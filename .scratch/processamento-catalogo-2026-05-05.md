---
title: Relatório de Processamento — Catálogo Outono 2026 (D1)
data: 2026-05-05
input: assets/brand/catalogo-outono-2026.pdf (24 páginas, 31MB, Canva)
status: aguardando revisão Pak (ambiguidades em aberto)
---

# Relatório de Processamento — Catálogo ELLA Outono 2026

> **PARA AQUI** — Pak revisa as pendências enumeradas, responde em **uma única mensagem**, e eu reprocesso só o que pendeu.

## TL;DR

- **24 páginas processadas**: 1-2 capa, 3 manifesto+sobre, 4-22 produtos (19 páginas), 23 fechamento, 24 política/atenção.
- **Peças únicas identificadas**: ~145 cadastradas + 8 excluídas por X vermelho + 9 pendências (letra órfã, preço ambíguo, ambiguidade categórica).
- **Distribuição grosseira por categoria**: ~30% colares, ~20% brincos, ~20% pulseiras, ~10% conjuntos, ~10% anéis, ~5% gargantilhas, ~5% outros (lenços/scarves descartados).
- **Faixa de preço observada**: R$ 25,90 (mínimo) a R$ 299,90 (máximo, conjuntos semijoia).
- **Tag SEMIJOIA**: ~40% das peças semijoia, ~60% bijuteria.
- **Cordões personalizados**: 3 entradas confirmadas (`tipoFulfillment: 'sob-encomenda'`).
- **Nenhuma peça aparenta ser exclusivamente masculina** — público feminino confirmado.

---

## ⚠️ OBSERVAÇÃO ESTRUTURAL CRÍTICA — afeta approach do crop

**~50% das peças do catálogo NÃO têm foto isolada.** Aparecem apenas em foto de uso (na modelo).

Padrão típico de uma página: 1-2 fotos da modelo cobrindo 4-6 peças (A, B, C, D...) + 1-2 fotos isoladas cobrindo 1-2 peças específicas (geralmente E, H, I quando aparecem). As demais peças (A, B, C, D) só são vistas na modelo.

**Consequência**: cropar a região da peça nas fotos da modelo dá um crop minúsculo (brincos pequenos no rosto, pulseiras pequenas no pulso) que **não funciona como input de bg-swap Higgsfield Nano Banana Pro**. Resolução do crop ficaria ~150-300px no maior lado, abaixo do mínimo prático (~800px).

**Decisão pendente para Pak (BLOQUEADOR DE CROP):**

| Caminho | Descrição | Custo | Trade-off |
|---|---|---|---|
| **A** | Cropar **só** as peças com foto isolada limpa (~50%). Para o resto, gerar 100% via Higgsfield Nano Banana Pro a partir de descrição textual + zoom-in da peça na foto da modelo como referência fraca. | Higgsfield gera mais peças "do zero" — qualidade depende mais do prompt e do reasoning do Nano Banana Pro. | Volume Higgsfield aumenta; possível perda de fidelidade visual da peça real. |
| **B** | Pedir pra Ellen fotos isoladas das ~70 peças sem foto isolada no PDF. | Ellen fotografa novamente todas (3-5 dias de trabalho dela). | Catálogo atrasa, mas qualidade visual da peça real preservada. |
| **C** | Híbrido: cropar onde tem foto isolada; para peças "destaque" (campanha + destaqueHome), pedir foto pra Ellen; para peças "comuns" sem isolada, gerar via Higgsfield. | Misto. | Curatorial — peças hero ganham foto real; peças comuns aceitam Higgsfield generation. |
| **D** | Cropar TUDO mesmo das fotos da modelo, em resolução ruim, e usar como "hint" pro Nano Banana Pro (peça referência baixa-resolução + prompt detalhado). | Risco: Higgsfield pode gerar peça que não corresponde à real. | Não recomendado se identidade visual da peça importa. |

**Recomendação minha**: **C híbrido**, com critério de seleção do que vira "destaque" durante revisão deste relatório.

**Não cropo nada até Pak escolher A/B/C/D.**

---

## 1. Estatísticas

### Distribuição por categoria (estimativa)

| Categoria | Peças | % |
|---|---|---|
| `colares` | ~45 | 31% |
| `brincos` | ~30 | 21% |
| `pulseiras` | ~28 | 19% |
| `conjuntos` | ~14 | 10% |
| `aneis` | ~12 | 8% |
| `gargantilhas` | ~8 | 6% |
| `tornozeleiras` | 0 | 0% |
| `piercings` | 0 | 0% |
| `outros` | ~8 | 5% |
| **Total** | **~145** | 100% |

Notas:
- **Tornozeleiras**: nenhuma identificada no catálogo. Categoria fica no enum mas vazia.
- **Piercings**: nenhum piercing identificado. Algumas peças são "ear cuffs" ou "ear climbers" mas categorizei como `brincos` (não são piercing real).
- **Outros**: lenços/scarves visíveis em 2-3 páginas — flagados como "não-joia" e excluídos. Bracelete acrílico (page-10 letra H) entrou em `pulseiras` (acrílico é material, não categoria).

### Distribuição semijoia vs bijuteria

| Tipo | Peças | % |
|---|---|---|
| `semijoia` (tag SEMIJOIA visível ou em nota de grupo) | ~58 | 40% |
| `bijuteria` (sem tag) | ~87 | 60% |

### Faixa de preço por categoria

| Categoria | Mín | Máx | Mediana |
|---|---|---|---|
| `colares` | R$ 29,90 | R$ 229,90 | ~R$ 69,90 |
| `brincos` | R$ 29,90 | R$ 149,90 | ~R$ 59,90 |
| `pulseiras` | R$ 29,90 | R$ 169,90 | ~R$ 59,90 |
| `conjuntos` | R$ 169,90 | R$ 299,90 | ~R$ 249,90 |
| `aneis` | R$ 39,90 | R$ 79,90 | ~R$ 49,90 |
| `gargantilhas` | R$ 49,90 | R$ 89,90 | ~R$ 69,90 |

### `tipoFulfillment` distribution

| Valor | Peças | Páginas observadas |
|---|---|---|
| `pronta-entrega` (default) | ~142 | quase todas |
| `sob-encomenda` (cordão personalizado) | 3 | page-16 (A, B), page-20 (D) — todas com texto explícito "PERSONALIZADA" ou "CADA PERSONALIZADO" |

---

## 2. Peças excluídas por X vermelho (NÃO entram no products.json)

Total: **8 peças excluídas**. Conservador — Pak confirma se saíram permanentemente do catálogo, esgotaram, ou foi promoção que acabou.

| Página | Letra | Preço | SEMIJOIA? | Categoria provável | Hipótese de exclusão (Pak confirma) |
|---|---|---|---|---|---|
| 04 | B | R$ 149,90 | sim | colares (pendente coração) | a/b/c — saiu permanente / esgotou / promo acabou? |
| 04 | C | R$ 79,90 | não | colares (corrente fina) | idem |
| 05 | C | R$ 189,90 | sim | pulseiras (3 cuffs empilhadas) | idem |
| 16 | D | R$ 39,90 CADA | não | pulseiras douradas | idem |
| 20 | A | R$ 49,90 | não | brincos | idem |
| 22 | B | R$ 49,90 | não | **lenço/scarf** — excluído também por **não ser joia** | descontinuado + categoria fora |
| 22 | E | R$ 89,90 | sim | brincos | a/b/c |
| 22 | F | R$ 149,90 | sim | colares | a/b/c |

---

## 3. Pendências de letra órfã / preço ausente / duplicação Canva

**Padrão regra Pak**: peça com preço explícito ganha a letra; peça sem preço explícito vai pra pendência.

| Página | Letra "duplicada" / órfã | Descrição visual | Preço identificado? | Decisão pendente |
|---|---|---|---|---|
| 04 | (A) duplicada | Brincos da modelo top (R$ 69,90) **vs.** corrente isolada abaixo do centro (sem preço) | Brincos sim. Corrente isolada **não**. | Cadastrar brincos como (A) com preço; corrente isolada vira "letra órfã: provavelmente J ou similar" — Ellen confirma qual letra deveria ter e qual o preço. |
| 06 | (H) | Quarta peça do conjunto pulsos (E, F, G, H), mas há duplicação "(E) R$109,90" no rodapé que pode ser typo de Canva ("(H)" → escrita errada como "(E)") | Ambíguo — ou H = R$109,90 (provável typo) ou H = preço diferente | Pak/Ellen confirma o preço de H |
| 07 | (A) | (A) listada com preço R$ 29,90 mas não consigo identificar visualmente qual peça é. Provável: brinco esquerdo da modelo do topo (não rotulado claramente) | Sim, R$ 29,90 listado, mas peça visual ambígua | Pak inspeciona page-07 e confirma qual peça é (A) |
| 08 | (A) | Idem — letra (A) listada, mas peça ambígua na modelo | Sim, R$ 59,90 | Confirmar qual peça é (A) |
| 09 | (A) | Idem — colar pérolas top, mas pode estar parte da modelo abaixo | Sim, R$ 39,90 | Provavelmente claro — colar pérolas top |
| 13 | (C) | "(C) R$ 69,90" mas a peça parece ser **lenço/scarf** com estampa, não joia | Sim, R$ 69,90 | Excluir? Lenço não é joia. Pak confirma. |
| 14 | (I) | (I) R$ 59,90 mas foto não muito clara qual peça é | Sim, R$ 59,90 | Pak inspeciona page-14 |
| 22 | múltiplas Xs ambíguas | Vejo X marks na page-22 mas não 100% claro a quais letras se aplicam (entre B, E, F, G, H) | Marquei B, E, F como excluídas — Pak confirma se está correto | Confirmar letras com X exato |

**Total pendências de identificação**: ~9 peças.

---

## 4. Variantes detectadas

| Página | Letra | Tipo de variante | Opções | Notas |
|---|---|---|---|---|
| 05 | E | tamanho | P (R$39,90), M (R$45,90), G (R$45,90) | "Todos semijoias" — todas variantes são `semijoia` |
| 18 | B/C | banho/cor | Ouro (R$89,90) / Ródio (R$89,90) | **Mesma peça em 2 banhos**. Schema: 1 slug com `variantes: [{ tipo: 'cor', opcoes: [{rotulo: 'Banho Ouro'}, {rotulo: 'Banho Ródio'}] }]`. Não duplica produto. Letra (B) primária. |

**Outras peças com banho múltiplo**: política da Ellen na page-24 diz "Algumas peças tem opções em prata e níquel". Apenas a page-18 (B/C) explicita variante visual no PDF. As demais peças que tenham variante de banho são **invisíveis no PDF** — pendência:

> **Pergunta para Ellen**: lista de peças do catálogo Outono 2026 que vêm em **mais de um banho** (ouro / prata / ródio / ouro rose / níquel)? Pode ser amostra: "todas as peças vêm em ouro e prata" ou "só estas X peças têm múltiplos banhos: lista aqui".

---

## 5. Conjuntos / Trios / Triplos

Nomenclatura inconsistente no PDF: "TRIO", "TRIPLO", "CONJUNTO", "CADA". Mapeamento que apliquei:

| Termo no PDF | Significado | Categoria/schema |
|---|---|---|
| **CONJUNTO SEMIJOIA** | Kit fechado de 2+ peças (colar + brinco, etc.) | `categoria: 'conjuntos'`. Single slug. Sem variantes. |
| **TRIO** | Conjunto de 3 peças similares (3 colares, 3 hoops) | `categoria: 'conjuntos'`. Single slug. |
| **TRIPLO** | Equivalente a TRIO | `categoria: 'conjuntos'`. |
| **CADA** | Múltiplas peças idênticas vendidas individualmente | NÃO é conjunto. `categoria` da peça (geralmente pulseira). Slug único, vendida individualmente. |
| **PERSONALIZADA / CADA PERSONALIZADO** | Cordão com letras/gravação | `tipoFulfillment: 'sob-encomenda'`. |

**Conjuntos identificados** (~14):
- p06-A (Conjunto Coração SEMIJOIA, R$ 179,90)
- p10-F (Trio R$ 69,90)
- p11-B (Trio R$ 89,90)
- p17-A (Trio R$ 69,90)
- p17-C (Conjunto SEMIJOIA R$ 299,90)
- p18-A (Conjunto SEMIJOIA R$ 289,90)
- p18-D (Conjunto SEMIJOIA R$ 169,90)
- p18-E (Conjunto SEMIJOIA R$ 299,90 — modelo diferente, ver abaixo)
- p20-B (Triplo R$ 89,90)
- p20-C (Trio R$ 69,90)
- ... (lista completa no JSON)

---

## 6. Modelo diferente em page-18 (E)

A page-18 (E) tem foto de **modelo morena, jovem, distinta da Ellen Lopes**. Pode ser:
- Modelo profissional contratada para essa peça especial.
- Foto stock/banco.
- Modelo amiga/familiar da Ellen.
- Filha da Ellen?

**Pendência**: Ellen confirma quem é. Implica:
- Se foto autorizada: usar como input do bg-swap Higgsfield para gerar Foto 3 dessa peça.
- Se foto não autorizada para uso comercial fora-do-catálogo: pendência maior — refazer Foto 3 com Modelo Ella Soul Character.

---

## 7. Cordões personalizados (`tipoFulfillment: 'sob-encomenda'`)

3 peças identificadas com texto explícito de personalização:

| Página | Letra | Preço | Texto explícito |
|---|---|---|---|
| 16 | A | R$ 25,90 | "PERSONALIZADA" |
| 16 | B | R$ 59,90 | "PERSONALIZADA" |
| 20 | D | R$ 39,90 | "CADA PERSONALIZADO" |

Todas marcadas com `tipoFulfillment: 'sob-encomenda'` no schema. UI deve mostrar aviso "Sob encomenda — pagamento prévio. Confirmamos prazo no WhatsApp." na página da peça e no carrinho. Mensagem WhatsApp ganha sufixo " — sob encomenda — pagamento prévio".

---

## 8. Peças `promocao: true`

**Nenhuma peça identificada com marcador explícito de promoção.** O PDF não tem "PROMO", "OFERTA", "X% OFF" em lugar nenhum. Política da page-24 ("As peças em promoção não serão trocadas") aplica a peças que **viraram** promoção em campanha futura — não a peças do catálogo Outono 2026.

Default no JSON: `promocao: false` para todas. Quando Ellen lançar promoções no futuro, alterar individualmente.

---

## 9. Manifesto e textos institucionais salvos

Salvos em `.scratch/textos-institucionais/`:

- `manifesto-outono-2026.md` — texto literal da Campanha Atual (page-03)
- `sobre-ellen-lopes-base.md` — assinatura da Ellen + observação sobre foto disponível na page-03
- `troca-e-devolucao.md` — política literal (page-24) + 7 lacunas a perguntar para a Ellen
- `fechamento-catalogo.md` — texto curto da page-23 (call to action footer)

---

## 10. 10 slugs sugeridos para `produtosDestaqueSlugs` da Campanha Atual

Critérios usados:
- Marca SEMIJOIA (qualidade premium da campanha)
- Faixa de preço média-alta (R$ 100,00 a R$ 250,00) — peças aspiracionais
- Diversidade de categoria (colares, brincos, pulseiras, conjuntos, anéis)
- Visualmente representativas do tom warm-editorial-soft-glam

Sugestões (ordem de relevância narrativa para o "warm editorial soft glam" da marca):

1. **`conjunto-coracao-semijoia`** — page-06 (A), R$ 179,90 — coração é motif emocional, conjunto coração + brincos coração é declaração editorial.
2. **`colar-pendente-cruz-semijoia`** — page-15 (E), R$ 149,90 — peça narrativa, religiosa-secular, semijoia.
3. **`brinco-folha-aberta-semijoia`** — page-06 (D), R$ 95,90 — folha = motif outono, casa direto com Coleção Folhas de Outono.
4. **`colar-veneziana-banho-ouro-semijoia`** — page-09 (B), R$ 115,90 — colar fino com pendente, peça elegante warm.
5. **`brincos-pavé-zircônia-semijoia`** — page-09 (E), R$ 95,90 — sparkle natural casa com motif sparkles dourados da marca.
6. **`pulseira-correntão-banho-ouro-semijoia`** — page-22 (I), R$ 109,90 — chunky elegante, tom contemporâneo.
7. **`conjunto-semijoia-ouro-resort`** — page-17 (C), R$ 299,90 — conjunto premium semijoia, peça-bandeira.
8. **`brinco-hoop-trio-semijoia`** — page-05 (E), R$ 39,90/45,90/45,90 (variantes P/M/G) — trio versátil, casa com layered styling editorial.
9. **`colar-pérolas-pendente-semijoia`** — page-12 (D), R$ 98,90 — pérolas espaçadas, look editorial premium.
10. **`pulseira-pérolas-semijoia`** — page-08 (B), R$ 98,90 — pérolas, peça-statement.

**Pak confirma 10 slugs OU substitui** durante revisão deste relatório. Slugs finais entram em `data/campanha-atual.json`.

---

## 11. Pendências destacadas para `.scratch/perguntas-ellen.md`

Atualizar item #10 (variantes de banho), item #11 (peças sob-encomenda), item #12 (peças "masculinas" — confirmado: nenhuma; questão pode ser fechada parcialmente) com observações concretas deste relatório:

- **#3 (foto real disponibilidade)**: situação **complicada** — ~50% das peças não têm foto isolada. Precisa decisão urgente entre A/B/C/D acima.
- **#10 (variantes de banho)**: apenas page-18 B/C explícita. Lista completa pendente da Ellen.
- **#11 (peças sob-encomenda)**: 3 peças identificadas (page-16 A/B, page-20 D). Confirma se há outras não-marcadas explicitamente.
- **#12 (peças masculinas)**: nenhuma identificada. Provavelmente fechável.

Adicionalmente, levantar com Ellen as **7 lacunas da política de troca** documentadas em `.scratch/textos-institucionais/troca-e-devolucao.md` (prazo, frete, brincos furados, anéis sob medida, etc.).

---

## 12. Resumo de decisões a Pak (responder em uma mensagem)

| # | Decisão | Opções |
|---|---|---|
| **D1** | Approach do crop (50% peças sem foto isolada) | **A** = só cropar isolada; **B** = pedir Ellen refotografar; **C** = híbrido; **D** = cropar tudo mesmo ruim. **Recomendo C.** |
| **D2** | Confirmar 8 peças excluídas por X vermelho (saíram permanente, esgotaram, promo acabou)? | a / b / c |
| **D3** | Confirmar 9 letras órfãs / preço ambíguo (lista detalhada na Seção 3) | Resolver caso a caso |
| **D4** | `nomeExibicao` da campanha: "Outono na ELLA" (atual no JSON) ou "Folhas de Outono" (literal do PDF, page 1+2)? | Escolha de tom — Pak decide |
| **D5** | 10 slugs sugeridos para `produtosDestaqueSlugs` (Seção 10): aceita ou substitui? | Aceitar / Substituir / Misto |
| **D6** | page-18 (E): modelo morena diferente da Ellen — quem é? Foto autorizada? | Identificar pessoa + autorização |
| **D7** | page-13 (C) parece lenço/scarf — incluir como `outros` ou excluir como não-joia? | Incluir / Excluir |
| **D8** | Variantes de banho: lista de peças com múltiplos banhos é só page-18 (B/C)? Ou há outras peças no catálogo com versão prata/níquel não-explícita no PDF? | Lista da Ellen |

---

## 13. Próximas etapas após Pak responder

1. Aplicar respostas D1-D8 no `data/products.json` e `data/campanha-atual.json`.
2. Cropar peças conforme decisão D1 (caminhos A/C cropam metade; caminho B aguarda Ellen; caminho D cropa tudo).
3. Mostrar **primeiro crop** (peça com foto isolada limpa, ex.: page-04 letra E ou page-09 letra A) para Pak validar bbox/qualidade antes de processar todos.
4. Após OK do crop, processar batch.
5. Encerrar D1 com resumo de output gerado e marcar issue #0010 como pronta para review.
