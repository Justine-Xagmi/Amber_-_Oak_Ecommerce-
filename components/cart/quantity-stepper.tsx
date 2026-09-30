"use client";

import { cn } from "@/lib/utils/cn";

interface QuantityStepperProps {
  quantity: number;
  max?: number;
  min?: number;
  size?: "sm" | "md";
  onChange: (quantity: number) => void;
}

export function QuantityStepper({ quantity, max = 20, min = 1, size = "md", onChange }: QuantityStepperProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-sm border border-parchment-400 dark:border-ink-100",
        size === "sm" ? "h-8" : "h-10"
      )}
    >
      <button
        type="button"
        onClick={() => onChange(Math.max(min - 1, quantity - 1))}
        disabled={quantity <= min}
        className={cn(
          "flex h-full items-center justify-center text-ink-400 disabled:opacity-30 dark:text-parchment-100",
          size === "sm" ? "w-7 text-sm" : "w-9"
        )}
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span
        className={cn(
          "flex h-full items-center justify-center tabular-nums",
          size === "sm" ? "w-7 text-xs" : "w-9 text-sm"
        )}
        aria-live="polite"
        aria-atomic="true"
      >
        {quantity}
      </span>
      <button
        type="button"
        onClick={() => onChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className={cn(
          "flex h-full items-center justify-center text-ink-400 disabled:opacity-30 dark:text-parchment-100",
          size === "sm" ? "w-7 text-sm" : "w-9"
        )}
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}
