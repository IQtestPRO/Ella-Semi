import { notFound } from "next/navigation";
import { AdminShell } from "../../_components/AdminShell";
import { ProductEditor } from "../../_components/ProductEditor";
import { getProductBySlug } from "../../../../lib/catalog";

export const dynamic = "force-dynamic";

export default async function EditarPecaPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  return (
    <AdminShell title="Editar peça">
      <ProductEditor mode="edit" product={product} />
    </AdminShell>
  );
}
