# Perguntas pendentes para a Ellen

> Este arquivo lista decisões que **não podem ser fechadas sem input direto da Ellen**. Pak leva pra ela, traz resposta, e cada item vira ADR/atualização de schema/atualização de copy.

Status: aberto · Última atualização: 2026-05-05 (pós-D1 processamento de catálogo)

---

## SEÇÃO A — Pendências originais (ainda válidas)

### 1. Manifesto da Marca ELLA (eternal, ≠ manifesto da Campanha)

**Por quê**: o briefing inicial pediu "1 frase grande tipográfica que captura o tom da marca". O manifesto que o catálogo tem é da **Campanha Atual** (Outono 2026 / Folhas de Outono). Falta a frase **da Marca** que vai no hero da home, no `/sobre`, no footer — eternal, não muda quando a campanha muda.

**Pergunta**: "Ellen, qual frase resume a ELLA pra sempre, independente de estação? Pode ser uma promessa, um sentimento, uma ideia. Exemplos do mercado: 'Joia que conta sua história' (Vrai), 'Fine jewelry, accessible' (Mejuri). O que você quer que toda mulher leia ao chegar no site da ELLA pela primeira vez?"

**Output**: 1 frase, máx ~12 palavras. Vira hero da home.

---

### 2. Regras de troca/devolução — texto literal e 7 lacunas

**Por quê**: política base capturada literalmente em `.scratch/textos-institucionais/troca-e-devolucao.md` (page-24 do PDF). ADR-0011 pendente até Ellen responder as **7 lacunas** abaixo.

**Lacunas identificadas no texto da page-24**:
1. **Prazo de troca em dias** (a partir do recebimento)? CDC art. 49 dá 7 dias para arrependimento em compra à distância. Ellen mantém 7 dias, estende, ou silencia?
2. **Frete da troca por conta de quem** — cliente ou Ellen?
3. **Peças sob encomenda** (cordão personalizado, anel sob medida) trocam? Política vale para elas também?
4. **Anéis com tamanho personalizado** trocam? Sanitário ou negocial?
5. **Brincos furados** trocam? (Questão sanitária comum em joalheria.)
6. **Cliente precisa enviar foto da peça antes de devolver**? Procedimento operacional.
7. **Troca por crédito vs reembolso vs outra peça do mesmo valor** — qual a regra default?

**Output**: bloco de respostas + texto consolidado vai pra `/troca-e-devolucao` MDX em S2.1; ADR-0011 fecha com regras textualizadas literalmente.

---

### 3. Disponibilidade de foto real por peça

**Status atualizado pós-D1**: ~50% das peças do catálogo Outono 2026 **não têm foto isolada** no PDF — só aparecem em foto de uso (modelo). Aplicada decisão D1 do Pak: **caminho C-modificado** — cropar mesmo assim, marcar `fonteFotoFraca: true`. Higgsfield gera baseado em crop fraco + descrição.

**Pergunta para Ellen** (ordem de prioridade após Slice 1 sair):
- "Ellen, você tem fotos isoladas (em alta resolução) das peças do catálogo Outono 26 fora do PDF? Em alguma pasta no celular, Drive, WhatsApp comigo, etc.? Manda zip, eu reaproveitamos."
- "Pra peças sem foto isolada, podemos pedir refoto? Algumas peças destaque seriam mais beneficiadas (lista enviada por Pak quando chegar a hora)."

**Output**: zip de fotos extras (se existir) ou autorização pra refoto em ordem de prioridade.

---

### 4. Pixel do Meta (Facebook/Instagram) — ADR-0007

**Por quê**: ADR-0007 implementou Meta Pixel via env var opcional (`NEXT_PUBLIC_META_PIXEL_ID`). Slice 1 vai pro ar com pixel "armado e silencioso" (sem ID = no-op). Quando Ellen passar o ID, vira ativa por edição de variável.

**Pergunta**:
- "Você já roda anúncios no Instagram/Facebook ou tem Business Manager configurado?"
  - Se SIM: "Me passa o ID do Pixel (vai estar em business.facebook.com → Eventos → Pixels). Formato é numérico, ~15 dígitos."
  - Se NÃO: "Quer que eu crie um Pixel pra você logar no Business Manager? Custo zero, e os dados começam a acumular pra quando você quiser anunciar/retargetar — mesmo sem campanha rodando hoje."

**Output**: Pixel ID ou autorização pra eu criar.

---

### 5. Número direto do WhatsApp (E.164) — ADR-0010

**Por quê**: link curto `wa.link/adq88g` é só pra atendimento geral (botão flutuante). O fluxo de finalização precisa do **número direto** em formato E.164 pra o `wa.me?text=` funcionar.

**Pergunta**:
- "Qual o número do WhatsApp da loja, em formato internacional? Ex: 5521987654321 (55 = Brasil, 21 = DDD do Rio, 9XXXXXXXX = celular). É o mesmo número da bio (`wa.link/adq88g`) ou tem outro?"

**Output**: número E.164. Slice 1 vai pro ar com placeholder fake `5500000000000`; troca-se via env var no Vercel quando o real chega.

---

### 6. Domínio próprio

