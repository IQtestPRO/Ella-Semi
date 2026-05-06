# ADR-0015 — Persona-Tipo Modelo Ella + Pipeline Visual Único Nano Banana Pro 2K

- **Status**: aceito
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)
- **Slice de origem**: S1.3
- **Supersedes**: ADR-0012 (Soul Character "Modelo Ella" persona definitiva)
- **Atualiza**: ADR-0008 (3 fotos por peça — modelo de geração unificado em Nano Banana Pro 2K)

## Contexto

A ADR-0012 declarou Modelo Ella como **Soul Character único treinado** no Higgsfield Soul, com `reference_id` persistido em `data/higgsfield-references.json`, reutilizado em toda Foto 3 do catálogo (ADR-0008) — com anti-drift checks a cada 20 peças. O CLAUDE.md derivava daí uma matriz de modelos por contexto (Nano Banana Pro pra Foto 1+2, Soul pra Foto 3 com Modelo Ella, Flux pra fundos, Cinema Studio pra vídeo, etc).

Em S1.3 (2026-05-05), Pak revisou essa decisão e estabeleceu nova direção:

1. **Diversidade de rostos é desejada**, não bug. Cada Foto 3 do catálogo pode mostrar uma mulher diferente, contanto que toda mulher esteja dentro da mesma **persona-tipo** (45–50, brasileira morena warm tan, elegante luxo discreto, golden hour). Site fica menos "modelo única" e mais "mulher real ELLA representada em variação dentro da mesma estética".
2. **Pipeline Higgsfield homogêneo**: um modelo só pra todas as fotos do site reduz custo de manutenção, curva de aprendizado e custo financeiro previsível. Pak fechou em Nano Banana Pro como modelo único de imagem.
3. **Resolução 2K obrigatória** em toda geração — assets de marca devem ser exibíveis em retina/Instagram/print pequeno sem upscaling.

## Decisão

### 1. Modelo Ella vira Persona-Tipo prompt-only

A mecânica de **Soul Character treinado** é descartada. Modelo Ella é agora uma **persona-tipo descrita por prompt master** em `assets/prompts/personas/modelo-ella-persona-tipo.md` (S1.3 TB1). Cada geração via Nano Banana Pro roda independente — sem `reference_id`, sem `data/higgsfield-references.json`, sem anti-drift checks técnicos.

**Coerência da Foto 3 entre peças** vem da **fidelidade à persona-tipo descrita no prompt master**, não da identidade fixa de uma pessoa. Auditoria visual de aderência à persona-tipo continua, mas mede *estética* (idade, etnia, mood, styling), não *consistência de rosto*.

### 2. Sub-prompts por categoria de peça

Sub-prompts em `assets/prompts/personas/sub-prompts/{mao,pescoco,orelha,tornozelo}.md` (S1.3 TB3) — cada um importa por referência o master e substitui o `{VARIATION_HOOK}` da master prompt string com crop específico:

- `mao.md` → `aneis`, `pulseiras`
- `pescoco.md` → `colares`, `gargantilhas`, `conjuntos`
- `orelha.md` → `brincos`, `piercings`
- `tornozelo.md` → `tornozeleiras` (validação empírica adiada pra S3.1, <5% catálogo)

### 3. Pipeline visual único: Nano Banana Pro 2K

**Higgsfield Nano Banana Pro (`nano_banana_2`)** vira o **modelo único** de imagem do projeto. Substitui rotação anterior:

| Tipo (ADR-0008) | Antes (ADR-0012/CLAUDE.md original) | Agora (esta ADR) |
|---|---|---|
| Foto 1 — produto isolado | Nano Banana Pro | Nano Banana Pro 2K |
| Foto 2 — detalhe macro | Nano Banana Pro | Nano Banana Pro 2K |
| Foto 3 — lifestyle Modelo Ella | **Soul + Soul Character treinado** | **Nano Banana Pro 2K + persona-tipo prompt-only** |
| Background swap foto Ellen real | Nano Banana Pro | Nano Banana Pro 2K |
| Vídeo aspiracional / hero | Cinema Studio | Cinema Studio (mantém) |
| Microvídeo / loop | Seedance 2.0 | Cinema Studio (Seedance removido) |

**Removidos do projeto**: Higgsfield Soul (V2 / Cinematic / Location), Flux 2 / Flux Kontext, Kling, Seedance, GPT Image 2, Soul Character treinado, `data/higgsfield-references.json`.

