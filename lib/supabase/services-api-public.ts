import { supabase } from './client';

export interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  original_price?: number;
  duration: number;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// ============================================
// PUBLIC FUNCTIONS (use regular client)
// ============================================

// Get all active services for public display
export async function getPublicServices(): Promise<Service[]> {
  const res = await fetch('/api/services', { cache: 'no-store' });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || 'Failed to fetch services');
  }
  return res.json();
}

// Get services by category (public)
export async function getServicesByCategory(category: string): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('category', category)
    .eq('is_active', true)
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching services by category:', error);
    throw error;
  }
  
  return data || [];
}

// Get single service by ID (public)
export async function getPublicService(id: string): Promise<Service | null> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('is_active', true)
    .single();

  if (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
  
  return data;
}

// Search services (public)
export async function searchServices(query: string): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%`)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error searching services:', error);
    throw error;
  }
  
  return data || [];
}