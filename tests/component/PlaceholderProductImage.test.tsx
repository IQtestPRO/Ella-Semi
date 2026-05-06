import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { PlaceholderProductImage } from "../../app/components/product/PlaceholderProductImage";
import type { Categoria } from "../../lib/schemas";

const ALL_CATEGORIAS: Categoria[] = [
  "brincos",
  "colares",
  "pulseiras",
  "aneis",
  "conjuntos",
  "gargantilhas",
  "tornozeleiras",
  "piercings",
  "outros",
];

describe("PlaceholderProductImage", () => {
  it("renders an accessible role=img with descriptive label", () => {
    render(<PlaceholderProductImage categoria="brincos" />);
    expect(screen.getByRole("img")).toHaveAccessibleName(/foto em breve/i);
  });

  it("uses the provided alt text when given", () => {
    render(<PlaceholderProductImage categoria="colares" alt="Imagem de placeholder de colar dourado" />);
    expect(screen.getByRole("img")).toHaveAccessibleName(
      "Imagem de placeholder de colar dourado",
    );
  });

  it.each(ALL_CATEGORIAS)("encodes the category as data-categoria='%s'", (cat) => {
    const { container } = render(<PlaceholderProductImage categoria={cat} />);
    const root = container.querySelector(`[data-categoria='${cat}']`);
    expect(root).not.toBeNull();
  });

  it("includes a sparkle accent and a silhouette group in the SVG", () => {
    const { container } = render(<PlaceholderProductImage categoria="aneis" />);
    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    // 2 grupos: silhueta translate(100, 100) + sparkle translate(168, 32)
    const groups = svg!.querySelectorAll("g[transform]");
    expect(groups.length).toBeGreaterThanOrEqual(2);
  });

  it("shows the 'FOTO EM BREVE' microcopy by default", () => {
    render(<PlaceholderProductImage categoria="pulseiras" />);
    expect(screen.getByText(/foto em breve/i)).toBeInTheDocument();
  });

  it("hides the microcopy when showLabel=false", () => {
    render(<PlaceholderProductImage categoria="pulseiras" showLabel={false} />);
    expect(screen.queryByText(/foto em breve/i)).not.toBeInTheDocument();
  });

  it("falls back to outros silhouette when category is unknown (defensive)", () => {
    render(
      // @ts-expect-error testing defensive fallback
      <PlaceholderProductImage categoria="naoexiste" alt="fallback" />,
    );
    expect(screen.getByRole("img")).toBeInTheDocument();
  });
});
