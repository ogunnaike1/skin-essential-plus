import { supabase } from './client';
import type { Service } from './types';

// Get all active services for public display
export async function getPublicServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('available', true)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public services:', error);
    throw error;
  }
  
  return data as Service[];
}

// Get services by category
export async function getServicesByCategory(categoryId: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('category_id', categoryId)
    .eq('available', true)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching services by category:', error);
    throw error;
  }
  
  return data as Service[];
}

// Get single service by ID
export async function getPublicService(id: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .eq('available', true)
    .single();

  if (error) {
    console.error('Error fetching service:', error);
    throw error;
  }
  
  return data as Service;
}

// Search services
export async function searchServices(query: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('available', true)
    .or(`name.ilike.%${query}%,description.ilike.%${query}%,tag.ilike.%${query}%`)
    .order('name', { ascending: true });

  if (error) {
    console.error('Error searching services:', error);
    throw error;
  }
  
  return data as Service[];
}