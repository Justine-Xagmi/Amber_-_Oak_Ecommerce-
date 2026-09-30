import { describe, it, expect } from "vitest";
import {
  findProductBySlugSync,
  findVariantSync,
  variantOptionLabel,
  priceRangeForProduct,
} from "@/lib/data/catalog";

describe("findProductBySlugSync", () => {
  it("finds an existing product", () => {
    const product = findProductBySlugSync("hearth-candle");
    expect(product?.name).toBe("Hearth");
  });

  it("returns undefined for an unknown slug", () => {
    expect(findProductBySlugSync("does-not-exist")).toBeUndefined();
  });
});

describe("findVariantSync", () => {
  it("resolves a product and its variant together", () => {
    const product = findProductBySlugSync("hearth-candle")!;
    const variantId = product.variants[0]!.id;
    const result = findVariantSync("hearth-candle", variantId);
    expect(result?.product.slug).toBe("hearth-candle");
    expect(result?.variant.id).toBe(variantId);
  });

  it("returns undefined for a variant that doesn't belong to the product", () => {
    expect(findVariantSync("hearth-candle", "not-a-real-variant")).toBeUndefined();
  });
});

describe("variantOptionLabel", () => {
  it("joins the labels of every selected axis option", () => {
    const product = findProductBySlugSync("hearth-candle")!;
    const variant = product.variants[0]!;
    const label = variantOptionLabel(product, variant);
    expect(label.length).toBeGreaterThan(0);
    expect(label).toContain("/");
  });
});

describe("priceRangeForProduct", () => {
  it("returns the min and max variant price", () => {
    const product = findProductBySlugSync("hearth-candle")!;
    const { min, max } = priceRangeForProduct(product);
    expect(min).toBeLessThanOrEqual(max);
    expect(min).toBeGreaterThan(0);
  });
});
