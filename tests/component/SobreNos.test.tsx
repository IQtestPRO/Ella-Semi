import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SobreNos } from "../../app/components/home/SobreNos";

describe("SobreNos", () => {
  it("renders the section heading", () => {
    render(<SobreNos />);
    expect(screen.getByRole("heading", { name: /Sobre a ELLA/i })).toBeInTheDocument();
  });

  it("includes the manifesto with WhatsApp CTA", () => {
    render(<SobreNos />);
    expect(screen.getByText(/Niterói/i)).toBeInTheDocument();
    const cta = screen.getByRole("link", { name: /Falar com a Ellen/i });
    expect(cta).toHaveAttribute("href", "https://wa.link/adq88g");
    expect(cta).toHaveAttribute("target", "_blank");
  });

  it("renders 6 FAQ items", () => {
    render(<SobreNos />);
    const list = screen.getByTestId("faq-list");
    const items = list.querySelectorAll("li");
    expect(items.length).toBe(6);
  });

  it("first FAQ item is open by default", () => {
    render(<SobreNos />);
    const firstQ = screen.getByRole("button", { name: /Como compro uma peça/i });
    expect(firstQ).toHaveAttribute("aria-expanded", "true");
  });

  it("clicking a closed FAQ item opens it", async () => {
    const user = userEvent.setup();
    render(<SobreNos />);
    const fq = screen.getByRole("button", { name: /garantia/i });
    expect(fq).toHaveAttribute("aria-expanded", "false");
    await user.click(fq);
    expect(fq).toHaveAttribute("aria-expanded", "true");
  });

  it("clicking an open FAQ item closes it", async () => {
    const user = userEvent.setup();
    render(<SobreNos />);
    const firstQ = screen.getByRole("button", { name: /Como compro uma peça/i });
    expect(firstQ).toHaveAttribute("aria-expanded", "true");
    await user.click(firstQ);
    expect(firstQ).toHaveAttribute("aria-expanded", "false");
  });

  it("only one FAQ panel is open at a time", async () => {
    const user = userEvent.setup();
    render(<SobreNos />);
    await user.click(screen.getByRole("button", { name: /troca/i }));
    expect(
      screen.getByRole("button", { name: /Como compro uma peça/i }),
    ).toHaveAttribute("aria-expanded", "false");
    expect(
      screen.getByRole("button", { name: /troca/i }),
    ).toHaveAttribute("aria-expanded", "true");
  });
});
