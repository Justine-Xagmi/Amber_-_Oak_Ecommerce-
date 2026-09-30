# Ember & Oak

A portfolio-grade e-commerce storefront for a fictional small-batch candle and
reed-diffuser brand, built with the Next.js App Router, TypeScript, and React
Server Components. This is a demo project — no real payments are processed —
but every flow (browse, filter, search, cart, wishlist, checkout, order
confirmation) is fully implemented end to end.

**Live demo:** deploy your own with the instructions below (Vercel recommended).

---

## Why this project exists

Most storefront templates either fake their data layer or bolt commerce
features onto a CRA-style client-rendered app. This project is built the way
a production Next.js Commerce-style storefront actually should be:

- **Server Components by default.** Nothing is a Client Component unless it
  genuinely needs interactivity (state, event handlers, browser APIs).
- **A real (if in-memory) data layer**, isolated behind `server-only` async
  functions, so swapping in Shopify/Medusa/a custom API later touches one
  file (`lib/data/index.ts`), not every page.
- **Server Actions** for checkout and newsletter signup, with server-side
  re-validation of price and stock — the client is never trusted for either.
- **Streaming and Suspense** on every route that fetches data, with skeleton
  fallbacks that match the final layout (no layout shift on resolve).
- **A cart/wishlist that persists** across reloads via `localStorage`,
  implemented with hydration-safe patterns that never mismatch server HTML.

---

## Tech stack

| Concern | Choice |
|---|---|
| Framework | Next.js 15 (App Router), React 19 |
| Language | TypeScript (strict mode) |
| Styling | Tailwind CSS, custom design tokens |
| Fonts | `next/font` (Fraunces + Manrope, self-hosted, variable) |
| State | React Context + `useReducer` (cart), Context (wishlist, recently viewed) |
| Validation | Zod (server-side, in Server Actions) |
| Testing | Vitest (unit), Playwright (e2e) |
| Performance | Lighthouse CI, custom Web Vitals reporting |

No database, auth, or payment provider is wired up — the product catalog is
static, in-memory data (see `lib/data/products.ts`), and checkout is
simulated. Every seam where a real backend would plug in is isolated and
commented (see **Architecture** below).

---

## Getting started

### Prerequisites

- Node.js 18.18 or later
- npm (or pnpm/yarn — adjust commands accordingly)

### Install and run

```bash
npm install
cp .env.example .env.local
npm run dev
```

Visit `http://localhost:3000`.

### Environment variables

Copy `.env.example` to `.env.local` and adjust as needed. All variables are
optional for local development — sensible defaults are used. See the comments
in `.env.example` for what each one controls (site URL for canonical/OG tags,
store name, analytics domain, Web Vitals reporting toggle, and placeholders
for wiring up a real payment provider).

### Build for production

```bash
npm run build
npm run start
```

---

## Project structure

```
app/                        # App Router routes
  layout.tsx                 # Root layout: fonts, metadata, providers, header/footer
  page.tsx                   # Homepage
  globals.css                 # Tailwind layers + design tokens
  sitemap.ts / robots.ts      # Generated SEO files
  not-found.tsx / error.tsx   # Route-level fallback states
  global-error.tsx            # Root layout error boundary
  offline/                    # Offline fallback page (used by the service worker)
  products/
    page.tsx                  # Listing with filter/sort via URL search params
    [slug]/page.tsx            # Product detail page (static params + ISR)
  categories/[category]/       # Category landing pages
  search/                      # Search results
  cart/, wishlist/              # Client-state pages
  checkout/
    page.tsx                    # Checkout form (Server Action)
    confirmation/[orderId]/      # Order confirmation (reads a signed cookie)
  api/web-vitals/route.ts       # Privacy-conscious Web Vitals sink

components/
  layout/                      # Header, footer, mobile nav, search form
  product/                     # Card, grid, gallery, variant/purchase panel, filters
  cart/                        # Cart drawer, cart page, quantity stepper
  checkout/                    # Checkout form
  home/                        # Hero, category tiles, story band, product rails
  ui/                          # Generic primitives (empty state, skip link, theme toggle)
  analytics/                   # Web Vitals reporter, service worker registration

lib/
  data/
    products.ts, categories.ts  # The product catalog (edit this to reskin the store)
    catalog.ts                   # Client-safe synchronous lookups
    index.ts                     # `server-only` async façade (simulated backend)
  context/                      # Cart / wishlist / recently-viewed providers
  actions/                      # Server Actions (checkout, newsletter)
  seo/                          # Metadata config + JSON-LD builders
  types/                        # Shared domain types
  utils/                        # Formatting helpers

tests/
  unit/                         # Vitest
  e2e/                           # Playwright
```

