"use client";

import { useMemo, useState } from "react";
import type { Product } from "@/lib/types";
import { useCart } from "@/lib/context/cart-context";
import { Price } from "@/components/product/price";
import { StockBadge } from "@/components/product/stock-badge";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { WishlistButton } from "@/components/product/wishlist-button";
import { cn } from "@/lib/utils/cn";

function defaultSelections(product: Product): Record<string, string> {
  const selections: Record<string, string> = {};
  for (const axis of product.variantAxes) {
    const firstAvailable =
      product.variants.find(
        (v) => v.selections[axis.id] && v.stockStatus !== "out_of_stock"
      )?.selections[axis.id] ?? axis.options[0]?.id;
    if (firstAvailable) selections[axis.id] = firstAvailable;
  }
  return selections;
}

export function PurchasePanel({ product }: { product: Product }) {
  const { addItem, resolvedLines } = useCart();
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    defaultSelections(product)
  );
  const [quantity, setQuantity] = useState(1);
  const [justAdded, setJustAdded] = useState(false);

  const activeVariant = useMemo(() => {
    return product.variants.find((v) =>
      product.variantAxes.every((axis) => v.selections[axis.id] === selections[axis.id])
    );
  }, [product, selections]);

  const alreadyInCart =
    resolvedLines.find((l) => l.variantId === activeVariant?.id)?.quantity ?? 0;
  const remainingStock = activeVariant ? Math.max(activeVariant.stock - alreadyInCart, 0) : 0;
  const canAdd = Boolean(activeVariant) && activeVariant!.stockStatus !== "out_of_stock" && remainingStock > 0;

  function handleAddToCart() {
    if (!activeVariant || !canAdd) return;
    addItem(product.slug, activeVariant.id, quantity);
    setJustAdded(true);
    setQuantity(1);
    window.setTimeout(() => setJustAdded(false), 2200);
  }

  return (
    <div>
      <div className="mb-5">
        {activeVariant && <Price price={activeVariant.price} compareAtPrice={product.compareAtPrice} className="text-2xl" />}
      </div>

      {product.variantAxes.map((axis) => (
        <fieldset key={axis.id} className="mb-6">
          <legend className="field-label">
            {axis.name}
            {axis.id === "scent" && activeVariant && (
              <span className="ml-1 normal-case tracking-normal text-ink-400 dark:text-parchment-100">
                — {axis.options.find((o) => o.id === selections[axis.id])?.label}
              </span>
            )}
          </legend>
          <div className="flex flex-wrap gap-2">
            {axis.options.map((option) => {
              const isSelected = selections[axis.id] === option.id;
              const testSelections = { ...selections, [axis.id]: option.id };
              const matchingVariant = product.variants.find((v) =>
                product.variantAxes.every((a) => v.selections[a.id] === testSelections[a.id])
              );
              const optionSoldOut = matchingVariant?.stockStatus === "out_of_stock";

              if (option.swatch) {
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setSelections((s) => ({ ...s, [axis.id]: option.id }))}
                    aria-pressed={isSelected}
                    aria-label={`${option.label}${optionSoldOut ? " (out of stock)" : ""}`}
                    title={option.label}
                    className={cn(
                      "relative h-9 w-9 rounded-full border-2 transition-all",
                      isSelected ? "border-brass-400" : "border-transparent",
                      optionSoldOut && "opacity-40"
                    )}
                  >
                    <span
                      className="absolute inset-1 rounded-full"
                      style={{ backgroundColor: option.swatch }}
                    />
                    {optionSoldOut && (
                      <span className="absolute inset-0 flex items-center justify-center text-ink-500" aria-hidden="true">
                        <span className="h-full w-px rotate-45 bg-ink-500/70" />
                      </span>
                    )}
                  </button>
                );
              }

              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => setSelections((s) => ({ ...s, [axis.id]: option.id }))}
                  aria-pressed={isSelected}
                  disabled={optionSoldOut}
                  className={cn(
                    "rounded-sm border px-3.5 py-2 text-sm transition-colors disabled:cursor-not-allowed disabled:opacity-40",
                    isSelected
                      ? "border-ink-500 bg-ink-500 text-parchment-100 dark:border-brass-400 dark:bg-brass-400 dark:text-ink-500"
                      : "border-parchment-400 text-ink-400 hover:border-ink-400 dark:border-ink-100 dark:text-parchment-100"
                  )}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </fieldset>
      ))}

      {activeVariant && (
        <div className="mb-6">
          <StockBadge status={activeVariant.stockStatus} stock={activeVariant.stock} />
        </div>
      )}

      <div className="flex items-stretch gap-3">
        <QuantityStepper quantity={quantity} max={Math.max(remainingStock, 1)} onChange={setQuantity} />
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={!canAdd}
          className="btn-primary flex-1"
        >
          {!activeVariant
            ? "Select options"
            : !canAdd
              ? "Out of stock"
              : justAdded
                ? "Added ✓"
                : "Add to cart"}
        </button>
      </div>

      <div className="mt-3">
        <WishlistButton slug={product.slug} variant="full" />
      </div>

      <p role="status" aria-live="polite" className="sr-only">
        {justAdded ? `${product.name} added to cart` : ""}
      </p>
    </div>
  );
}
