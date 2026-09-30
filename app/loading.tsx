export default function Loading() {
  return (
    <div className="container-eo py-24" aria-hidden="true">
      <div className="mx-auto flex max-w-sm flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-parchment-400 border-t-brass-400 dark:border-ink-100 dark:border-t-brass-400" />
      </div>
    </div>
  );
}
