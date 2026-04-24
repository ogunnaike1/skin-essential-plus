"use client";

import { motion } from "framer-motion";
import { Calendar, Sparkles } from "lucide-react";
import Image from "next/image";

export function BookingCTA(): React.ReactElement {
  return (
    <section className="relative py-24 sm:py-32 section-padding">
      <div className="relative max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] bg-gradient-deep shadow-lift"
        >
          <div className="absolute inset-0 opacity-30">
            <Image
              src="https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=1800&q=85&auto=format&fit=crop"
              alt=""
              fill
              sizes="100vw"
              className="object-cover mix-blend-overlay"
            />
          </div>

          <div
            className="absolute -top-40 -right-20 h-[500px] w-[500px] rounded-full blur-3xl opacity-40 animate-float"
            style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
            aria-hidden
          />
          <div
            className="absolute -bottom-40 -left-20 h-[400px] w-[400px] rounded-full blur-3xl opacity-30 animate-float"
            style={{
              background: "radial-gradient(circle, #4F7288 0%, transparent 70%)",
              animationDelay: "3s",
            }}
            aria-hidden
          />
          <div className="noise-overlay" />

          <div className="relative px-8 sm:px-16 py-20 sm:py-28 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ivory/10 backdrop-blur-md border border-ivory/20 mb-8"
            >
              <Sparkles className="h-3.5 w-3.5 text-mauve" />
              <span className="eyebrow text-ivory">
                Limited slots this season
              </span>
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-ivory leading-[1] tracking-tight text-balance max-w-4xl mx-auto"
            >
              Your transformation begins with a single breath.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg text-ivory font-light max-w-2xl mx-auto text-balance"
            >
              Reserve your first consultation today — a complimentary 45-minute ritual curated entirely around you.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap gap-4 justify-center"
            >
              <button
                type="button"
                className="group inline-flex items-center justify-center gap-2 px-9 py-4 bg-ivory text-deep font-sans text-sm uppercase tracking-[0.2em] rounded-full shadow-[0_0_50px_rgba(252,251,252,0.35)] hover:shadow-[0_0_70px_rgba(252,251,252,0.6)] transition-all duration-500 hover:scale-[1.04] active:scale-[0.98]"
              >
                <Calendar className="h-4 w-4" />
                Book Complimentary Consultation
              </button>
              <button type="button" className="btn-ghost">
                View Pricing
              </button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
