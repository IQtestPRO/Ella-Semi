/**
 * update-contato-settings.mjs — grava no Turso os settings de contato/marca,
 * o texto "Sobre" (Rio Bonito RJ, 1998, Ellen Lopes Alves) e o footer, para
 * que o site publicado e o /admin reflitam os dados reais imediatamente.
 * Idempotente: re-rodar apenas sobrescreve as chaves. ADR-0021.
 */
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { createClient } from "@libsql/client";

const env = Object.fromEntries(
  readFileSync(resolve(".env.local"), "utf-8").split(/\r?\n/)
    .filter((l) => l && !l.startsWith("#") && l.includes("="))
    .map((l) => { const i = l.indexOf("="); return [l.slice(0, i), l.slice(i + 1)]; }),
);
const db = createClient({ url: env.TURSO_DATABASE_URL, authToken: env.TURSO_AUTH_TOKEN });

const marca = {
  whatsappNumero: "5521996249802",
  whatsappLinkGeral: "https://wa.link/adq88g",
  instagram: "https://www.instagram.com/ella_usasemijoias/",
  instagramHandle: "@ella_usasemijoias",
  email: "ellasemijoiasebijuterias@gmail.com",
};

const sobre = {
  titulo: "Sobre a ELLA",
  subtitulo: "feito à mão, desde 1998",
  paragrafos: [
    "A ELLA nasceu em Rio Bonito, no Rio de Janeiro, em 1998 — das mãos de Ellen Lopes Alves, criando peças exclusivas e feitas à mão. Com o tempo, a loja cresceu para as semijoias, sempre com materiais de qualidade e o mesmo cuidado do primeiro dia.",
    "Nossa missão é embelezar e elevar a autoestima de mulheres que merecem o melhor dos acessórios — semijoias com banho que dura, design contemporâneo e peças pra acompanhar você do café da manhã ao jantar.",
    "Sem checkout impessoal. Você escolhe, finaliza pelo WhatsApp, e a gente conversa direto. Cada peça sai com cuidado — porque cada peça continua uma história em ouro.",
  ],
  ctaTexto: "Falar com a Ellen",
  ctaHref: "https://wa.link/adq88g",
};

const footer = {
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
        { label: "WhatsApp", href: "https://wa.link/adq88g", external: true },
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
};

async function upsert(chave, valor) {
  await db.execute({
    sql: `INSERT INTO settings (chave, valor, atualizadoEm)
          VALUES (?, ?, ?)
          ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor, atualizadoEm = excluded.atualizadoEm`,
    args: [chave, JSON.stringify(valor), new Date().toISOString()],
  });
  console.log(`  ✓ ${chave} gravado`);
}

console.log("Gravando settings de contato no Turso…");
await upsert("marca", marca);
await upsert("sobre", sobre);
await upsert("footer", footer);

const rs = await db.execute("SELECT chave FROM settings ORDER BY chave");
console.log("\nChaves em settings agora:", rs.rows.map((r) => r.chave).join(", "));
console.log("Pronto.");
