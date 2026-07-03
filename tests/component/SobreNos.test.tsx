import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SobreNos } from "../../app/components/home/SobreNos";

const SOBRE = {
  titulo: "Sobre a ELLA",
  subtitulo: "warm editorial soft glam",
  paragrafos: [
    "A ELLA nasceu em Niterói pra mulheres que escolhem peças pra acompanhar o dia inteiro.",
    "Sem checkout impessoal. Você escolhe, finaliza pelo WhatsApp.",
  ],
  ctaTexto: "Falar com a Ellen",
  ctaHref: "https://wa.link/adq88g",
};

const FAQ = [
  { q: "Como compro uma peça?", a: "Adiciona ao carrinho e finaliza pelo WhatsApp." },
  { q: "Vocês entregam pra todo Brasil?", a: "Sim, frete combinado no WhatsApp." },
  { q: "As peças têm garantia?", a: "Semijoias têm garantia de 6 meses a 1 ano." },
  { q: "Posso trocar uma peça depois?", a: "Sim — exceto peças em promoção (troca em 7 dias)." },
  { q: "Como funcionam peças sob encomenda?", a: "Exigem pagamento prévio." },
  { q: "Atendimento personalizado?", a: "Direto pela Ellen no WhatsApp." },
];

function renderSobre() {
  return render(<SobreNos sobre={SOBRE} faq={FAQ} />);
}

describe("SobreNos", () => {
  it("renders the section heading", () => {
    renderSobre();
    expect(screen.getByRole("heading", { name: /Sobre a ELLA/i })).toBeInTheDocument();
  });

  it("includes the manifesto with WhatsApp CTA", () => {
    renderSobre();
    expect(screen.getByText(/Niterói/i)).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /Falar com a Ellen/i });
    expect(cta).toHaveAttribute("href", "https://wa.link/adq88g");
    expect(cta).toHaveAttribute("target", "_blank");
  });

  it("renders 6 FAQ items", () => {
    renderSobre();
    const list = screen.getByTestId("faq-list");
    const items = list.querySelectorAll("li");
    expect(items.length).toBe(6);
  });

  it("first FAQ item is open by default", () => {
    renderSobre();
    const firstQ = screen.getByRole("button", { name: /Como compro uma peça/i });
    expect(firstQ).toHaveAttribute("aria-expanded", "true");
  });

  it("clicking a closed FAQ item opens it", async () => {
    const user = userEvent.setup();
    renderSobre();
    const fq = screen.getByRole("button", { name: /garantia/i });
    expect(fq).toHaveAttribute("aria-expanded", "false");
    await user.click(fq);
    expect(fq).toHaveAttribute("aria-expanded", "true");
  });

  it("clicking an open FAQ item closes it", async () => {
    const user = userEvent.setup();
    renderSobre();
    const firstQ = screen.getByRole("button", { name: /Como compro uma peça/i });
    expect(firstQ).toHaveAttribute("aria-expanded", "true");
    await user.click(firstQ);
    expect(firstQ).toHaveAttribute("aria-expanded", "false");
  });

  it("only one FAQ panel is open at a time", async () => {
    const user = userEvent.setup();
    renderSobre();
    await user.click(screen.getByRole("button", { name: /troca/i }));
    expect(
      screen.getByRole("button", { name: /Como compro uma peça/i }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", { name: /troca/i }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});
