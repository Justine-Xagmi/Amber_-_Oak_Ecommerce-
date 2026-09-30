"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useReducer,
  useState,
} from "react";
import type { CartLine } from "@/lib/types";
import { findVariantSync, variantOptionLabel } from "@/lib/data/catalog";

const STORAGE_KEY = "eo:cart:v1";

type CartState = { lines: CartLine[] };

type CartAction =
  | { type: "hydrate"; lines: CartLine[] }
  | { type: "add"; productSlug: string; variantId: string; quantity: number }
  | { type: "remove"; variantId: string }
  | { type: "setQuantity"; variantId: string; quantity: number }
  | { type: "clear" };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "hydrate":
      return { lines: action.lines };
    case "add": {
      const existing = state.lines.find((l) => l.variantId === action.variantId);
      if (existing) {
        return {
          lines: state.lines.map((l) =>
            l.variantId === action.variantId
              ? { ...l, quantity: l.quantity + action.quantity }
              : l
          ),
        };
      }
      return {
        lines: [
          ...state.lines,
          { productSlug: action.productSlug, variantId: action.variantId, quantity: action.quantity },
        ],
      };
    }
    case "remove":
      return { lines: state.lines.filter((l) => l.variantId !== action.variantId) };
    case "setQuantity":
      if (action.quantity <= 0) {
        return { lines: state.lines.filter((l) => l.variantId !== action.variantId) };
      }
      return {
        lines: state.lines.map((l) =>
          l.variantId === action.variantId ? { ...l, quantity: action.quantity } : l
        ),
      };
    case "clear":
      return { lines: [] };
    default:
      return state;
  }
}

export interface ResolvedCartLine extends CartLine {
  productName: string;
  productSlug: string;
  variantLabel: string;
  unitPrice: number;
  image: { url: string; alt: string; width: number; height: number };
  lineTotal: number;
  maxStock: number;
}

interface CartContextValue {
  lines: CartLine[];
  resolvedLines: ResolvedCartLine[];
  itemCount: number;
  subtotal: number;
  isHydrated: boolean;
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (productSlug: string, variantId: string, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clearCart: () => void;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { lines: [] });
  const [isHydrated, setIsHydrated] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Hydrate from localStorage once on mount. Server-rendered HTML always
  // starts from an empty cart, so there's nothing to reconcile and no
  // hydration mismatch — the client simply upgrades itself after mount.
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const lines = JSON.parse(raw) as CartLine[];
        dispatch({ type: "hydrate", lines });
      }
    } catch {
      // Corrupt or inaccessible storage: fall back silently to an empty cart.
    } finally {
      setIsHydrated(true);
    }
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.lines));
    } catch {
      // Storage may be full or unavailable (private browsing); cart still
      // works for the session, it just won't persist across reloads.
    }
  }, [state.lines, isHydrated]);

  const addItem = useCallback((productSlug: string, variantId: string, quantity = 1) => {
    dispatch({ type: "add", productSlug, variantId, quantity });
    setIsOpen(true);
  }, []);

  const removeItem = useCallback((variantId: string) => {
    dispatch({ type: "remove", variantId });
  }, []);

  const setQuantity = useCallback((variantId: string, quantity: number) => {
    dispatch({ type: "setQuantity", variantId, quantity });
  }, []);

  const clearCart = useCallback(() => dispatch({ type: "clear" }), []);

  const resolvedLines = useMemo<ResolvedCartLine[]>(() => {
    return state.lines
      .map((line) => {
        const found = findVariantSync(line.productSlug, line.variantId);
        if (!found) return null;
        const { product, variant } = found;
        const image = product.images[0]!;
        return {
          ...line,
          productName: product.name,
          variantLabel: variantOptionLabel(product, variant),
          unitPrice: variant.price,
          image,
          lineTotal: variant.price * line.quantity,
          maxStock: variant.stock,
        };
      })
      .filter((l): l is ResolvedCartLine => l !== null);
  }, [state.lines]);

  const itemCount = resolvedLines.reduce((sum, l) => sum + l.quantity, 0);
  const subtotal = resolvedLines.reduce((sum, l) => sum + l.lineTotal, 0);

  const value: CartContextValue = {
    lines: state.lines,
    resolvedLines,
    itemCount,
    subtotal,
    isHydrated,
    isOpen,
    openCart: () => setIsOpen(true),
    closeCart: () => setIsOpen(false),
    addItem,
    removeItem,
    setQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
