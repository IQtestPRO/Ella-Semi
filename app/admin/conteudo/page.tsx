import { AdminShell } from "../_components/AdminShell";
import {
  HeroEditor,
  BannerEditor,
  SobreEditor,
  FaqEditor,
  ContatoEditor,
  FooterEditor,
  SeoEditor,
  CategoriasFotosEditor,
} from "../_components/ContentEditors";
import { Advanced } from "../_components/ui";
import { getSetting } from "../../../lib/settings";

export const dynamic = "force-dynamic";

/**
 * Textos e fotos do site (ADR-0024).
 *
 * Antes: 7 blocos e ~30 campos numa rolagem só, começando pelo mais técnico.
 * Agora: um atalho no topo para cada assunto, blocos na MESMA ORDEM em que a
 * cliente vê o site, e as duas partes que quase ninguém mexe (finalzinho e
 * Google) fechadas dentro de "avançado".
 */

const ATALHOS = [
  { id: "foto-topo", label: "A foto que abre o site", icone: "🖼️" },
  { id: "faixa-meio", label: "A faixa do meio", icone: "✨" },
  { id: "fotos-categorias", label: "Fotos das categorias", icone: "🗂️" },
  { id: "minha-historia", label: "Minha história", icone: "💛" },
  { id: "perguntas", label: "Perguntas e respostas", icone: "❓" },
  { id: "whatsapp", label: "WhatsApp e redes", icone: "📱" },
];

export default async function AdminConteudo() {
  const [hero, banner, sobre, faq, marca, footer, seo, categoriasFotos] = await Promise.all([
    getSetting("hero"),
    getSetting("bannerMeio"),
    getSetting("sobre"),
    getSetting("faq"),
    getSetting("marca"),
    getSetting("footer"),
    getSetting("seo"),
    getSetting("categoriasFotos"),
  ]);

  return (
    <AdminShell
      title="Textos e fotos do site"
      subtitulo="Cada parte tem o seu próprio botão Salvar. O que você salvar aparece no site na hora."
    >
      {/* Atalhos: a pessoa vai direto ao que quer, sem rolar tudo */}
      <nav aria-label="Ir direto para" className="mb-8">
        <p className="mb-2.5 text-[15px] font-medium text-[var(--color-preto-warm)]">
          O que você quer mudar?
        </p>
        <ul className="flex flex-wrap gap-2">
          {ATALHOS.map((a) => (
            <li key={a.id}>
              <a
                href={`#${a.id}`}
                className="inline-flex min-h-[48px] items-center gap-2 rounded-xl border border-[var(--color-areia)] bg-white px-4 text-[15px] font-medium text-[var(--color-preto-warm)] transition hover:border-[var(--color-dourado-claro)]"
              >
                <span aria-hidden="true" className="text-lg">
                  {a.icone}
                </span>
                {a.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      {/* Blocos na ordem em que a cliente vê o site */}
      <div className="flex flex-col gap-6">
        <div id="foto-topo" className="scroll-mt-32">
          <HeroEditor value={hero} />
        </div>
        <div id="faixa-meio" className="scroll-mt-32">
          <BannerEditor value={banner} />
        </div>
        <div id="fotos-categorias" className="scroll-mt-32">
          <CategoriasFotosEditor value={categoriasFotos} />
        </div>
        <div id="minha-historia" className="scroll-mt-32">
          <SobreEditor value={sobre} />
        </div>
        <div id="perguntas" className="scroll-mt-32">
          <FaqEditor value={faq} />
        </div>
        <div id="whatsapp" className="scroll-mt-32">
          <ContatoEditor value={marca} />
        </div>

        <Advanced
          label="Partes que quase ninguém mexe"
          hint="o finalzinho do site e o texto do Google."
        >
          <div className="flex flex-col gap-6">
            <FooterEditor value={footer} />
            <SeoEditor value={seo} />
          </div>
        </Advanced>
      </div>
    </AdminShell>
  );
}
