import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { ProductCard } from "../../app/components/ProductCard";
import type { Product } from "../../lib/schemas";

vi.mock("next/image", () => ({
  default: (props: { src: string; alt: string }) => {
    // Render plain <img> so RTL can find it as role="img"
    return <img src={props.src} alt={props.alt} data-testid="next-image" />;
  },
}));
vi.mock("next/link", () => ({
  default: ({
    href,
    children,
    "aria-label": ariaLabel,
  }: {
    href: string;
    children: React.ReactNode;
    "aria-label"?: string;
  }) => (
    <a href={href} aria-label={ariaLabel}>
      {children}
    </a>
  ),
}));

const baseProduct = (overrides: Partial<Product> = {}): Product => ({
  slug: "brinco-folha-suspensa-semijoia",
  nome: "Brinco Folha Suspensa Semijoia",
  categoria: "brincos",
  banho: "ouro",
  tipo: "semijoia",
  precoCents: 6990,
  descricao: "Brinco semijoia da Coleção Folhas de Outono.",
  fotos: [],
  promocao: false,
  tipoFulfillment: "pronta-entrega",
  destaqueHome: false,
  maisVendido: false,
  ativo: true,
  cadastradoEm: "2026-05-06T18:00:00+00:00",
  atualizadoEm: "2026-05-06T18:00:00+00:00",
  ...overrides,
});

describe("ProductCard", () => {
  it("renders the placeholder when fotos is empty", () => {
    const p = baseProduct({ fotos: [] });
    render(<ProductCard product={p} />);
    // Placeholder = role=img with "foto em breve" label
    expect(screen.getByText(/foto em breve/i)).toBeInTheDocument();
    expect(screen.queryByTestId("next-image")).not.toBeInTheDocument();
  });

  it("renders next/image when fotos has 3 entries", () => {
    const p = baseProduct({
      fotos: [
        {
          url: "/x/1.webp",
          alt: "Foto 1",
          fonte: "higgsfield-bg-swap",
          width: 1500,
          height: 1875,
        },
        {
          url: "/x/2.webp",
          alt: "Foto 2",
          fonte: "higgsfield-detalhe",
          width: 1500,
          height: 1500,
        },
        {
          url: "/x/3.webp",
          alt: "Foto 3",
          fonte: "higgsfield-lifestyle",
          width: 1500,
          height: 1875,
        },
      ],
    });
    render(<ProductCard product={p} />);
    expect(screen.getByTestId("next-image")).toBeInTheDocument();
    expect(screen.queryByText(/foto em breve/i)).not.toBeInTheDocument();
  });

  it("shows the MAIS VENDIDO badge when product.maisVendido is true", () => {
    const p = baseProduct({ maisVendido: true });
    render(<ProductCard product={p} />);
    expect(screen.getByTestId("mais-vendido-badge")).toBeInTheDocument();
    expect(screen.getByTestId("mais-vendido-badge")).toHaveTextContent(
      /mais vendido/i,
    );
  });

  it("hides the badge when maisVendido is false", () => {
    const p = baseProduct({ maisVendido: false });
    render(<ProductCard product={p} />);
    expect(screen.queryByTestId("mais-vendido-badge")).not.toBeInTheDocument();
  });

  it("hides the badge when showMaisVendidoBadge=false even if product is maisVendido", () => {
    const p = baseProduct({ maisVendido: true });
    render(<ProductCard product={p} showMaisVendidoBadge={false} />);
    expect(screen.queryByTestId("mais-vendido-badge")).not.toBeInTheDocument();
  });

  it("includes 'mais vendido' in the link aria-label when applicable", () => {
    const p = baseProduct({ maisVendido: true });
    render(<ProductCard product={p} />);
    expect(screen.getByRole("link")).toHaveAccessibleName(/mais vendido/i);
  });

  it("links to the product detail page using categoria + slug", () => {
    const p = baseProduct({ slug: "anel-veia-fina-semijoia", categoria: "aneis" });
    render(<ProductCard product={p} />);
    expect(screen.getByRole("link")).toHaveAttribute(
      "href",
      "/aneis/anel-veia-fina-semijoia",
    );
  });
});
