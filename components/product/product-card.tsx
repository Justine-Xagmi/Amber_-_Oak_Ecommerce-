import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/lib/types";
import { priceRangeForProduct } from "@/lib/data/catalog";
import { Price } from "@/components/product/price";
import { WishlistButton } from "@/components/product/wishlist-button";

export function ProductCard({ product, priority = false }: { product: Product; priority?: boolean }) {
  const { min, max } = priceRangeForProduct(product);
  const image = product.images[0]!;
  const secondaryImage = product.images[1];
  const anyInStock = product.variants.some((v) => v.stockStatus !== "out_of_stock");

  return (
    <div className="group relative">
      <Link href={`/products/${product.slug}`} className="block">
        <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-parchment-200 dark:bg-ink-100">
          <Image
            src={image.url}
            alt={image.alt}
            fill
            sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
            priority={priority}
            className="object-cover transition-opacity duration-500 group-hover:opacity-0"
          />
          {secondaryImage && (
            <Image
              src={secondaryImage.url}
              alt=""
              aria-hidden="true"
              fill
              sizes="(min-width: 1280px) 22vw, (min-width: 768px) 30vw, 46vw"
              className="object-cover opacity-0 transition-opacity duration-500 group-hover:opacity-100"
            />
          )}
          <div className="absolute left-3 top-3 flex flex-col gap-1.5">
            {product.isNew && (
              <span className="rounded-sm bg-ink-500 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-parchment-100 dark:bg-brass-400 dark:text-ink-500">
                New
              </span>
            )}
            {!anyInStock && (
              <span className="rounded-sm bg-parchment-50/90 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-ink-400">
                Sold out
              </span>
            )}
          </div>
          <div className="absolute right-3 top-3">
            <WishlistButton slug={product.slug} />
          </div>
        </div>

        <div className="mt-3.5">
          <h3 className="font-display text-base leading-snug text-ink-500 dark:text-parchment-50">
            {product.name}
          </h3>
          <p className="mt-0.5 line-clamp-1 text-sm text-ink-100 dark:text-parchment-300">
            {product.tagline}
          </p>
          <div className="mt-1.5 text-sm text-ink-400 dark:text-parchment-100">
            {min === max ? (
              <Price price={min} />
            ) : (
              <span>
                From <Price price={min} />
              </span>
            )}
          </div>
        </div>
      </Link>
    </div>
  );
}
