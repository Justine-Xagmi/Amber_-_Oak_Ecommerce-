import type { Product } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";

export function ProductGrid({ products, priorityCount = 0 }: { products: Product[]; priorityCount?: number }) {
  if (products.length === 0) return null;
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4">
      {products.map((product, i) => (
        <ProductCard key={product.id} product={product} priority={i < priorityCount} />
      ))}
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 gap-x-4 gap-y-9 sm:grid-cols-3 lg:grid-cols-4" aria-hidden="true">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i}>
          <div className="skeleton aspect-[4/5] rounded-sm" />
          <div className="skeleton mt-3.5 h-4 w-3/4 rounded-sm" />
          <div className="skeleton mt-2 h-3 w-1/2 rounded-sm" />
          <div className="skeleton mt-2 h-3.5 w-1/3 rounded-sm" />
        </div>
      ))}
    </div>
  );
}
