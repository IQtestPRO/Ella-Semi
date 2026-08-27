import { cache } from "react";
import { z } from "zod";
import { db } from "../db";

/**
 * Camada de Settings (CMS) — todo conteúdo editável do site que não é produto
 * nem campanha vive aqui, como `chave -> JSON` na tabela `settings` (ADR-0021).
 *
 * Cada chave tem um schema Zod + um DEFAULT igual ao conteúdo hardcoded
 * original. Se a chave não existir no banco (ou estiver corrompida), o getter
 * cai no default — o site nunca quebra por falta de configuração.
 *
 * O painel /admin escreve essas chaves; os componentes públicos as leem.
 */

// ── Schemas ────────────────────────────────────────────────────────────────

/** Aceita "instagram.com/ella" e completa o https:// em vez de recusar. */
const urlTolerante = z.preprocess((v) => {
  if (typeof v !== "string") return v;
  const s = v.trim();
  if (!s) return s;
  return /^https?:\/\//i.test(s) ? s : `https://${s}`;
}, z.string().url());

export const MarcaSchema = z.object({
  // Exige o código do país: sem o 55 o wa.me não abre e todo pedido do
  // carrinho some em silêncio. A UI normaliza antes de enviar (lib/format/whatsapp).
  whatsappNumero: z
    .string()
    .regex(/^55\d{10,11}$/, "precisa ser 55 + DDD + número"),
  whatsappLinkGeral: urlTolerante,
  instagram: urlTolerante,
  instagramHandle: z.string().min(1),
  email: z.string().email(),
});

export const HeroSchema = z.object({
  subtitulo: z.string().min(1),
  // Vídeo é opcional de verdade: o rótulo na tela diz "(opcional)", então
  // apagar o campo não pode travar o salvamento com "Dados inválidos".
  videoUrl: z.string().default(""),
  fallbackUrl: z.string().min(1),
});

export const BannerMeioSchema = z.object({
  texto: z.string().min(1),
  videoUrl: z.string().default(""),
  fallbackUrl: z.string().min(1),
});

export const SobreSchema = z.object({
  titulo: z.string().min(1),
  subtitulo: z.string().min(1),
  paragrafos: z.array(z.string().min(1)).min(1),
  ctaTexto: z.string().min(1),
  ctaHref: z.string().min(1),
});

export const FaqSchema = z.object({
  itens: z
    .array(z.object({ q: z.string().min(1), a: z.string().min(1) }))
    .min(1),
});

export const FooterLinkSchema = z.object({
  label: z.string().min(1),
  href: z.string().min(1),
  external: z.boolean(),
});

export const FooterColunaSchema = z.object({
  heading: z.string().min(1),
  links: z.array(FooterLinkSchema),
});

export const FooterSchema = z.object({
  // Pode ficar vazia: a Ellen pediu o rodapé só com o nome ELLA.
  wordmarkTagline: z.string().default(""),
  microcopy: z.string().min(1),
  colunas: z.array(FooterColunaSchema),
});

/**
 * Foto de cada card da seção "Explore por Categoria" (ADR-0030). Chave vazia ou
 * ausente = usa a foto padrão da marca em /assets/generated/categorias.
 * A Ellen troca cada uma no /admin; o corte 4:5 é feito no upload.
 */
export const CategoriasFotosSchema = z.object({
  colares: z.string().default(""),
  brincos: z.string().default(""),
  pulseiras: z.string().default(""),
  conjuntos: z.string().default(""),
  mixes: z.string().default(""),
});

export const SeoSchema = z.object({
  siteTitle: z.string().min(1),
  siteDescription: z.string().min(1),
});

// ── Mapa de chaves -> schema ────────────────────────────────────────────────

export const SETTINGS_SCHEMAS = {
  marca: MarcaSchema,
  hero: HeroSchema,
  bannerMeio: BannerMeioSchema,
  sobre: SobreSchema,
  faq: FaqSchema,
  footer: FooterSchema,
  seo: SeoSchema,
  categoriasFotos: CategoriasFotosSchema,
} as const;

export type SettingKey = keyof typeof SETTINGS_SCHEMAS;
export type SettingValue<K extends SettingKey> = z.infer<
  (typeof SETTINGS_SCHEMAS)[K]
>;

// ── Defaults (espelham o conteúdo hardcoded original) ───────────────────────

