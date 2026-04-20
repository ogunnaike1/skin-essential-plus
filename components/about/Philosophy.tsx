"use client";

import { motion } from "framer-motion";
import { FlaskConical, Flower2, Target } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface Pillar {
  id: number;
  numeral: string;
  title: string;
  tagline: string;
  description: string;
  icon: LucideIcon;
  color: string;
  accent: string;
  dark: boolean;
}

const PILLARS: readonly Pillar[] = [
  {
    id: 1,
    numeral: "I.",
    title: "Science",
    tagline: "What the evidence proves.",
    description:
      "Every protocol we practice is grounded in peer-reviewed dermatology. We read the studies, we verify the mechanisms, we measure the outcomes. Nothing enters our treatment rooms on the strength of marketing alone.",
    icon: FlaskConical,
    color: "bg-mauve/15",
    accent: "#C0A9BD",
    dark: false,
  },
  {
    id: 2,
    numeral: "II.",
    title: "Ritual",
    tagline: "What the body remembers.",
    description:
      "Science tells us what works. Ritual is how we make it meaningful. The sequence of touch, the quality of silence, the rhythm of the hour — these aren't decoration. They're the medicine that the protocol carries.",
    icon: Flower2,
    color: "bg-deep",
    accent: "#F4F2F3",
    dark: true,
  },
  {
    id: 3,
    numeral: "III.",
    title: "Intention",
    tagline: "What the work is for.",
    description:
      "We're not here to manufacture sameness. We're here to help you recognize what was always yours — to reveal rather than remake. Every treatment begins with this question: who are you becoming?",
    icon: Target,
    color: "bg-sage/20",
    accent: "#94A7AE",
    dark: false,
  },
] as const;

interface PillarCardProps {
  pillar: Pillar;
  index: number;
}

function PillarCard({ pillar, index }: PillarCardProps): React.ReactElement {
  const Icon = pillar.icon;

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.9,
        delay: index * 0.15,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`relative rounded-[2rem] p-10 sm:p-12 border overflow-hidden ${pillar.color} ${
        pillar.dark ? "border-deep-dark" : "border-deep/10"
      }`}
    >
      {/* Halo */}
      <div
        className="absolute -top-20 -right-20 h-72 w-72 rounded-full blur-3xl opacity-30 pointer-events-none"
        style={{ background: `radial-gradient(circle, ${pillar.accent} 0%, transparent 70%)` }}
        aria-hidden
      />

      {/* Roman numeral watermark */}
      <span
        className={`absolute top-6 right-8 font-display text-8xl font-light leading-none tracking-tighter pointer-events-none select-none ${
          pillar.dark ? "text-ivory/15" : "text-deep/10"
        }`}
        aria-hidden
      >
        {pillar.numeral}
      </span>

      <div className="relative">
        {/* Icon */}
        <div
          className={`inline-flex h-16 w-16 items-center justify-center rounded-2xl mb-8 ${
            pillar.dark ? "bg-ivory/10 border border-ivory/20" : "bg-ivory border border-deep/10"
          }`}
        >
          <Icon
            className={`h-7 w-7 ${pillar.dark ? "text-ivory" : "text-deep"}`}
            strokeWidth={1.25}
          />
        </div>

        {/* Title */}
        <h3
          className={`font-display text-4xl sm:text-5xl font-light leading-none tracking-tight mb-3 ${
            pillar.dark ? "text-ivory" : "text-deep"
          }`}
        >
          {pillar.title}
        </h3>

        {/* Tagline */}
        <p
          className={`font-display text-lg italic leading-tight mb-8 ${
            pillar.dark ? "text-mauve" : "text-mauve"
          }`}
        >
          {pillar.tagline}
        </p>

        {/* Divider */}
        <div
          className={`h-px w-12 mb-6 ${
            pillar.dark ? "bg-mauve/60" : "bg-deep/30"
          }`}
        />

        {/* Body */}
        <p
          className={`text-sm sm:text-base font-light leading-[1.65] ${
            pillar.dark ? "text-ivory/80" : "text-deep/70"
          }`}
        >
          {pillar.description}
        </p>
      </div>
    </motion.article>
  );
}

export function Philosophy(): React.ReactElement {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden bg-gradient-to-b from-ivory via-ivory to-mauve/10">
      <div
        className="absolute inset-x-0 top-0 h-px"
        style={{
          background:
            "linear-gradient(90deg, transparent, rgba(71,103,106,0.15) 50%, transparent)",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto text-center mb-16 sm:mb-24"
        >
          <span className="eyebrow text-mauve text-[11px] block mb-5">
            — Chapter Three
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.02] tracking-tight text-deep text-balance">
            Three pillars hold up everything we do.
          </h2>
          <p className="mt-6 text-base sm:text-lg font-light text-deep/70 leading-relaxed max-w-2xl mx-auto text-balance">
            Not a manifesto. A working philosophy — the framework we return to before every consultation, every treatment, every recommendation.
          </p>

          {/* Decorative color dots */}
          <div className="flex items-center justify-center gap-2 mt-10">
            {["#C0A9BD", "#47676A", "#94A7AE"].map((c) => (
              <span
                key={c}
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </motion.div>

        {/* Three pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-7">
          {PILLARS.map((pillar, i) => (
            <PillarCard key={pillar.id} pillar={pillar} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}