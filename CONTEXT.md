# CONTEXT.md — Léxico do Projeto Ella

> Fonte da verdade da nomenclatura. Todo termo de domínio que aparece em código, commits, issues, ADRs e prompts deve estar registrado aqui antes de ser usado em mais de um lugar. Quando um termo novo surgir, **adicione antes de usar**.

---

## Marca e pessoas

- **Marca ELLA** / **Ella Semijoias** — entidade comercial atemporal. Identidade visual, nome, tipografia hero, paleta primária, sparkles e "perna alongada do A" são **eternal** — não mudam entre estações nem entre campanhas. Site é da Marca; Campanha é camada por cima. Hero da home, footer, navegação macro, manifesto **da Marca**, FAQ, política de troca: domínio da Marca, não da Campanha.
- **Ellen Lopes** — fundadora real da marca, pessoa humana. Aparece em `/sobre` (potencialmente com foto real, a confirmar). Autora do manifesto da Campanha Atual (e do manifesto da Marca, a co-escrever no grilling). Voz editorial do site é dela.
- **Modelo Ella** — Soul Character (entidade gerada por IA via Higgsfield) que aparece como "modelo" recorrente em **toda peça** do catálogo (Foto 3, ADR-0008). **Não confundir com Ellen Lopes.** Ellen é a pessoa real fundadora; Modelo Ella é a representação visual da cliente-arquétipo. Persona definitiva (ADR-0012): mulher ~45–50 anos, brasileira, morena warm tan, cabelo escuro bem-estilizado, elegante de luxo discreto, expressão serena, manicure neutra, iluminação warm golden hour ou indoor janela. **Não é** jovem 20–30, **não é** loira, **não é** corporativa fria. Persona materializada em `assets/prompts/soul-characters/modelo-ella.md`; `reference_id` em `data/higgsfield-references.json`. Drift entre páginas é proibido — anti-drift check a cada 20 peças.
- **Identidade Atemporal** / **BIOS Visual** — conjunto fechado de regras visuais permanentes da Marca: paleta amostrada da logo (rosa salmão `~#F5C5B6` + dourado mostarda `~#D4A24A` + preto warm das letras), tipografia hero (display serif Didone-ish com perna alongada cursiva no "A" — fonte exata a confirmar), tipografia secundária sans-serif neutra (a fechar), motif sparkles dourados, "perna alongada do A" como assinatura sutil. Materializado em `assets/prompts/brand-reference.md`. Mudança nesta camada exige nova ADR superando ADR-0003.

## Campanha (entidade única, sem histórico — ADR-0004)

- **Campanha Atual** — uma única campanha sazonal vigente por vez. Persistida em `data/campanha-atual.json` (arquivo único, 1 objeto). Tem `slug` interno, `nomeExibicao`, `manifesto` próprio (da Ellen, distinto do manifesto da Marca), `heroVideo`/`heroImagem`, `ctaTexto`, `produtosDestaqueSlugs[]`, `ativa: boolean`. Quando `ativa: false`, todas as superfícies da Campanha somem.
- **Trocar campanha** — operação manual de edição de `data/campanha-atual.json` + geração de mídia nova (vídeo da home + hero da `/campanha`). **Não há histórico.** Campanha anterior é apagada (incluindo `assets/generated/sazonal/`). Para isso, abre-se um turno do Claude Code dizendo "agora a campanha é X", e ele executa a operação.
- **Não existem**: entidade `Coleção`, arquivo `data/colecoes.json`, rota `/colecoes/[slug]`, conceito de "drop", "cadência", "transição entre coleções", "lookbook acumulativo". Foram avaliados e descartados (ver ADR-0004).

## Peças

