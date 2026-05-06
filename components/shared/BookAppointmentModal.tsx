"use client";

import { useEffect, useState, useMemo } from "react";
import {
  X, CalendarDays, Clock3, User, Mail, MessageSquare,
  ArrowRight, ArrowLeft, CheckCircle2, Phone, CreditCard,
  Building2, Copy, Check, Sparkles, Search, ChevronDown,
} from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import { motion, AnimatePresence } from "framer-motion";
import { getPublicServices, type Service } from "@/lib/supabase/services-api-public";
import { createAppointment, type CreateAppointmentData } from "@/lib/supabase/appointments-api";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";

const getServiceCategory = (service: Service): string =>
  (service as any).category_name || (service as any).category || "Other";

const getServiceDuration = (service: Service): number | string =>
  (service as any).duration_minutes || (service as any).duration || "N/A";

const getServiceImage = (service: Service): string | null =>
  (service as any).image_url || (service as any).image || null;

type BookAppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: Service | null;
};

type Step = 1 | 2 | 3 | 4;
type Gateway = "paystack" | "moniwave" | null;
type PaymentMethod = "card" | "transfer" | null;

const STEP_META: Record<Step, { label: string; color: string }> = {
  1: { label: "Choose a Service",   color: "text-mauve" },
  2: { label: "Your Details",       color: "text-sage"  },
  3: { label: "Payment Gateway",    color: "text-deep"  },
  4: { label: "Complete Payment",   color: "text-mauve" },
};

