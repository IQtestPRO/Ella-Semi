import { beforeEach, describe, expect, it } from "vitest";
import { useCart } from "../../lib/cart/store";

const sample = (overrides: Partial<{ slug: string; precoCents: number }> = {}) => ({
  slug: overrides.slug ?? "brinco-folha-suspensa-semijoia",
  nome: "Brinco Folha Suspensa Semijoia",
  precoCents: overrides.precoCents ?? 6990,
  categoria: "brincos" as const,
  fotoUrl: undefined,
});

describe("cart store (Zustand)", () => {
  beforeEach(() => {
    useCart.getState().clear();
    useCart.getState().close();
  });

  it("adds a new item with qty=1 by default", () => {
    useCart.getState().add(sample());
    const items = useCart.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(1);
  });

  it("increments qty when adding the same slug twice", () => {
    useCart.getState().add(sample());
    useCart.getState().add(sample(), 2);
    const items = useCart.getState().items;
    expect(items).toHaveLength(1);
    expect(items[0].qty).toBe(3);
  });

  it("calculates totalCents correctly", () => {
    useCart.getState().add(sample({ slug: "a", precoCents: 1000 }));
    useCart.getState().add(sample({ slug: "b", precoCents: 2500 }), 2);
    expect(useCart.getState().totalCents()).toBe(1000 + 2500 * 2);
  });

  it("itemCount sums quantities across distinct items", () => {
    useCart.getState().add(sample({ slug: "a" }), 2);
    useCart.getState().add(sample({ slug: "b" }), 3);
    expect(useCart.getState().itemCount()).toBe(5);
  });

  it("setQty replaces qty (not adds)", () => {
    useCart.getState().add(sample(), 5);
    useCart.getState().setQty(sample().slug, 2);
    expect(useCart.getState().items[0].qty).toBe(2);
  });

  it("setQty 0 removes the item", () => {
    useCart.getState().add(sample());
    useCart.getState().setQty(sample().slug, 0);
    expect(useCart.getState().items).toHaveLength(0);
  });

  it("remove drops the item by slug", () => {
    useCart.getState().add(sample({ slug: "a" }));
    useCart.getState().add(sample({ slug: "b" }));
    useCart.getState().remove("a");
    expect(useCart.getState().items.map((i) => i.slug)).toEqual(["b"]);
  });

  it("clear empties the cart", () => {
    useCart.getState().add(sample({ slug: "a" }));
    useCart.getState().add(sample({ slug: "b" }));
    useCart.getState().clear();
    expect(useCart.getState().items).toHaveLength(0);
  });

  it("open/close/toggle drive isOpen", () => {
    expect(useCart.getState().isOpen).toBe(false);
    useCart.getState().open();
    expect(useCart.getState().isOpen).toBe(true);
    useCart.getState().close();
    expect(useCart.getState().isOpen).toBe(false);
    useCart.getState().toggle();
    expect(useCart.getState().isOpen).toBe(true);
  });
});
