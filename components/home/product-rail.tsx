import Link from "next/link";
import type { Product } from "@/lib/types";
import { ProductGrid } from "@/components/product/product-grid";

export function ProductRail({
  title,
  viewAllHref,
  products,
}: {
  title: string;
  viewAllHref: string;
  products: Product[];
}) {
  if (products.length === 0) return null;
  return (
    <section className="container-eo py-16 lg:py-24">
      <div className="mb-8 flex items-end justify-between">
        <h2 className="font-display text-2xl lg:text-3xl">{title}</h2>
        <Link href={viewAllHref} className="text-sm text-ink-400 hover:text-brass-500 dark:text-parchment-100">
          View all
        </Link>
      </div>
      <ProductGrid products={products} />
    </section>
  );
}
