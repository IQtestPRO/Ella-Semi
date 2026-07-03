import { AdminShell } from "../_components/AdminShell";
import {
  HeroEditor,
  BannerEditor,
  SobreEditor,
  FaqEditor,
  ContatoEditor,
  FooterEditor,
  SeoEditor,
} from "../_components/ContentEditors";
import { getSetting } from "../../../lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminConteudo() {
  const [hero, banner, sobre, faq, marca, footer, seo] = await Promise.all([
    getSetting("hero"),
    getSetting("bannerMeio"),
    getSetting("sobre"),
    getSetting("faq"),
    getSetting("marca"),
    getSetting("footer"),
    getSetting("seo"),
  ]);

  return (
    <AdminShell title="Conteúdo do site">
      <p className="mb-6 max-w-2xl text-sm text-[var(--color-taupe)]">
        Edite cada parte do site abaixo. Cada bloco tem seu próprio botão
        “Salvar” — o que você salvar aparece no site na hora.
      </p>
      <div className="flex flex-col gap-6">
        <ContatoEditor value={marca} />
        <HeroEditor value={hero} />
        <BannerEditor value={banner} />
        <SobreEditor value={sobre} />
        <FaqEditor value={faq} />
        <FooterEditor value={footer} />
        <SeoEditor value={seo} />
      </div>
    </AdminShell>
  );
}
