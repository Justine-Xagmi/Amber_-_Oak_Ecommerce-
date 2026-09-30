import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-eo flex flex-col items-center justify-center gap-4 py-28 text-center">
      <p className="font-display text-7xl text-brass-400">404</p>
      <h1 className="font-display text-2xl">This page burned out</h1>
      <p className="max-w-[42ch] text-ink-100 dark:text-parchment-300">
        The page you&apos;re looking for doesn&apos;t exist, or the product may have been
        discontinued.
      </p>
      <div className="mt-4 flex gap-3">
        <Link href="/" className="btn-primary">
          Back home
        </Link>
        <Link href="/products" className="btn-secondary">
          Browse products
        </Link>
      </div>
    </div>
  );
}
