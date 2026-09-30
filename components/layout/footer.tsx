import Link from "next/link";
import { getAllCategories } from "@/lib/data";
import { NewsletterForm } from "@/components/layout/newsletter-form";

export async function Footer() {
  const categories = await getAllCategories();

  return (
    <footer className="mt-24 border-t border-ink-100 bg-ink-400 text-parchment-100">
      <div className="container-eo grid gap-12 py-16 lg:grid-cols-[1.3fr_1fr_1fr_1.2fr]">
        <div>
          <p className="font-display text-2xl">Ember &amp; Oak</p>
          <p className="mt-3 max-w-[38ch] text-sm text-parchment-300">
            Hand-poured coconut-soy candles and reed diffusers, made in small batches in Vermont
            since 2019.
          </p>
        </div>

        <nav aria-label="Shop">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-parchment-300">Shop</h2>
          <ul className="space-y-2.5 text-sm">
            {categories.map((c) => (
              <li key={c.slug}>
                <Link href={`/categories/${c.slug}`} className="hover:text-brass-300">
                  {c.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/products" className="hover:text-brass-300">
                All Products
              </Link>
            </li>
          </ul>
        </nav>

        <nav aria-label="Help">
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-parchment-300">Help</h2>
          <ul className="space-y-2.5 text-sm">
            <li>
              <Link href="/cart" className="hover:text-brass-300">
                Cart
              </Link>
            </li>
            <li>
              <Link href="/wishlist" className="hover:text-brass-300">
                Wishlist
              </Link>
            </li>
            <li>
              <Link href="/search" className="hover:text-brass-300">
                Search
              </Link>
            </li>
          </ul>
        </nav>

        <div>
          <h2 className="mb-3 text-xs font-medium uppercase tracking-wide text-parchment-300">
            Stay in scent
          </h2>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-ink-100">
        <div className="container-eo flex flex-col gap-2 py-6 text-xs text-parchment-300 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Ember &amp; Oak. All rights reserved.</p>
          <p>Built with Next.js — a portfolio demo, not a real store.</p>
        </div>
      </div>
    </footer>
  );
}
