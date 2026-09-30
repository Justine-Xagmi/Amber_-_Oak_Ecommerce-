export const siteConfig = {
  name: process.env.NEXT_PUBLIC_STORE_NAME || "Ember & Oak",
  shortName: "Ember & Oak",
  description:
    "Hand-poured coconut-soy candles and reed diffusers, made in small batches in Vermont. A focused line of eight scents, built to be reordered for years.",
  url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
  ogImage: "https://picsum.photos/seed/eo-og-default/1200/630",
  twitterHandle: "@emberandoak",
  keywords: [
    "hand-poured candles",
    "coconut soy candles",
    "reed diffusers",
    "luxury home fragrance",
    "small batch candles",
    "Vermont candle maker",
  ],
};

export type SiteConfig = typeof siteConfig;
