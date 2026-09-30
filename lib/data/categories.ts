import type { Category } from "@/lib/types";

export const categories: Category[] = [
  {
    slug: "candles",
    name: "Candles",
    description:
      "Hand-poured in small batches using coconut-soy wax and cotton wicks, each candle burns clean and true to its scent from first light to last.",
    heroImage: {
      url: "https://picsum.photos/seed/eo-cat-candles/1600/900",
      alt: "A lit Ember & Oak candle on a stone tray beside dried botanicals",
      width: 1600,
      height: 900,
    },
  },
  {
    slug: "diffusers",
    name: "Reed Diffusers",
    description:
      "A quieter way to scent a room. Our reed diffusers use a slow-release oil blend that holds its character for up to twelve weeks without an open flame.",
    heroImage: {
      url: "https://picsum.photos/seed/eo-cat-diffusers/1600/900",
      alt: "Reed diffuser bottles arranged on a wooden console",
      width: 1600,
      height: 900,
    },
  },
  {
    slug: "sets",
    name: "Sets & Gifting",
    description:
      "Considered pairings and gift-ready sets, boxed in recycled kraft with a wax seal — built for giving, and just as good to keep.",
    heroImage: {
      url: "https://picsum.photos/seed/eo-cat-sets/1600/900",
      alt: "A boxed gift set of two candles wrapped in kraft paper",
      width: 1600,
      height: 900,
    },
  },
  {
    slug: "accessories",
    name: "Accessories",
    description:
      "The small tools that make a ritual of it: trimmers, snuffers, trays and matches, made from brushed brass and FSC-certified beech.",
    heroImage: {
      url: "https://picsum.photos/seed/eo-cat-accessories/1600/900",
      alt: "A brass wick trimmer resting on a beechwood tray",
      width: 1600,
      height: 900,
    },
  },
];

export function getCategoryBySlug(slug: string): Category | undefined {
  return categories.find((c) => c.slug === slug);
}
