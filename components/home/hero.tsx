import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="border-b border-parchment-300 dark:border-ink-100">
      <div className="container-eo grid gap-10 py-12 lg:grid-cols-[1fr_1.1fr] lg:items-center lg:gap-6 lg:py-0">
        <div className="order-2 lg:order-1">
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-brass-500">
            Small-batch, Vermont-poured
          </p>
          <h1 className="max-w-[14ch] font-display text-[2.75rem] leading-[1.05] tracking-tightest lg:text-6xl">
            Scent, poured to last the whole room.
          </h1>
          <p className="mt-5 max-w-[42ch] text-ink-100 dark:text-parchment-300">
            Eight scents. Coconut-soy wax. Cotton wicks. Nothing else. Ember &amp; Oak candles are
            built to be reordered for years, not replaced by the next release.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/products" className="btn-primary">
              Shop all products
            </Link>
            <Link href="/categories/candles" className="btn-secondary">
              Shop candles
            </Link>
          </div>
        </div>

        <div className="relative order-1 aspect-[4/5] overflow-hidden rounded-sm lg:order-2 lg:aspect-auto lg:h-[38rem] lg:rounded-none">
          <Image
            src="https://picsum.photos/seed/eo-hero-main/1400/1750"
            alt="An Ember & Oak candle burning on a linen-topped table beside dried cedar sprigs"
            fill
            sizes="(min-width: 1024px) 55vw, 100vw"
            priority
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
