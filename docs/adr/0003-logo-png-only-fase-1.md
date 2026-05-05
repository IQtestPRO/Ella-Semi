# ADR-0003 — Logo em PNG (não vetorial) na Fase 1; vetorização como risco crítico para Fase 2+

- **Status**: aceito (com risco)
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)

## Contexto

A logo da Ella Semijoias é a fonte da verdade da Identidade Atemporal (BIOS Visual): paleta primária (rosa salmão `~#F5C5B6`, dourado mostarda `~#D4A24A`, preto warm), tipografia hero (display serif Didone-ish com perna alongada cursiva no "A"), motif sparkles dourados. Toda decisão de design parte dela.

O arquivo disponível no início do projeto é `assets/brand/logo.jpg` (~7.6 KB, formato JPEG, raster), copiado de `C:\Users\Arthu\Downloads\362076263_983886966194836_5600480310397586871_n.jpg` (origem aparente: Instagram). **Não existe**:
- Versão vetorial (SVG) da logo;
- Arquivo fonte editável (Adobe Illustrator `.ai`, Figma);
- Versão raster em alta resolução (master >2000px);
- Identificação confirmada da fonte tipográfica usada nas letras "ELLA".

A Fase 1 do projeto é mobile-first, web-only, catálogo-vitrine. Volume de aplicações fora-do-web na Fase 1 é zero (sem print, sem brindes, sem packaging com logo, sem aplicação grande). O risco de qualidade insuficiente do JPG raster fica concentrado em três superfícies digitais: hero da home (mobile fullbleed), OG image, favicon.

## Decisão

**Fase 1 usa a logo em PNG/WebP raster otimizado, derivado do JPG original. Não bloqueia o cronograma.**

Caminho de execução:
1. Manter `assets/brand/logo.jpg` como arquivo-fonte de referência (não mexer).
2. Gerar derivados otimizados conforme demanda das superfícies:
   - `assets/brand/logo@2x.webp` (hero mobile, máx 750×750 logical, AVIF/WebP).
   - `assets/brand/logo-og.png` (OG image, 1200×630, padding com fundo rosa salmão sólido amostrado).
   - `assets/brand/favicon.{ico,svg}` — favicon vetorial **simplificado** (apenas o "E" estilizado ou o sparkle, não a logo inteira), aceita perda de fidelidade.
3. Hero da home **não usa o JPG escalado**: usa tipografia web da fonte hero (DM Serif Display / Bodoni Moda / Italiana / Cormorant — a fechar via grilling) + sparkles SVG inline + fundo rosa salmão sólido. A logo bitmap aparece em escala pequena (header, footer) onde 7.6 KB JPG é aceitável.
4. Sparkles dourados da logo são **redesenhados em SVG inline** ainda na Fase 1 (vetorial, escalável, animável, controle de cor por CSS). O JPG não dita a forma final dos sparkles além de "4 pontas, dourado mostarda".

## Consequências

### Imediatas (Fase 1)
- Sem custo de cronograma. JPG basta para web mobile-first.
- Sparkles SVG dão liberdade de animação e cor responsiva sem tocar no JPG.
- Hero usa **tipografia web ao vivo** (não imagem da logo escalada), o que dá CLS zero, é acessível, e respeita `prefers-reduced-motion`.

### Riscos aceitos
- **Drift tipográfico**: a fonte exata das letras da logo não foi identificada. A escolha entre DM Serif Display / Bodoni Moda / Italiana / Cormorant será por proximidade visual, não por match exato. Pode haver pequena divergência entre o "ELLA" da logo (raster) e o "ELLA" tipografado em hero/manifesto (web font). **Mitigação**: testar a fonte escolhida lado-a-lado com a logo no CONTEXT.md ainda no grilling, antes de fechar tipografia em ADR.
- **Escalabilidade externa**: qualquer aplicação >500×500px (banner físico, packaging, certificado, brinde, etiqueta de peça) **falha** com 7.6 KB JPG. Atualmente Fase 1 não pede nada disso, mas **se aparecer demanda**, é bloqueio.
- **Perda futura de fidelidade**: cada re-export raster do JPG degrada. Originar derivados sempre do `logo.jpg` original, nunca de derivados de derivados.

### Futuras (Fase 2+) — risco crítico flagged
- **Antes da Fase 2 abrir**, exigir vetorização profissional da logo. Caminhos possíveis:
  1. Auto-trace + retoque manual (Illustrator → Image Trace → smooth → manual cleanup das curvas Didone e da perna do A).
  2. **Recriar do zero em Figma/Illustrator** identificando a fonte exata das letras (matching por inspeção visual + recorte da perna do A como path custom). Caminho mais longo, resultado superior.
  3. Contratar designer/letrista para entregar SVG + arquivo fonte + variants (mono, invertido, mark-only).
- **Recomendação**: caminho 2 ou 3. Caminho 1 quase sempre falha em capturar a sutileza de Didone alto contraste e a perna cursiva do A, que é assinatura da marca.
- Reabrir esta ADR (ou superar com nova) quando o projeto pedir aplicação fora-do-web.

## Notas

- O arquivo `logo.jpg` original (7.6 KB) deve ser **versionado em git** mesmo sendo binário — é o único registro da identidade visual neste momento.
- Toda paleta amostrada será extraída do `logo.jpg` (com inspeção pixel) e fixada em `assets/prompts/brand-reference.md`. Valores `#F5C5B6` e `#D4A24A` neste documento são aproximações — confirmar amostragem antes de codar.
- Esta ADR **não bloqueia** o início do desenvolvimento. Bloqueia apenas: aplicações fora-do-web e impressão. Se isso aparecer, ADR superada.
