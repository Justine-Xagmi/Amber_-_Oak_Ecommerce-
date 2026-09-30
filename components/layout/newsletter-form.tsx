"use client";

import { useActionState } from "react";
import { subscribeToNewsletter, type NewsletterFormState } from "@/lib/actions/newsletter";

const initialState: NewsletterFormState = { status: "idle" };

export function NewsletterForm() {
  const [state, formAction, isPending] = useActionState(subscribeToNewsletter, initialState);

  return (
    <form action={formAction} className="max-w-sm">
      <label htmlFor="newsletter-email" className="field-label !text-parchment-300">
        Email address
      </label>
      <div className="flex gap-2">
        <input
          id="newsletter-email"
          type="email"
          name="email"
          required
          placeholder="you@example.com"
          className="field-input !border-ink-100 !bg-ink-300 !text-parchment-50 placeholder:!text-parchment-300/50"
          aria-describedby="newsletter-status"
        />
        <button type="submit" disabled={isPending} className="btn-primary !bg-brass-400 !text-ink-500 hover:!bg-brass-300 shrink-0">
          {isPending ? "Joining…" : "Join"}
        </button>
      </div>
      <p
        id="newsletter-status"
        role="status"
        aria-live="polite"
        className={
          state.status === "error"
            ? "mt-2 text-xs text-danger"
            : "mt-2 text-xs text-parchment-300"
        }
      >
        {state.message ?? "One email a month. Restocks, new scents, nothing else."}
      </p>
    </form>
  );
}
