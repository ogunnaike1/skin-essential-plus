import type {
  Product,
  ProductCategory,
  ProductCollection,
  RoutineBundle,
} from "@/types";

// ──────────────────────────────────────────────────────────────
// CATEGORIES
// ──────────────────────────────────────────────────────────────
export interface ProductCategoryMeta {
  id: ProductCategory;
  label: string;
  color: "mauve" | "sage" | "deep";
}

export const PRODUCT_CATEGORIES: readonly ProductCategoryMeta[] = [
  { id: "cleansers", label: "Cleansers", color: "mauve" },
  { id: "serums", label: "Serums", color: "sage" },
  { id: "moisturizers", label: "Moisturizers", color: "deep" },
  { id: "masks", label: "Masks", color: "mauve" },
  { id: "tools", label: "Tools", color: "sage" },
  { id: "bundles", label: "Bundles", color: "deep" },
  { id: "bath-body", label: "Bath & Body", color: "mauve" },
];

// ──────────────────────────────────────────────────────────────
// HERO COLLECTIONS
// ──────────────────────────────────────────────────────────────
export const COLLECTIONS: readonly ProductCollection[] = [
  {
    id: "the-ritual",
    title: "The Daily Ritual",
    subtitle: "Complete skincare system",
    description:
      "Morning to evening — the full regimen designed by our clinicians for daily glow.",
    image:
      "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=1600&q=90&auto=format&fit=crop",
    color: "mauve",
    productCount: 6,
    href: "#daily-ritual",
  },
  {
    id: "the-tools",
    title: "Tools & Devices",
    subtitle: "Precision instruments",
    description:
      "Gua sha, jade rollers, LED masks — the sculpting tools that elevate every ritual.",
    image:
      "https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=1600&q=90&auto=format&fit=crop",
    color: "sage",
    productCount: 8,
    href: "#tools",
  },
  {
    id: "the-bundles",
    title: "Curated Bundles",
    subtitle: "Save up to 25%",
    description:
      "Thoughtful sets assembled for specific concerns — brightening, calming, age-defying.",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=1600&q=90&auto=format&fit=crop",
    color: "deep",
    productCount: 4,
    href: "#bundles",
  },
];

