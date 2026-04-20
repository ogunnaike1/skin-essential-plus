import {
  Brush,
  Droplets,
  Eye,
  Fingerprint,
  Flower2,
  Footprints,
  Hand,
  Heart,
  Scissors,
  Smile,
  Sparkles,
  Syringe,
  UserCheck,
  Waves,
  Zap,
} from "lucide-react";

import type {
  Employee,
  ServiceCategory,
  ServiceItem,
} from "@/types";

// ──────────────────────────────────────────────────────────────
// EMPLOYEES (team members available for services)
// ──────────────────────────────────────────────────────────────
export const EMPLOYEES: readonly Employee[] = [
  {
    id: "emp-amaka",
    name: "Dr. Amaka Okafor",
    role: "Lead Clinician",
    avatar:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&q=85&auto=format&fit=crop",
    rating: 4.9,
    specialties: ["Advanced Facial", "Skin Treatment", "PRP"],
    nextAvailable: "Today, 3:00 PM",
  },
  {
    id: "emp-chiamaka",
    name: "Chiamaka Eze",
    role: "Head of Spa Therapy",
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&q=85&auto=format&fit=crop",
    rating: 4.9,
    specialties: ["Massage", "Body Enhancement", "Pedicure"],
    nextAvailable: "Tomorrow, 10:00 AM",
  },
  {
    id: "emp-fatima",
    name: "Fatima Ibrahim",
    role: "Master Lash Artisan",
    avatar:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=400&q=85&auto=format&fit=crop",
    rating: 5.0,
    specialties: ["Lash Extension", "Semi Permanent Brows"],
    nextAvailable: "Today, 5:30 PM",
  },
  {
    id: "emp-adaeze",
    name: "Adaeze Okonkwo",
    role: "Senior Therapist",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=400&q=85&auto=format&fit=crop",
    rating: 4.8,
    specialties: ["Waxing", "Skin Treatment", "Teeth Whitening"],
    nextAvailable: "Today, 6:00 PM",
  },
  {
    id: "emp-nneka",
    name: "Nneka Adeyemi",
    role: "Aesthetician",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=85&auto=format&fit=crop",
    rating: 4.7,
    specialties: ["Facial Treatment", "Tattoo Removal", "IV Drips"],
    nextAvailable: "Tomorrow, 2:00 PM",
  },
  {
    id: "emp-zainab",
    name: "Zainab Musa",
    role: "Beauty Therapist",
    avatar:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=85&auto=format&fit=crop",
    rating: 4.8,
    specialties: ["Pedicure", "Waxing", "Lash Extension"],
    nextAvailable: "Today, 4:00 PM",
  },
];

// ──────────────────────────────────────────────────────────────
// CATEGORIES
// ──────────────────────────────────────────────────────────────
export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  {
    id: "pedicure",
    name: "Pedicure Treatment",
    tagline: "Restore your step",
    icon: Footprints,
    color: "mauve",
  },
  {
    id: "advanced-facial",
    name: "Advanced Facial",
    tagline: "Clinically-led glow",
    icon: Sparkles,
    color: "sage",
  },
  {
    id: "skin-treatment",
    name: "Skin Treatment",
    tagline: "Bespoke protocols",
    icon: Fingerprint,
    color: "deep",
  },
  {
    id: "massage",
    name: "Massage",
    tagline: "Release and restore",
    icon: Hand,
    color: "mauve",
  },
  {
    id: "lash-extension",
    name: "Lash Extension",
    tagline: "Architectural artistry",
    icon: Eye,
    color: "sage",
  },
  {
    id: "semi-permanent-brows",
    name: "Semi Permanent Brows",
    tagline: "Defined, effortless",
    icon: Brush,
    color: "deep",
  },
  {
    id: "facial-treatment",
    name: "Facial Treatment",
    tagline: "Essential care",
    icon: Flower2,
    color: "mauve",
  },
  {
    id: "iv-drips",
    name: "Skin IV Drips",
    tagline: "Luminosity, infused",
    icon: Syringe,
    color: "sage",
  },
  {
    id: "tattoo-removal",
    name: "Tattoo Removal",
    tagline: "Clean slate",
    icon: Zap,
    color: "deep",
  },
  {
    id: "prp-stretch",
    name: "PRP Stretch Mark",
    tagline: "Regenerative care",
    icon: Droplets,
    color: "mauve",
  },
  {
    id: "body-enhancement",
    name: "Body Enhancement",
    tagline: "Sculpt and tone",
    icon: Waves,
    color: "sage",
  },
  {
    id: "face-waxing",
    name: "Face Waxing",
    tagline: "Gentle precision",
    icon: Scissors,
    color: "deep",
  },
  {
    id: "bikini-waxing",
    name: "Bikini & Brazilian Waxing",
    tagline: "Expert discretion",
    icon: Heart,
    color: "mauve",
  },
  {
    id: "body-waxing",
    name: "Body Waxing",
    tagline: "Smooth, all over",
    icon: UserCheck,
    color: "sage",
  },
  {
    id: "teeth-whitening",
    name: "Teeth Whitening",
    tagline: "Luminous confidence",
    icon: Smile,
    color: "deep",
  },
];

