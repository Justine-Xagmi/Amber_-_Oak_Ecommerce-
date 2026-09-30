export function SkipLink() {
  return (
    <a
      href="#main-content"
      className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-sm focus:bg-ink-500 focus:px-4 focus:py-3 focus:text-sm focus:font-medium focus:text-parchment-100 dark:focus:bg-brass-400 dark:focus:text-ink-500"
    >
      Skip to content
    </a>
  );
}
