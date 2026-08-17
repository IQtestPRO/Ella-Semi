import Link from "next/link";
import { AdminShell } from "./_components/AdminShell";
import { getAllProducts } from "../../lib/catalog";
import { formatBRL } from "../../lib/format/currency";

export const dynamic = "force-dynamic";

/**
 * Tela de entrada do painel (ADR-0024).
 *
 * Antes: 4 números (total, à venda, com foto, mais vendidos) que não levavam a
 * nenhuma ação, e 4 cartões de texto puro. Agora: caminhos grandes com desenho
 * e as peças mexidas por último COM FOTO — a pessoa reconhece a joia e entra
 * direto nela, sem precisar procurar numa lista de 167.
 */

const CAMINHOS = [
  {
    href: "/admin/produtos",
    icone: "💍",
    titulo: "Minhas peças",
    descricao: "Trocar nome, preço e fotos. Adicionar peça nova ou esconder uma que acabou.",
  },
  {
    href: "/admin/conteudo",
    icone: "📝",
    titulo: "Textos e fotos do site",
    descricao: "A foto grande do topo, sua história, o WhatsApp e as perguntas das clientes.",
  },
  {
    href: "/admin/campanha",
    icone: "⭐",
    titulo: "Vitrine de destaque",
    descricao: "Escolher quais peças aparecem em destaque na página inicial.",
  },
];

export default async function AdminHome() {
  const products = await getAllProducts();

  // Últimas peças mexidas, só as que têm foto (é o que a pessoa reconhece).
  const recentes = [...products]
    .filter((p) => p.fotos.length > 0)
    .sort(
      (a, b) =>
        new Date(b.atualizadoEm).getTime() - new Date(a.atualizadoEm).getTime(),
    )
    .slice(0, 6);

  return (
    <AdminShell title="Olá, Ellen 💛">
      <p className="mb-7 max-w-2xl text-[17px] leading-relaxed text-[var(--color-preto-warm)]">
        Aqui você muda o seu site sozinha. Escolha embaixo o que quer fazer.
        Tudo que você salvar aparece no site na mesma hora.
      </p>

      <div className="grid gap-4 sm:grid-cols-3">
        {CAMINHOS.map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex flex-col rounded-2xl border border-[var(--color-areia)] bg-white p-5 shadow-sm transition hover:border-[var(--color-dourado-claro)] hover:shadow-md"
          >
            <span aria-hidden="true" className="text-4xl">
              {c.icone}
            </span>
            <h2 className="mt-3 text-xl font-semibold text-[var(--color-preto-warm)]">
              {c.titulo}
            </h2>
            <p className="mt-1.5 flex-1 text-[15px] leading-snug text-[var(--color-taupe)]">
              {c.descricao}
            </p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-[15px] font-medium text-[var(--color-preto-warm)]">
              Abrir
              <span className="transition-transform group-hover:translate-x-0.5">
                →
              </span>
            </span>
          </Link>
        ))}
      </div>

      {recentes.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-semibold text-[var(--color-preto-warm)]">
            Peças que você mexeu por último
          </h2>
          <p className="mt-1 text-[15px] text-[var(--color-taupe)]">
            Toque numa foto para editar essa peça.
          </p>
          <ul className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6">
            {recentes.map((p) => (
              <li key={p.slug}>
                <Link
                  href={`/admin/produtos/${p.slug}`}
                  className="group block overflow-hidden rounded-xl border border-[var(--color-areia)] bg-white transition hover:border-[var(--color-dourado-claro)] hover:shadow-md"
                >
                  <div className="aspect-[4/5] overflow-hidden bg-[var(--color-salmao-claro)]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.fotos[0].url}
                      alt={p.nome}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-2.5">
                    <span className="line-clamp-2 text-sm font-medium leading-snug text-[var(--color-preto-warm)]">
                      {p.nome}
                    </span>
                    <span className="mt-0.5 block text-sm text-[var(--color-taupe)]">
                      {formatBRL(p.precoCents)}
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-10 rounded-2xl border border-[var(--color-areia)] bg-white p-5">
        <h2 className="text-lg font-semibold text-[var(--color-preto-warm)]">
          Como ver se deu certo
        </h2>
        <p className="mt-1.5 max-w-2xl text-[15px] leading-relaxed text-[var(--color-taupe)]">
          Depois de salvar qualquer coisa, toque em{" "}
          <strong className="text-[var(--color-preto-warm)]">
            &ldquo;Ver meu site ↗&rdquo;
          </strong>{" "}
          lá em cima. Ele abre numa aba nova, do jeitinho que as suas clientes
          enxergam.
        </p>
      </section>
    </AdminShell>
  );
}
