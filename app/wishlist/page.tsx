import type { Metadata } from "next";
import { Breadcrumbs } from "@/components/product/breadcrumbs";
import { WishlistPageContent } from "@/components/product/wishlist-page-content";

export const metadata: Metadata = {
  title: "Wishlist",
  robots: { index: false, follow: true },
};

export default function WishlistPage() {
  return (
    <div className="container-eo py-8 lg:py-12">
      <Breadcrumbs items={[{ name: "Wishlist", url: "/wishlist" }]} />
      <h1 className="mb-8 font-display text-3xl lg:text-4xl">Your Wishlist</h1>
      <WishlistPageContent />
    </div>
  );
}
