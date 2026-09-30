import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { getAllProducts, getProductBySlug } from "@/lib/data";
import { ProductGallery } from "@/components/product/product-gallery";
import { PurchasePanel } from "@/components/product/purchase-panel";
import { Breadcrumbs } from "@/components/product/breadcrumbs";
import { RelatedProducts } from "@/components/product/related-products";
import { RecentlyViewed } from "@/components/product/recently-viewed";
import { RecordProductView } from "@/components/product/record-product-view";
import { ProductGridSkeleton } from "@/components/product/product-grid";
import { findCategorySync } from "@/lib/data/catalog";
import { jsonLdScriptProps, productJsonLd } from "@/lib/seo/structured-data";

export const revalidate = 3600;

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return {};

  const image = product.images[0];

  return {
    title: product.name,
    description: product.description,
    alternates: { canonical: `/products/${product.slug}` },
    openGraph: {
      type: "website",
      title: product.name,
      description: product.description,
      images: image ? [{ url: image.url, width: image.width, height: image.height, alt: image.alt }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: product.tagline,
      images: image ? [image.url] : undefined,
    },
  };
}

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const category = findCategorySync(product.categorySlug);

  return (
    <>
      <script {...jsonLdScriptProps(productJsonLd(product))} />
      <RecordProductView slug={product.slug} />

      <div className="container-eo py-8 lg:py-12">
        <Breadcrumbs
          items={[
            ...(category ? [{ name: category.name, url: `/categories/${category.slug}` }] : []),
            { name: product.name, url: `/products/${product.slug}` },
          ]}
        />

        <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
          <ProductGallery images={product.images} productName={product.name} />

          <div className="lg:max-w-md">
            {product.isBestseller && (
              <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brass-500">Bestseller</p>
            )}
            <h1 className="font-display text-3xl leading-tight lg:text-4xl">{product.name}</h1>
            <p className="mt-2 text-ink-100 dark:text-parchment-300">{product.tagline}</p>

            {product.reviews.count > 0 && (
              <div className="mt-3 flex items-center gap-2 text-sm">
                <StarRating rating={product.reviews.average} />
                <span className="text-ink-100 dark:text-parchment-300">
                  {product.reviews.average.toFixed(1)} ({product.reviews.count} reviews)
                </span>
              </div>
            )}

            <div className="mt-6 border-t border-parchment-300 pt-6 dark:border-ink-100">
              <PurchasePanel product={product} />
            </div>

            <div className="mt-10 space-y-3">
              <details className="group border-b border-parchment-300 py-4 dark:border-ink-100" open>
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base">
                  Description
                  <ChevronIcon />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-100 dark:text-parchment-300">
                  {product.description}
                </p>
                <p className="mt-3 text-sm italic leading-relaxed text-ink-100 dark:text-parchment-300">
                  {product.story}
                </p>
              </details>

              {product.scentNotes && (
                <details className="group border-b border-parchment-300 py-4 dark:border-ink-100">
                  <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base">
                    Scent notes
                    <ChevronIcon />
                  </summary>
                  <dl className="mt-3 space-y-2 text-sm">
                    <div className="flex gap-2">
                      <dt className="w-14 shrink-0 text-ink-100 dark:text-parchment-300">Top</dt>
                      <dd>{product.scentNotes.top.join(", ")}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-14 shrink-0 text-ink-100 dark:text-parchment-300">Heart</dt>
                      <dd>{product.scentNotes.heart.join(", ")}</dd>
                    </div>
                    <div className="flex gap-2">
                      <dt className="w-14 shrink-0 text-ink-100 dark:text-parchment-300">Base</dt>
                      <dd>{product.scentNotes.base.join(", ")}</dd>
                    </div>
                  </dl>
                </details>
              )}

              <details className="group border-b border-parchment-300 py-4 dark:border-ink-100">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base">
                  Details &amp; materials
                  <ChevronIcon />
                </summary>
                <dl className="mt-3 space-y-2 text-sm">
                  {product.attributes.map((attr) => (
                    <div key={attr.label} className="flex gap-2">
                      <dt className="w-32 shrink-0 text-ink-100 dark:text-parchment-300">{attr.label}</dt>
                      <dd>{attr.value}</dd>
                    </div>
                  ))}
                </dl>
              </details>

              <details className="group border-b border-parchment-300 py-4 dark:border-ink-100">
                <summary className="flex cursor-pointer list-none items-center justify-between font-display text-base">
                  Shipping &amp; returns
                  <ChevronIcon />
                </summary>
                <p className="mt-3 text-sm leading-relaxed text-ink-100 dark:text-parchment-300">
                  Orders ship within two business days. Free shipping on orders over $75; flat $6
                  rate otherwise. Unused items may be returned within 30 days of delivery.
                </p>
              </details>
            </div>
          </div>
        </div>
      </div>

      <Suspense fallback={<div className="container-eo py-16"><ProductGridSkeleton count={4} /></div>}>
        <RelatedProducts slugs={product.relatedSlugs} />
      </Suspense>

      <RecentlyViewed excludeSlug={product.slug} />
    </>
  );
}

function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      className="shrink-0 transition-transform duration-200 group-open:rotate-180"
      aria-hidden="true"
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 9l6 6 6-6" />
    </svg>
  );
}

function StarRating({ rating }: { rating: number }) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className="flex" aria-hidden="true">
      {Array.from({ length: 5 }).map((_, i) => {
        const fill = i + 1 <= rounded ? 1 : i + 0.5 === rounded ? 0.5 : 0;
        return (
          <svg key={i} viewBox="0 0 20 20" width="14" height="14" className="text-brass-400">
            <defs>
              <linearGradient id={`star-${i}`}>
                <stop offset={`${fill * 100}%`} stopColor="currentColor" />
                <stop offset={`${fill * 100}%`} stopColor="transparent" />
              </linearGradient>
            </defs>
            <path
              fill={`url(#star-${i})`}
              stroke="currentColor"
              strokeWidth="0.5"
              d="M10 1.5l2.6 5.3 5.8.8-4.2 4.1 1 5.8L10 14.8l-5.2 2.7 1-5.8L1.6 7.6l5.8-.8L10 1.5z"
            />
          </svg>
        );
      })}
    </div>
  );
}
