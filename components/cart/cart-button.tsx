"use client";

import { useCart } from "@/lib/context/cart-context";

export function CartButton() {
  const { itemCount, openCart, isHydrated } = useCart();

  return (
    <button
      type="button"
      onClick={openCart}
      className="relative flex h-10 w-10 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-500/5 dark:text-parchment-100 dark:hover:bg-parchment-100/10"
      aria-label={`Open cart${itemCount > 0 ? `, ${itemCount} items` : ""}`}
    >
      <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 8h12l-1 12H7L6 8z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 8V6a3 3 0 016 0v2" />
      </svg>
      {isHydrated && itemCount > 0 && (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brass-400 px-1 text-[10px] font-semibold leading-none text-ink-500"
          aria-hidden="true"
        >
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      )}
    </button>
  );
}
