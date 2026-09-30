import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/product/breadcrumbs";
import { CartPageContent } from "@/components/cart/cart-page-content";

export const metadata: Metadata = {
  title: "Your Cart",
  robots: { index: false, follow: true },
};

export default function CartPage() {
  return (
    <div className="container-eo py-8 lg:py-12">
      <Breadcrumbs items={[{ name: "Cart", url: "/cart" }]} />
      <h1 className="mb-8 font-display text-3xl lg:text-4xl">Your Cart</h1>
      <CartPageContent />
    </div>
  );
}
