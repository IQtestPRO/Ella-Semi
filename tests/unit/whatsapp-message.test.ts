import { describe, expect, it } from "vitest";
import { montarMensagemWhatsApp } from "../../lib/cart/whatsapp";
import type { CartItem } from "../../lib/cart/store";

const SAMPLE: CartItem[] = [
  {
    slug: "brinco-folha-suspensa-semijoia",
    nome: "Brinco Folha Suspensa Semijoia",
    precoCents: 6990,
    categoria: "brincos",
    qty: 1,
  },
  {
    slug: "colar-galho-pendente-semijoia",
    nome: "Colar Galho Pendente Semijoia",
    precoCents: 8990,
    categoria: "colares",
    qty: 2,
  },
];

const NUMERO = "5521999998888";

describe("montarMensagemWhatsApp", () => {
  it("generates a PED-XXXXXX id with 6 alphanumeric chars (no 0/O/1/I)", () => {
    const { pedidoId } = montarMensagemWhatsApp(SAMPLE, NUMERO);
    expect(pedidoId).toMatch(/^PED-[A-Z2-9]{6}$/);
    expect(pedidoId).not.toContain("0");
    expect(pedidoId).not.toContain("1");
    expect(pedidoId).not.toContain("O");
    expect(pedidoId).not.toContain("I");
  });

  it("includes each item with quantity in the message text", () => {
    const { text } = montarMensagemWhatsApp(SAMPLE, NUMERO);
    expect(text).toContain("Brinco Folha Suspensa Semijoia");
    expect(text).toContain("Colar Galho Pendente Semijoia");
    expect(text).toContain("x1");
    expect(text).toContain("x2");
  });

  it("computes correct subtotal", () => {
    const { subtotalCents } = montarMensagemWhatsApp(SAMPLE, NUMERO);
    // 6990*1 + 8990*2 = 6990 + 17980 = 24970
    expect(subtotalCents).toBe(24970);
  });

  it("URL is wa.me with URL-encoded message", () => {
    const { url } = montarMensagemWhatsApp(SAMPLE, NUMERO);
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
  });

  it("usa o número passado como argumento (editável no /admin via settings)", () => {
    const { url } = montarMensagemWhatsApp(SAMPLE, NUMERO);
    expect(url).toContain(NUMERO);
  });
});
