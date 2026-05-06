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

// Try explicit import path instead of alias
import type {
  BeforeAfterItem,
  HeroSlide,
  NavLink,
  HomeService,
  SocialImage,
  Testimonial,
  TrustPoint,
} from "@/lib/supabase/types"; 

export const SITE = {
  name: "Skin Essential Plus",
  tagline: "Where Science Meets Serenity",
  description:
    "Premium skincare, spa therapy, and beauty rituals crafted for the modern connoisseur.",
  email: "hello@skinessentialplus.com",
  phone: "+234 800 123 4567",
  address: "No 2, Alaafia Avenue, Opposite IDC Primary School, Akobo, Ibadan",
  hours: "Mon–Sat · 9:00 AM – 8:00 PM",
} as const;

export const NAV_LINKS: readonly NavLink[] = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Shop", href: "/shop" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact Us", href: "/contact" },
] as const;

export const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: 1,
    eyebrow: "Signature Treatments",
    title: "Radiance, Refined.",
    subtitle:
      "Precision skin therapies tailored to your unique biology — where advanced science meets timeless beauty rituals.",
    image:
      "https://res.cloudinary.com/dhmqhless/image/upload/v1778092806/skin-ig3_og3xnh.jpg",
    ctaPrimary: "Book an Appointment",
    ctaSecondary: "Explore Services",
  },
  {
    id: 2,
    eyebrow: "Spa Therapy",
    title: "Stillness, Reimagined.",
    subtitle:
      "Sanctuary rituals designed to restore equilibrium — a curated escape for the senses and the skin.",
    image:
      "https://res.cloudinary.com/dhmqhless/image/upload/v1778092844/skin-ig1_ksvzcl.jpg",
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
      "https://res.cloudinary.com/dhmqhless/image/upload/v1778093837/skin-ig5_qfrkfe.jpg",
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
      "https://res.cloudinary.com/dhmqhless/image/upload/v1778028814/skin-essential-plus/homepage/hero/home-page-hero4.jpg",
    ctaPrimary: "Start Your Journey",
    ctaSecondary: "Meet Our Experts",
  },
] as const;

// ✅ Changed type from Service[] to HomeService[]
export const SERVICES: readonly HomeService[] = [
  {
    id: 1,
    title: "Skin Treatments",
    description:
      "Advanced facials, microneedling, and bespoke therapies calibrated to your skin's unique signature.",
    image:
      "https://res.cloudinary.com/dhmqhless/image/upload/skin-essential-plus/homepage/hero/home-Skin-Treatments",
    icon: Sparkles,
  },
  {
    id: 2,
    title: "Spa Therapy",
    description:
      "Immersive body rituals, aromatherapy, and hydrotherapy designed to restore balance and radiance.",
    image:
      "https://res.cloudinary.com/dhmqhless/image/upload/skin-essential-plus/homepage/hero/home-Spa-Therapy",
    icon: Flower2,
  },
  {
    id: 3,
    title: "Eyelash Sketching",
    description:
      "Hand-crafted lash extensions and architectural sketching by certified master artisans.",
    image:
      "https://res.cloudinary.com/dhmqhless/image/upload/skin-essential-plus/homepage/hero/home-eye-lash",
    icon: Eye,
  },
  {
    id: 4,
    title: "Full Skincare",
    description:
      "Comprehensive regimens combining treatments, clinical-grade products, and lifestyle guidance.",
    image:
      "https://res.cloudinary.com/dhmqhless/image/upload/skin-essential-plus/homepage/hero/home-Full-Skincare",
    icon: Droplets,
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
    src: "https://res.cloudinary.com/dhmqhless/image/upload/v1778092806/skin-ig3_og3xnh.jpg",
    alt: "Facial treatment",
  },
  {
    id: 2,
    src: "https://res.cloudinary.com/dhmqhless/image/upload/v1778092844/skin-ig1_ksvzcl.jpg",
    alt: "Spa therapy",
  },
  {
    id: 3,
    src: "https://res.cloudinary.com/dhmqhless/image/upload/v1778093141/skin-ig4_ihjvl0.jpg",
    alt: "Lash artistry",
  },
  {
    id: 4,
    src: "https://res.cloudinary.com/dhmqhless/image/upload/v1778092844/skin-ig2_w7tvnk.jpg",
    alt: "Skincare routine",
  },
  {
    id: 5,
    src: "https://res.cloudinary.com/dhmqhless/image/upload/v1778093837/skin-ig5_qfrkfe.jpg",
    alt: "Skin treatment",
  },
  {
    id: 6,
    src: "/images/homepage-hero/home-Skin-Treatments.png",
    alt: "Aromatherapy",
  },
  {
    id: 7,
    src: "/images/homepage-hero/home-Spa-Therapy.png",
    alt: "Product ritual",
  },
  {
    id: 8,
    src: "/images/homepage-hero/home-eye-lash.png",
    alt: "Beauty details",
  },
] as const;