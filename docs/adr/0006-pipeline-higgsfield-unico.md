# ADR-0006 — Pipeline Higgsfield Único: toda mídia visual nasce do Higgsfield CLI

- **Status**: aceito
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)

## Contexto

ADR-0001 já estabeleceu que **qualidade prevalece sobre economia** na produção visual via Higgsfield (sem teto de créditos, modelo por adequação à tarefa). Faltava uma decisão complementar: **quem é a fonte da mídia que entra no site**.

Sem esta ADR, o caminho default é miscigenação:

- Stock photos para fundos de seções (Unsplash/Pexels free).
- Foto do Instagram da Ellen como hero ou produto.
- Imagens geradas em outras ferramentas (Midjourney, DALL-E, SD local) misturadas com Higgsfield.
- Placeholders de bibliotecas free (placehold.co, lorem picsum) "só pra começar".

O custo dessa miscigenação é **drift visual catastrófico** — cada fonte tem seu look, seu tratamento de luz, seu gamut de cores, sua "assinatura" estilística. Mistura disso destrói a coerência da marca, especialmente numa marca de joias premium onde a identidade visual é o produto.

A política da Ellen é **consistência prevalece sobre conveniência**.

## Decisão

**Toda mídia visual publicada no site Ella é gerada via Higgsfield CLI. Sem exceção produtiva.**

### Inclui (não exaustivo)
- Hero da home (vídeo Cinema Studio).
- Banner/vídeo da Campanha Atual na home.
- Hero da página `/campanha`.
- Hero por categoria de catálogo (se houver).
- Foto isolada de produto — Nano Banana Pro com background swap usando a foto-fonte como input.
- Foto detalhe macro de produto (Nano Banana Pro).
- Foto lifestyle de produto — Soul + Soul Character "Modelo Ella".
- Imagens institucionais (`/sobre`, `/como-comprar`, `/cuidados`, `/troca-e-devolucao`, `/faq`, `/contato`).
- Foto da Ellen Lopes para `/sobre` — Soul + Soul Character "Ellen Lopes" (a criar; co-decidir no grilling se geramos a partir de referência real ou desenhamos persona).
- Microvídeos decorativos (Seedance 2.0).
- Qualquer ilustração, ícone fotográfico ou elemento visual que **não** seja CSS/SVG puro construído à mão.

### Não usamos como fonte de asset publicado
- Stock photos de qualquer banco (Unsplash, Pexels, Pixabay, Adobe Stock, Getty, etc.).
- Fotos do Instagram da Ellen como produto final (referência para prompt, sim; asset publicado, não).
- Placeholders em produção (`placehold.co`, `lorem picsum`, `<img src="">`) — já proibido por CLAUDE.md.
- Imagens geradas por outras ferramentas de IA (Midjourney, DALL-E, Stable Diffusion local, Leonardo, Ideogram, etc.).

### Exceção única: foto real da Ellen como input
Foto real fornecida pela Ellen (de produto, dela mesma, ou de ambiente) **pode entrar como input** de um pipeline Higgsfield (background swap, refinamento, lifestyle composto). **Não pode ser publicada como asset cru** sem passar pelo Higgsfield. Isso garante que toda imagem final no site tem o "tratamento" Higgsfield aplicado e fica no mesmo espaço estético.

### Justificativa
- **Soul Character "Modelo Ella"** garante identidade humana consistente entre todas as imagens com pessoa. Misturar com foto real ou outro gerador rompe isso.
- **Brand Reference Pack** (`assets/prompts/brand-reference.md`) fixa paleta + iluminação + mood + anti-prompts; toda geração Higgsfield é encostada nele. Nenhuma outra ferramenta tem esse mesmo Brand Reference como base.
- **Reprodutibilidade** via manifest (prompt + modelo + seed + data + camada) só faz sentido se há um único pipeline. Manifest com mídia de origens diversas é fakemanifest.
- **Custo controlado pela ADR-0001** (sem teto). Não há economia razoável trocando Higgsfield por stock — o custo da inconsistência é maior.

## Consequências

- **Disciplina obrigatória**: cada nova superfície visual passa por "qual modelo Higgsfield resolve isso? qual prompt? qual seed?" antes de qualquer produção. Não cabe "vou pegar uma foto rapidinho do Unsplash".
- **Slice 1 fica mais lenta** que se permitisse stock — toda imagem que aparecer no MVP precisa ser gerada antes do deploy. Aceito como trade-off de qualidade.
- **Foto real da Ellen é tratada como input**, não como output. Adiciona um passo (bg-swap Higgsfield) mas garante que o resultado fica no espaço da marca.
- **Sparkles e ilustrações geométricas** continuam SVG/CSS puro — não são "mídia visual" no sentido desta ADR. Esta ADR é sobre fotografia, vídeo e ilustração fotográfica/figurativa.
- **Ícones de UI** (chevron, X, busca, menu) são SVG vetorial inline ou Lucide/Heroicons — também fora do escopo desta ADR. UI icons ≠ mídia.

## Notas

- Esta ADR **complementa** a ADR-0001 (qualidade > economia). Uma diz "use Higgsfield com folga financeira"; esta diz "use Higgsfield com exclusividade de pipeline".
- Mudar essa política exige nova ADR superando esta. Bypass tácito ("ah mas só essa imagem aqui...") não é permitido — surface a contradição e abra discussão antes.
- O catálogo PDF original da Ellen (em `assets/brand/catalogo.pdf` quando estiver disponível) é **fonte de input** para o pipeline (foto-fonte de cada peça → bg-swap Higgsfield → asset publicado). O PDF não é asset publicado; é arquivo-fonte de produção.
- Fotos do Instagram da Ellen podem ser **referências em prompt** (texto descrevendo a estética) ou **inputs para Higgsfield** se a Ellen autorizar. Asset publicado, nunca.
