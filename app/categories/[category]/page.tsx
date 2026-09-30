import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import { Suspense } from "react";
import { getAllCategories, getAllScentOptions } from "@/lib/data";
import { findCategorySync } from "@/lib/data/catalog";
import { Breadcrumbs } from "@/components/product/breadcrumbs";
import { FiltersPanel } from "@/components/product/filters-panel";
import { SortDropdown } from "@/components/product/sort-dropdown";
import { ProductResults } from "@/components/product/product-results";
import { ProductGridSkeleton } from "@/components/product/product-grid";
import type { ProductQuery } from "@/lib/data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await getAllCategories();
  return categories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: slug } = await params;
  const category = findCategorySync(slug);
  if (!category) return {};

  return {
    title: category.name,
    description: category.description,
    alternates: { canonical: `/categories/${category.slug}` },
    openGraph: {
      title: category.name,
      description: category.description,
      images: [{ url: category.heroImage.url, width: category.heroImage.width, height: category.heroImage.height }],
    },
  };
}

interface PageProps {
  params: Promise<{ category: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function CategoryPage({ params, searchParams }: PageProps) {
  const { category: categorySlug } = await params;
  const category = findCategorySync(categorySlug);
  if (!category) notFound();

  const sp = await searchParams;
  const [categories, scentOptions] = await Promise.all([getAllCategories(), getAllScentOptions()]);

  const query: ProductQuery = {
    category: category.slug,
    sort: (typeof sp.sort === "string" ? sp.sort : undefined) as ProductQuery["sort"],
    scents: sp.scent ? (Array.isArray(sp.scent) ? sp.scent : [sp.scent]) : undefined,
  };
  const resultsKey = JSON.stringify(query);

  return (
    <div>
      <div className="relative h-64 overflow-hidden lg:h-80">
        <Image
          src={category.heroImage.url}
          alt={category.heroImage.alt}
          fill
          sizes="100vw"
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink-500/45" />
        <div className="container-eo relative flex h-full flex-col justify-end pb-8 text-parchment-50">
          <h1 className="font-display text-4xl lg:text-5xl">{category.name}</h1>
        </div>
      </div>

      <div className="container-eo py-8 lg:py-12">
        <Breadcrumbs items={[{ name: category.name, url: `/categories/${category.slug}` }]} />

        <p className="mb-8 max-w-prose text-ink-100 dark:text-parchment-300">{category.description}</p>

        <div className="grid gap-10 lg:grid-cols-[220px_1fr]">
          <aside>
            <details className="lg:hidden">
              <summary className="btn-secondary mb-6 cursor-pointer list-none">Filters</summary>
              <div className="mt-4">
                <Suspense fallback={null}><FiltersPanel categories={categories} scentOptions={scentOptions} activeCategory={category.slug} /></Suspense>
              </div>
            </details>
            <div className="hidden lg:block">
              <Suspense fallback={null}><FiltersPanel categories={categories} scentOptions={scentOptions} activeCategory={category.slug} /></Suspense>
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
    </div>
  );
}
