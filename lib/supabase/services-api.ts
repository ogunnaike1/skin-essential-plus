import { supabase } from './client';
import { supabaseAdmin } from './admin-client';

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

export interface CreateServiceData {
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image_url?: string;
  display_order?: number;
}

// ============================================
// PUBLIC FUNCTIONS (use regular client)
// ============================================

// Get all active services for public display
export async function getPublicServices(): Promise<Service[]> {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('is_active', true)
    .order('category', { ascending: true })
    .order('display_order', { ascending: true });

  if (error) {
    console.error('Error fetching public services:', error);
    throw error;
  }
  
  return data || [];
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

// ============================================
// ADMIN FUNCTIONS (use admin client)
// ============================================

// Get all services (admin) - uses admin client
export async function getServices(): Promise<Service[]> {
  const { data, error } = await supabaseAdmin
    .from('services')
    .select('*')
    .order('category', { ascending: true })
    .order('display_order', { ascending: true });

  if (error) throw error;
  return data || [];
}

// Get single service by ID (admin) - uses admin client
export async function getService(id: string): Promise<Service | null> {
  const { data, error } = await supabaseAdmin
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data;
}

// Create new service - uses admin client
export async function createService(serviceData: CreateServiceData): Promise<Service> {
  const { data, error } = await supabaseAdmin
    .from('services')
    .insert([{
      ...serviceData,
      is_active: true,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Update service - uses admin client
export async function updateService(
  id: string, 
  updates: Partial<CreateServiceData> & { is_active?: boolean }
): Promise<Service> {
  const { data, error } = await supabaseAdmin
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// Delete service - uses admin client
export async function deleteService(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('services')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

// Upload service image - uses admin client
export async function uploadServiceImage(file: File, serviceId?: string): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${serviceId || Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `services/${fileName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from('images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
}

// Get all unique categories (for admin dropdowns)
export async function getServiceCategories(): Promise<string[]> {
  const { data, error } = await supabaseAdmin
    .from('services')
    .select('category')
    .order('category', { ascending: true });

  if (error) throw error;

  // Get unique categories
  const categories = [...new Set(data?.map(s => s.category) || [])];
  return categories;
}