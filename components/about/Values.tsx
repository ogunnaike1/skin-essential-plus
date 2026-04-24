"use client";

import { motion } from "framer-motion";
import {
  Heart,
  Leaf,
  Lock,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Value {
  id: number;
  title: string;
  description: string;
  icon: LucideIcon;
  bgClass: string;
  textClass: string;
  bodyClass: string;
  numberClass: string;
  iconBg: string;
  iconText: string;
  accentHex: string;
  spanClass: string; // grid span for bento layout
  isDark: boolean;
}

const VALUES: readonly Value[] = [
  {
    id: 1,
    title: "Radical honesty",
    description:
      "We'll tell you when a treatment isn't right for you — even when it costs us the sale. Trust is the only currency that compounds.",
    icon: ShieldCheck,
    bgClass: "bg-deep",
    textClass: "text-ivory",
    bodyClass: "text-ivory",
    numberClass: "text-mauve/30",
    iconBg: "bg-ivory",
    iconText: "text-deep",
    accentHex: "#8A6F88",
    spanClass: "md:col-span-3 md:row-span-2",
    isDark: true,
  },
  {
    id: 2,
    title: "Quiet craft",
    description:
      "No shouting, no trends. We practice our craft with the unhurried focus of a kitchen at dawn.",
    icon: Sparkles,
    bgClass: "bg-mauve/25",
    textClass: "text-deep",
    bodyClass: "text-deep",
    numberClass: "text-mauve/40",
    iconBg: "bg-mauve",
    iconText: "text-ivory",
    accentHex: "#8A6F88",
    spanClass: "md:col-span-3",
    isDark: false,
  },
  {
    id: 3,
    title: "Gentle on earth",
    description:
      "Every ingredient we use is ethically sourced and every vessel we fill is reusable. Luxury never has to cost the planet.",
    icon: Leaf,
    bgClass: "bg-sage/30",
    textClass: "text-deep",
    bodyClass: "text-deep",
    numberClass: "text-sage/50",
    iconBg: "bg-sage",
    iconText: "text-ivory",
    accentHex: "#4F7288",
    spanClass: "md:col-span-3",
    isDark: false,
  },
  {
    id: 4,
    title: "Fierce privacy",
    description:
      "Your health information, your photos, your story — they stay within these walls. Always.",
    icon: Lock,
    bgClass: "bg-gradient-to-br from-ivory to-sage/20",
    textClass: "text-deep",
    bodyClass: "text-deep",
    numberClass: "text-deep/20",
    iconBg: "bg-deep",
    iconText: "text-ivory",
    accentHex: "#47676A",
    spanClass: "md:col-span-3",
    isDark: false,
  },
  {
    id: 5,
    title: "Love as method",
    description:
      "We do this because we love skin, we love science, and we love the people who walk through our doors.",
    icon: Heart,
    bgClass: "bg-gradient-to-br from-mauve/30 via-ivory to-sage/20",
    textClass: "text-deep",
    bodyClass: "text-deep",
    numberClass: "text-mauve/40",
    iconBg: "bg-deep",
    iconText: "text-ivory",
    accentHex: "#8A6F88",
    spanClass: "md:col-span-3",
    isDark: false,
  },
] as const;

interface ValueCardProps {
  value: Value;
  index: number;
}

function ValueCard({ value, index }: ValueCardProps): React.ReactElement {
  const Icon = value.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative rounded-[2rem] p-8 sm:p-10 overflow-hidden border-2 border-deep/10 hover:border-deep/30 transition-all duration-700 hover:shadow-[0_20px_50px_rgba(71,103,106,0.15)] ${value.bgClass} ${value.spanClass}`}
    >
      {/* Giant number watermark */}
      <span
        className={`absolute -top-2 -right-3 font-display text-[9rem] leading-none font-light tracking-tighter pointer-events-none select-none transition-transform duration-700 group-hover:scale-110 ${value.numberClass}`}
        aria-hidden
      >
        0{index + 1}
      </span>

      {/* Halo on hover */}
      <div
        className="absolute -inset-10 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 100%, ${value.accentHex}55 0%, transparent 60%)`,
        }}
        aria-hidden
      />

      <div className="relative flex flex-col h-full">
        <div className="flex items-start justify-between mb-8">
          <div
            className={`inline-flex h-12 w-12 items-center justify-center rounded-2xl ${value.iconBg}`}
          >
            <Icon className={`h-5 w-5 ${value.iconText}`} strokeWidth={1.5} />
          </div>
        </div>

        <h3
          className={`font-display text-2xl sm:text-3xl font-light leading-tight tracking-tight mb-4 ${value.textClass}`}
        >
          {value.title}
        </h3>
        <p className={`text-sm sm:text-base font-light leading-relaxed ${value.bodyClass}`}>
          {value.description}
        </p>

        <div className="mt-auto pt-6">
          <div
            className="h-px w-10 transition-all duration-700 group-hover:w-20"
            style={{ backgroundColor: value.accentHex, opacity: value.isDark ? 0.6 : 0.4 }}
          />
        </div>
      </div>
    </motion.article>
  );
}

export function Values(): React.ReactElement {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden bg-ivory">
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 30%, rgba(138,111,136,0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(79,114,136,0.15) 0%, transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mb-16 sm:mb-20"
        >
          <span className="eyebrow text-mauve text-[11px] block mb-5">
            — Chapter Six
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.02] tracking-tight text-deep text-balance">
            The values we refuse to compromise on.
          </h2>
          <p className="mt-6 text-base sm:text-lg font-light text-deep leading-relaxed text-balance">
            Not aspirational slogans — these are the five principles we'd shut the doors before bending.
          </p>

          {/* Decorative palette row */}
          <div className="flex items-center gap-2 mt-8">
            {["#47676A", "#8A6F88", "#4F7288", "#47676A", "#8A6F88"].map(
              (c, i) => (
                <span
                  key={i}
                  className="h-1 w-8 rounded-full"
                  style={{ backgroundColor: c, opacity: 0.6 }}
                />
              )
            )}
          </div>
        </motion.div>

        {/* Bento grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-6 auto-rows-[260px] md:auto-rows-[280px]">
          {VALUES.map((value, i) => (
            <ValueCard key={value.id} value={value} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}