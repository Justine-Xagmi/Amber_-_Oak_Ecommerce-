import type { Product } from "@/lib/types";
import { siteConfig } from "@/lib/seo/site-config";
import { priceRangeForProduct } from "@/lib/data";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: `${siteConfig.url}/icons/icon-512.png`,
    sameAs: [`https://instagram.com/emberandoak`, `https://twitter.com/emberandoak`],
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteConfig.url}/search?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${siteConfig.url}${item.url}`,
    })),
  };
}

export function productJsonLd(product: Product) {
  const { min, max } = priceRangeForProduct(product);
  const inStock = product.variants.some((v) => v.stockStatus !== "out_of_stock");

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => i.url),
    sku: product.variants[0]?.sku,
    brand: { "@type": "Brand", name: siteConfig.name },
    aggregateRating:
      product.reviews.count > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: product.reviews.average,
            reviewCount: product.reviews.count,
          }
        : undefined,
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: min,
      highPrice: max,
      offerCount: product.variants.length,
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      url: `${siteConfig.url}/products/${product.slug}`,
    },
  };
}

/** Renders any JSON-LD object as a script tag props object for a Server Component. */
export function jsonLdScriptProps(data: unknown) {
  return {
    type: "application/ld+json" as const,
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}
