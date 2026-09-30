"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useCallback, useTransition } from "react";
import type { Category } from "@/lib/types";
import { cn } from "@/lib/utils/cn";

interface ScentOption {
  id: string;
  label: string;
  swatch?: string;
}

export function FiltersPanel({
  categories,
  scentOptions,
  activeCategory,
}: {
  categories: Category[];
  scentOptions: ScentOption[];
  activeCategory?: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const selectedScents = new Set(searchParams.getAll("scent"));

  const pushParams = useCallback(
    (mutate: (params: URLSearchParams) => void) => {
      const params = new URLSearchParams(searchParams.toString());
      mutate(params);
      params.delete("page");
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`, { scroll: false });
      });
    },
    [pathname, router, searchParams]
  );

  function toggleScent(scentId: string) {
    pushParams((params) => {
      const current = new Set(params.getAll("scent"));
      if (current.has(scentId)) current.delete(scentId);
      else current.add(scentId);
      params.delete("scent");
      current.forEach((s) => params.append("scent", s));
    });
  }

  function setCategory(categorySlug: string | null) {
    pushParams((params) => {
      if (categorySlug) params.set("category", categorySlug);
      else params.delete("category");
    });
  }

  function clearAll() {
    startTransition(() => {
      router.push(pathname, { scroll: false });
    });
  }

  const hasActiveFilters = selectedScents.size > 0 || Boolean(activeCategory);

  return (
    <div className={cn("transition-opacity", isPending && "opacity-60")}>
      <div className="mb-8">
        <h2 className="field-label">Category</h2>
        <ul className="space-y-2">
          <li>
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={cn(
                "text-sm",
                !activeCategory ? "font-semibold text-brass-500" : "text-ink-400 hover:text-brass-500 dark:text-parchment-100"
              )}
            >
              All products
            </button>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <button
                type="button"
                onClick={() => setCategory(c.slug)}
                className={cn(
                  "text-sm",
                  activeCategory === c.slug
                    ? "font-semibold text-brass-500"
                    : "text-ink-400 hover:text-brass-500 dark:text-parchment-100"
                )}
              >
                {c.name}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-8">
        <h2 className="field-label">Scent</h2>
        <ul className="space-y-2.5">
          {scentOptions.map((option) => (
            <li key={option.id}>
              <label className="flex cursor-pointer items-center gap-2.5 text-sm">
                <input
                  type="checkbox"
                  checked={selectedScents.has(option.id)}
                  onChange={() => toggleScent(option.id)}
                  className="h-4 w-4 rounded-sm border-parchment-400 text-brass-400 focus-visible:ring-2 focus-visible:ring-brass-400 dark:border-ink-100"
                />
                {option.swatch && (
                  <span
                    className="h-3 w-3 shrink-0 rounded-full"
                    style={{ backgroundColor: option.swatch }}
                    aria-hidden="true"
                  />
                )}
                <span className="text-ink-400 dark:text-parchment-100">{option.label}</span>
              </label>
            </li>
          ))}
        </ul>
      </div>

      {hasActiveFilters && (
        <button type="button" onClick={clearAll} className="text-xs underline underline-offset-2 text-ink-100 hover:text-danger dark:text-parchment-300">
          Clear all filters
        </button>
      )}
    </div>
  );
}
