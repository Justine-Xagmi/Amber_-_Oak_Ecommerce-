import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getOrderFromCookie } from "@/lib/actions/checkout";
import { formatPrice, formatDate } from "@/lib/utils/format";

export const metadata: Metadata = {
  title: "Order Confirmed",
  robots: { index: false, follow: false },
};

export default async function OrderConfirmationPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;
  const order = await getOrderFromCookie(orderId);

  if (!order) {
    notFound();
  }

  return (
    <div className="container-eo max-w-2xl py-14 lg:py-20">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-success/10 text-success">
          <svg viewBox="0 0 24 24" width="26" height="26" fill="none" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="font-display text-3xl lg:text-4xl">Order confirmed</h1>
        <p className="mt-2 text-ink-100 dark:text-parchment-300">
          A confirmation was sent to {order.email}. We&apos;ll email you again once it ships.
        </p>
      </div>

      <div className="rounded-sm border border-parchment-300 p-6 dark:border-ink-100">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-2 border-b border-parchment-300 pb-5 text-sm dark:border-ink-100">
          <div>
            <p className="text-ink-100 dark:text-parchment-300">Order number</p>
            <p className="font-medium">{order.id}</p>
          </div>
          <div>
            <p className="text-ink-100 dark:text-parchment-300">Date</p>
            <p className="font-medium">{formatDate(order.createdAt)}</p>
          </div>
        </div>

        <ul className="mb-5 space-y-4 border-b border-parchment-300 pb-5 dark:border-ink-100">
          {order.lines.map((line, i) => (
            <li key={i} className="flex gap-3">
              <div className="relative h-16 w-14 shrink-0 overflow-hidden rounded-sm bg-parchment-200 dark:bg-ink-100">
                <Image src={line.image.url} alt={line.image.alt} fill sizes="56px" className="object-cover" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium leading-tight">{line.productName}</p>
                <p className="text-xs text-ink-100 dark:text-parchment-300">
                  {line.variantLabel} · Qty {line.quantity}
                </p>
              </div>
              <p className="text-sm">{formatPrice(line.unitPrice * line.quantity)}</p>
            </li>
          ))}
        </ul>

        <div className="mb-5 space-y-2 border-b border-parchment-300 pb-5 text-sm dark:border-ink-100">
          <div className="flex justify-between">
            <span className="text-ink-100 dark:text-parchment-300">Subtotal</span>
            <span>{formatPrice(order.subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-100 dark:text-parchment-300">Shipping</span>
            <span>{order.shipping === 0 ? "Free" : formatPrice(order.shipping)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink-100 dark:text-parchment-300">Tax</span>
            <span>{formatPrice(order.tax)}</span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Total</span>
            <span>{formatPrice(order.total)}</span>
          </div>
        </div>

        <div className="text-sm">
          <p className="mb-1 text-ink-100 dark:text-parchment-300">Shipping to</p>
          <p>{order.shippingAddress.fullName}</p>
          <p>{order.shippingAddress.line1}{order.shippingAddress.line2 ? `, ${order.shippingAddress.line2}` : ""}</p>
          <p>
            {order.shippingAddress.city}, {order.shippingAddress.region} {order.shippingAddress.postalCode}
          </p>
          <p>{order.shippingAddress.country}</p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <Link href="/products" className="btn-secondary">
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
