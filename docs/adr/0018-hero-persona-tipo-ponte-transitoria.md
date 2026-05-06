# ADR-0018 — Hero da Marca via Persona-Tipo Higgsfield (ponte transitória)

- **Status**: aceito (intencionalmente provisório)
- **Data**: 2026-05-06
- **Decisor**: Pak (com Claude)
- **Slice de origem**: S2.0
- **Não-supersede**: ADR-0014 (Brand Reference Pack), ADR-0015 (Persona-Tipo + Cinema Studio)
- **Conflito potencial**: nenhum — esta ADR aplica a política existente em um
  caso transitório explícito (Hero da Marca antes de foto-real Ellen).

## Contexto

S2.0 introduz Hero animado na home (vídeo loop seamless 6s) como peça-chave
da marca. Pak autorizou uso da imagem da Ellen no site, mas o **arquivo da
foto autorizado ainda não foi entregue**. Sem Hero, a home perde o ponto de
maior impacto visual. Adiar S2.0 até foto chegar não é razoável.

## Decisão

**Hero da Marca usa persona-tipo Higgsfield Cinema Studio 3.0 como ponte
transitória até a foto-real autorizada da Ellen ser fornecida.**

### Componentes da geração

- **Modelo**: `cinematic_studio_3_0` (ADR-0015 mantém Cinema Studio pra vídeos).
- **Persona-tipo**: master prompt em `assets/prompts/personas/modelo-ella-persona-tipo.md`
  (não confundir com Ellen real — ver CONTEXT.md "Modelo Ella" vs "Ellen Lopes").
- **Prompt versionado**: `assets/prompts/hero/hero-marca-v1.md` v1.0.
- **Output**: `public/hero/hero-loop.mp4` (vídeo principal, ~1.1MB) +
  `public/hero/hero-fallback.webp` (still 16:9 1920x1080, ~166KB, gerado
  via Nano Banana Pro 2K conforme ADR-0015 para imagens estáticas).
- **Manifest**: ambos arquivos registrados em `assets/generated/manifest.json`
  (a fazer no commit final S2.0) com `layer: "atemporal"`,
  `personaVersion: "modelo-ella-v1"`, `brandReferenceVersion: "1.1"`.

### Mecânica de UI

- Componente `app/components/home/Hero.tsx` (client component pra detectar
  `prefers-reduced-motion`).
- `<video autoplay muted loop playsinline poster=...>` com fallback graciosa:
  se motion=reduce ou se MP4 falha, mostra still webp.
- Background sempre tem gradient warm como base — section nunca fica "vazia"
  visualmente.

### Política de transição (este é o ponto inegociável)

Quando Ellen entregar arquivo de foto-real autorizado:

1. **Substituir** `public/hero/hero-loop.mp4` e `public/hero/hero-fallback.webp`
   por arquivos novos (mesmas dimensões 1920x1080).
2. **Atualizar manifest** com `fonte: "foto-real-ellen"` (nova entry).
3. **Componente Hero não muda** — código permanece estável.
4. **Esta ADR fica como ponte registrada**, sem precisar superseder. Ao
   acontecer a substituição, marcar este ADR como `superseded by entrega da
   foto-real Ellen YYYY-MM-DD` no header (transição operacional, não decisória).

## Consequências

- **S2.0 entrega Hero completo agora**, sem bloquear pela foto-real Ellen.
- **Identidade da Marca preservada** — vídeo segue brand-reference v1.1:
  paleta warm, mood serene editorial soft glam, Modelo Ella persona-tipo
  alinhada com persona-tipo já estabelecida (ADR-0015).
- **Provisório explícito** — esta ADR registra que a substituição é parte do
  contrato. Sem ADR, esquecimento é provável.
- **Custo financeiro Higgsfield**: 1 job Cinema Studio + 1 job Nano Banana Pro
  2K — coberto pela política sem teto (ADR-0001).
- **Persona-tipo, não Ellen real**: visualmente, o vídeo NÃO mostra a Ellen
  real. É uma mulher persona-tipo dentro do range estético (45-50, brasileira
  warm tan, mood editorial). Distinção semântica preservada conforme
  CONTEXT.md.

## Notas

- Pak autorizou a imagem da Ellen no site. Esta ADR não revoga a autorização —
  apenas reconhece que o arquivo ainda não está disponível e estabelece a
  ponte explícita.
- Componente Hero está coberto por 5 testes RTL (heading, video presence/absence
  por motion, fallback img sempre, semantic landmark).
- Background gradient sempre visível garante que mesmo se ambos os arquivos
  Higgsfield falharem ao carregar, o section não fica vazio (degradação
  graciosa em 3 níveis).
- Esta é a primeira ADR no projeto a documentar uma decisão **intencionalmente
  provisória** — o "provisório" faz parte da decisão, não é uma admissão de
  dívida.
