---
title: "S6.1 — Domínio próprio + variáveis reais + revisão final de copy da Ellen"
labels: [needs-triage, slice-6]
type: HITL
created: 2026-05-05
status: open
prd: .scratch/prd.md
adrs_referenced: [0007, 0010, 0011, 0012]
user_stories: [30, 31, 32]
---

## Parent

`.scratch/prd.md` — PRD do site ELLA Semijoias.

## What to build

**Resolução final das pendências da Ellen** (`.scratch/perguntas-ellen.md`) para release público.

### Domínio próprio (pendência #6)

- Ellen escolhe o domínio (sugestões iniciais: `ellasemijoias.com.br`, `usella.com.br`, `lojaella.com.br` — Pak verifica disponibilidade no Registro.br ~R$40/ano).
- Compra do domínio.
- Configurar DNS apontando pra Vercel (CNAME ou A record conforme guia Vercel).
- Configurar `vercel.app` subdomain como redirect 301 para domínio próprio.

### Variáveis reais

- **`NEXT_PUBLIC_WHATSAPP_NUMBER`** (pendência #5): atualizar do placeholder `5500000000000` pro **número real E.164** da Ellen no Vercel Project Settings → Environment Variables → Production. Sem deploy de código (ADR-0007 padrão).
- **`NEXT_PUBLIC_META_PIXEL_ID`** (pendência #4): atualizar se Ellen tiver Pixel ID do Meta Business Manager. Se não tiver, manter vazio (no-op completo). Se Ellen quiser que Pak crie um Pixel novo, abrir via Business Manager dela com permissão.

### Revisão de copy literal (pendências #1, #2, #8)

Substituir placeholders por copy literal final da Ellen:

- **Manifesto eternal da Marca** (pendência #1): hero da home + frase grande de `/sobre` recebem texto literal da Ellen. Substituir nos componentes correspondentes (provavelmente em MDX `content/` ou em prop passada via JSON).
- **Texto da Ellen no `/sobre`** (pendência #1): bloco de 2-3 parágrafos atualizado com texto literal.
- **Regras literais de troca em `/troca-e-devolucao`** (pendência #2): texto literal da Ellen. **Esta entrega gera ADR-0011** ("Política de Troca: textualização literal das regras negociais da Ellen") com o conteúdo literal preservado, ressalva sobre CDC art. 49, regras de prazo/sanitário/frete-da-troca/peças-sob-encomenda conforme Ellen entregar.
- Outros placeholders revisados: `/faq`, `/como-comprar`, `/cuidados`, `/contato` — qualquer texto literal que Ellen entregar substitui o placeholder.

### Foto/persona da Ellen Lopes para `/sobre` (pendência #7)

Decisão da Ellen entre:
- **A**: Soul Character "Ellen Lopes" treinado a partir de fotos reais dela (input via Higgsfield Soul training, similar ao processo da Modelo Ella em #0003) — gera retrato consistente.
- **B**: Foto real dela com background swap Higgsfield para padronização visual (ADR-0006).
- **C**: Persona inventada (Soul Character separado, descrita como "fundadora de marca Ella, perfil X") — última opção, registrar como ADR se for caminho.

`/sobre` ganha o retrato escolhido. Copy de `/sobre` finalizado.

### Manifesto Outono 2026 final (pendência #8)

Confirmação literal do texto da Campanha Atual em `data/campanha-atual.json` — Ellen pode ajustar do que está hoje.

## Acceptance criteria

- [ ] Domínio próprio comprado e DNS apontando pra Vercel
- [ ] `vercel.app` subdomain redireciona 301 pro domínio próprio
- [ ] `NEXT_PUBLIC_WHATSAPP_NUMBER` atualizado no Vercel pro E.164 real (sem deploy de código)
- [ ] `NEXT_PUBLIC_META_PIXEL_ID` atualizado se Ellen tiver Pixel
- [ ] Manifesto eternal da Marca substituído pelo texto literal da Ellen (hero da home + `/sobre`)
- [ ] `/troca-e-devolucao` com texto literal da Ellen + **ADR-0011 escrita** ("Política de Troca: textualização literal das regras negociais da Ellen")
- [ ] Outros placeholders substituídos por copy final da Ellen (FAQ, como-comprar, cuidados, contato)
- [ ] Se Ellen autorizou foto/persona pra `/sobre`: retrato adicionado (Soul Character "Ellen Lopes" treinado OU foto real via bg-swap), conforme decisão
- [ ] Manifesto Outono 2026 confirmado (literal final em `data/campanha-atual.json`)
- [ ] **HITL**: Ellen aprova cada texto/foto antes de mergear (cada entrega vira commit revisado)
- [ ] Visual regression atualizada com copy real
- [ ] **E2E final completo** (home → catálogo → produto → carrinho → finalizar → /pedido-enviado) em domínio real
- [ ] Smoke test em produção pós-DNS-propagação (validar HTTPS, OG images, schema.org JSON-LD)
- [ ] Pendências #1, #2, #4, #5, #6, #7, #8 fechadas em `.scratch/perguntas-ellen.md` (movidas pra `.scratch/respostas-ellen.md`)
- [ ] Pendência ADR-0011 criada e fechada
- [ ] CONTEXT.md atualizado com qualquer termo final que surja

## Blocked by

- #0015 (S5.1 Polimentos finais)
