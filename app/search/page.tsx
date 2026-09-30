import type { Metadata } from "next";
import { Suspense } from "react";
import { SearchForm } from "@/components/layout/search-form";
import { ProductResults } from "@/components/product/product-results";
import { ProductGridSkeleton } from "@/components/product/product-grid";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false, follow: true },
};

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";

  return (
    <div className="container-eo py-8 lg:py-12">
      <h1 className="font-display text-3xl lg:text-4xl">Search</h1>
      <SearchForm defaultValue={query} className="mt-6 max-w-lg" autoFocus={!query} />

      <div className="mt-10">
        {!query ? (
          <EmptyState
            title="Search the collection"
            description="Try a scent note like “cedar” or “fig”, or a product type like “diffuser”."
          />
        ) : (
          <Suspense key={query} fallback={<ProductGridSkeleton />}>
            <SearchResultsHeading query={query} />
            <ProductResults query={{ q: query }} />
          </Suspense>
        )}
      </div>
    </div>
  );
}

function SearchResultsHeading({ query }: { query: string }) {
  return (
    <p className="mb-2 text-sm text-ink-100 dark:text-parchment-300">
      Results for <span className="font-medium text-ink-400 dark:text-parchment-100">&ldquo;{query}&rdquo;</span>
    </p>
  );
}
