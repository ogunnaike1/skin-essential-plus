"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Beaker,
  Globe,
  Leaf,
  Quote,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const PILLARS = [
  {
    icon: Beaker,
    stat: "48",
    unit: "hour",
    label: "Clinical trials before any product launches",
    color: "mauve" as const,
  },
  {
    icon: Leaf,
    stat: "0",
    unit: "%",
    label: "Parabens, sulfates, or synthetic fragrance — ever",
    color: "sage" as const,
  },
  {
    icon: Globe,
    stat: "12",
    unit: "countries",
    label: "Where our formulations are now sold worldwide",
    color: "deep" as const,
  },
];

export function BrandStory(): React.ReactElement {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-ivory">
      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* LEFT — stacked image composition */}
          <motion.div
            initial={{ opacity: 1, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            {/* Main image */}
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border-2 border-mauve">
              <Image
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1600&q=85&auto=format&fit=crop"
                alt="Laboratory craft"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              {/* Solid mauve corner slab with quote icon */}
              <div className="absolute top-6 left-6 h-14 w-14 rounded-2xl bg-mauve flex items-center justify-center shadow-[0_8px_20px_rgba(138,111,136,0.4)]">
                <Quote className="h-5 w-5 text-ivory" strokeWidth={1.5} />
              </div>
            </div>

            {/* Floating sage image — bottom right */}
            <div className="hidden sm:block absolute -bottom-8 -right-4 w-44 lg:w-52 aspect-[3/4] rounded-2xl overflow-hidden border-4 border-ivory shadow-[0_20px_40px_rgba(53,79,82,0.25)]">
              <Image
                src="https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800&q=85&auto=format&fit=crop"
                alt="Product ritual"
                fill
                sizes="208px"
                className="object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(to top, rgba(79,114,136,0.6) 0%, transparent 60%)",
                }}
              />
            </div>

            {/* Small deep badge — top right floating */}
            <motion.div
              initial={{ opacity: 1, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="hidden md:flex absolute top-8 -right-4 lg:-right-8 flex-col items-center gap-1 w-28 h-28 rounded-full bg-deep text-ivory justify-center shadow-[0_12px_30px_rgba(71,103,106,0.35)]"
            >
              <Sparkles className="h-4 w-4 text-mauve" strokeWidth={1.75} />
              <span className="font-display text-2xl font-medium leading-none tabular-nums">
                7
              </span>
              <span className="text-[8px] uppercase tracking-[0.15em] text-ivory text-center px-3 leading-tight">
                years of craft
              </span>
            </motion.div>
          </motion.div>

          {/* RIGHT — editorial copy */}
          <div className="lg:col-span-6 lg:pl-6">
            <motion.div
              initial={{ opacity: 1, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              {/* Eyebrow */}
              <div className="flex items-center gap-2 mb-5">
                <span className="h-1 w-8 rounded-full bg-mauve" />
                <span className="eyebrow text-mauve text-[11px]">— Our story</span>
              </div>

              {/* Headline */}
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-light text-deep leading-[1.05] tracking-tight mb-7 text-balance">
                Every bottle holds{" "}
                <em className="not-italic text-mauve">years of patience</em>.
              </h2>

              {/* Pull quote */}
              <blockquote className="relative pl-6 border-l-4 border-sage mb-7">
                <p className="font-display text-lg sm:text-xl font-light text-deep leading-relaxed italic">
                  &ldquo;We formulate backwards — starting with the skin's ideal outcome, then finding the exact actives, doses, and delivery systems that will get it there. No shortcuts. No trends.&rdquo;
                </p>
                <footer className="mt-4 text-[11px] uppercase tracking-[0.2em] text-sage font-medium">
                  — Dr. Amaka Okafor, Founder
                </footer>
              </blockquote>

              {/* Supporting copy */}
              <p className="text-sm sm:text-base font-light text-deep leading-relaxed mb-8">
                Skin Essential Plus was born in a small Lagos lab in 2017 out of a frustration: the beauty industry sold aspirations, not outcomes. Seven years later, every product on this shelf has passed 48-hour clinical trials and six-month efficacy studies before earning its place.
              </p>

              {/* 3-PILLAR STATS */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {PILLARS.map((pillar, i) => {
                  const Icon = pillar.icon;
                  const tintBg: Record<typeof pillar.color, string> = {
                    mauve: "bg-mauve-tint border-mauve",
                    sage: "bg-sage-tint border-sage",
                    deep: "bg-deep-tint border-deep",
                  };
                  const iconBg: Record<typeof pillar.color, string> = {
                    mauve: "bg-mauve",
                    sage: "bg-sage",
                    deep: "bg-deep",
                  };
                  const statText: Record<typeof pillar.color, string> = {
                    mauve: "text-mauve",
                    sage: "text-sage",
                    deep: "text-deep",
                  };
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1, y: 16 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1 + i * 0.08,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className={cn(
                        "flex flex-col p-4 rounded-2xl border-2",
                        tintBg[pillar.color]
                      )}
                    >
                      <div
                        className={cn(
                          "h-9 w-9 rounded-xl flex items-center justify-center mb-3",
                          iconBg[pillar.color]
                        )}
                      >
                        <Icon className="h-4 w-4 text-ivory" strokeWidth={1.5} />
                      </div>
                      <div className="flex items-baseline gap-1 mb-1">
                        <span
                          className={cn(
                            "font-display text-3xl font-light leading-none tabular-nums",
                            statText[pillar.color]
                          )}
                        >
                          {pillar.stat}
                        </span>
                        <span className="text-[11px] uppercase tracking-[0.1em] text-deep font-medium">
                          {pillar.unit}
                        </span>
                      </div>
                      <p className="text-[11px] font-light text-deep leading-snug">
                        {pillar.label}
                      </p>
                    </motion.div>
                  );
                })}
              </div>

              {/* CTA - Single button linking to About page */}
              <div className="flex flex-wrap items-center gap-3">
                <a
                  href="/about"
                  className="group inline-flex items-center gap-2 pl-5 pr-1 py-1 rounded-full bg-deep text-ivory text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-deep-dark transition-colors"
                >
                  <span>Read our story</span>
                  <span className="h-8 w-8 rounded-full bg-mauve flex items-center justify-center transition-transform duration-500 group-hover:rotate-[22deg]">
                    <ArrowUpRight className="h-3.5 w-3.5 text-ivory" strokeWidth={1.75} />
                  </span>
                </a>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}