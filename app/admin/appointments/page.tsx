'use client';

import { useState, useEffect } from 'react';
import type { Appointment } from '@/lib/supabase/appointments-api';
import {
  Calendar, Clock, Mail, Phone, User,
  Filter, Search, X, Loader2, CheckCircle2,
  Ban, RotateCcw, CreditCard, ChevronRight,
  CalendarOff, Plus, Trash2, ChevronDown, ChevronUp,
} from 'lucide-react';
import { formatShopPrice } from '@/lib/shop-data';

interface BlockedDate {
  id: string;
  date: string;
  reason?: string;
}

type StatusFilter = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
type PaymentFilter = 'all' | 'pending' | 'paid' | 'failed';

// ── Badge helpers ──────────────────────────────────────────────
const STATUS_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
  pending:   { pill: 'bg-mauve-tint text-mauve border border-mauve/20',   dot: 'bg-mauve',   label: 'Pending'   },
  confirmed: { pill: 'bg-sage-tint text-sage border border-sage/20',      dot: 'bg-sage',    label: 'Confirmed' },
  completed: { pill: 'bg-deep-tint text-deep border border-deep/20',      dot: 'bg-deep',    label: 'Completed' },
  cancelled: { pill: 'bg-ivory border border-deep/15 text-deep/45',       dot: 'bg-deep/30', label: 'Cancelled' },
};

const PAYMENT_STYLES: Record<string, { pill: string; label: string }> = {
  pending: { pill: 'bg-mauve-tint text-mauve border border-mauve/20', label: 'Unpaid'  },
  paid:    { pill: 'bg-sage-tint text-sage border border-sage/20',    label: 'Paid'    },
  failed:  { pill: 'bg-deep-tint text-deep/65 border border-deep/15', label: 'Failed'  },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES['pending'];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  );
}

