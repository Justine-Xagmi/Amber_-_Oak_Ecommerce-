import type {
  Product,
  ProductImage,
  ProductVariant,
  ProductVariantAxis,
  StockStatus,
} from "@/lib/types";

function img(seed: string, alt: string, w = 1200, h = 1500): ProductImage {
  return { url: `https://picsum.photos/seed/${seed}/${w}/${h}`, alt, width: w, height: h };
}

const sizeAxis = (options: { id: string; label: string }[]): ProductVariantAxis => ({
  id: "size",
  name: "Size",
  options,
});

const scentAxisFor = (
  scents: { id: string; label: string; swatch: string }[]
): ProductVariantAxis => ({
  id: "scent",
  name: "Scent",
  options: scents,
});

function statusFromStock(stock: number): StockStatus {
  if (stock <= 0) return "out_of_stock";
  if (stock <= 6) return "low_stock";
  return "in_stock";
}

/** Builds a scent x size variant grid for a candle-style product. */
function candleVariants(
  productId: string,
  scents: { id: string; label: string; swatch: string }[],
  sizes: { id: string; label: string; price: number; weight: number }[],
  stockSeed: number
): ProductVariant[] {
  const variants: ProductVariant[] = [];
  let i = 0;
  for (const scent of scents) {
    for (const size of sizes) {
      i += 1;
      // Deterministic pseudo-stock so the catalog feels real without randomness at runtime.
      const stock = (stockSeed * 7 + i * 13) % 24;
      variants.push({
        id: `${productId}-${scent.id}-${size.id}`,
        selections: { scent: scent.id, size: size.id },
        price: size.price,
        sku: `EO-${productId.toUpperCase()}-${scent.id.slice(0, 3).toUpperCase()}-${size.id.toUpperCase()}`,
        stock,
        stockStatus: statusFromStock(stock),
        weightGrams: size.weight,
      });
    }
  }
  return variants;
}

// Shared scent palette reused across candles and diffusers for a coherent line.
const scentPalette = {
  figVetiver: { id: "fig-vetiver", label: "Fig & Vetiver", swatch: "#4C5D45" },
  smokedCedar: { id: "smoked-cedar", label: "Smoked Cedar", swatch: "#5A4433" },
  amberOud: { id: "amber-oud", label: "Amber & Oud", swatch: "#8A5A44" },
  seaSaltDriftwood: { id: "sea-salt-driftwood", label: "Sea Salt & Driftwood", swatch: "#7A8B93" },
  quinceClover: { id: "quince-clover", label: "Quince & Clover", swatch: "#B08D54" },
  blackFig: { id: "black-fig", label: "Black Fig & Cassis", swatch: "#3B2E3E" },
  tobaccoLeaf: { id: "tobacco-leaf", label: "Tobacco Leaf", swatch: "#6E4E2E" },
  wildFern: { id: "wild-fern", label: "Wild Fern", swatch: "#3F5B3B" },
};

const candleSizes = [
  { id: "6oz", label: "6 oz — 40 hr burn", price: 32, weight: 260 },
  { id: "9oz", label: "9 oz — 65 hr burn", price: 44, weight: 380 },
  { id: "14oz", label: "14 oz — 100 hr burn", price: 62, weight: 540 },
];

const diffuserSizes = [
  { id: "100ml", label: "100 ml — 6 wk", price: 38, weight: 220 },
  { id: "200ml", label: "200 ml — 12 wk", price: 56, weight: 380 },
];

