import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "You're Offline",
  robots: { index: false, follow: false },
};

export default function OfflinePage() {
  return (
    <div className="container-eo flex flex-col items-center justify-center gap-4 py-28 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-ink-500/10 text-ink-400 dark:bg-parchment-100/10 dark:text-parchment-100">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18M8.5 8.5a10 10 0 0112.4 1.6M5.1 12A10 10 0 016.8 9.8M12 20h.01M9 16.2a5 5 0 016 0" />
        </svg>
      </div>
      <h1 className="font-display text-2xl">You&apos;re offline</h1>
      <p className="max-w-[42ch] text-ink-100 dark:text-parchment-300">
        This page hasn&apos;t been cached for offline viewing. Reconnect and try again — pages
        you&apos;ve already visited may still be available from your browser&apos;s cache.
      </p>
      <Link href="/" className="btn-primary mt-2">
        Try the homepage
      </Link>
    </div>
  );
}