// ──────────────────────────────────────────────────────────────
// SERVICES
// ──────────────────────────────────────────────────────────────
export const SERVICES_CATALOG: readonly ServiceItem[] = [
  // Pedicure (3)
  {
    id: "ped-classic",
    categoryId: "pedicure",
    name: "Classic Pedicure Ritual",
    tag: "Service",
    description:
      "Exfoliation, nail shaping, cuticle care, and a warm herbal foot soak.",
    price: 15000,
    durationMinutes: 60,
    slotsTotal: 5,
    slotsAvailable: 2,
    location: "Spa Atelier · Victoria Island",
    rating: 4.8,
    reviewCount: 142,
    image:
      "https://images.unsplash.com/photo-1519415943484-9fa1873496d4?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-chiamaka", "emp-zainab"],
    popular: true,
  },
  {
    id: "ped-deluxe",
    categoryId: "pedicure",
    name: "Deluxe Paraffin Pedicure",
    tag: "Service",
    description:
      "Classic ritual plus a paraffin wax treatment and extended massage.",
    price: 22500,
    durationMinutes: 80,
    slotsTotal: 4,
    slotsAvailable: 3,
    location: "Spa Atelier · Victoria Island",
    rating: 4.9,
    reviewCount: 89,
    image:
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-chiamaka", "emp-zainab", "emp-adaeze"],
  },
  {
    id: "ped-medical",
    categoryId: "pedicure",
    name: "Medical Pedicure",
    tag: "Clinical",
    description:
      "Therapeutic treatment for calluses, cracked heels, and nail concerns.",
    price: 28000,
    durationMinutes: 75,
    slotsTotal: 3,
    slotsAvailable: 0,
    location: "Clinical Suite · Floor 2",
    rating: 4.9,
    reviewCount: 56,
    image:
      "https://images.unsplash.com/photo-1519415387722-a1c3bbef716c?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-amaka"],
    isNew: true,
  },

  // Advanced Facial (3)
  {
    id: "af-hydrafacial",
    categoryId: "advanced-facial",
    name: "Signature HydraFacial",
    tag: "Advanced",
    description:
      "Multi-step hydradermabrasion — cleanse, exfoliate, extract, hydrate.",
    price: 65000,
    durationMinutes: 75,
    slotsTotal: 6,
    slotsAvailable: 4,
    location: "Treatment Room 3 · Main Sanctuary",
    rating: 4.9,
    reviewCount: 234,
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-amaka", "emp-nneka"],
    popular: true,
  },
  {
    id: "af-microneedling",
    categoryId: "advanced-facial",
    name: "Microneedling with PRP",
    tag: "Clinical",
    description:
      "Collagen induction therapy enhanced with platelet-rich plasma.",
    price: 120000,
    durationMinutes: 90,
    slotsTotal: 3,
    slotsAvailable: 1,
    location: "Clinical Suite · Floor 2",
    rating: 5.0,
    reviewCount: 67,
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-amaka"],
  },
  {
    id: "af-chemicalpeel",
    categoryId: "advanced-facial",
    name: "Gold Chemical Peel",
    tag: "Advanced",
    description:
      "Medical-grade resurfacing peel tailored to your skin's signature.",
    price: 85000,
    durationMinutes: 60,
    slotsTotal: 4,
    slotsAvailable: 2,
    location: "Treatment Room 1 · Main Sanctuary",
    rating: 4.8,
    reviewCount: 98,
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-amaka", "emp-nneka"],
  },

  // Skin Treatment (3)
  {
    id: "st-brightening",
    categoryId: "skin-treatment",
    name: "Radiance Brightening Program",
    tag: "Program",
    description:
      "Targeted regimen for hyperpigmentation and uneven skin tone.",
    price: 95000,
    durationMinutes: 75,
    slotsTotal: 5,
    slotsAvailable: 3,
    location: "Main Sanctuary · Treatment Room 2",
    rating: 4.9,
    reviewCount: 112,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-amaka", "emp-adaeze"],
  },
  {
    id: "st-acne",
    categoryId: "skin-treatment",
    name: "Clarity Acne Protocol",
    tag: "Clinical",
    description:
      "Multi-phase treatment for active acne and post-inflammatory marks.",
    price: 75000,
    durationMinutes: 70,
    slotsTotal: 5,
    slotsAvailable: 2,
    location: "Clinical Suite · Floor 2",
    rating: 4.8,
    reviewCount: 87,
    image:
      "https://images.unsplash.com/photo-1559599101-f09722fb4948?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-amaka", "emp-nneka", "emp-adaeze"],
  },
  {
    id: "st-antiaging",
    categoryId: "skin-treatment",
    name: "Timeless Anti-Aging Ritual",
    tag: "Signature",
    description:
      "Firming, lifting, and collagen-boosting protocol for mature skin.",
    price: 110000,
    durationMinutes: 90,
    slotsTotal: 3,
    slotsAvailable: 2,
    location: "Main Sanctuary · Treatment Room 3",
    rating: 5.0,
    reviewCount: 74,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-amaka"],
    popular: true,
  },

  // Massage (3)
  {
    id: "m-swedish",
    categoryId: "massage",
    name: "Swedish Full-Body Massage",
    tag: "Therapy",
    description:
      "Long, flowing strokes to relieve tension and improve circulation.",
    price: 45000,
    durationMinutes: 60,
    slotsTotal: 6,
    slotsAvailable: 4,
    location: "Spa Atelier · Main Floor",
    rating: 4.8,
    reviewCount: 198,
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-chiamaka"],
  },
  {
    id: "m-deeptissue",
    categoryId: "massage",
    name: "Deep Tissue Release",
    tag: "Therapy",
    description:
      "Targeted pressure for chronic tension and muscular knots.",
    price: 55000,
    durationMinutes: 75,
    slotsTotal: 5,
    slotsAvailable: 3,
    location: "Spa Atelier · Main Floor",
    rating: 4.9,
    reviewCount: 156,
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-chiamaka"],
    popular: true,
  },
  {
    id: "m-aromatherapy",
    categoryId: "massage",
    name: "Aromatherapy Ritual",
    tag: "Signature",
    description:
      "Full-body massage with custom-blended essential oils for your mood.",
    price: 60000,
    durationMinutes: 90,
    slotsTotal: 4,
    slotsAvailable: 2,
    location: "Serenity Suite · Floor 3",
    rating: 4.9,
    reviewCount: 112,
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-chiamaka", "emp-adaeze"],
  },

  // Lash Extension (3)
  {
    id: "le-classic",
    categoryId: "lash-extension",
    name: "Classic Lash Extensions",
    tag: "Service",
    description:
      "One extension per natural lash for a refined, everyday look.",
    price: 35000,
    durationMinutes: 120,
    slotsTotal: 4,
    slotsAvailable: 2,
    location: "Lash Atelier · Floor 2",
    rating: 4.9,
    reviewCount: 287,
    image:
      "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-fatima", "emp-zainab"],
  },
  {
    id: "le-volume",
    categoryId: "lash-extension",
    name: "Russian Volume Set",
    tag: "Signature",
    description:
      "Hand-made fans of 3–5 extensions per lash for dramatic fullness.",
    price: 55000,
    durationMinutes: 150,
    slotsTotal: 3,
    slotsAvailable: 1,
    location: "Lash Atelier · Floor 2",
    rating: 5.0,
    reviewCount: 164,
    image:
      "https://images.unsplash.com/photo-1628106367045-8d7d63b8d1cd?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-fatima"],
    popular: true,
  },
  {
    id: "le-fill",
    categoryId: "lash-extension",
    name: "Lash Fill-In",
    tag: "Maintenance",
    description:
      "Top-up existing extensions to keep your look full between sets.",
    price: 22000,
    durationMinutes: 60,
    slotsTotal: 6,
    slotsAvailable: 4,
    location: "Lash Atelier · Floor 2",
    rating: 4.8,
    reviewCount: 203,
    image:
      "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-fatima", "emp-zainab"],
  },

  // Semi Permanent Brows (2)
  {
    id: "spb-microblading",
    categoryId: "semi-permanent-brows",
    name: "Microblading",
    tag: "Signature",
    description:
      "Hair-stroke tattooing for natural-looking brow definition.",
    price: 120000,
    durationMinutes: 180,
    slotsTotal: 2,
    slotsAvailable: 1,
    location: "Brow Atelier · Floor 2",
    rating: 4.9,
    reviewCount: 89,
    image:
      "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-fatima"],
  },
  {
    id: "spb-powderbrow",
    categoryId: "semi-permanent-brows",
    name: "Powder Brow",
    tag: "Signature",
    description:
      "Soft, shaded brows with a makeup-like finish.",
    price: 105000,
    durationMinutes: 150,
    slotsTotal: 2,
    slotsAvailable: 2,
    location: "Brow Atelier · Floor 2",
    rating: 4.9,
    reviewCount: 64,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-fatima"],
    isNew: true,
  },

  // Facial Treatment (2)
  {
    id: "ft-express",
    categoryId: "facial-treatment",
    name: "Express Glow Facial",
    tag: "Service",
    description:
      "45-minute refresher — cleanse, mask, hydrate. Perfect on lunch breaks.",
    price: 25000,
    durationMinutes: 45,
    slotsTotal: 8,
    slotsAvailable: 6,
    location: "Main Sanctuary · Treatment Room 1",
    rating: 4.7,
    reviewCount: 321,
    image:
      "https://images.unsplash.com/photo-1571646034647-52e6ea84b28c?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-nneka", "emp-adaeze"],
  },
  {
    id: "ft-deep",
    categoryId: "facial-treatment",
    name: "Deep Cleansing Facial",
    tag: "Service",
    description:
      "Thorough extraction and pore purification for congested skin.",
    price: 38000,
    durationMinutes: 75,
    slotsTotal: 5,
    slotsAvailable: 3,
    location: "Main Sanctuary · Treatment Room 2",
    rating: 4.8,
    reviewCount: 176,
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-nneka", "emp-adaeze"],
  },

  // IV Drips (2)
  {
    id: "iv-glow",
    categoryId: "iv-drips",
    name: "Glutathione Glow Drip",
    tag: "Clinical",
    description:
      "Antioxidant-rich IV therapy for luminosity from within.",
    price: 95000,
    durationMinutes: 60,
    slotsTotal: 3,
    slotsAvailable: 2,
    location: "Clinical Suite · Floor 2",
    rating: 4.9,
    reviewCount: 78,
    image:
      "https://images.unsplash.com/photo-1631815588090-d1bcbe9b5e1e?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-amaka", "emp-nneka"],
    popular: true,
  },
  {
    id: "iv-hydration",
    categoryId: "iv-drips",
    name: "Hydration Vitality Drip",
    tag: "Wellness",
    description:
      "B-complex, vitamin C, and electrolytes for energy and radiance.",
    price: 65000,
    durationMinutes: 45,
    slotsTotal: 4,
    slotsAvailable: 3,
    location: "Clinical Suite · Floor 2",
    rating: 4.8,
    reviewCount: 54,
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-amaka", "emp-nneka"],
  },

  // Tattoo Removal (2)
  {
    id: "tr-small",
    categoryId: "tattoo-removal",
    name: "Laser Tattoo Removal — Small",
    tag: "Clinical",
    description:
      "Up to 5cm. Q-switched laser with numbing pre-treatment. Per session.",
    price: 45000,
    durationMinutes: 30,
    slotsTotal: 4,
    slotsAvailable: 3,
    location: "Clinical Suite · Floor 2",
    rating: 4.7,
    reviewCount: 43,
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-nneka"],
  },
  {
    id: "tr-large",
    categoryId: "tattoo-removal",
    name: "Laser Tattoo Removal — Large",
    tag: "Clinical",
    description:
      "Over 10cm. Per session. Typically requires 6–10 sessions for full removal.",
    price: 95000,
    durationMinutes: 60,
    slotsTotal: 3,
    slotsAvailable: 2,
    location: "Clinical Suite · Floor 2",
    rating: 4.7,
    reviewCount: 32,
    image:
      "https://images.unsplash.com/photo-1526045431048-f857369baa09?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-nneka"],
  },

  // PRP Stretch Mark (2)
  {
    id: "prp-abdomen",
    categoryId: "prp-stretch",
    name: "PRP Stretch Mark — Abdomen",
    tag: "Clinical",
    description:
      "Platelet-rich plasma microneedling for abdominal stretch marks.",
    price: 135000,
    durationMinutes: 90,
    slotsTotal: 2,
    slotsAvailable: 1,
    location: "Clinical Suite · Floor 2",
    rating: 4.9,
    reviewCount: 28,
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-amaka"],
  },
  {
    id: "prp-full",
    categoryId: "prp-stretch",
    name: "PRP Stretch Mark — Full Body",
    tag: "Clinical",
    description:
      "Comprehensive treatment across multiple body areas. Per session.",
    price: 195000,
    durationMinutes: 150,
    slotsTotal: 2,
    slotsAvailable: 1,
    location: "Clinical Suite · Floor 2",
    rating: 5.0,
    reviewCount: 19,
    image:
      "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-amaka"],
    isNew: true,
  },

  // Body Enhancement (2)
  {
    id: "be-contour",
    categoryId: "body-enhancement",
    name: "Body Contouring — Cavitation",
    tag: "Clinical",
    description:
      "Ultrasound-based fat reduction. Non-invasive, no downtime.",
    price: 85000,
    durationMinutes: 75,
    slotsTotal: 3,
    slotsAvailable: 2,
    location: "Clinical Suite · Floor 2",
    rating: 4.6,
    reviewCount: 47,
    image:
      "https://images.unsplash.com/photo-1582655464712-b0e89d456eff?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-chiamaka", "emp-nneka"],
  },
  {
    id: "be-wrap",
    categoryId: "body-enhancement",
    name: "Detox Clay Body Wrap",
    tag: "Wellness",
    description:
      "Mineral-rich clay treatment to detoxify and tone the body.",
    price: 55000,
    durationMinutes: 75,
    slotsTotal: 4,
    slotsAvailable: 3,
    location: "Spa Atelier · Main Floor",
    rating: 4.7,
    reviewCount: 62,
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-chiamaka"],
  },

  // Face Waxing (2)
  {
    id: "fw-upperlip",
    categoryId: "face-waxing",
    name: "Upper Lip & Chin Wax",
    tag: "Service",
    description:
      "Gentle hot wax for facial hair. Includes soothing aftercare.",
    price: 8000,
    durationMinutes: 20,
    slotsTotal: 10,
    slotsAvailable: 7,
    location: "Main Sanctuary · Waxing Room",
    rating: 4.8,
    reviewCount: 243,
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-adaeze", "emp-zainab"],
  },
  {
    id: "fw-fullface",
    categoryId: "face-waxing",
    name: "Full Face Wax",
    tag: "Service",
    description:
      "Brows, upper lip, chin, and cheeks. Complete facial hair removal.",
    price: 18000,
    durationMinutes: 35,
    slotsTotal: 6,
    slotsAvailable: 4,
    location: "Main Sanctuary · Waxing Room",
    rating: 4.8,
    reviewCount: 156,
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-adaeze", "emp-zainab"],
  },

  // Bikini & Brazilian (2)
  {
    id: "bw-bikini",
    categoryId: "bikini-waxing",
    name: "Bikini Line Wax",
    tag: "Service",
    description:
      "Tidy waxing along the bikini line. Discreet, professional service.",
    price: 15000,
    durationMinutes: 30,
    slotsTotal: 5,
    slotsAvailable: 3,
    location: "Main Sanctuary · Waxing Room",
    rating: 4.8,
    reviewCount: 189,
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-adaeze", "emp-zainab"],
  },
  {
    id: "bw-brazilian",
    categoryId: "bikini-waxing",
    name: "Brazilian Wax",
    tag: "Service",
    description:
      "Full hair removal with our signature gentle hard wax.",
    price: 22000,
    durationMinutes: 45,
    slotsTotal: 4,
    slotsAvailable: 2,
    location: "Main Sanctuary · Waxing Room",
    rating: 4.9,
    reviewCount: 267,
    image:
      "https://images.unsplash.com/photo-1600180758890-6b94519a8ba6?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-adaeze", "emp-zainab"],
    popular: true,
  },

  // Body Waxing (2)
  {
    id: "bdw-halfleg",
    categoryId: "body-waxing",
    name: "Half Leg Wax",
    tag: "Service",
    description:
      "Lower or upper leg waxing with our warm honey formula.",
    price: 18000,
    durationMinutes: 30,
    slotsTotal: 6,
    slotsAvailable: 4,
    location: "Main Sanctuary · Waxing Room",
    rating: 4.7,
    reviewCount: 143,
    image:
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-adaeze", "emp-zainab"],
  },
  {
    id: "bdw-fullleg",
    categoryId: "body-waxing",
    name: "Full Leg & Underarm",
    tag: "Bundle",
    description:
      "Complete leg waxing plus underarms. Best-value bundle.",
    price: 32000,
    durationMinutes: 60,
    slotsTotal: 4,
    slotsAvailable: 2,
    location: "Main Sanctuary · Waxing Room",
    rating: 4.8,
    reviewCount: 97,
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-adaeze", "emp-zainab"],
  },

  // Teeth Whitening (2)
  {
    id: "tw-standard",
    categoryId: "teeth-whitening",
    name: "Teeth Whitening",
    tag: "Service",
    description:
      "Professional-grade whitening for visibly brighter teeth in one session.",
    price: 45000,
    durationMinutes: 60,
    slotsTotal: 4,
    slotsAvailable: 3,
    location: "Wellness Suite · Floor 2",
    rating: 4.7,
    reviewCount: 84,
    image:
      "https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-adaeze"],
  },
  {
    id: "tw-scaling",
    categoryId: "teeth-whitening",
    name: "Teeth Whitening and Scaling",
    tag: "Service",
    description:
      "Complete package — deep scaling, polishing, and LED whitening.",
    price: 60800,
    durationMinutes: 80,
    slotsTotal: 5,
    slotsAvailable: 1,
    location: "Wellness Suite · Floor 2",
    rating: 4.9,
    reviewCount: 118,
    image:
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=800&q=80&auto=format&fit=crop",
    employeeIds: ["emp-adaeze"],
    popular: true,
  },
];

// ──────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────

export function formatPrice(ngn: number): string {
  return `₦${ngn.toLocaleString("en-NG")}`;
}

export function formatDuration(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}min`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}min`;
}

export function getEmployeesForService(
  service: ServiceItem
): readonly Employee[] {
  return EMPLOYEES.filter((e) => service.employeeIds.includes(e.id));
}

export function getServicesForCategory(
  categoryId: string
): readonly ServiceItem[] {
  return SERVICES_CATALOG.filter((s) => s.categoryId === categoryId);
}