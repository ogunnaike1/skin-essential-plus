'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import type { Appointment } from '@/lib/supabase/appointments-api';
import {
  Calendar, Clock, Mail, Phone, User,
  Filter, Search, X, Loader2, CheckCircle2,
  Ban, RotateCcw, CreditCard, ChevronRight,
  CalendarOff, Plus, Trash2, ChevronDown, ChevronUp,
  CheckCheck, AlertTriangle,
} from 'lucide-react';
import { formatShopPrice } from '@/lib/shop-data';

// ── Types ──────────────────────────────────────────────────────
interface BlockedDate {
  id: string;
  date: string;
  reason?: string;
}

type StatusFilter  = 'all' | 'pending' | 'confirmed' | 'completed' | 'cancelled';
type PaymentFilter = 'all' | 'pending' | 'paid' | 'failed';

// ── Helpers ────────────────────────────────────────────────────
const STATUS_STYLES: Record<string, { pill: string; dot: string; label: string }> = {
  pending:   { pill: 'bg-amber-50 text-amber-600 border border-amber-200',    dot: 'bg-amber-400',  label: 'Pending'   },
  confirmed: { pill: 'bg-sage-tint text-sage border border-sage/20',          dot: 'bg-sage',       label: 'Confirmed' },
  completed: { pill: 'bg-deep-tint text-deep border border-deep/20',          dot: 'bg-deep',       label: 'Completed' },
  cancelled: { pill: 'bg-ivory border border-deep/15 text-deep/45',           dot: 'bg-deep/30',    label: 'Cancelled' },
};

const PAYMENT_STYLES: Record<string, { pill: string; label: string }> = {
  pending: { pill: 'bg-amber-50 text-amber-600 border border-amber-200', label: 'Unpaid'  },
  paid:    { pill: 'bg-sage-tint text-sage border border-sage/20',        label: 'Paid'    },
  failed:  { pill: 'bg-red-50 text-red-500 border border-red-200',        label: 'Failed'  },
};

function StatusPill({ status }: { status: string }) {
  const s = STATUS_STYLES[status] ?? STATUS_STYLES.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-medium ${s.pill}`}>
      <span className={`h-1.5 w-1.5 rounded-full shrink-0 ${s.dot}`} />
      {s.label}
    </span>
  );
}

function PaymentPill({ status }: { status: string }) {
  const s = PAYMENT_STYLES[status] ?? PAYMENT_STYLES.pending;
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${s.pill}`}>
      {s.label}
    </span>
  );
}

function AvatarInitial({ name, size = 'md' }: { name: string; size?: 'sm' | 'md' }) {
  const letter = name?.charAt(0)?.toUpperCase() ?? '?';
  const colors = ['bg-mauve/15 text-mauve', 'bg-sage/20 text-sage', 'bg-deep/10 text-deep'];
  const color = colors[name.charCodeAt(0) % colors.length];
  const dim = size === 'sm' ? 'h-8 w-8 text-xs' : 'h-10 w-10 text-sm';
  return (
    <div className={`${dim} ${color} rounded-full flex items-center justify-center shrink-0 font-display font-light`}>
      {letter}
    </div>
  );
}

const formatDate = (date: string) =>
  new Date(date + 'T12:00:00').toLocaleDateString('en-NG', {
    weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
  });

const formatTime = (time: string) =>
  new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
    hour: 'numeric', minute: '2-digit', hour12: true,
  });

const todayStr = () => new Date().toISOString().split('T')[0];

function getDateGroup(dateStr: string): 'today' | 'upcoming' | 'past' {
  const today = todayStr();
  if (dateStr === today) return 'today';
  return dateStr > today ? 'upcoming' : 'past';
}

