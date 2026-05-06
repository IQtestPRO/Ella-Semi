import { z } from "zod";

export const FotoSchema = z.object({
  url: z.string().min(1),
  alt: z.string().min(1),
  fonte: z.enum([
    "higgsfield-bg-swap",
    "higgsfield-lifestyle",
    "higgsfield-detalhe",
    "foto-real-ellen-via-bg-swap",
  ]),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
});

export const VarianteOpcaoSchema = z.object({
  rotulo: z.string().min(1),
  precoCentsAjuste: z.number().int().optional(),
});

export const VarianteSchema = z.object({
  tipo: z.enum(["tamanho", "cor", "comprimento"]),
  opcoes: z.array(VarianteOpcaoSchema).min(1),
});

export const CategoriaSchema = z.enum([
  "colares",
  "aneis",
  "brincos",
  "pulseiras",
  "conjuntos",
  "gargantilhas",
  "tornozeleiras",
  "piercings",
  "outros",
]);

export const BanhoSchema = z.enum([
  "ouro",
  "prata",
  "rodio",
  "ouro-rose",
  "a-confirmar",
]);

export const TipoFulfillmentSchema = z.enum([
  "pronta-entrega",
  "sob-encomenda",
]);

export const ProductSchema = z.object({
  slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/, "slug must be kebab-case"),
  nome: z.string().min(1),
  categoria: CategoriaSchema,
  banho: BanhoSchema,
  tipo: z.enum(["semijoia", "bijuteria"]),
  precoCents: z.number().int().nonnegative(),
  precoPromocionalCents: z.number().int().nonnegative().optional(),
  descricao: z.string().min(1),
  fotos: z.array(FotoSchema).refine(
    (arr) => arr.length === 0 || arr.length === 3,
    "ADR-0008 + ADR-0016: 0 fotos (camada placeholder) ou 3 fotos (catálogo Higgsfield)"
  ),
  variantes: z.array(VarianteSchema).optional(),
  tags: z.array(z.string()).optional(),
  promocao: z.boolean(),
  tipoFulfillment: TipoFulfillmentSchema,
  destaqueHome: z.boolean(),
  maisVendido: z.boolean(),
  ativo: z.boolean(),
  origem: z
    .object({
      catalogoArquivo: z.string(),
      pagina: z.number().int().positive(),
      letra: z.string().min(1),
    })
    .optional(),
  fonteFotoFraca: z.boolean().optional(),
  cadastradoEm: z.string().datetime({ offset: true }),
  atualizadoEm: z.string().datetime({ offset: true }),
});

export const ProductsSchema = z.array(ProductSchema);

export const CampanhaAtualSchema = z.object({
  slug: z.string().min(1),
  nomeExibicao: z.string().min(1),
  manifesto: z.string().min(1),
  heroVideo: z.string().optional(),
  heroImagem: z.string().optional(),
  ctaTexto: z.string().min(1),
  produtosDestaqueSlugs: z.array(z.string()).min(1),
  ativa: z.boolean(),
  atualizadoEm: z.string().datetime({ offset: true }),
});

export type Product = z.infer<typeof ProductSchema>;
export type Foto = z.infer<typeof FotoSchema>;
export type Variante = z.infer<typeof VarianteSchema>;
export type Categoria = z.infer<typeof CategoriaSchema>;
export type Banho = z.infer<typeof BanhoSchema>;
export type TipoFulfillment = z.infer<typeof TipoFulfillmentSchema>;
export type CampanhaAtual = z.infer<typeof CampanhaAtualSchema>;
