"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import {
  X, CalendarDays, Clock3, User, Mail, MessageSquare,
  ArrowRight, ArrowLeft, CheckCircle2, Phone, CreditCard,
  Sparkles, Search, ChevronDown,
  Loader2, AlertCircle, Lock,
} from "lucide-react";

interface TimeSlot {
  start: string;
  end: string;
  label: string;
  count: number;
  max: number;
  full: boolean;
  locked: boolean;
}

type SlotStatus = "idle" | "loading" | "loaded" | "closed" | "error";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { z } from "zod";
import { getPublicServices, type Service } from "@/lib/supabase/services-api-public";
import { createAppointment, type CreateAppointmentData } from "@/lib/supabase/appointments-api";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";

const today = new Date().toISOString().split("T")[0]!;

const detailsSchema = z.object({
  customer_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name is too long"),
  customer_email: z
    .string()
    .email("Enter a valid email address"),
  customer_phone: z
    .string()
    .min(7, "Enter a valid phone number")
    .max(20, "Phone number is too long")
    .regex(/^[+\d\s\-()]+$/, "Phone number contains invalid characters"),
  appointment_date: z
    .string()
    .min(1, "Select a date")
    .refine((d) => d >= today, "Date must be today or in the future"),
  start_time: z
    .string()
    .min(1, "Select a time"),
  notes: z.string().max(500, "Notes must be under 500 characters").optional(),
});

type DetailsFormErrors = Partial<Record<keyof z.infer<typeof detailsSchema>, string>>;

const getServiceCategory = (service: Service): string =>
  (service as any).category_name || (service as any).category || "Other";

const getServiceDuration = (service: Service): number | string =>
  (service as any).duration_minutes || (service as any).duration || "N/A";

function computeEndTime(startTime: string, durationMins: number): string {
  if (!startTime) return "00:00";
  const [h, m] = startTime.split(":").map(Number);
  const total = (h ?? 0) * 60 + (m ?? 0) + durationMins;
  const endH = Math.floor(total / 60) % 24;
  const endM = total % 60;
  return `${String(endH).padStart(2, "0")}:${String(endM).padStart(2, "0")}`;
}

const getServiceImage = (service: Service): string | null =>
  (service as any).image_url || (service as any).image || null;

type BookAppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: Service | null;
};

