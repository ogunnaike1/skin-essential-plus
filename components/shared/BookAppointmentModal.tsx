"use client";

import { useEffect, useState, useMemo } from "react";
import { X, CalendarDays, Clock3, User, Mail, MessageSquare, ArrowRight, ArrowLeft, CheckCircle2, Phone, CreditCard, Building2, Copy, Check, Sparkles, Search, ChevronDown } from "lucide-react";
import Image from "next/image";
import Script from "next/script";
import { getPublicServices, type Service } from "@/lib/supabase/services-api-public";
import { createAppointment, type CreateAppointmentData } from "@/lib/supabase/appointments-api";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";

/**
 * Helper functions to safely access Service fields
 * Handles different field naming conventions from database
 */
const getServiceCategory = (service: Service): string => {
  return (service as any).category_name || (service as any).category || 'Other';
};

const getServiceDuration = (service: Service): number | string => {
  return (service as any).duration_minutes || (service as any).duration || 'N/A';
};

const getServiceImage = (service: Service): string | null => {
  return (service as any).image_url || (service as any).image || null;
};

type BookAppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
  preselectedService?: Service | null;
};

type Step = 1 | 2 | 3;
type PaymentMethod = "card" | "transfer" | null;

export default function BookAppointmentModal({
  isOpen,
  onClose,
  preselectedService,
}: BookAppointmentModalProps) {
  const [step, setStep] = useState<Step>(1);
  const [services, setServices] = useState<Service[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string; count: number }>>([]);
  const [loading, setLoading] = useState(false);
  const [selectedService, setSelectedService] = useState<Service | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(null);
  const [copied, setCopied] = useState(false);
  
  // Search and filter state
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  
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
      
      // Extract unique categories with counts
      const categoryMap = new Map<string, number>();
      data.forEach(service => {
        const categoryName = getServiceCategory(service);
        const count = categoryMap.get(categoryName) || 0;
        categoryMap.set(categoryName, count + 1);
      });
      
      const cats = Array.from(categoryMap.entries())
        .map(([name, count]) => ({
          id: name.toLowerCase().replace(/\s+/g, '-'),
          name,
          count
        }))
        .sort((a, b) => a.name.localeCompare(b.name));
      
      setCategories(cats);
      
      // Expand first category by default
      if (cats.length > 0) {
        setExpandedCategories(new Set([cats[0]!.id]));
      }
    } catch (error) {
      console.error('Error loading services:', error);
    }
  };

  // Filtered services based on search
  const filteredServices = useMemo(() => {
    if (!search.trim()) return services;
    
    const query = search.toLowerCase().trim();
    return services.filter(service => {
      const categoryName = getServiceCategory(service);
      return (
        service.name.toLowerCase().includes(query) ||
        service.description.toLowerCase().includes(query) ||
        categoryName.toLowerCase().includes(query)
      );
    });
  }, [services, search]);

  // Group services by category
  const servicesByCategory = useMemo(() => {
    const grouped = new Map<string, Service[]>();
    
    filteredServices.forEach(service => {
      const categoryName = getServiceCategory(service);
      const categoryId = categoryName.toLowerCase().replace(/\s+/g, '-');
      if (!grouped.has(categoryId)) {
        grouped.set(categoryId, []);
      }
      grouped.get(categoryId)!.push(service);
    });
    
    return grouped;
  }, [filteredServices]);

  // Count results
  const totalResults = filteredServices.length;

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
    setSearch("");
    setExpandedCategories(new Set(categories.length > 0 ? [categories[0]!.id] : []));
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

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep(3);
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const handleCardPayment = async () => {
    if (!selectedService) return;

    setLoading(true);
    try {
      const appointmentData: CreateAppointmentData = {
        ...formData,
        service_id: selectedService.id,
        service_name: selectedService.name,
        service_price: selectedService.price,
      };

      const appointment = await createAppointment(appointmentData);

      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: formData.customer_email,
        amount: selectedService.price * 100,
        currency: 'NGN',
        ref: `APPT-${appointment.id}`,
        metadata: {
          appointment_id: appointment.id,
          customer_name: formData.customer_name,
          service_name: selectedService.name,
        },
        callback: function(response: any) {
          showSuccess("appointment-booked", {
            title: "Payment Confirmed!",
            message: `Your appointment for ${selectedService.name} is confirmed`,
            details: `Reference: ${response.reference}`
          });
          
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
      const appointmentData: CreateAppointmentData = {
        ...formData,
        service_id: selectedService.id,
        service_name: selectedService.name,
        service_price: selectedService.price,
      };

      const appointment = await createAppointment(appointmentData);
      
      showSuccess("appointment-booked", {
        title: "Booking Created!",
        message: "Please complete the bank transfer to confirm your appointment",
        details: `Reference: APPT-${appointment.id}`
      });
      
      setTimeout(() => {
        handleClose();
      }, 2000);
    } catch (error) {
      console.error('Error creating appointment:', error);
      alert('Failed to create appointment. Please try again.');
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" />
      
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div
          className="absolute inset-0 bg-deep/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-3xl bg-ivory shadow-2xl">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-ivory border-b border-deep/10">
            <div className="flex h-2">
              <span className="flex-1 bg-mauve" />
              <span className="flex-1 bg-sage" />
              <span className="flex-1 bg-deep" />
            </div>
            
            <div className="flex items-center justify-between p-6">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  {step === 1 && <Sparkles className="h-5 w-5 text-mauve" />}
                  {step === 2 && <CalendarDays className="h-5 w-5 text-sage" />}
                  {step === 3 && <CreditCard className="h-5 w-5 text-deep" />}
                  <span className="text-xs uppercase tracking-wider text-deep/70 font-medium">
                    Step {step} of 3
                  </span>
                </div>
                <h2 className="font-display text-2xl sm:text-3xl font-light text-deep">
                  {step === 1 && "Choose a Service"}
                  {step === 2 && "Your Details"}
                  {step === 3 && "Payment"}
                </h2>
              </div>

              <button
                onClick={handleClose}
                className="flex h-10 w-10 items-center justify-center rounded-full text-deep hover:bg-deep hover:text-ivory transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 sm:p-8">
            {/* Step 1: Service Selection with Search */}
            {step === 1 && (
              <div>
                {/* Search Bar */}
                <div className="mb-6">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40" />
                    <input
                      type="text"
                      placeholder="Search services..."
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      className="w-full h-12 pl-11 pr-10 rounded-full bg-mauve-tint border-2 border-transparent text-deep placeholder:text-deep/50 text-sm font-light focus:border-mauve focus:outline-none transition-colors"
                    />
                    {search && (
                      <button
                        onClick={() => setSearch("")}
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-mauve/10 rounded-full transition-colors"
                      >
                        <X className="h-4 w-4 text-deep/40" />
                      </button>
                    )}
                  </div>
                  {search && (
                    <p className="mt-2 text-xs text-deep/60">
                      {totalResults} result{totalResults === 1 ? '' : 's'} found
                    </p>
                  )}
                </div>

                {/* Services by Category */}
                <div className="space-y-3">
                  {categories.map(category => {
                    const categoryServices = servicesByCategory.get(category.id) || [];
                    const isExpanded = expandedCategories.has(category.id);
                    
                    if (search && categoryServices.length === 0) return null;

                    return (
                      <div key={category.id} className="border-2 border-deep/10 rounded-2xl overflow-hidden">
                        {/* Category Header */}
                        <button
                          onClick={() => toggleCategory(category.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-mauve-tint transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <h3 className="font-display text-lg font-light text-deep">
                              {category.name}
                            </h3>
                            <span className="text-xs text-deep/50">
                              ({categoryServices.length})
                            </span>
                          </div>
                          <ChevronDown 
                            className={`h-5 w-5 text-deep/40 transition-transform duration-300 ${
                              isExpanded ? 'rotate-180' : ''
                            }`}
                          />
                        </button>

                        {/* Category Services */}
                        {isExpanded && (
                          <div className="border-t border-deep/10 p-4 bg-ivory space-y-2">
                            {categoryServices.map(service => (
                              <button
                                key={service.id}
                                onClick={() => handleServiceSelect(service)}
                                className="w-full flex items-center gap-4 p-4 rounded-xl hover:bg-sage-tint border-2 border-transparent hover:border-sage transition-all group"
                              >
                                {getServiceImage(service) && (
                                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
                                    <Image
                                      src={getServiceImage(service)!}
                                      alt={service.name}
                                      fill
                                      className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                  </div>
                                )}
                                <div className="flex-1 text-left">
                                  <h4 className="font-medium text-deep group-hover:text-sage transition-colors">
                                    {service.name}
                                  </h4>
                                  <p className="text-xs text-deep/60 line-clamp-1">
                                    {service.description}
                                  </p>
                                  <div className="flex items-center gap-3 mt-1">
                                    <span className="text-sm font-medium text-mauve">
                                      ₦{service.price.toLocaleString()}
                                    </span>
                                    <span className="text-xs text-deep/40">
                                      {getServiceDuration(service)} min
                                    </span>
                                  </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-deep/40 group-hover:text-sage group-hover:translate-x-1 transition-all" />
                              </button>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  {totalResults === 0 && (
                    <div className="text-center py-12">
                      <p className="text-deep/60">No services found matching "{search}"</p>
                      <button
                        onClick={() => setSearch("")}
                        className="mt-4 text-sm text-mauve hover:underline"
                      >
                        Clear search
                      </button>
                    </div>
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
                    Change service
                  </button>

                  <div className="rounded-2xl border-2 border-sage bg-sage-tint p-4">
                    <p className="text-xs text-deep/70 mb-1">Selected Service</p>
                    <h3 className="font-display text-xl font-light text-deep">{selectedService.name}</h3>
                    <div className="flex items-center gap-4 mt-2">
                      <span className="text-sm font-medium text-sage">₦{selectedService.price.toLocaleString()}</span>
                      <span className="text-xs text-deep/60">
                        {getServiceDuration(selectedService)} minutes
                      </span>
                    </div>
                  </div>
                </div>

                <form onSubmit={handleDetailsSubmit} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="eyebrow text-deep text-[9px] block mb-2">— Your name</label>
                      <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40" />
                        <input
                          type="text"
                          required
                          value={formData.customer_name}
                          onChange={(e) => setFormData({ ...formData, customer_name: e.target.value })}
                          placeholder="Ada Okafor"
                          className="w-full h-12 pl-11 pr-4 rounded-full bg-mauve-tint border-2 border-transparent text-deep placeholder:text-deep/50 text-sm font-light focus:border-mauve focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="eyebrow text-deep text-[9px] block mb-2">— Email address</label>
                      <div className="relative">
                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40" />
                        <input
                          type="email"
                          required
                          value={formData.customer_email}
                          onChange={(e) => setFormData({ ...formData, customer_email: e.target.value })}
                          placeholder="ada@example.com"
                          className="w-full h-12 pl-11 pr-4 rounded-full bg-sage-tint border-2 border-transparent text-deep placeholder:text-deep/50 text-sm font-light focus:border-sage focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="eyebrow text-deep text-[9px] block mb-2">— Phone number</label>
                      <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40" />
                        <input
                          type="tel"
                          required
                          value={formData.customer_phone}
                          onChange={(e) => setFormData({ ...formData, customer_phone: e.target.value })}
                          placeholder="+234 XXX XXX XXXX"
                          className="w-full h-12 pl-11 pr-4 rounded-full bg-deep-tint border-2 border-transparent text-deep placeholder:text-deep/50 text-sm font-light focus:border-deep focus:outline-none transition-colors"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="eyebrow text-deep text-[9px] block mb-2">— Preferred date</label>
                      <div className="relative">
                        <CalendarDays className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40" />
                        <input
                          type="date"
                          required
                          value={formData.appointment_date}
                          onChange={(e) => setFormData({ ...formData, appointment_date: e.target.value })}
                          min={new Date().toISOString().split('T')[0]}
                          className="w-full h-12 pl-11 pr-4 rounded-full bg-mauve-tint border-2 border-transparent text-deep text-sm font-light focus:border-mauve focus:outline-none transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="eyebrow text-deep text-[9px] block mb-2">— Preferred time</label>
                    <div className="relative">
                      <Clock3 className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40" />
                      <input
                        type="time"
                        required
                        value={formData.appointment_time}
                        onChange={(e) => setFormData({ ...formData, appointment_time: e.target.value })}
                        className="w-full h-12 pl-11 pr-4 rounded-full bg-sage-tint border-2 border-transparent text-deep text-sm font-light focus:border-sage focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="eyebrow text-deep text-[9px] block mb-2">— Additional notes (optional)</label>
                    <div className="relative">
                      <MessageSquare className="absolute left-4 top-4 h-4 w-4 text-deep/40" />
                      <textarea
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        placeholder="Any special requests or information we should know..."
                        rows={4}
                        className="w-full pl-11 pr-4 py-3 rounded-2xl bg-deep-tint border-2 border-transparent text-deep placeholder:text-deep/50 text-sm font-light focus:border-deep focus:outline-none transition-colors resize-none"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-sage px-6 py-4 text-sm font-medium text-ivory transition hover:bg-sage-dark"
                  >
                    Continue to Payment
                    <ArrowRight className="h-4 w-4" />
                  </button>
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
                  <p className="text-xs uppercase tracking-wider text-deep font-medium mb-2">Choose Payment Method</p>
                  <h2 className="font-display text-3xl sm:text-4xl font-light text-deep">
                    How would you like to pay?
                  </h2>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setPaymentMethod("card")}
                    className="group p-6 rounded-2xl border-2 border-mauve bg-mauve-tint hover:bg-mauve hover:shadow-lg transition-all"
                  >
                    <CreditCard className="h-8 w-8 text-mauve group-hover:text-ivory mb-4 transition-colors" />
                    <h3 className="font-display text-xl font-light text-deep group-hover:text-ivory mb-2 transition-colors">
                      Card Payment
                    </h3>
                    <p className="text-sm text-deep/70 group-hover:text-ivory/80 transition-colors">
                      Pay securely with Paystack
                    </p>
                  </button>

                  <button
                    onClick={() => setPaymentMethod("transfer")}
                    className="group p-6 rounded-2xl border-2 border-sage bg-sage-tint hover:bg-sage hover:shadow-lg transition-all"
                  >
                    <Building2 className="h-8 w-8 text-sage group-hover:text-ivory mb-4 transition-colors" />
                    <h3 className="font-display text-xl font-light text-deep group-hover:text-ivory mb-2 transition-colors">
                      Bank Transfer
                    </h3>
                    <p className="text-sm text-deep/70 group-hover:text-ivory/80 transition-colors">
                      Transfer to our account
                    </p>
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
                        <span>Send proof to <strong className="text-deep">+234 901 234 5678</strong> on WhatsApp</span>
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

      <SuccessNotification
        {...notification}
        onClose={hideSuccess}
      />
    </>
  );
}