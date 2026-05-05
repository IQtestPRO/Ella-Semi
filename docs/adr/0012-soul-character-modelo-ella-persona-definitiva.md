# ADR-0012 — Soul Character "Modelo Ella" — Persona Definitiva

- **Status**: aceito
- **Data**: 2026-05-05
- **Decisor**: Pak (com Claude)

## Contexto

ADR-0008 (revisada) determina que toda peça do catálogo recebe uma **Foto 3 com a Modelo Ella usando a peça** (mão, pescoço, orelha, tornozelo conforme a categoria). A Modelo Ella aparece em **todas** as ~90–120 peças do catálogo Outono 2026 — drift entre páginas seria catástrofe (rosto/etnia/idade variando peça-a-peça destrói a marca).

Soluções:
- **Persona "padrão Higgsfield"**: pegar uma random — drift garantido, atributos imprevisíveis.
- **Foto real de modelo profissional**: custo + complexidade + risco LGPD se sem contrato + drift se a modelo não estiver disponível pra refoto.
- **Soul Character treinado uma vez, reutilizado em todas as Foto 3 com `reference_id`**: identidade estável, controle Pak. **Caminho escolhido.**

A persona da Modelo Ella **não é a Ellen Lopes pessoa real** (fundadora; aparece — ou não — em `/sobre` decidido em ADR/pendência separada). Modelo Ella é a representação visual da **cliente-arquétipo** da marca: a mulher que usa as joias da ELLA. Tem que conversar com o tom warm-editorial-soft-glam: madura, confiante, sofisticada, brasileira, warm.

## Decisão

### Persona definitiva

| Atributo | Valor |
|---|---|
| **Gênero / idade** | Mulher, ~45–50 anos |
| **Energia** | Elegante, aura de luxo discreto (não ostentação, não juventude descolada) |
| **Estilo** | Formal/sofisticado: blazer em tom warm, blusa de seda, vestido midi clássico (não casual, não streetwear, não jovem-trendy) |
| **Pele** | Morena, traços brasileiros |
| **Cabelo** | Escuro, naturalmente bem cuidado, bem-estilizado (penteado limpo, não messy) |
| **Postura** | Confiante, não rígida; ombros relaxados, queixo levemente erguido |
| **Expressão** | Serena/amável; **não sensual**, **não corporativa-fria**; sorriso suave fechado ou expressão neutra confortável |
| **Mãos** | Cuidadas, manicure neutra (importante — mão aparece em foto de pulseira/anel; manicure colorida competiria com a peça) |
| **Iluminação** | Natural warm, **golden hour** ou **indoor com luz de janela** difusa quente |
| **Mood narrativo** | "Mulher madura que escolhe se cuidar e se valorizar — joia é parte do ritual dela." Não é "cliente de luxo gritando status"; é "cliente que conhece o próprio valor". |

### Anti-persona (o que **não** é)

- **Não** modelo profissional plástica/clean/genérica internacional.
- **Não** influencer jovem 20–25 anos com look streetwear/y2k/clean girl.
- **Não** "executiva corporativa" com terninho duro, expressão neutra fria, fundo de escritório.
- **Não** estética sensual/glamour-pesada (decotes profundos, lábios brilhosos exagerados, look "evening glamour").
- **Não** cabelo loiro platinado, californiana exagerada, cores fantasia.
- **Não** maquiagem editorial pesada (delineado dramático, batom escuro). Maquiagem **sempre** discreta e warm.
- **Não** props que competem com a peça (relógio grande, anéis múltiplos em outras mãos, pulseiras chunky de outras marcas, lenços estampados).
- **Não** ambientes frios, modernistas-minimalistas duros, brancos clínicos. Sempre warm-editorial.

### Soul Character training spec

- Treinar **um único Soul Character** com `reference_id` estável.
- Usar 8–12 imagens de calibração geradas previamente via Higgsfield Soul a partir de prompts iterativos até a identidade convergir (rosto consistente, idade consistente, etnia consistente, tom de pele consistente).
- Após convergência, **fixar o `reference_id`** em `data/higgsfield-references.json`:
  ```json
  {
    "modelo_ella": {
      "reference_id": "<id-fornecido-pela-CLI>",
      "criado_em": "2026-05-XX",
      "versao": 1,
      "anti_drift_check_em": "<data da última verificação visual de consistência>"
    }
  }
  ```
- Toda Foto 3 do catálogo (ADR-0008) referencia esse `reference_id`. Toda calibração futura usa o mesmo até nova ADR.

### Prompt pack (em `assets/prompts/soul-characters/modelo-ella.md`)

Documento separado contém:
- Prompt master (descrição completa em natural language para o Soul model).
- Prompt template para cada uso (mão+anel, mão+pulseira, lateral rosto+brinco, pescoço+colar, etc.).
- Anti-prompt (stop-words/conceitos a excluir).
- Lighting spec (golden hour vs. indoor janela), tonalidade desejada.
- Aspect ratios suportados.
- Procedimento de "anti-drift check": comparação visual periódica das gerações com referência inicial.

## Consequências

- **Drift fica arquitetonicamente impossível**: todas as Foto 3 vêm do mesmo `reference_id`. Se aparecer drift, é bug de prompt ou da CLI — não de design.
- **Investimento concentrado no início da Slice 1**: ~10–20 gerações de calibração antes do batch das ~270–360 do catálogo. Aceito (ADR-0001 cobre custo).
- **Persona é decisão de marca, não opinião pessoal**: a "mulher 45–50 morena confiante" é a **leitura do tom da marca** que o Pak fez em conversa com o briefing. Trocar a persona depois (Ellen achar que devia ser 30 e loira, por exemplo) **exige nova ADR superando esta** + recalibração + regeneração de TODA Foto 3 do catálogo. Custo alto e consciente.
- **Maquiagem/manicure neutras** simplificam consistência: prompt-fixed em todo uso, sem variação por peça.
- **Modelo Ella ≠ Ellen Lopes** explicitamente: Ellen Lopes (fundadora real) tem ADR/pendência separada para `/sobre` (criar persona inventada distinta ou usar foto real — pendência Ellen #7). Não confundir.

## Notas

- A persona pode parecer conservadora pra estética 2026 (mais comum: 25–35 anos jovem-trendy). É proposital: público-alvo da Ellen é mulher madura que **compra** joia, não que **vê** joia. Conversão > engajamento.
- Iluminação golden hour vs. indoor janela é decisão de mood do prompt — ambas warm, ambas dentro da BIOS Visual. Mix tonal aceitável; nunca luz dura/clínica/azulada.
- O `reference_id` deve ser **commitado em git** (`data/higgsfield-references.json`) para ser determinístico em deploys/reproduções; não é dado sensível.
- Se a calibração inicial falhar em convergir após 12 gerações (rosto inconsistente), o procedimento é parar e abrir grilling: o problema pode estar no prompt ou em limitações do modelo Soul. Não forçar.
