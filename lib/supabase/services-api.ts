import { supabase } from './client';
import type { Service } from './types';

// Get all services
export async function getServices() {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data as Service[];
}

// Get single service by ID
export async function getService(id: string) {
  const { data, error } = await supabase
    .from('services')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Service;
}

// Create new service
export async function createService(service: Omit<Service, 'id' | 'created_at' | 'updated_at'>) {
  const { data, error } = await supabase
    .from('services')
    .insert([service])
    .select()
    .single();

  if (error) throw error;
  return data as Service;
}

// Update service
export async function updateService(id: string, updates: Partial<Omit<Service, 'id' | 'created_at' | 'updated_at'>>) {
  const { data, error } = await supabase
    .from('services')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Service;
}

// Delete service
export async function deleteService(id: string) {
  const { error } = await supabase
    .from('services')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// Upload service image
export async function uploadServiceImage(file: File, serviceId: string) {
  const fileExt = file.name.split('.').pop();
  const fileName = `${serviceId}-${Date.now()}.${fileExt}`;
  const filePath = `services/${fileName}`;

  // Use upsert option to bypass some RLS issues
  const { error: uploadError } = await supabase.storage
    .from('images')
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: true
    });

  if (uploadError) {
    console.error('Upload error:', uploadError);
    throw uploadError;
  }

  const { data: { publicUrl } } = supabase.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
}