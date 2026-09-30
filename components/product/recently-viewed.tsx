"use client";

import { useRecentlyViewed } from "@/lib/context/recently-viewed-context";
import { findProductBySlugSync } from "@/lib/data/catalog";
import { ProductCard } from "@/components/product/product-card";

export function RecentlyViewed({ excludeSlug }: { excludeSlug?: string }) {
  const { slugs, isHydrated } = useRecentlyViewed();

  if (!isHydrated) return null;

  const products = slugs
    .filter((s) => s !== excludeSlug)
    .map((s) => findProductBySlugSync(s))
    .filter((p): p is NonNullable<typeof p> => Boolean(p))
    .slice(0, 4);

  if (products.length === 0) return null;

  return (
    <section aria-labelledby="recently-viewed-heading" className="container-eo py-16">
      <h2 id="recently-viewed-heading" className="mb-6 font-display text-2xl">
        Recently viewed
      </h2>
      <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </section>
  );
}
