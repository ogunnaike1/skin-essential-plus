import type { LucideIcon } from "lucide-react";

// ==========================================
// HOMEPAGE/UI TYPES (for constants.ts)
// ==========================================

// Navigation
export interface NavLink {
  readonly label: string;
  readonly href: string;
}

// Hero
export interface HeroSlide {
  readonly id: number;
  readonly eyebrow: string;
  readonly title: string;
  readonly subtitle: string;
  readonly image: string;
  readonly ctaPrimary: string;
  readonly ctaSecondary: string;
}

// Homepage Service Cards (NO PRICE - used in homepage cards)
export interface HomeService {
  readonly id: number;
  readonly title: string;
  readonly description: string;
  readonly image: string;
  readonly icon: LucideIcon;
  // NO price field - intentionally removed for homepage cards
}

// Trust Points
export interface TrustPoint {
  readonly id: number;
  readonly icon: LucideIcon;
  readonly title: string;
  readonly description: string;
}

// Testimonials
export interface Testimonial {
  readonly id: number;
  readonly name: string;
  readonly role: string;
  readonly quote: string;
  readonly rating: number;
  readonly image: string;
}

// Before/After
export interface BeforeAfterItem {
  readonly id: number;
  readonly label: string;
  readonly before: string;
  readonly after: string;
}

// Social
export interface SocialImage {
  readonly id: number;
  readonly src: string;
  readonly alt: string;
}

// Product categories
export type ProductCategory =
  | "cleansers"
  | "serums"
  | "moisturizers"
  | "treatments"
  | "suncare"
  | "masks";

// Service categories
export type ServiceCategory =
  | "facial"
  | "body"
  | "spa"
  | "lash"
  | "nails"
  | "hair-removal";

export type AccentColor = "mauve" | "sage" | "deep" | "forest";

// ==========================================
// DATABASE TYPES (for Supabase)
// ==========================================

// Database Service (HAS PRICE - used in database/admin)
export interface Service {
  id: string;
  name: string;
  category_id: string;
  category_name: string;
  description: string;
  price: number;
  duration_minutes: number;
  image_url: string;
  available: boolean;
  slots_total: number;
  slots_available: number;
  location: string;
  tag: string;
  rating: number;
  review_count: number;
  popular: boolean;   
  category?: string; 
  duration?: string;
  created_at: string;
  updated_at: string;
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  original_price?: number;
  image_url: string;
  stock: number;
  stock_status: 'in-stock' | 'low-stock' | 'pre-order' | 'out-of-stock';
  rating: number;
  review_count: number;
  tagline: string;
  key_ingredient: string;
  volume: string;
  accent: 'mauve' | 'sage' | 'deep';
  is_new?: boolean;
  is_bestseller?: boolean;
  is_exclusive?: boolean;
  is_new_arrival?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Appointment {
  id: string;
  customer_id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  service_id: string;
  service_name: string;
  service_price: number;
  staff_id?: string;
  staff_name?: string;
  appointment_date: string;
  start_time: string;
  end_time: string;
  duration_minutes: number;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address?: string;
  date_of_birth?: string;
  total_bookings: number;
  total_spent: number;
  created_at: string;
  updated_at: string;
}

export interface Staff {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  specialties: string[];
  available: boolean;
  image_url?: string;
  bio?: string;
  created_at: string;
  updated_at: string;
}

// Database types for Supabase
export interface Database {
  public: {
    Tables: {
      services: {
        Row: Service;
        Insert: Omit<Service, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>;
      };
      products: {
        Row: Product;
        Insert: Omit<Product, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Product, 'id' | 'created_at' | 'updated_at'>>;
      };
      appointments: {
        Row: Appointment;
        Insert: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>;
      };
      customers: {
        Row: Customer;
        Insert: Omit<Customer, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Customer, 'id' | 'created_at' | 'updated_at'>>;
      };
      staff: {
        Row: Staff;
        Insert: Omit<Staff, 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Staff, 'id' | 'created_at' | 'updated_at'>>;
      };
    };
  };
}