import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { HeaderChrome } from "../../app/components/HeaderChrome";
import { useCart } from "../../lib/cart/store";

// O <Header /> virou Server Component: ele consulta quais categorias têm peça
// no ar e passa os links prontos. Aqui testamos a parte visual/interativa.
const LINKS = [
  { href: "/colares", label: "Colares" },
  { href: "/conjuntos", label: "Conjuntos" },
  { href: "/produtos", label: "Todas as peças" },
];
const Header = () => <HeaderChrome links={LINKS} />;

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

  it("mostra só as categorias que recebeu — nada de menu para categoria vazia", () => {
    render(<Header />);
    expect(screen.getByRole("link", { name: "Colares" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Conjuntos" })).toBeInTheDocument();
    expect(screen.queryByRole("link", { name: "Brincos" })).toBeNull();
    expect(screen.queryByRole("link", { name: "Pulseiras" })).toBeNull();
  });
});
