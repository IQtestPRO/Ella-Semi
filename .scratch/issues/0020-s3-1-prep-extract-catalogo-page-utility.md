---
title: "S3.1 prep — utility extract-catalogo-page.mjs (PDF → PNG por slug)"
labels: [improvement, deferred-tech-debt, slice-3, blocked-by-policy]
type: prep
created: 2026-05-06
status: open
parent_issue: 0012
adrs_referenced: [0015]
slice_origem: S1.4 (registro)
slice_destino: S3.1
---

## Por que existe

Atualização inline 2026-05-06 da ADR-0015 estabeleceu **input image obrigatório do catálogo PDF** pra toda Foto 1/2/3 do catálogo a partir de S3.1 — Nano Banana Pro 2K passa a receber `--image assets/brand/catalogo-pecas/<slug>.png` pra preservar fidelidade do design da peça (eliminar drift como o que aconteceu na peça canônica da S1.4 entre Foto 1/3 leaf-outline e Foto 2 swirl).

Pra essa política funcionar em S3.1, **antes** de rodar batch das ~89 peças não-canônicas, precisa existir um utility que extraia a foto-fonte de cada peça do PDF.

## What needs to happen (em S3.1, antes do batch)

`scripts/extract-catalogo-page.mjs` (Node ESM):

1. **Lê** `data/products.json`.
2. Pra cada peça com `origem.{catalogoArquivo, pagina, letra}`:
   - **Renderiza** a página do PDF como PNG em alta resolução (≥ 2K largura) usando `pdf2pic`, `pdfjs-dist`, ou `pdf-to-png-converter`.
   - **Recorta** a área da letra da peça na página (catálogo da Ellen tem 5-6 peças por página identificadas A/B/C/D/E/F em quadrantes; extração precisa do crop por letra).
   - **Salva** em `assets/brand/catalogo-pecas/<slug>.png`.
3. Idempotente: pula peças que já têm `<slug>.png` (a menos que rodada com `--force`).
4. Output log no console: quantas extraídas, quantas puladas, erros.

## Decisões de implementação a tomar em S3.1

- **Biblioteca npm**: avaliar `pdf2pic` (depende de GraphicsMagick — pesado), `pdfjs-dist` (puro JS, mais leve, requer canvas), `pdf-to-png-converter` (wrapper sobre pdfjs).
- **Detecção de quadrantes**: catálogo da Ellen tem layout fixo? Peças A-F em grid 2x3? Verificar manualmente abrindo `assets/brand/catalogo-outono-2026.pdf` e mapear coordenadas por letra. Se layout é inconsistente entre páginas, fallback é extrair página inteira e Pak recorta manualmente.
- **Resolução de extração**: PDF é vetorial — render pra ≥ 2048 px de largura pra ter qualidade suficiente como input do Nano Banana Pro 2K.
- **Schema amendment opcional**: adicionar campo `fotoCatalogoPath?: string` ao Product schema (registra path do crop). Decidir em S3.1 se vale schema amendment ADR ou só convenção `assets/brand/catalogo-pecas/<slug>.png`.

## Acceptance criteria (S3.1)

- [ ] `scripts/extract-catalogo-page.mjs` implementado e funcional pra todas as 99+ peças do `data/products.json`
- [ ] `assets/brand/catalogo-pecas/<slug>.png` gerado pra cada peça com `origem.{pagina,letra}` válido
- [ ] Resolução ≥ 2K
- [ ] Idempotente (`--force` pra regenerar)
- [ ] Manifest entry de cada Foto 1/2/3 gerada em S3.1 inclui `input_image_ref: "assets/brand/catalogo-pecas/<slug>.png"`
- [ ] Anti-padrão CLAUDE.md "gerar from-scratch quando foto-fonte disponível" passa a ser blocking — qualquer geração de catálogo sem `--image` é bug

## Blocked by

- **Política**: ADR-0015 atualização inline 2026-05-06 (já registrada).
- **Slice**: S3.1 (catálogo completo). Não bloqueia S1.5/S1.6/S1.7/S1.8/S1.9 (essas slices não geram fotos novas — usam as 3 da peça canônica + componentes de UI).
