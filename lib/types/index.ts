export type StockStatus = "in_stock" | "low_stock" | "out_of_stock" | "preorder";

export interface ProductImage {
  url: string;
  alt: string;
  width: number;
  height: number;
}

export interface ProductVariantOption {
  id: string;
  label: string;
  /** Hex swatch shown for color-style options; omitted for size/format options. */
  swatch?: string;
}

export interface ProductVariantAxis {
  id: string;
  name: string;
  options: ProductVariantOption[];
}

export interface ProductVariant {
  id: string;
  /** Maps each axis id (e.g. "scent") to the chosen option id (e.g. "fig-vetiver"). */
  selections: Record<string, string>;
  price: number;
  compareAtPrice?: number;
  sku: string;
  stock: number;
  stockStatus: StockStatus;
  weightGrams: number;
}

export interface ProductReviewSummary {
  average: number;
  count: number;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  story: string;
  categorySlug: string;
  collectionSlugs: string[];
  images: ProductImage[];
  basePrice: number;
  compareAtPrice?: number;
  currency: "USD";
  variantAxes: ProductVariantAxis[];
  variants: ProductVariant[];
  attributes: { label: string; value: string }[];
  burnTimeHours?: number;
  scentNotes?: { top: string[]; heart: string[]; base: string[] };
  materials: string[];
  reviews: ProductReviewSummary;
  isNew?: boolean;
  isBestseller?: boolean;
  featured?: boolean;
  relatedSlugs: string[];
}

export interface Category {
  slug: string;
  name: string;
  description: string;
  heroImage: ProductImage;
}

export interface CartLine {
  variantId: string;
  productSlug: string;
  quantity: number;
}

export interface Address {
  fullName: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface Order {
  id: string;
  createdAt: string;
  email: string;
  shippingAddress: Address;
  lines: {
    productName: string;
    variantLabel: string;
    quantity: number;
    unitPrice: number;
    image: ProductImage;
  }[];
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}
