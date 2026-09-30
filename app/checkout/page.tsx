import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/product/breadcrumbs";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export const metadata: Metadata = {
  title: "Checkout",
  robots: { index: false, follow: false },
};

export default function CheckoutPage() {
  return (
    <div className="container-eo py-8 lg:py-12">
      <Breadcrumbs items={[{ name: "Cart", url: "/cart" }, { name: "Checkout", url: "/checkout" }]} />
      <h1 className="mb-8 font-display text-3xl lg:text-4xl">Checkout</h1>
      <CheckoutForm />
    </div>
  );
}