- **Peça** / **Produto** — unidade vendável do catálogo, persistida em `data/products.json`. Schema simples sem campos de campanha/coleção: slug atemporal, nome, categoria, banho, tipo, `precoCents`, `precoPromocionalCents?`, descrição, fotos, variantes, tags, flags (`promocao`, `cordaoPersonalizado`, `destaqueHome`, `ativo`), `origem?`, `cadastradoEm`, `atualizadoEm`. **Produto não sabe que está em campanha** — vínculo é unidirecional via `produtosDestaqueSlugs[]` em `campanha-atual.json`.
- **`destaqueHome`** — flag do produto (atemporal) que decide se ele aparece na seção "Favoritas da Ella" da home. **Independente** da Campanha Atual.
- **Banho** — acabamento da peça (ouro / prata / ródio / ouro rose / níquel). É atributo principal; pode também ser variante quando a mesma peça vem em múltiplos banhos.
- **Variante de Peça** — variação dentro do mesmo slug. Conjunto fechado:
  - **Anéis**: tamanho **brasileiro** (números 12 a 28). Não US.
  - **Brincos**: opcionalmente Pequeno/Médio/Grande (apenas quando catálogo explicita).
  - **Colares, pulseiras, tornozeleiras**: comprimento (apenas quando catálogo explicita).
  - **Conjuntos**: sem variante (kit fechado).
  - **Banho**: vira variante quando catálogo diz "também em prata"; rótulos "Banho Ouro / Banho Prata / Banho Níquel". Não duplica peça; é variante dentro do mesmo slug.
- **Tipo de Fulfillment** (`tipoFulfillment`, ADR-0009) — campo do produto:
  - `'pronta-entrega'` (default): peça em estoque, envia logo.
  - `'sob-encomenda'`: peça personalizada (cordão personalizado por gravação/comprimento, peças sob medida). **Pagamento prévio obrigatório**. UI mostra aviso na página da peça e no carrinho. Mensagem WhatsApp marca o item com sufixo "(sob encomenda — pagamento prévio)".
- **Categorias finais** (enum em `data/products.json`): `colares`, `aneis`, `brincos`, `pulseiras`, `conjuntos`, `gargantilhas`, `tornozeleiras`, `piercings`, `outros`. **Cordões masculinos não entram** na Fase 1 (público feminino). Peças que parecerem masculinas durante processamento do PDF caem em `outros` + flag pra Pak revisar.

## Pedido (sem checkout — ADR-0010)

- **Pedido WhatsApp** — finalização de compra fora do site, no aplicativo. Site monta mensagem formatada URL-encoded, cliente clica e abre `wa.me/<E.164>?text=...` em aba nova com a mensagem **já digitada na caixa de input do WhatsApp**. Cliente aperta enviar manualmente. **Sem bot, sem WhatsApp Business API, sem Z-API/Twilio.** Ellen atende manualmente.
- **ID de Pedido** — formato `PED-XXXXXX` (6 chars alfanuméricos maiúsculos, sem 0/O/1/I para evitar confusão visual). Gerado no clique de "Finalizar pelo WhatsApp", salvo em `localStorage` (`ella-orders-v1`) com snapshot completo do carrinho na hora do envio.
- **Página de Pedido Enviado** — `/pedido-enviado/PED-XXXXXX`. Sparkles dourados de celebração, ID grande, instrução "Conversa com a Ellen foi aberta no WhatsApp. Se nada abriu, [clique aqui pra abrir manualmente] ou [copie a mensagem]". Botão "esvaziar carrinho" pra próximo pedido.
- **Frete** — "a combinar pelo WhatsApp" como default permanente da Fase 1. **Sem campo CEP** no carrinho. **Sem cálculo de frete** no site. A mensagem que vai pro WhatsApp **não inclui CEP** — a Ellen pede CEP no chat junto com endereço completo.
- **Carrinho** — persiste 1 sessão em `localStorage` (`ella-cart-v1`) caso wa.me não abra ou cliente queira tentar de novo. Snapshot do pedido enviado fica em `ella-orders-v1` pra cliente consultar depois ("qual era seu pedido PED-A1B2C3?").
- **Variável de ambiente** — `NEXT_PUBLIC_WHATSAPP_NUMBER` (E.164, ex: `5521987654321`). Slice 1 usa placeholder fake `5500000000000`. Quando Ellen passar o número real, edita-se a env var no Vercel — sem deploy de código (mesmo padrão do `NEXT_PUBLIC_META_PIXEL_ID`, ADR-0007).

## Tom e direção visual

- **warm editorial soft glam** — descritor primário do tom da marca:
  - *warm*: paleta quente (cremes, dourados quentes, rosés, neutros amadeirados; nunca azulado/frio).
  - *editorial*: composição com respiro (`VISUAL_DENSITY=3`), tipografia premium, hierarquia clara.
  - *soft*: curvas suaves, transições orgânicas, sem aresta dura, sem brutalismo.
  - *glam acessível*: aspiracional mas convidativo — não fortaleza luxury fria, e sim lifestyle warm-luxury (universo Mejuri / Catbird / Sézane / Maria Black / Vrai & Oro).

  Vive no CONTEXT.md, não como skill. Skill ativa é `minimalist-ui` (ADR-0002) por aderência ao mood; `warm editorial soft glam` é a camada de marca aplicada por cima.

