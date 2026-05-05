# ADR-0004 — Modelo "Campanha Atual": uma única seção sazonal sem histórico

- **Status**: aceito
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)

## Contexto

Tentativa anterior de modelagem (ADRs 0004 e 0005 deste mesmo dia, agora removidas) introduzia: entidade `Coleção Sazonal` com lifecycle, `Pertinência` em cada peça, `Linha Permanente` separada, `data/colecoes.json` com histórico, `/colecoes/<slug>` rotas dinâmicas, `/lookbook/<slug>` editorial acumulativo, e Pipeline Visual em três camadas com sub-pastas por coleção.

Pak revisou o modelo e cortou ele inteiro. Razões:

- **Solo founder, escopo Fase 1 enxuto.** Manter histórico de coleções, lookbook acumulativo e pertinência cruzada é dívida operacional sem benefício imediato — ninguém vai querer ver "Outono 2024" em 2027 se a marca ainda está fixando o tom.
- **Catálogo é o produto, não a curadoria temporal.** O cliente final que chega via Instagram quer ver as peças hoje, em destaque hoje. "Histórico de campanhas" é narrativa interna que pode esperar a marca ter tração real.
- **Trocar campanha precisa ser um ato de 5 minutos.** Editar 1 JSON, gerar mídia nova pra 1 seção, fim. Sem migração, sem renumeração de slugs, sem "arquivar coleção".
- **Lookbook acumulativo era promessa não-paga**: linda na ADR, na prática vira pasta de assets antigos sem manutenção depois de 2 drops.

## Decisão

### 1. Esquema de dado

**`data/products.json`** — produto é só produto. Sem campos de coleção, pertinência, linha-permanente, drop, sazonalidade. Schema:

```ts
type Produto = {
  slug: string;                         // atemporal, estável, sem estação no path
  nome: string;
  categoria: string;                    // "colares" | "aneis" | "brincos" | "pulseiras" | ...
  banho: string;                        // "ouro" | "prata" | "ródio" | "ouro rose"
  tipo: string;                         // sub-categoria livre — fechado durante grilling de catálogo
  precoCents: number;
  precoPromocionalCents?: number;
  descricao: string;
  fotos: string[];                      // paths em assets/generated/por-peca/<slug>/...
  variantes?: Variante[];               // tamanho de anel, comprimento de colar, etc.
  tags?: string[];                      // livre, opcional, ex: "lançamento", "best-seller"
  promocao: boolean;
  cordaoPersonalizado: boolean;         // flag específica do domínio (a confirmar no grilling)
  destaqueHome: boolean;                // se aparece em "favoritas da Ella" na home (independente de Campanha)
  ativo: boolean;
  origem?: string;                      // opcional, livre
  cadastradoEm: string;                 // ISO date
  atualizadoEm: string;                 // ISO date
};
```

Vínculo com Campanha é **unidirecional** via `produtosDestaqueSlugs[]` em `campanha-atual.json`. O produto **não sabe** que está em campanha. Isso permite trocar campanha sem reescrever nenhum produto.

**`data/campanha-atual.json`** — arquivo único, 1 objeto, sem histórico:

```ts
type CampanhaAtual = {
  slug: string;                         // identificador interno (ex: "outono-2026") — não usado em URL
  nomeExibicao: string;                 // "Outono na ELLA" — texto visível
  manifesto: string;                    // texto curto da Ellen Lopes
  heroVideo?: string;                   // path do vídeo Cinema Studio
  heroImagem?: string;                  // fallback estático
  ctaTexto: string;                     // "Ver peças desta estação"
  produtosDestaqueSlugs: string[];      // 6–10 slugs do products.json
  ativa: boolean;                       // false → seção some da home + /campanha
  atualizadoEm: string;
};
```

Ao trocar campanha, **edita-se este arquivo** (slug, nomeExibicao, manifesto, hero, produtosDestaqueSlugs) e gera-se mídia nova pra **uma seção apenas**. Versão anterior **some** — não fica em nenhum lugar do site.

### 2. Onde aparece no site (3 superfícies, exatamente)

- **Home** — uma seção "Campanha Atual" entre o hero da Marca e a seleção curatorial. Banner com `heroVideo` ou `heroImagem` + `manifesto` + CTA pros produtos destaque. Some quando `ativa: false`.
- **Catálogo** (qualquer rota de categoria) — filtro opcional "Em destaque agora" que filtra por `produtosDestaqueSlugs`. Se `ativa: false`, filtro desaparece.
- **`/campanha`** — URL **fixa**, **não dinâmica**, sem parâmetro `[slug]`. Página dedicada: hero da campanha + manifesto longo + grid completo dos `produtosDestaqueSlugs`. Quando trocar campanha, **a URL continua `/campanha`** e o conteúdo dela muda. Não há `/campanhas/outono-2026` nem `/campanhas/passadas`.