// ──────────────────────────────────────────────────────────────
// PRODUCTS
// ──────────────────────────────────────────────────────────────
export const PRODUCTS: readonly Product[] = [
  // Cleansers (3)
  {
    id: "p-01",
    name: "Serenity Gel Cleanser",
    tagline: "Gentle daily wash",
    category: "cleansers",
    price: 18500,
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=900&q=85&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 234,
    volume: "200ml",
    keyIngredient: "Niacinamide",
    skinType: ["all skin", "sensitive"],
    description:
      "A low-foaming gel that removes impurities without stripping. The daily kickoff for every ritual.",
    stockStatus: "in-stock",
    isBestSeller: true,
    accent: "mauve",
  },
  {
    id: "p-02",
    name: "Clarity Foam Wash",
    tagline: "Deep pore cleanse",
    category: "cleansers",
    price: 22000,
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=900&q=85&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 156,
    volume: "150ml",
    keyIngredient: "Salicylic Acid",
    skinType: ["oily", "combination"],
    description:
      "A sulphate-free foam that purifies congested skin while keeping the barrier intact.",
    stockStatus: "in-stock",
    accent: "sage",
  },
  {
    id: "p-03",
    name: "Lotus Milk Cleanser",
    tagline: "Nourishing cream wash",
    category: "cleansers",
    price: 26000,
    image:
      "https://images.unsplash.com/photo-1611930021592-a0e2de58d424?w=900&q=85&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 189,
    volume: "200ml",
    keyIngredient: "Lotus Extract",
    skinType: ["dry", "mature"],
    description:
      "A rich, creamy cleanser infused with lotus extract and ceramides. Leaves skin soft and supple.",
    stockStatus: "low-stock",
    accent: "deep",
  },

  // Serums (4)
  {
    id: "p-04",
    name: "Radiance Vitamin C Serum",
    tagline: "Brightening antioxidant",
    category: "serums",
    price: 42000,
    originalPrice: 48000,
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=900&q=85&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 412,
    volume: "30ml",
    keyIngredient: "15% Vitamin C",
    skinType: ["all skin"],
    description:
      "Stabilized L-ascorbic acid delivers visible brightening and photoprotection in 4 weeks.",
    stockStatus: "in-stock",
    isBestSeller: true,
    accent: "mauve",
  },
  {
    id: "p-05",
    name: "Retinal Renewal Elixir",
    tagline: "Overnight age-defying",
    category: "serums",
    price: 68000,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=900&q=85&auto=format&fit=crop",
    rating: 5.0,
    reviewCount: 127,
    volume: "30ml",
    keyIngredient: "0.1% Retinaldehyde",
    skinType: ["mature", "all skin"],
    description:
      "Gold-standard overnight treatment. Retinaldehyde acts 10× faster than retinol, with less irritation.",
    stockStatus: "in-stock",
    isExclusive: true,
    accent: "deep",
  },
  {
    id: "p-06",
    name: "Hyaluronic Hydration Drops",
    tagline: "Deep plumping hydration",
    category: "serums",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=900&q=85&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 298,
    volume: "30ml",
    keyIngredient: "Triple Hyaluronic",
    skinType: ["all skin", "dry"],
    description:
      "Three molecular weights of hyaluronic acid hydrate every layer of the epidermis.",
    stockStatus: "in-stock",
    isBestSeller: true,
    accent: "sage",
  },
  {
    id: "p-07",
    name: "Niacinamide 10% Clarifying Serum",
    tagline: "Pore refining & tone evening",
    category: "serums",
    price: 28000,
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=900&q=85&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 210,
    volume: "30ml",
    keyIngredient: "10% Niacinamide",
    skinType: ["oily", "combination"],
    description:
      "Refines pores, evens skin tone, and regulates sebum. A universally tolerated powerhouse.",
    stockStatus: "in-stock",
    isNew: true,
    accent: "mauve",
  },

  // Moisturizers (3)
  {
    id: "p-08",
    name: "Velvet Day Cream SPF 30",
    tagline: "Daily hydration + protection",
    category: "moisturizers",
    price: 38000,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=900&q=85&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 345,
    volume: "50ml",
    keyIngredient: "Squalane + SPF 30",
    skinType: ["all skin"],
    description:
      "Silky daytime moisturizer with mineral SPF 30 and squalane. No white cast, no greasy finish.",
    stockStatus: "in-stock",
    isBestSeller: true,
    accent: "sage",
  },
  {
    id: "p-09",
    name: "Midnight Recovery Balm",
    tagline: "Restorative night treatment",
    category: "moisturizers",
    price: 52000,
    image:
      "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?w=900&q=85&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 178,
    volume: "50ml",
    keyIngredient: "Ceramide Complex",
    skinType: ["dry", "mature"],
    description:
      "A rich nighttime balm that repairs the barrier overnight. Wake to plump, rested skin.",
    stockStatus: "in-stock",
    accent: "deep",
  },
  {
    id: "p-10",
    name: "Featherweight Gel Moisturizer",
    tagline: "Oil-free hydration",
    category: "moisturizers",
    price: 29000,
    image:
      "https://images.unsplash.com/photo-1570194065650-d99fb4bedf0a?w=900&q=85&auto=format&fit=crop",
    rating: 4.6,
    reviewCount: 142,
    volume: "50ml",
    keyIngredient: "Green Tea + Hyaluronic",
    skinType: ["oily", "combination"],
    description:
      "A cooling gel moisturizer for oily and acne-prone skin. Absorbs instantly, leaves no shine.",
    stockStatus: "in-stock",
    isNew: true,
    accent: "sage",
  },

  // Masks (3)
  {
    id: "p-11",
    name: "24K Gold Glow Mask",
    tagline: "Luminous treatment mask",
    category: "masks",
    price: 35000,
    image:
      "https://images.unsplash.com/photo-1614859275264-4a9dc8a61e58?w=900&q=85&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 167,
    volume: "100ml",
    keyIngredient: "24K Gold + Vitamin E",
    skinType: ["all skin"],
    description:
      "An indulgent once-a-week ritual. Real 24k gold leaf and vitamin E leave skin visibly luminous.",
    stockStatus: "in-stock",
    isExclusive: true,
    accent: "mauve",
  },
  {
    id: "p-12",
    name: "Kaolin Detox Clay Mask",
    tagline: "Deep purification",
    category: "masks",
    price: 24000,
    image:
      "https://images.unsplash.com/photo-1609205343109-c0b2d8b7b6f6?w=900&q=85&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 98,
    volume: "100ml",
    keyIngredient: "Kaolin + Charcoal",
    skinType: ["oily", "combination"],
    description:
      "White kaolin clay draws out impurities. Activated charcoal clears the deep pore.",
    stockStatus: "in-stock",
    accent: "deep",
  },
  {
    id: "p-13",
    name: "Honey Hydrating Mask",
    tagline: "Intense moisture mask",
    category: "masks",
    price: 26000,
    image:
      "https://images.unsplash.com/photo-1556228841-a3c527ebefe5?w=900&q=85&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 134,
    volume: "100ml",
    keyIngredient: "Manuka Honey",
    skinType: ["dry", "sensitive"],
    description:
      "A soothing, deeply hydrating mask made with raw Manuka honey and calendula.",
    stockStatus: "low-stock",
    accent: "sage",
  },

  // Tools (3)
  {
    id: "p-14",
    name: "Rose Quartz Gua Sha",
    tagline: "Sculpting & lymphatic tool",
    category: "tools",
    price: 18000,
    image:
      "https://images.unsplash.com/photo-1584297091622-af8e5bd80b13?w=900&q=85&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 267,
    volume: "1 tool",
    keyIngredient: "Rose Quartz",
    skinType: ["all skin"],
    description:
      "Hand-carved rose quartz gua sha. Sculpts, drains, and boosts circulation in 5 minutes.",
    stockStatus: "in-stock",
    isBestSeller: true,
    accent: "mauve",
  },
  {
    id: "p-15",
    name: "Jade Facial Roller",
    tagline: "Cooling massage tool",
    category: "tools",
    price: 15000,
    image:
      "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?w=900&q=85&auto=format&fit=crop",
    rating: 4.7,
    reviewCount: 198,
    volume: "1 tool",
    keyIngredient: "Natural Jade",
    skinType: ["all skin"],
    description:
      "Dual-ended natural jade roller. Cools, de-puffs, and helps serums absorb deeper.",
    stockStatus: "in-stock",
    accent: "sage",
  },
  {
    id: "p-16",
    name: "LED Light Therapy Mask",
    tagline: "At-home red light treatment",
    category: "tools",
    price: 165000,
    image:
      "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=900&q=85&auto=format&fit=crop",
    rating: 4.9,
    reviewCount: 89,
    volume: "1 device",
    keyIngredient: "Red + Blue LED",
    skinType: ["all skin"],
    description:
      "Medical-grade 7-mode LED mask. Red for collagen, blue for acne, amber for tone.",
    stockStatus: "pre-order",
    isNew: true,
    isExclusive: true,
    accent: "deep",
  },

  // Bath & Body (2)
  {
    id: "p-17",
    name: "Tuberose Body Oil",
    tagline: "Silk-finish body treatment",
    category: "bath-body",
    price: 32000,
    image:
      "https://images.unsplash.com/photo-1608571423902-eed4a5ad8108?w=900&q=85&auto=format&fit=crop",
    rating: 4.8,
    reviewCount: 156,
    volume: "150ml",
    keyIngredient: "Tuberose Absolute",
    skinType: ["all skin", "dry"],
    description:
      "A luxurious dry body oil scented with tuberose and jasmine. Absorbs instantly.",
    stockStatus: "in-stock",
    accent: "mauve",
  },
  {
    id: "p-18",
    name: "Sea Mineral Bath Salts",
    tagline: "Relaxing soak ritual",
    category: "bath-body",
    price: 14000,
    image:
      "https://images.unsplash.com/photo-1584178432428-0f3b9a9e5a2f?w=900&q=85&auto=format&fit=crop",
    rating: 4.6,
    reviewCount: 87,
    volume: "500g",
    keyIngredient: "Dead Sea Minerals",
    skinType: ["all skin"],
    description:
      "Mineral-rich Dead Sea salts blended with lavender and eucalyptus essential oils.",
    stockStatus: "in-stock",
    accent: "sage",
  },
];

