"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { findVariantSync, variantOptionLabel } from "@/lib/data/catalog";
import { checkoutConstants } from "@/lib/actions/checkout-constants";
import type { Order } from "@/lib/types";

const ORDER_COOKIE_PREFIX = "eo_order_";

const addressSchema = z.object({
  fullName: z.string().trim().min(2, "Enter the recipient's full name."),
  line1: z.string().trim().min(3, "Enter a street address."),
  line2: z.string().trim().optional(),
  city: z.string().trim().min(1, "Enter a city."),
  region: z.string().trim().min(1, "Enter a state or region."),
  postalCode: z.string().trim().min(3, "Enter a postal code."),
  country: z.string().trim().min(2, "Enter a country."),
});

const checkoutSchema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
  address: addressSchema,
  lines: z
    .array(
      z.object({
        productSlug: z.string(),
        variantId: z.string(),
        quantity: z.number().int().positive().max(20),
      })
    )
    .min(1, "Your cart is empty."),
});

export interface CheckoutFormState {
  status: "idle" | "error" | "success";
  message?: string;
  fieldErrors?: Record<string, string>;
  orderId?: string;
}

const { SHIPPING_FLAT_RATE, FREE_SHIPPING_THRESHOLD, TAX_RATE } = checkoutConstants;

export async function submitOrder(
  _prevState: CheckoutFormState,
  formData: FormData
): Promise<CheckoutFormState> {
  const rawLines = formData.get("lines");
  let parsedLines: unknown = [];
  try {
    parsedLines = rawLines ? JSON.parse(String(rawLines)) : [];
  } catch {
    parsedLines = [];
  }

  const input = {
    email: String(formData.get("email") ?? ""),
    address: {
      fullName: String(formData.get("fullName") ?? ""),
      line1: String(formData.get("line1") ?? ""),
      line2: String(formData.get("line2") ?? ""),
      city: String(formData.get("city") ?? ""),
      region: String(formData.get("region") ?? ""),
      postalCode: String(formData.get("postalCode") ?? ""),
      country: String(formData.get("country") ?? ""),
    },
    lines: parsedLines,
  };

  const result = checkoutSchema.safeParse(input);

  if (!result.success) {
    const fieldErrors: Record<string, string> = {};
    for (const issue of result.error.issues) {
      const key = issue.path.join(".");
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return {
      status: "error",
      message: "Please review the highlighted fields.",
      fieldErrors,
    };
  }

  // Re-resolve every line against the catalog server-side so pricing and
  // stock can never be trusted from the client — the form only tells us
  // *which* variants and quantities were selected.
  const orderLines: Order["lines"] = [];
  for (const line of result.data.lines) {
    const found = findVariantSync(line.productSlug, line.variantId);
    if (!found) {
      return { status: "error", message: "One of the items in your cart is no longer available." };
    }
    const { product, variant } = found;
    if (variant.stockStatus === "out_of_stock") {
      return { status: "error", message: `${product.name} just sold out — please remove it and try again.` };
    }
    orderLines.push({
      productName: product.name,
      variantLabel: variantOptionLabel(product, variant),
      quantity: line.quantity,
      unitPrice: variant.price,
      image: product.images[0]!,
    });
  }

  const subtotal = orderLines.reduce((sum, l) => sum + l.unitPrice * l.quantity, 0);
  const shipping = subtotal >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT_RATE;
  const tax = Math.round(subtotal * TAX_RATE * 100) / 100;
  const total = Math.round((subtotal + shipping + tax) * 100) / 100;

  const orderId = generateOrderId();
  const order: Order = {
    id: orderId,
    createdAt: new Date().toISOString(),
    email: result.data.email,
    shippingAddress: result.data.address,
    lines: orderLines,
    subtotal,
    shipping,
    tax,
    total,
  };

  // Demo persistence: the order is written to a short-lived, httpOnly
  // cookie so the confirmation page can render it after a redirect —
  // including on serverless deployments where in-memory state wouldn't
  // survive between requests. A production build would write to a real
  // orders table and look this up by id instead.
  const jar = await cookies();
  jar.set(`${ORDER_COOKIE_PREFIX}${orderId}`, JSON.stringify(order), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60, // 1 hour
    path: "/",
  });

  redirect(`/checkout/confirmation/${orderId}`);
}

export async function getOrderFromCookie(orderId: string): Promise<Order | null> {
  const jar = await cookies();
  const raw = jar.get(`${ORDER_COOKIE_PREFIX}${orderId}`)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as Order;
  } catch {
    return null;
  }
}

function generateOrderId(): string {
  const stamp = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `EO-${stamp}-${rand}`;
}
