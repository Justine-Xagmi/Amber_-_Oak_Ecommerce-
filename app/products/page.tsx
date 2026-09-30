import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllCategories, getAllScentOptions, type ProductQuery } from "@/lib/data";
import { Breadcrumbs } from "@/components/product/breadcrumbs";
import { FiltersPanel } from "@/components/product/filters-panel";
import { SortDropdown } from "@/components/product/sort-dropdown";
import { ProductResults } from "@/components/product/product-results";
import { ProductGridSkeleton } from "@/components/product/product-grid";

export const metadata: Metadata = {
  title: "All Products",
  description: "Browse every Ember & Oak candle, reed diffuser, gift set, and accessory.",
  alternates: { canonical: "/products" },
};

interface PageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ProductsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const [categories, scentOptions] = await Promise.all([getAllCategories(), getAllScentOptions()]);

  const query: ProductQuery = {
    category: typeof params.category === "string" ? params.category : undefined,
    sort: (typeof params.sort === "string" ? params.sort : undefined) as ProductQuery["sort"],
    scents: params.scent ? (Array.isArray(params.scent) ? params.scent : [params.scent]) : undefined,
    q: typeof params.q === "string" ? params.q : undefined,
  };

  const resultsKey = JSON.stringify(query);

  return (
    <div className="container-eo py-8 lg:py-12">
      <Breadcrumbs items={[{ name: "All Products", url: "/products" }]} />

      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl">All Products</h1>
        <p className="mt-2 max-w-prose text-ink-100 dark:text-parchment-300">
          Eight scents, four categories — the whole Ember &amp; Oak line in one place.
        </p>
      </div>

      <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
        <aside>
          <details className="lg:hidden">
            <summary className="btn-secondary mb-6 cursor-pointer list-none">Filters</summary>
            <div className="mt-4">
              <Suspense fallback={null}><FiltersPanel categories={categories} scentOptions={scentOptions} activeCategory={query.category} /></Suspense>
            </div>
          </details>
          <div className="hidden lg:block">
            <Suspense fallback={null}><FiltersPanel categories={categories} scentOptions={scentOptions} activeCategory={query.category} /></Suspense>
          </div>
        </aside>

        <div>
          <div className="mb-5 flex items-center justify-end">
            <Suspense fallback={null}><SortDropdown /></Suspense>
          </div>
          <Suspense key={resultsKey} fallback={<ProductGridSkeleton />}>
            <ProductResults query={query} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
