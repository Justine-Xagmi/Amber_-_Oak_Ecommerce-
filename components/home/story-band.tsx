import Image from "next/image";

export function StoryBand() {
  return (
    <section className="border-y border-parchment-300 bg-parchment-200 dark:border-ink-100 dark:bg-ink-300">
      <div className="container-eo grid gap-10 py-16 lg:grid-cols-2 lg:items-center lg:gap-16 lg:py-24">
        <div className="relative aspect-[4/3] overflow-hidden rounded-sm">
          <Image
            src="https://picsum.photos/seed/eo-workshop/1200/900"
            alt="Wax being poured by hand into glass vessels in the Ember & Oak workshop"
            fill
            sizes="(min-width: 1024px) 45vw, 100vw"
            className="object-cover"
          />
        </div>
        <div>
          <p className="mb-4 text-xs font-medium uppercase tracking-wide text-brass-500">
            Since 2019
          </p>
          <h2 className="max-w-[16ch] font-display text-3xl leading-tight lg:text-4xl">
            Poured by hand, in batches of forty
          </h2>
          <p className="mt-5 max-w-prose text-ink-100 dark:text-parchment-300">
            We keep our line to eight scents on purpose. Each one is tested through a full
            season before it ships, and none of them are getting discontinued for a seasonal
            refresh. If you find one you like, we intend for it to still be here next year.
          </p>
          <p className="mt-4 max-w-prose text-ink-100 dark:text-parchment-300">
            Every candle is poured, cooled, and boxed by the same three-person team in our
            workshop outside Burlington — no contract manufacturing, no minimum order that
            forces a shortcut.
          </p>
        </div>
      </div>
    </section>
  );
}
