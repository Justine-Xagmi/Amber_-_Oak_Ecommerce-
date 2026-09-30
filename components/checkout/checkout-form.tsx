"use client";

import { useActionState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/context/cart-context";
import { submitOrder, type CheckoutFormState } from "@/lib/actions/checkout";
import { checkoutConstants } from "@/lib/actions/checkout-constants";
import { formatPrice } from "@/lib/utils/format";
import { EmptyState } from "@/components/ui/empty-state";

const initialState: CheckoutFormState = { status: "idle" };

export function CheckoutForm() {
  const { resolvedLines, subtotal, isHydrated, clearCart } = useCart();
  const [state, formAction, isPending] = useActionState(submitOrder, initialState);

  // The server action redirects on success, so we only ever see "error"
  // states here — but if it somehow returns success without redirecting,
  // clear the local cart so it doesn't linger.
  useEffect(() => {
    if (state.status === "success") clearCart();
  }, [state.status, clearCart]);

  if (!isHydrated) {
    return <div className="skeleton h-96 w-full rounded-sm" aria-hidden="true" />;
  }

  if (resolvedLines.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Add something to your cart before checking out."
        actionLabel="Browse products"
        actionHref="/products"
      />
    );
  }

  const shipping = subtotal >= checkoutConstants.FREE_SHIPPING_THRESHOLD ? 0 : checkoutConstants.SHIPPING_FLAT_RATE;
  const tax = Math.round(subtotal * checkoutConstants.TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const linesPayload = JSON.stringify(
    resolvedLines.map((l) => ({
      productSlug: l.productSlug,
      variantId: l.variantId,
      quantity: l.quantity,
    }))
  );

  const errorFor = (field: string) => state.fieldErrors?.[field];

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
      <form action={formAction} noValidate>
        <input type="hidden" name="lines" value={linesPayload} />

        {state.status === "error" && state.message && (
          <div role="alert" className="mb-6 rounded-sm border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger">
            {state.message}
          </div>
        )}

        <fieldset className="mb-8">
          <legend className="mb-4 font-display text-xl">Contact</legend>
          <div>
            <label htmlFor="email" className="field-label">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="field-input"
              aria-invalid={Boolean(errorFor("email"))}
              aria-describedby={errorFor("email") ? "email-error" : undefined}
            />
            {errorFor("email") && (
              <p id="email-error" className="field-error">
                {errorFor("email")}
              </p>
            )}
          </div>
        </fieldset>

        <fieldset className="mb-8">
          <legend className="mb-4 font-display text-xl">Shipping address</legend>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="fullName" className="field-label">
                Full name
              </label>
              <input id="fullName" name="fullName" required className="field-input" aria-invalid={Boolean(errorFor("address.fullName"))} />
              {errorFor("address.fullName") && <p className="field-error">{errorFor("address.fullName")}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="line1" className="field-label">
                Address
              </label>
              <input id="line1" name="line1" required className="field-input" aria-invalid={Boolean(errorFor("address.line1"))} />
              {errorFor("address.line1") && <p className="field-error">{errorFor("address.line1")}</p>}
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="line2" className="field-label">
                Apartment, suite, etc. (optional)
              </label>
              <input id="line2" name="line2" className="field-input" />
            </div>
            <div>
              <label htmlFor="city" className="field-label">
                City
              </label>
              <input id="city" name="city" required className="field-input" aria-invalid={Boolean(errorFor("address.city"))} />
              {errorFor("address.city") && <p className="field-error">{errorFor("address.city")}</p>}
            </div>
            <div>
              <label htmlFor="region" className="field-label">
                State / Region
              </label>
              <input id="region" name="region" required className="field-input" aria-invalid={Boolean(errorFor("address.region"))} />
              {errorFor("address.region") && <p className="field-error">{errorFor("address.region")}</p>}
            </div>
            <div>
              <label htmlFor="postalCode" className="field-label">
                Postal code
              </label>
              <input id="postalCode" name="postalCode" required className="field-input" aria-invalid={Boolean(errorFor("address.postalCode"))} />
              {errorFor("address.postalCode") && <p className="field-error">{errorFor("address.postalCode")}</p>}
            </div>
            <div>
              <label htmlFor="country" className="field-label">
                Country
              </label>
              <input id="country" name="country" required defaultValue="United States" className="field-input" aria-invalid={Boolean(errorFor("address.country"))} />
              {errorFor("address.country") && <p className="field-error">{errorFor("address.country")}</p>}
            </div>
          </div>
        </fieldset>

        <fieldset className="mb-8">
          <legend className="mb-4 font-display text-xl">Payment</legend>
          <p className="rounded-sm border border-parchment-300 bg-parchment-50 px-4 py-3 text-sm text-ink-100 dark:border-ink-100 dark:bg-ink-300 dark:text-parchment-300">
            This is a portfolio demo — no real payment is collected. Placing an order simulates a
            complete checkout and takes you to a real confirmation page.
          </p>
        </fieldset>

        <button type="submit" disabled={isPending} className="btn-primary w-full">
          {isPending ? "Placing order…" : `Place order — ${formatPrice(total)}`}
        </button>
      </form>

      <aside className="h-fit rounded-sm border border-parchment-300 p-6 dark:border-ink-100">
        <h2 className="mb-4 font-display text-xl">Order summary</h2>
        <ul className="mb-4 space-y-4">
          {resolvedLines.map((line) => (
            <li key={line.variantId} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-parchment-200 dark:bg-ink-100">
                <Image src={line.image.url} alt={line.image.alt} fill sizes="56px" className="object-cover" />
                <span className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-ink-500 text-[10px] text-parchment-100 dark:bg-brass-400 dark:text-ink-500">
                  {line.quantity}
                </span>
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-tight">{line.productName}</p>
                <p className="text-xs text-ink-100 dark:text-parchment-300">{line.variantLabel}</p>
              </div>
              <p className="text-sm">{formatPrice(line.lineTotal)}</p>
            </li>
          ))}
        </ul>
        <div className="space-y-2 border-t border-parchment-300 pt-4 text-sm dark:border-ink-100">
          <div className="flex justify-between">
            <span className="text-ink-100 dark:text-parchment-300">Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-100 dark:text-parchment-300">Shipping</span>
            <span>{shipping === 0 ? "Free" : formatPrice(shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-100 dark:text-parchment-300">Tax</span>
            <span>{formatPrice(tax)}</span>
          </div>
          <div className="flex justify-between border-t border-parchment-300 pt-2 font-medium dark:border-ink-100">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>
        <Link href="/cart" className="mt-4 block text-center text-xs text-ink-100 underline underline-offset-2 dark:text-parchment-300">
          Edit cart
        </Link>
      </aside>
    </div>
  );
}
