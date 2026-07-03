# ADR-0022 — Upload livre de imagens pelo /admin

- **Status**: aceito
- **Data**: 2026-06-30
- **Decisor**: Pak (com Claude)
- **Slice de origem**: S4 (admin)
- **Supersedes**: ADR-0006 (pipeline Higgsfield único) **para o caminho do admin**;
  relaxa o ponto rígido "0 ou 3 fotos" de ADR-0008/ADR-0016.

## Contexto

A ADR-0006 exigia que **toda** imagem publicada nascesse do Higgsfield CLI, e o
schema (ADR-0008/0016) só aceitava peças com 0 ou exatamente 3 fotos. Isso é
incompatível com uma pessoa leiga gerenciando o site: a Ellen precisa **subir a
própria foto** (do celular/PC) e ter 1, 2 ou N fotos por peça sem fricção.

Pak escolheu explicitamente **upload livre** quando perguntado.

## Decisão

1. **Upload livre de imagens no /admin.** A Ellen envia qualquer foto; o servidor
   normaliza com `sharp` (auto-orientação EXIF, resize para caber em 1600px,
   conversão para WebP) e guarda como BLOB na tabela `images` do Turso. Serve via
   rota pública `/api/images/[id]` com cache imutável (id novo a cada upload).
   Funciona em produção (Vercel read-only) sem bucket externo.
2. **Schema relaxado**: `FotoSchema.fonte` ganha o valor `"upload-admin"`;
   `Product.fotos` aceita **qualquer quantidade** (0 = camada placeholder SVG;
   1+ = galeria). Some a regra "0 ou 3".
3. O pipeline Higgsfield continua **válido e recomendado** para a camada de marca
   (heros, OG, campanha) e para quem quiser qualidade art-directed — mas não é
   mais **obrigatório** para toda imagem publicada.

## Consequências

- A Ellen tem autonomia total sobre as fotos, sem depender de geração assistida.
- Imagens ficam no Turso (BLOB) — simples e sem dependência extra; o `sharp`
  comprime para manter o banco enxuto. Se o volume crescer muito, migrar para
  Vercel Blob/R2 é um passo futuro sem mudar a interface (`saveImage`/rota).
- `PlaceholderProductImage` (ADR-0016) segue sendo a assinatura visual quando a
  peça tem 0 fotos.

## Manutenção de ADRs

Decisória → ADR nova superando, conforme `CLAUDE.md`. ADR-0006 fica marcada como
superseded **para o caminho do admin** (upload da Ellen); permanece como guia de
qualidade para a camada de marca.
