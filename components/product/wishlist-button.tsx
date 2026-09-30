"use client";

import { useWishlist } from "@/lib/context/wishlist-context";
import { cn } from "@/lib/utils/cn";

export function WishlistButton({
  slug,
  variant = "icon",
}: {
  slug: string;
  variant?: "icon" | "full";
}) {
  const { has, toggle, isHydrated } = useWishlist();
  const active = isHydrated && has(slug);

  if (variant === "full") {
    return (
      <button
        type="button"
        onClick={() => toggle(slug)}
        className="btn-secondary w-full"
        aria-pressed={active}
      >
        <HeartIcon filled={active} />
        {active ? "Saved to wishlist" : "Add to wishlist"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        toggle(slug);
      }}
      className="flex h-9 w-9 items-center justify-center rounded-full bg-parchment-50/90 text-ink-400 shadow-sm backdrop-blur transition-colors hover:text-clay-500 dark:bg-ink-300/90 dark:text-parchment-100"
      aria-pressed={active}
      aria-label={active ? "Remove from wishlist" : "Add to wishlist"}
    >
      <HeartIcon filled={active} />
    </button>
  );
}

function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="17"
      height="17"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.6"
      className={cn(filled && "text-clay-500")}
      aria-hidden="true"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 20s-7.5-4.6-10-9.3C.6 7.4 2.3 4 5.7 4c1.9 0 3.4 1 4.3 2.4C10.9 5 12.4 4 14.3 4c3.4 0 5.1 3.4 3.7 6.7C15.5 15.4 12 20 12 20z"
      />
    </svg>
  );
}
