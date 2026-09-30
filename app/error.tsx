"use client";

import { useEffect } from "react";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    // In production this would report to an error-tracking service
    // (Sentry, Highlight, etc). Logged here so it's visible in dev/demo.
    console.error(error);
  }, [error]);

  return (
    <div className="container-eo flex flex-col items-center justify-center gap-4 py-28 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-danger/10 text-danger">
        <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.3 3.9L2.5 17a2 2 0 001.7 3h15.6a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" />
        </svg>
      </div>
      <h1 className="font-display text-2xl">Something went wrong</h1>
      <p className="max-w-[42ch] text-ink-100 dark:text-parchment-300">
        This page hit an unexpected error. It&apos;s been logged — try again, or head back home.
      </p>
      <div className="mt-4 flex gap-3">
        <button type="button" onClick={reset} className="btn-primary">
          Try again
        </button>
        <a href="/" className="btn-secondary">
          Back home
        </a>
      </div>
    </div>
  );
}