### 4. Resolução obrigatória: 2K

Toda geração de imagem em **2K** (2048 px lado maior). Ratios por contexto:
- `4:5` portrait — default mobile-first
- `1:1` quadrado — Instagram-friendly
- `16:9` paisagem — hero desktop

**Sub-2K é anti-padrão** registrado em CLAUDE.md (esta slice).

Comando canônico Higgsfield CLI:

```bash
higgsfield generate create nano_banana_2 \
  --aspect_ratio 4:5 \
  --resolution 2k \
  --wait \
  --prompt "<master prompt + variation hook do sub-prompt>"
```

### 5. Pipeline operacional

Foto 1 e Foto 2 ficam genericamente em produto/detalhe (prompt ad-hoc baseado em `assets/prompts/brand-reference.md` §5–§7).

Foto 3 (lifestyle com peça) usa:
1. Master prompt de `modelo-ella-persona-tipo.md` (§8)
2. Sub-prompt da categoria da peça (mão / pescoço / orelha / tornozelo) substituindo `{VARIATION_HOOK}`
3. Especificação concreta da peça hero substituindo `{JEWELRY}` no sub-prompt

`scripts/save-piloto.mjs` (S1.3 TB2) é a utility canônica pra baixar URL de output Higgsfield → converter pra WebP via Sharp → registrar manifest entry. Reutilizável em S3.1 produção.

## Consequências

### Imediatas

- **ADR-0012 superseded** — marcada como histórica.
- **ADR-0008 atualizada inline** com nota: "Foto 1/2/3 todas via Nano Banana Pro 2K". Política "3 fotos por peça uniforme" mantida — só o modelo de geração mudou (decisão tática conforme precedente registrado em CLAUDE.md "Manutenção de ADRs").
- **CLAUDE.md project atualizado**: tabela de modelos Higgsfield simplificada, anti-padrões novos (sub-2K, usar Soul, gerar imagem fora de Nano Banana Pro), anti-padrão "drift de identidade" reformulado pra "drift fora da persona-tipo (estética)".
- **Pipeline manutenção mais leve**: 1 modelo de imagem em vez de 3-4, prompt master + sub-prompts em vez de Soul Character treinado, sem `reference_id` pra gerenciar.
- **Custo Higgsfield reduzido**: zero custo de calibração de Soul Character (8-12 gerações de treino), cada peça do catálogo vai direto pra produção em S3.1.
- **Manifest schema atualizado**: campos `model_id: "nano_banana_2"`, `resolution: "2k"`, `aspect_ratio`, `dimensions`, `personaVersion`, `brandReferenceVersion: "1.1"`.

### Aceitas

- **Cada Foto 3 mostra mulher diferente** (rostos variam). Coerência editorial vem da persona-tipo (idade, etnia, mood), não da identidade fixa.
- **Auditoria visual em S3.1** (cada lote de catálogo): mede aderência à persona-tipo (linhas de expressão sutis dos 45-50, warm tan, mood serene editorial), não consistência de rosto. Anti-drift técnico zero por design.
- **Validação empírica do tornozelo adiada** pra S3.1 (peças <5%, prompt escrito mas não testado em piloto).

### Inegociáveis (mudança exige ADR superando)

- Modelo único Nano Banana Pro 2K pra imagens — **mudar exige nova ADR superando ADR-0015**.
- Mecânica persona-tipo prompt-only — **mudar exige nova ADR**.
- Resolução 2K mínima — **mudar pra 1K exige ADR explícita** (4K pode ser pontual sem ADR pra peças hero específicas).

## Notas

- Decisão Pak (HITL) registrada no chat do Claude Code, não em PR (S1.3 fica em local-only branch — sem PR até S6.1, conforme issue 0018 e atualização ADR-0013).
- TB2 desta slice gerou 1 amostra-piloto técnica (`assets/generated/personas/modelo-ella-piloto-001.webp`) pra validar pipeline end-to-end. Pak não bloqueia em validação visual desta slice — qualquer mulher dentro do range serve. Aderência da persona-tipo verificada na produção real de S3.1.
- Cinema Studio mantém pra vídeos. Marketing Studio Image / Marketing Studio Video / Soul Cinematic / outros: removidos do escopo.
- Pack v2.0 do brand-reference quando catálogo crescer (provável S3+).
