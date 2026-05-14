"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles, ShoppingBag, Droplets, Leaf } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const FEATURES = [
  { icon: Droplets, label: "Clinically formulated",  desc: "Every product backed by dermatological research"  },
  { icon: Leaf,     label: "Clean ingredients",       desc: "No harsh chemicals — only what your skin needs"   },
  { icon: Sparkles, label: "Expert-curated",          desc: "Hand-picked by our licensed skin therapists"      },
];

export function ShopCTA(): React.ReactElement {
  return (
    <section className="relative py-24 sm:py-32 section-padding overflow-hidden">
      {/* Subtle background */}
      <div className="absolute inset-0 bg-gradient-to-br from-ivory via-sage-tint/40 to-mauve-tint/30" />

      {/* Floating orbs */}
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -25, 0], scale: [1, 1.15, 1] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-16 right-10 h-80 w-80 rounded-full bg-mauve/15 blur-3xl pointer-events-none"
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 30, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        className="absolute bottom-16 left-10 h-96 w-96 rounded-full bg-sage/15 blur-3xl pointer-events-none"
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">

          {/* ── Image ── */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 lg:order-2 relative"
          >
            {/* Main image */}
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-glass-lg ring-1 ring-ivory/60">
              <Image
                src="https://res.cloudinary.com/dhmqhless/image/upload/v1778795958/sanctuary_abo2g1.jpg"
                alt="Skin Essential Plus skincare products"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/40 via-transparent to-transparent" />

              {/* Floating badge on image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
                className="absolute bottom-6 left-6 right-6"
              >
                <div className="bg-ivory/90 backdrop-blur-md rounded-2xl px-5 py-4 shadow-lift ring-1 ring-ivory/50">
                  <p className="text-[10px] uppercase tracking-widest text-deep/50 font-light mb-1">Now Available</p>
                  <p className="font-display text-lg font-light text-deep leading-snug">
                    Premium skincare, <em className="text-mauve not-italic">delivered to you</em>
                  </p>
                </div>
              </motion.div>
            </div>

            {/* Small accent card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -top-6 -left-4 sm:-left-8 w-36 sm:w-44 aspect-square rounded-2xl overflow-hidden shadow-lift border-4 border-ivory ring-2 ring-sage/20"
            >
              <Image
                src="https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=85&auto=format&fit=crop"
                alt="Skincare product detail"
                fill
                sizes="176px"
                className="object-cover"
              />
            </motion.div>

            {/* Glow behind image */}
            <motion.div
              animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.55, 0.3] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -bottom-8 -right-8 h-48 w-48 rounded-full blur-2xl bg-gradient-to-br from-mauve/50 via-sage/30 to-transparent pointer-events-none"
            />
          </motion.div>

          {/* ── Copy ── */}
          <div className="lg:col-span-6 lg:order-1">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow text-deep block mb-5"
            >
              — The Shop
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight text-deep text-balance"
            >
              Bring the <em className="text-sage not-italic">ritual</em> home with you.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg text-deep font-light leading-relaxed"
            >
              Our curated collection of professional-grade skincare products lets you extend your treatment beyond the spa. Each formula is the same one our therapists trust — now available for your daily ritual.
            </motion.p>

            {/* Feature list */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-8 space-y-4"
            >
              {FEATURES.map(({ icon: Icon, label, desc }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.4 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  className="flex items-start gap-4"
                >
                  <div className="h-9 w-9 rounded-xl bg-mauve-tint flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="h-4 w-4 text-mauve" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-deep">{label}</p>
                    <p className="text-sm text-deep/55 font-light mt-0.5">{desc}</p>
                  </div>
                </motion.div>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-deep text-ivory font-sans text-sm uppercase tracking-[0.15em] rounded-full shadow-lift hover:opacity-90 hover:scale-[1.03] active:scale-[0.98] transition-all duration-300"
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
                Shop Products
              </Link>
              <Link
                href="/shop"
                className="group inline-flex items-center gap-2 px-8 py-4 bg-transparent text-deep border-2 border-deep/20 font-sans text-sm uppercase tracking-[0.15em] rounded-full hover:border-mauve hover:text-mauve transition-all duration-300"
              >
                Browse Collection
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-0.5" strokeWidth={1.5} />
              </Link>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
