# ADR-0001 — Política Higgsfield: qualidade prevalece sobre economia

- **Status**: aceito
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)

## Contexto

O projeto Ella é um **site-catálogo de joias e semijoias premium** sem checkout — toda venda termina no WhatsApp. Sem checkout no site, **a primeira impressão visual é o ponto único de conversão**. O "uau" não é luxo opcional, é o funil inteiro.

A produção visual é feita via Higgsfield CLI (imagem + vídeo). Higgsfield cobra créditos por geração, e a regra default do bundle de skills do projeto era avisar antes de batch grande (>10) e estimar custo em créditos. Essa regra foi importada do CLAUDE.md genérico.

Para este projeto, essa regra de avisar/estimar **atrapalha** o trabalho:

- Cada editorial do lookbook pode consumir 30–80 gerações como narrativa coesa. Não tem como "avisar a cada batch" sem fragmentar a iteração criativa.
- Iterar prompt antes de iterar modelo é o caminho — mas trocar de modelo (Nano Banana Pro → Soul → Flux → Cinema Studio) **sem hesitar** quando a peça pede é parte do método.
- Decisões de modelo são por adequação à tarefa (joia precisa de reasoning fino, pessoa precisa de Soul Character, vídeo de hero precisa de real optical physics), **não por preço**.
- Drift entre páginas é proibido. Manter consistência custa gerações de calibração — e essas gerações **valem o investimento** porque drift mata a marca.

## Decisão

**Qualidade prevalece sobre economia em todo trade-off Higgsfield para a Fase 1 do projeto Ella.**

Isso se traduz em regras concretas:

1. **Sem teto de créditos para esta fase.** Não há limite por batch, por dia, por sprint.
2. **Não avisar antes de batch grande** (>10, >50, >100 — irrelevante). Não há porta de aprovação por volume.
3. **Não estimar custo em créditos** a cada execução. A estimativa é dispersão; a entrega é foco.
4. **Modelo escolhido por adequação à tarefa**, não por preço. Cinema Studio em hero/lookbook é default, não exceção. Nano Banana Pro em produto é default, não premium opcional. Soul é o único caminho para Modelo Ella humana — Soul Character treinado uma vez, reutilizado em toda página.
5. **Iterar prompt antes de iterar modelo**, mas trocar de modelo sem hesitar quando a peça pede.
6. **Editorial coeso**: cada editorial do lookbook é um "shoot" — Modelo Ella consistente, mesma luz, várias peças, várias poses, alguns frames cinematográficos. Pode consumir 30–80 gerações como narrativa única.

## Regras que **continuam valendo** (não revogadas)

Estas regras não são sobre economia — são sobre **reprodutibilidade e consistência**, que ficam mais importantes ainda quando o volume sobe:

- **Toda mídia gerada vai para `assets/generated/<categoria>/<id>.{webp|mp4}`** com metadata em `assets/generated/manifest.json` (prompt, modelo, seed, data). Sem isso, geração não é reproducível e vira dívida.
- **Toda prompt versionado em `assets/prompts/<categoria>/<nome>.md`**. Trate prompt como código.
- **Soul Character/Reference para qualquer entidade recorrente** (Modelo Ella, peça hero, ambiente recorrente). Drift entre páginas continua proibido.
- **Brand Reference Pack** (`assets/prompts/brand-reference.md`) é o BIOS visual do projeto e deve ser criado antes de qualquer outra produção visual. Documenta paleta amostrada da logo, tipografias, mood, iluminação, anti-prompts.

## O que muda no CLAUDE.md

A política acima invalida estes itens do `CLAUDE.md` original:

- ❌ Removido: anti-padrão *"Rodar batch grande de gerações (>10) sem avisar e estimar custo em créditos antes."*
- ❌ Removido: regra *"Antes de batch >10 gerações: avise o usuário e dê estimativa de créditos."*
- ✅ Substituído por: referência a esta ADR-0001 nas seções relevantes.

Reprodutibilidade (manifest + prompt versionado + Soul Character) **permanece** explícita no CLAUDE.md.

## Consequências

- **Velocidade criativa sobe**: ciclo de iteração não é interrompido por porta de aprovação.
- **Custo financeiro sobe** previsivelmente. É decisão consciente: o ROI do "uau" no funil pesa mais que o custo de créditos numa fase de catálogo enxuto.
- **Disciplina de manifest fica mais crítica**: com volume maior, manifest desorganizado vira impossível auditar depois. A skill de execução precisa registrar **toda** geração, sem exceção.
- **Esta política é Fase 1 only**. Fase 2 (Sanity, Wishlist, Reviews etc.) reabrirá a questão — quando a marca tiver tração e métrica de conversão, decidir se mantém "sem teto" ou impõe budget.
- **Mudança desta política exige nova ADR superando esta.**

## Notas

- Os 4 modelos default por contexto (Nano Banana Pro / Soul / Flux / Cinema Studio + Seedance 2.0 / Kling 3.0) estão registrados no `CLAUDE.md` na seção *Configurações deste projeto*.
- A ADR-0002 (variante de estilo `minimalist-ui`) é independente desta — governa a camada de UI, não a de mídia gerada.
