import { getProductsBySlugs } from "@/lib/data";
import { ProductGrid } from "@/components/product/product-grid";

export async function RelatedProducts({ slugs }: { slugs: string[] }) {
  if (slugs.length === 0) return null;
  const products = await getProductsBySlugs(slugs);
  if (products.length === 0) return null;

  return (
    <section aria-labelledby="related-heading" className="container-eo py-16">
      <h2 id="related-heading" className="mb-6 font-display text-2xl">
        You may also like
      </h2>
      <ProductGrid products={products} />
    </section>
  );
}
