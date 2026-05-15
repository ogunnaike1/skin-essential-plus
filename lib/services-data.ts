import {
  Activity,
  Brush,
  Droplets,
  Eye,
  Fingerprint,
  Flame,
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
    id: "emp-Ifeoluwa",
    name: "Ifeoluwa Peters Kanyinsola",
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
    id: "advanced-facial",
    name: "Advanced Facial",
    tagline: "Clinically-led glow",
    icon: Sparkles,
    color: "sage",
  },
  {
    id: "bikini-waxing",
    name: "Bikini & Brazilian Waxing",
    tagline: "Expert discretion",
    icon: Heart,
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
    id: "body-waxing",
    name: "Body Waxing",
    tagline: "Smooth, all over",
    icon: UserCheck,
    color: "deep",
  },
  {
    id: "face-waxing",
    name: "Face Waxing",
    tagline: "Gentle precision",
    icon: Scissors,
    color: "mauve",
  },
  {
    id: "facial-treatment",
    name: "Facial Treatment",
    tagline: "Essential care",
    icon: Flower2,
    color: "sage",
  },
  {
    id: "laser-hair-removal",
    name: "Laser Hair Removal",
    tagline: "Permanently smooth skin",
    icon: Flame,
    color: "deep",
  },
  {
    id: "lash-extension",
    name: "Lash Extension",
    tagline: "Architectural artistry",
    icon: Eye,
    color: "mauve",
  },
  {
    id: "lipolysis",
    name: "Lipolysis",
    tagline: "Dissolve and define",
    icon: Activity,
    color: "deep",
  },
  {
    id: "massage",
    name: "Massage",
    tagline: "Release and restore",
    icon: Hand,
    color: "sage",
  },
  {
    id: "pedicure",
    name: "Pedicure Treatment",
    tagline: "Restore your step",
    icon: Footprints,
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
    id: "semi-permanent-brows",
    name: "Semi Permanent Brows",
    tagline: "Defined, effortless",
    icon: Brush,
    color: "sage",
  },
  {
    id: "iv-drips",
    name: "Skin IV Drips",
    tagline: "Luminosity, infused",
    icon: Syringe,
    color: "deep",
  },
  {
    id: "skin-treatment",
    name: "Skin Treatment",
    tagline: "Bespoke protocols",
    icon: Fingerprint,
    color: "mauve",
  },
  {
    id: "tattoo-removal",
    name: "Tattoo Removal",
    tagline: "Clean slate",
    icon: Zap,
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
  // Services are now loaded from database, this function is deprecated
  // Kept for backward compatibility
  return [];
}