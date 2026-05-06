import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ProductCard } from "../components/ProductCard";
import { SectionHeading } from "../components/home/SectionHeading";
import { Header } from "../components/Header";
import { Footer } from "../components/Footer";
import { getProductsByCategory } from "../../lib/catalog";
import { CategoriaSchema, type Categoria } from "../../lib/schemas";

type Params = { categoria: string };

const PRETTY_LABEL: Record<Categoria, string> = {
  brincos: "Brincos",
  colares: "Colares",
  pulseiras: "Pulseiras",
  aneis: "Anéis",
  conjuntos: "Conjuntos",
  gargantilhas: "Gargantilhas",
  tornozeleiras: "Tornozeleiras",
  piercings: "Piercings",
  outros: "Outros",
};

const SUBTITLES: Record<Categoria, string> = {
  brincos: "todas as peças de brinco da Coleção Folhas de Outono",
  colares: "todas as peças de colar da Coleção Folhas de Outono",
  pulseiras: "todas as peças de pulseira da Coleção Folhas de Outono",
  aneis: "todas as peças de anel da Coleção Folhas de Outono",
  conjuntos: "kits coordenados da Coleção Folhas de Outono",
  gargantilhas: "todas as peças de gargantilha da Coleção Folhas de Outono",
  tornozeleiras: "todas as peças de tornozeleira da Coleção Folhas de Outono",
  piercings: "todas as peças de piercing da Coleção Folhas de Outono",
  outros: "outras peças da Coleção Folhas de Outono",
};

export async function generateStaticParams(): Promise<Params[]> {
  // Generate one page per category in the canonical enum (matches schema).
  const all: Categoria[] = [
    "brincos",
    "colares",
    "pulseiras",
    "aneis",
    "conjuntos",
    "gargantilhas",
    "tornozeleiras",
    "piercings",
    "outros",
  ];
  return all.map((categoria) => ({ categoria }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { categoria } = await params;
  const parsed = CategoriaSchema.safeParse(categoria);
  if (!parsed.success) {
    return { title: "Categoria não encontrada — ELLA Semijoias" };
  }
  const label = PRETTY_LABEL[parsed.data];
  return {
    title: `${label} — ELLA Semijoias`,
    description: SUBTITLES[parsed.data],
  };
}

export default async function CategoriaRoute({
  params,
}: {
  params: Promise<Params>;
}) {
  const { categoria } = await params;
  const parsed = CategoriaSchema.safeParse(categoria);
  if (!parsed.success) {
    notFound();
  }

  const products = getProductsByCategory(parsed.data, { ativosOnly: true });
  const label = PRETTY_LABEL[parsed.data];
  const subtitle = SUBTITLES[parsed.data];

  return (
    <>
      <Header />
      <main className="min-h-[60vh] w-full px-5 py-16 md:px-10 md:py-24">
        <div className="mx-auto max-w-[1280px]">
          <nav
            aria-label="breadcrumb"
            className="mb-8 text-[11px] uppercase tracking-[0.2em] text-[var(--color-preto-warm)]/60"
          >
            <Link
              href="/"
              className="transition hover:text-[var(--color-preto-warm)]"
            >
              ELLA
            </Link>
            <span className="mx-2">/</span>
            <span className="text-[var(--color-preto-warm)]/90">{label}</span>
          </nav>

          <SectionHeading title={label} subtitle={subtitle} />

          {products.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-24 text-center">
              <p
                className="text-[var(--color-preto-warm)]/70"
                style={{
                  fontFamily:
                    "var(--font-secondary, Inter, system-ui, sans-serif)",
                  fontSize: "14px",
                  letterSpacing: "0.04em",
                }}
              >
                Nenhuma peça nesta categoria — em breve.
              </p>
              <Link
                href="/"
                className="text-[11px] uppercase tracking-[0.2em] text-[var(--color-preto-warm)]/60 transition hover:text-[var(--color-preto-warm)]"
              >
                ← Voltar para a home
              </Link>
            </div>
          ) : (
            <ul className="grid grid-cols-2 gap-x-4 gap-y-10 md:grid-cols-3 md:gap-x-6 md:gap-y-12 lg:grid-cols-3">
              {products.map((p) => (
                <li key={p.slug}>
                  <ProductCard product={p} />
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
