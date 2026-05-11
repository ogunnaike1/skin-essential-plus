"use client";

import { useState, useEffect } from "react";

import {
  Settings as SettingsIcon,
  Store,
  Mail,
  CreditCard,
  Image as ImageIcon,
  Bell,
  Shield,
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

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  // General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    storeName: "Skin Essential Plus",
    tagline: "Where Science Meets Serenity",
    email: "hello@skinessentialplus.com",
    phone: "+234 814 830 3684",
    address: "Plot 234, Admiralty Way, Lekki Phase 1, Lagos",
    city: "Lagos",
    state: "Lagos",
    postalCode: "101241",
    country: "Nigeria",
  });

  // Social Media Settings
  const [socialSettings, setSocialSettings] = useState({
    instagram: "@skinessentialplus",
    facebook: "skinessentialplus",
    twitter: "@skinessential",
    website: "https://skinessentialplus.com",
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    fromName: "Skin Essential Plus",
    fromEmail: "hello@skinessentialplus.com",
    replyToEmail: "support@skinessentialplus.com",
    orderConfirmation: true,
    shippingUpdates: true,
    newsletterEnabled: true,
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    paystackPublicKey: "pk_test_xxxxxxxxxxxxx",
    paystackSecretKey: "sk_test_xxxxxxxxxxxxx",
    currency: "NGN",
    taxRate: "7.5",
  });

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailOnNewOrder: true,
    emailOnLowStock: true,
    emailOnNewCustomer: false,
    emailOnNewReview: true,
  });

  // Availability Settings
  const [businessHours, setBusinessHours] = useState<BusinessHour[]>([]);
  const [blockedDates, setBlockedDates] = useState<BlockedDate[]>([]);
  const [availLoading, setAvailLoading] = useState(false);
  const [availSaving, setAvailSaving] = useState(false);
  const [availSaved, setAvailSaved] = useState(false);
  const [availError, setAvailError] = useState("");
  const [newBlockDate, setNewBlockDate] = useState("");
  const [newBlockReason, setNewBlockReason] = useState("");
  const [blockSaving, setBlockSaving] = useState(false);

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

  const handleSave = async () => {
    setSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSaving(false);
    setSaved(true);
    
    setTimeout(() => setSaved(false), 3000);
  };

  const tabs = [
    { id: "general",      label: "General",      icon: Store      },
    { id: "email",        label: "Email",         icon: Mail       },
    { id: "payment",      label: "Payment",       icon: CreditCard },
    { id: "notifications",label: "Notifications", icon: Bell       },
    { id: "branding",     label: "Branding",      icon: ImageIcon  },
    { id: "availability", label: "Availability",  icon: Calendar   },
  ];

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl font-light text-deep mb-2">
          Settings
        </h1>
        <p className="text-sm text-deep/60">
          Manage your store configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Tabs */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border-2 border-deep/10 bg-ivory overflow-hidden">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full px-4 py-3 flex items-center gap-3 transition-colors border-b border-deep/10 last:border-b-0 ${
                    activeTab === tab.id
                      ? "bg-mauve text-ivory"
                      : "hover:bg-mauve-tint text-deep"
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <div className="rounded-2xl border-2 border-deep/10 bg-ivory p-6">
            {/* General Settings */}
            {activeTab === "general" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-light text-deep mb-1">
                    General Settings
                  </h3>
                  <p className="text-sm text-deep/60">
                    Basic store information and contact details
                  </p>
                </div>

                {/* Store Info */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-deep mb-2">
                      Store Name
                    </label>
                    <input
                      type="text"
                      value={generalSettings.storeName}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, storeName: e.target.value })
                      }
                      className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep mb-2">
                      Tagline
                    </label>
                    <input
                      type="text"
                      value={generalSettings.tagline}
                      onChange={(e) =>
                        setGeneralSettings({ ...generalSettings, tagline: e.target.value })
                      }
                      className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                    />
                  </div>
                </div>

                {/* Contact Info */}
                <div>
                  <h4 className="text-sm uppercase tracking-wider font-medium text-deep mb-4 flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Contact Information
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-deep mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        value={generalSettings.email}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, email: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-deep mb-2">
                        Phone
                      </label>
                      <input
                        type="tel"
                        value={generalSettings.phone}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, phone: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <h4 className="text-sm uppercase tracking-wider font-medium text-deep mb-4 flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Business Address
                  </h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-deep mb-2">
                        Street Address
                      </label>
                      <input
                        type="text"
                        value={generalSettings.address}
                        onChange={(e) =>
                          setGeneralSettings({ ...generalSettings, address: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-deep mb-2">
                          City
                        </label>
                        <input
                          type="text"
                          value={generalSettings.city}
                          onChange={(e) =>
                            setGeneralSettings({ ...generalSettings, city: e.target.value })
                          }
                          className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-deep mb-2">
                          State
                        </label>
                        <input
                          type="text"
                          value={generalSettings.state}
                          onChange={(e) =>
                            setGeneralSettings({ ...generalSettings, state: e.target.value })
                          }
                          className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-deep mb-2">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          value={generalSettings.postalCode}
                          onChange={(e) =>
                            setGeneralSettings({ ...generalSettings, postalCode: e.target.value })
                          }
                          className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Social Media */}
                <div>
                  <h4 className="text-sm uppercase tracking-wider font-medium text-deep mb-4 flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Social Media
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-deep mb-2 flex items-center gap-2">
                        <Instagram className="h-4 w-4" />
                        Instagram
                      </label>
                      <input
                        type="text"
                        value={socialSettings.instagram}
                        onChange={(e) =>
                          setSocialSettings({ ...socialSettings, instagram: e.target.value })
                        }
                        placeholder="@username"
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-deep mb-2 flex items-center gap-2">
                        <Facebook className="h-4 w-4" />
                        Facebook
                      </label>
                      <input
                        type="text"
                        value={socialSettings.facebook}
                        onChange={(e) =>
                          setSocialSettings({ ...socialSettings, facebook: e.target.value })
                        }
                        placeholder="username"
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-deep mb-2 flex items-center gap-2">
                        <Twitter className="h-4 w-4" />
                        Twitter
                      </label>
                      <input
                        type="text"
                        value={socialSettings.twitter}
                        onChange={(e) =>
                          setSocialSettings({ ...socialSettings, twitter: e.target.value })
                        }
                        placeholder="@username"
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-deep mb-2 flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        Website
                      </label>
                      <input
                        type="url"
                        value={socialSettings.website}
                        onChange={(e) =>
                          setSocialSettings({ ...socialSettings, website: e.target.value })
                        }
                        placeholder="https://..."
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Email Settings */}
            {activeTab === "email" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-light text-deep mb-1">
                    Email Configuration
                  </h3>
                  <p className="text-sm text-deep/60">
                    Configure email sender and notification preferences
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-deep mb-2">
                        From Name
                      </label>
                      <input
                        type="text"
                        value={emailSettings.fromName}
                        onChange={(e) =>
                          setEmailSettings({ ...emailSettings, fromName: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-deep mb-2">
                        From Email
                      </label>
                      <input
                        type="email"
                        value={emailSettings.fromEmail}
                        onChange={(e) =>
                          setEmailSettings({ ...emailSettings, fromEmail: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep mb-2">
                      Reply-To Email
                    </label>
                    <input
                      type="email"
                      value={emailSettings.replyToEmail}
                      onChange={(e) =>
                        setEmailSettings({ ...emailSettings, replyToEmail: e.target.value })
                      }
                      className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                    />
                  </div>
                </div>

                <div>
                  <h4 className="text-sm uppercase tracking-wider font-medium text-deep mb-4">
                    Email Types
                  </h4>
                  <div className="space-y-3">
                    {[
                      { key: "orderConfirmation", label: "Order Confirmation Emails" },
                      { key: "shippingUpdates", label: "Shipping Update Emails" },
                      { key: "newsletterEnabled", label: "Newsletter Emails" },
                    ].map((item) => (
                      <label
                        key={item.key}
                        className="flex items-center gap-3 p-4 rounded-lg border-2 border-deep/10 hover:border-mauve/30 cursor-pointer transition-colors"
                      >
                        <input
                          type="checkbox"
                          checked={emailSettings[item.key as keyof typeof emailSettings] as boolean}
                          onChange={(e) =>
                            setEmailSettings({
                              ...emailSettings,
                              [item.key]: e.target.checked,
                            })
                          }
                          className="h-5 w-5 rounded border-2 border-deep/20 text-mauve focus:ring-mauve"
                        />
                        <span className="text-sm font-medium text-deep">{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Payment Settings */}
            {activeTab === "payment" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-light text-deep mb-1">
                    Payment Configuration
                  </h3>
                  <p className="text-sm text-deep/60">
                    Configure Paystack and payment settings
                  </p>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-deep mb-2">
                      Paystack Public Key
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.paystackPublicKey}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          paystackPublicKey: e.target.value,
                        })
                      }
                      placeholder="pk_test_xxxxxxxxxxxxx"
                      className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none font-mono text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep mb-2">
                      Paystack Secret Key
                    </label>
                    <input
                      type="password"
                      value={paymentSettings.paystackSecretKey}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          paystackSecretKey: e.target.value,
                        })
                      }
                      placeholder="sk_test_xxxxxxxxxxxxx"
                      className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none font-mono text-sm"
                    />
                    <p className="text-xs text-deep/60 mt-1">
                      This key is encrypted and never exposed to clients
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-deep mb-2">
                        Currency
                      </label>
                      <select
                        value={paymentSettings.currency}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, currency: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      >
                        <option value="NGN">Nigerian Naira (₦)</option>
                        <option value="USD">US Dollar ($)</option>
                        <option value="GBP">British Pound (£)</option>
                        <option value="EUR">Euro (€)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-deep mb-2">
                        Tax Rate (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        value={paymentSettings.taxRate}
                        onChange={(e) =>
                          setPaymentSettings({ ...paymentSettings, taxRate: e.target.value })
                        }
                        className="w-full h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="rounded-xl bg-sage-tint border border-sage/20 p-4">
                  <h4 className="font-medium text-sage mb-2">Security Note</h4>
                  <p className="text-sm text-deep/70">
                    Your Paystack secret key is stored securely and never exposed to the client. 
                    Always use test keys during development and switch to live keys only in production.
                  </p>
                </div>
              </div>
            )}

            {/* Notification Settings */}
            {activeTab === "notifications" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-light text-deep mb-1">
                    Notification Preferences
                  </h3>
                  <p className="text-sm text-deep/60">
                    Choose which notifications you want to receive
                  </p>
                </div>

                <div className="space-y-3">
                  {[
                    { key: "emailOnNewOrder", label: "New Order Notifications", description: "Get notified when a new order is placed" },
                    { key: "emailOnLowStock", label: "Low Stock Alerts", description: "Get alerted when products are running low" },
                    { key: "emailOnNewCustomer", label: "New Customer Notifications", description: "Get notified when someone creates an account" },
                    { key: "emailOnNewReview", label: "New Review Notifications", description: "Get notified when customers leave reviews" },
                  ].map((item) => (
                    <label
                      key={item.key}
                      className="flex items-start gap-4 p-4 rounded-lg border-2 border-deep/10 hover:border-mauve/30 cursor-pointer transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={notificationSettings[item.key as keyof typeof notificationSettings]}
                        onChange={(e) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            [item.key]: e.target.checked,
                          })
                        }
                        className="h-5 w-5 rounded border-2 border-deep/20 text-mauve focus:ring-mauve mt-0.5"
                      />
                      <div>
                        <p className="text-sm font-medium text-deep">{item.label}</p>
                        <p className="text-xs text-deep/60 mt-0.5">{item.description}</p>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            )}

            {/* Branding Settings */}
            {activeTab === "branding" && (
              <div className="space-y-6">
                <div>
                  <h3 className="font-display text-2xl font-light text-deep mb-1">
                    Branding & Logo
                  </h3>
                  <p className="text-sm text-deep/60">
                    Upload your logo and customize brand colors
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-deep mb-4">
                      Store Logo
                    </label>
                    <div className="border-2 border-dashed border-deep/20 rounded-xl p-8 text-center hover:border-mauve/50 transition-colors cursor-pointer">
                      <Upload className="h-12 w-12 text-deep/30 mx-auto mb-4" />
                      <p className="text-sm text-deep mb-1">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-deep/60">
                        SVG, PNG, JPG (max. 2MB)
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep mb-4">
                      Brand Colors
                    </label>
                    <div className="grid grid-cols-3 gap-4">
                      {[
                        { label: "Mauve", value: "#8A6F88" },
                        { label: "Sage", value: "#4F7288" },
                        { label: "Deep", value: "#354F52" },
                      ].map((color) => (
                        <div key={color.label}>
                          <label className="block text-sm text-deep/80 mb-2">
                            {color.label}
                          </label>
                          <div className="flex gap-2">
                            <input
                              type="color"
                              defaultValue={color.value}
                              className="h-12 w-16 rounded-lg border-2 border-deep/10 cursor-pointer"
                            />
                            <input
                              type="text"
                              defaultValue={color.value}
                              className="flex-1 h-12 px-4 rounded-lg border-2 border-deep/10 focus:border-mauve focus:outline-none font-mono text-sm"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ── Availability Settings ─────────────────────────── */}
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
                    {/* Working days & hours */}
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
                            {/* Day toggle */}
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

                            {/* Time range */}
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

                            {!h.is_open && (
                              <span className="text-xs text-deep/35 font-light">Closed</span>
                            )}
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

                    {/* Blocked dates */}
                    <div>
                      <h4 className="text-sm uppercase tracking-wider font-medium text-deep mb-4 flex items-center gap-2">
                        <Calendar className="h-4 w-4" /> Blocked Dates
                      </h4>

                      {/* Add new blocked date */}
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

                      {/* Blocked dates list */}
                      {blockedDates.length === 0 ? (
                        <p className="text-sm text-deep/40 font-light py-4 text-center border-2 border-dashed border-deep/10 rounded-xl">
                          No dates blocked yet
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {blockedDates.map((bd) => (
                            <div
                              key={bd.id}
                              className="flex items-center justify-between px-4 py-3 rounded-xl border-2 border-mauve/20 bg-mauve-tint/30"
                            >
                              <div>
                                <p className="text-sm font-medium text-deep">
                                  {new Date(bd.date + "T12:00:00").toLocaleDateString("en-NG", {
                                    weekday: "short", day: "numeric", month: "long", year: "numeric",
                                  })}
                                </p>
                                {bd.reason && (
                                  <p className="text-[11px] text-deep/50 font-light">{bd.reason}</p>
                                )}
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

            {/* Save Button — hidden on availability tab (has its own save) */}
            <div className={`mt-8 pt-6 border-t-2 border-deep/10 flex justify-end gap-3 ${activeTab === "availability" ? "hidden" : ""}`}>
              <button
                onClick={handleSave}
                disabled={saving}
                className="h-12 px-8 rounded-xl bg-mauve text-ivory hover:bg-mauve-dark transition-colors flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="font-medium">Saving...</span>
                  </>
                ) : saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span className="font-medium">Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span className="font-medium">Save Changes</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}