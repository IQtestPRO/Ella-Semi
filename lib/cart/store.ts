import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Categoria } from "../schemas";

export type CartItem = {
  slug: string;
  nome: string;
  precoCents: number;
  categoria: Categoria;
  fotoUrl?: string;
  qty: number;
};

type CartState = {
  items: CartItem[];
  isOpen: boolean;
  isHydrated: boolean;
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (slug: string) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  totalCents: () => number;
  itemCount: () => number;
};

/**
 * Carrinho da ELLA — Zustand com persist em localStorage 'ella-cart-v1'.
 *
 * Schema versionado conforme ADR-0010 (Pedido WhatsApp sem checkout). Snapshot
 * de pedido enviado fica em outro store ('ella-orders-v1') quando o usuário
 * finalizar pelo WhatsApp.
 */
export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      isHydrated: false,

      add: (item, qty = 1) => {
        set((state) => {
          const existing = state.items.find((i) => i.slug === item.slug);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.slug === item.slug ? { ...i, qty: i.qty + qty } : i,
              ),
            };
          }
          return { items: [...state.items, { ...item, qty }] };
        });
      },

      remove: (slug) => {
        set((state) => ({ items: state.items.filter((i) => i.slug !== slug) }));
      },

      setQty: (slug, qty) => {
        if (qty <= 0) {
          get().remove(slug);
          return;
        }
        set((state) => ({
          items: state.items.map((i) => (i.slug === slug ? { ...i, qty } : i)),
        }));
      },

      clear: () => set({ items: [] }),

      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((state) => ({ isOpen: !state.isOpen })),

      totalCents: () =>
        get().items.reduce((acc, i) => acc + i.precoCents * i.qty, 0),

      itemCount: () => get().items.reduce((acc, i) => acc + i.qty, 0),
    }),
    {
      name: "ella-cart-v1",
      partialize: (state) => ({ items: state.items }),
      onRehydrateStorage: () => (state) => {
        if (state) state.isHydrated = true;
      },
    },
  ),
);
