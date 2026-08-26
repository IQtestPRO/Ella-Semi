/**
 * aplicar-textos-ellen.mjs — pedidos da Ellen por WhatsApp (26/08, ADR-0028):
 *   "Tirar tbm meu nome. Colocar nossa equipe entrará com contato"
 *   "Tirar meu nome é colocar: uma de nossas atendentes"
 *   "Deixar só nome ELLA"           -> rodapé sem "warm editorial soft glam"
 *   "Deixar só ELLA SEMIJOIAS" + "não precisa colocar cidade nenhuma"
 * Mais: tirar os travessões (—), que no celular quebravam a linha deixando um
 * traço solto no começo da frase (o Pak circulou isso no print).
 *
 * Espelha os defaults de lib/settings/index.ts. Idempotente.
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
const agora = new Date().toISOString();

const atual = Object.fromEntries(
  (await db.execute("SELECT chave, valor FROM settings")).rows.map((r) => [r.chave, JSON.parse(r.valor)]),
);

const sobre = {
  titulo: "Sobre a ELLA",
  subtitulo: "feito à mão, desde 1998",
  paragrafos: [
    "A ELLA nasceu em 1998, criando peças exclusivas e feitas à mão. Com o tempo, a loja cresceu para as semijoias, sempre com materiais de qualidade e o mesmo cuidado do primeiro dia.",
    "Nossa missão é embelezar e elevar a autoestima de mulheres que merecem o melhor dos acessórios. Semijoias com banho que dura, design contemporâneo e peças para acompanhar você do café da manhã ao jantar.",
    "Sem checkout impessoal. Você escolhe, finaliza pelo WhatsApp e a gente conversa direto. Cada peça sai com cuidado, porque cada peça continua uma história em ouro.",
  ],
  ctaTexto: "Falar no WhatsApp",
  ctaHref: atual.sobre?.ctaHref ?? "https://wa.link/adq88g",
};

const faq = {
  itens: [
    { q: "Como compro uma peça?",
      a: "Você adiciona a peça ao carrinho e clica em finalizar pelo WhatsApp. A conversa abre direto no aplicativo com a sua escolha já escrita. Sem cadastro e sem checkout no site." },
    { q: "Vocês entregam pra todo Brasil?",
      a: "Sim, entregamos para todo o Brasil. O frete é combinado pelo WhatsApp junto com o seu endereço, e nossa equipe passa o valor antes de fechar o pedido." },
    { q: "As peças têm garantia?",
      a: "Semijoias têm garantia de 6 meses a 1 ano contra defeitos de fabricação. A garantia não cobre mau uso nem pinos de brincos. Bijuterias não têm garantia." },
    { q: "Posso trocar uma peça depois?",
      a: "Sim, exceto peças em promoção, que não são trocadas. Para trocar, fale com uma de nossas atendentes no WhatsApp em até 7 dias da entrega." },
    { q: "Como funcionam peças sob encomenda?",
      a: "Cordões personalizados (gravação, comprimento sob medida) e peças sob encomenda exigem pagamento prévio. Nossa equipe entra em contato para confirmar prazo e valor antes de iniciar a produção." },
    { q: "Atendimento personalizado?",
      a: "Direto no WhatsApp com uma de nossas atendentes. Você pode pedir foto extra de uma peça, tirar dúvida sobre tamanho ou montar um look. Atendimento humano, sem robô." },
  ],
};

const seo = {
  siteTitle: atual.seo?.siteTitle ?? "ELLA Semijoias",
  siteDescription: "Joias e semijoias premium com atendimento direto pelo WhatsApp.",
};

const footer = {
  ...(atual.footer ?? {}),
  wordmarkTagline: "",
  microcopy: "ELLA SEMIJOIAS",
};

for (const [chave, valor] of Object.entries({ sobre, faq, seo, footer })) {
  await db.execute({
    sql: `INSERT INTO settings (chave, valor, atualizadoEm) VALUES (?, ?, ?)
          ON CONFLICT(chave) DO UPDATE SET valor = excluded.valor, atualizadoEm = excluded.atualizadoEm`,
    args: [chave, JSON.stringify(valor), agora],
  });
  console.log(`  gravado: ${chave}`);
}

let sujo = 0;
for (const r of (await db.execute("SELECT chave, valor FROM settings")).rows) {
  const v = String(r.valor);
  if (/Ellen/.test(v)) { console.log(`  ATENÇÃO: "${r.chave}" ainda cita Ellen`); sujo++; }
  if (/—/.test(v)) { console.log(`  ATENÇÃO: "${r.chave}" ainda tem travessão`); sujo++; }
}
console.log(sujo === 0 ? "\ntextos do site limpos: sem nome próprio e sem travessão." : `\n${sujo} pendência(s)`);
