interface SearchFormProps {
  defaultValue?: string;
  className?: string;
  autoFocus?: boolean;
}

export function SearchForm({ defaultValue, className, autoFocus }: SearchFormProps) {
  return (
    <form action="/search" method="GET" role="search" className={className}>
      <label htmlFor="site-search" className="sr-only">
        Search products
      </label>
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          width="16"
          height="16"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-100 dark:text-parchment-300"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path strokeLinecap="round" d="M21 21l-4.3-4.3" />
        </svg>
        <input
          id="site-search"
          type="search"
          name="q"
          defaultValue={defaultValue}
          placeholder="Search scents, notes, products…"
          autoFocus={autoFocus}
          className="field-input pl-10"
        />
      </div>
    </form>
  );
}
