"use client";

import Link from "next/link";
import { useWishlist } from "@/lib/context/wishlist-context";

export function WishlistLink() {
  const { slugs, isHydrated } = useWishlist();

  return (
    <Link
      href="/wishlist"
      className="relative hidden h-10 w-10 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-500/5 sm:flex dark:text-parchment-100 dark:hover:bg-parchment-100/10"
      aria-label={`Wishlist${slugs.length > 0 ? `, ${slugs.length} items` : ""}`}
    >
      <svg viewBox="0 0 24 24" width="19" height="19" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 20s-7.5-4.6-10-9.3C.6 7.4 2.3 4 5.7 4c1.9 0 3.4 1 4.3 2.4C10.9 5 12.4 4 14.3 4c3.4 0 5.1 3.4 3.7 6.7C15.5 15.4 12 20 12 20z"
        />
      </svg>
      {isHydrated && slugs.length > 0 && (
        <span
          className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brass-400 px-1 text-[10px] font-semibold leading-none text-ink-500"
          aria-hidden="true"
        >
          {slugs.length > 99 ? "99+" : slugs.length}
        </span>
      )}
    </Link>
  );
}
