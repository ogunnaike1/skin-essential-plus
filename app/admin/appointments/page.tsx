'use client';

import { useState, useEffect } from 'react';
import type { Appointment } from '@/lib/supabase/appointments-api';
import { Calendar, Clock, Mail, Phone, User, DollarSign, Filter, Search, X } from 'lucide-react';
import { formatShopPrice } from '@/lib/shop-data';

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
type PaymentFilter = 'all' | 'pending' | 'paid' | 'failed';

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);

  useEffect(() => {
    fetchAppointments();
  }, []);

  useEffect(() => {
    filterAppointments();
  }, [appointments, searchTerm, statusFilter, paymentFilter]);

  const fetchAppointments = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/admin/appointments');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setAppointments(json.appointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterAppointments = () => {
    let filtered = [...appointments];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (apt) =>
          apt.customer_name.toLowerCase().includes(term) ||
          apt.customer_email.toLowerCase().includes(term) ||
          apt.customer_phone?.toLowerCase().includes(term) ||
          apt.service_name?.toLowerCase().includes(term)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      filtered = filtered.filter((apt) => apt.payment_status === paymentFilter);
    }

    // Sort by date (newest first)
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.appointment_date}T${a.start_time}`);
      const dateB = new Date(`${b.appointment_date}T${b.start_time}`);
      return dateB.getTime() - dateA.getTime();
    });

    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (id: string, status: string, paymentStatus?: string) => {
    try {
      const updates: Partial<Appointment> = { status: status as Appointment['status'] };
      if (paymentStatus) {
        updates.payment_status = paymentStatus as Appointment['payment_status'];
      }

      const res = await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);

      await fetchAppointments();
      setSelectedAppointment(null);
    } catch (error) {
      console.error('Error updating appointment:', error);
      alert('Failed to update appointment');
    }
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      completed: 'bg-green-100 text-green-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const getPaymentBadge = (status: string) => {
    const styles = {
      pending: 'bg-orange-100 text-orange-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
    };
    return styles[status as keyof typeof styles] || 'bg-gray-100 text-gray-800';
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const stats = {
    total: appointments.length,
    pending: appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    revenue: appointments
      .filter((a) => a.payment_status === 'paid')
      .reduce((sum, a) => sum + (a.service_price || 0), 0),
  };

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl font-light text-deep mb-2">
          Appointments
        </h1>
        <p className="text-sm text-deep/60">
          Manage customer bookings and schedules
        </p>
      </div>

      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Total</p>
            <p className="text-2xl font-bold text-deep mt-1">{stats.total}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Pending</p>
            <p className="text-2xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Confirmed</p>
            <p className="text-2xl font-bold text-blue-600 mt-1">{stats.confirmed}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Completed</p>
            <p className="text-2xl font-bold text-green-600 mt-1">{stats.completed}</p>
          </div>
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <p className="text-sm text-gray-600">Revenue</p>
            <p className="text-2xl font-bold text-mauve mt-1">{formatShopPrice(stats.revenue)}</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mauve focus:border-transparent"
              />
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mauve focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            {/* Payment Filter */}
            <div className="relative">
              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-mauve focus:border-transparent appearance-none bg-white"
              >
                <option value="all">All Payments</option>
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="failed">Failed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Appointments List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading appointments...</div>
          ) : filteredAppointments.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                ? 'No appointments found matching your filters'
                : 'No appointments yet'}
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Customer Info */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 bg-mauve/10 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-mauve" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-deep">{appointment.customer_name}</h3>
                          <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Mail className="w-4 h-4" />
                              {appointment.customer_email}
                            </span>
                            {appointment.customer_phone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-4 h-4" />
                                {appointment.customer_phone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Service & Date/Time */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 ml-13">
                        <div>
                          <p className="text-sm text-gray-500">Service</p>
                          <p className="font-medium text-deep">{appointment.service_name}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Date</p>
                            <p className="font-medium text-deep">
                              {formatDate(appointment.appointment_date)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <div>
                            <p className="text-sm text-gray-500">Time</p>
                            <p className="font-medium text-deep">
                              {formatTime(appointment.start_time)}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Message */}
                      {appointment.notes && (
                        <div className="ml-13 mt-3 p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-gray-600">
                            <span className="font-medium">Message:</span> {appointment.notes}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Status & Price */}
                    <div className="flex flex-col items-end gap-2 ml-6">
                      <div className="text-right mb-2">
                        <p className="text-2xl font-bold text-mauve">
                          {formatShopPrice(appointment.service_price || 0)}
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadge(
                          appointment.status
                        )}`}
                      >
                        {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
                      </span>
                      {appointment.payment_status && (
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${getPaymentBadge(
                            appointment.payment_status
                          )}`}
                        >
                          {appointment.payment_status.charAt(0).toUpperCase() +
                            appointment.payment_status.slice(1)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Appointment Details Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-deep">Appointment Details</h2>
                <button
                  onClick={() => setSelectedAppointment(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-semibold text-deep mb-4">Customer Information</h3>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Name</p>
                      <p className="font-medium text-deep">{selectedAppointment.customer_name}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="w-5 h-5 text-gray-400" />
                    <div>
                      <p className="text-sm text-gray-500">Email</p>
                      <p className="font-medium text-deep">{selectedAppointment.customer_email}</p>
                    </div>
                  </div>
                  {selectedAppointment.customer_phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-medium text-deep">{selectedAppointment.customer_phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Appointment Details */}
              <div>
                <h3 className="text-lg font-semibold text-deep mb-4">Appointment Details</h3>
                <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-500">Service</p>
                    <p className="font-medium text-deep">{selectedAppointment.service_name}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">Date</p>
                      <p className="font-medium text-deep">
                        {formatDate(selectedAppointment.appointment_date)}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Time</p>
                      <p className="font-medium text-deep">
                        {formatTime(selectedAppointment.start_time)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Price</p>
                    <p className="text-2xl font-bold text-mauve">
                      {formatShopPrice(selectedAppointment.service_price || 0)}
                    </p>
                  </div>
                  {selectedAppointment.notes && (
                    <div>
                      <p className="text-sm text-gray-500">Message</p>
                      <p className="font-medium text-deep">{selectedAppointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Status Management */}
              <div>
                <h3 className="text-lg font-semibold text-deep mb-4">Status Management</h3>
                <div className="space-y-4">
                  {/* Appointment Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Appointment Status
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedAppointment.id, 'confirmed')
                        }
                        disabled={selectedAppointment.status === 'confirmed'}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Confirm
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedAppointment.id, 'completed')
                        }
                        disabled={selectedAppointment.status === 'completed'}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedAppointment.id, 'pending')
                        }
                        disabled={selectedAppointment.status === 'pending'}
                        className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Set Pending
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(selectedAppointment.id, 'cancelled')
                        }
                        disabled={selectedAppointment.status === 'cancelled'}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Payment Status
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            selectedAppointment.id,
                            selectedAppointment.status,
                            'paid'
                          )
                        }
                        disabled={selectedAppointment.payment_status === 'paid'}
                        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Mark Paid
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            selectedAppointment.id,
                            selectedAppointment.status,
                            'pending'
                          )
                        }
                        disabled={selectedAppointment.payment_status === 'pending'}
                        className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Set Pending
                      </button>
                      <button
                        onClick={() =>
                          handleStatusUpdate(
                            selectedAppointment.id,
                            selectedAppointment.status,
                            'failed'
                          )
                        }
                        disabled={selectedAppointment.payment_status === 'failed'}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                      >
                        Mark Failed
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Metadata */}
              <div className="text-xs text-gray-500 pt-4 border-t border-gray-200">
                <p>
                  Created:{' '}
                  {new Date(selectedAppointment.created_at).toLocaleString('en-US', {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
                {selectedAppointment.updated_at !== selectedAppointment.created_at && (
                  <p>
                    Last Updated:{' '}
                    {new Date(selectedAppointment.updated_at).toLocaleString('en-US', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}