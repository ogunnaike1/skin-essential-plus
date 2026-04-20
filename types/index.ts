import type { LucideIcon } from "lucide-react";

export interface NavLink {
  label: string;
  href: string;
}

export interface HeroSlide {
  id: number;
  eyebrow: string;
  title: string;
  subtitle: string;
  image: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

export interface Service {
  id: number;
  title: string;
  description: string;
  image: string;
  icon: LucideIcon;
  price: string;
}

export interface TrustPoint {
  id: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export interface Testimonial {
  id: number;
  name: string;
  role: string;
  quote: string;
  rating: number;
  image: string;
}

export interface BeforeAfterItem {
  id: number;
  label: string;
  before: string;
  after: string;
}

export interface SocialImage {
  id: number;
  src: string;
  alt: string;
}

// ──────────────────────────────────────────────────────────────
// Services page types
// ──────────────────────────────────────────────────────────────

export interface Employee {
  id: string;
  name: string;
  role: string;
  avatar: string;
  rating: number;
  specialties: readonly string[];
  nextAvailable: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  tag: string;            // e.g. "Service"
  description: string;
  price: number;          // in NGN
  durationMinutes: number;
  slotsTotal: number;
  slotsAvailable: number;
  location: string;
  rating: number;         // 0–5
  reviewCount: number;
  image: string;
  employeeIds: readonly string[];
  popular?: boolean;
  isNew?: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  tagline: string;
  icon: LucideIcon;
  color: "mauve" | "sage" | "deep" | "mixed";
}