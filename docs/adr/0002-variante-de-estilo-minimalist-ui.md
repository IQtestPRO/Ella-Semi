# ADR-0002 — Variante de estilo ativa: `minimalist-ui`

- **Status**: aceito
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)

## Contexto

A skill bundle `Leonxlnx/taste-skill` traz três variantes de estilo mutuamente exclusivas: `minimalist-ui`, `industrial-brutalist-ui` e `high-end-visual-design`. A regra do projeto (ver `CLAUDE.md` na raiz) é **uma variante por projeto, não misturar**.

A escolha inicial do usuário foi `soft`, mas o repo da Leon **não tem variante `soft-ui`/`soft-skill`** — é vocabulário, não skill. Foi necessário escolher entre as três variantes reais.

A marca Ella é joia, escopo catálogo-vitrine sem checkout. O tom da marca é **warm editorial soft glam**: paleta quente, curvas suaves, glam acessível (universo Mejuri / Catbird / Sézane). Sem checkout no site, a primeira impressão visual é o ponto único de conversão — o "uau".

## Opções consideradas

| Variante | Mood | Aderência ao tom da Ella |
|---|---|---|
| `minimalist-ui` | Clean editorial, warm monochrome, pastéis, sem gradientes pesados | **Alta**. É a mais próxima de "soft glam acessível". |
| `high-end-visual-design` | High-end agency, luxury frio | Baixa. Tende ao frio; conflita com `warm`. |
| `industrial-brutalist-ui` | Raw mechanical, Swiss + military terminal | Nenhuma. Antitético a `soft`. |
| `brandkit` | Premium brand identity boards | N/A — categoria diferente (sistema de marca, não variante visual de execução de front). Pode coexistir. |

## Decisão

1. **Variante de estilo ativa: `minimalist-ui`.**
2. **Removidas do projeto** (`.agents/skills/` e symlinks em `.claude/skills/`): `industrial-brutalist-ui`, `high-end-visual-design`.
3. **`brandkit` permanece instalada em paralelo** — não é variante de estilo, é sistema de marca; pode ser ativada quando o sistema de identidade da Ella se cristalizar.
4. **`warm editorial soft glam` registrado em `CONTEXT.md` como descritor de tom** (linguagem do projeto), aplicado *por cima* da `minimalist-ui` — não pretende existir como skill.
5. **Porta aberta**: se após as primeiras vertical slices o estilo da Ella se mostrar distinto das três variantes existentes, abrir nova ADR e criar skill própria via `/write-a-skill` (ex.: `ella-style`). Decisão **não tomada** agora — só registrada como opção viva.

## Consequências

- A camada de execução visual (espaçamento, hierarquia, motion, paleta) será governada por `minimalist-ui` + parâmetros (`DESIGN_VARIANCE=7`, `MOTION_INTENSITY=8`, `VISUAL_DENSITY=3`) + `emil-design-eng` + `design-taste-frontend`.
- A camada de tom de marca (paleta quente, curvas, glam) é responsabilidade do designer/dev seguir o vocabulário em `CONTEXT.md`. Skill não impõe — disciplina + revisão impõe.
- Se aparecer drift entre páginas (frio vs. quente, duro vs. suave), abrir `/grill-with-docs` antes de continuar — provavelmente o vocabulário precisa ser apertado ou a `minimalist-ui` não está mais sustentando o tom.
- Trocar de variante no futuro custa: remover `minimalist-ui`, instalar nova, e re-revisar todas as superfícies já construídas. Por isso esta ADR existe — mudança de variante exige nova ADR superando esta.

## Notas

- `gpt-taste`, `stitch-design-taste`, `image-to-code`, `imagegen-frontend-web/-mobile` permanecem instaladas — são ferramentas auxiliares, não variantes de estilo competindo com a `minimalist-ui`.
