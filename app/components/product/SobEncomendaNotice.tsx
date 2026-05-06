import type { Product } from "../../../lib/schemas";

export function SobEncomendaNotice({ product }: { product: Product }) {
  if (product.tipoFulfillment !== "sob-encomenda") return null;
  return (
    <aside
      role="note"
      aria-label="Aviso de fulfillment"
      className="rounded-lg border border-[var(--color-dourado)]/30 bg-[var(--color-salmao-claro)] px-4 py-3 text-sm text-[var(--color-preto-warm)]/85"
    >
      <strong className="font-semibold">Sob encomenda — pagamento prévio.</strong>{" "}
      Confirmamos prazo no WhatsApp.
    </aside>
  );
}
