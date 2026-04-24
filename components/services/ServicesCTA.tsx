"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarCheck,
  Gift,
  MessageCircle,
  Phone,
} from "lucide-react";
import Image from "next/image";

export function ServicesCTA(): React.ReactElement {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-ivory">
      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] shadow-[0_40px_90px_rgba(71,103,106,0.22)]"
        >
          {/* Background */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=2400&q=90&auto=format&fit=crop"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(71,103,106,0.92) 0%, rgba(71,103,106,0.78) 45%, rgba(79,114,136,0.6) 100%)",
              }}
            />
          </div>

          {/* Orbs */}
          <div
            className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-40 animate-float pointer-events-none"
            style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
            aria-hidden
          />
          <div
            className="absolute -bottom-40 right-[-8%] h-[500px] w-[500px] rounded-full blur-3xl opacity-35 animate-float pointer-events-none"
            style={{
              background: "radial-gradient(circle, #4F7288 0%, transparent 70%)",
              animationDelay: "2s",
            }}
            aria-hidden
          />

          {/* Noise */}
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
            aria-hidden
          />

          {/* Palette accent strip top */}
          <div className="absolute top-0 inset-x-0 flex h-1">
            <span className="flex-1" style={{ backgroundColor: "#8A6F88" }} />
            <span className="flex-1" style={{ backgroundColor: "#4F7288" }} />
            <span className="flex-1" style={{ backgroundColor: "#FCFBFC" }} />
            <span className="flex-1" style={{ backgroundColor: "#47676A" }} />
          </div>

          <div className="relative px-8 sm:px-16 lg:px-20 py-20 sm:py-24 lg:py-28">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Main copy */}
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ivory/10 backdrop-blur-md border border-ivory/20 mb-8"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-mauve animate-pulse-soft" />
                  <span className="eyebrow text-mauve text-[10px]">
                    Not sure which ritual is right?
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[5rem] font-light text-ivory leading-[0.98] tracking-[-0.02em] text-balance"
                >
                  Let us <em className="not-italic text-mauve">design</em>{" "}
                  your visit.
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-7 text-base sm:text-lg font-light text-ivory leading-[1.65] max-w-xl text-balance"
                >
                  Share your goals and we'll compose the perfect sequence — a single treatment, a half-day escape, or a multi-month program tailored to your skin's journey.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-10 flex flex-wrap items-center gap-3"
                >
                  <button
                    type="button"
                    className="group relative inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-ivory text-deep font-sans text-[11px] uppercase tracking-[0.22em] shadow-[0_4px_30px_rgba(252,251,252,0.25)] hover:shadow-[0_8px_40px_rgba(138,111,136,0.5)] transition-all duration-500"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    <span>Book a consultation</span>
                    <span className="h-9 w-9 rounded-full bg-deep text-ivory flex items-center justify-center transition-all duration-500 group-hover:bg-mauve group-hover:rotate-[22deg]">
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </span>
                  </button>
                  <button
                    type="button"
                    className="group inline-flex items-center gap-2 px-5 py-3 rounded-full border border-ivory/30 text-ivory font-sans text-[11px] uppercase tracking-[0.22em] hover:bg-ivory/10 hover:border-ivory/60 transition-all duration-500"
                  >
                    <MessageCircle className="h-3.5 w-3.5" />
                    <span>Chat with concierge</span>
                  </button>
                </motion.div>

                {/* Contact strip */}
                <motion.div
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.75, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-10 pt-8 border-t border-ivory/15 flex flex-wrap items-center gap-x-8 gap-y-3"
                >
                  <a
                    href="tel:+2348001234567"
                    className="group inline-flex items-center gap-2 text-sm font-light text-ivory hover:text-ivory transition-colors"
                  >
                    <Phone className="h-3.5 w-3.5 text-mauve" strokeWidth={1.5} />
                    <span>+234 800 123 4567</span>
                  </a>
                  <span className="h-3 w-px bg-ivory/20" aria-hidden />
                  <span className="text-xs font-light text-ivory/90 uppercase tracking-[0.2em]">
                    Mon–Sat · 9AM – 8PM
                  </span>
                </motion.div>
              </div>

              {/* Gift card / option cards */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 space-y-4"
              >
                {/* Gift card */}
                <div
                  className="group relative rounded-[1.75rem] p-7 border overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(138,111,136,0.35) 0%, rgba(252,251,252,0.15) 100%)",
                    backdropFilter: "blur(20px) saturate(140%)",
                    WebkitBackdropFilter: "blur(20px) saturate(140%)",
                    borderColor: "rgba(252, 251, 252, 0.25)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-ivory flex items-center justify-center">
                      <Gift className="h-5 w-5 text-mauve" strokeWidth={1.5} />
                    </div>
                    <span className="eyebrow text-mauve text-[9px]">
                      — Gift ritual
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-light text-ivory leading-tight mb-2">
                    The gift of stillness.
                  </h3>
                  <p className="text-sm font-light text-ivory leading-relaxed mb-4">
                    Digital gift cards from ₦25,000. Delivered instantly, valid for 12 months, usable for any service.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-mauve group-hover:text-ivory transition-colors">
                    Purchase gift card
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:rotate-45 duration-500" strokeWidth={1.5} />
                  </span>
                </div>

                {/* Membership card */}
                <div
                  className="group relative rounded-[1.75rem] p-7 border overflow-hidden cursor-pointer transition-all duration-500 hover:scale-[1.02]"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(79,114,136,0.35) 0%, rgba(252,251,252,0.15) 100%)",
                    backdropFilter: "blur(20px) saturate(140%)",
                    WebkitBackdropFilter: "blur(20px) saturate(140%)",
                    borderColor: "rgba(252, 251, 252, 0.25)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 rounded-2xl bg-ivory flex items-center justify-center">
                      <CalendarCheck className="h-5 w-5 text-sage" strokeWidth={1.5} />
                    </div>
                    <span className="eyebrow text-sage text-[9px]">
                      — Membership
                    </span>
                  </div>
                  <h3 className="font-display text-2xl font-light text-ivory leading-tight mb-2">
                    The Essential Circle.
                  </h3>
                  <p className="text-sm font-light text-ivory leading-relaxed mb-4">
                    Monthly rituals, 20% off add-ons, priority booking, and bespoke skincare products curated for you.
                  </p>
                  <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.2em] text-sage group-hover:text-ivory transition-colors">
                    Learn about membership
                    <ArrowUpRight className="h-3 w-3 transition-transform group-hover:rotate-45 duration-500" strokeWidth={1.5} />
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}