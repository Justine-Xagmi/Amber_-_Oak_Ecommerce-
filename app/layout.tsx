import type { Metadata, Viewport } from "next";
import { Fraunces, Manrope } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { Providers } from "@/lib/context/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { CartDrawer } from "@/components/cart/cart-drawer";
import { OfflineBanner } from "@/components/layout/offline-banner";
import { SkipLink } from "@/components/ui/skip-link";
import { WebVitalsReporter } from "@/components/analytics/web-vitals-reporter";
import { ServiceWorkerRegister } from "@/components/analytics/service-worker-register";
import { siteConfig } from "@/lib/seo/site-config";
import { jsonLdScriptProps, organizationJsonLd, websiteJsonLd } from "@/lib/seo/structured-data";

// Self-hosted, subset, variable fonts via next/font: zero layout shift from
// a render-blocking @font-face swap, no request to Google at runtime, and
// only the weights we actually use are shipped.
const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
  axes: ["opsz", "SOFT", "WONK"],
});

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: `${siteConfig.name} — Hand-Poured Candles & Reed Diffusers`,
    template: `%s — ${siteConfig.name}`,
  },
  description: siteConfig.description,
  keywords: siteConfig.keywords,
  authors: [{ name: siteConfig.name }],
  openGraph: {
    type: "website",
    siteName: siteConfig.name,
    title: `${siteConfig.name} — Hand-Poured Candles & Reed Diffusers`,
    description: siteConfig.description,
    url: siteConfig.url,
    images: [{ url: siteConfig.ogImage, width: 1200, height: 630, alt: siteConfig.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${siteConfig.name} — Hand-Poured Candles & Reed Diffusers`,
    description: siteConfig.description,
    images: [siteConfig.ogImage],
  },
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#EFEAE0" },
    { media: "(prefers-color-scheme: dark)", color: "#171F1B" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${manrope.variable}`} suppressHydrationWarning>
      <body className="flex min-h-screen flex-col">
        <script {...jsonLdScriptProps(organizationJsonLd())} />
        <script {...jsonLdScriptProps(websiteJsonLd())} />
        <Providers>
          <SkipLink />
          <OfflineBanner />
          <Header />
          <main id="main-content" className="flex-1">
            {children}
          </main>
          <Footer />
          <CartDrawer />
        </Providers>
        <WebVitalsReporter />
        <ServiceWorkerRegister />
        {process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN && (
          <Script
            defer
            data-domain={process.env.NEXT_PUBLIC_ANALYTICS_DOMAIN}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
