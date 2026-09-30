import Link from "next/link";
import { getAllCategories } from "@/lib/data";
import { SearchForm } from "@/components/layout/search-form";
import { MobileNav } from "@/components/layout/mobile-nav";
import { WishlistLink } from "@/components/layout/wishlist-link";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import { CartButton } from "@/components/cart/cart-button";

export async function Header() {
  const categories = await getAllCategories();

  return (
    <header className="sticky top-0 z-40 border-b border-parchment-300 bg-parchment-50/90 backdrop-blur-sm dark:border-ink-100 dark:bg-ink-400/90">
      <div className="container-eo flex h-16 items-center justify-between gap-4 lg:h-20">
        <div className="flex items-center gap-3">
          <MobileNav categories={categories} />
          <Link href="/" className="font-display text-xl tracking-tight lg:text-2xl">
            Ember <span className="text-brass-500">&amp;</span> Oak
          </Link>
        </div>

        <nav aria-label="Primary" className="hidden items-center gap-7 md:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="text-sm text-ink-400 transition-colors hover:text-brass-500 dark:text-parchment-100"
            >
              {c.name}
            </Link>
          ))}
          <Link
            href="/products"
            className="text-sm text-ink-400 transition-colors hover:text-brass-500 dark:text-parchment-100"
          >
            All Products
          </Link>
        </nav>

        <div className="flex items-center gap-1">
          <div className="mr-1 hidden w-52 lg:block">
            <SearchForm />
          </div>
          <ThemeToggle />
          <WishlistLink />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
