"use client";

import { motion } from "framer-motion";
import { Moon, Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

const SALE_END = new Date("2026-05-26T23:59:59");

function getTimeLeft() {
  const diff = SALE_END.getTime() - Date.now();
  if (diff <= 0) return null;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return { days, hours, mins };
}

interface EidBannerProps {
  variant?: "services" | "card";
}

// ── Inline promo strip — used inside ServicesGrid hero ────────
export function EidPromoStrip() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, delay: 0.35 }}
      className="mt-6 max-w-2xl mx-auto"
    >
      <div
        className="relative flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl px-5 py-4 overflow-hidden"
        style={{
          background: "linear-gradient(135deg, rgba(27,58,47,0.85) 0%, rgba(44,31,14,0.85) 100%)",
          border: "1px solid rgba(212,175,55,0.4)",
          backdropFilter: "blur(12px)",
        }}
      >
        {/* Glow */}
        <div
          className="pointer-events-none absolute -top-8 -left-8 h-24 w-24 rounded-full blur-2xl opacity-40"
          style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
          aria-hidden
        />

        {/* Left — label */}
        <div className="relative flex items-center gap-3">
          <motion.div
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Moon className="h-5 w-5 text-amber-300 fill-amber-300/30 shrink-0" />
          </motion.div>
          <div>
            <p className="text-xs font-semibold text-amber-300 tracking-wider uppercase">
              Eid-ul-Adha Mubarak — Ileya Sale 🌙
            </p>
            <p className="text-[11px] text-ivory/60 mt-0.5">
              Exclusive discounts on all treatments · Valid until 26 May 2026
            </p>
          </div>
        </div>

        {/* Right — countdown */}
        <div className="relative flex items-center gap-3 shrink-0">
          {[
            { value: time.days, label: "d" },
            { value: time.hours, label: "h" },
            { value: time.mins, label: "m" },
          ].map(({ value, label }, i) => (
            <div key={label} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <span
                  className="font-display text-xl font-light tabular-nums leading-none"
                  style={{ color: "#D4AF37" }}
                >
                  {String(value).padStart(2, "0")}
                </span>
                <span className="text-[8px] uppercase tracking-widest text-ivory/30">{label}</span>
              </div>
              {i < 2 && <span className="text-amber-300/40 text-sm mb-2">:</span>}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ── Compact floating card — used inside the hero ──────────────
export function EidHeroCard() {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <motion.div
      initial={{ opacity: 0, x: 40, scale: 0.95 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
      className="hidden lg:block absolute right-10 xl:right-16 top-28 z-20 w-64 xl:w-72"
    >
      <div
        className="relative rounded-3xl overflow-hidden border p-6"
        style={{
          background: "linear-gradient(155deg, #1B3A2F 0%, #2C1F0E 55%, #1B2E38 100%)",
          borderColor: "rgba(212,175,55,0.3)",
          boxShadow: "0 24px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(212,175,55,0.15)",
        }}
      >
        {/* Glow orb */}
        <div
          className="pointer-events-none absolute -top-10 -right-10 h-36 w-36 rounded-full blur-2xl opacity-30"
          style={{ background: "radial-gradient(circle, #D4AF37 0%, transparent 70%)" }}
          aria-hidden
        />

        {/* Floating stars */}
        {[
          { top: "10%", right: "14%", delay: 0 },
          { top: "55%", right: "8%", delay: 0.6 },
          { top: "30%", left: "10%", delay: 1.1 },
        ].map((s, i) => (
          <motion.div
            key={i}
            className="pointer-events-none absolute"
            style={{ top: s.top, right: (s as { right?: string }).right, left: (s as { left?: string }).left }}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.3, 0.8] }}
            transition={{ duration: 2.5, repeat: Infinity, delay: s.delay }}
            aria-hidden
          >
            <Star className="h-2 w-2 fill-amber-300 text-amber-300" />
          </motion.div>
        ))}

        {/* Badge */}
        <div className="relative flex items-center gap-2 mb-4">
          <motion.div
            animate={{ rotate: [0, 10, 0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Moon className="h-5 w-5 text-amber-300 fill-amber-300/40" />
          </motion.div>
          <span
            className="text-[9px] uppercase tracking-[0.2em] font-bold px-2.5 py-1 rounded-full"
            style={{
              background: "rgba(212,175,55,0.15)",
              border: "1px solid rgba(212,175,55,0.35)",
              color: "#D4AF37",
            }}
          >
            Ileya Sale
          </span>
        </div>

        {/* Heading */}
        <div className="relative mb-4">
          <p className="font-display text-2xl xl:text-3xl font-light text-ivory leading-tight">
            Eid-ul-Adha
          </p>
          <p className="font-display text-2xl xl:text-3xl font-light italic text-amber-300 leading-tight">
            Mubarak 🌙
          </p>
          <p className="mt-2 text-xs text-ivory/60 font-light leading-relaxed">
            Exclusive discounts across all our treatments — celebrate in style.
          </p>
        </div>

        {/* Countdown */}
        <div
          className="relative rounded-2xl p-3 mb-4"
          style={{ background: "rgba(212,175,55,0.08)", border: "1px solid rgba(212,175,55,0.2)" }}
        >
          <p className="text-[9px] uppercase tracking-[0.18em] text-ivory/40 mb-2 text-center">
            Offer ends in
          </p>
          <div className="flex items-center justify-center gap-2">
            {[
              { value: time.days, label: "Days" },
              { value: time.hours, label: "Hrs" },
              { value: time.mins, label: "Min" },
            ].map(({ value, label }, i) => (
              <div key={label} className="flex items-center gap-2">
                <div className="flex flex-col items-center">
                  <span className="font-display text-2xl font-light text-amber-300 tabular-nums leading-none">
                    {String(value).padStart(2, "0")}
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.15em] text-ivory/35 mt-0.5">
                    {label}
                  </span>
                </div>
                {i < 2 && (
                  <span className="text-amber-300/40 text-lg font-light mb-3">:</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Link
          href="/services"
          className="relative block w-full text-center py-2.5 rounded-full text-xs font-semibold tracking-widest uppercase transition-all duration-300 hover:opacity-90 hover:scale-[1.02]"
          style={{
            background: "linear-gradient(135deg, #D4AF37, #B8860B)",
            color: "#1B3A2F",
          }}
        >
          View Services
        </Link>

        {/* Valid until */}
        <p className="relative mt-3 text-center text-[9px] uppercase tracking-[0.15em] text-ivory/30">
          Valid until 26 May 2026
        </p>
      </div>
    </motion.div>
  );
}

// ── Full-width banner — used on services page ─────────────────
export function EidBanner({ variant = "services" }: EidBannerProps) {
  const [time, setTime] = useState(getTimeLeft());

  useEffect(() => {
    const id = setInterval(() => setTime(getTimeLeft()), 30_000);
    return () => clearInterval(id);
  }, []);

  if (!time) return null;

  return (
    <section className="relative overflow-hidden section-padding py-12 sm:py-16">
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(135deg, #1B3A2F 0%, #2C1F0E 40%, #1B2E38 100%)",
        }}
      />

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
          <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left gap-4">
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

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-ivory leading-tight">
                Eid-ul-Adha
                <span className="block text-amber-300 italic">Mubarak</span>
              </h2>
              <p className="mt-1 text-sm text-ivory/50 tracking-widest uppercase">— Ileya Sale —</p>
            </motion.div>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.25 }}
              className="text-sm sm:text-base text-ivory/70 font-light leading-relaxed max-w-md"
            >
              Celebrate the season of gratitude with exclusive discounts across all our treatments. Treat yourself — you deserve it.
            </motion.p>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.7, delay: 0.35 }}
              className="text-xs text-amber-300/80 tracking-wider uppercase"
            >
              Valid now through 26 May 2026
            </motion.p>
          </div>

          <div className="hidden lg:block h-40 w-px bg-gradient-to-b from-transparent via-amber-400/30 to-transparent" aria-hidden />

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col items-center gap-3"
          >
            <p className="text-[10px] uppercase tracking-[0.2em] text-ivory/50">Offer ends in</p>
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
                    <span className="mt-1.5 text-[9px] uppercase tracking-[0.2em] text-ivory/40">{label}</span>
                  </div>
                  {i < 2 && <span className="mb-5 text-2xl font-light text-amber-300/50">:</span>}
                </div>
              ))}
            </div>

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
