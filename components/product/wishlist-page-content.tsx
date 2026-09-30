"use client";

import { useWishlist } from "@/lib/context/wishlist-context";
import { findProductBySlugSync } from "@/lib/data/catalog";
import { ProductGrid, ProductGridSkeleton } from "@/components/product/product-grid";
import { EmptyState } from "@/components/ui/empty-state";

export function WishlistPageContent() {
  const { slugs, isHydrated } = useWishlist();

  if (!isHydrated) return <ProductGridSkeleton count={4} />;

  const products = slugs
    .map((s) => findProductBySlugSync(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p));

  if (products.length === 0) {
    return (
      <EmptyState
        title="Your wishlist is empty"
        description="Tap the heart on any product to save it here for later."
        actionLabel="Browse products"
        actionHref="/products"
      />
    );
  }

  return <ProductGrid products={products} />;
}
