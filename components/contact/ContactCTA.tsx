"use client";

import { motion } from "framer-motion";
import { ArrowRight, Calendar, Phone } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

// WhatsApp icon (custom SVG)
const WhatsApp = ({ className, strokeWidth }: { className?: string; strokeWidth?: number }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth || 2}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
  </svg>
);

export function ContactCTA(): React.ReactElement {
  const [showBookingModal, setShowBookingModal] = useState(false);

  const ctaOptions = [
    {
      icon: Calendar,
      title: "Book online",
      description: "Schedule your treatment",
      onClick: () => setShowBookingModal(true), // Opens booking modal
      color: "mauve" as const,
    },
    {
      icon: Phone,
      title: "Call us",
      description: "+234 (0) 901 234 5678",
      href: "tel:+2349012345678",
      color: "sage" as const,
    },
    {
      icon: WhatsApp,
      title: "WhatsApp",
      description: "Get instant answers",
      href: "https://wa.me/2349012345678?text=Hi!%20I%27d%20like%20to%20know%20more%20about%20your%20services",
      color: "deep" as const,
    },
  ];

  return (
    <>
      <section className="relative py-20 sm:py-24 bg-ivory overflow-hidden">
        {/* Background pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(71,103,106,0.4) 1px, transparent 0)",
            backgroundSize: "32px 32px",
          }}
        />

        <div className="relative mx-auto max-w-[1200px] px-6 sm:px-10 lg:px-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="text-center mb-12"
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-deep leading-tight tracking-tight mb-4">
              Ready to begin your{" "}
              <em className="not-italic text-mauve">skincare journey</em>?
            </h2>
            <p className="text-base sm:text-lg font-light text-deep max-w-2xl mx-auto">
              Choose the way you'd like to connect with us. We're here to help.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {ctaOptions.map((option, idx) => {
              const Icon = option.icon;
              const accentBg =
                option.color === "mauve"
                  ? "bg-mauve"
                  : option.color === "sage"
                    ? "bg-sage"
                    : "bg-deep";
              const accentText =
                option.color === "mauve"
                  ? "text-mauve"
                  : option.color === "sage"
                    ? "text-sage"
                    : "text-deep";
              const accentBorder =
                option.color === "mauve"
                  ? "border-mauve"
                  : option.color === "sage"
                    ? "border-sage"
                    : "border-deep";
              const hoverBg =
                option.color === "mauve"
                  ? "hover:bg-mauve"
                  : option.color === "sage"
                    ? "hover:bg-sage"
                    : "hover:bg-deep";

              const content = (
                <>
                  <div className={`inline-flex h-12 w-12 rounded-xl items-center justify-center mb-4 ${accentBg} group-hover:bg-ivory transition-colors duration-300`}>
                    <Icon
                      className={`h-5 w-5 text-ivory group-hover:${accentText} transition-colors duration-300`}
                      strokeWidth={1.5}
                    />
                  </div>

                  <h3 className={`font-display text-xl font-light leading-tight tracking-tight mb-2 ${accentText} group-hover:text-ivory transition-colors duration-300`}>
                    {option.title}
                  </h3>

                  <p className="text-sm font-light text-deep mb-4 group-hover:text-ivory transition-colors duration-300">
                    {option.description}
                  </p>

                  <div className="inline-flex items-center gap-2 text-deep group-hover:text-ivory text-[10px] uppercase tracking-[0.15em] font-medium group-hover:gap-3 transition-all">
                    Connect
                    <ArrowRight className="h-3 w-3" strokeWidth={1.5} />
                  </div>
                </>
              );

              return (
                <motion.div
                  key={option.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: idx * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                >
                  {option.href ? (
                    <a
                      href={option.href}
                      target={option.title === "WhatsApp" ? "_blank" : undefined}
                      rel={option.title === "WhatsApp" ? "noopener noreferrer" : undefined}
                      className={`group block p-6 rounded-2xl bg-ivory border-2 ${accentBorder} ${hoverBg} transition-all duration-300 hover:shadow-[0_12px_40px_rgba(71,103,106,0.15)]`}
                    >
                      {content}
                    </a>
                  ) : (
                    <button
                      onClick={option.onClick}
                      className={`group block w-full text-left p-6 rounded-2xl bg-ivory border-2 ${accentBorder} ${hoverBg} transition-all duration-300 hover:shadow-[0_12px_40px_rgba(71,103,106,0.15)]`}
                    >
                      {content}
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Simple Booking Modal */}
      {showBookingModal && (
        <div className="fixed inset-0 bg-deep/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-ivory rounded-2xl max-w-md w-full p-8"
          >
            <h3 className="font-display text-2xl font-light text-deep mb-4">
              Book an Appointment
            </h3>
            <p className="text-sm text-deep/70 mb-6">
              To schedule your treatment, please visit our services page or contact us directly.
            </p>
            <div className="flex gap-3">
              <Link
                href="/services"
                className="flex-1 h-12 rounded-full bg-mauve text-ivory flex items-center justify-center text-sm font-medium hover:bg-mauve-dark transition-colors"
              >
                View Services
              </Link>
              <button
                onClick={() => setShowBookingModal(false)}
                className="flex-1 h-12 rounded-full border-2 border-deep/10 text-deep flex items-center justify-center text-sm font-medium hover:bg-deep-tint transition-colors"
              >
                Close
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}