export const SETTINGS_DEFAULTS: { [K in SettingKey]: SettingValue<K> } = {
  marca: {
    whatsappNumero:
      process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5521996249802",
    whatsappLinkGeral: "https://wa.link/adq88g",
    instagram: "https://www.instagram.com/ella_usasemijoias/",
    instagramHandle: "@ella_usasemijoias",
    email: "ellasemijoiasebijuterias@gmail.com",
  },
  hero: {
    subtitulo: "summer glow · primavera 2027",
    videoUrl: "/hero/hero-loop.mp4",
    fallbackUrl: "/hero/hero-fallback.webp",
  },
  bannerMeio: {
    texto: "Cada peça, uma história em ouro.",
    videoUrl: "/banners/banner-meio.mp4",
    fallbackUrl: "/banners/banner-meio-fallback.webp",
  },
  sobre: {
    titulo: "Sobre a ELLA",
    subtitulo: "feito à mão, desde 1998",
    paragrafos: [
      "A ELLA nasceu em 1998, criando peças exclusivas e feitas à mão. Com o tempo, a loja cresceu para as semijoias, sempre com materiais de qualidade e o mesmo cuidado do primeiro dia.",
      "Nossa missão é embelezar e elevar a autoestima de mulheres que merecem o melhor dos acessórios. Semijoias com garantia, design contemporâneo e peças para acompanhar você em qualquer ocasião.",
      "Você escolhe a peça e, pelo WhatsApp, tem um atendimento personalizado com um de nossos atendentes, sempre atenciosos e prontos para te ajudar.",
    ],
    ctaTexto: "Falar no WhatsApp",
    ctaHref: "https://wa.link/adq88g",
  },
  faq: {
    itens: [
      {
        q: "Como compro uma peça?",
        a: "Você adiciona a peça ao carrinho e clica em finalizar pelo WhatsApp. A conversa abre direto no aplicativo com a sua escolha já escrita. Sem cadastro e sem checkout no site.",
      },
      {
        q: "Vocês entregam pra todo Brasil?",
        a: "Sim, entregamos para todo o Brasil. O frete é combinado pelo WhatsApp junto com o seu endereço, e nossa equipe passa o valor antes de fechar o pedido.",
      },
      {
        q: "As peças têm garantia?",
        a: "Semijoias têm garantia de 6 meses a 1 ano contra defeitos de fabricação. A garantia não cobre mau uso nem pinos de brincos. Bijuterias não têm garantia.",
      },
      {
        q: "Posso trocar uma peça depois?",
        a: "Sim, exceto peças em promoção, que não são trocadas. Para trocar, fale com uma de nossas atendentes no WhatsApp em até 7 dias da entrega.",
      },
      {
        q: "Como funcionam peças sob encomenda?",
        a: "Cordões personalizados (gravação, comprimento sob medida) e peças sob encomenda exigem pagamento prévio. Nossa equipe entra em contato para confirmar prazo e valor antes de iniciar a produção.",
      },
      {
        q: "Atendimento personalizado?",
        a: "Direto no WhatsApp com uma de nossas atendentes. Você pode pedir foto extra de uma peça, tirar dúvida sobre tamanho ou montar um look. Atendimento humano, sem robô.",
      },
    ],
  },
  footer: {
    // Ellen pediu: só o nome no rodapé, e sem cidade — a loja vende pro Brasil todo.
    wordmarkTagline: "",
    microcopy: "ELLA SEMIJOIAS",
    colunas: [
      {
        heading: "Sobre",
        links: [
          { label: "A marca", href: "/#sobre-nos-heading", external: false },
          { label: "Privacidade", href: "/privacidade", external: false },
        ],
      },
      {
        heading: "Categorias",
        links: [
          { label: "Colares", href: "/colares", external: false },
          { label: "Brincos", href: "/brincos", external: false },
          { label: "Pulseiras", href: "/pulseiras", external: false },
          { label: "Chokers", href: "/gargantilhas", external: false },
          { label: "Conjuntos", href: "/conjuntos", external: false },
        ],
      },
      {
        heading: "Atendimento",
        links: [
          {
            label: "WhatsApp",
            href: "https://wa.link/adq88g",
            external: true,
          },
          { label: "Todas as peças", href: "/produtos", external: false },
        ],
      },
      {
        heading: "Redes",
        links: [
          {
            label: "Instagram",
            href: "https://www.instagram.com/ella_usasemijoias/",
            external: true,
          },
          {
            label: "Email",
            href: "mailto:ellasemijoiasebijuterias@gmail.com",
            external: true,
          },
        ],
      },
    ],
  },
  categoriasFotos: {
    colares: "",
    brincos: "",
    pulseiras: "",
    conjuntos: "",
    mixes: "",
  },
  seo: {
    siteTitle: "ELLA Semijoias",
    siteDescription:
      "Joias e semijoias premium com atendimento direto pelo WhatsApp.",
  },
};

// ── Leitura ─────────────────────────────────────────────────────────────────

/** Carrega TODAS as settings numa query só (memoizado por request). */
const loadAllSettings = cache(async (): Promise<Record<string, unknown>> => {
  const rs = await db.execute("SELECT chave, valor FROM settings");
  const out: Record<string, unknown> = {};
  for (const row of rs.rows) {
    const chave = row.chave as string;
    try {
      out[chave] = JSON.parse(row.valor as string);
    } catch {
      // valor corrompido → ignora, getter cai no default
    }
  }
  return out;
});

/**
 * Lê uma setting tipada. Valida com o schema da chave; se faltar ou estiver
 * inválida, retorna o DEFAULT (merge raso pra tolerar campos novos).
 */
export async function getSetting<K extends SettingKey>(
  key: K,
): Promise<SettingValue<K>> {
  const all = await loadAllSettings();
  const schema = SETTINGS_SCHEMAS[key];
  const fallback = SETTINGS_DEFAULTS[key];
  const raw = all[key];
  if (raw === undefined) return fallback;
  const merged =
    raw && typeof raw === "object" && !Array.isArray(raw)
      ? { ...(fallback as object), ...(raw as object) }
      : raw;
  const parsed = schema.safeParse(merged);
  return parsed.success ? (parsed.data as SettingValue<K>) : fallback;
}

// ── Escrita (usada pelo /admin) ─────────────────────────────────────────────

/** Persiste uma setting validada. Lança se o valor não bater com o schema. */
export async function setSetting<K extends SettingKey>(
  key: K,
  value: SettingValue<K>,
): Promise<void> {
  const schema = SETTINGS_SCHEMAS[key];
  const data = schema.parse(value);
  await db.execute({
    sql: `INSERT INTO settings (chave, valor, atualizadoEm)
          VALUES (?, ?, ?)
          ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor, atualizadoEm = excluded.atualizadoEm`,
    args: [key, JSON.stringify(data), new Date().toISOString()],
  });
}
