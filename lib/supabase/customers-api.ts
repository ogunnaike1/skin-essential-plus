import { supabase } from './client';

export interface Customer {
  id: string;
  email: string;
  full_name: string;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postal_code: string | null;
  total_orders: number;
  total_spent: number;
  last_order_date: string | null;
  created_at: string;
  updated_at: string;
}

export interface CreateCustomerData {
  email: string;
  full_name: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  postal_code?: string;
}

// Get all customers with stats
export async function getCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// Get single customer
export async function getCustomerById(id: string): Promise<Customer | null> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
}

// Create customer
export async function createCustomer(customerData: CreateCustomerData): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .insert([customerData])
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Update customer
export async function updateCustomer(id: string, customerData: Partial<CreateCustomerData>): Promise<Customer> {
  const { data, error } = await supabase
    .from('customers')
    .update(customerData)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
}

// Delete customer
export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .delete()
    .eq('id', id);
  
  if (error) throw error;
}

// Search customers
export async function searchCustomers(query: string): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .or(`full_name.ilike.%${query}%,email.ilike.%${query}%,phone.ilike.%${query}%`)
    .order('created_at', { ascending: false });
  
  if (error) throw error;
  return data || [];
}

// Get customer stats
export async function getCustomerStats() {
  const { data: customers, error } = await supabase
    .from('customers')
    .select('total_orders, total_spent, created_at');
  
  if (error) throw error;

  const totalCustomers = customers?.length || 0;
  const totalRevenue = customers?.reduce((sum, c) => sum + c.total_spent, 0) || 0;
  const totalOrders = customers?.reduce((sum, c) => sum + c.total_orders, 0) || 0;
  
  // New customers this month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const newThisMonth = customers?.filter(c => new Date(c.created_at) >= firstDayOfMonth).length || 0;

  return {
    totalCustomers,
    totalRevenue,
    totalOrders,
    newThisMonth,
    averageOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0,
  };
}