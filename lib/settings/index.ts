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

export const MarcaSchema = z.object({
  whatsappNumero: z.string().regex(/^\d{10,15}$/, "número E.164 só dígitos"),
  whatsappLinkGeral: z.string().url(),
  instagram: z.string().url(),
  instagramHandle: z.string().min(1),
  email: z.string().email(),
});

export const HeroSchema = z.object({
  subtitulo: z.string().min(1),
  videoUrl: z.string().min(1),
  fallbackUrl: z.string().min(1),
});

export const BannerMeioSchema = z.object({
  texto: z.string().min(1),
  videoUrl: z.string().min(1),
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
  wordmarkTagline: z.string().min(1),
  microcopy: z.string().min(1),
  colunas: z.array(FooterColunaSchema),
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
    subtitulo: "warm editorial soft glam · outono 2026",
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
      "A ELLA nasceu em Rio Bonito, no Rio de Janeiro, em 1998 — das mãos de Ellen Lopes Alves, criando peças exclusivas e feitas à mão. Com o tempo, a loja cresceu para as semijoias, sempre com materiais de qualidade e o mesmo cuidado do primeiro dia.",
      "Nossa missão é embelezar e elevar a autoestima de mulheres que merecem o melhor dos acessórios — semijoias com banho que dura, design contemporâneo e peças pra acompanhar você do café da manhã ao jantar.",
      "Sem checkout impessoal. Você escolhe, finaliza pelo WhatsApp, e a gente conversa direto. Cada peça sai com cuidado — porque cada peça continua uma história em ouro.",
    ],
    ctaTexto: "Falar com a Ellen",
    ctaHref: "https://wa.link/adq88g",
  },
  faq: {
    itens: [
      {
        q: "Como compro uma peça?",
        a: "Você adiciona a peça ao carrinho e clica em finalizar pelo WhatsApp. Abrimos a conversa com a Ellen direto no app, com sua escolha já formatada — sem cadastro, sem checkout no site.",
      },
      {
        q: "Vocês entregam pra todo Brasil?",
        a: "Sim. O frete é combinado pelo WhatsApp junto com seu endereço. A Ellen passa o valor antes de fechar o pedido.",
      },
      {
        q: "As peças têm garantia?",
        a: "Semijoias têm garantia de 6 meses a 1 ano contra defeitos de fabricação. A garantia não cobre mau uso nem pinos de brincos. Bijuterias não têm garantia.",
      },
      {
        q: "Posso trocar uma peça depois?",
        a: "Sim — exceto peças em promoção, que não são trocadas. Pra trocar, fala com a Ellen no WhatsApp em até 7 dias da entrega.",
      },
      {
        q: "Como funcionam peças sob encomenda?",
        a: "Cordões personalizados (gravação, comprimento sob medida) e peças sob encomenda exigem pagamento prévio. A Ellen confirma prazo e valor antes de iniciar a produção.",
      },
      {
        q: "Atendimento personalizado?",
        a: "Direto pela Ellen no WhatsApp. Você pode pedir foto extra de uma peça, tirar dúvida sobre tamanho, ou montar um look — atendimento humano, sem bot.",
      },
    ],
  },
  footer: {
    wordmarkTagline: "warm editorial soft glam",
    microcopy: "ELLA Semijoias · Rio Bonito · Rio de Janeiro",
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
  seo: {
    siteTitle: "ELLA Semijoias",
    siteDescription:
      "Joias e semijoias premium — atendimento direto pelo WhatsApp.",
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
