import {
  Sparkles,
  Flower2,
  Eye,
  Droplets,
  ShieldCheck,
  Leaf,
  Award,
  HeartHandshake,
} from "lucide-react";

import type {
  BeforeAfterItem,
  HeroSlide,
  NavLink,
  Service,
  SocialImage,
  Testimonial,
  TrustPoint,
} from "@/types";

export const SITE = {
  name: "Skin Essential Plus",
  tagline: "Where Science Meets Serenity",
  description:
    "Premium skincare, spa therapy, and beauty rituals crafted for the modern connoisseur.",
  email: "hello@skinessentialplus.com",
  phone: "+234 800 123 4567",
  address: "12 Serenity Avenue, Victoria Island, Lagos",
  hours: "Mon–Sat · 9:00 AM – 8:00 PM",
} as const;

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Home", href: "#top" },
  { label: "Services", href: "#services" },
  { label: "About Us", href: "#about" },
  { label: "Results", href: "#results" },
  { label: "Reviews", href: "#testimonials" },
  { label: "Shop", href: "#shop" },
] as const;

export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: 1,
    eyebrow: "Signature Treatments",
    title: "Radiance, Refined.",
    subtitle:
      "Precision skin therapies tailored to your unique biology — where advanced science meets timeless beauty rituals.",
    image:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1920&q=85&auto=format&fit=crop",
    ctaPrimary: "Book a Consultation",
    ctaSecondary: "Explore Services",
  },
  {
    id: 2,
    eyebrow: "Spa Therapy",
    title: "Stillness, Reimagined.",
    subtitle:
      "Sanctuary rituals designed to restore equilibrium — a curated escape for the senses and the skin.",
    image:
      "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1920&q=85&auto=format&fit=crop",
    ctaPrimary: "Reserve a Session",
    ctaSecondary: "View Menu",
  },
  {
    id: 3,
    eyebrow: "Eyelash Artistry",
    title: "Expression, Elevated.",
    subtitle:
      "Bespoke lash sketching by master artisans — every curve drawn to accentuate your natural geometry.",
    image:
      "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=1920&q=85&auto=format&fit=crop",
    ctaPrimary: "Book Lash Artist",
    ctaSecondary: "See Gallery",
  },
  {
    id: 4,
    eyebrow: "Complete Skincare",
    title: "Rituals, Renewed.",
    subtitle:
      "A holistic ecosystem of treatments, products, and guidance — your skin's journey, curated with intention.",
    image:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1920&q=85&auto=format&fit=crop",
    ctaPrimary: "Start Your Journey",
    ctaSecondary: "Meet Our Experts",
  },
] as const;

export const SERVICES: readonly Service[] = [
  {
    id: 1,
    title: "Skin Treatments",
    description:
      "Advanced facials, microneedling, and bespoke therapies calibrated to your skin's unique signature.",
    image:
      "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=80&auto=format&fit=crop",
    icon: Sparkles,
    price: "from ₦45,000",
  },
  {
    id: 2,
    title: "Spa Therapy",
    description:
      "Immersive body rituals, aromatherapy, and hydrotherapy designed to restore balance and radiance.",
    image:
      "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=800&q=80&auto=format&fit=crop",
    icon: Flower2,
    price: "from ₦55,000",
  },
  {
    id: 3,
    title: "Eyelash Sketching",
    description:
      "Hand-crafted lash extensions and architectural sketching by certified master artisans.",
    image:
      "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=800&q=80&auto=format&fit=crop",
    icon: Eye,
    price: "from ₦25,000",
  },
  {
    id: 4,
    title: "Full Skincare",
    description:
      "Comprehensive regimens combining treatments, clinical-grade products, and lifestyle guidance.",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=80&auto=format&fit=crop",
    icon: Droplets,
    price: "from ₦80,000",
  },
] as const;

export const TRUST_POINTS: readonly TrustPoint[] = [
  {
    id: 1,
    icon: ShieldCheck,
    title: "Clinically Proven",
    description:
      "Every protocol is validated by dermatological research and refined through years of practice.",
  },
  {
    id: 2,
    icon: Leaf,
    title: "Conscious Formulas",
    description:
      "Clean, ethically-sourced ingredients — because luxury should never cost the planet.",
  },
  {
    id: 3,
    icon: Award,
    title: "Master Artisans",
    description:
      "Our therapists are globally certified, continuously trained, and passionate about their craft.",
  },
  {
    id: 4,
    icon: HeartHandshake,
    title: "Tailored Rituals",
    description:
      "No two skins are alike. Every experience is sculpted around your singular needs.",
  },
] as const;

export const TESTIMONIALS: readonly Testimonial[] = [
  {
    id: 1,
    name: "Adaeze Okonkwo",
    role: "Creative Director",
    quote:
      "Skin Essential Plus redefined what a spa visit could be. I walked in exhausted and left glowing — inside and out. The attention to every detail is extraordinary.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200&q=80&auto=format&fit=crop",
  },
  {
    id: 2,
    name: "Tomiwa Adegoke",
    role: "Entrepreneur",
    quote:
      "Six months of their skincare program transformed my complexion entirely. What I love most is how they listen — every session feels uniquely mine.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80&auto=format&fit=crop",
  },
  {
    id: 3,
    name: "Chiamaka Eze",
    role: "Event Planner",
    quote:
      "The eyelash sketching is an art form here. I've tried dozens of studios — none come close to this precision, comfort, and finesse.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&q=80&auto=format&fit=crop",
  },
  {
    id: 4,
    name: "Fatima Ibrahim",
    role: "Fashion Editor",
    quote:
      "A genuine sanctuary in the heart of the city. The ambience, the therapists, the results — every element is intentional and exquisite.",
    rating: 5,
    image:
      "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=200&q=80&auto=format&fit=crop",
  },
] as const;

export const BEFORE_AFTER: readonly BeforeAfterItem[] = [
  {
    id: 1,
    label: "12-Week Skin Renewal Program",
    before:
      "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=900&q=80&auto=format&fit=crop",
    after:
      "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=900&q=80&auto=format&fit=crop",
  },
] as const;

export const SOCIAL_IMAGES: readonly SocialImage[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&q=80&auto=format&fit=crop",
    alt: "Facial treatment",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=600&q=80&auto=format&fit=crop",
    alt: "Spa therapy",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1583241800698-e8ab01830a07?w=600&q=80&auto=format&fit=crop",
    alt: "Lash artistry",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=80&auto=format&fit=crop",
    alt: "Skincare routine",
  },
  {
    id: 5,
    src: "https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600&q=80&auto=format&fit=crop",
    alt: "Skin treatment",
  },
  {
    id: 6,
    src: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?w=600&q=80&auto=format&fit=crop",
    alt: "Aromatherapy",
  },
  {
    id: 7,
    src: "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=80&auto=format&fit=crop",
    alt: "Product ritual",
  },
  {
    id: 8,
    src: "https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=600&q=80&auto=format&fit=crop",
    alt: "Beauty details",
  },
] as const;