import Link from "next/link";

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-parchment-400 px-6 py-20 text-center dark:border-ink-100">
      <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="1.3" className="text-ink-100 dark:text-parchment-300" aria-hidden="true">
        <circle cx="11" cy="11" r="7" />
        <path strokeLinecap="round" d="M21 21l-4.3-4.3M8 11h6" />
      </svg>
      <p className="font-display text-lg text-ink-400 dark:text-parchment-100">{title}</p>
      <p className="max-w-[42ch] text-sm text-ink-100 dark:text-parchment-300">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-secondary mt-2">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
