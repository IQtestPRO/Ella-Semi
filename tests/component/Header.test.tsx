import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Header } from "../../app/components/Header";
import { useCart } from "../../lib/cart/store";

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
  beforeEach(() => {
    useCart.getState().clear();
    useCart.getState().close();
  });

  it("renders the ELLA logo with link to home", () => {
    render(<Header />);
    const logoLink = screen.getByRole("link", {
      name: /voltar para a home/i,
    });
    expect(logoLink).toHaveAttribute("href", "/");
  });

  it("renders the cart button (not a link) with accessible label", () => {
    render(<Header />);
    const cartButton = screen.getByTestId("header-cart-button");
    expect(cartButton.tagName).toBe("BUTTON");
    expect(cartButton).toHaveAccessibleName(/abrir carrinho/i);
  });

  it("clicking cart button opens the cart store", async () => {
    const user = userEvent.setup();
    render(<Header />);
    expect(useCart.getState().isOpen).toBe(false);
    await user.click(screen.getByTestId("header-cart-button"));
    expect(useCart.getState().isOpen).toBe(true);
  });
});
