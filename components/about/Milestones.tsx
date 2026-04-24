"use client";

import { motion, useInView } from "framer-motion";
import { Award, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface Milestone {
  id: number;
  value: number;
  suffix: string;
  label: string;
  sublabel: string;
  bgClass: string;
  valueColor: string;
  labelColor: string;
  sublabelColor: string;
  dotColor: string;
  isDark: boolean;
}

const MILESTONES: readonly Milestone[] = [
  {
    id: 1,
    value: 7,
    suffix: "",
    label: "Years",
    sublabel: "crafting rituals since 2018",
    bgClass: "bg-mauve/25",
    valueColor: "text-deep",
    labelColor: "text-mauve",
    sublabelColor: "text-deep",
    dotColor: "#8A6F88",
    isDark: false,
  },
  {
    id: 2,
    value: 12000,
    suffix: "+",
    label: "Transformations",
    sublabel: "and counting",
    bgClass: "bg-deep",
    valueColor: "text-ivory",
    labelColor: "text-mauve",
    sublabelColor: "text-ivory/90",
    dotColor: "#FCFBFC",
    isDark: true,
  },
  {
    id: 3,
    value: 15,
    suffix: "",
    label: "Master artisans",
    sublabel: "on the Skin Essential team",
    bgClass: "bg-sage/30",
    valueColor: "text-deep",
    labelColor: "text-sage",
    sublabelColor: "text-deep",
    dotColor: "#4F7288",
    isDark: false,
  },
  {
    id: 4,
    value: 98,
    suffix: "%",
    label: "Return rate",
    sublabel: "of clients come back within a year",
    bgClass: "bg-gradient-to-br from-ivory to-mauve/20",
    valueColor: "text-deep",
    labelColor: "text-deep",
    sublabelColor: "text-deep",
    dotColor: "#47676A",
    isDark: false,
  },
] as const;

interface PRESS {
  name: string;
  quote: string;
}

const PRESS_MENTIONS: readonly PRESS[] = [
  { name: "Vogue Arabia", quote: "A new benchmark for African luxury skincare" },
  { name: "Harper's Bazaar", quote: "Serenity, distilled" },
  { name: "Forbes Africa", quote: "Redefining what a sanctuary can be" },
  { name: "Tatler Asia", quote: "The antidote to clinical coldness" },
];

/** Smoothly counts up from 0 to target when visible. */
function useCountUp(target: number, duration: number, active: boolean): number {
  const [value, setValue] = useState<number>(0);

  useEffect(() => {
    if (!active) return;
    let start: number | null = null;
    let rafId: number;

    const tick = (ts: number): void => {
      if (start === null) start = ts;
      const elapsed = ts - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setValue(Math.floor(eased * target));
      if (progress < 1) rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return (): void => cancelAnimationFrame(rafId);
  }, [target, duration, active]);

  return value;
}

function formatValue(n: number): string {
  return n >= 1000 ? `${(n / 1000).toFixed(0)}K` : String(n);
}

interface MilestoneCardProps {
  milestone: Milestone;
  index: number;
  inView: boolean;
}

function MilestoneCard({
  milestone,
  index,
  inView,
}: MilestoneCardProps): React.ReactElement {
  const count = useCountUp(milestone.value, 1800, inView);

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{
        duration: 0.8,
        delay: index * 0.1,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`group relative rounded-[2rem] p-8 sm:p-10 overflow-hidden border-2 border-deep/10 transition-all duration-700 hover:-translate-y-1 hover:shadow-[0_20px_50px_rgba(71,103,106,0.15)] ${milestone.bgClass}`}
    >
      {/* Halo */}
      <div
        className="absolute -inset-16 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${milestone.dotColor}50 0%, transparent 60%)`,
        }}
        aria-hidden
      />

      <div className="relative flex flex-col h-full">
        {/* Header row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: milestone.dotColor }}
            />
            <span className={`eyebrow text-[10px] ${milestone.labelColor}`}>
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Big number */}
        <div className="flex items-baseline gap-1">
          <span
            className={`font-display text-[5rem] sm:text-[6.5rem] font-light leading-[0.9] tracking-[-0.03em] tabular-nums ${milestone.valueColor}`}
          >
            {formatValue(count)}
          </span>
          <span
            className={`font-display text-4xl sm:text-5xl font-light ${milestone.valueColor}`}
          >
            {milestone.suffix}
          </span>
        </div>

        {/* Label */}
        <div className="mt-auto pt-6">
          <h3
            className={`font-display text-xl sm:text-2xl font-light leading-tight tracking-tight ${milestone.valueColor}`}
          >
            {milestone.label}
          </h3>
          <p className={`mt-2 text-sm font-light ${milestone.sublabelColor}`}>
            {milestone.sublabel}
          </p>
        </div>
      </div>
    </motion.article>
  );
}

export function Milestones(): React.ReactElement {
  const ref = useRef<HTMLDivElement | null>(null);
  const inView = useInView(ref, { once: true, margin: "-120px" });

  return (
    <section className="relative py-24 sm:py-36 overflow-hidden bg-ivory">
      <div
        className="absolute top-1/2 right-0 h-[500px] w-[500px] rounded-full blur-3xl opacity-15 pointer-events-none -translate-y-1/2"
        style={{ background: "radial-gradient(circle, #4F7288 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 sm:mb-20 max-w-3xl"
        >
          <span className="eyebrow text-mauve text-[11px] block mb-5">
            — Chapter Seven
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.02] tracking-tight text-deep text-balance">
            Numbers we're quietly proud of.
          </h2>
        </motion.div>

        {/* Milestones grid */}
        <div ref={ref} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-6">
          {MILESTONES.map((m, i) => (
            <MilestoneCard key={m.id} milestone={m} index={i} inView={inView} />
          ))}
        </div>

        {/* Press strip */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.9, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 sm:mt-24"
        >
          <div className="rounded-[2rem] bg-gradient-to-br from-deep via-deep to-deep-dark p-10 sm:p-14 border border-deep-dark overflow-hidden relative">
            {/* Orbs */}
            <div
              className="absolute -top-20 -right-20 h-80 w-80 rounded-full blur-3xl opacity-30 pointer-events-none"
              style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
              aria-hidden
            />
            <div
              className="absolute -bottom-20 -left-20 h-80 w-80 rounded-full blur-3xl opacity-25 pointer-events-none"
              style={{ background: "radial-gradient(circle, #4F7288 0%, transparent 70%)" }}
              aria-hidden
            />

            <div className="relative">
              <div className="flex items-center gap-4 mb-8">
                <div className="h-10 w-10 rounded-full bg-mauve/20 border border-mauve/30 flex items-center justify-center">
                  <Award className="h-4 w-4 text-mauve" strokeWidth={1.5} />
                </div>
                <span className="eyebrow text-mauve text-[10px]">
                  — As featured in
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {PRESS_MENTIONS.map((p, i) => (
                  <motion.div
                    key={p.name}
                    initial={{ opacity: 0, y: 14 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.6,
                      delay: 0.3 + i * 0.08,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="relative"
                  >
                    <div className="flex items-center gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, si) => (
                        <Star
                          key={si}
                          className="h-3 w-3 fill-mauve text-mauve"
                          strokeWidth={0}
                        />
                      ))}
                    </div>
                    <p className="font-display text-lg sm:text-xl font-light text-ivory leading-tight italic mb-3 text-balance">
                      "{p.quote}"
                    </p>
                    <p className="eyebrow text-mauve text-[10px]">
                      — {p.name}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}