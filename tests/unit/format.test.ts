import { describe, it, expect } from "vitest";
import { formatPrice, pluralize, slugify } from "@/lib/utils/format";

describe("formatPrice", () => {
  it("formats whole dollar amounts", () => {
    expect(formatPrice(32)).toBe("$32.00");
  });

  it("formats amounts with cents", () => {
    expect(formatPrice(24.5)).toBe("$24.50");
  });

  it("formats zero", () => {
    expect(formatPrice(0)).toBe("$0.00");
  });
});

describe("pluralize", () => {
  it("returns the singular for count of 1", () => {
    expect(pluralize(1, "product")).toBe("product");
  });

  it("returns the plural for count other than 1", () => {
    expect(pluralize(0, "product")).toBe("products");
    expect(pluralize(2, "product")).toBe("products");
  });

  it("supports an irregular plural", () => {
    expect(pluralize(3, "box", "boxes")).toBe("boxes");
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("Fig & Vetiver")).toBe("fig-vetiver");
  });

  it("trims leading and trailing hyphens", () => {
    expect(slugify("  --Hearth--  ")).toBe("hearth");
  });
});
