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

/**
 * Monta mensagem WhatsApp formatada e retorna `{ text, url, pedidoId }`.
 *
 * URL aberta em aba nova: `wa.me/<E.164>?text=<encoded>`. Cliente aperta
 * enviar manualmente na conversa que já abriu — sem bot, sem WhatsApp Business
 * API (ADR-0010).
 */
export function montarMensagemWhatsApp(items: CartItem[]) {
  const pedidoId = generatePedidoId();
  const numero =
    process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "5500000000000"; // placeholder até Ellen passar real

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
 * WhatsApp" do CartDrawer. Abre `wa.me` em aba nova com a mensagem montada
 * (ou `wa.link/adq88g` quando carrinho vazio — atendimento geral). Salva
 * snapshot do pedido. NÃO limpa o carrinho — caller decide (drawer limpa,
 * FAB não — ADR-0020).
 */
export function abrirWhatsAppComCarrinho(items: CartItem[]) {
  if (typeof window === "undefined") return;
  if (items.length === 0) {
    window.open("https://wa.link/adq88g", "_blank", "noopener,noreferrer");
    return;
  }
  const { url, pedidoId, subtotalCents } = montarMensagemWhatsApp(items);
  salvarSnapshotPedido(pedidoId, items, subtotalCents);
  window.open(url, "_blank", "noopener,noreferrer");
}
