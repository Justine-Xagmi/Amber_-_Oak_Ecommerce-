"use client";

import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/context/cart-context";
import { QuantityStepper } from "@/components/cart/quantity-stepper";
import { Price } from "@/components/product/price";
import { EmptyState } from "@/components/ui/empty-state";
import { formatPrice } from "@/lib/utils/format";
import { checkoutConstants } from "@/lib/actions/checkout-constants";

export function CartPageContent() {
  const { resolvedLines, subtotal, isHydrated, removeItem, setQuantity } = useCart();

  if (!isHydrated) {
    return (
      <div className="space-y-4" aria-hidden="true">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="skeleton h-28 w-full rounded-sm" />
        ))}
      </div>
    );
  }

  if (resolvedLines.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Nothing's reserved until checkout — browse the collection and add a scent you like."
        actionLabel="Browse products"
        actionHref="/products"
      />
    );
  }

  const remainingForFreeShipping = Math.max(checkoutConstants.FREE_SHIPPING_THRESHOLD - subtotal, 0);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
      <ul>
        {resolvedLines.map((line) => (
          <li
            key={line.variantId}
            className="flex gap-5 border-b border-parchment-300 py-6 first:pt-0 dark:border-ink-100"
          >
            <div className="relative h-32 w-28 shrink-0 overflow-hidden rounded-sm bg-parchment-200 dark:bg-ink-100">
              <Image src={line.image.url} alt={line.image.alt} fill sizes="112px" className="object-cover" />
            </div>
            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <Link href={`/products/${line.productSlug}`} className="font-display text-lg hover:text-brass-500">
                    {line.productName}
                  </Link>
                  <p className="mt-1 text-sm text-ink-100 dark:text-parchment-300">{line.variantLabel}</p>
                </div>
                <p className="whitespace-nowrap font-medium">{formatPrice(line.lineTotal)}</p>
              </div>
              <div className="flex items-center justify-between">
                <QuantityStepper
                  quantity={line.quantity}
                  max={Math.max(line.maxStock, 1)}
                  onChange={(q) => setQuantity(line.variantId, q)}
                />
                <button
                  type="button"
                  onClick={() => removeItem(line.variantId)}
                  className="text-xs text-ink-100 underline underline-offset-2 hover:text-danger dark:text-parchment-300"
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-sm border border-parchment-300 p-6 dark:border-ink-100">
        <h2 className="font-display text-xl">Order summary</h2>
        <div className="mt-4 flex items-center justify-between text-sm">
          <span className="text-ink-100 dark:text-parchment-300">Subtotal</span>
          <Price price={subtotal} />
        </div>
        <p className="mt-3 text-xs text-ink-100 dark:text-parchment-300">
          {remainingForFreeShipping > 0
            ? `Add ${formatPrice(remainingForFreeShipping)} more for free shipping.`
            : "You've unlocked free shipping."}
        </p>
        <Link href="/checkout" className="btn-primary mt-5 w-full">
          Proceed to checkout
        </Link>
      </aside>
    </div>
  );
}
