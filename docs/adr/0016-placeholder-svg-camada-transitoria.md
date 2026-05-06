# ADR-0016 — Camada Placeholder SVG transitória pra peças sem foto-real

- **Status**: aceito
- **Data**: 2026-05-06
- **Decisor**: Pak (com Claude)
- **Slice de origem**: S2.0
- **Atualiza**: ADR-0008 (já recebeu seção "Atualização 2026-05-06" inline na slice)
- **Não-supersede**: ADR-0006 (Pipeline Higgsfield Único — placeholder SVG é UI, não mídia publicada)

## Contexto

S2.0 popula `data/products.json` com ~131 peças novas extraídas do catálogo PDF
**antes** do batch Higgsfield rodar (planejado pra S3.1). Política ADR-0008 manda
3 fotos por peça via Nano Banana Pro 2K — mas peças nascem com `fotos: []` até
o batch acontecer. Sem **alguma camada visual**, o catálogo carrega vazio,
quebrando UX completamente.

Opções avaliadas:

1. **Bloquear seções** até Higgsfield rodar (apenas 1 produto visível, S2.0
   inviável). Rejeitada — adiar entrega indefinidamente.
2. **Stock photo / banco de imagens** como fallback. **Proibido** por ADR-0006
   (pipeline visual único Higgsfield).
3. **Higgsfield batch agora pra todas 131 peças**. Fora de escopo S2.0 — toma
   horas/dias e precisa do utility `extract-catalogo-page.mjs` (S3.1 já
   planejou).
4. **Camada placeholder SVG silhouette por categoria** — design proprio,
   inline (~3KB), elegante, denuncia visualmente que a peça espera foto. ✅

## Decisão

**Componente `PlaceholderProductImage`** (`app/components/product/PlaceholderProductImage.tsx`)
renderiza fallback visual quando `product.fotos.length === 0`:

- Background gradient `#FFD9CC → #F8E0CD → #F0DCC4` (warm editorial).
- Silhueta SVG inline taupe `#8A6E5C` com 35% opacity, **uma silhueta canônica
  por categoria** do schema:
  - `brincos` → folha estilizada com nervura central
  - `colares` → arco de corrente + pingente em gota
  - `pulseiras` → arco oval com elos pontuados
  - `aneis` → círculo com cravo central
  - `conjuntos` → arco + folha + brincos auxiliares
  - `gargantilhas` → linha dupla curva fina
  - `tornozeleiras` → linha fina horizontal com pontos
  - `piercings` → pino curto com cabeça
  - `outros` → círculo com pingente generic (defensive fallback)
- Sparkle dourado `#D99A30` no canto superior direito (assinatura visual da marca).
- Microtag inferior **"FOTO EM BREVE"** Inter 9px taupe kerning 0.32em.
- `role="img"` + `aria-label` semântico ("Foto em breve — brinco" etc).
- Aspect ratio quadrado por design; consumidor (`ProductCard`) controla aspect
  externamente via container.

**Integração:**
- `ProductCard` detecta `fotos.length === 0` e renderiza placeholder.
- `Categorias` reutiliza com `showLabel={false}` como assinatura visual dos
  cards de categoria (microtag escondida pra não duplicar com label do card).
- Schema Zod (`ProductSchema.fotos`) atualizado pra aceitar `0` ou `3` fotos
  (atualização inline ADR-0008, ver "Atualização 2026-05-06" da ADR-0008).

**Política:**
- Placeholder é **camada nova na pirâmide ADR-0008**, NÃO substitui Higgsfield.
- Quando S3.1 rodar batch Higgsfield, peças recebem `fotos: [3]` reais e
  placeholder some automaticamente (ProductCard renderiza `<Image>` quando há fotos).
- Peças com fotos parcialmente preenchidas (1 ou 2) continuam **anti-padrão**
  (Zod `refine` bloqueia).

**Pipeline Higgsfield Único (ADR-0006) NÃO é violado.**
SVG/CSS puro está fora do escopo da ADR-0006 ("CSS puro fica fora dessa regra
— não é 'mídia' no sentido da ADR"). Placeholder é elemento de UI, gerado em
build-time pelo React/Tailwind, não é mídia publicada equivalente a foto/vídeo.

## Consequências

- **Catálogo S2.0 publicável** com 141 peças visualmente íntegras.
- **Custo Higgsfield zero pra S2.0** — batch fica pra S3.1 conforme já planejado.
- **Identidade visual preservada** — gradient warm + sparkle dourado + Inter
  microtag mantém a marca presente mesmo sem fotos.
- **Trigger automático de upgrade** — quando peça ganha 3 fotos via S3.1,
  placeholder some sem mudança de código.
- **Anti-padrão registrado**: peça meio-fotografada (1 ou 2 fotos) — Zod bloqueia.

## Notas

- 9 silhuetas implementadas mesmo que `tornozeleiras` e `piercings` ainda
  não tenham peças no catálogo Outono 2026 — preparação pra futuras campanhas
  sem retornar à ADR.
- Componente é **server-component-friendly** (sem `"use client"`). Pode ser
  usado em RSC, ProductCard server, Categorias server, etc.
- 15 testes RTL cobrem cada categoria + sparkle + microcopy + a11y label +
  showLabel toggle + defensive fallback.
- Para peças com fotos reais (canônica `brinco-folha-aberta-semijoia`),
  placeholder não aparece — `ProductCard` renderiza `next/image` no lugar.
