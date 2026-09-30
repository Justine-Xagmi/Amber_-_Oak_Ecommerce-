import Link from "next/link";
import { breadcrumbJsonLd, jsonLdScriptProps } from "@/lib/seo/structured-data";

export interface Crumb {
  name: string;
  url: string;
}

export function Breadcrumbs({ items }: { items: Crumb[] }) {
  const allItems: Crumb[] = [{ name: "Home", url: "/" }, ...items];

  return (
    <nav aria-label="Breadcrumb" className="mb-6">
      <script {...jsonLdScriptProps(breadcrumbJsonLd(allItems))} />
      <ol className="flex flex-wrap items-center gap-1.5 text-xs text-ink-100 dark:text-parchment-300">
        {allItems.map((item, i) => {
          const isLast = i === allItems.length - 1;
          return (
            <li key={item.url} className="flex items-center gap-1.5">
              {i > 0 && <span aria-hidden="true">/</span>}
              {isLast ? (
                <span aria-current="page" className="text-ink-400 dark:text-parchment-100">
                  {item.name}
                </span>
              ) : (
                <Link href={item.url} className="hover:text-brass-500">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