### 3. Pipeline Visual (versão simples)

Duas camadas + uma sub-camada leve:

- **Atemporal da Marca** — Brand Reference Pack (`assets/prompts/brand-reference.md`), Soul Character "Modelo Ella", logo derivados, sparkles SVG, hero da home (Marca, não Campanha), fotos institucionais (`/sobre`, `/contato`), favicon, OG image padrão. Produzido uma vez, reutilizado pra sempre.
- **Sazonal da Campanha Atual** — escopo **mínimo**: vídeo da seção "Campanha Atual" na home + hero da página `/campanha`. Refeito quando a campanha muda. **Resto do site fica igual.**
- **Por Peça (sub-camada atemporal leve)** — fotografia da peça: foto isolada com background swap, detalhe macro, lifestyle com Modelo Ella usando a peça. Reaproveitável entre campanhas (peça é peça).

`assets/generated/manifest.json` ganha o campo `camada: "atemporal" | "sazonal" | "por-peca"`. Filtragem do manifest por camada permite auditar mídia da Marca, da Campanha vigente, e por slug de peça.

### 4. Trocar campanha no futuro

Procedimento padrão (esperado a cada ~3 meses):

1. Pak diz no Claude Code: "agora a campanha é Inverno".
2. Claude edita `data/campanha-atual.json` (slug, nomeExibicao, manifesto, hero paths, `produtosDestaqueSlugs`).
3. Claude gera mídia nova via Higgsfield (Cinema Studio): vídeo da seção home + hero da `/campanha`.
4. Mídia antiga da campanha anterior é **deletada de `assets/generated/sazonal/`** (não há histórico).
5. Manifest é atualizado removendo entradas da campanha antiga e adicionando as novas.
6. Deploy.

Sem migração de banco, sem código novo, sem rota nova, sem editorial novo, sem "arquivar".

### 5. Arranque (Outono 2026)

A primeira Campanha Atual nasce com o site:

```json
{
  "slug": "outono-2026",
  "nomeExibicao": "Outono na ELLA",
  "manifesto": "O Outono é sobre elegância, textura e personalidade... e a nova coleção da ELLA chegou para traduzir exatamente isso. Peças que misturam o clássico com o contemporâneo, com tons mais sóbrios, detalhes marcantes e aquele brilho na medida certa.",
  "heroVideo": null,
  "heroImagem": null,
  "ctaTexto": "Ver peças desta estação",
  "produtosDestaqueSlugs": [],
  "ativa": true,
  "atualizadoEm": "2026-05-05T13:30:00Z"
}
```

`heroVideo`, `heroImagem` e `produtosDestaqueSlugs` são preenchidos durante a Slice 1 (geração via Higgsfield + processamento do catálogo).

## Consequências

- **Schema do produto fica simples e estável.** Não há campos sazonais migráveis; nunca há "produto de coleção antiga" pra resolver.
- **Trocar campanha = edição de JSON + 2 gerações Higgsfield.** Operação enxuta, escala bem com solo founder.
- **Sem `/colecoes/[slug]`, sem `/lookbook/[slug]`.** Lookbook editorial fica de fora da Fase 1 inteira; pode entrar como *uma página* (`/lookbook`) com conteúdo estático em fase futura, fora do escopo desta ADR.
- **Perda assumida**: histórico narrativo da marca não fica online. Se a marca quiser virar "marca com história" daqui a 2 anos, abrir nova ADR para introduzir lookbook acumulativo. **Não fazer isso preventivamente.**
- **Risco mitigado**: pasta `assets/generated/sazonal/` precisa de **disciplina de limpeza** quando troca campanha. Senão acumula lixo que nunca é servido. Deletar é operação consciente, parte do fluxo de trocar campanha.

## Notas

- Esta ADR **substitui** a tentativa anterior de "Arquitetura de Coleções" (rascunho descartado neste mesmo dia). Conceitualmente, é o mesmo problema visto sob lente mais simples.
- A separação **Marca atemporal vs. Campanha Atual** continua valendo — apenas a Campanha não tem irmãs nem histórico.
- ADR-0001 (Higgsfield qualidade > economia) e ADR-0002 (variante `minimalist-ui`) e ADR-0003 (logo PNG-only) permanecem inalteradas.
- Lookbook como conceito **sai da Fase 1**. Se voltar, vira nova ADR.
