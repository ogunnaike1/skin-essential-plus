"use client";

import { X, Trash2, CalendarCheck, Sparkles, Clock, ArrowRight } from "lucide-react";
import { useServiceCart } from "@/app/contexts/ServiceCartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { formatPrice } from "@/lib/services-data";
import BookAppointmentModal from "@/components/shared/BookAppointmentModal";

interface ServiceCartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ServiceCartDrawer({ isOpen, onClose }: ServiceCartDrawerProps) {
  const { services, removeService, clearServiceCart, serviceCount } = useServiceCart();
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const total = services.reduce((sum, s) => sum + s.price, 0);

  const handleBook = () => {
    onClose();
    setBookingOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="service-cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-deep/60 backdrop-blur-sm z-[90]"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="service-cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 h-[100dvh] w-full sm:w-[440px] z-[100] flex flex-col bg-ivory shadow-glass-lg"
          >
            {/* ── HEADER ── */}
            <div className="relative bg-gradient-deep px-6 pt-8 pb-6 shrink-0 overflow-hidden">
              <div
                className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
              />
              <div
                className="absolute bottom-0 left-0 h-24 w-24 rounded-full opacity-10 pointer-events-none"
                style={{ background: "radial-gradient(circle, #4F7288 0%, transparent 70%)" }}
              />

              <button
                onClick={onClose}
                className="absolute top-5 right-5 h-8 w-8 rounded-full bg-ivory/10 hover:bg-ivory/20 flex items-center justify-center transition-colors z-10"
                aria-label="Close bookings"
              >
                <X className="h-4 w-4 text-ivory" />
              </button>

              <div className="relative pr-10">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-mauve-tint" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-widest text-ivory/50 uppercase font-light">
                    Skin Essential Plus
                  </span>
                </div>
                <h2 className="font-display text-3xl font-light text-ivory leading-tight">
                  Bookings
                </h2>
                <p className="mt-1 text-xs text-ivory/50 font-light">
                  {serviceCount === 0
                    ? "No services selected"
                    : `${serviceCount} ${serviceCount === 1 ? "service" : "services"} selected`}
                </p>
              </div>
            </div>

            {/* ── BODY ── */}
            <div className="flex-1 flex flex-col overflow-hidden">

              {/* Empty state */}
              {services.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center">
                  <div className="relative mb-6">
                    <div className="h-24 w-24 rounded-full bg-mauve-tint flex items-center justify-center">
                      <CalendarCheck className="h-10 w-10 text-mauve" strokeWidth={1} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-deep-tint flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-deep/60" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-light text-deep mb-2">
                    No services added yet
                  </h3>
                  <p className="text-sm text-deep/50 font-light mb-8 max-w-xs leading-relaxed">
                    Browse our treatments and add services to book your perfect ritual.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 rounded-full bg-gradient-deep text-ivory text-sm font-light tracking-wide hover:opacity-90 transition-opacity"
                  >
                    Browse Services
                  </button>
                </div>
              )}

              {/* Services list + Summary */}
              {services.length > 0 && (
                <>
                  <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-4">
                    <div className="flex flex-col gap-3">
                      <AnimatePresence initial={false}>
                        {services.map((service) => (
                          <motion.div
                            key={service.id}
                            layout="position"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{
                              layout: { type: "spring", damping: 28, stiffness: 300 },
                              opacity: { duration: 0.18 },
                              scale: { duration: 0.18 },
                              y: { duration: 0.18 },
                            }}
                            className="relative flex gap-4 p-4 rounded-2xl bg-white shadow-glass border border-deep/5 hover:border-mauve/20 transition-colors"
                          >
                            {/* Image */}
                            <div className="relative h-[84px] w-[84px] rounded-xl overflow-hidden bg-mauve-tint shrink-0">
                              <Image
                                src={service.image}
                                alt={service.name}
                                fill
                                className="object-cover"
                              />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between pr-8">
                              <div>
                                <h4 className="font-display text-base font-light text-deep leading-snug line-clamp-2">
                                  {service.name}
                                </h4>
                                <span className="inline-flex items-center gap-1 mt-1 text-[11px] uppercase tracking-wider text-deep/40 font-light">
                                  <Clock className="h-3 w-3" strokeWidth={1.5} />
                                  {service.durationMinutes} min
                                </span>
                              </div>
                              <p className="font-display text-base text-mauve mt-2">
                                {formatPrice(service.price)}
                              </p>
                            </div>

                            {/* Remove */}
                            <button
                              onClick={() => removeService(service.id)}
                              className="absolute top-3 right-3 h-7 w-7 rounded-full flex items-center justify-center text-deep/30 hover:text-mauve hover:bg-mauve-tint transition-all"
                              aria-label="Remove service"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* ── SUMMARY PANEL ── */}
                  <div className="shrink-0 bg-deep-tint border-t border-deep/10 px-5 pt-4 pb-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between pt-3 border-t border-deep/10">
                        <span className="text-sm text-deep font-light tracking-wide">Total</span>
                        <span className="font-display text-2xl text-deep">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={handleBook}
                      className="w-full py-4 rounded-full bg-gradient-deep text-ivory font-light text-sm tracking-wide flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      Book Selected Services
                      <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </button>

                    <div className="text-center">
                      <button
                        onClick={() => {
                          if (confirm("Remove all selected services?")) clearServiceCart();
                        }}
                        className="text-[11px] text-deep/40 hover:text-deep/70 transition-colors tracking-wide"
                      >
                        Clear all
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <BookAppointmentModal isOpen={bookingOpen} onClose={() => setBookingOpen(false)} />
    </>
  );
}