// ── Page ───────────────────────────────────────────────────────
export default function AppointmentsPage() {
  const [appointments, setAppointments]     = useState<Appointment[]>([]);
  const [loading, setLoading]               = useState(true);
  const [searchTerm, setSearchTerm]         = useState('');
  const [statusFilter, setStatusFilter]     = useState<StatusFilter>('all');
  const [paymentFilter, setPaymentFilter]   = useState<PaymentFilter>('all');
  const [selectedApt, setSelectedApt]       = useState<Appointment | null>(null);
  const [updating, setUpdating]             = useState(false);
  const [deleteTarget, setDeleteTarget]     = useState<Appointment | null>(null);
  const [deleting, setDeleting]             = useState(false);

  // Blocked dates
  const [blockedDates, setBlockedDates]     = useState<BlockedDate[]>([]);
  const [blockedLoading, setBlockedLoading] = useState(true);
  const [blockPanelOpen, setBlockPanelOpen] = useState(false);
  const [newBlockDate, setNewBlockDate]     = useState('');
  const [newBlockReason, setNewBlockReason] = useState('');
  const [blockSaving, setBlockSaving]       = useState(false);
  const [blockError, setBlockError]         = useState('');

  // ── Data fetching ──────────────────────────────────────────
  const fetchAppointments = useCallback(async () => {
    setLoading(true);
    try {
      const res  = await fetch('/api/admin/appointments');
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setAppointments(json.appointments ?? []);
    } catch (err) {
      console.error('Error fetching appointments:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchBlockedDates = useCallback(async () => {
    try {
      const res  = await fetch('/api/admin/blocked-dates');
      const json = await res.json();
      setBlockedDates(json.dates ?? []);
    } catch {
      // silent
    } finally {
      setBlockedLoading(false);
    }
  }, []);

  useEffect(() => { fetchAppointments(); fetchBlockedDates(); }, [fetchAppointments, fetchBlockedDates]);

  // ── Computed values (no unnecessary re-renders) ────────────
  const stats = useMemo(() => ({
    total:     appointments.length,
    pending:   appointments.filter((a) => a.status === 'pending').length,
    confirmed: appointments.filter((a) => a.status === 'confirmed').length,
    completed: appointments.filter((a) => a.status === 'completed').length,
    revenue:   appointments
      .filter((a) => a.payment_status === 'paid')
      .reduce((s, a) => s + (a.service_price || 0), 0),
  }), [appointments]);

  const filtered = useMemo(() => {
    let list = [...appointments];
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      list = list.filter((a) =>
        a.customer_name.toLowerCase().includes(term) ||
        a.customer_email.toLowerCase().includes(term) ||
        (a.customer_phone ?? '').toLowerCase().includes(term) ||
        (a.service_name ?? '').toLowerCase().includes(term)
      );
    }
    if (statusFilter  !== 'all') list = list.filter((a) => a.status === statusFilter);
    if (paymentFilter !== 'all') list = list.filter((a) => a.payment_status === paymentFilter);
    return list.sort((a, b) => {
      const da = new Date(`${a.appointment_date}T${a.start_time}`).getTime();
      const db = new Date(`${b.appointment_date}T${b.start_time}`).getTime();
      return db - da;
    });
  }, [appointments, searchTerm, statusFilter, paymentFilter]);

  const grouped = useMemo(() => ({
    today:    filtered.filter((a) => getDateGroup(a.appointment_date) === 'today'),
    upcoming: filtered.filter((a) => getDateGroup(a.appointment_date) === 'upcoming'),
    past:     filtered.filter((a) => getDateGroup(a.appointment_date) === 'past'),
  }), [filtered]);

  // ── Appointment actions ────────────────────────────────────
  const handleStatusUpdate = useCallback(async (
    id: string,
    status: string,
    paymentStatus?: string
  ) => {
    setUpdating(true);
    try {
      const updates: Record<string, string> = { status };
      if (paymentStatus) updates.payment_status = paymentStatus;
      const res  = await fetch('/api/admin/appointments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, updates }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setAppointments((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...json.appointment } : a))
      );
      setSelectedApt((prev) => (prev?.id === id ? { ...prev, ...json.appointment } : prev));
    } catch (err) {
      console.error('Error updating appointment:', err);
    } finally {
      setUpdating(false);
    }
  }, []);

  const handleQuickComplete = useCallback((id: string) => {
    handleStatusUpdate(id, 'completed');
  }, [handleStatusUpdate]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/admin/appointments/${deleteTarget.id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setAppointments((prev) => prev.filter((a) => a.id !== deleteTarget.id));
      if (selectedApt?.id === deleteTarget.id) setSelectedApt(null);
      setDeleteTarget(null);
    } catch {
      console.error('Delete failed');
    } finally {
      setDeleting(false);
    }
  }, [deleteTarget, selectedApt]);

  // ── Blocked dates actions ──────────────────────────────────
  const handleAddBlockedDate = useCallback(async () => {
    if (!newBlockDate) return;
    setBlockSaving(true);
    setBlockError('');
    try {
      const res  = await fetch('/api/admin/blocked-dates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ date: newBlockDate, reason: newBlockReason || null }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? 'Failed');
      setBlockedDates((prev) => [...prev, json.date].sort((a, b) => a.date.localeCompare(b.date)));
      setNewBlockDate('');
      setNewBlockReason('');
    } catch (err: any) {
      setBlockError(err.message ?? 'Could not block this date.');
    } finally {
      setBlockSaving(false);
    }
  }, [newBlockDate, newBlockReason]);

  const handleRemoveBlockedDate = useCallback(async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blocked-dates/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setBlockedDates((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setBlockError('Could not remove this date.');
    }
  }, []);

  // ── Render helpers ─────────────────────────────────────────
  const hasFilters = searchTerm || statusFilter !== 'all' || paymentFilter !== 'all';

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-6xl">

      {/* Page header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl lg:text-4xl font-light text-deep">Appointments</h1>
          <p className="text-sm text-deep/50 mt-1">Manage customer bookings and schedules</p>
        </div>
        <div className="text-right shrink-0">
          <p className="font-display text-2xl font-light text-deep">{stats.total}</p>
          <p className="text-[11px] text-deep/40 uppercase tracking-wider">Total</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        {[
          { label: 'Pending',   value: stats.pending,   cls: 'bg-amber-50 border-amber-200 text-amber-600'    },
          { label: 'Confirmed', value: stats.confirmed, cls: 'bg-sage-tint border-sage/20 text-sage'          },
          { label: 'Completed', value: stats.completed, cls: 'bg-deep-tint border-deep/15 text-deep'          },
        ].map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => setStatusFilter(s.label.toLowerCase() as StatusFilter)}
            className={`rounded-2xl border p-4 text-left transition-opacity hover:opacity-80 ${s.cls} ${statusFilter === s.label.toLowerCase() ? 'ring-2 ring-offset-1 ring-current' : ''}`}
          >
            <p className="text-[10px] uppercase tracking-wider opacity-60 mb-1">{s.label}</p>
            <p className="font-display text-3xl font-light">{s.value}</p>
          </button>
        ))}
        <div className="rounded-2xl border bg-deep-tint border-deep/15 p-4">
          <p className="text-[10px] uppercase tracking-wider text-deep/50 mb-1">All</p>
          <p className="font-display text-3xl font-light text-deep">{stats.total}</p>
        </div>
        <div className="rounded-2xl border bg-mauve border-mauve/30 p-4 text-ivory sm:col-span-1 col-span-2">
          <p className="text-[10px] uppercase tracking-wider opacity-70 mb-1">Revenue</p>
          <p className="font-display text-2xl font-light leading-tight">{formatShopPrice(stats.revenue)}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/35 pointer-events-none" />
          <input
            type="text"
            placeholder="Search name, email, phone or service..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full h-11 pl-11 pr-10 rounded-full border-2 border-deep/10 bg-white text-sm text-deep placeholder:text-deep/35 focus:border-mauve focus:outline-none transition-colors"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-deep/5"
            >
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

        {hasFilters && (
          <button
            onClick={() => { setSearchTerm(''); setStatusFilter('all'); setPaymentFilter('all'); }}
            className="h-11 px-4 rounded-full border-2 border-deep/10 bg-white text-sm text-deep/50 hover:text-deep hover:border-deep/25 transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <X className="h-3.5 w-3.5" />
            Clear
          </button>
        )}
      </div>

      {/* Appointment list */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 rounded-2xl border-2 border-deep/10 bg-ivory">
          <Loader2 className="h-8 w-8 animate-spin text-mauve" />
          <p className="text-sm text-deep/40 font-light">Loading appointments…</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-3 rounded-2xl border-2 border-deep/10 bg-ivory">
          <div className="h-12 w-12 rounded-full bg-mauve-tint flex items-center justify-center">
            <Calendar className="h-5 w-5 text-mauve" />
          </div>
          <p className="text-sm text-deep/50 font-light">
            {hasFilters ? 'No appointments match your filters' : 'No appointments yet'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {(
            [
              { key: 'today',    label: 'Today',    items: grouped.today    },
              { key: 'upcoming', label: 'Upcoming', items: grouped.upcoming },
              { key: 'past',     label: 'Past',     items: grouped.past     },
            ] as const
          ).filter((g) => g.items.length > 0).map((group) => (
            <div key={group.key}>
              <div className="flex items-center gap-3 mb-3">
                <span className="text-[11px] uppercase tracking-[0.15em] font-medium text-deep/40">
                  {group.label}
                </span>
                <span className="h-px flex-1 bg-deep/8" />
                <span className="text-[11px] text-deep/30">{group.items.length}</span>
              </div>

              <div className="rounded-2xl border-2 border-deep/10 bg-ivory overflow-hidden divide-y divide-deep/5">
                {group.items.map((apt) => (
                  <AppointmentRow
                    key={apt.id}
                    apt={apt}
                    onOpen={() => setSelectedApt(apt)}
                    onComplete={() => handleQuickComplete(apt.id)}
                    onDelete={() => setDeleteTarget(apt)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Blocked dates panel */}
      <div className="rounded-2xl border-2 border-deep/10 bg-ivory overflow-hidden">
        <button
          onClick={() => setBlockPanelOpen((v) => !v)}
          className="w-full flex items-center justify-between px-5 py-4 hover:bg-mauve-tint/20 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-mauve-tint flex items-center justify-center">
              <CalendarOff className="h-4 w-4 text-mauve" strokeWidth={1.5} />
            </div>
            <div className="text-left">
              <p className="text-sm font-medium text-deep">Block Unavailable Dates</p>
              <p className="text-[11px] text-deep/40 font-light">
                {blockedLoading ? 'Loading…' : `${blockedDates.length} date${blockedDates.length !== 1 ? 's' : ''} blocked`}
              </p>
            </div>
          </div>
          {blockPanelOpen
            ? <ChevronUp className="h-4 w-4 text-deep/40" strokeWidth={1.5} />
            : <ChevronDown className="h-4 w-4 text-deep/40" strokeWidth={1.5} />}
        </button>

        {blockPanelOpen && (
          <div className="border-t border-deep/10 px-5 py-5 space-y-5">
            <div className="space-y-3">
              <p className="text-[11px] uppercase tracking-wider text-deep/40">Block a date</p>
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
                  {blockSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                  Block Date
                </button>
              </div>
              {blockError && <p className="text-xs text-red-500">{blockError}</p>}
            </div>

            <div className="space-y-2">
              <p className="text-[11px] uppercase tracking-wider text-deep/40">Blocked dates</p>
              {blockedLoading ? (
                <div className="flex items-center gap-2 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-mauve" />
                  <span className="text-sm text-deep/40">Loading…</span>
                </div>
              ) : blockedDates.length === 0 ? (
                <p className="text-sm text-deep/35 font-light py-4 text-center border-2 border-dashed border-deep/10 rounded-xl">
                  No dates blocked — you're available every open day
                </p>
              ) : (
                <div className="space-y-2">
                  {blockedDates.map((bd) => (
                    <div key={bd.id} className="flex items-center justify-between px-4 py-3 rounded-xl bg-mauve-tint/40 border border-mauve/10">
                      <div className="flex items-center gap-3">
                        <CalendarOff className="h-4 w-4 text-mauve/50 shrink-0" strokeWidth={1.5} />
                        <div>
                          <p className="text-sm font-medium text-deep">
                            {new Date(bd.date + 'T12:00:00').toLocaleDateString('en-NG', {
                              weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
                            })}
                          </p>
                          {bd.reason && <p className="text-[11px] text-deep/45">{bd.reason}</p>}
                        </div>
                      </div>
                      <button
                        onClick={() => handleRemoveBlockedDate(bd.id)}
                        className="h-8 w-8 rounded-full flex items-center justify-center text-deep/25 hover:text-red-500 hover:bg-red-50 transition-all"
                        title="Unblock this date"
                      >
                        <X className="h-3.5 w-3.5" strokeWidth={2} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedApt && (
        <DetailModal
          apt={selectedApt}
          updating={updating}
          onClose={() => setSelectedApt(null)}
          onStatusUpdate={handleStatusUpdate}
          onDelete={() => { setDeleteTarget(selectedApt); setSelectedApt(null); }}
        />
      )}

      {/* Delete confirmation */}
      {deleteTarget && (
        <DeleteModal
          apt={deleteTarget}
          deleting={deleting}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}

// ── Appointment row ────────────────────────────────────────────
function AppointmentRow({
  apt,
  onOpen,
  onComplete,
  onDelete,
}: {
  apt: Appointment;
  onOpen: () => void;
  onComplete: () => void;
  onDelete: () => void;
}) {
  const canComplete = apt.status !== 'completed' && apt.status !== 'cancelled';

  return (
    <div className="flex items-center gap-3 px-4 py-3.5 hover:bg-mauve-tint/15 transition-colors group">
      {/* Avatar */}
      <AvatarInitial name={apt.customer_name} />

      {/* Main info — clickable */}
      <button
        type="button"
        onClick={onOpen}
        className="flex-1 min-w-0 text-left"
      >
        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 mb-0.5">
          <span className="font-medium text-deep text-sm">{apt.customer_name}</span>
          <StatusPill status={apt.status} />
          {apt.payment_status && <PaymentPill status={apt.payment_status} />}
        </div>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-deep/40">
          <span className="truncate max-w-[180px]">{apt.service_name}</span>
          <span className="flex items-center gap-1">
            <Calendar className="h-3 w-3" strokeWidth={1.5} />
            {formatDate(apt.appointment_date)}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" strokeWidth={1.5} />
            {formatTime(apt.start_time)}
          </span>
        </div>
      </button>

      {/* Price */}
      <span className="hidden sm:block font-display text-base font-light text-mauve shrink-0">
        {formatShopPrice(apt.service_price || 0)}
      </span>

      {/* Quick actions */}
      <div className="flex items-center gap-1 shrink-0">
        {canComplete && (
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onComplete(); }}
            title="Mark as complete"
            className="h-8 w-8 rounded-full bg-sage/10 text-sage hover:bg-sage hover:text-ivory transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
          >
            <CheckCheck className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        )}
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); onDelete(); }}
          title="Delete appointment"
          className="h-8 w-8 rounded-full text-deep/25 hover:bg-red-50 hover:text-red-500 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100"
        >
          <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
        </button>
        <ChevronRight
          className="h-4 w-4 text-deep/20 group-hover:text-mauve transition-colors ml-1 cursor-pointer"
          onClick={onOpen}
          strokeWidth={1.5}
        />
      </div>
    </div>
  );
}

// ── Detail modal ───────────────────────────────────────────────
function DetailModal({
  apt,
  updating,
  onClose,
  onStatusUpdate,
  onDelete,
}: {
  apt: Appointment;
  updating: boolean;
  onClose: () => void;
  onStatusUpdate: (id: string, status: string, payment?: string) => void;
  onDelete: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="relative bg-ivory rounded-3xl w-full max-w-xl max-h-[92vh] overflow-hidden shadow-2xl flex flex-col">

        {/* Header */}
        <div className="bg-gradient-to-r from-mauve to-sage px-6 py-5 flex items-start justify-between shrink-0">
          <div>
            <p className="text-ivory/55 text-[11px] uppercase tracking-wider mb-0.5">Appointment Details</p>
            <h2 className="font-display text-xl font-light text-ivory">{apt.customer_name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={onDelete}
              className="p-2 rounded-full bg-white/10 text-ivory/70 hover:bg-red-500/80 hover:text-ivory transition-colors"
              title="Delete appointment"
            >
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-ivory/10 text-ivory hover:bg-ivory/20 transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1 p-5 space-y-4">

          {/* Service summary */}
          <div className="rounded-2xl bg-white border border-deep/8 p-5">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 pb-3 border-b border-deep/6">
                <p className="text-[10px] uppercase tracking-wider text-deep/35 mb-1">Service</p>
                <p className="font-medium text-deep">{apt.service_name}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-deep/35 mb-1">Date</p>
                <p className="text-sm font-medium text-deep">{formatDate(apt.appointment_date)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-deep/35 mb-1">Time</p>
                <p className="text-sm font-medium text-deep">{formatTime(apt.start_time)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-deep/35 mb-1">Amount</p>
                <p className="font-display text-2xl font-light text-mauve">{formatShopPrice(apt.service_price || 0)}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider text-deep/35 mb-2">Current Status</p>
                <div className="flex flex-wrap gap-1.5">
                  <StatusPill status={apt.status} />
                  {apt.payment_status && <PaymentPill status={apt.payment_status} />}
                </div>
              </div>
              {apt.notes && (
                <div className="col-span-2 pt-3 border-t border-deep/6">
                  <p className="text-[10px] uppercase tracking-wider text-deep/35 mb-1">Notes</p>
                  <p className="text-sm text-deep/65 leading-relaxed">{apt.notes}</p>
                </div>
              )}
            </div>
          </div>

          {/* Customer */}
          <div className="rounded-2xl bg-white border border-deep/8 p-5 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-deep/35">Customer</p>
            <div className="flex items-center gap-3">
              <AvatarInitial name={apt.customer_name} size="sm" />
              <p className="font-medium text-deep text-sm">{apt.customer_name}</p>
            </div>
            <a href={`mailto:${apt.customer_email}`} className="flex items-center gap-3 group">
              <Mail className="h-4 w-4 text-deep/30 shrink-0" strokeWidth={1.5} />
              <span className="text-sm text-deep/60 group-hover:text-mauve transition-colors">{apt.customer_email}</span>
            </a>
            {apt.customer_phone && (
              <a href={`tel:${apt.customer_phone}`} className="flex items-center gap-3 group">
                <Phone className="h-4 w-4 text-deep/30 shrink-0" strokeWidth={1.5} />
                <span className="text-sm text-deep/60 group-hover:text-mauve transition-colors">{apt.customer_phone}</span>
              </a>
            )}
          </div>

          {/* Update appointment status */}
          <div className="rounded-2xl bg-white border border-deep/8 p-5 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-deep/35">Update Status</p>
            <div className="grid grid-cols-2 gap-2">
              {([
                { status: 'confirmed', label: 'Confirm',     Icon: CheckCircle2, active: 'bg-sage text-ivory',    idle: 'bg-sage-tint text-sage border border-sage/20'      },
                { status: 'completed', label: 'Complete',    Icon: CheckCheck,   active: 'bg-deep text-ivory',    idle: 'bg-deep-tint text-deep border border-deep/15'      },
                { status: 'pending',   label: 'Set Pending', Icon: RotateCcw,    active: 'bg-amber-400 text-white', idle: 'bg-amber-50 text-amber-600 border border-amber-200' },
                { status: 'cancelled', label: 'Cancel',      Icon: Ban,          active: 'bg-red-500 text-white', idle: 'bg-ivory text-deep/45 border border-deep/15'       },
              ] as const).map(({ status, label, Icon, active, idle }) => {
                const isCurrent = apt.status === status;
                return (
                  <button
                    key={status}
                    onClick={() => onStatusUpdate(apt.id, status)}
                    disabled={isCurrent || updating}
                    className={`h-10 rounded-xl text-xs font-medium flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isCurrent ? active : idle}`}
                  >
                    <Icon className="h-3.5 w-3.5" strokeWidth={1.5} />
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Update payment status */}
          <div className="rounded-2xl bg-white border border-deep/8 p-5 space-y-3">
            <p className="text-[10px] uppercase tracking-wider text-deep/35">Update Payment</p>
            <div className="grid grid-cols-3 gap-2">
              {([
                { status: 'paid',    label: 'Mark Paid',   active: 'bg-sage text-ivory',         idle: 'bg-sage-tint text-sage border border-sage/20'     },
                { status: 'pending', label: 'Set Unpaid',  active: 'bg-amber-400 text-white',     idle: 'bg-amber-50 text-amber-600 border border-amber-200' },
                { status: 'failed',  label: 'Mark Failed', active: 'bg-red-500 text-white',       idle: 'bg-red-50 text-red-500 border border-red-200'       },
              ] as const).map(({ status, label, active, idle }) => {
                const isCurrent = apt.payment_status === status;
                return (
                  <button
                    key={status}
                    onClick={() => onStatusUpdate(apt.id, apt.status, status)}
                    disabled={isCurrent || updating}
                    className={`h-10 rounded-xl text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${isCurrent ? active : idle}`}
                  >
                    {label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Timestamps */}
          <div className="text-[11px] text-deep/25 space-y-0.5 pb-1">
            <p>Created: {new Date(apt.created_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            {apt.updated_at !== apt.created_at && (
              <p>Updated: {new Date(apt.updated_at).toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' })}</p>
            )}
          </div>
        </div>

        {updating && (
          <div className="absolute inset-0 bg-ivory/70 backdrop-blur-sm flex items-center justify-center rounded-3xl z-10">
            <Loader2 className="h-8 w-8 animate-spin text-mauve" />
          </div>
        )}
      </div>
    </div>
  );
}

// ── Delete confirmation modal ──────────────────────────────────
function DeleteModal({
  apt,
  deleting,
  onConfirm,
  onCancel,
}: {
  apt: Appointment;
  deleting: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-ivory rounded-3xl w-full max-w-sm shadow-2xl p-6 space-y-5">
        <div className="flex items-start gap-4">
          <div className="h-10 w-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
            <AlertTriangle className="h-5 w-5 text-red-500" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="font-display text-lg font-light text-deep">Delete Appointment?</h3>
            <p className="text-sm text-deep/55 mt-1 leading-relaxed">
              This will permanently delete the appointment for{' '}
              <strong className="text-deep font-medium">{apt.customer_name}</strong>
              {' '}({apt.service_name} on {formatDate(apt.appointment_date)}). This cannot be undone.
            </p>
          </div>
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="flex-1 h-11 rounded-full border-2 border-deep/10 text-sm text-deep hover:bg-deep/5 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={deleting}
            className="flex-1 h-11 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {deleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" strokeWidth={1.5} />
            )}
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