**Por quê**: site precisa de URL pública. `vercel.app` funciona pra Slice 1 mas não pra produção definitiva.

**Pergunta**:
- "Já tem domínio comprado? Qual? (`ellasemijoias.com.br`? `usella.com.br`? outro?)"
- "Se não tem ainda, quer que eu sugira opções e a gente compra junto? `ellasemijoias.com.br` está livre? `usella.com.br`? `lojaella.com.br`?"

**Output**: domínio. Compra (Registro.br pra .com.br, ~R$40/ano) e configuração DNS no Vercel.

---

### 7. Foto da Ellen Lopes para `/sobre`

**Atualizado pós-D1**: o PDF page-03 contém **foto real da Ellen** já disponível. Sem precisar de envio adicional dela. Caminhos:
- (A) Foto da page-03 → bg-swap Higgsfield (Nano Banana Pro) para padronizar fundo + iluminação warm-editorial.
- (B) Foto da page-03 → input de Soul Character "Ellen Lopes" (treinar identidade pra gerar variações).
- (C) Pak pergunta para Ellen se topa usar essa foto ou prefere mandar fotos novas em alta resolução.

**Pergunta**: "Ellen, posso usar sua foto da página 3 do catálogo Outono 26 como base do retrato no /sobre do site? Vou rodar bg-swap Higgsfield pra padronizar fundo + luz, mantém você. OU prefere mandar fotos novas em alta?"

**Output**: autorização pra usar page-03 foto OU pacote de fotos novas em alta.

---

### 8. Manifesto da Campanha Atual — confirmação literal

**Status pós-D1**: texto literal capturado em `.scratch/textos-institucionais/manifesto-outono-2026.md`. Está no `data/campanha-atual.json`. Sem alteração.

**Pergunta**: "O texto do catálogo Outono 26 — 'O Outono é sobre elegância, textura e personalidade...' — é a versão final que você quer no site, ou você quer mudar alguma coisa?"

**Output**: texto literal final. Atualiza JSON se mudar.

---

### 9. Tipografias — confirmação visual da fonte da logo

**Status**: aberta. Brand Reference Pack (S1.2) faz comparison visual entre 3 candidatas (DM Serif Display / Bodoni Moda / Italiana) lado-a-lado com a logo. Pak escolhe a mais aderente à perna alongada cursiva do "A".

**Pergunta**:
- "Você sabe qual fonte foi usada pra desenhar 'ELLA' na logo? Tem o arquivo Canva ou Illustrator que mostra o nome da fonte?"
- Se não souber: vou propor 3 candidatas durante a Slice 1 com mockup lado-a-lado da logo. Você escolhe a mais próxima visualmente.

**Output**: fonte exata OU agendamento de comparação visual durante o Brand Reference Pack.

---

## SEÇÃO B — Pendências NOVAS surgidas durante D1

### 10. Variantes de banho — quais peças

**Status pós-D1**: PDF explicita variante de banho **apenas em page-18 (B/C)** — mesma peça em ouro e ródio. Política da Ellen na page-24 diz "Algumas peças tem opções em prata e níquel", mas o PDF não marca quais são essas peças explicitamente.

**Pergunta**: "Ellen, quais peças do catálogo Outono 26 vêm em mais de um banho (ouro / prata / ródio / ouro rose / níquel)? Pode ser amostra ('todas as peças vêm em ouro e prata') ou lista ('só estas peças X, Y, Z têm múltiplos banhos: lista aqui')?"

**Output**: lista de peças com banhos disponíveis. Aplicada ao schema `variantes` durante D1.2 batch processing.

---

### 11. Peças sob encomenda — quais

**Status pós-D1**: 3 peças identificadas com texto explícito "PERSONALIZADA"/"CADA PERSONALIZADO" — page-16 (A), page-16 (B), page-20 (D). Marcadas com `tipoFulfillment: 'sob-encomenda'`.

**Pergunta**: "Tem outras peças que são feitas sob encomenda (anel sob medida, pingente com gravação, conjunto montado a pedido, etc.) que não foram marcadas explicitamente como 'personalizada' no catálogo? Se sim, lista delas."

**Output**: lista. Marca essas peças com `tipoFulfillment: 'sob-encomenda'` no schema.

---

### 12. ~~Cordões/peças "masculinas" no catálogo~~ — RESOLVIDA

**Status pós-D1**: nenhuma peça aparenta ser exclusivamente masculina no catálogo Outono 26. Confirmado público feminino na Fase 1. **Item fechado.**

---

### 13. 8 peças marcadas indisponíveis pelo X vermelho — confirmar status

**Status pós-D1**: 8 peças com X vermelho cadastradas com `ativo: false` (slug reservado, escondidas do site). Pak's regra D2: confirmar com Ellen se cada uma:
- (a) saiu permanentemente do catálogo → deletar do JSON
- (b) só esgotou e vai voltar → reativar quando voltar
- (c) era promoção que acabou → reativar como promo nova ou deletar

