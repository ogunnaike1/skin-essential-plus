"use client";

import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Clock } from "lucide-react";

export function ContactHero(): React.ReactElement {
  const contactMethods = [
    {
      icon: Phone,
      label: "Phone",
      value: "+234 812 973 9806",
      href: "tel:+2348129739806",
      color: "mauve" as const,
    },
    {
      icon: Mail,
      label: "Email",
      value: "skinessentialsp@gmail.com",
      onClick: () => {
        const formElement = document.getElementById("contact-form");
        if (formElement) {
          formElement.scrollIntoView({ behavior: "smooth", block: "start" });
          setTimeout(() => {
            const firstInput = formElement.querySelector("input");
            firstInput?.focus();
          }, 800);
        }
      },
      color: "sage" as const,
    },
    {
      icon: MapPin,
      label: "Location",
      value: "No 2, Alaafia Ave, Akobo, Ibadan",
      href: "https://maps.google.com/?q=No+2+Alaafia+Avenue+Akobo+Ibadan+Nigeria",
      color: "deep" as const,
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Mon–Sat · 10am – 6pm",
      color: "mauve" as const,
    },
  ];

  const accentTint = { mauve: "bg-mauve/15", sage: "bg-sage/15", deep: "bg-deep/15" };
  const accentText = { mauve: "text-mauve", sage: "text-sage", deep: "text-deep" };
  const accentBorder = { mauve: "hover:border-mauve/40", sage: "hover:border-sage/40", deep: "hover:border-deep/40" };

  return (
    <section className="relative min-h-[65vh] flex items-center bg-ivory overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1544161515-4ab6ce6db874?q=80&w=2070')",
        }}
      />
      <div className="absolute inset-0 bg-deep/50" />
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, rgba(138,111,136,0.55) 0%, rgba(79,114,136,0.45) 50%, rgba(71,103,106,0.65) 100%)",
        }}
      />

      <div className="relative mx-auto max-w-[1400px] w-full px-6 sm:px-10 lg:px-14 py-20 sm:py-28">
        <div className="max-w-3xl mx-auto text-center">
          {/* Eyebrow */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-3 mb-6"
          >
            <span className="h-px w-10 bg-ivory/60" />
            <span className="eyebrow text-ivory/80 text-[10px] tracking-widest">Get in touch</span>
            <span className="h-px w-10 bg-ivory/60" />
          </motion.div>

          {/* Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-ivory leading-[1.1] tracking-tight mb-5"
          >
            We'd love to hear{" "}
            <em className="not-italic text-ivory/70">from you</em>.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="text-base sm:text-lg font-light text-ivory/80 max-w-xl mx-auto mb-12"
          >
            Whether you're booking your first treatment or simply want to say
            hello — our team is here for you.
          </motion.p>

          {/* Cards */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-3"
          >
            {contactMethods.map((method, idx) => {
              const Icon = method.icon;
              const inner = (
                <div className="flex items-center gap-3 w-full">
                  <div
                    className={`shrink-0 h-10 w-10 rounded-xl flex items-center justify-center ${accentTint[method.color]}`}
                  >
                    <Icon className={`h-4 w-4 ${accentText[method.color]}`} strokeWidth={1.5} />
                  </div>
                  <div className="text-left min-w-0">
                    <p className="text-[9px] uppercase tracking-widest text-deep/40 font-medium mb-0.5">
                      {method.label}
                    </p>
                    <p className="text-xs sm:text-sm font-light text-deep leading-snug truncate">
                      {method.value}
                    </p>
                  </div>
                </div>
              );

              const baseCard =
                "group w-full flex items-center p-4 rounded-2xl bg-ivory border-2 border-transparent transition-all duration-300 hover:shadow-[0_8px_24px_rgba(71,103,106,0.15)]";

              return (
                <motion.div
                  key={method.label}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.4 + idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
                >
                  {method.onClick ? (
                    <button
                      onClick={method.onClick}
                      className={`${baseCard} ${accentBorder[method.color]}`}
                    >
                      {inner}
                    </button>
                  ) : method.href ? (
                    <a
                      href={method.href}
                      target={method.label === "Location" ? "_blank" : undefined}
                      rel={method.label === "Location" ? "noopener noreferrer" : undefined}
                      className={`${baseCard} ${accentBorder[method.color]}`}
                    >
                      {inner}
                    </a>
                  ) : (
                    <div className={`${baseCard} cursor-default`}>{inner}</div>
                  )}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
