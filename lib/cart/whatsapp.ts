import type { CartItem } from "./store";
import { formatBRL } from "../format/currency";

/**
 * Gera ID curto PED-XXXXXX (6 chars alfanuméricos sem 0/O/1/I — ADR-0010).
 */
function generatePedidoId(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let id = "PED-";
  for (let i = 0; i < 6; i++) {
    id += chars[Math.floor(Math.random() * chars.length)];
  }
  return id;
}

/** Config pública necessária pro fluxo WhatsApp (vem das settings via provider). */
export type WhatsAppConfig = {
  whatsappNumero: string;
  whatsappLinkGeral: string;
};

/**
 * Um número é "válido" pra montar `wa.me` se tem 10–15 dígitos e não é o
 * placeholder. Se inválido, o fluxo cai no link curto geral em vez de abrir
 * uma conversa com número inexistente (varredura: WhatsApp placeholder).
 */
export function isNumeroValido(numero: string | undefined | null): boolean {
  if (!numero) return false;
  const d = numero.replace(/\D/g, "");
  if (d.length < 10 || d.length > 15) return false;
  if (/^0+$/.test(d)) return false;
  if (d === "5500000000000") return false;
  return true;
}

/**
 * Monta mensagem WhatsApp formatada e retorna `{ text, url, pedidoId }`.
 *
 * URL aberta em aba nova: `wa.me/<E.164>?text=<encoded>`. Cliente aperta
 * enviar manualmente na conversa que já abriu — sem bot, sem WhatsApp Business
 * API (ADR-0010).
 */
export function montarMensagemWhatsApp(items: CartItem[], numero: string) {
  const pedidoId = generatePedidoId();

  const linhas = items.map(
    (i) =>
      `— ${i.nome} (${formatBRL(i.precoCents)}) x${i.qty}`,
  );

  const subtotalCents = items.reduce(
    (acc, i) => acc + i.precoCents * i.qty,
    0,
  );

  const text = [
    "Olá Ellen! Quero pedir:",
    "",
    ...linhas,
    "",
    `Subtotal: ${formatBRL(subtotalCents)}`,
    "",
    `Pedido ${pedidoId}`,
  ].join("\n");

  const url = `https://wa.me/${numero}?text=${encodeURIComponent(text)}`;

  return { text, url, pedidoId, subtotalCents };
}

/**
 * Salva snapshot do pedido em localStorage 'ella-orders-v1' pra cliente
 * consultar depois ("qual era o meu pedido PED-X?" — ADR-0010).
 */
export function salvarSnapshotPedido(
  pedidoId: string,
  items: CartItem[],
  subtotalCents: number,
) {
  if (typeof window === "undefined") return;
  const key = "ella-orders-v1";
  const raw = window.localStorage.getItem(key);
  const orders = raw ? JSON.parse(raw) : {};
  orders[pedidoId] = {
    pedidoId,
    items,
    subtotalCents,
    enviadoEm: new Date().toISOString(),
  };
  window.localStorage.setItem(key, JSON.stringify(orders));
}

/**
 * Helper compartilhado pelo FAB WhatsApp e pelo botão "Finalizar pelo
 * WhatsApp" do CartDrawer. Abre `wa.me` em aba nova com a mensagem montada.
 * Cai no link curto geral (`config.whatsappLinkGeral`) quando o carrinho está
 * vazio OU quando o número configurado é inválido/placeholder — nunca abre uma
 * conversa com número inexistente. Salva snapshot do pedido. NÃO limpa o
 * carrinho — caller decide (ADR-0010 / ADR-0020).
 */
export function abrirWhatsAppComCarrinho(
  items: CartItem[],
  config: WhatsAppConfig,
) {
  if (typeof window === "undefined") return;
  const abrirGeral = () =>
    window.open(config.whatsappLinkGeral, "_blank", "noopener,noreferrer");

  if (items.length === 0 || !isNumeroValido(config.whatsappNumero)) {
    abrirGeral();
    return;
  }
  const { url, pedidoId, subtotalCents } = montarMensagemWhatsApp(
    items,
    config.whatsappNumero.replace(/\D/g, ""),
  );
  salvarSnapshotPedido(pedidoId, items, subtotalCents);
  window.open(url, "_blank", "noopener,noreferrer");
}
