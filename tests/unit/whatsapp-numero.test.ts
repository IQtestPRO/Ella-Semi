import { describe, expect, it } from "vitest";
import {
  normalizarWhatsAppBR,
  formatarWhatsAppVisivel,
} from "../../lib/format/whatsapp";

/**
 * O número do WhatsApp é o funil inteiro da loja: se ele for salvo sem o 55,
 * o wa.me não abre e TODO pedido do carrinho some — sem erro nenhum na tela.
 * Por isso o painel precisa consertar o que a Ellen digitar, não confiar.
 */
describe("normalizarWhatsAppBR", () => {
  it("completa o 55 quando ela digita só DDD + número", () => {
    expect(normalizarWhatsAppBR("(21) 99624-9802")).toBe("5521996249802");
    expect(normalizarWhatsAppBR("21996249802")).toBe("5521996249802");
    expect(normalizarWhatsAppBR("21 99624 9802")).toBe("5521996249802");
  });

  it("aceita número fixo de 8 dígitos com DDD", () => {
    expect(normalizarWhatsAppBR("2126249802")).toBe("552126249802");
  });

  it("mantém quem já digitou com 55", () => {
    expect(normalizarWhatsAppBR("5521996249802")).toBe("5521996249802");
    expect(normalizarWhatsAppBR("+55 21 99624-9802")).toBe("5521996249802");
  });

  it("recusa número curto demais (sem DDD dá para adivinhar nada)", () => {
    expect(normalizarWhatsAppBR("996249802")).toBeNull();
    expect(normalizarWhatsAppBR("9802")).toBeNull();
    expect(normalizarWhatsAppBR("")).toBeNull();
    expect(normalizarWhatsAppBR("abc")).toBeNull();
  });

  it("recusa número comprido demais", () => {
    expect(normalizarWhatsAppBR("5521996249802123456")).toBeNull();
  });

  it("não estraga o placeholder de número zerado", () => {
    expect(normalizarWhatsAppBR("5500000000000")).toBe("5500000000000");
  });
});

describe("formatarWhatsAppVisivel", () => {
  it("mostra bonitinho para a Ellen conferir", () => {
    expect(formatarWhatsAppVisivel("5521996249802")).toBe("+55 21 99624-9802");
    expect(formatarWhatsAppVisivel("552126249802")).toBe("+55 21 2624-9802");
  });

  it("devolve o que veio quando não dá para formatar", () => {
    expect(formatarWhatsAppVisivel("123")).toBe("123");
  });
});
