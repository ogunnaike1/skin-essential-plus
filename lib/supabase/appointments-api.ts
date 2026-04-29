import { supabase } from './client';

export interface Appointment {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  service_id?: string;
  service_name: string;
  service_price: number;
  appointment_date: string;
  appointment_time: string;
  message?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  payment_status: 'pending' | 'paid' | 'failed';
  payment_reference?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateAppointmentData {
  customer_name: string;
  customer_email: string;
  customer_phone?: string;
  service_id?: string;
  service_name: string;
  service_price: number;
  appointment_date: string;
  appointment_time: string;
  message?: string;
}

// Create appointment
export async function createAppointment(data: CreateAppointmentData) {
  const { data: appointment, error } = await supabase
    .from('appointments')
    .insert([data])
    .select()
    .single();

  if (error) throw error;
  return appointment as Appointment;
}

// Get all appointments (admin)
export async function getAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('appointment_date', { ascending: false })
    .order('appointment_time', { ascending: false });

  if (error) throw error;
  return data as Appointment[];
}

// Get appointment by ID
export async function getAppointmentById(id: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw error;
  return data as Appointment;
}

// Update appointment
export async function updateAppointment(id: string, updates: Partial<Appointment>) {
  const { data, error } = await supabase
    .from('appointments')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data as Appointment;
}

// Update payment status
export async function updatePaymentStatus(id: string, status: 'paid' | 'failed', reference?: string) {
  const updates: Partial<Appointment> = {
    payment_status: status,
  };
  
  if (reference) {
    updates.payment_reference = reference;
  }

  if (status === 'paid') {
    updates.status = 'confirmed';
  }

  return updateAppointment(id, updates);
}

// Delete appointment
export async function deleteAppointment(id: string) {
  const { error } = await supabase
    .from('appointments')
    .delete()
    .eq('id', id);

  if (error) throw error;
  return true;
}

// Get appointments by email
export async function getAppointmentsByEmail(email: string) {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .eq('customer_email', email)
    .order('appointment_date', { ascending: false });

  if (error) throw error;
  return data as Appointment[];
}

// Get upcoming appointments
export async function getUpcomingAppointments() {
  const today = new Date().toISOString().split('T')[0];
  
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .gte('appointment_date', today)
    .in('status', ['pending', 'confirmed'])
    .order('appointment_date', { ascending: true })
    .order('appointment_time', { ascending: true });

  if (error) throw error;
  return data as Appointment[];
}