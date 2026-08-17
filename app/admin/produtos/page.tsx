import { AdminShell } from "../_components/AdminShell";
import { ProductsTable, type ProductRow } from "../_components/ProductsTable";
import { getAllProducts } from "../../../lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminProdutos() {
  const products = await getAllProducts();
  const rows: ProductRow[] = products.map((p) => ({
    slug: p.slug,
    nome: p.nome,
    codigo: p.codigo,
    categoria: p.categoria,
    precoCents: p.precoCents,
    precoPromocionalCents: p.precoPromocionalCents,
    ativo: p.ativo,
    maisVendido: p.maisVendido,
    destaqueHome: p.destaqueHome,
    promocao: p.promocao,
    fotoUrl: p.fotos[0]?.url,
  }));

  return (
    <AdminShell
      title="Minhas peças"
      subtitulo="Tudo que está à venda no seu site. Toque numa peça para trocar o nome, o preço ou as fotos."
    >
      <ProductsTable products={rows} />
    </AdminShell>
  );
}
