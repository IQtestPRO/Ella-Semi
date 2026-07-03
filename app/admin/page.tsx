import Link from "next/link";
import { AdminShell } from "./_components/AdminShell";
import { getAllProducts, getCampanhaAtual } from "../../lib/catalog";

export const dynamic = "force-dynamic";

function StatCard({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-2xl border border-[var(--color-areia)] bg-white px-5 py-4 shadow-sm">
      <div className="text-3xl font-semibold text-[var(--color-preto-warm)]">
        {value}
      </div>
      <div className="mt-1 text-sm text-[var(--color-taupe)]">{label}</div>
    </div>
  );
}

function ActionCard({
  href,
  title,
  description,
}: {
  href: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="group rounded-2xl border border-[var(--color-areia)] bg-white p-5 shadow-sm transition hover:border-[var(--color-dourado-claro)] hover:shadow-md"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-[var(--color-preto-warm)]">
          {title}
        </h3>
        <span className="text-[var(--color-taupe)] transition group-hover:translate-x-0.5">
          →
        </span>
      </div>
      <p className="mt-1 text-sm text-[var(--color-taupe)]">{description}</p>
    </Link>
  );
}

export default async function AdminHome() {
  const [products, campanha] = await Promise.all([
    getAllProducts(),
    getCampanhaAtual(),
  ]);
  const ativos = products.filter((p) => p.ativo).length;
  const comFoto = products.filter((p) => p.fotos.length > 0).length;
  const maisVendidos = products.filter((p) => p.maisVendido && p.ativo).length;

  return (
    <AdminShell title="Bem-vinda, Ellen 💛">
      <p className="mb-6 max-w-2xl text-[15px] leading-relaxed text-[var(--color-taupe)]">
        Aqui você controla tudo do site sozinha. Toda alteração que você salvar
        aparece no site na hora — não precisa mexer em código nem chamar
        ninguém. Comece escolhendo uma área abaixo.
      </p>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <StatCard label="Peças no total" value={products.length} />
        <StatCard label="Peças à venda" value={ativos} />
        <StatCard label="Com foto" value={comFoto} />
        <StatCard label="Mais vendidos" value={maisVendidos} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <ActionCard
          href="/admin/produtos"
          title="Produtos"
          description="Adicionar, editar, excluir peças. Trocar nome, preço, fotos e descrição."
        />
        <ActionCard
          href="/admin/campanha"
          title="Campanha da home"
          description="Editar o destaque sazonal: nome, texto, vídeo/foto e peças em destaque."
        />
        <ActionCard
          href="/admin/conteudo"
          title="Conteúdo do site"
          description="Hero, banner, 'Sobre a ELLA', perguntas frequentes, WhatsApp e rodapé."
        />
        <ActionCard
          href="/"
          title="Ver o site"
          description="Abrir a loja como seus clientes veem (em uma nova aba)."
        />
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--color-areia)] bg-[var(--color-salmao-claro)]/60 p-5">
        <h3 className="font-semibold text-[var(--color-preto-warm)]">
          Campanha atual: {campanha.nomeExibicao}
        </h3>
        <p className="mt-1 text-sm text-[var(--color-taupe)]">
          {campanha.ativa
            ? "Está aparecendo na home agora."
            : "Está desligada (não aparece na home)."}{" "}
          <Link href="/admin/campanha" className="underline">
            Editar
          </Link>
        </p>
      </div>
    </AdminShell>
  );
}
