"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { SearchForm } from "@/components/layout/search-form";
import type { Category } from "@/lib/types";

export function MobileNav({ categories }: { categories: Category[] }) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (isOpen && !dialog.open) {
      dialog.showModal();
      document.body.style.overflow = "hidden";
    } else if (!isOpen && dialog.open) {
      dialog.close();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <>
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        className="flex h-10 w-10 items-center justify-center rounded-full text-ink-400 hover:bg-ink-500/5 md:hidden dark:text-parchment-100 dark:hover:bg-parchment-100/10"
        aria-label="Open menu"
      >
        <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="1.7">
          <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
        </svg>
      </button>

      <dialog
        ref={dialogRef}
        onClose={() => setIsOpen(false)}
        aria-label="Site menu"
        className="fixed inset-0 m-0 h-full max-h-none w-full max-w-none border-0 bg-parchment-50 p-0 text-ink-500 backdrop:bg-ink-500/40 dark:bg-ink-300 dark:text-parchment-50"
      >
        <div className="flex h-full flex-col px-6 py-5">
          <div className="mb-6 flex items-center justify-between">
            <span className="font-display text-lg">Menu</span>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-ink-500/5 dark:hover:bg-parchment-100/10"
              aria-label="Close menu"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.7">
                <path strokeLinecap="round" d="M5 5l14 14M19 5L5 19" />
              </svg>
            </button>
          </div>

          <SearchForm className="mb-8" />

          <nav aria-label="Mobile" className="flex flex-1 flex-col gap-1">
            <Link href="/products" onClick={() => setIsOpen(false)} className="border-b border-parchment-300 py-3.5 font-display text-xl dark:border-ink-100">
              All Products
            </Link>
            {categories.map((c) => (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                onClick={() => setIsOpen(false)}
                className="border-b border-parchment-300 py-3.5 font-display text-xl dark:border-ink-100"
              >
                {c.name}
              </Link>
            ))}
            <Link href="/wishlist" onClick={() => setIsOpen(false)} className="border-b border-parchment-300 py-3.5 text-sm text-ink-100 dark:border-ink-100 dark:text-parchment-300">
              Wishlist
            </Link>
          </nav>
        </div>
      </dialog>
    </>
  );
}
