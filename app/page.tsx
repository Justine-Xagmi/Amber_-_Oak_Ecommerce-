import { Suspense } from "react";
import { getAllCategories, getBestsellers, getNewArrivals } from "@/lib/data";
import { Hero } from "@/components/home/hero";
import { CategoryTiles } from "@/components/home/category-tiles";
import { StoryBand } from "@/components/home/story-band";
import { NewsletterBand } from "@/components/home/newsletter-band";
import { ProductRail } from "@/components/home/product-rail";
import { ProductGridSkeleton } from "@/components/product/product-grid";

export default async function HomePage() {
  const categories = await getAllCategories();

  return (
    <>
      <Hero />
      <CategoryTiles categories={categories} />

      <Suspense fallback={<div className="container-eo py-16"><ProductGridSkeleton /></div>}>
        <BestsellersRail />
      </Suspense>

      <StoryBand />

      <Suspense fallback={<div className="container-eo py-16"><ProductGridSkeleton /></div>}>
        <NewArrivalsRail />
      </Suspense>

      <NewsletterBand />
    </>
  );
}

async function BestsellersRail() {
  const products = await getBestsellers(4);
  return <ProductRail title="Bestsellers" viewAllHref="/products?sort=rating" products={products} />;
}

async function NewArrivalsRail() {
  const products = await getNewArrivals(4);
  return <ProductRail title="New arrivals" viewAllHref="/products?sort=newest" products={products} />;
}
