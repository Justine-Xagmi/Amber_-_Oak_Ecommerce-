import { ProductGridSkeleton } from "@/components/product/product-grid";

export default function Loading() {
  return (
    <div className="container-eo py-8 lg:py-12" aria-hidden="true">
      <div className="skeleton mb-2 h-4 w-24 rounded-sm" />
      <div className="skeleton mb-8 h-9 w-64 rounded-sm" />
      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <div className="hidden lg:block">
          <div className="skeleton h-4 w-20 rounded-sm" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-4 w-full rounded-sm" />
            ))}
          </div>
        </div>
        <ProductGridSkeleton />
      </div>
    </div>
  );
}