// ──────────────────────────────────────────────────────────────
// ROUTINE BUNDLES
// ──────────────────────────────────────────────────────────────
export const ROUTINE_BUNDLES: readonly RoutineBundle[] = [
  {
    id: "b-brighten",
    name: "The Brightening Edit",
    step: "For uneven tone",
    description:
      "Vitamin C serum + niacinamide + SPF day cream. Visible glow in 4 weeks.",
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=1200&q=85&auto=format&fit=crop",
    productIds: ["p-04", "p-07", "p-08"],
    bundlePrice: 89000,
    originalPrice: 108000,
    accent: "mauve",
  },
  {
    id: "b-calm",
    name: "The Calming Ritual",
    step: "For sensitive skin",
    description:
      "Milk cleanser + hydrating drops + honey mask. Soothes, hydrates, and restores.",
    image:
      "https://images.unsplash.com/photo-1611930021592-a0e2de58d424?w=1200&q=85&auto=format&fit=crop",
    productIds: ["p-03", "p-06", "p-13"],
    bundlePrice: 74000,
    originalPrice: 84000,
    accent: "sage",
  },
  {
    id: "b-age",
    name: "The Age-Defying Set",
    step: "For mature skin",
    description:
      "Retinaldehyde elixir + recovery balm + gold mask. Complete rejuvenation.",
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=1200&q=85&auto=format&fit=crop",
    productIds: ["p-05", "p-09", "p-11"],
    bundlePrice: 140000,
    originalPrice: 155000,
    accent: "deep",
  },
];

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────
export function formatShopPrice(ngn: number | null | undefined): string {
  if (ngn == null) return "₦0";
  return `₦${ngn.toLocaleString("en-NG")}`;
}

export function getProductsByCategory(cat: ProductCategory): readonly Product[] {
  return PRODUCTS.filter((p) => p.category === cat);
}

export function getBestSellers(): readonly Product[] {
  return PRODUCTS.filter((p) => p.isBestSeller).slice(0, 4);
}

export function getNewArrivals(): readonly Product[] {
  return PRODUCTS.filter((p) => p.isNew);
}