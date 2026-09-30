import { queryProducts, type ProductQuery } from "@/lib/data";
import { ProductGrid } from "@/components/product/product-grid";
import { EmptyState } from "@/components/ui/empty-state";
import { pluralize } from "@/lib/utils/format";

export async function ProductResults({ query }: { query: ProductQuery }) {
  const products = await queryProducts(query);

  if (products.length === 0) {
    return (
      <EmptyState
        title="No products match those filters"
        description="Try removing a filter or searching a different scent family."
        actionLabel="Clear filters"
        actionHref={query.category ? `/categories/${query.category}` : "/products"}
      />
    );
  }

  return (
    <div>
      <p className="mb-5 text-sm text-ink-100 dark:text-parchment-300">
        {products.length} {pluralize(products.length, "product")}
      </p>
      <ProductGrid products={products} priorityCount={4} />
    </div>
  );
}
