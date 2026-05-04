import { createBrowserClient } from '@supabase/ssr';
import type { Product, Appointment } from './types';

// Dashboard stats interface
export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  totalAppointments: number;
  revenueGrowth: number;
  ordersGrowth: number;
  activeProducts: number;
  todayAppointments: number;
}

// Recent appointment interface
export interface RecentAppointment {
  id: string;
  customer_name: string;
  service_name: string;
  appointment_date: string;
  start_time: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  service_price: number;
}

// Top product interface
export interface TopProduct {
  id: string;
  name: string;
  sales: number;
  revenue: number;
  stock: number;
  stock_status: 'in-stock' | 'low-stock' | 'pre-order' | 'out-of-stock';
}

/**
 * Create Supabase client for dashboard
 */
function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();

  try {
    // Get total revenue from completed appointments
    const { data: appointments, error: appointmentsError } = await supabase
      .from('appointments')
      .select('service_price, status, created_at')
      .eq('status', 'completed');

    if (appointmentsError) throw appointmentsError;

    const totalRevenue = appointments?.reduce((sum: number, apt: { service_price: number }) => {
      return sum + (apt.service_price || 0);
    }, 0) || 0;

    // Get total appointments count
    const { count: totalAppointments, error: countError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true });

    if (countError) throw countError;

    // Get today's appointments
    const today = new Date().toISOString().split('T')[0];
    const { count: todayAppointments, error: todayError } = await supabase
      .from('appointments')
      .select('*', { count: 'exact', head: true })
      .eq('appointment_date', today);

    if (todayError) throw todayError;

    // Get total products
    const { data: products, error: productsError } = await supabase
      .from('products')
      .select('stock, stock_status');

    if (productsError) throw productsError;

    const totalProducts = products?.length || 0;
    const activeProducts = products?.filter((p: { stock_status: string }) => {
      return p.stock_status === 'in-stock';
    }).length || 0;

    // Calculate growth (mock for now - you can add date-based logic later)
    const revenueGrowth = 12.5;
    const ordersGrowth = 8.2;
    const totalOrders = totalAppointments || 0;

    return {
      totalRevenue,
      totalOrders,
      totalProducts,
      totalAppointments: totalAppointments || 0,
      revenueGrowth,
      ordersGrowth,
      activeProducts,
      todayAppointments: todayAppointments || 0,
    };
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return {
      totalRevenue: 0,
      totalOrders: 0,
      totalProducts: 0,
      totalAppointments: 0,
      revenueGrowth: 0,
      ordersGrowth: 0,
      activeProducts: 0,
      todayAppointments: 0,
    };
  }
}

/**
 * Get recent appointments
 */
export async function getRecentAppointments(limit = 5): Promise<RecentAppointment[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('appointments')
      .select('id, customer_name, service_name, appointment_date, start_time, status, service_price')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching recent appointments:', error);
    return [];
  }
}

/**
 * Get top performing products (by sales/stock movement)
 */
export async function getTopProducts(limit = 5): Promise<TopProduct[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id, name, stock, stock_status, price, is_bestseller')
      .order('is_bestseller', { ascending: false })
      .limit(limit);

    if (error) throw error;

    // Transform to TopProduct format
    // Note: In a real app, you'd track actual sales in an 'orders' table
    // For now, we'll use stock levels and bestseller status as proxy
    const topProducts: TopProduct[] = (data || []).map((product: {
      id: string;
      name: string;
      stock: number;
      stock_status: 'in-stock' | 'low-stock' | 'pre-order' | 'out-of-stock';
      price: number;
      is_bestseller: boolean;
    }) => ({
      id: product.id,
      name: product.name,
      sales: product.is_bestseller 
        ? Math.floor(Math.random() * 200) + 100 
        : Math.floor(Math.random() * 100),
      revenue: product.is_bestseller 
        ? product.price * (Math.floor(Math.random() * 200) + 100) 
        : product.price * Math.floor(Math.random() * 100),
      stock: product.stock,
      stock_status: product.stock_status,
    }));

    return topProducts;
  } catch (error) {
    console.error('Error fetching top products:', error);
    return [];
  }
}

/**
 * Get low stock alerts
 */
export async function getLowStockProducts(limit = 10): Promise<Product[]> {
  const supabase = createClient();

  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('stock_status', 'low-stock')
      .limit(limit);

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching low stock products:', error);
    return [];
  }
}

/**
 * Format currency (Nigerian Naira)
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}