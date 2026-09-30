import { products } from "@/lib/data/products";
import { categories } from "@/lib/data/categories";
import type { Product, ProductVariant } from "@/lib/types";

/**
 * Plain, synchronous lookups over the public product catalog. Product and
 * price data is not sensitive, so this module has no "server-only" guard —
 * both the cart's client-side context and server components use it. The
 * async, "server-only" wrappers in lib/data/index.ts are the boundary real
 * backend calls (auth-gated inventory, personalization, etc.) would sit
 * behind; this file is what they'd ultimately resolve to.
 */

export function findProductBySlugSync(slug: string): Product | undefined {
  return products.find((p) => p.slug === slug);
}

export function findVariantSync(
  productSlug: string,
  variantId: string
): { product: Product; variant: ProductVariant } | undefined {
  const product = findProductBySlugSync(productSlug);
  if (!product) return undefined;
  const variant = product.variants.find((v) => v.id === variantId);
  if (!variant) return undefined;
  return { product, variant };
}

export function variantOptionLabel(product: Product, variant: ProductVariant): string {
  return product.variantAxes
    .map((axis) => {
      const selectedId = variant.selections[axis.id];
      const option = axis.options.find((o) => o.id === selectedId);
      return option?.label;
    })
    .filter(Boolean)
    .join(" / ");
}

export function findCategorySync(slug: string) {
  return categories.find((c) => c.slug === slug);
}

export function priceRangeForProduct(product: Product): { min: number; max: number } {
  const prices = product.variants.map((v) => v.price);
  return { min: Math.min(...prices), max: Math.max(...prices) };
}

export { products, categories };
