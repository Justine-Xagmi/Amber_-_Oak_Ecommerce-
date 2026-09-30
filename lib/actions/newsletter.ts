"use server";

import { z } from "zod";

export interface NewsletterFormState {
  status: "idle" | "error" | "success";
  message?: string;
}

const schema = z.object({
  email: z.string().trim().email("Enter a valid email address."),
});

export async function subscribeToNewsletter(
  _prevState: NewsletterFormState,
  formData: FormData
): Promise<NewsletterFormState> {
  const result = schema.safeParse({ email: formData.get("email") });

  if (!result.success) {
    return { status: "error", message: result.error.issues[0]?.message ?? "Invalid email." };
  }

  // In production this would call an email provider's API (Resend,
  // Klaviyo, Mailchimp...). Simulated here with a small artificial delay
  // so the pending state in the UI is visible and testable.
  await new Promise((resolve) => setTimeout(resolve, 400));

  return { status: "success", message: `You're on the list — welcome, ${result.data.email}.` };
}
