"use client";

import { useRouter, useSearchParams, usePathname } from "next/navigation";

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
  { value: "rating", label: "Highest rated" },
];

export function SortDropdown() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "featured";

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm text-ink-100 dark:text-parchment-300">
        Sort
      </label>
      <select
        id="sort"
        value={current}
        onChange={(e) => {
          const params = new URLSearchParams(searchParams.toString());
          if (e.target.value === "featured") params.delete("sort");
          else params.set("sort", e.target.value);
          router.push(`${pathname}?${params.toString()}`, { scroll: false });
        }}
        className="field-input !w-auto !py-2 pr-8 text-sm"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}