type Step = 1 | 2 | 3 | 4;
type Gateway = "paystack" | "moniwave" | null;
type PaymentMethod = "card" | null;

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
  const [search, setSearch]               = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [fieldErrors, setFieldErrors]     = useState<DetailsFormErrors>({});
  const [slotStatus, setSlotStatus]       = useState<SlotStatus>("idle");
  const [slots, setSlots]                 = useState<TimeSlot[]>([]);
  const [closedReason, setClosedReason]   = useState("");
  const [selectedSlot, setSelectedSlot]   = useState<TimeSlot | null>(null);
  const dateInputRef = useRef<HTMLInputElement>(null);

  const { notification, showSuccess, showError, hideSuccess } = useSuccessNotification();

  const [formData, setFormData] = useState({
    customer_name:    "",
    customer_email:   "",
    customer_phone:   "",
    appointment_date: "",
    start_time:       "",
    notes:            "",
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

  useEffect(() => {
    if (!formData.appointment_date) {
      setSlotStatus("idle");
      setSlots([]);
      setSelectedSlot(null);
      return;
    }
    setSlotStatus("loading");
    setSelectedSlot(null);
    setFormData((d) => ({ ...d, start_time: "" }));

    fetch(`/api/availability?date=${formData.appointment_date}`)
      .then((r) => r.json())
      .then((data) => {
        if (!data.isOpen) {
          setClosedReason(data.reason ?? "Not available on this date.");
          setSlotStatus("closed");
        } else {
          setSlots(data.slots ?? []);
          setSlotStatus("loaded");
        }
      })
      .catch(() => setSlotStatus("error"));
  }, [formData.appointment_date]);

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

  const handleClose = useCallback(() => {
    setStep(1);
    setSelectedService(null);
    setGateway(null);
    setPaymentMethod(null);
    setLoading(false);
    setSearch("");
    setExpandedCategories(new Set(categories.length > 0 ? [categories[0]!.id] : []));
    setFormData({ customer_name: "", customer_email: "", customer_phone: "", appointment_date: "", start_time: "", notes: "" });
    setFieldErrors({});
    setSlotStatus("idle");
    setSlots([]);
    setSelectedSlot(null);
    setClosedReason("");
    hideSuccess();
    onClose();
  }, [categories, hideSuccess, onClose]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, handleClose]);

  const handleSlotSelect = (slot: TimeSlot) => {
    setSelectedSlot(slot);
    setFormData((d) => ({ ...d, start_time: slot.start }));
    setFieldErrors((p) => ({ ...p, start_time: undefined }));
  };

  const toggleCategory = (id: string) =>
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  // ── Step 2 submit → Step 3 (gateway) ──────────────────────────
  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = detailsSchema.safeParse(formData);
    if (!result.success) {
      const errs: DetailsFormErrors = {};
      result.error.issues.forEach((issue: z.core.$ZodIssue) => {
        const field = issue.path[0] as keyof DetailsFormErrors;
        if (field && !errs[field]) errs[field] = issue.message;
      });
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setStep(3);
  };

  // ── Gateway: Paystack → Step 4 (card directly) ───────────────
  const handleSelectPaystack = () => {
    setGateway("paystack");
    setPaymentMethod("card");
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
        onComplete: async (response: { paymentStatus: string; transactionReference: string }) => {
          if (response.paymentStatus === "PAID") {
            try {
              const durationMins = Number(getServiceDuration(selectedService)) || 60;
              const endTime = selectedSlot?.end ?? computeEndTime(formData.start_time, durationMins);
              const appointment = await createAppointment({
                ...formData,
                service_id: selectedService.id,
                service_name: selectedService.name,
                service_price: selectedService.price,
                end_time: endTime,
                duration_minutes: durationMins,
              } as CreateAppointmentData);
              fetch("/api/appointments/notify", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ appointmentId: appointment.id, reference: response.transactionReference }),
              }).catch((err) => console.error("Notify failed:", err));
            } catch (err) {
              console.error("Appointment create failed after Moniwave:", err);
            }
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
      showError({ title: "Moniwave unavailable", message: "Please choose Paystack to continue." });
      setGateway(null);
      setLoading(false);
    }
  };

  // ── Shared Paystack launcher (card or opay) ───────────────────
  const launchPaystack = async (channels?: string[]) => {
    if (!selectedService) return;

    // @ts-ignore
    if (typeof window.PaystackPop === "undefined") {
      showError({ title: "Payment unavailable", message: "Paystack is still loading. Please wait a moment and try again." });
      return;
    }

    setLoading(true);
    try {
      const durationMins = Number(getServiceDuration(selectedService)) || 60;
      const endTime = selectedSlot?.end ?? computeEndTime(formData.start_time, durationMins);

      const appointment = await createAppointment({
        ...formData,
        service_id: selectedService.id,
        service_name: selectedService.name,
        service_price: selectedService.price,
        end_time: endTime,
        duration_minutes: durationMins,
      } as CreateAppointmentData);

      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: formData.customer_email,
        amount: Math.round(selectedService.price * 100),
        currency: "NGN",
        ref: `APPT-${appointment.id}`,
        ...(channels && channels.length > 0 ? { channels } : {}),
        metadata: {
          custom_fields: [
            { display_name: "Customer", variable_name: "customer_name", value: formData.customer_name },
            { display_name: "Service",  variable_name: "service_name",  value: selectedService.name },
            { display_name: "Date",     variable_name: "date",          value: formData.appointment_date },
            { display_name: "Time",     variable_name: "time",          value: formData.start_time },
          ],
        },
        callback: (response: { reference: string }) => {
          // Confirm appointment + send brand notification (fire-and-forget)
          fetch("/api/appointments/notify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ appointmentId: appointment.id, reference: response.reference }),
          }).catch((err) => console.error("Notify failed:", err));

          showSuccess("appointment-booked", {
            title: "Payment Confirmed!",
            message: `Your appointment for ${selectedService.name} is confirmed. We'll be in touch shortly.`,
            details: `Reference: ${response.reference}`,
          });
          setTimeout(() => handleClose(), 2500);
        },
        onClose: () => setLoading(false),
      });
      handler.openIframe();
    } catch (err: any) {
      console.error(err);
      showError({ title: "Booking failed", message: err?.message ?? "Unable to create your appointment. Please try again." });
      setLoading(false);
    }
  };

  const handleCardPayment = () => launchPaystack();

  if (!isOpen) return null;

  return (
    <>

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
                                      <span className="text-sm font-semibold text-mauve">₦{service.price.toLocaleString()}</span>
                                      {service.original_price && service.original_price > service.price && (
                                        <span className="text-xs text-deep/40 line-through">₦{service.original_price.toLocaleString()}</span>
                                      )}
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
                      {selectedService.original_price && selectedService.original_price > selectedService.price && (
                        <p className="text-xs text-deep/40 line-through">₦{selectedService.original_price.toLocaleString()}</p>
                      )}
                      <p className="text-[10px] text-deep/40">{getServiceDuration(selectedService)} min</p>
                    </div>
                  </div>

                  <form onSubmit={handleDetailsSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-deep/40 font-light block mb-1.5">Full name</label>
                        <div className="relative">
                          <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                          <input
                            type="text"
                            value={formData.customer_name}
                            onChange={(e) => { setFormData({ ...formData, customer_name: e.target.value }); setFieldErrors((p) => ({ ...p, customer_name: undefined })); }}
                            placeholder="Ada Okafor"
                            className={`w-full h-11 pl-11 pr-4 rounded-xl border bg-white text-sm text-deep placeholder:text-deep/30 focus:outline-none transition-colors ${fieldErrors.customer_name ? "border-red-400 focus:border-red-400" : "border-deep/20 focus:border-mauve"}`}
                          />
                        </div>
                        {fieldErrors.customer_name && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.customer_name}</p>}
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-deep/40 font-light block mb-1.5">Email address</label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                          <input
                            type="email"
                            value={formData.customer_email}
                            onChange={(e) => { setFormData({ ...formData, customer_email: e.target.value }); setFieldErrors((p) => ({ ...p, customer_email: undefined })); }}
                            placeholder="ada@example.com"
                            className={`w-full h-11 pl-11 pr-4 rounded-xl border bg-white text-sm text-deep placeholder:text-deep/30 focus:outline-none transition-colors ${fieldErrors.customer_email ? "border-red-400 focus:border-red-400" : "border-deep/20 focus:border-sage"}`}
                          />
                        </div>
                        {fieldErrors.customer_email && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.customer_email}</p>}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-deep/40 font-light block mb-1.5">Phone number</label>
                        <div className="relative">
                          <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                          <input
                            type="tel"
                            value={formData.customer_phone}
                            onChange={(e) => { setFormData({ ...formData, customer_phone: e.target.value }); setFieldErrors((p) => ({ ...p, customer_phone: undefined })); }}
                            placeholder="+234 800 000 0000"
                            className={`w-full h-11 pl-11 pr-4 rounded-xl border bg-white text-sm text-deep placeholder:text-deep/30 focus:outline-none transition-colors ${fieldErrors.customer_phone ? "border-red-400 focus:border-red-400" : "border-deep/20 focus:border-deep"}`}
                          />
                        </div>
                        {fieldErrors.customer_phone && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.customer_phone}</p>}
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-deep/40 font-light block mb-1.5">Preferred date</label>
                        <div
                          className="relative cursor-pointer"
                          onClick={() => dateInputRef.current?.showPicker()}
                        >
                          <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30 pointer-events-none" strokeWidth={1.5} />
                          <input
                            ref={dateInputRef}
                            type="date"
                            value={formData.appointment_date}
                            min={today}
                            onChange={(e) => { setFormData({ ...formData, appointment_date: e.target.value }); setFieldErrors((p) => ({ ...p, appointment_date: undefined })); }}
                            className={`w-full h-11 pl-11 pr-4 rounded-xl border bg-white text-sm text-deep focus:outline-none transition-colors cursor-pointer ${fieldErrors.appointment_date ? "border-red-400 focus:border-red-400" : "border-deep/20 focus:border-mauve"}`}
                          />
                        </div>
                        {fieldErrors.appointment_date && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.appointment_date}</p>}
                      </div>
                    </div>

                    {/* ── Time slot picker ── */}
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-deep/40 font-light block mb-2">
                        Select time slot
                      </label>

                      {slotStatus === "idle" && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-deep-tint/50 border border-deep/10">
                          <Clock3 className="h-4 w-4 text-deep/30" strokeWidth={1.5} />
                          <p className="text-sm text-deep/40 font-light">Choose a date first to see available slots</p>
                        </div>
                      )}

                      {slotStatus === "loading" && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-deep-tint/50 border border-deep/10">
                          <Loader2 className="h-4 w-4 text-mauve animate-spin" />
                          <p className="text-sm text-deep/50 font-light">Checking availability…</p>
                        </div>
                      )}

                      {slotStatus === "error" && (
                        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-red-50 border border-red-200">
                          <AlertCircle className="h-4 w-4 text-red-400 shrink-0" strokeWidth={1.5} />
                          <p className="text-sm text-red-500 font-light">Could not load slots. Please try again.</p>
                        </div>
                      )}

                      {slotStatus === "closed" && (
                        <div className="flex items-start gap-2 px-4 py-3 rounded-xl bg-mauve-tint border border-mauve/20">
                          <AlertCircle className="h-4 w-4 text-mauve mt-0.5 shrink-0" strokeWidth={1.5} />
                          <p className="text-sm text-deep/70 font-light">{closedReason}</p>
                        </div>
                      )}

                      {slotStatus === "loaded" && (
                        <div className="space-y-2">
                          {slots.map((slot) => {
                            const isSelected = selectedSlot?.start === slot.start;
                            const isAvailable = !slot.full && !slot.locked;
                            return (
                              <button
                                key={slot.start}
                                type="button"
                                disabled={!isAvailable}
                                onClick={() => handleSlotSelect(slot)}
                                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border-2 text-sm transition-all ${
                                  isSelected
                                    ? "border-mauve bg-mauve text-ivory"
                                    : slot.locked
                                    ? "border-deep/10 bg-deep-tint/40 text-deep/30 cursor-not-allowed"
                                    : slot.full
                                    ? "border-deep/10 bg-deep-tint/40 text-deep/30 cursor-not-allowed"
                                    : "border-deep/15 bg-white hover:border-mauve hover:bg-mauve-tint text-deep"
                                }`}
                              >
                                <div className="flex items-center gap-2">
                                  {slot.locked ? (
                                    <Lock className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                                  ) : (
                                    <Clock3 className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                                  )}
                                  <span className="font-light">{slot.label}</span>
                                </div>
                                <span className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                                  isSelected
                                    ? "bg-ivory/20 text-ivory"
                                    : slot.full
                                    ? "bg-deep/10 text-deep/40"
                                    : slot.locked
                                    ? "bg-deep/10 text-deep/30"
                                    : "bg-sage-tint text-sage"
                                }`}>
                                  {slot.full ? "Full" : slot.locked ? "Opens later" : `${slot.max - slot.count} spot${slot.max - slot.count === 1 ? "" : "s"} left`}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      )}

                      {fieldErrors.start_time && (
                        <p className="mt-1.5 text-[11px] text-red-500">{fieldErrors.start_time}</p>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-deep/40 font-light block mb-1.5">Additional notes (optional)</label>
                      <div className="relative">
                        <MessageSquare className="absolute left-4 top-3.5 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                        <textarea
                          value={formData.notes}
                          onChange={(e) => { setFormData({ ...formData, notes: e.target.value }); setFieldErrors((p) => ({ ...p, notes: undefined })); }}
                          placeholder="Any special requests or preferences..."
                          rows={3}
                          className={`w-full pl-11 pr-4 py-3 rounded-xl border bg-white text-sm text-deep placeholder:text-deep/30 focus:outline-none transition-colors resize-none ${fieldErrors.notes ? "border-red-400 focus:border-red-400" : "border-deep/20 focus:border-deep"}`}
                        />
                      </div>
                      {fieldErrors.notes && <p className="mt-1 text-[11px] text-red-500">{fieldErrors.notes}</p>}
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
                    <div className="text-right">
                      <p className="font-display text-2xl text-deep">₦{selectedService.price.toLocaleString()}</p>
                      {selectedService.original_price && selectedService.original_price > selectedService.price && (
                        <p className="text-xs text-deep/40 line-through">₦{selectedService.original_price.toLocaleString()}</p>
                      )}
                    </div>
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

                    {/* Moniwave — coming soon */}
                    <div className="relative select-none cursor-not-allowed">
                      <div className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-deep/10 bg-white text-left blur-[2px] pointer-events-none">
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
                        <ArrowRight className="h-4 w-4 text-deep/30 shrink-0" strokeWidth={1.5} />
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                        <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-deep/80 text-ivory tracking-wide">Coming Soon</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ══ STEP 4 / Card payment ════════════════════════════════ */}
              {step === 4 && selectedService && paymentMethod === "card" && (
                <motion.div key="step-4-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
                  <button onClick={() => { setStep(3); setGateway(null); setPaymentMethod(null); }} className="inline-flex items-center gap-1.5 text-sm text-deep/50 hover:text-deep mb-6 transition-colors">
                    <ArrowLeft className="h-4 w-4" /> Back to gateway
                  </button>

                  {/* Summary card */}
                  <div className="p-5 rounded-2xl bg-mauve-tint border border-mauve/20 mb-6 space-y-3">
                    <h3 className="text-[10px] uppercase tracking-wider text-deep/40 font-light">Booking summary</h3>
                    {[
                      { label: "Service",  value: selectedService.name },
                      { label: "Date",     value: new Date(formData.appointment_date).toLocaleDateString("en-NG", { weekday: "long", day: "numeric", month: "long" }) },
                      { label: "Time",     value: formData.start_time },
                      { label: "Customer", value: formData.customer_name },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between text-sm">
                        <span className="text-deep/50 font-light">{label}</span>
                        <span className="text-deep font-light">{value}</span>
                      </div>
                    ))}
                    <div className="flex items-center justify-between pt-3 border-t border-mauve/20">
                      <span className="text-sm text-deep font-light">Total</span>
                      <div className="text-right">
                        <span className="font-display text-2xl text-mauve">₦{selectedService.price.toLocaleString()}</span>
                        {selectedService.original_price && selectedService.original_price > selectedService.price && (
                          <p className="text-xs text-deep/40 line-through">₦{selectedService.original_price.toLocaleString()}</p>
                        )}
                      </div>
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

            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <SuccessNotification {...notification} onClose={hideSuccess} />
    </>
  );
}
