"use client";

import { useEffect } from "react";
import { X, CalendarDays, Clock3, User, Mail, MessageSquare } from "lucide-react";

type BookAppointmentModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function BookAppointmentModal({
  isOpen,
  onClose,
}: BookAppointmentModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <button
        aria-label="Close modal"
        onClick={onClose}
        className="absolute inset-0 bg-deep/70 backdrop-blur-sm"
      />

      {/* Decorative glow */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[420px] w-[420px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-mauve/20 blur-3xl" />
      <div className="pointer-events-none absolute right-[10%] top-[20%] h-48 w-48 rounded-full bg-sage/20 blur-3xl" />

      {/* Modal - SCROLLABLE ON MOBILE */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="book-appointment-title"
        className="relative z-10 w-full h-full sm:h-auto sm:max-w-4xl overflow-y-auto sm:overflow-hidden sm:rounded-[28px] border-0 sm:border sm:border-ivory/40 bg-ivory shadow-[0_20px_60px_rgba(71,103,106,0.3)]"
      >
        {/* Top accent bar */}
        <div className="h-1.5 w-full flex">
          <span className="flex-1 bg-mauve" />
          <span className="flex-1 bg-sage" />
          <span className="flex-1 bg-deep" />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.1fr]">
          {/* Left panel */}
          <div className="relative overflow-hidden bg-deep px-6 py-8 text-ivory sm:px-8 sm:py-10">
            <div className="relative z-10">
              <p className="mb-3 inline-block rounded-full border border-ivory/20 bg-ivory/10 px-3 py-1 text-xs font-medium tracking-[0.2em] uppercase">
                Book a Consultation
              </p>

              <h2
                id="book-appointment-title"
                className="font-display text-3xl leading-tight sm:text-4xl font-light"
              >
                Let's create something calm, elegant, and intentional.
              </h2>

              <p className="mt-4 max-w-md text-sm leading-6 text-ivory font-light sm:text-base">
                Reserve your appointment and share a few details. We'll reach out
                with the next steps and confirm your preferred time.
              </p>

              <div className="mt-8 space-y-4">
                <div className="flex items-start gap-3 rounded-2xl border border-ivory/10 bg-ivory/10 p-4">
                  <div className="mt-0.5 rounded-xl bg-mauve p-2">
                    <CalendarDays className="h-5 w-5 text-ivory" />
                  </div>
                  <div>
                    <p className="font-medium text-ivory">Flexible scheduling</p>
                    <p className="text-sm text-ivory/75 font-light">
                      Choose a date and time that works best for you.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-2xl border border-ivory/10 bg-ivory/10 p-4">
                  <div className="mt-0.5 rounded-xl bg-sage p-2">
                    <Clock3 className="h-5 w-5 text-ivory" />
                  </div>
                  <div>
                    <p className="font-medium text-ivory">Quick response</p>
                    <p className="text-sm text-ivory/75 font-light">
                      We typically confirm bookings within one business day.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right panel / form */}
          <div className="relative px-6 py-8 sm:px-8 sm:py-10">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 rounded-full border border-deep/10 bg-ivory p-2 text-deep transition hover:bg-mauve-tint"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="max-w-xl">
              <h3 className="font-display text-2xl text-deep sm:text-3xl font-light">
                Book your appointment
              </h3>
              <p className="mt-2 text-sm leading-6 text-deep font-light">
                Fill in your details below and we'll get back to you shortly.
              </p>

              <form className="mt-8 space-y-4">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-deep">
                      Full Name
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-deep/10 bg-mauve-tint px-4 py-3 transition focus-within:border-mauve focus-within:bg-ivory">
                      <User className="h-4 w-4 text-mauve" />
                      <input
                        type="text"
                        placeholder="Your full name"
                        className="w-full bg-transparent text-sm text-deep placeholder:text-deep/50 outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-deep">
                      Email Address
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-deep/10 bg-sage-tint px-4 py-3 transition focus-within:border-sage focus-within:bg-ivory">
                      <Mail className="h-4 w-4 text-sage" />
                      <input
                        type="email"
                        placeholder="you@example.com"
                        className="w-full bg-transparent text-sm text-deep placeholder:text-deep/50 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-sm font-medium text-deep">
                      Preferred Date
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-deep/10 bg-deep-tint px-4 py-3 transition focus-within:border-deep focus-within:bg-ivory">
                      <CalendarDays className="h-4 w-4 text-deep" />
                      <input
                        type="date"
                        className="w-full bg-transparent text-sm text-deep outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-deep">
                      Preferred Time
                    </label>
                    <div className="flex items-center gap-3 rounded-2xl border border-deep/10 bg-deep-tint px-4 py-3 transition focus-within:border-deep focus-within:bg-ivory">
                      <Clock3 className="h-4 w-4 text-deep" />
                      <input
                        type="time"
                        className="w-full bg-transparent text-sm text-deep outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-deep">
                    Message
                  </label>
                  <div className="flex gap-3 rounded-2xl border border-deep/10 bg-mauve-tint px-4 py-3">
                    <MessageSquare className="mt-1 h-4 w-4 text-mauve" />
                    <textarea
                      rows={5}
                      placeholder="Tell us a little about what you're looking for..."
                      className="w-full resize-none bg-transparent text-sm text-deep placeholder:text-deep/50 outline-none"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs leading-5 text-deep/60 font-light">
                    By submitting, you agree to be contacted regarding your appointment.
                  </p>

                  <button
                    type="submit"
                    className="inline-flex items-center justify-center rounded-full bg-deep px-6 py-3 text-sm font-medium text-ivory transition hover:bg-deep-dark focus:outline-none focus:ring-2 focus:ring-mauve/40"
                  >
                    Confirm Appointment
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}