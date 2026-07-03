import { AdminShell } from "../_components/AdminShell";
import { CampanhaEditor } from "../_components/CampanhaEditor";
import { getAllProducts, getCampanhaAtual } from "../../../lib/catalog";

export const dynamic = "force-dynamic";

export default async function AdminCampanha() {
  const [campanha, produtos] = await Promise.all([
    getCampanhaAtual(),
    getAllProducts({ ativosOnly: true }),
  ]);

  return (
    <AdminShell title="Campanha da home">
      <CampanhaEditor
        campanha={campanha}
        produtos={produtos.map((p) => ({
          slug: p.slug,
          nome: p.nome,
          categoria: p.categoria,
        }))}
      />
    </AdminShell>
  );
}
