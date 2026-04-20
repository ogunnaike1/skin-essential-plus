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
