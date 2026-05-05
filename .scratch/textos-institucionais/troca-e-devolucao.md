# Política de Troca, Garantia e Atenção — texto literal do PDF (page-24)

> **Origem**: `assets/brand/catalogo-outono-2026.pdf`, página 24 (última página).
> **Capturado em**: 2026-05-05 durante D1.
> **Status**: **literal, sem reescrita**. Esta é a única política comercial escrita pela Ellen e deve ser preservada.

---

## Atenção

- As semijoias estão identificadas nas fotos ;
- A garantia das semijoias são de 6 meses a um ano e não cobre o mal uso das peças, nem pinos de brincos;
- As peças que não são semijoias **NÃO** tem garantia;
- As peças em promoção não serão trocadas
- Os cordões personalizados precisam de pagamento prévio para a encomenda
- Algumas peças tem opções em prata e níquel

*Quer um atendimento personalizado ?*
**Clique nos ícones abaixo**

[WhatsApp] [Instagram]

---

## Notas de fidelidade

- Pontuação preservada literalmente, incluindo:
  - "fotos ;" (espaço antes do ponto-e-vírgula).
  - "tem garantia;" (concordância "peças tem" — singular conjugado para "as peças", padrão coloquial brasileiro).
  - "**NÃO**" em caixa-alta com sublinhado no original.
  - Falta de pontuação final em alguns bullets ("trocadas", "encomenda", "níquel").
  - "personalizado ?" (espaço antes do interrogação).
- Tom: amigável-direto, não jurídico-frio. Conservar.

## Regras explicitamente declaradas

| Regra | Aplicação |
|---|---|
| **Tag SEMIJOIA visível na foto = `tipo: 'semijoia'`** | (regra #1 desbloqueada) Ausência da tag implica `tipo: 'bijuteria'` (informação positiva, não "a confirmar") |
| **Garantia 6 meses a 1 ano para semijoias** | A duração específica (6m vs 12m vs 24m) não é detalhada por peça — pendência para Ellen |
| **Garantia não cobre mal uso ou pinos de brincos** | Cláusula de exclusão explícita |
| **Bijuterias não têm garantia** | Sem ambiguidade |
| **Peças em promoção não trocam** | Regra negocial direta — futura ADR-0011 textualiza |
| **Cordões personalizados = pagamento prévio** | Mapeia direto pra `tipoFulfillment: 'sob-encomenda'` no schema |
| **Algumas peças têm opções em prata e níquel** | Mapeia direto pra `variantes: [{ tipo: 'cor', opcoes: [...] }]` no schema; quais peças concretamente é pendência durante processamento de pages 4–23 |

## Lacunas que exigem grilling com a Ellen (pendências adicionais)

A política do PDF é **mínima**. Faltam:
1. **Prazo de troca em dias** (a partir do recebimento)? CDC art. 49 dá 7 dias para arrependimento em compra à distância. Ellen mantém 7 dias, estende, ou silencia?
2. **Frete da troca por conta de quem** — cliente ou Ellen?
3. **Peças sob encomenda (cordão personalizado, anel sob medida) trocam**? Política vale para elas também?
4. **Anéis com tamanho personalizado** trocam? Sanitário ou negocial?
5. **Brincos furados** trocam? (Questão sanitária comum em joalheria.)
6. **Cliente precisa enviar foto da peça antes de devolver**? Procedimento operacional.
7. **Troca por crédito vs reembolso vs outra peça do mesmo valor** — qual a regra default?

Estas lacunas vão para `.scratch/perguntas-ellen.md` (já tem item #2 cobrindo este tópico — atualizar com lista detalhada acima).

## Próximo passo

A página `/troca-e-devolucao` na Slice 2.1 publica o texto literal acima como base. ADR-0011 (TODO até esta entrega de copy literal + respostas das 7 lacunas) fica formalizada quando Ellen responder.
