import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "../../app/components/Header";

vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => (
    <img src={props.src} alt={props.alt} />
  ),
}));
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
    [key: string]: unknown;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("Header", () => {
  it("renders the ELLA logo with link to home", () => {
    render(<Header />);
    const logoLink = screen.getByRole("link", {
      name: /voltar para a home/i,
    });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders the produtos icon link to /produtos with accessible label", () => {
    render(<Header />);
    const produtosLink = screen.getByTestId("header-produtos-link");
    expect(produtosLink).toHaveAttribute("href", "/produtos");
    expect(produtosLink).toHaveAccessibleName(/ver todas as peças do catálogo/i);
  });

  it("produtos link contains an SVG icon (no visible text)", () => {
    render(<Header />);
    const link = screen.getByTestId("header-produtos-link");
    expect(link.querySelector("svg")).not.toBeNull();
    // Não deve ter palavra "produtos" visível — só o ícone
    expect(link.textContent?.trim()).toBe("");
  });
});