function PaymentPill({ status }: { status: string }) {
  const s = PAYMENT_STYLES[status] ?? PAYMENT_STYLES['pending'];
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${s.pill}`}>
      {s.label}
    </span>
  );
}

const formatDate = (date: string) =>
  new Date(date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });

const formatTime = (time: string) =>
  new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });

// ── Page ───────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [paymentFilter, setPaymentFilter] = useState<PaymentFilter>('all');
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [updating, setUpdating] = useState(false);

  // Blocked dates
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [blockedLoading, setBlockedLoading] = useState(true);
  const [blockPanelOpen, setBlockPanelOpen] = useState(false);
  const [newBlockDate, setNewBlockDate] = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');
  const [blockSaving, setBlockSaving] = useState(false);
  const [blockError, setBlockError] = useState('');

  useEffect(() => { fetchAppointments(); fetchBlockedDates(); }, []);
  useEffect(() => { filterAppointments(); }, [appointments, searchTerm, statusFilter, paymentFilter]);

  const fetchBlockedDates = async () => {
    try {
      const res = await fetch('/api/admin/blocked-dates');
      const json = await res.json();
      setBlockedDates(json.dates ?? []);
    } catch {
      // silently ignore
    } finally {
      setBlockedLoading(false);
    }
  };

  const handleAddBlockedDate = async () => {
    if (!newBlockDate) return;
    setBlockSaving(true);
    setBlockError('');
    try {
      const res = await fetch('/api/admin/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newBlockDate, reason: newBlockReason || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed');
      setBlockedDates((prev) =>
        [...prev, json.date].sort((a, b) => a.date.localeCompare(b.date))
      );
      setNewBlockDate('');
      setNewBlockReason('');
    } catch (err: any) {
      setBlockError(err.message ?? 'Could not block this date. It may already be blocked.');
    } finally {
      setBlockSaving(false);
    }
  };

  const handleRemoveBlockedDate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blocked-dates/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setBlockedDates((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setBlockError('Could not remove this date. Please try again.');
    }
  };

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
    if (statusFilter !== 'all') filtered = filtered.filter((apt) => apt.status === statusFilter);
    if (paymentFilter !== 'all') filtered = filtered.filter((apt) => apt.payment_status === paymentFilter);
    filtered.sort((a, b) => {
      const dateA = new Date(`${a.appointment_date}T${a.start_time}`);
      const dateB = new Date(`${b.appointment_date}T${b.start_time}`);
      return dateB.getTime() - dateA.getTime();
    });
    setFilteredAppointments(filtered);
  };

  const handleStatusUpdate = async (id: string, status: string, paymentStatus?: string) => {
    setUpdating(true);
    try {
      const updates: Partial<Appointment> = { status: status as Appointment['status'] };
      if (paymentStatus) updates.payment_status = paymentStatus as Appointment['payment_status'];
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
    } finally {
      setUpdating(false);
    }
  };

  const stats = {
    total:     appointments.length,
    pending:   appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    revenue:   appointments.filter((a) => a.payment_status === 'paid').reduce((s, a) => s + (a.service_price || 0), 0),
  };

  return (
    <div className="p-6 lg:p-8 space-y-6">
      {/* Page header */}
      <div>
        <h1 className="font-display text-3xl lg:text-4xl font-light text-deep mb-1">Appointments</h1>
        <p className="text-sm text-deep/50">Manage customer bookings and schedules</p>
      </div>

      {/* ── Block Dates Panel ──────────────────────────────────── */}
      <div className="rounded-2xl border-2 border-deep/10 bg-ivory overflow-hidden">
        {/* Header toggle */}
        <button
          onClick={() => setBlockPanelOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-mauve-tint/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-mauve-tint flex items-center justify-center shrink-0">
              <CalendarOff className="h-4 w-4 text-mauve" strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-deep">Block Unavailable Dates</p>
              <p className="text-[11px] text-deep/45 font-light">
                {blockedLoading ? 'Loading…' : `${blockedDates.length} date${blockedDates.length === 1 ? '' : 's'} blocked`}
              </p>
            </div>
          </div>
          {blockPanelOpen
            ? <ChevronUp className="h-4 w-4 text-deep/40" strokeWidth={1.5} />
            : <ChevronDown className="h-4 w-4 text-deep/40" strokeWidth={1.5} />}
        </button>

        {blockPanelOpen && (
          <div className="border-t border-deep/10 px-5 py-5 space-y-5">

            {/* Add new date */}
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-wider text-deep/40 font-light">Block a date</p>
              <div className="flex flex-wrap gap-2">
                <input
                  type="date"
                  value={newBlockDate}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => { setNewBlockDate(e.target.value); setBlockError(''); }}
                  className="h-10 px-3 rounded-xl border-2 border-deep/10 bg-white text-sm text-deep focus:border-mauve focus:outline-none"
                />
                <input
                  type="text"
                  placeholder="Reason (optional)"
                  value={newBlockReason}
                  onChange={(e) => setNewBlockReason(e.target.value)}
                  className="flex-1 min-w-[160px] h-10 px-3 rounded-xl border-2 border-deep/10 bg-white text-sm text-deep placeholder:text-deep/30 focus:border-mauve focus:outline-none"
                />
                <button
                  onClick={handleAddBlockedDate}
                  disabled={!newBlockDate || blockSaving}
                  className="h-10 px-5 rounded-xl bg-mauve text-ivory text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-40"
                >
                  {blockSaving
                    ? <Loader2 className="h-4 w-4 animate-spin" />
                    : <Plus className="h-4 w-4" strokeWidth={2} />}
                  Block Date
                </button>
              </div>
              {blockError && (
                <p className="text-[12px] text-red-500">{blockError}</p>
              )}
            </div>

            {/* Blocked dates list */}
            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-deep/40 font-light">Blocked dates</p>

              {blockedLoading ? (
                <div className="flex items-center gap-2 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-mauve" />
                  <span className="text-sm text-deep/40">Loading…</span>
                </div>
              ) : blockedDates.length === 0 ? (
                <p className="text-sm text-deep/35 font-light py-3 text-center border-2 border-dashed border-deep/10 rounded-xl">
                  No dates blocked — you're available every open day
                </p>
              ) : (
                <div className="space-y-2">
                  {blockedDates.map((bd) => (
                    <div
                      key={bd.id}
                      className="flex items-center justify-between px-4 py-3 rounded-xl bg-mauve-tint/50 border border-mauve/15"
                    >
                      <div className="flex items-center gap-3">
                        <CalendarOff className="h-4 w-4 text-mauve/60 shrink-0" strokeWidth={1.5} />
                        <div>
                          <p className="text-sm font-medium text-deep">
                            {new Date(bd.date + 'T12:00:00').toLocaleDateString('en-NG', {
                              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                            })}
                          </p>
                          {bd.reason && (
                            <p className="text-[11px] text-deep/45 font-light">{bd.reason}</p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveBlockedDate(bd.id)}
                        className="h-8 w-8 rounded-full flex items-center justify-center text-deep/25 hover:text-mauve hover:bg-white transition-all shrink-0"
                        title="Unblock this date"
                      >
                        <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
        {[
          { label: 'Total',     value: stats.total,     cls: 'bg-deep-tint border-deep/15 text-deep'   },
          { label: 'Pending',   value: stats.pending,   cls: 'bg-mauve-tint border-mauve/20 text-mauve' },
          { label: 'Confirmed', value: stats.confirmed, cls: 'bg-sage-tint border-sage/20 text-sage'   },
          { label: 'Completed', value: stats.completed, cls: 'bg-deep-tint border-deep/15 text-deep'   },
        ].map((s) => (
          <div key={s.label} className={`rounded-2xl border p-4 ${s.cls}`}>
            <p className="text-xs uppercase tracking-wider opacity-60 mb-1">{s.label}</p>
            <p className="font-display text-3xl font-light">{s.value}</p>
          </div>
        ))}
        <div className="rounded-2xl border bg-mauve border-mauve/30 p-4 text-ivory">
          <p className="text-xs uppercase tracking-wider opacity-70 mb-1">Revenue</p>
          <p className="font-display text-2xl font-light leading-tight">{formatShopPrice(stats.revenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/35" />
          <input
            type="text"
            placeholder="Search by name, email, phone or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-11 pr-10 rounded-full border-2 border-deep/10 bg-white text-sm text-deep placeholder:text-deep/35 focus:border-mauve focus:outline-none transition-colors"
          />
          {searchTerm && (
            <button onClick={() => setSearchTerm('')} className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-deep/5 transition-colors">
              <X className="h-4 w-4 text-deep/40" />
            </button>
          )}
        </div>
        <div className="relative">
          <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/35 pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            className="h-11 pl-11 pr-8 rounded-full border-2 border-deep/10 bg-white text-sm text-deep focus:border-mauve focus:outline-none appearance-none transition-colors"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div className="relative">
          <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/35 pointer-events-none" />
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value as PaymentFilter)}
            className="h-11 pl-11 pr-8 rounded-full border-2 border-deep/10 bg-white text-sm text-deep focus:border-mauve focus:outline-none appearance-none transition-colors"
          >
            <option value="all">All Payments</option>
            <option value="pending">Unpaid</option>
            <option value="paid">Paid</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {/* List */}
      <div className="rounded-2xl border-2 border-deep/10 bg-ivory overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-mauve" />
            <p className="text-sm text-deep/40 font-light">Loading appointments...</p>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3">
            <div className="h-12 w-12 rounded-full bg-mauve-tint flex items-center justify-center">
              <Calendar className="h-5 w-5 text-mauve" />
            </div>
            <p className="text-sm text-deep/50 font-light">
              {searchTerm || statusFilter !== 'all' || paymentFilter !== 'all'
                ? 'No appointments match your filters'
                : 'No appointments yet'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-deep/5">
            {filteredAppointments.map((apt) => (
              <button
                key={apt.id}
                type="button"
                onClick={() => setSelectedAppointment(apt)}
                className="w-full text-left px-5 py-4 hover:bg-mauve-tint/20 transition-colors group"
              >
                <div className="flex items-center gap-4">
                  {/* Avatar */}
                  <div className="shrink-0 h-9 w-9 rounded-full bg-mauve/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-mauve" strokeWidth={1.5} />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="font-medium text-deep text-sm">{apt.customer_name}</span>
                      <StatusPill status={apt.status} />
                      {apt.payment_status && <PaymentPill status={apt.payment_status} />}
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 text-xs text-deep/40">
                      <span className="truncate max-w-[140px]">{apt.service_name}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(apt.appointment_date)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(apt.start_time)}
                      </span>
                    </div>
                  </div>

                  {/* Price + chevron */}
                  <div className="shrink-0 flex items-center gap-2">
                    <span className="font-display text-lg font-light text-mauve">
                      {formatShopPrice(apt.service_price || 0)}
                    </span>
                    <ChevronRight className="h-4 w-4 text-deep/20 group-hover:text-mauve transition-colors" />
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-ivory rounded-3xl w-full max-w-xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">

            {/* Header */}
            <div className="bg-gradient-to-r from-mauve to-sage px-6 py-5 flex items-start justify-between shrink-0">
              <div>
                <p className="text-ivory/55 text-[11px] uppercase tracking-wider mb-0.5">Appointment Details</p>
                <h2 className="font-display text-xl font-light text-ivory">{selectedAppointment.customer_name}</h2>
              </div>
              <button
                onClick={() => setSelectedAppointment(null)}
                className="mt-0.5 p-2 rounded-full bg-ivory/10 text-ivory hover:bg-ivory/20 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Scrollable body */}
            <div className="overflow-y-auto flex-1 p-5 space-y-4">

              {/* Service summary card */}
              <div className="rounded-2xl bg-white border border-deep/8 p-5">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2 pb-3 border-b border-deep/6">
                    <p className="text-[10px] uppercase tracking-wider text-deep/35 mb-1">Service</p>
                    <p className="font-medium text-deep">{selectedAppointment.service_name}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-deep/35 mb-1">Date</p>
                    <p className="text-sm font-medium text-deep">{formatDate(selectedAppointment.appointment_date)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-deep/35 mb-1">Time</p>
                    <p className="text-sm font-medium text-deep">{formatTime(selectedAppointment.start_time)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-deep/35 mb-1">Amount</p>
                    <p className="font-display text-2xl font-light text-mauve">{formatShopPrice(selectedAppointment.service_price || 0)}</p>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-wider text-deep/35 mb-2">Status</p>
                    <div className="flex flex-wrap gap-1.5">
                      <StatusPill status={selectedAppointment.status} />
                      {selectedAppointment.payment_status && <PaymentPill status={selectedAppointment.payment_status} />}
                    </div>
                  </div>
                  {selectedAppointment.notes && (
                    <div className="col-span-2 pt-3 border-t border-deep/6">
                      <p className="text-[10px] uppercase tracking-wider text-deep/35 mb-1">Notes</p>
                      <p className="text-sm text-deep/65 leading-relaxed">{selectedAppointment.notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Customer card */}
              <div className="rounded-2xl bg-white border border-deep/8 p-5 space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-deep/35">Customer</p>
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-mauve/10 flex items-center justify-center shrink-0">
                    <User className="h-4 w-4 text-mauve" strokeWidth={1.5} />
                  </div>
                  <p className="font-medium text-deep text-sm">{selectedAppointment.customer_name}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-deep/30 shrink-0" strokeWidth={1.5} />
                  <span className="text-sm text-deep/60">{selectedAppointment.customer_email}</span>
                </div>
                {selectedAppointment.customer_phone && (
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-deep/30 shrink-0" strokeWidth={1.5} />
                    <span className="text-sm text-deep/60">{selectedAppointment.customer_phone}</span>
                  </div>
                )}
              </div>

              {/* Appointment status */}
              <div className="rounded-2xl bg-white border border-deep/8 p-5 space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-deep/35">Update Appointment</p>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { status: 'confirmed', label: 'Confirm',     Icon: CheckCircle2, active: 'bg-sage text-ivory',    idle: 'bg-sage-tint text-sage border border-sage/20'       },
                    { status: 'completed', label: 'Complete',    Icon: CheckCircle2, active: 'bg-deep text-ivory',    idle: 'bg-deep-tint text-deep border border-deep/15'       },
                    { status: 'pending',   label: 'Set Pending', Icon: RotateCcw,    active: 'bg-mauve text-ivory',   idle: 'bg-mauve-tint text-mauve border border-mauve/20'    },
                    { status: 'cancelled', label: 'Cancel',      Icon: Ban,          active: 'bg-deep/60 text-ivory', idle: 'bg-ivory text-deep/45 border border-deep/15'        },
                  ].map(({ status, label, Icon, active, idle }) => {
                    const isCurrent = selectedAppointment.status === status;
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedAppointment.id, status)}
                        disabled={isCurrent || updating}
                        className={`h-10 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isCurrent ? active : idle}`}
                      >
                        <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Payment status */}
              <div className="rounded-2xl bg-white border border-deep/8 p-5 space-y-3">
                <p className="text-[10px] uppercase tracking-wider text-deep/35">Update Payment</p>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { status: 'paid',    label: 'Mark Paid',   active: 'bg-sage text-ivory',      idle: 'bg-sage-tint text-sage border border-sage/20'     },
                    { status: 'pending', label: 'Set Pending', active: 'bg-mauve text-ivory',     idle: 'bg-mauve-tint text-mauve border border-mauve/20'  },
                    { status: 'failed',  label: 'Mark Failed', active: 'bg-deep/60 text-ivory',   idle: 'bg-deep-tint text-deep/55 border border-deep/15'  },
                  ].map(({ status, label, active, idle }) => {
                    const isCurrent = selectedAppointment.payment_status === status;
                    return (
                      <button
                        key={status}
                        onClick={() => handleStatusUpdate(selectedAppointment.id, selectedAppointment.status, status)}
                        disabled={isCurrent || updating}
                        className={`h-10 rounded-xl text-xs font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${isCurrent ? active : idle}`}
                      >
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Timestamps */}
              <div className="text-[11px] text-deep/30 space-y-0.5 pb-1">
                <p>Created: {new Date(selectedAppointment.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                {selectedAppointment.updated_at !== selectedAppointment.created_at && (
                  <p>Updated: {new Date(selectedAppointment.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                )}
              </div>
            </div>

            {/* Updating overlay */}
            {updating && (
              <div className="absolute inset-0 bg-ivory/70 backdrop-blur-sm flex items-center justify-center rounded-3xl z-10">
                <Loader2 className="h-8 w-8 animate-spin text-mauve" />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
