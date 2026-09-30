"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { useCart } from "@/lib/context/cart-context";
import { formatPrice } from "@/lib/utils/format";
import { QuantityStepper } from "@/components/cart/quantity-stepper";

export function CartDrawer() {
  const { isOpen, closeCart, resolvedLines, subtotal, itemCount, removeItem, setQuantity } =
    useCart();
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!isOpen && dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <dialog
      ref={dialogRef}
      onClose={closeCart}
      aria-label="Shopping cart"
      className="fixed inset-y-0 right-0 m-0 h-full max-h-none w-full max-w-md border-0 bg-parchment-50 p-0 text-ink-500 backdrop:bg-ink-500/40 backdrop:backdrop-blur-[2px] dark:bg-ink-300 dark:text-parchment-50 open:animate-fade-in"
      onClick={(e) => {
        if (e.target === dialogRef.current) closeCart();
      }}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between border-b border-parchment-300 px-6 py-5 dark:border-ink-100">
          <h2 className="font-display text-xl">
            Your cart {itemCount > 0 && <span className="text-ink-100 dark:text-parchment-300">({itemCount})</span>}
          </h2>
          <button
            type="button"
            onClick={closeCart}
            className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink-500/5 dark:hover:bg-parchment-100/10"
            aria-label="Close cart"
          >
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
              <path strokeLinecap="round" d="M5 5l14 14M19 5L5 19" />
            </svg>
          </button>
        </div>

        {resolvedLines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-3 px-6 text-center">
            <p className="font-display text-lg text-ink-400 dark:text-parchment-100">Your cart is empty</p>
            <p className="max-w-[26ch] text-sm text-ink-100 dark:text-parchment-300">
              Scents you add will show up here — nothing&apos;s reserved until checkout.
            </p>
            <Link href="/products" onClick={closeCart} className="btn-secondary mt-2">
              Browse the collection
            </Link>
          </div>
        ) : (
          <>
            <ul className="flex-1 overflow-y-auto px-6 py-4">
              {resolvedLines.map((line) => (
                <li key={line.variantId} className="flex gap-4 border-b border-parchment-300 py-5 first:pt-0 dark:border-ink-100">
                  <div className="relative h-24 w-20 shrink-0 overflow-hidden rounded-sm bg-parchment-200 dark:bg-ink-100">
                    <Image
                      src={line.image.url}
                      alt={line.image.alt}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </div>
                  <div className="flex flex-1 flex-col justify-between">
                    <div>
                      <Link
                        href={`/products/${line.productSlug}`}
                        onClick={closeCart}
                        className="text-sm font-medium hover:text-brass-500"
                      >
                        {line.productName}
                      </Link>
                      <p className="mt-0.5 text-xs text-ink-100 dark:text-parchment-300">{line.variantLabel}</p>
                      <p className="mt-1 text-sm">{formatPrice(line.unitPrice)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <QuantityStepper
                        quantity={line.quantity}
                        max={Math.max(line.maxStock, 1)}
                        onChange={(q) => setQuantity(line.variantId, q)}
                        size="sm"
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

            <div className="border-t border-parchment-300 px-6 py-5 dark:border-ink-100">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-ink-100 dark:text-parchment-300">Subtotal</span>
                <span className="font-medium">{formatPrice(subtotal)}</span>
              </div>
              <p className="mb-4 text-xs text-ink-100 dark:text-parchment-300">
                Shipping and tax calculated at checkout. Free shipping over $75.
              </p>
              <Link href="/checkout" onClick={closeCart} className="btn-primary w-full">
                Checkout
              </Link>
              <Link href="/cart" onClick={closeCart} className="btn-ghost mt-2 w-full">
                View full cart
              </Link>
            </div>
          </>
        )}
      </div>
    </dialog>
  );
}
