import Image from "next/image";
import Link from "next/link";
import type { Category } from "@/lib/types";

export function CategoryTiles({ categories }: { categories: Category[] }) {
  return (
    <section aria-labelledby="shop-by-category" className="container-eo py-16 lg:py-24">
      <h2 id="shop-by-category" className="mb-8 font-display text-2xl lg:text-3xl">
        Shop by category
      </h2>
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4 lg:gap-4">
        {categories.map((category, i) => (
          <Link
            key={category.slug}
            href={`/categories/${category.slug}`}
            className="group relative aspect-[3/4] overflow-hidden rounded-sm"
          >
            <Image
              src={category.heroImage.url}
              alt=""
              fill
              sizes="(min-width: 1024px) 24vw, 46vw"
              priority={i < 2}
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-ink-500/70 via-ink-500/5 to-transparent" />
            <span className="absolute bottom-4 left-4 font-display text-lg text-parchment-50 lg:text-xl">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
