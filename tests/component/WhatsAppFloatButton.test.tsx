import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { WhatsAppFloatButton } from "../../app/components/cart/WhatsAppFloatButton";
import { SiteConfigProvider } from "../../app/components/SiteConfigProvider";
import { useCart } from "../../lib/cart/store";
import type { ReactElement } from "react";

const NUMERO = "5521999998888";
const LINK_GERAL = "https://wa.link/adq88g";

function renderWithConfig(ui: ReactElement) {
  return render(
    <SiteConfigProvider
      config={{ whatsappNumero: NUMERO, whatsappLinkGeral: LINK_GERAL }}
    >
      {ui}
    </SiteConfigProvider>,
  );
}

const openSpy = vi.fn();
beforeEach(() => {
  useCart.getState().clear();
  // Force isHydrated true (Zustand normally sets after rehydrateStorage)
  useCart.setState({ isHydrated: true });
  openSpy.mockReset();
  vi.stubGlobal("open", openSpy);
});

describe("WhatsAppFloatButton", () => {
  it("renders with accessible label (empty cart → atendimento geral)", () => {
    renderWithConfig(<WhatsAppFloatButton />);
    expect(
      screen.getByRole("button", { name: /abrir whatsapp com a ellen/i }),
    ).toBeInTheDocument();
  });

  it("aria-label muda pra refletir contagem do carrinho", () => {
    useCart.getState().add({
      slug: "x",
      nome: "X",
      precoCents: 1000,
      categoria: "brincos",
    });
    renderWithConfig(<WhatsAppFloatButton />);
    expect(
      screen.getByRole("button", { name: /abrir whatsapp com 1 peça/i }),
    ).toBeInTheDocument();
  });

  it("clicking opens wa.link/adq88g when cart is empty", async () => {
    const user = userEvent.setup();
    renderWithConfig(<WhatsAppFloatButton />);
    await user.click(screen.getByTestId("whatsapp-float-button"));
    expect(openSpy).toHaveBeenCalledWith(
      "https://wa.link/adq88g",
      "_blank",
      "noopener,noreferrer",
    );
  });

  it("clicking opens wa.me with formatted message when cart has items", async () => {
    const user = userEvent.setup();
    useCart.getState().add({
      slug: "brinco-folha-suspensa-semijoia",
      nome: "Brinco Folha Suspensa Semijoia",
      precoCents: 6990,
      categoria: "brincos",
    });
    renderWithConfig(<WhatsAppFloatButton />);
    await user.click(screen.getByTestId("whatsapp-float-button"));
    expect(openSpy).toHaveBeenCalledTimes(1);
    const [url] = openSpy.mock.calls[0];
    expect(url).toMatch(/^https:\/\/wa\.me\/\d+\?text=/);
    // Message text contains piece name URL-encoded
    expect(url).toContain(encodeURIComponent("Brinco Folha Suspensa Semijoia"));
  });

  it("button has minimum 44x44 tap target (h-14 w-14 = 56)", () => {
    renderWithConfig(<WhatsAppFloatButton />);
    const btn = screen.getByTestId("whatsapp-float-button");
    expect(btn.className).toMatch(/\bh-14\b/);
    expect(btn.className).toMatch(/\bw-14\b/);
  });

  it("does NOT clear the cart after opening WhatsApp (FAB is shortcut, not finalize)", async () => {
    const user = userEvent.setup();
    useCart.getState().add({
      slug: "x",
      nome: "X",
      precoCents: 1000,
      categoria: "brincos",
    });
    renderWithConfig(<WhatsAppFloatButton />);
    await user.click(screen.getByTestId("whatsapp-float-button"));
    expect(useCart.getState().items).toHaveLength(1);
  });
});