export const products: Product[] = [
  {
    id: "hearth",
    slug: "hearth-candle",
    name: "Hearth",
    tagline: "Smoked cedar, dry birch, and a whisper of clove",
    description:
      "Our signature candle, poured to evoke the last hour beside a dying fire. Smoked cedar and dry birch sit over a low ember of clove and cade oil, built for long, unhurried evenings.",
    story:
      "Hearth was the first scent we ever poured, tested through three New England winters before it earned its name. It remains our most-reordered candle for a reason: it smells like a room, not a bottle.",
    categorySlug: "candles",
    collectionSlugs: ["bestsellers", "autumn-edit"],
    images: [
      img("eo-hearth-1", "Hearth candle in an amber glass vessel with a lit wick", 1200, 1500),
      img("eo-hearth-2", "Hearth candle burning with visible flame and wax pool", 1200, 1500),
      img("eo-hearth-3", "Hearth candle lid and kraft box beside dried cedar sprigs", 1200, 1500),
      img("eo-hearth-4", "Overhead view of the Hearth candle on a linen surface", 1200, 1500),
    ],
    basePrice: 32,
    variantAxes: [
      scentAxisFor([scentPalette.smokedCedar]),
      sizeAxis(candleSizes.map((s) => ({ id: s.id, label: s.label }))),
    ],
    variants: candleVariants("hearth", [scentPalette.smokedCedar], candleSizes, 3),
    attributes: [
      { label: "Wax", value: "Coconut-soy blend" },
      { label: "Wick", value: "Braided cotton, lead-free" },
      { label: "Vessel", value: "Reusable amber glass" },
      { label: "Origin", value: "Hand-poured in Vermont, USA" },
    ],
    burnTimeHours: 65,
    scentNotes: { top: ["Clove", "Black pepper"], heart: ["Smoked cedar", "Dry birch"], base: ["Cade oil", "Amber"] },
    materials: ["Coconut-soy wax", "Cotton wick", "Recycled glass"],
    reviews: { average: 4.8, count: 612 },
    isBestseller: true,
    featured: true,
    relatedSlugs: ["tobacco-leaf-candle", "amber-oud-diffuser", "wick-trimmer"],
  },
  {
    id: "fig-vetiver",
    slug: "fig-vetiver-candle",
    name: "Fig & Vetiver",
    tagline: "Green fig leaf over dry vetiver root and cedar",
    description:
      "A green, bitter fig accord layered over dry vetiver root and a base of cedar — closer to the smell of a fig tree in late summer than to fig jam.",
    story: "Developed with a perfumer in Grasse who insisted we keep the sap-green top note others asked us to soften.",
    categorySlug: "candles",
    collectionSlugs: ["bestsellers", "summer-edit"],
    images: [
      img("eo-fig-1", "Fig and Vetiver candle in matte green glass", 1200, 1500),
      img("eo-fig-2", "Fig leaves and vetiver root beside the candle", 1200, 1500),
      img("eo-fig-3", "Fig and Vetiver candle burning at dusk", 1200, 1500),
    ],
    basePrice: 32,
    variantAxes: [
      scentAxisFor([scentPalette.figVetiver]),
      sizeAxis(candleSizes.map((s) => ({ id: s.id, label: s.label }))),
    ],
    variants: candleVariants("fig", [scentPalette.figVetiver], candleSizes, 5),
    attributes: [
      { label: "Wax", value: "Coconut-soy blend" },
      { label: "Wick", value: "Braided cotton, lead-free" },
      { label: "Vessel", value: "Reusable matte glass" },
      { label: "Origin", value: "Hand-poured in Vermont, USA" },
    ],
    burnTimeHours: 65,
    scentNotes: { top: ["Green fig leaf"], heart: ["Vetiver root", "Fig milk"], base: ["Cedar", "Musk"] },
    materials: ["Coconut-soy wax", "Cotton wick", "Recycled glass"],
    reviews: { average: 4.7, count: 389 },
    isBestseller: true,
    featured: true,
    relatedSlugs: ["wild-fern-candle", "fig-vetiver-diffuser", "brass-snuffer"],
  },
  {
    id: "amber-oud",
    slug: "amber-oud-candle",
    name: "Amber & Oud",
    tagline: "Warm amber resin, dark oud, and a trace of rose",
    description:
      "Our richest pour: warm amber resin and dark, animalic oud softened by a trace of rose absolute. Best suited to bedrooms and low light.",
    story: "A slow burner in every sense — the scent opens sweet and turns resinous over its first hour.",
    categorySlug: "candles",
    collectionSlugs: ["winter-edit"],
    images: [
      img("eo-amber-1", "Amber and Oud candle in dark glass with brass lid", 1200, 1500),
      img("eo-amber-2", "Close-up of amber wax and brass lid", 1200, 1500),
      img("eo-amber-3", "Amber and Oud candle on a dark walnut shelf", 1200, 1500),
    ],
    basePrice: 32,
    compareAtPrice: 38,
    variantAxes: [
      scentAxisFor([scentPalette.amberOud]),
      sizeAxis(candleSizes.map((s) => ({ id: s.id, label: s.label }))),
    ],
    variants: candleVariants("amber", [scentPalette.amberOud], candleSizes, 1),
    attributes: [
      { label: "Wax", value: "Coconut-soy blend" },
      { label: "Wick", value: "Braided cotton, lead-free" },
      { label: "Vessel", value: "Smoked glass, brass lid" },
      { label: "Origin", value: "Hand-poured in Vermont, USA" },
    ],
    burnTimeHours: 65,
    scentNotes: { top: ["Rose absolute"], heart: ["Oud", "Labdanum"], base: ["Amber resin", "Benzoin"] },
    materials: ["Coconut-soy wax", "Cotton wick", "Smoked glass", "Brass"],
    reviews: { average: 4.9, count: 241 },
    isNew: true,
    featured: true,
    relatedSlugs: ["amber-oud-diffuser", "tobacco-leaf-candle", "gift-set-duo"],
  },
  {
    id: "sea-salt",
    slug: "sea-salt-driftwood-candle",
    name: "Sea Salt & Driftwood",
    tagline: "Ozonic salt air over bleached driftwood and ambergris",
    description:
      "The scent of a cold-water coastline: ozonic salt air, sun-bleached driftwood, and a mineral trace of ambergris underneath.",
    story: "Named for a stretch of Maine coastline where three of our team spent a formative summer.",
    categorySlug: "candles",
    collectionSlugs: ["summer-edit"],
    images: [
      img("eo-sea-1", "Sea Salt and Driftwood candle in pale blue-grey glass", 1200, 1500),
      img("eo-sea-2", "Driftwood pieces beside the candle on sand-colored linen", 1200, 1500),
    ],
    basePrice: 32,
    variantAxes: [
      scentAxisFor([scentPalette.seaSaltDriftwood]),
      sizeAxis(candleSizes.map((s) => ({ id: s.id, label: s.label }))),
    ],
    variants: candleVariants("sea", [scentPalette.seaSaltDriftwood], candleSizes, 8),
    attributes: [
      { label: "Wax", value: "Coconut-soy blend" },
      { label: "Wick", value: "Braided cotton, lead-free" },
      { label: "Vessel", value: "Reusable frosted glass" },
      { label: "Origin", value: "Hand-poured in Vermont, USA" },
    ],
    burnTimeHours: 65,
    scentNotes: { top: ["Sea salt", "Ozonic accord"], heart: ["Driftwood"], base: ["Ambergris", "Musk"] },
    materials: ["Coconut-soy wax", "Cotton wick", "Recycled glass"],
    reviews: { average: 4.6, count: 178 },
    relatedSlugs: ["fig-vetiver-candle", "wild-fern-candle", "match-box"],
  },
  {
    id: "quince-clover",
    slug: "quince-clover-candle",
    name: "Quince & Clover",
    tagline: "Ripe quince, honeyed clover, and soft beeswax",
    description:
      "A bright, orchard-fruit candle: ripe quince and honeyed clover over a soft beeswax base. Reads sweet without tipping into dessert.",
    story: "Our best-selling spring pour, restocked twice each March before the blossoms are even out.",
    categorySlug: "candles",
    collectionSlugs: ["spring-edit"],
    images: [
      img("eo-quince-1", "Quince and Clover candle in soft yellow glass", 1200, 1500),
      img("eo-quince-2", "Quince fruit and clover blossoms beside the candle", 1200, 1500),
      img("eo-quince-3", "Quince and Clover candle lit on a spring table setting", 1200, 1500),
    ],
    basePrice: 32,
    variantAxes: [
      scentAxisFor([scentPalette.quinceClover]),
      sizeAxis(candleSizes.map((s) => ({ id: s.id, label: s.label }))),
    ],
    variants: candleVariants("quince", [scentPalette.quinceClover], candleSizes, 4),
    attributes: [
      { label: "Wax", value: "Coconut-soy blend" },
      { label: "Wick", value: "Braided cotton, lead-free" },
      { label: "Vessel", value: "Reusable amber glass" },
      { label: "Origin", value: "Hand-poured in Vermont, USA" },
    ],
    burnTimeHours: 65,
    scentNotes: { top: ["Quince", "Pear"], heart: ["Clover honey"], base: ["Beeswax", "Soft musk"] },
    materials: ["Coconut-soy wax", "Cotton wick", "Recycled glass"],
    reviews: { average: 4.5, count: 132 },
    isNew: true,
    relatedSlugs: ["wild-fern-candle", "quince-clover-diffuser", "gift-set-duo"],
  },
  {
    id: "black-fig",
    slug: "black-fig-cassis-candle",
    name: "Black Fig & Cassis",
    tagline: "Dark fig, blackcurrant, and a bitter green stem",
    description:
      "A darker take on fig: blackcurrant and dark fig over a bitter green stem note, weightier than our original Fig & Vetiver.",
    story: "For customers who found our original fig candle too light — this is its evening counterpart.",
    categorySlug: "candles",
    collectionSlugs: ["autumn-edit"],
    images: [
      img("eo-blackfig-1", "Black Fig and Cassis candle in deep plum glass", 1200, 1500),
      img("eo-blackfig-2", "Black figs and blackcurrants beside the candle", 1200, 1500),
    ],
    basePrice: 32,
    variantAxes: [
      scentAxisFor([scentPalette.blackFig]),
      sizeAxis(candleSizes.map((s) => ({ id: s.id, label: s.label }))),
    ],
    variants: candleVariants("blackfig", [scentPalette.blackFig], candleSizes, 6),
    attributes: [
      { label: "Wax", value: "Coconut-soy blend" },
      { label: "Wick", value: "Braided cotton, lead-free" },
      { label: "Vessel", value: "Reusable plum glass" },
      { label: "Origin", value: "Hand-poured in Vermont, USA" },
    ],
    burnTimeHours: 65,
    scentNotes: { top: ["Blackcurrant"], heart: ["Dark fig"], base: ["Green stem", "Cedar"] },
    materials: ["Coconut-soy wax", "Cotton wick", "Recycled glass"],
    reviews: { average: 4.7, count: 94 },
    relatedSlugs: ["fig-vetiver-candle", "hearth-candle", "wick-trimmer"],
  },
  {
    id: "tobacco-leaf",
    slug: "tobacco-leaf-candle",
    name: "Tobacco Leaf",
    tagline: "Cured tobacco, dried fig, and warm vanilla husk",
    description:
      "Cured tobacco leaf and dried fig warmed by a vanilla husk base — closer to a walk-in humidor than a cigar itself.",
    story: "A study we kept coming back to; it took eleven revisions to get the tobacco note dry rather than sweet.",
    categorySlug: "candles",
    collectionSlugs: ["winter-edit", "autumn-edit"],
    images: [
      img("eo-tobacco-1", "Tobacco Leaf candle in dark brown glass", 1200, 1500),
      img("eo-tobacco-2", "Dried tobacco leaves beside the candle on wood", 1200, 1500),
      img("eo-tobacco-3", "Tobacco Leaf candle burning in a dim study", 1200, 1500),
    ],
    basePrice: 32,
    variantAxes: [
      scentAxisFor([scentPalette.tobaccoLeaf]),
      sizeAxis(candleSizes.map((s) => ({ id: s.id, label: s.label }))),
    ],
    variants: candleVariants("tobacco", [scentPalette.tobaccoLeaf], candleSizes, 2),
    attributes: [
      { label: "Wax", value: "Coconut-soy blend" },
      { label: "Wick", value: "Braided cotton, lead-free" },
      { label: "Vessel", value: "Reusable amber glass" },
      { label: "Origin", value: "Hand-poured in Vermont, USA" },
    ],
    burnTimeHours: 65,
    scentNotes: { top: ["Dried fig"], heart: ["Cured tobacco leaf"], base: ["Vanilla husk", "Tonka"] },
    materials: ["Coconut-soy wax", "Cotton wick", "Recycled glass"],
    reviews: { average: 4.8, count: 267 },
    isBestseller: true,
    relatedSlugs: ["hearth-candle", "amber-oud-candle", "brass-snuffer"],
  },
  {
    id: "wild-fern",
    slug: "wild-fern-candle",
    name: "Wild Fern",
    tagline: "Damp fern, moss, and rain-wet stone",
    description:
      "A green, mineral scent built to smell like a forest floor after rain — damp fern and moss over a note of wet stone.",
    story: "Our most divisive scent: customers either reorder it every month or never again. We wouldn't discontinue it.",
    categorySlug: "candles",
    collectionSlugs: ["spring-edit"],
    images: [
      img("eo-fern-1", "Wild Fern candle in deep green glass", 1200, 1500),
      img("eo-fern-2", "Fern fronds and moss beside the candle", 1200, 1500),
    ],
    basePrice: 32,
    variantAxes: [
      scentAxisFor([scentPalette.wildFern]),
      sizeAxis(candleSizes.map((s) => ({ id: s.id, label: s.label }))),
    ],
    variants: candleVariants("fern", [scentPalette.wildFern], candleSizes, 9),
    attributes: [
      { label: "Wax", value: "Coconut-soy blend" },
      { label: "Wick", value: "Braided cotton, lead-free" },
      { label: "Vessel", value: "Reusable green glass" },
      { label: "Origin", value: "Hand-poured in Vermont, USA" },
    ],
    burnTimeHours: 65,
    scentNotes: { top: ["Rain accord"], heart: ["Fern", "Moss"], base: ["Wet stone", "Vetiver"] },
    materials: ["Coconut-soy wax", "Cotton wick", "Recycled glass"],
    reviews: { average: 4.4, count: 88 },
    relatedSlugs: ["fig-vetiver-candle", "sea-salt-driftwood-candle", "match-box"],
  },

  // ---------------------------------------------------------------------
  // Diffusers
  // ---------------------------------------------------------------------
  {
    id: "fig-vetiver-diffuser",
    slug: "fig-vetiver-diffuser",
    name: "Fig & Vetiver Diffuser",
    tagline: "The candle's flameless counterpart, for rooms that stay lit all day",
    description:
      "The same green fig and dry vetiver accord as our bestselling candle, held in a slow-release reed blend that reads consistently for up to twelve weeks.",
    story: "Built for the rooms our candles can't reach — nurseries, offices, anywhere an open flame isn't practical.",
    categorySlug: "diffusers",
    collectionSlugs: ["bestsellers"],
    images: [
      img("eo-figdiff-1", "Fig and Vetiver reed diffuser with natural reeds", 1200, 1500),
      img("eo-figdiff-2", "Diffuser bottle on a console table", 1200, 1500),
    ],
    basePrice: 38,
    variantAxes: [
      scentAxisFor([scentPalette.figVetiver]),
      sizeAxis(diffuserSizes.map((s) => ({ id: s.id, label: s.label }))),
    ],
    variants: candleVariants("figdiff", [scentPalette.figVetiver], diffuserSizes, 4),
    attributes: [
      { label: "Reeds", value: "8 natural fiber reeds included" },
      { label: "Vessel", value: "Reusable glass bottle" },
      { label: "Coverage", value: "Small–medium room" },
      { label: "Origin", value: "Blended in Vermont, USA" },
    ],
    scentNotes: { top: ["Green fig leaf"], heart: ["Vetiver root"], base: ["Cedar", "Musk"] },
    materials: ["Reed diffuser oil", "Glass", "Natural fiber reeds"],
    reviews: { average: 4.6, count: 154 },
    relatedSlugs: ["fig-vetiver-candle", "amber-oud-diffuser", "diffuser-tray"],
  },
  {
    id: "amber-oud-diffuser",
    slug: "amber-oud-diffuser",
    name: "Amber & Oud Diffuser",
    tagline: "Resinous amber and dark oud, held for twelve slow weeks",
    description:
      "Warm amber resin and dark oud in a flameless format — ideal for bedrooms, where an unattended flame isn't the right call.",
    story: "Our slowest-fading blend; customers report the scent staying true well past the twelve-week mark.",
    categorySlug: "diffusers",
    collectionSlugs: ["winter-edit"],
    images: [
      img("eo-amberdiff-1", "Amber and Oud reed diffuser in dark glass", 1200, 1500),
      img("eo-amberdiff-2", "Diffuser on a bedside table at dusk", 1200, 1500),
    ],
    basePrice: 38,
    variantAxes: [
      scentAxisFor([scentPalette.amberOud]),
      sizeAxis(diffuserSizes.map((s) => ({ id: s.id, label: s.label }))),
    ],
    variants: candleVariants("amberdiff", [scentPalette.amberOud], diffuserSizes, 7),
    attributes: [
      { label: "Reeds", value: "8 natural fiber reeds included" },
      { label: "Vessel", value: "Reusable smoked glass bottle" },
      { label: "Coverage", value: "Small–medium room" },
      { label: "Origin", value: "Blended in Vermont, USA" },
    ],
    scentNotes: { top: ["Rose absolute"], heart: ["Oud"], base: ["Amber resin"] },
    materials: ["Reed diffuser oil", "Glass", "Natural fiber reeds"],
    reviews: { average: 4.7, count: 76 },
    isNew: true,
    relatedSlugs: ["amber-oud-candle", "fig-vetiver-diffuser", "diffuser-tray"],
  },
  {
    id: "quince-clover-diffuser",
    slug: "quince-clover-diffuser",
    name: "Quince & Clover Diffuser",
    tagline: "Orchard fruit and honeyed clover, held without a flame",
    description:
      "A bright, low-key sweetness for hallways and kitchens — ripe quince and clover honey in a slow-release reed format.",
    story: "Requested for two years by customers who wanted the candle's scent somewhere a flame couldn't go.",
    categorySlug: "diffusers",
    collectionSlugs: ["spring-edit"],
    images: [
      img("eo-quincediff-1", "Quince and Clover reed diffuser in pale glass", 1200, 1500),
      img("eo-quincediff-2", "Diffuser beside a spring floral arrangement", 1200, 1500),
    ],
    basePrice: 38,
    variantAxes: [
      scentAxisFor([scentPalette.quinceClover]),
      sizeAxis(diffuserSizes.map((s) => ({ id: s.id, label: s.label }))),
    ],
    variants: candleVariants("quincediff", [scentPalette.quinceClover], diffuserSizes, 0),
    attributes: [
      { label: "Reeds", value: "8 natural fiber reeds included" },
      { label: "Vessel", value: "Reusable glass bottle" },
      { label: "Coverage", value: "Small–medium room" },
      { label: "Origin", value: "Blended in Vermont, USA" },
    ],
    scentNotes: { top: ["Quince", "Pear"], heart: ["Clover honey"], base: ["Soft musk"] },
    materials: ["Reed diffuser oil", "Glass", "Natural fiber reeds"],
    reviews: { average: 4.3, count: 41 },
    relatedSlugs: ["quince-clover-candle", "fig-vetiver-diffuser", "diffuser-tray"],
  },

  // ---------------------------------------------------------------------
  // Sets & Gifting
  // ---------------------------------------------------------------------
  {
    id: "gift-set-duo",
    slug: "gift-set-duo",
    name: "The Duo Gift Set",
    tagline: "Two 6 oz candles, boxed in kraft with a wax seal",
    description:
      "Two of our 6 oz candles, boxed together in recycled kraft and closed with a wax seal. Pick one of three curated pairings below.",
    story: "Our most-gifted item every holiday season, and the one thing we never let go on sale.",
    categorySlug: "sets",
    collectionSlugs: ["gifting", "winter-edit"],
    images: [
      img("eo-duo-1", "Duo gift set box open showing two candles", 1200, 1500),
      img("eo-duo-2", "Duo gift set closed box with wax seal", 1200, 1500),
      img("eo-duo-3", "Duo gift set candles side by side unboxed", 1200, 1500),
    ],
    basePrice: 58,
    compareAtPrice: 64,
    variantAxes: [
      sizeAxis([
        { id: "hearth-fig", label: "Hearth + Fig & Vetiver" },
        { id: "amber-tobacco", label: "Amber & Oud + Tobacco Leaf" },
        { id: "quince-fern", label: "Quince & Clover + Wild Fern" },
      ]),
    ],
    variants: [
      { id: "duo-hearth-fig", selections: { size: "hearth-fig" }, price: 58, sku: "EO-DUO-HF", stock: 18, stockStatus: "in_stock", weightGrams: 560 },
      { id: "duo-amber-tobacco", selections: { size: "amber-tobacco" }, price: 58, sku: "EO-DUO-AT", stock: 4, stockStatus: "low_stock", weightGrams: 560 },
      { id: "duo-quince-fern", selections: { size: "quince-fern" }, price: 58, sku: "EO-DUO-QF", stock: 0, stockStatus: "out_of_stock", weightGrams: 560 },
    ],
    attributes: [
      { label: "Includes", value: "Two 6 oz candles" },
      { label: "Packaging", value: "Recycled kraft box, wax seal" },
      { label: "Gift note", value: "Free, added at checkout" },
    ],
    materials: ["Coconut-soy wax", "Cotton wick", "Recycled glass", "FSC kraft board"],
    reviews: { average: 4.9, count: 203 },
    isBestseller: true,
    featured: true,
    relatedSlugs: ["hearth-candle", "fig-vetiver-candle", "match-box"],
  },
  {
    id: "discovery-set",
    slug: "discovery-set",
    name: "The Discovery Set",
    tagline: "Five 2 oz votives — one of every scent",
    description:
      "For anyone who can't decide: five 2 oz votives, one in each of our core scents, boxed together so you can live with a candle before committing to a full size.",
    story: "Started as a sampling kit for our own team; customers asked to buy it so often we made it permanent.",
    categorySlug: "sets",
    collectionSlugs: ["gifting"],
    images: [
      img("eo-discovery-1", "Discovery set of five small votive candles", 1200, 1500),
      img("eo-discovery-2", "Five votives arranged in a row, lit", 1200, 1500),
    ],
    basePrice: 45,
    variantAxes: [],
    variants: [
      { id: "discovery-standard", selections: {}, price: 45, sku: "EO-DISC-STD", stock: 22, stockStatus: "in_stock", weightGrams: 420 },
    ],
    attributes: [
      { label: "Includes", value: "5 × 2 oz votives, one per core scent" },
      { label: "Burn time", value: "~12 hours each" },
      { label: "Packaging", value: "Recycled kraft box" },
    ],
    materials: ["Coconut-soy wax", "Cotton wick", "Recycled glass"],
    reviews: { average: 4.8, count: 311 },
    isBestseller: true,
    relatedSlugs: ["gift-set-duo", "hearth-candle", "match-box"],
  },

  // ---------------------------------------------------------------------
  // Accessories
  // ---------------------------------------------------------------------
  {
    id: "wick-trimmer",
    slug: "wick-trimmer",
    name: "Brass Wick Trimmer",
    tagline: "Trims to a quarter inch for a clean, soot-free burn",
    description:
      "A weighted brass trimmer sized to leave the wick at a quarter inch — the length that keeps a candle burning clean, without tunneling or soot.",
    story: "Sourced from a small metalworker in Connecticut; each one is hand-finished, so brushing marks vary slightly.",
    categorySlug: "accessories",
    collectionSlugs: ["gifting"],
    images: [
      img("eo-trimmer-1", "Brass wick trimmer on a beechwood tray", 1200, 1500),
      img("eo-trimmer-2", "Close-up of the trimmer blade", 1200, 1500),
    ],
    basePrice: 28,
    variantAxes: [],
    variants: [
      { id: "trimmer-standard", selections: {}, price: 28, sku: "EO-ACC-TRIM", stock: 31, stockStatus: "in_stock", weightGrams: 140 },
    ],
    attributes: [
      { label: "Material", value: "Solid brass" },
      { label: "Length", value: "7.5 in" },
      { label: "Care", value: "Hand wash, dry immediately" },
    ],
    materials: ["Brass"],
    reviews: { average: 4.9, count: 145 },
    relatedSlugs: ["brass-snuffer", "diffuser-tray", "hearth-candle"],
  },
  {
    id: "brass-snuffer",
    slug: "brass-candle-snuffer",
    name: "Brass Candle Snuffer",
    tagline: "Extinguish without the scatter of a blown-out flame",
    description:
      "A long-handled brass snuffer that puts out a flame without scattering hot wax or sending smoke across the room.",
    story: "Paired with the wick trimmer as our most-gifted accessory duo.",
    categorySlug: "accessories",
    collectionSlugs: ["gifting"],
    images: [img("eo-snuffer-1", "Brass candle snuffer with a long handle", 1200, 1500)],
    basePrice: 26,
    variantAxes: [],
    variants: [
      { id: "snuffer-standard", selections: {}, price: 26, sku: "EO-ACC-SNUF", stock: 19, stockStatus: "in_stock", weightGrams: 120 },
    ],
    attributes: [
      { label: "Material", value: "Solid brass" },
      { label: "Length", value: "8 in" },
      { label: "Care", value: "Hand wash, dry immediately" },
    ],
    materials: ["Brass"],
    reviews: { average: 4.7, count: 98 },
    relatedSlugs: ["wick-trimmer", "diffuser-tray", "amber-oud-candle"],
  },
  {
    id: "diffuser-tray",
    slug: "beechwood-tray",
    name: "Beechwood Catch Tray",
    tagline: "FSC-certified beech, sized for a candle or diffuser bottle",
    description:
      "A simple turned tray in FSC-certified beechwood, sized to catch drips under a candle or hold a diffuser bottle steady on a shelf.",
    story: "Turned on a single lathe by one craftsperson in upstate New York — no two grain patterns match exactly.",
    categorySlug: "accessories",
    collectionSlugs: ["gifting"],
    images: [
      img("eo-tray-1", "Beechwood tray with a candle resting on it", 1200, 1500),
      img("eo-tray-2", "Beechwood tray grain detail", 1200, 1500),
    ],
    basePrice: 24,
    variantAxes: [
      sizeAxis([
        { id: "small", label: "Small — 4 in" },
        { id: "large", label: "Large — 6 in" },
      ]),
    ],
    variants: [
      { id: "tray-small", selections: { size: "small" }, price: 24, sku: "EO-ACC-TRAY-S", stock: 27, stockStatus: "in_stock", weightGrams: 180 },
      { id: "tray-large", selections: { size: "large" }, price: 32, sku: "EO-ACC-TRAY-L", stock: 12, stockStatus: "in_stock", weightGrams: 260 },
    ],
    attributes: [
      { label: "Material", value: "FSC-certified beechwood" },
      { label: "Finish", value: "Food-safe mineral oil" },
      { label: "Care", value: "Wipe clean, re-oil occasionally" },
    ],
    materials: ["Beechwood"],
    reviews: { average: 4.6, count: 62 },
    relatedSlugs: ["wick-trimmer", "brass-snuffer", "hearth-candle"],
  },
  {
    id: "match-box",
    slug: "long-match-box",
    name: "Long Match Box",
    tagline: "60 long-reach matches in a screen-printed box",
    description:
      "Sixty extra-long matches for reaching deep candle vessels without singed fingers, boxed in a screen-printed kraft box that stands on its own.",
    story: "A small, unglamorous product — and consistently one of our top-ten sellers by unit count.",
    categorySlug: "accessories",
    collectionSlugs: ["gifting"],
    images: [img("eo-match-1", "Long match box standing upright with matches beside it", 1200, 1500)],
    basePrice: 14,
    variantAxes: [],
    variants: [
      { id: "match-standard", selections: {}, price: 14, sku: "EO-ACC-MATCH", stock: 54, stockStatus: "in_stock", weightGrams: 90 },
    ],
    attributes: [
      { label: "Count", value: "60 matches" },
      { label: "Length", value: "4 in" },
      { label: "Striker", value: "On box side" },
    ],
    materials: ["Wood", "Kraft board"],
    reviews: { average: 4.8, count: 210 },
    relatedSlugs: ["wick-trimmer", "hearth-candle", "gift-set-duo"],
  },
];
