import { NewsletterForm } from "@/components/layout/newsletter-form";

export function NewsletterBand() {
  return (
    <section className="bg-ink-500 text-parchment-100">
      <div className="container-eo flex flex-col items-start gap-6 py-16 lg:flex-row lg:items-center lg:justify-between lg:py-20">
        <div>
          <h2 className="font-display text-2xl lg:text-3xl">Restocks land quietly. Don&apos;t miss one.</h2>
          <p className="mt-2 max-w-[46ch] text-parchment-300">
            One email a month — new scents, restocks, and nothing you didn&apos;t ask for.
          </p>
        </div>
        <NewsletterForm />
      </div>
    </section>
  );
}
