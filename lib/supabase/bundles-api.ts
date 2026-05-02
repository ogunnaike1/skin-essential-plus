import { supabase } from './client';
import { supabaseAdmin } from './admin-client';

export interface Bundle {
  id: string;
  name: string;
  slug: string;
  description: string;
  step: string;
  accent: 'mauve' | 'sage' | 'deep';
  image_url: string | null;
  product_ids: string[];
  original_price: number;
  bundle_price: number;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateBundleData {
  name: string;
  slug: string;
  description: string;
  step: string;
  accent: 'mauve' | 'sage' | 'deep';
  image_url?: string;
  product_ids: string[];
  original_price: number;
  bundle_price: number;
  display_order?: number;
}

// Get all active bundles for public display (uses regular client)
export async function getPublicBundles(): Promise<Bundle[]> {
  const { data, error } = await supabase
    .from('bundles')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// Get all bundles (admin) - uses admin client to bypass RLS
export async function getBundles(): Promise<Bundle[]> {
  const { data, error } = await supabaseAdmin
    .from('bundles')
    .select('*')
    .order('display_order', { ascending: true });
  
  if (error) throw error;
  return data || [];
}

// Get single bundle - uses admin client
export async function getBundleById(id: string): Promise<Bundle | null> {
  const { data, error } = await supabaseAdmin
    .from('bundles')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// Create bundle - uses admin client
export async function createBundle(bundleData: CreateBundleData): Promise<Bundle> {
  const { data, error } = await supabaseAdmin
    .from('bundles')
    .insert([bundleData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Update bundle - uses admin client
export async function updateBundle(id: string, bundleData: Partial<CreateBundleData>): Promise<Bundle> {
  const { data, error } = await supabaseAdmin
    .from('bundles')
    .update(bundleData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Delete bundle - uses admin client
export async function deleteBundle(id: string): Promise<void> {
  const { error } = await supabaseAdmin
    .from('bundles')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Upload bundle image - uses admin client
export async function uploadBundleImage(file: File): Promise<string> {
  const fileExt = file.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
  const filePath = `bundles/${fileName}`;

  const { error: uploadError } = await supabaseAdmin.storage
    .from('images')
    .upload(filePath, file);

  if (uploadError) throw uploadError;

  const { data: { publicUrl } } = supabaseAdmin.storage
    .from('images')
    .getPublicUrl(filePath);

  return publicUrl;
}