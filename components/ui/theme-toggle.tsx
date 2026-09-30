"use client";

import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { cn } from "@/lib/utils/cn";

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Avoid rendering theme-dependent icon state until after mount, so the
  // server-rendered markup (which can't know the client's theme) never
  // mismatches — the button itself is always present, just inert briefly.
  useEffect(() => setMounted(true), []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex h-10 w-10 items-center justify-center rounded-full text-ink-400 transition-colors hover:bg-ink-500/5 dark:text-parchment-100 dark:hover:bg-parchment-100/10"
      aria-label={mounted ? `Switch to ${isDark ? "light" : "dark"} mode` : "Toggle color theme"}
    >
      <svg
        viewBox="0 0 24 24"
        width="19"
        height="19"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        aria-hidden="true"
        className={cn("transition-transform duration-300", isDark && "rotate-180")}
      >
        {isDark ? (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1.5M12 19.5V21M4.6 4.6l1.1 1.1M18.3 18.3l1.1 1.1M3 12h1.5M19.5 12H21M4.6 19.4l1.1-1.1M18.3 5.7l1.1-1.1M12 7.5a4.5 4.5 0 100 9 4.5 4.5 0 000-9z"
          />
        ) : (
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20.5 14.5a8.5 8.5 0 11-9-11.9 7 7 0 009 11.9z"
          />
        )}
      </svg>
    </button>
  );
}
