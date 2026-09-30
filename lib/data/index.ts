import "server-only";
import { products, categories, findProductBySlugSync } from "@/lib/data/catalog";
import type { Product, ProductVariant } from "@/lib/types";

// Re-exported so existing server-side callers can keep importing pricing
// helpers from this module; the implementation lives in catalog.ts because
// it also needs to be reachable from client components (product cards).
export { priceRangeForProduct } from "@/lib/data/catalog";

/**
 * These functions stand in for calls to a real commerce backend (Shopify,
 * Medusa, a custom API, etc). They're async and isolated here so swapping
 * the in-memory catalog for a real fetch() later only touches this file —
 * every Server Component already awaits these as if they were network
 * calls, and lists that call them are wrapped in Suspense upstream.
 */

export async function getAllProducts(): Promise<Product[]> {
  return products;
}

export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  return findProductBySlugSync(slug);
}

export async function getProductsBySlugs(slugs: string[]): Promise<Product[]> {
  const set = new Set(slugs);
  return products.filter((p) => set.has(p.slug));
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  return products.filter((p) => p.categorySlug === categorySlug);
}

export async function getFeaturedProducts(limit = 4): Promise<Product[]> {
  return products.filter((p) => p.featured).slice(0, limit);
}

export async function getBestsellers(limit = 8): Promise<Product[]> {
  return products.filter((p) => p.isBestseller).slice(0, limit);
}

export async function getNewArrivals(limit = 8): Promise<Product[]> {
  return products.filter((p) => p.isNew).slice(0, limit);
}

export async function getAllCategories() {
  return categories;
}

export interface ProductQuery {
  q?: string;
  category?: string;
  sort?: "featured" | "price-asc" | "price-desc" | "newest" | "rating";
  minPrice?: number;
  maxPrice?: number;
  scents?: string[];
}

export async function queryProducts(query: ProductQuery): Promise<Product[]> {
  let result = [...products];

  if (query.category) {
    result = result.filter((p) => p.categorySlug === query.category);
  }

  if (query.q) {
    const needle = query.q.trim().toLowerCase();
    if (needle) {
      result = result.filter((p) => {
        const haystack = `${p.name} ${p.tagline} ${p.description} ${p.categorySlug}`.toLowerCase();
        return haystack.includes(needle);
      });
    }
  }

  if (query.scents && query.scents.length > 0) {
    const scentSet = new Set(query.scents);
    result = result.filter((p) =>
      p.variantAxes.some(
        (axis) => axis.id === "scent" && axis.options.some((o) => scentSet.has(o.id))
      )
    );
  }

  if (typeof query.minPrice === "number") {
    result = result.filter((p) => p.basePrice >= query.minPrice!);
  }
  if (typeof query.maxPrice === "number") {
    result = result.filter((p) => p.basePrice <= query.maxPrice!);
  }

  switch (query.sort) {
    case "price-asc":
      result.sort((a, b) => a.basePrice - b.basePrice);
      break;
    case "price-desc":
      result.sort((a, b) => b.basePrice - a.basePrice);
      break;
    case "rating":
      result.sort((a, b) => b.reviews.average - a.reviews.average);
      break;
    case "newest":
      result.sort((a, b) => Number(b.isNew) - Number(a.isNew));
      break;
    case "featured":
    default:
      result.sort((a, b) => Number(b.featured) - Number(a.featured));
      break;
  }

  return result;
}

export function findVariant(product: Product, variantId: string): ProductVariant | undefined {
  return product.variants.find((v) => v.id === variantId);
}

/** All distinct scent options across the catalog, for the filter sidebar. */
export async function getAllScentOptions() {
  const seen = new Map<string, { id: string; label: string; swatch?: string }>();
  for (const p of products) {
    for (const axis of p.variantAxes) {
      if (axis.id !== "scent") continue;
      for (const opt of axis.options) {
        if (!seen.has(opt.id)) seen.set(opt.id, opt);
      }
    }
  }
  return Array.from(seen.values());
}