---

## Architecture & performance decisions

Each decision below exists to protect Core Web Vitals (LCP, INP, CLS) and
keep the client JS bundle small. This is the section to read if you want to
understand *why* the code is organized the way it is.

### 1. Server Components by default

Every page and most components are Server Components. They fetch data on the
server, render to HTML, and ship **zero JavaScript** unless a descendant is a
Client Component. Client Components are used only where the App Router
requires them:

- Anything with local state or event handlers (cart, wishlist, variant
  selection, filters, theme toggle, forms).
- Anything reading a browser API (`localStorage`, `navigator.onLine`).

This keeps the JS payload on content-heavy pages (home, listing, PDP) close
to the minimum: the interactive "islands" (add-to-cart, filters, cart
drawer) hydrate independently, while the product copy, images, and structure
around them stay static HTML.

### 2. Data layer isolation (`lib/data`)

`lib/data/catalog.ts` holds plain, synchronous lookups over the in-memory
catalog — safe to import from both Server and Client Components (product
data isn't sensitive). `lib/data/index.ts` wraps those in `async` functions
behind an explicit `"server-only"` import, modeling the boundary a real
backend call would sit behind. Every page already `await`s these as if they
were network requests and wraps the awaiting component in `<Suspense>`, so
swapping the in-memory arrays for `fetch()` calls to a real commerce API is a
one-file change with no ripple effect on routing or UI.

### 3. Streaming with Suspense

Homepage rails, related products, and listing results are each wrapped in
their own `<Suspense>` boundary with a skeleton fallback sized to match the
resolved content (`ProductGridSkeleton`). The shell (header, hero, nav)
paints immediately; slower sections stream in without blocking first paint —
directly improving LCP and perceived load time, and avoiding CLS because the
skeletons reserve the same box size as the real content.

### 4. Images

- `next/image` everywhere, with explicit `sizes` tuned per breakpoint so the
  browser never downloads a larger image than the rendered box.
- `next.config.mjs` requests AVIF first, WebP fallback, and a `deviceSizes`
  array matched to the grid's actual breakpoints instead of the defaults.
- The hero and above-the-fold product cards set `priority`; everything else
  lazy-loads.
- The product gallery keeps a fixed `aspect-[4/5]` box before the image
  loads, so there's no layout shift as it resolves.

### 5. Fonts

`next/font/google` self-hosts Fraunces and Manrope as subset, variable
fonts with `display: swap`. There's no runtime request to Google Fonts, no
render-blocking `@font-face`, and only the Latin subset and weights actually
used ship to the client.

### 6. Cart, wishlist, and recently-viewed

These are Client Contexts backed by `localStorage`. On mount, the server
always renders an *empty* cart/wishlist — there's nothing to reconcile, so
there's no hydration mismatch. Immediately after mount, a `useEffect` reads
`localStorage` and updates state; the UI upgrades in place instead of
flashing incorrect content. This trade-off (a guest, client-persisted cart
rather than a cookie-based server cart) keeps the checkout path simple for a
demo; seeing `lib/actions/checkout.ts`'s server-side stock/price
re-validation shows where a real implementation would harden this further.

### 7. Server Actions

`submitOrder` and `subscribeToNewsletter` are Server Actions, wired to forms
via `useActionState` for progressive enhancement (they work with JS loading,
show pending state once it's ready, and return field-level validation
errors from a single Zod schema). `submitOrder` never trusts client-supplied
prices — it re-resolves every cart line against the catalog server-side
before computing totals, and writes the resulting order to a short-lived,
httpOnly cookie so the confirmation page works correctly even on serverless
deployments where in-memory state wouldn't survive between requests.

### 8. Minimal client JavaScript

- The header search form is a plain `<form method="GET">` — it works with
  JavaScript disabled and needs no client component.
- Product detail "Description / Scent notes / Details / Shipping" sections
  use native `<details>`/`<summary>` — an accessible, zero-JS accordion.
- The cart and mobile-nav drawers use the native `<dialog>` element for
  built-in focus-trapping, `Esc`-to-close, and backdrop handling instead of
  a hand-rolled modal + a modal library.

### 9. Caching & revalidation

Product and category pages use `generateStaticParams` with
`export const revalidate = 3600`, so they're statically generated at build
time and revalidated hourly (ISR) — fast TTFB for a page that rarely
changes, without a manual rebuild for every catalog edit.

---

## SEO

- Per-page `generateMetadata` with title templates, canonical URLs, Open
  Graph and Twitter Card data (`app/products/[slug]/page.tsx`,
  `app/categories/[category]/page.tsx`).
- JSON-LD structured data: `Product` + `AggregateOffer` + `AggregateRating`
  on product pages, `BreadcrumbList` on every page with breadcrumbs,
  `Organization` and `WebSite` (with a `SearchAction`) sitewide
  (`lib/seo/structured-data.ts`).
- `app/sitemap.ts` generates a sitemap covering every static, category, and
  product route from the live catalog — no manually maintained XML file.
- `app/robots.ts` allows crawling of shoppable pages and disallows
  `/cart`, `/checkout`, `/wishlist`, and `/api/*`.
- All product content (name, price, description, images, availability) is
  rendered server-side — a crawler sees the same HTML a browser does, no
  client-side fetch required.

---

## Accessibility

- Semantic landmarks (`header`, `nav`, `main`, `footer`), a visible
  **skip-to-content** link, and heading levels that follow document order.
- Every interactive icon-only control has an `aria-label`; live regions
  (`aria-live="polite"`) announce cart/quantity changes and form status.
- Focus is never trapped incorrectly: the cart and mobile-nav drawers use
  native `<dialog>`, which handles focus trapping and `Esc` correctly out of
  the box; a custom, high-contrast `:focus-visible` ring is defined globally
  and never suppressed.
- Color choices target WCAG AA contrast in both themes; dark mode is a first
  class, `prefers-color-scheme`-aware theme (via `next-themes`), not an
  afterthought filter.
- `prefers-reduced-motion: reduce` disables/shortens all transitions and
  animations.
- Forms use associated `<label>`s, `aria-invalid`, and `aria-describedby` to
  connect inputs to their validation errors.

---

## Loading, empty, error, and offline states

- **Loading:** every route with data fetching has a matching `loading.tsx`
  skeleton (product grid, product detail, homepage) sized to prevent layout
  shift on resolve.
- **Empty:** a shared `<EmptyState>` component covers an empty cart, empty
  wishlist, no search results, and no filter matches — each with a specific
  message and a relevant call to action, not a generic "nothing here."
- **Error:** `app/error.tsx` catches route-level errors with a retry button;
  `app/global-error.tsx` catches errors in the root layout itself.
- **Not found:** `app/not-found.tsx` for unknown routes and unknown product
  slugs (`notFound()` is called explicitly when a slug doesn't resolve).
- **Offline:** a minimal service worker (`public/sw.js`) intercepts failed
  navigation requests only — it does not cache pages, APIs, or assets, so it
  can never serve stale content; it precaches exactly one page
  (`/offline`) as a fallback. A `<OfflineBanner>` also listens for the
  browser's `online`/`offline` events and shows a persistent, non-blocking
  banner while the connection is down.

---

## Analytics & Web Vitals (privacy-conscious)

`components/analytics/web-vitals-reporter.tsx` uses `useReportWebVitals`
from `next/web-vitals` to capture LCP, INP, CLS, FCP, and TTFB for every
navigation, then sends them via `navigator.sendBeacon` to
`app/api/web-vitals/route.ts`. No third-party script, no cookies, no PII —
just a metric name, value, rating, and the page path. It's disabled by
default; set `NEXT_PUBLIC_ENABLE_WEB_VITALS=true` to turn it on, and replace
the `console.log` in the route handler with a write to whatever metrics
store you use in production.

An optional, privacy-friendly third-party analytics script (styled after
Plausible — no cookies, no cross-site tracking) can be enabled by setting
`NEXT_PUBLIC_ANALYTICS_DOMAIN`; it's omitted entirely from the page when
unset, so a fresh clone of this repo loads zero third-party scripts.

---

## Testing

### Unit tests (Vitest)

```bash
npm run test        # run once
npm run test:watch  # watch mode
```

Covers pricing/formatting utilities and catalog lookup logic
(`tests/unit/`).

### End-to-end tests (Playwright)

```bash
npx playwright install   # first time only, installs browser binaries
npm run test:e2e
```

The Playwright config (`playwright.config.ts`) builds and starts the app
automatically. The suite (`tests/e2e/storefront.spec.ts`) covers: homepage
render, browsing to a product, adding to cart (and the cart drawer updating
live), checkout validation, search results, and the 404 page — run against
both a desktop and a mobile viewport project.

### Type checking & linting

```bash
npm run typecheck
npm run lint
```

---

## Performance testing (Lighthouse)

### One-off local run

```bash
npm run lh
```

This builds the app, starts it on port 4000, runs Lighthouse against it
headlessly, and opens an HTML report (`lighthouse-report.html`).

### Lighthouse CI (budgets/regressions)

```bash
npm run lh:ci
```

Uses `lighthouserc.js`, which runs Lighthouse three times each against the
homepage, listing page, and a product page, and **fails the run** if:

- Performance score drops below 0.90
- Accessibility score drops below 0.95
- Best Practices score drops below 0.90
- SEO score drops below 0.95
- LCP exceeds 2.5s, CLS exceeds 0.1, or Total Blocking Time exceeds 200ms

Wire this into CI (see below) to catch performance regressions in PRs before
they merge.

### Suggested CI workflow

```yaml
# .github/workflows/ci.yml
name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run typecheck
      - run: npm run lint
      - run: npm run test
      - run: npx playwright install --with-deps
      - run: npm run test:e2e
      - run: npm run lh:ci
```

---

## Deployment

### Vercel (recommended)

1. Push this repository to GitHub/GitLab/Bitbucket.
2. Import the repo at [vercel.com/new](https://vercel.com/new).
3. Set the environment variables from `.env.example` in the Vercel project
   settings (at minimum, `NEXT_PUBLIC_SITE_URL` to your production domain).
4. Deploy. Vercel auto-detects Next.js — no build configuration needed.

Product/category pages are statically generated at build time and
revalidate hourly (ISR), so most requests are served from Vercel's edge
cache with no server render at all.

### Other platforms

The app has no dependency on Vercel-specific APIs beyond the standard
Next.js build output, so it also runs on any Node.js host or platform that
supports the Next.js `build`/`start` lifecycle (Netlify, Render, a
self-hosted Node server, Docker). The one platform-specific note: the order
confirmation flow relies on cookies rather than in-memory storage
specifically so it survives serverless/edge deployments with no shared
memory between invocations.

---

## Extending this project

- **Real backend:** replace the contents of `lib/data/products.ts` /
  `categories.ts` with API calls in `lib/data/catalog.ts`, keep the
  `server-only` façade in `lib/data/index.ts` as-is.
- **Real payments:** `lib/actions/checkout.ts` is the single integration
  point — swap the simulated order-creation block for a Stripe/Braintree/etc
  call before writing the confirmation cookie. `.env.example` includes
  placeholder Stripe variables to get started.
- **Real persistence:** swap the cookie-based order lookup
  (`getOrderFromCookie`) for a database read once orders are written to a
  real store.
- **Real cart:** the current guest, localStorage-backed cart is intentionally
  simple for a demo. A production build would likely move to a server-owned
  cart (cookie-referenced cart ID, server actions for mutations) to support
  logged-in users across devices.

---

## License

This is a portfolio/demo project. Feel free to fork, strip the branding, and
use it as a starting point for your own work.