export default function BookAppointmentModal({
  isOpen,
  onClose,
  preselectedService,
}: BookAppointmentModalProps) {
  const [step, setStep]                   = useState<Step>(1);
  const [services, setServices]           = useState<Service[]>([]);
  const [categories, setCategories]       = useState<Array<{ id: string; name: string; count: number }>>([]);
  const [loading, setLoading]             = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [gateway, setGateway]             = useState<Gateway>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [copied, setCopied]               = useState(false);
  const [search, setSearch]               = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const { notification, showSuccess, hideSuccess } = useSuccessNotification();

  const [formData, setFormData] = useState({
    customer_name:    "",
    customer_email:   "",
    customer_phone:   "",
    appointment_date: "",
    appointment_time: "",
    message:          "",
  });

  useEffect(() => {
    if (isOpen && step === 1) loadServices();
  }, [isOpen, step]);

  useEffect(() => {
    if (preselectedService && isOpen) {
      setSelectedService(preselectedService);
      setStep(2);
    }
  }, [preselectedService, isOpen]);

  const loadServices = async () => {
    try {
      const data = await getPublicServices();
      setServices(data);
      const categoryMap = new Map<string, number>();
      data.forEach((s) => {
        const n = getServiceCategory(s);
        categoryMap.set(n, (categoryMap.get(n) || 0) + 1);
      });
      const cats = Array.from(categoryMap.entries())
        .map(([name, count]) => ({ id: name.toLowerCase().replace(/\s+/g, "-"), name, count }))
        .sort((a, b) => a.name.localeCompare(b.name));
      setCategories(cats);
      if (cats.length > 0) setExpandedCategories(new Set([cats[0]!.id]));
    } catch (err) {
      console.error("Error loading services:", err);
    }
  };

  const filteredServices = useMemo(() => {
    if (!search.trim()) return services;
    const q = search.toLowerCase().trim();
    return services.filter((s) => {
      const cat = getServiceCategory(s);
      return (
        s.name.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        cat.toLowerCase().includes(q)
      );
    });
  }, [services, search]);

  const servicesByCategory = useMemo(() => {
    const map = new Map<string, Service[]>();
    filteredServices.forEach((s) => {
      const id = getServiceCategory(s).toLowerCase().replace(/\s+/g, "-");
      if (!map.has(id)) map.set(id, []);
      map.get(id)!.push(s);
    });
    return map;
  }, [filteredServices]);

  const totalResults = filteredServices.length;

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  const handleClose = () => {
    setStep(1);
    setSelectedService(null);
    setGateway(null);
    setPaymentMethod(null);
    setSearch("");
    setExpandedCategories(new Set(categories.length > 0 ? [categories[0]!.id] : []));
    setFormData({ customer_name: "", customer_email: "", customer_phone: "", appointment_date: "", appointment_time: "", message: "" });
    onClose();
  };

  const toggleCategory = (id: string) =>
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  const copyToClipboard = async (text: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 2000); }
    catch (err) { console.error(err); }
  };

  // ── Step 2 submit → Step 3 (gateway) ──────────────────────────
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  // ── Gateway: Paystack → Step 4 ────────────────────────────────
  const handleSelectPaystack = () => {
    setGateway("paystack");
    setStep(4);
  };

  // ── Gateway: Moniwave → fire SDK directly ─────────────────────
  const handleSelectMoniwave = () => {
    if (!selectedService) return;
    setLoading(true);
    setGateway("moniwave");

    // @ts-ignore
    if (typeof window.MonnifySDK !== "undefined") {
      // @ts-ignore
      window.MonnifySDK.initialize({
        amount: selectedService.price,
        currency: "NGN",
        reference: `APPT-MW-${Date.now()}`,
        customerFullName: formData.customer_name,
        customerEmail: formData.customer_email,
        customerMobileNumber: formData.customer_phone,
        apiKey: process.env.NEXT_PUBLIC_MONIWAVE_API_KEY ?? "",
        contractCode: process.env.NEXT_PUBLIC_MONIWAVE_CONTRACT_CODE ?? "",
        paymentDescription: `Appointment: ${selectedService.name}`,
        onLoadStart: () => {},
        onLoadComplete: () => {},
        onComplete: (response: { paymentStatus: string; transactionReference: string }) => {
          if (response.paymentStatus === "PAID") {
            showSuccess("appointment-booked", {
              title: "Payment Confirmed!",
              message: `Your appointment for ${selectedService.name} is confirmed`,
              details: `Ref: ${response.transactionReference}`,
            });
            setTimeout(() => handleClose(), 1500);
          }
          setLoading(false);
        },
        onClose: () => setLoading(false),
      });
    } else {
      alert("Moniwave is unavailable right now. Please choose Paystack.");
      setGateway(null);
      setLoading(false);
    }
  };

  // ── Paystack card ─────────────────────────────────────────────
  const handleCardPayment = async () => {
    if (!selectedService) return;
    setLoading(true);
    try {
      const appointment = await createAppointment({
        ...formData,
        service_id: selectedService.id,
        service_name: selectedService.name,
        service_price: selectedService.price,
      } as CreateAppointmentData);

      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: formData.customer_email,
        amount: selectedService.price * 100,
        currency: "NGN",
        ref: `APPT-${appointment.id}`,
        metadata: { appointment_id: appointment.id, customer_name: formData.customer_name, service_name: selectedService.name },
        callback: (response: any) => {
          showSuccess("appointment-booked", {
            title: "Payment Confirmed!",
            message: `Your appointment for ${selectedService.name} is confirmed`,
            details: `Reference: ${response.reference}`,
          });
          setTimeout(() => handleClose(), 1500);
        },
        onClose: () => setLoading(false),
      });
      handler.openIframe();
    } catch (err) {
      console.error(err);
      alert("Failed to create appointment. Please try again.");
      setLoading(false);
    }
  };

  // ── Bank transfer ─────────────────────────────────────────────
  const handleBankTransfer = async () => {
    if (!selectedService) return;
    setLoading(true);
    try {
      const appointment = await createAppointment({
        ...formData,
        service_id: selectedService.id,
        service_name: selectedService.name,
        service_price: selectedService.price,
      } as CreateAppointmentData);
      showSuccess("appointment-booked", {
        title: "Booking Created!",
        message: "Complete the bank transfer to confirm your appointment",
        details: `Reference: APPT-${appointment.id}`,
      });
      setTimeout(() => handleClose(), 2000);
    } catch (err) {
      console.error(err);
      alert("Failed to create appointment. Please try again.");
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const stepIcon = { 1: "✦", 2: "✦", 3: "✦", 4: "✦" };

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" />
      <Script src="https://sdk.monnify.com/plugin/monnify.js" />

      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-deep/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-ivory shadow-glass-lg"
          onClick={(e) => e.stopPropagation()}
        >
          {/* ── HEADER ── */}
          <div className="sticky top-0 z-10 bg-ivory border-b border-deep/10">
            {/* Step progress bar */}
            <div className="flex h-1.5">
              {([1, 2, 3, 4] as Step[]).map((s) => (
                <span
                  key={s}
                  className={`flex-1 transition-colors duration-500 ${
                    step >= s
                      ? s === 1 ? "bg-mauve" : s === 2 ? "bg-sage" : s === 3 ? "bg-deep" : "bg-mauve"
                      : "bg-deep/10"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center justify-between px-6 py-5">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-deep/40 font-light mb-0.5">
                  Step {step} of 4
                </p>
                <h2 className={`font-display text-2xl sm:text-3xl font-light ${STEP_META[step].color}`}>
                  {STEP_META[step].label}
                </h2>
              </div>

              {/* Step dots */}
              <div className="hidden sm:flex items-center gap-2 mr-4">
                {([1, 2, 3, 4] as Step[]).map((s) => (
                  <span
                    key={s}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      step === s ? "w-6 bg-mauve" : step > s ? "w-2 bg-sage" : "w-2 bg-deep/20"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={handleClose}
                className="h-9 w-9 flex items-center justify-center rounded-full bg-deep-tint hover:bg-mauve-tint text-deep transition-colors shrink-0"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* ── CONTENT ── */}
          <div className="p-6 sm:p-8">
            <AnimatePresence mode="wait">

              {/* ══ STEP 1 — Service selection ══════════════════════════ */}
              {step === 1 && (
                <motion.div key="step-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  <div className="mb-6 relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-12 pl-11 pr-10 rounded-full bg-mauve-tint border-2 border-transparent text-deep placeholder:text-deep/50 text-sm font-light focus:border-mauve focus:outline-none transition-colors"
                    />
                    {search && (
                      <button onClick={() => setSearch("")} className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-mauve/10 transition-colors">
                        <X className="h-4 w-4 text-deep/40" />
                      </button>
                    )}
                    {search && <p className="mt-2 text-xs text-deep/50">{totalResults} result{totalResults === 1 ? "" : "s"} found</p>}
                  </div>

                  <div className="space-y-3">
                    {categories.map((cat) => {
                      const catServices = servicesByCategory.get(cat.id) || [];
                      if (search && catServices.length === 0) return null;
                      const isExpanded = expandedCategories.has(cat.id);
                      return (
                        <div key={cat.id} className="border-2 border-deep/10 rounded-2xl overflow-hidden">
                          <button onClick={() => toggleCategory(cat.id)} className="w-full flex items-center justify-between p-4 hover:bg-mauve-tint transition-colors">
                            <div className="flex items-center gap-3">
                              <h3 className="font-display text-lg font-light text-deep">{cat.name}</h3>
                              <span className="text-xs text-deep/40">({catServices.length})</span>
                            </div>
                            <ChevronDown className={`h-5 w-5 text-deep/40 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""}`} />
                          </button>
                          {isExpanded && (
                            <div className="border-t border-deep/10 p-4 bg-ivory space-y-2">
                              {catServices.map((service) => (
                                <button
                                  key={service.id}
                                  onClick={() => { setSelectedService(service); setStep(2); }}
                                  className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-sage-tint border-2 border-transparent hover:border-sage transition-all group"
                                >
                                  {getServiceImage(service) && (
                                    <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                      <Image src={getServiceImage(service)!} alt={service.name} fill className="object-cover group-hover:scale-110 transition-transform duration-500" />
                                    </div>
                                  )}
                                  <div className="flex-1 text-left">
                                    <h4 className="font-medium text-deep group-hover:text-sage transition-colors">{service.name}</h4>
                                    <p className="text-xs text-deep/60 line-clamp-1">{service.description}</p>
                                    <div className="flex items-center gap-3 mt-1">
                                      <span className="text-sm font-medium text-mauve">₦{service.price.toLocaleString()}</span>
                                      <span className="text-xs text-deep/40">{getServiceDuration(service)} min</span>
                                    </div>
                                  </div>
                                  <ArrowRight className="h-5 w-5 text-deep/30 group-hover:text-sage group-hover:translate-x-1 transition-all shrink-0" />
                                </button>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    {totalResults === 0 && (
                      <div className="text-center py-12">
                        <p className="text-deep/50 font-light">No services found for &ldquo;{search}&rdquo;</p>
                        <button onClick={() => setSearch("")} className="mt-3 text-sm text-mauve hover:underline">Clear search</button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ══ STEP 2 — Customer details ════════════════════════════ */}
              {step === 2 && selectedService && (
                <motion.div key="step-2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  <button onClick={() => setStep(1)} className="inline-flex items-center gap-1.5 text-sm text-deep/50 hover:text-deep mb-5 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Change service
                  </button>

                  {/* Selected service pill */}
                  <div className="flex items-center gap-3 mb-8 p-4 rounded-2xl bg-sage-tint border border-sage/20">
                    <div className="h-10 w-10 rounded-xl bg-sage flex items-center justify-center shrink-0">
                      <Sparkles className="h-4 w-4 text-ivory" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-deep/40 font-light">Selected service</p>
                      <p className="font-display text-base font-light text-deep truncate">{selectedService.name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="font-display text-lg text-sage">₦{selectedService.price.toLocaleString()}</p>
                      <p className="text-[10px] text-deep/40">{getServiceDuration(selectedService)} min</p>
                    </div>
                  </div>

                  <form onSubmit={handleDetailsSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-deep/40 font-light block mb-1.5">Full name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                          <input required type="text" value={formData.customer_name} onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })} placeholder="Ada Okafor" className="w-full h-11 pl-11 pr-4 rounded-xl border border-deep/20 bg-white text-sm text-deep placeholder:text-deep/30 focus:border-mauve focus:outline-none transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-deep/40 font-light block mb-1.5">Email address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                          <input required type="email" value={formData.customer_email} onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })} placeholder="ada@example.com" className="w-full h-11 pl-11 pr-4 rounded-xl border border-deep/20 bg-white text-sm text-deep placeholder:text-deep/30 focus:border-sage focus:outline-none transition-colors" />
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-deep/40 font-light block mb-1.5">Phone number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                          <input required type="tel" value={formData.customer_phone} onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })} placeholder="+234 800 000 0000" className="w-full h-11 pl-11 pr-4 rounded-xl border border-deep/20 bg-white text-sm text-deep placeholder:text-deep/30 focus:border-deep focus:outline-none transition-colors" />
                        </div>
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-deep/40 font-light block mb-1.5">Preferred date</label>
                        <div className="relative">
                          <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                          <input required type="date" value={formData.appointment_date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })} className="w-full h-11 pl-11 pr-4 rounded-xl border border-deep/20 bg-white text-sm text-deep focus:border-mauve focus:outline-none transition-colors" />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-deep/40 font-light block mb-1.5">Preferred time</label>
                      <div className="relative">
                        <Clock3 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                        <input required type="time" value={formData.appointment_time} onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })} className="w-full h-11 pl-11 pr-4 rounded-xl border border-deep/20 bg-white text-sm text-deep focus:border-sage focus:outline-none transition-colors" />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-deep/40 font-light block mb-1.5">Additional notes (optional)</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-3.5 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                        <textarea value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} placeholder="Any special requests or preferences..." rows={3} className="w-full pl-11 pr-4 py-3 rounded-xl border border-deep/20 bg-white text-sm text-deep placeholder:text-deep/30 focus:border-deep focus:outline-none transition-colors resize-none" />
                      </div>
                    </div>

                    <button type="submit" className="w-full py-3.5 rounded-full bg-gradient-deep text-ivory text-sm font-light tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition-opacity">
                      Continue to Payment <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </button>
                  </form>
                </motion.div>
              )}

              {/* ══ STEP 3 — Gateway selection ═══════════════════════════ */}
              {step === 3 && selectedService && (
                <motion.div key="step-3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  <button onClick={() => setStep(2)} className="inline-flex items-center gap-1.5 text-sm text-deep/50 hover:text-deep mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to details
                  </button>

                  {/* Amount summary */}
                  <div className="flex items-center justify-between mb-8 px-5 py-4 rounded-2xl bg-deep-tint border border-deep/10">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-deep/40 font-light">Booking total</p>
                      <p className="font-display text-lg text-deep">{selectedService.name}</p>
                    </div>
                    <p className="font-display text-2xl text-deep">₦{selectedService.price.toLocaleString()}</p>
                  </div>

                  <p className="text-sm text-deep/50 font-light mb-5">Choose your preferred payment provider.</p>

                  <div className="space-y-3">
                    {/* Paystack */}
                    <button
                      onClick={handleSelectPaystack}
                      className="group w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-deep/10 bg-white hover:border-[#00C46E] hover:shadow-[0_0_0_4px_rgba(0,196,110,0.08)] transition-all text-left"
                    >
                      <div className="h-12 w-12 rounded-xl bg-[#00C46E]/10 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none">
                          <rect width="32" height="32" rx="6" fill="#00C46E" />
                          <path d="M8 11h16M8 16h12M8 21h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-deep text-sm">Paystack</p>
                        <p className="text-[11px] text-deep/50 font-light mt-0.5">Card, bank transfer, USSD & more</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-deep/30 group-hover:text-[#00C46E] transition-colors shrink-0" strokeWidth={1.5} />
                    </button>

                    {/* Moniwave */}
                    <button
                      onClick={handleSelectMoniwave}
                      disabled={loading}
                      className="group w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-deep/10 bg-white hover:border-[#FF6B00] hover:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      <div className="h-12 w-12 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none">
                          <rect width="32" height="32" rx="6" fill="#FF6B00" />
                          <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2.5" />
                          <path d="M16 10v12M10 16h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-deep text-sm">Moniwave</p>
                        <p className="text-[11px] text-deep/50 font-light mt-0.5">Fast, secure Nigerian payments</p>
                      </div>
                      {loading && gateway === "moniwave" ? (
                        <span className="h-4 w-4 border-2 border-[#FF6B00]/30 border-t-[#FF6B00] rounded-full animate-spin shrink-0" />
                      ) : (
                        <ArrowRight className="h-4 w-4 text-deep/30 group-hover:text-[#FF6B00] transition-colors shrink-0" strokeWidth={1.5} />
                      )}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ══ STEP 4 — Paystack sub-methods ═══════════════════════ */}
              {step === 4 && selectedService && gateway === "paystack" && !paymentMethod && (
                <motion.div key="step-4-choose" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  <button onClick={() => { setStep(3); setGateway(null); }} className="inline-flex items-center gap-1.5 text-sm text-deep/50 hover:text-deep mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to gateway
                  </button>

                  <p className="text-sm text-deep/50 font-light mb-5">How would you like to pay via Paystack?</p>

                  <div className="space-y-3">
                    {/* Card */}
                    <button
                      onClick={() => setPaymentMethod("card")}
                      className="group w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-deep/10 bg-white hover:border-mauve hover:shadow-[0_0_0_4px_rgba(138,111,136,0.08)] transition-all text-left"
                    >
                      <div className="h-12 w-12 rounded-xl bg-mauve-tint flex items-center justify-center shrink-0">
                        <CreditCard className="h-5 w-5 text-mauve" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-deep text-sm">Debit / Credit Card</p>
                        <p className="text-[11px] text-deep/50 font-light mt-0.5">Visa, Mastercard, Verve — secure checkout</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-deep/30 group-hover:text-mauve transition-colors shrink-0" strokeWidth={1.5} />
                    </button>

                    {/* Transfer */}
                    <button
                      onClick={() => setPaymentMethod("transfer")}
                      className="group w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-deep/10 bg-white hover:border-sage hover:shadow-[0_0_0_4px_rgba(79,114,136,0.08)] transition-all text-left"
                    >
                      <div className="h-12 w-12 rounded-xl bg-sage-tint flex items-center justify-center shrink-0">
                        <Building2 className="h-5 w-5 text-sage" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-deep text-sm">Bank Transfer</p>
                        <p className="text-[11px] text-deep/50 font-light mt-0.5">Transfer directly from your bank account</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-deep/30 group-hover:text-sage transition-colors shrink-0" strokeWidth={1.5} />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ══ STEP 4 / Card payment ════════════════════════════════ */}
              {step === 4 && selectedService && paymentMethod === "card" && (
                <motion.div key="step-4-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  <button onClick={() => setPaymentMethod(null)} className="inline-flex items-center gap-1.5 text-sm text-deep/50 hover:text-deep mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to payment options
                  </button>

                  {/* Summary card */}
                  <div className="p-5 rounded-2xl bg-mauve-tint border border-mauve/20 mb-6 space-y-3">
                    <h3 className="text-[10px] uppercase tracking-wider text-deep/40 font-light">Booking summary</h3>
                    {[
                      { label: "Service",  value: selectedService.name },
                      { label: "Date",     value: new Date(formData.appointment_date).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" }) },
                      { label: "Time",     value: formData.appointment_time },
                      { label: "Customer", value: formData.customer_name },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-deep/50 font-light">{label}</span>
                        <span className="text-deep font-light">{value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-3 border-t border-mauve/20">
                      <span className="text-sm text-deep font-light">Total</span>
                      <span className="font-display text-2xl text-mauve">₦{selectedService.price.toLocaleString()}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleCardPayment}
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-gradient-deep text-ivory text-sm font-light tracking-wide flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <><span className="h-4 w-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" /> Processing…</>
                    ) : (
                      <><CreditCard className="h-4 w-4" strokeWidth={1.5} /> Pay ₦{selectedService.price.toLocaleString()} with Paystack</>
                    )}
                  </button>
                  <p className="mt-3 text-[11px] text-center text-deep/40 font-light">Secured by Paystack — 256-bit SSL encryption</p>
                </motion.div>
              )}

              {/* ══ STEP 4 / Bank transfer ═══════════════════════════════ */}
              {step === 4 && selectedService && paymentMethod === "transfer" && (
                <motion.div key="step-4-transfer" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  <button onClick={() => setPaymentMethod(null)} className="inline-flex items-center gap-1.5 text-sm text-deep/50 hover:text-deep mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to payment options
                  </button>

                  <div className="p-5 rounded-2xl bg-sage-tint border border-sage/20 space-y-4 mb-5">
                    <h3 className="text-[10px] uppercase tracking-wider text-deep/40 font-light flex items-center gap-2">
                      <Building2 className="h-3.5 w-3.5 text-sage" strokeWidth={1.5} /> Bank account details
                    </h3>

                    {[
                      { label: "Bank name",     value: "GTBank (Guaranty Trust Bank)" },
                      { label: "Account name",  value: "Skin Essential Plus Ltd" },
                      { label: "Account number", value: "0123456789" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-deep/40 font-light">{label}</p>
                          <p className="text-sm font-medium text-deep mt-0.5">{value}</p>
                        </div>
                        <button
                          onClick={() => copyToClipboard(value)}
                          className="h-8 w-8 rounded-full bg-white border border-sage/30 flex items-center justify-center hover:bg-sage hover:border-sage hover:text-ivory text-sage transition-all"
                        >
                          {copied ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />}
                        </button>
                      </div>
                    ))}

                    <div className="pt-3 border-t border-sage/20">
                      <p className="text-[10px] uppercase tracking-wider text-deep/40 font-light">Exact amount</p>
                      <p className="font-display text-2xl text-sage mt-0.5">₦{selectedService.price.toLocaleString()}</p>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="p-4 rounded-2xl bg-mauve-tint border border-mauve/20 mb-5">
                    <p className="text-[10px] uppercase tracking-wider text-deep/40 font-light mb-3">Next steps</p>
                    <ol className="space-y-2">
                      {[
                        "Transfer the exact amount to the account above.",
                        "Screenshot your payment confirmation.",
                        `Send proof to +234 901 234 5678 on WhatsApp with reference: APPT-${formData.customer_name.split(" ")[0]?.toUpperCase() ?? "REF"}.`,
                        "We'll confirm your booking within a few hours.",
                      ].map((step, i) => (
                        <li key={i} className="flex gap-2.5 text-xs text-deep/70 font-light">
                          <span className="font-medium text-mauve shrink-0">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>

                  <button
                    onClick={handleBankTransfer}
                    disabled={loading}
                    className="w-full py-4 rounded-full bg-gradient-deep text-ivory text-sm font-light tracking-wide flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-60"
                  >
                    {loading ? (
                      <><span className="h-4 w-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" /> Creating booking…</>
                    ) : (
                      <><CheckCircle2 className="h-4 w-4" strokeWidth={1.5} /> I&rsquo;ve completed the transfer</>
                    )}
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <SuccessNotification {...notification} onClose={hideSuccess} />
    </>
  );
}
