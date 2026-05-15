"use client";

import { motion } from "framer-motion";
import { Moon, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const SALE_END = new Date("2026-05-30T23:59:59");

function getTimeLeft() {
  const diff = SALE_END.getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, mins };
}

interface EidBannerProps {
  variant?: "homepage" | "services";
}

export function EidBanner({ variant = "homepage" }: EidBannerProps) {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <section className="relative overflow-hidden section-padding py-12 sm:py-16">
      {/* Background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, #1B3A2F 0%, #2C1F0E 40%, #1B2E38 100%)",
        }}
      />

      {/* Decorative orbs */}
      <div
        className="pointer-events-none absolute -top-20 -left-20 h-64 w-64 rounded-full blur-3xl opacity-30"
        style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-20 -right-10 h-72 w-72 rounded-full blur-3xl opacity-20"
        style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
        aria-hidden
      />

      {/* Floating stars */}
      {[
        { top: "12%", left: "8%", size: "h-3 w-3", delay: 0 },
        { top: "70%", left: "15%", size: "h-2 w-2", delay: 0.4 },
        { top: "20%", right: "10%", size: "h-2.5 w-2.5", delay: 0.8 },
        { top: "60%", right: "18%", size: "h-2 w-2", delay: 0.2 },
        { top: "40%", left: "45%", size: "h-1.5 w-1.5", delay: 1 },
      ].map((s, i) => (
        <motion.div
          key={i}
          className="pointer-events-none absolute"
          style={{ top: s.top, left: (s as { left?: string }).left, right: (s as { right?: string }).right }}
          animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
          transition={{ duration: 2.5, repeat: Infinity, delay: s.delay }}
          aria-hidden
        >
          <Star className={`${s.size} fill-amber-300 text-amber-300`} />
        </motion.div>
      ))}

      <div className="relative max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12">

          {/* Left — Moon + text */}
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/50 bg-amber-400/10"
            >
              <Moon className="h-3.5 w-3.5 text-amber-300 fill-amber-300" />
              <span className="text-[10px] uppercase tracking-[0.18em] font-semibold text-amber-300">
                Limited Time Offer
              </span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-ivory leading-tight">
                Eid-ul-Adha
                <span className="block text-amber-300 italic">Mubarak</span>
              </h2>
              <p className="mt-1 text-sm text-ivory/50 tracking-widest uppercase">
                — Ileya Sale —
              </p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-sm sm:text-base text-ivory/70 font-light leading-relaxed max-w-md"
            >
              Celebrate the season of gratitude with exclusive discounts across
              all our treatments. Treat yourself — you deserve it.
            </motion.p>

            {/* Valid until */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-xs text-amber-300/80 tracking-wider uppercase"
            >
              Valid now through 30 May 2026
            </motion.p>

            {/* CTA */}
            {variant === "homepage" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.45 }}
              >
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 px-7 py-3 rounded-full text-sm font-medium tracking-wide transition-all duration-300 hover:scale-105"
                  style={{
                    background: "linear-gradient(135deg, #D4AF37, #B8860B)",
                    color: "#1B3A2F",
                  }}
                >
                  View All Services
                </Link>
              </motion.div>
            )}
          </div>

          {/* Divider */}
          <div className="hidden lg:block h-40 w-px bg-gradient-to-b from-transparent via-amber-400/30 to-transparent" aria-hidden />

          {/* Right — Countdown */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">
              Offer ends in
            </p>
            <div className="flex items-end gap-3">
              {[
                { value: time.days, label: "Days" },
                { value: time.hours, label: "Hrs" },
                { value: time.mins, label: "Min" },
              ].map(({ value, label }, i) => (
                <div key={label} className="flex items-end gap-3">
                  <div className="flex flex-col items-center">
                    <div
                      className="flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-2xl"
                      style={{
                        background: "rgba(212,175,55,0.12)",
                        border: "1px solid rgba(212,175,55,0.35)",
                      }}
                    >
                      <span className="font-display text-3xl sm:text-4xl font-light text-amber-300 tabular-nums">
                        {String(value).padStart(2, "0")}
                      </span>
                    </div>
                    <span className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-ivory/40">
                      {label}
                    </span>
                  </div>
                  {i < 2 && (
                    <span className="mb-5 text-2xl font-light text-amber-300/50">:</span>
                  )}
                </div>
              ))}
            </div>

            {/* Crescent moon decoration */}
            <motion.div
              animate={{ rotate: [0, 8, 0, -8, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="mt-2"
            >
              <Moon className="h-10 w-10 text-amber-300/60 fill-amber-300/20" />
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
