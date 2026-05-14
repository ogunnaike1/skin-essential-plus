"use client";

import { useState, useEffect } from "react";

import {
  Store,
  Mail,
  CreditCard,
  Image as ImageIcon,
  Bell,
  Save,
  Loader2,
  Check,
  MapPin,
  Phone,
  Globe,
  Instagram,
  Facebook,
  Twitter,
  Upload,
  Calendar,
  Clock,
  X,
  Plus,
  AlertCircle,
} from "lucide-react";

const DAY_NAMES = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

interface BusinessHour {
  id: number;
  day_of_week: number;
  is_open: boolean;
  open_time: string;
  close_time: string;
}

interface BlockedDate {
  id: string;
  date: string;
  reason?: string;
}

interface SiteSettings {
  general: {
    storeName: string;
    tagline: string;
    email: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  social: {
    instagram: string;
    facebook: string;
    twitter: string;
    website: string;
  };
  notifications: {
    emailOnNewOrder: boolean;
    emailOnLowStock: boolean;
    emailOnNewCustomer: boolean;
    emailOnNewReview: boolean;
  };
}

const DEFAULT_SETTINGS: SiteSettings = {
  general: {
    storeName: "Skin Essential Plus",
    tagline: "Where Science Meets Serenity",
    email: "skinessentialsp@gmail.com",
    phone: "+234 814 830 3684",
    address: "No 2, Alaafia Avenue, Opposite IDC Primary School",
    city: "Ibadan",
    state: "Oyo",
    postalCode: "",
    country: "Nigeria",
  },
  social: {
    instagram: "",
    facebook: "",
    twitter: "",
    website: "https://skinessentialplus.com",
  },
  notifications: {
    emailOnNewOrder: true,
    emailOnLowStock: true,
    emailOnNewCustomer: false,
    emailOnNewReview: false,
  },
};

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving]       = useState(false);
  const [saved, setSaved]         = useState(false);
  const [saveError, setSaveError] = useState("");
  const [loading, setLoading]     = useState(true);

  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);

  // Availability state
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [blockedDates, setBlockedDates]   = useState<BlockedDate[]>([]);
  const [availLoading, setAvailLoading]   = useState(false);
  const [availSaving, setAvailSaving]     = useState(false);
  const [availSaved, setAvailSaved]       = useState(false);
  const [availError, setAvailError]       = useState("");
  const [newBlockDate, setNewBlockDate]   = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");
  const [blockSaving, setBlockSaving]     = useState(false);

  // ── Load site settings on mount ────────────────────────────────
  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((json) => {
        if (json.settings) {
          setSettings((prev) => ({
            general:       { ...prev.general,       ...(json.settings.general ?? {}) },
            social:        { ...prev.social,        ...(json.settings.social ?? {}) },
            notifications: { ...prev.notifications, ...(json.settings.notifications ?? {}) },
          }));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // ── Load availability when that tab opens ──────────────────────
  useEffect(() => {
    if (activeTab === "availability" && businessHours.length === 0) {
      loadAvailability();
    }
  }, [activeTab]);

  const loadAvailability = async () => {
    setAvailLoading(true);
    try {
      const [hoursRes, datesRes] = await Promise.all([
        fetch("/api/admin/business-hours").then((r) => r.json()),
        fetch("/api/admin/blocked-dates").then((r) => r.json()),
      ]);
      setBusinessHours(hoursRes.hours ?? []);
      setBlockedDates(datesRes.dates ?? []);
    } catch {
      setAvailError("Failed to load availability settings.");
    } finally {
      setAvailLoading(false);
    }
  };

  // ── Save general / social / notifications ──────────────────────
  const handleSave = async () => {
    setSaving(true);
    setSaveError("");
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? "Failed to save");
      }
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      setSaveError(err.message ?? "Could not save settings.");
    } finally {
      setSaving(false);
    }
  };

  // ── Save availability hours ────────────────────────────────────
  const handleSaveAvailability = async () => {
    setAvailSaving(true);
    setAvailError("");
    try {
      const res = await fetch("/api/admin/business-hours", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hours: businessHours }),
      });
      if (!res.ok) throw new Error();
      setAvailSaved(true);
      setTimeout(() => setAvailSaved(false), 3000);
    } catch {
      setAvailError("Failed to save. Please try again.");
    } finally {
      setAvailSaving(false);
    }
  };

  const handleAddBlockedDate = async () => {
    if (!newBlockDate) return;
    setBlockSaving(true);
    try {
      const res = await fetch("/api/admin/blocked-dates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date: newBlockDate, reason: newBlockReason }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setBlockedDates((prev) => [...prev, data.date].sort((a, b) => a.date.localeCompare(b.date)));
      setNewBlockDate("");
      setNewBlockReason("");
    } catch {
      setAvailError("Failed to block date.");
    } finally {
      setBlockSaving(false);
    }
  };

  const handleRemoveBlockedDate = async (id: string) => {
    try {
      const res = await fetch(`/api/admin/blocked-dates/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      setBlockedDates((prev) => prev.filter((d) => d.id !== id));
    } catch {
      setAvailError("Failed to remove blocked date.");
    }
  };

  const updateHour = (day: number, field: keyof BusinessHour, value: boolean | string) => {
    setBusinessHours((prev) =>
      prev.map((h) => (h.day_of_week === day ? { ...h, [field]: value } : h))
    );
  };

  const updateGeneral  = (field: keyof SiteSettings["general"],  value: string)  =>
    setSettings((s) => ({ ...s, general: { ...s.general, [field]: value } }));
  const updateSocial   = (field: keyof SiteSettings["social"],   value: string)  =>
    setSettings((s) => ({ ...s, social: { ...s.social, [field]: value } }));
  const updateNotif    = (field: keyof SiteSettings["notifications"], value: boolean) =>
    setSettings((s) => ({ ...s, notifications: { ...s.notifications, [field]: value } }));

  const tabs = [
    { id: "general",       label: "General",       icon: Store      },
    { id: "social",        label: "Social Media",  icon: Globe      },
    { id: "notifications", label: "Notifications", icon: Bell       },
    { id: "payment",       label: "Payment",       icon: CreditCard },
    { id: "branding",      label: "Branding",      icon: ImageIcon  },
    { id: "availability",  label: "Availability",  icon: Calendar   },
  ];

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-mauve" />
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl font-light text-deep mb-2">Settings</h1>
        <p className="text-sm text-deep/60">Manage your store configuration</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border-2 border-deep/10 bg-ivory overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-colors border-b border-deep/10 last:border-b-0 ${
                    activeTab === tab.id ? "bg-mauve text-ivory" : "hover:bg-mauve-tint text-deep"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border-2 border-deep/10 bg-ivory p-6">

            {/* ── GENERAL ── */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-light text-deep mb-1">General Settings</h3>
                  <p className="text-sm text-deep/60">Basic store information and contact details</p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-deep mb-2">Store Name</label>
                    <input
                      type="text"
                      value={settings.general.storeName}
                      onChange={(e) => updateGeneral("storeName", e.target.value)}
                      className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-deep mb-2">Tagline</label>
                    <input
                      type="text"
                      value={settings.general.tagline}
                      onChange={(e) => updateGeneral("tagline", e.target.value)}
                      className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm uppercase tracking-wider font-medium text-deep mb-4 flex items-center gap-2">
                    <Phone className="h-4 w-4" /> Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-deep mb-2">Email</label>
                      <input
                        type="email"
                        value={settings.general.email}
                        onChange={(e) => updateGeneral("email", e.target.value)}
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-deep mb-2">Phone</label>
                      <input
                        type="tel"
                        value={settings.general.phone}
                        onChange={(e) => updateGeneral("phone", e.target.value)}
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-sm uppercase tracking-wider font-medium text-deep mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> Business Address
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-deep mb-2">Street Address</label>
                      <input
                        type="text"
                        value={settings.general.address}
                        onChange={(e) => updateGeneral("address", e.target.value)}
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-deep mb-2">City</label>
                        <input
                          type="text"
                          value={settings.general.city}
                          onChange={(e) => updateGeneral("city", e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-deep mb-2">State</label>
                        <input
                          type="text"
                          value={settings.general.state}
                          onChange={(e) => updateGeneral("state", e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-deep mb-2">Postal Code</label>
                        <input
                          type="text"
                          value={settings.general.postalCode}
                          onChange={(e) => updateGeneral("postalCode", e.target.value)}
                          className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── SOCIAL MEDIA ── */}
            {activeTab === "social" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-light text-deep mb-1">Social Media</h3>
                  <p className="text-sm text-deep/60">Links shown on your website and emails</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {([
                    { key: "instagram", label: "Instagram", Icon: Instagram, placeholder: "@skinessentialplus" },
                    { key: "facebook",  label: "Facebook",  Icon: Facebook,  placeholder: "skinessentialplus"  },
                    { key: "twitter",   label: "Twitter/X", Icon: Twitter,   placeholder: "@skinessential"     },
                    { key: "website",   label: "Website",   Icon: Globe,     placeholder: "https://..."        },
                  ] as const).map(({ key, label, Icon, placeholder }) => (
                    <div key={key}>
                      <label className="block text-sm font-medium text-deep mb-2 flex items-center gap-2">
                        <Icon className="h-4 w-4" /> {label}
                      </label>
                      <input
                        type="text"
                        value={settings.social[key]}
                        onChange={(e) => updateSocial(key, e.target.value)}
                        placeholder={placeholder}
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-light text-deep mb-1">Notification Preferences</h3>
                  <p className="text-sm text-deep/60">Choose which notifications you want to receive</p>
                </div>
                <div className="space-y-3">
                  {([
                    { key: "emailOnNewOrder",    label: "New Order Notifications",    description: "Get notified when a customer places a new order" },
                    { key: "emailOnLowStock",    label: "Low Stock Alerts",            description: "Get alerted when products are running low" },
                    { key: "emailOnNewCustomer", label: "New Customer Notifications",  description: "Get notified when a new customer registers" },
                    { key: "emailOnNewReview",   label: "New Review Notifications",    description: "Get notified when customers leave reviews" },
                  ] as const).map(({ key, label, description }) => (
                    <label
                      key={key}
                      className="flex items-start gap-4 p-4 rounded-lg border-2 border-deep/10 hover:border-mauve/30 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={settings.notifications[key]}
                        onChange={(e) => updateNotif(key, e.target.checked)}
                        className="h-5 w-5 rounded border-2 border-deep/20 text-mauve focus:ring-mauve mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium text-deep">{label}</p>
                        <p className="text-xs text-deep/60 mt-0.5">{description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* ── PAYMENT (read-only info — keys live in env vars) ── */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-light text-deep mb-1">Payment Configuration</h3>
                  <p className="text-sm text-deep/60">Payment keys are managed via environment variables for security</p>
                </div>
                <div className="rounded-xl bg-sage-tint border border-sage/20 p-5 space-y-3">
                  <h4 className="font-medium text-sage text-sm">How payment keys work</h4>
                  <p className="text-sm text-deep/70 leading-relaxed">
                    Your Paystack public and secret keys are stored in <code className="bg-white px-1.5 py-0.5 rounded text-xs font-mono border border-deep/10">.env.local</code> on your server, not in the database.
                    This is the safest approach — keys are never exposed to the browser or stored in plain text.
                  </p>
                  <div className="space-y-2 pt-1">
                    {[
                      { label: "Paystack Public Key",   env: "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY" },
                      { label: "Paystack Secret Key",   env: "PAYSTACK_SECRET_KEY"             },
                      { label: "Resend API Key",        env: "RESEND_API_KEY"                  },
                      { label: "Supabase URL",          env: "NEXT_PUBLIC_SUPABASE_URL"        },
                    ].map(({ label, env }) => (
                      <div key={env} className="flex items-center justify-between py-1.5 border-b border-deep/8 last:border-0">
                        <span className="text-sm text-deep/70">{label}</span>
                        <code className="text-[11px] font-mono text-deep/40 bg-white px-2 py-0.5 rounded border border-deep/10">{env}</code>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ── BRANDING ── */}
            {activeTab === "branding" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-light text-deep mb-1">Branding & Logo</h3>
                  <p className="text-sm text-deep/60">Brand colors are defined in your Tailwind config</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep mb-4">Store Logo</label>
                  <div className="border-2 border-dashed border-deep/20 rounded-xl p-8 text-center hover:border-mauve/50 transition-colors cursor-pointer">
                    <Upload className="h-12 w-12 text-deep/30 mx-auto mb-4" />
                    <p className="text-sm text-deep mb-1">Click to upload or drag and drop</p>
                    <p className="text-xs text-deep/60">SVG, PNG, JPG (max. 2MB)</p>
                  </div>
                </div>
                <div className="rounded-xl bg-deep-tint border border-deep/10 p-5">
                  <h4 className="font-medium text-deep text-sm mb-3">Current Brand Colors</h4>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { label: "Mauve",  hex: "#8A6F88" },
                      { label: "Sage",   hex: "#4F7288" },
                      { label: "Deep",   hex: "#47676A" },
                    ].map(({ label, hex }) => (
                      <div key={label} className="flex items-center gap-3">
                        <span className="h-8 w-8 rounded-lg border border-deep/10 shrink-0" style={{ background: hex }} />
                        <div>
                          <p className="text-xs font-medium text-deep">{label}</p>
                          <p className="text-[10px] font-mono text-deep/40">{hex}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <p className="text-xs text-deep/50 mt-4">To change brand colors, update <code className="font-mono bg-white px-1 rounded border border-deep/10">tailwind.config.ts</code>.</p>
                </div>
              </div>
            )}

            {/* ── AVAILABILITY ── */}
            {activeTab === "availability" && (
              <div className="space-y-8">
                <div>
                  <h3 className="font-display text-2xl font-light text-deep mb-1">Availability</h3>
                  <p className="text-sm text-deep/60">Set working days, hours, and block specific dates.</p>
                </div>

                {availError && (
                  <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                    <AlertCircle className="h-4 w-4 text-red-400 shrink-0" />
                    <p className="text-sm text-red-500">{availError}</p>
                  </div>
                )}

                {availLoading ? (
                  <div className="flex items-center gap-2 py-8 justify-center">
                    <Loader2 className="h-5 w-5 animate-spin text-mauve" />
                    <span className="text-sm text-deep/50">Loading…</span>
                  </div>
                ) : (
                  <>
                    <div>
                      <h4 className="text-sm uppercase tracking-wider font-medium text-deep mb-4 flex items-center gap-2">
                        <Clock className="h-4 w-4" /> Working Days &amp; Hours
                      </h4>
                      <div className="space-y-3">
                        {businessHours.map((h) => (
                          <div
                            key={h.day_of_week}
                            className={`flex flex-wrap items-center gap-4 p-4 rounded-xl border-2 transition-colors ${
                              h.is_open ? "border-sage/30 bg-sage-tint/30" : "border-deep/10 bg-ivory"
                            }`}
                          >
                            <label className="flex items-center gap-2 cursor-pointer min-w-[130px]">
                              <input
                                type="checkbox"
                                checked={h.is_open}
                                onChange={(e) => updateHour(h.day_of_week, "is_open", e.target.checked)}
                                className="h-4 w-4 rounded border-deep/20 text-sage focus:ring-sage"
                              />
                              <span className={`text-sm font-medium ${h.is_open ? "text-deep" : "text-deep/40"}`}>
                                {DAY_NAMES[h.day_of_week]}
                              </span>
                            </label>
                            {h.is_open && (
                              <div className="flex items-center gap-2 flex-1 min-w-[220px]">
                                <input
                                  type="time"
                                  value={h.open_time.substring(0, 5)}
                                  onChange={(e) => updateHour(h.day_of_week, "open_time", e.target.value)}
                                  className="h-9 px-3 rounded-lg border-2 border-deep/10 bg-white text-sm text-deep focus:border-sage focus:outline-none"
                                />
                                <span className="text-deep/40 text-sm">to</span>
                                <input
                                  type="time"
                                  value={h.close_time.substring(0, 5)}
                                  onChange={(e) => updateHour(h.day_of_week, "close_time", e.target.value)}
                                  className="h-9 px-3 rounded-lg border-2 border-deep/10 bg-white text-sm text-deep focus:border-sage focus:outline-none"
                                />
                              </div>
                            )}
                            {!h.is_open && <span className="text-xs text-deep/35 font-light">Closed</span>}
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button
                          onClick={handleSaveAvailability}
                          disabled={availSaving}
                          className="h-10 px-6 rounded-xl bg-sage text-ivory text-sm font-medium flex items-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
                        >
                          {availSaving ? (
                            <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
                          ) : availSaved ? (
                            <><Check className="h-4 w-4" /> Saved!</>
                          ) : (
                            <><Save className="h-4 w-4" /> Save Hours</>
                          )}
                        </button>
                      </div>
                    </div>

                    <div>
                      <h4 className="text-sm uppercase tracking-wider font-medium text-deep mb-4 flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Blocked Dates
                      </h4>
                      <div className="flex flex-wrap gap-2 mb-4">
                        <input
                          type="date"
                          value={newBlockDate}
                          onChange={(e) => setNewBlockDate(e.target.value)}
                          className="h-10 px-3 rounded-lg border-2 border-deep/10 bg-white text-sm text-deep focus:border-mauve focus:outline-none"
                        />
                        <input
                          type="text"
                          placeholder="Reason (optional)"
                          value={newBlockReason}
                          onChange={(e) => setNewBlockReason(e.target.value)}
                          className="flex-1 min-w-[160px] h-10 px-3 rounded-lg border-2 border-deep/10 bg-white text-sm text-deep placeholder:text-deep/30 focus:border-mauve focus:outline-none"
                        />
                        <button
                          onClick={handleAddBlockedDate}
                          disabled={!newBlockDate || blockSaving}
                          className="h-10 px-5 rounded-lg bg-mauve text-ivory text-sm font-medium flex items-center gap-1.5 hover:opacity-90 transition-opacity disabled:opacity-40"
                        >
                          {blockSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
                          Block Date
                        </button>
                      </div>
                      {blockedDates.length === 0 ? (
                        <p className="text-sm text-deep/40 font-light py-4 text-center border-2 border-dashed border-deep/10 rounded-xl">
                          No dates blocked yet
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {blockedDates.map((bd) => (
                            <div key={bd.id} className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-mauve/20 bg-mauve-tint/30">
                              <div>
                                <p className="text-sm font-medium text-deep">
                                  {new Date(bd.date + "T12:00:00").toLocaleDateString("en-NG", {
                                    weekday: "short", day: "numeric", month: "long", year: "numeric",
                                  })}
                                </p>
                                {bd.reason && <p className="text-[11px] text-deep/50 font-light">{bd.reason}</p>}
                              </div>
                              <button
                                onClick={() => handleRemoveBlockedDate(bd.id)}
                                className="h-7 w-7 rounded-full flex items-center justify-center text-deep/30 hover:text-mauve hover:bg-mauve-tint transition-all"
                              >
                                <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            )}

            {/* Save button — shown on general / social / notifications tabs */}
            {["general", "social", "notifications"].includes(activeTab) && (
              <div className="mt-8 pt-6 border-t-2 border-deep/10 flex items-center justify-between gap-3">
                {saveError && (
                  <p className="text-sm text-red-500 flex items-center gap-1.5">
                    <AlertCircle className="h-4 w-4 shrink-0" /> {saveError}
                  </p>
                )}
                <div className="ml-auto">
                  <button
                    onClick={handleSave}
                    disabled={saving}
                    className="h-12 px-8 rounded-xl bg-mauve text-ivory hover:opacity-90 transition-opacity flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {saving ? (
                      <><Loader2 className="h-4 w-4 animate-spin" /><span className="font-medium">Saving…</span></>
                    ) : saved ? (
                      <><Check className="h-4 w-4" /><span className="font-medium">Saved!</span></>
                    ) : (
                      <><Save className="h-4 w-4" /><span className="font-medium">Save Changes</span></>
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
