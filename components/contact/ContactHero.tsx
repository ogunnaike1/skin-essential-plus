"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

/**
 * Contact page hero with headline and quick contact methods
 */
export function ContactHero(): React.ReactElement {
  const contactMethods = [
    {
      icon: Phone,
      label: "Phone",
      value: "+234 (0) 901 234 5678",
      href: "tel:+2349012345678",
      color: "mauve" as const,
    },
    {
      icon: Mail,
      label: "Email",
      value: "hello@skinessential.ng",
      href: "mailto:hello@skinessential.ng",
      color: "sage" as const,
    },
    {
      icon: MapPin,
      label: "Location",
      value: "Lekki Phase 1, Lagos",
      href: "#location",
      color: "deep" as const,
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Mon–Sat, 9am–7pm",
      href: "#hours",
      color: "mauve" as const,
    },
  ];

  return (
    <section className="relative min-h-[60vh] flex items-center bg-ivory overflow-hidden">
      {/* Background image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070')",
        }}
      />
      
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-deep/40" />
      
      {/* Gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(138,111,136,0.6) 0%, rgba(79,114,136,0.5) 50%, rgba(71,103,106,0.7) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] w-full px-6 sm:px-10 lg:px-14 py-20 sm:py-24">
        <div className="max-w-4xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2 mb-6"
          >
            <span className="h-px w-12 bg-ivory" />
            <span className="eyebrow text-ivory text-[10px]">— Get in touch</span>
            <span className="h-px w-12 bg-ivory" />
          </motion.div>

          {/* Main headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-ivory leading-[1.1] tracking-tight mb-6"
          >
            We'd love to{" "}
            <em className="not-italic text-ivory drop-shadow-lg">hear from you</em>.
          </motion.h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg font-light text-ivory max-w-2xl mx-auto mb-12"
          >
            Whether you're booking your first treatment, have questions about our
            products, or simply want to say hello — our team is here to help.
          </motion.p>

          {/* Contact methods grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {contactMethods.map((method, idx) => {
              const Icon = method.icon;
              const accentBg: Record<typeof method.color, string> = {
                mauve: "bg-mauve",
                sage: "bg-sage",
                deep: "bg-deep",
              };
              const accentText: Record<typeof method.color, string> = {
                mauve: "text-mauve",
                sage: "text-sage",
                deep: "text-deep",
              };
              const accentTint: Record<typeof method.color, string> = {
                mauve: "bg-mauve-tint",
                sage: "bg-sage-tint",
                deep: "bg-deep-tint",
              };

              return (
                <motion.a
                  key={method.label}
                  href={method.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    delay: 0.4 + idx * 0.1,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative p-5 rounded-2xl bg-ivory border-2 border-deep/10 hover:border-deep/20 transition-all duration-300 hover:shadow-[0_8px_24px_rgba(71,103,106,0.12)] text-left"
                >
                  {/* Icon */}
                  <div
                    className={`inline-flex h-11 w-11 rounded-xl items-center justify-center mb-4 transition-colors duration-300 ${accentTint[method.color]} group-hover:${accentBg[method.color]}`}
                  >
                    <Icon
                      className={`h-5 w-5 transition-colors duration-300 ${accentText[method.color]} group-hover:text-ivory`}
                      strokeWidth={1.5}
                    />
                  </div>

                  {/* Label */}
                  <p className="eyebrow text-deep text-[9px] mb-1.5">
                    — {method.label}
                  </p>

                  {/* Value */}
                  <p className="text-sm font-light text-deep group-hover:text-deep transition-colors">
                    {method.value}
                  </p>
                </motion.a>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}