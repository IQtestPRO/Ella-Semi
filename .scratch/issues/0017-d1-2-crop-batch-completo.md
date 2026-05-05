---
title: "D1.2 — Crop batch completo (~135 peças restantes do catálogo Outono 2026)"
labels: [needs-triage, data-prep]
type: HITL leve + AFK
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0001, 0006, 0008]
notes: "Continuação direta de D1 (#0010). Não é /tdd. Sessão dedicada de processing — Pak cola prompt quando rodar."
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias (etapa de dados, follow-up de D1).

## What to build

**Continuação de D1 (#0010)** após processamento dos 10 destaques. Cropar as **~135 peças restantes** do catálogo Outono 2026 + as **8 peças inativas** (X vermelho, `ativo: false`) usando a mesma metodologia validada na D1:

### Metodologia (já validada por Pak em D1)

Para cada peça:
1. Identificar página + letra (já mapeado em `data/products.json` campo `origem`).
2. **Priorizar foto isolada** quando existe na página (qualquer página do PDF, não só onde a peça aparece originalmente).
3. **Fallback para bbox-na-modelo template** (`-x 200 -y 200 -W 1400 -H 1500` ou variação) quando peça só aparece em foto de uso. Marca `fonteFotoFraca: true`.
4. Usar `pdftoppm -png -r 300 -f <pagina> -l <pagina> -x <X> -y <Y> -W <W> -H <H>` (poppler-utils em `/tmp/poppler/...` ou install permanente se ainda não estiver — Pak decide path A vs ad-hoc).
5. Salvar como `assets/brand/source-pdf-pages/<pagina>-<letra>.png`.
6. Atualizar `data/products.json` com `fonteFotoFraca: bool` em cada entrada.

### Estimativa de volume

- ~135 peças ativas restantes (pra cropar)
- 8 peças inativas com `ativo: false` (também cropar pra ter input quando reativar — caso (b) da pendência #13 da Ellen)
- Total: **~143 crops adicionais**
- Distribuição estimada por status: ~50% com foto isolada (`fonteFotoFraca: false`), ~50% só na modelo (`fonteFotoFraca: true`).

### Adicionar ~135 entradas no `data/products.json`

D1 deixou apenas 10 destaques cadastrados no JSON. As ~135 peças restantes precisam entrar com schema completo:

- slug atemporal (kebab-case PT-BR; convenção: `<tipo>-<característica>-<banho>` ou similar)
- nome (Title Case PT-BR)
- categoria (enum 9 valores)
- banho (inferido visualmente)
- tipo (semijoia se tag visível ou em nota de grupo, senão bijuteria)
- precoCents (do PDF, sem chute)
- descricao (stub editorial — Ellen revisa em S6.1)
- fotos[] (3 placeholder paths para Higgsfield em S3.1)
- variantes? (apenas page-18 B/C explícita; restante depende de pendência #10 Ellen)
- tags? (livre, mínimo)
- promocao: false (default; nenhuma peça marcada explicitamente)
- tipoFulfillment ('pronta-entrega' default; 3 peças `'sob-encomenda'` confirmadas)
- destaqueHome: false (curadoria pós-S3.1)
- ativo: true (exceto as 8 X-vermelhas → false)
- origem.{catalogoArquivo, pagina, letra}
- fonteFotoFraca: bool (depende do crop)
- cadastradoEm + atualizadoEm

### Aplicar ajustes pós-respostas Ellen (quando Pak retornar de Ellen com input)

- Pendência #10 Ellen: variantes de banho — adicionar `variantes` em peças que vêm em mais de um banho.
- Pendência #11 Ellen: peças sob encomenda além das 3 explícitas — atualizar `tipoFulfillment`.
- Pendência #13 Ellen: 8 X-vermelhas — deletar (a), reativar (b), manter inativa (c).
- Pendência #14 Ellen: 9 ambiguidades — cadastrar peças confirmadas, deletar exclusões confirmadas.
- Pendência #15 Ellen: confirmação modelos — provavelmente todas Ellen, sem ajuste.

## Acceptance criteria

- [ ] **HITL leve**: Pak abre sessão dedicada, cola prompt de continuação D1.2 (assemelha-se ao prompt do D1, com escopo "as 135 peças restantes")
- [ ] ~143 crops gerados em `assets/brand/source-pdf-pages/<NN>-<L>.png` (alta resolução para foto-isolada, bbox-na-modelo template para fonte-fraca)
- [ ] `data/products.json` estendido para ~145 entradas totais (10 atuais + ~135 novas) com schema completo + `fonteFotoFraca` em cada
- [ ] `fonteFotoFraca: true` count documentado no relatório final (calibra batch Higgsfield S3.1)
- [ ] Schema validation Zod passando em todas as entradas
- [ ] CONTEXT.md inalterado (termos já documentados)
- [ ] Sem mudanças em código runtime (só dado)
- [ ] Relatório `.scratch/processamento-catalogo-batch-2026-XX-XX.md` lista as ~143 entradas + qualquer ambiguidade nova surgida durante batch + estatísticas finais (foto-isolada vs fonte-fraca, banho distribution, semijoia ratio, etc.)

## Blocked by

- #0010 (D1 — Processamento do catálogo PDF — primeira fase com 10 destaques + relatório)
- (Opcional) Respostas Ellen às pendências #10, #11, #13, #14, #15 — se chegarem antes de D1.2 rodar, batch fica mais limpo. Sem essas respostas, D1.2 ainda roda mas com mais peças marcadas como pendências internas.

## Notas

- D1.2 pode rodar **em paralelo** com S2.1 (institucionais com placeholders) ou S1.x (Slice 1) — sem dependência de código.
- Gating de S3.1 (Catálogo completo): D1.2 precisa estar **fechado** antes de S3.1 rodar (S3.1 produz batch Higgsfield ~360 gerações que dependem do `data/products.json` completo + crops disponíveis em `assets/brand/source-pdf-pages/`).
- Tempo estimado de execução de D1.2: **1 sessão dedicada de ~2-3 horas** (sem interrupção). Volume manual de bbox estimation é o gargalo.