## Pipeline de mídia (2 camadas + 1 sub-camada — ADR-0004; pipeline único — ADR-0006)

- **Pipeline Higgsfield Único** — toda mídia visual publicada no site nasce do Higgsfield CLI. Sem exceção produtiva. Stock photos, bancos free, ferramentas alternativas de geração — proibidos como asset publicado (ADR-0006). Foto real fornecida pela Ellen entra como **input** (background swap Higgsfield), nunca como asset cru final. SVG/CSS puro (sparkles, ícones de UI) está fora dessa regra — não é "mídia" no sentido da ADR.
- **Camada Atemporal da Marca** — produzida uma vez, reutilizada para sempre. Brand Reference Pack, Soul Character "Modelo Ella", logo derivados, sparkles SVG, hero da home (Marca), fotos institucionais, favicon, OG image padrão. Mudar exige ADR superando ADR-0003.
- **Camada Sazonal da Campanha Atual** — refeita só quando a campanha muda. **Escopo mínimo**: vídeo da seção "Campanha Atual" na home + hero da página `/campanha`. Resto do site fica igual.
- **Sub-camada Por Peça (atemporal)** — fotografia da peça: isolada com background swap, detalhe macro, lifestyle com Modelo Ella. Reaproveitável entre campanhas. Não muda quando a campanha muda.
- **Soul Character** — referência identitária treinada no Higgsfield. Modelo Ella é Soul atemporal da Marca. Usar Soul Character pra qualquer entidade recorrente.
- **Manifest** — `assets/generated/manifest.json`. Toda geração registra `prompt`, `modelo`, `seed`, `data`, `camada` ("atemporal" | "sazonal" | "por-peca"). Geração não-reproducível é dívida.
- **Brand Reference Pack** — `assets/prompts/brand-reference.md`. BIOS Visual escrita: paleta amostrada exata, tipografias, mood, anti-prompts. Pré-requisito de qualquer produção visual.
- **Hero shot da Marca** ≠ **Hero shot da Campanha**. O da Marca é eternal (home topo). O da Campanha é sazonal (seção da home + `/campanha`).

## Stack de skills (resumo)

- **Engenharia**: skills do Matt Pocock (`/grill-with-docs`, `/tdd`, `/diagnose`, `/zoom-out`, `/improve-codebase-architecture`, etc).
- **Frontend**: `emil-design-eng` (Emil Kowalski) + `design-taste-frontend` + `redesign-existing-projects` + `full-output-enforcement`.
- **Variante de estilo ativa**: `minimalist-ui` (ADR-0002).
- **Brand identity**: `brandkit` disponível em paralelo.
- **Mídia**: Higgsfield CLI (`higgsfield-generate`, `higgsfield-product-photoshoot`, `higgsfield-soul-id`, `higgsfield-marketplace-cards`). Política: ADR-0001 (qualidade prevalece sobre economia).

## Glossário rápido

| Termo | Significado |
|---|---|
| Bola de lama | Estado degradado do código: nomes inconsistentes, módulo sem fronteira, jargão não registrado, ADR ausente. Inimigo público nº 1. |
| Lapidação | Trabalho contínuo de tornar o código (e a marca) mais nítido. Não é polish opcional no fim — é o trabalho. |
| Deepening | Refator que torna abstração mais alinhada ao domínio (Matt Pocock). Surface por `/improve-codebase-architecture`. |
| Vertical slice | Issue que entrega valor end-to-end (UI + lógica + dado), não fatia horizontal. Saída de `/to-issues`. |
| Drift | Inconsistência de identidade visual entre páginas, especialmente da Modelo Ella. Proibido. |
| BIOS Visual | Camada Atemporal da Marca. Imutável sem ADR. |
| Campanha Atual | Uma única, sem histórico, edita-se 1 JSON pra trocar. |
| Pipeline Higgsfield Único | Toda mídia do site nasce do Higgsfield. Foto real da Ellen entra como input de bg-swap, nunca como asset cru. ADR-0006. |

---

> Quando surgir termo novo: edite este arquivo **antes** de usar o termo em qualquer outro lugar.
