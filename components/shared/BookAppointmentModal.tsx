"use client";

import { useEffect, useState } from "react";
import { X, CalendarDays, Clock3, User, Mail, MessageSquare, ArrowRight, ArrowLeft, CheckCircle2, Phone, CreditCard, Building2, Copy, Check, Sparkles } from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import { getPublicServices } from "@/lib/supabase/services-api";
import { createAppointment, type CreateAppointmentData } from "@/lib/supabase/appointments-api";
import type { Service } from "@/lib/supabase/types";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";

type BookAppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: Service | null; // New prop for preselected service
};

type Step = 1 | 2 | 3;
type PaymentMethod = "card" | "transfer" | null;

// Service categories for navigation
const SERVICE_CATEGORIES = [
  { id: "facial", label: "Facial Treatments", color: "mauve" as const },
  { id: "body", label: "Body Treatments", color: "sage" as const },
  { id: "specialty", label: "Specialty Services", color: "deep" as const },
];

export default function BookAppointmentModal({
  isOpen,
  onClose,
  preselectedService,
}: BookAppointmentModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [copied, setCopied] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | "all">("all");
  
  // Success notification hook
  const { notification, showSuccess, hideSuccess } = useSuccessNotification();
  
  // Form data
  const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    customer_phone: "",
    appointment_date: "",
    appointment_time: "",
    message: "",
  });

  // Load services when modal opens
  useEffect(() => {
    if (isOpen && step === 1) {
      loadServices();
    }
  }, [isOpen, step]);

  // Handle preselected service
  useEffect(() => {
    if (preselectedService && isOpen) {
      setSelectedService(preselectedService);
      setStep(2); // Skip to details step
    }
  }, [preselectedService, isOpen]);

  const loadServices = async () => {
    try {
      const data = await getPublicServices();
      setServices(data);
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };

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
    setPaymentMethod(null);
    setActiveCategory("all");
    setFormData({
      customer_name: "",
      customer_email: "",
      customer_phone: "",
      appointment_date: "",
      appointment_time: "",
      message: "",
    });
    onClose();
  };

  const handleServiceSelect = (service: Service) => {
    setSelectedService(service);
    setStep(2);
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const handleCardPayment = async () => {
    if (!selectedService) return;

    setLoading(true);
    try {
      // Create appointment in database
      const appointmentData: CreateAppointmentData = {
        ...formData,
        service_id: selectedService.id,
        service_name: selectedService.name,
        service_price: selectedService.price,
      };

      const appointment = await createAppointment(appointmentData);

      // Initialize Paystack payment
      // @ts-ignore - PaystackPop is loaded via script
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: formData.customer_email,
        amount: selectedService.price * 100, // Convert to kobo
        currency: 'NGN',
        ref: `APPT-${appointment.id}`,
        metadata: {
          appointment_id: appointment.id,
          customer_name: formData.customer_name,
          service_name: selectedService.name,
        },
        callback: function(response: any) {
          // Show success notification
          showSuccess("appointment-booked", {
            title: "Payment Confirmed!",
            message: `Your appointment for ${selectedService.name} is confirmed`,
            details: `Reference: ${response.reference}`
          });
          
          // Close modal after showing notification
          setTimeout(() => {
            handleClose();
          }, 1500);
        },
        onClose: function() {
          setLoading(false);
        }
      });

      handler.openIframe();
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment. Please try again.');
      setLoading(false);
    }
  };

  const handleBankTransfer = async () => {
    if (!selectedService) return;

    setLoading(true);
    try {
      // Create appointment with pending payment
      const appointmentData: CreateAppointmentData = {
        ...formData,
        service_id: selectedService.id,
        service_name: selectedService.name,
        service_price: selectedService.price,
      };

      const appointment = await createAppointment(appointmentData);
      
      // Show success notification
      showSuccess("appointment-booked", {
        title: "Booking Created!",
        message: "Please complete the bank transfer to confirm your appointment",
        details: `Reference: APPT-${appointment.id}`
      });
      
      // Close modal after showing notification
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter services by category
  const filteredServices = activeCategory === "all" 
    ? services 
    : services.filter(s => s.category === activeCategory);

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6">
        {/* Backdrop */}
        <button
          aria-label="Close modal"
          onClick={handleClose}
          className="absolute inset-0 bg-deep/70 backdrop-blur-sm"
        />

        {/* Decorative glow */}
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mauve/20 blur-3xl" />
        <div className="pointer-events-none absolute right-[10%] top-[20%] h-48 w-48 rounded-full bg-sage/20 blur-3xl" />

        {/* Modal */}
        <div
          role="dialog"
          aria-modal="true"
          className="relative z-10 w-full h-full sm:h-auto sm:max-w-4xl overflow-y-auto sm:overflow-hidden sm:rounded-[28px] border-0 sm:border sm:border-ivory/40 bg-ivory shadow-[0_20px_60px_rgba(71,103,106,0.3)]"
        >
          {/* Top accent bar */}
          <div className="h-1.5 w-full flex">
            <span className={`flex-1 transition-all ${step >= 1 ? 'bg-mauve' : 'bg-mauve/30'}`} />
            <span className={`flex-1 transition-all ${step >= 2 ? 'bg-sage' : 'bg-sage/30'}`} />
            <span className={`flex-1 transition-all ${step >= 3 ? 'bg-deep' : 'bg-deep/30'}`} />
          </div>

          <div className="relative px-6 py-8 sm:px-8 sm:py-10">
            <button
              onClick={handleClose}
              className="absolute right-4 top-4 rounded-full border border-deep/10 bg-ivory p-2 text-deep transition hover:bg-mauve-tint"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Step 1: Select Service */}
            {step === 1 && (
              <div>
                <div className="mb-6">
                  <p className="text-xs uppercase tracking-wider text-mauve font-medium mb-2">Step 1 of 3</p>
                  <h2 className="font-display text-3xl sm:text-4xl font-light text-deep">
                    Choose your service
                  </h2>
                  <p className="mt-2 text-sm text-deep/70">
                    Select the service you'd like to book
                  </p>
                </div>

                {/* Category Filter */}
                <div className="mb-6 flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveCategory("all")}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${
                      activeCategory === "all"
                        ? "bg-deep text-ivory"
                        : "bg-deep-tint text-deep hover:bg-deep hover:text-ivory"
                    }`}
                  >
                    All Services
                  </button>
                  {SERVICE_CATEGORIES.map((cat) => {
                    const isActive = activeCategory === cat.id;
                    const colorClasses = {
                      mauve: isActive ? "bg-mauve text-ivory" : "bg-mauve-tint text-deep hover:bg-mauve hover:text-ivory",
                      sage: isActive ? "bg-sage text-ivory" : "bg-sage-tint text-deep hover:bg-sage hover:text-ivory",
                      deep: isActive ? "bg-deep text-ivory" : "bg-deep-tint text-deep hover:bg-deep hover:text-ivory",
                    };
                    
                    return (
                      <button
                        key={cat.id}
                        onClick={() => setActiveCategory(cat.id)}
                        className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${colorClasses[cat.color]}`}
                      >
                        {cat.label}
                      </button>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-2">
                  {filteredServices.length === 0 ? (
                    <div className="col-span-2 text-center py-10">
                      <p className="text-deep/60">No services found in this category</p>
                    </div>
                  ) : (
                    filteredServices.map((service) => (
                      <button
                        key={service.id}
                        onClick={() => handleServiceSelect(service)}
                        className="group text-left rounded-2xl border-2 border-deep/10 hover:border-mauve transition-all overflow-hidden bg-ivory hover:shadow-lg"
                      >
                        <div className="relative h-40 bg-deep-tint overflow-hidden">
                          {service.image_url ? (
                            <Image
                              src={service.image_url}
                              alt={service.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-mauve-tint">
                              <Sparkles className="h-12 w-12 text-mauve" />
                            </div>
                          )}
                          <div className="absolute top-3 right-3 px-3 py-1 rounded-full bg-ivory/90 backdrop-blur">
                            <span className="text-sm font-medium text-deep">
                              ₦{service.price.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="p-4">
                          <h3 className="font-display text-lg font-light text-deep mb-1">
                            {service.name}
                          </h3>
                          <p className="text-xs text-deep/60 line-clamp-2">
                            {service.description}
                          </p>
                          <div className="mt-3 flex items-center gap-2">
                            <Clock3 className="h-3 w-3 text-mauve" />
                            <span className="text-xs text-deep/70">
                              {(service as any).duration || '60 mins'}
                            </span>
                          </div>
                        </div>
                      </button>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Customer Details */}
            {step === 2 && selectedService && (
              <div>
                <div className="mb-8">
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-2 text-sm text-deep/70 hover:text-deep mb-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to services
                  </button>
                  <p className="text-xs uppercase tracking-wider text-sage font-medium mb-2">Step 2 of 3</p>
                  <h2 className="font-display text-3xl sm:text-4xl font-light text-deep">
                    Your details
                  </h2>
                  <p className="mt-2 text-sm text-deep/70">
                    Booking: <span className="font-medium text-deep">{selectedService.name}</span> - ₦{selectedService.price.toLocaleString()}
                  </p>
                </div>

                <form onSubmit={handleDetailsSubmit} className="space-y-5">
                  {/* Paystack Script - must be inside form element */}
                  <Script src="https://js.paystack.co/v1/inline.js" strategy="lazyOnload" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-deep">
                        Full Name *
                      </label>
                      <div className="flex items-center gap-3 rounded-2xl border border-deep/10 bg-mauve-tint px-4 py-3 transition focus-within:border-mauve focus-within:bg-ivory">
                        <User className="h-4 w-4 text-mauve" />
                        <input
                          type="text"
                          required
                          value={formData.customer_name}
                          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                          placeholder="Your full name"
                          className="w-full bg-transparent text-sm text-deep placeholder:text-deep/50 outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-deep">
                        Email Address *
                      </label>
                      <div className="flex items-center gap-3 rounded-2xl border border-deep/10 bg-sage-tint px-4 py-3 transition focus-within:border-sage focus-within:bg-ivory">
                        <Mail className="h-4 w-4 text-sage" />
                        <input
                          type="email"
                          required
                          value={formData.customer_email}
                          onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                          placeholder="you@example.com"
                          className="w-full bg-transparent text-sm text-deep placeholder:text-deep/50 outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-deep">
                      Phone Number *
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-deep/10 bg-deep-tint px-4 py-3 transition focus-within:border-deep focus-within:bg-ivory">
                      <Phone className="h-4 w-4 text-deep" />
                      <input
                        type="tel"
                        required
                        value={formData.customer_phone}
                        onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                        placeholder="080XXXXXXXX"
                        className="w-full bg-transparent text-sm text-deep placeholder:text-deep/50 outline-none"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="mb-2 block text-sm font-medium text-deep">
                        Preferred Date *
                      </label>
                      <div className="flex items-center gap-3 rounded-2xl border border-deep/10 bg-deep-tint px-4 py-3 transition focus-within:border-deep focus-within:bg-ivory">
                        <CalendarDays className="h-4 w-4 text-deep" />
                        <input
                          type="date"
                          required
                          value={formData.appointment_date}
                          onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full bg-transparent text-sm text-deep outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-2 block text-sm font-medium text-deep">
                        Preferred Time *
                      </label>
                      <div className="flex items-center gap-3 rounded-2xl border border-deep/10 bg-deep-tint px-4 py-3 transition focus-within:border-deep focus-within:bg-ivory">
                        <Clock3 className="h-4 w-4 text-deep" />
                        <input
                          type="time"
                          required
                          value={formData.appointment_time}
                          onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                          className="w-full bg-transparent text-sm text-deep outline-none"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-deep">
                      Additional Notes (Optional)
                    </label>
                    <div className="flex gap-3 rounded-2xl border border-deep/10 bg-mauve-tint px-4 py-3">
                      <MessageSquare className="mt-1 h-4 w-4 text-mauve" />
                      <textarea
                        rows={4}
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Any special requests or information we should know..."
                        className="w-full resize-none bg-transparent text-sm text-deep placeholder:text-deep/50 outline-none"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end pt-4">
                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-full bg-sage px-6 py-3 text-sm font-medium text-ivory transition hover:bg-sage-dark"
                    >
                      Continue to Payment
                      <ArrowRight className="h-4 w-4" />
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Step 3: Payment Method Selection */}
            {step === 3 && selectedService && !paymentMethod && (
              <div>
                <div className="mb-8">
                  <button
                    onClick={() => setStep(2)}
                    className="inline-flex items-center gap-2 text-sm text-deep/70 hover:text-deep mb-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to details
                  </button>
                  <p className="text-xs uppercase tracking-wider text-deep font-medium mb-2">Step 3 of 3</p>
                  <h2 className="font-display text-3xl sm:text-4xl font-light text-deep">
                    Choose payment method
                  </h2>
                  <p className="mt-2 text-sm text-deep/70">
                    Total: <span className="font-display text-xl font-medium text-mauve">₦{selectedService.price.toLocaleString()}</span>
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Card Payment */}
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className="group text-left rounded-2xl border-2 border-deep/10 hover:border-mauve transition-all p-6 bg-mauve-tint hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-mauve p-3">
                        <CreditCard className="h-6 w-6 text-ivory" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-light text-deep mb-2">
                          Pay with Card
                        </h3>
                        <p className="text-sm text-deep/70 mb-3">
                          Instant confirmation with Paystack
                        </p>
                        <ul className="space-y-1 text-xs text-deep/60">
                          <li>✓ Instant confirmation</li>
                          <li>✓ Secure payment</li>
                          <li>✓ All cards accepted</li>
                        </ul>
                      </div>
                    </div>
                  </button>

                  {/* Bank Transfer */}
                  <button
                    onClick={() => setPaymentMethod("transfer")}
                    className="group text-left rounded-2xl border-2 border-deep/10 hover:border-sage transition-all p-6 bg-sage-tint hover:shadow-lg"
                  >
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-sage p-3">
                        <Building2 className="h-6 w-6 text-ivory" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-display text-xl font-light text-deep mb-2">
                          Bank Transfer
                        </h3>
                        <p className="text-sm text-deep/70 mb-3">
                          Pay directly to our account
                        </p>
                        <ul className="space-y-1 text-xs text-deep/60">
                          <li>✓ No transaction fees</li>
                          <li>✓ Confirmed within 24hrs</li>
                          <li>✓ Send proof via WhatsApp</li>
                        </ul>
                      </div>
                    </div>
                  </button>
                </div>
              </div>
            )}

            {/* Card Payment View */}
            {step === 3 && selectedService && paymentMethod === "card" && (
              <div>
                <div className="mb-8">
                  <button
                    onClick={() => setPaymentMethod(null)}
                    className="inline-flex items-center gap-2 text-sm text-deep/70 hover:text-deep mb-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to payment methods
                  </button>
                  <p className="text-xs uppercase tracking-wider text-mauve font-medium mb-2">Card Payment</p>
                  <h2 className="font-display text-3xl sm:text-4xl font-light text-deep">
                    Review & Pay
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Booking Summary */}
                  <div className="rounded-2xl border-2 border-deep/10 bg-mauve-tint p-6">
                    <h3 className="font-medium text-deep mb-4">Booking Summary</h3>
                    
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-deep/70">Service</span>
                        <span className="font-medium text-deep">{selectedService.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-deep/70">Date</span>
                        <span className="font-medium text-deep">{new Date(formData.appointment_date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-deep/70">Time</span>
                        <span className="font-medium text-deep">{formData.appointment_time}</span>
                      </div>
                      <div className="border-t border-deep/10 pt-3 flex justify-between">
                        <span className="text-deep/70">Total Amount</span>
                        <span className="font-display text-xl font-medium text-mauve">
                          ₦{selectedService.price.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleCardPayment}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-mauve px-6 py-4 text-sm font-medium text-ivory transition hover:bg-mauve-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>Processing...</>
                    ) : (
                      <>
                        <CreditCard className="h-4 w-4" />
                        Pay ₦{selectedService.price.toLocaleString()} with Paystack
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-deep/60">
                    Secure payment powered by Paystack
                  </p>
                </div>
              </div>
            )}

            {/* Bank Transfer View */}
            {step === 3 && selectedService && paymentMethod === "transfer" && (
              <div>
                <div className="mb-8">
                  <button
                    onClick={() => setPaymentMethod(null)}
                    className="inline-flex items-center gap-2 text-sm text-deep/70 hover:text-deep mb-4"
                  >
                    <ArrowLeft className="h-4 w-4" />
                    Back to payment methods
                  </button>
                  <p className="text-xs uppercase tracking-wider text-sage font-medium mb-2">Bank Transfer</p>
                  <h2 className="font-display text-3xl sm:text-4xl font-light text-deep">
                    Complete your transfer
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Bank Details */}
                  <div className="rounded-2xl border-2 border-sage bg-sage-tint p-6">
                    <h3 className="font-medium text-deep mb-4 flex items-center gap-2">
                      <Building2 className="h-5 w-5 text-sage" />
                      Bank Account Details
                    </h3>
                    
                    <div className="space-y-4">
                      <div>
                        <p className="text-xs text-deep/70 mb-1">Bank Name</p>
                        <div className="flex items-center justify-between bg-ivory rounded-xl p-3">
                          <p className="font-medium text-deep">GTBank</p>
                          <button
                            onClick={() => copyToClipboard("GTBank")}
                            className="p-1.5 rounded-lg hover:bg-sage-tint transition-colors"
                          >
                            {copied ? <Check className="h-4 w-4 text-sage" /> : <Copy className="h-4 w-4 text-deep/40" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-deep/70 mb-1">Account Number</p>
                        <div className="flex items-center justify-between bg-ivory rounded-xl p-3">
                          <p className="font-display text-lg font-medium text-deep">0123456789</p>
                          <button
                            onClick={() => copyToClipboard("0123456789")}
                            className="p-1.5 rounded-lg hover:bg-sage-tint transition-colors"
                          >
                            {copied ? <Check className="h-4 w-4 text-sage" /> : <Copy className="h-4 w-4 text-deep/40" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-deep/70 mb-1">Account Name</p>
                        <div className="flex items-center justify-between bg-ivory rounded-xl p-3">
                          <p className="font-medium text-deep">Skin Essential Plus Ltd</p>
                          <button
                            onClick={() => copyToClipboard("Skin Essential Plus Ltd")}
                            className="p-1.5 rounded-lg hover:bg-sage-tint transition-colors"
                          >
                            {copied ? <Check className="h-4 w-4 text-sage" /> : <Copy className="h-4 w-4 text-deep/40" />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs text-deep/70 mb-1">Amount to Transfer</p>
                        <div className="bg-ivory rounded-xl p-3">
                          <p className="font-display text-2xl font-medium text-sage">
                            ₦{selectedService.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="rounded-2xl border-2 border-deep/10 bg-mauve-tint p-6">
                    <h3 className="font-medium text-deep mb-3">Next Steps</h3>
                    <ol className="space-y-2 text-sm text-deep/70">
                      <li className="flex gap-3">
                        <span className="font-medium text-mauve">1.</span>
                        <span>Transfer ₦{selectedService.price.toLocaleString()} to the account above</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-medium text-mauve">2.</span>
                        <span>Take a screenshot of your payment confirmation</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-medium text-mauve">3.</span>
                        <span>Send proof to <strong className="text-deep">+234 XXX XXX XXXX</strong> on WhatsApp</span>
                      </li>
                      <li className="flex gap-3">
                        <span className="font-medium text-mauve">4.</span>
                        <span>We'll confirm your booking within 24 hours</span>
                      </li>
                    </ol>
                  </div>

                  <button
                    onClick={handleBankTransfer}
                    disabled={loading}
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-sage px-6 py-4 text-sm font-medium text-ivory transition hover:bg-sage-dark disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <>Creating booking...</>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        I've Made the Transfer
                      </>
                    )}
                  </button>
                  <p className="text-xs text-center text-deep/60">
                    Your booking will be confirmed once payment is verified
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Success Notification */}
      <SuccessNotification
        {...notification}
        onClose={hideSuccess}
      />
    </>
  );
}