**Lista das 8** (todas com origem.pagina + origem.letra):
| Página | Letra | Preço | Categoria provável |
|---|---|---|---|
| 04 | B | R$ 149,90 SEMIJOIA | colares (pendente coração) |
| 04 | C | R$ 79,90 | colares (corrente fina) |
| 05 | C | R$ 189,90 SEMIJOIA | pulseiras (3 cuffs empilhadas) |
| 16 | D | R$ 39,90 CADA | pulseiras douradas |
| 20 | A | R$ 49,90 | brincos |
| 22 | B | R$ 49,90 | **lenço/scarf** — não-joia + descontinuado |
| 22 | E | R$ 89,90 SEMIJOIA | brincos |
| 22 | F | R$ 149,90 SEMIJOIA | colares |

**Pergunta**: "Pra cada uma das 8 peças acima: (a) saiu permanente, (b) esgotou e volta, ou (c) promo expirada?"

**Output**: 8 respostas (a/b/c). Aplicado em D1.2 pra deletar (a), reativar (b) quando voltar, manter inativa (c).

---

### 14. 9 letras órfãs / preços ambíguos — confirmar peça por peça

**Status pós-D1**: 9 ambiguidades catalogadas (lista detalhada na seção 3 do `.scratch/processamento-catalogo-2026-05-05.md`). NÃO entram no JSON até Ellen confirmar.

**Pergunta principal**: "Pra cada ambiguidade abaixo, me diz qual letra real era essa, qual o preço, e se deve ser cadastrada."

**Lista das 9 ambiguidades**:
| Página | Ambiguidade | Pergunta específica |
|---|---|---|
| 04 | (A) duplicada — brincos R$69,90 cadastrado; corrente isolada abaixo do centro sem preço | Qual letra a corrente isolada deveria ter? Qual o preço? Cadastrar? |
| 06 | (H) preço ambíguo (typo Canva possível com "(E) R$109,90" duplicado) | Qual o preço de (H)? Mesmo R$109,90 ou diferente? |
| 07 | (A) R$29,90 — peça visualmente ambígua na modelo | Qual peça é (A)? |
| 08 | (A) R$59,90 — peça visualmente ambígua na modelo | Qual peça é (A)? |
| 09 | (A) R$39,90 — provável colar pérolas top-left, mas confirmar | É o colar de pérolas top? |
| 13 | (C) R$69,90 — parece **lenço/scarf** com estampa, não joia | Excluir como não-joia ou cadastrar como `outros`? Lista também todas as peças que pareceram não-joia (lenços, escapulários puramente devocionais, brindes) — Ellen confirma quais excluir. |
| 14 | (I) R$59,90 — foto não muito clara qual peça é | Qual peça é (I)? |
| 18 | (E) R$299,90 — Pak originalmente flagou modelo "diferente"; resolvido como Ellen mesma | Confirma que é Ellen. ✅ resolvido. |
| 22 | múltiplas Xs ambíguas entre B, E, F, G, H | Confirmar quais letras têm X exato (cadastrei B, E, F como excluídas — confirma) |

**Output**: 9 respostas individuais. Aplicado em D1.2.

---

### 15. Modelos diferentes da Ellen no catálogo

**Status pós-D1**: feita inspeção visual de todas as 24 páginas. Page-18 (E) inicialmente flagada como modelo diferente, mas Pak confirmou que é a Ellen mesma (face match com page-03). **Não há outras modelos identificadas como diferentes da Ellen no PDF.**

**Pergunta** (confirmação preventiva): "Ellen, todas as fotos com modelo no catálogo Outono 26 são você mesma? Não tem nenhuma amiga, filha, modelo profissional ou foto stock disfarçada?"

**Output**: confirmação OU lista de exceções. Se houver exceção, marca pendência específica + exige autorização.

---

### 16. `nomeExibicao` da Campanha — escolha confirmada como "Folhas de Outono"

**Status pós-D1**: Pak escolheu D4 = "Folhas de Outono" (literal do PDF capa). Aplicado em `data/campanha-atual.json`. **Item fechado.**

---

### 17. Texto fechamento do PDF — onde aplicar no site

**Status pós-D1**: texto literal capturado em `.scratch/textos-institucionais/fechamento-catalogo.md` (page-23):

> "Curtiu o catálogo ?
> Pode dar print nas peças
> e me chame no whatsapp.
> No Instagram novidades todo dia"

**Pergunta**: "Esse texto da página de fechamento — quer reaproveitar onde no site? Footer? Final do `/como-comprar` (passo 3)? Overlay sutil ao fim do catálogo? Outro lugar? Ou nem usar?"

**Output**: aplicação. Se em /como-comprar ou footer, vira parte do MDX em S2.1.

---

## SEÇÃO C — Próximos passos sequenciais

1. **Pak leva pendências 1-15 + 17 pra Ellen** (em ordem de prioridade que ele decidir).
2. **Ellen responde** em uma ou várias mensagens.
3. **Pak retorna respostas** pra mim em uma sessão específica.
4. **Eu aplico**: atualiza schema, JSON, MDX, ADR-0011, e desbloqueio dependências.

> Quando uma pergunta é respondida, mover para `.scratch/respostas-ellen.md` (criar quando primeira resposta chegar) com a resposta + arquivo atualizado.
