import { AdminShell } from "../../_components/AdminShell";
import { ProductEditor } from "../../_components/ProductEditor";

export const dynamic = "force-dynamic";

export default function NovaPecaPage() {
  return (
    <AdminShell title="Nova peça">
      <ProductEditor mode="create" />
    </AdminShell>
  );
}
