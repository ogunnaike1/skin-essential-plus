"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

import { TRUST_POINTS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { TrustPoint } from "@/types";

/**
 * Per-card palette identity. Each trust card owns a different
 * palette color so the four pillars feel distinct yet unified.
 */
interface TrustPalette {
  bg: string;            // card background
  border: string;
  borderHover: string;
  iconBg: string;
  iconText: string;
  iconGlow: string;      // rgba for halo
  titleColor: string;
  bodyColor: string;
  numberColor: string;   // giant watermark number
  lineColor: string;     // bottom accent line
  accent: string;        // eyebrow/small accent
  isDark: boolean;
}

const TRUST_PALETTES: readonly TrustPalette[] = [
  // 01 — Mauve
  {
    bg: "bg-ivory/80",
    border: "border-mauve/30",
    borderHover: "hover:border-mauve",
    iconBg: "bg-mauve",
    iconText: "text-ivory",
    iconGlow: "rgba(192,169,189,0.5)",
    titleColor: "text-deep",
    bodyColor: "text-deep/70",
    numberColor: "text-mauve/25",
    lineColor: "bg-gradient-to-r from-mauve to-transparent",
    accent: "text-mauve",
    isDark: false,
  },
  // 02 — Sage
  {
    bg: "bg-sage/20",
    border: "border-sage/35",
    borderHover: "hover:border-sage",
    iconBg: "bg-sage",
    iconText: "text-ivory",
    iconGlow: "rgba(148,167,174,0.55)",
    titleColor: "text-deep-dark",
    bodyColor: "text-deep/75",
    numberColor: "text-sage/30",
    lineColor: "bg-gradient-to-r from-sage to-transparent",
    accent: "text-sage",
    isDark: false,
  },
  // 03 — Deep teal DARK
  {
    bg: "bg-deep",
    border: "border-deep-dark",
    borderHover: "hover:border-mauve/60",
    iconBg: "bg-ivory",
    iconText: "text-deep",
    iconGlow: "rgba(244,242,243,0.4)",
    titleColor: "text-ivory",
    bodyColor: "text-ivory/75",
    numberColor: "text-mauve/30",
    lineColor: "bg-gradient-to-r from-mauve to-transparent",
    accent: "text-mauve",
    isDark: true,
  },
  // 04 — Ivory with deep accent
  {
    bg: "bg-gradient-to-br from-ivory to-mauve/15",
    border: "border-deep/20",
    borderHover: "hover:border-deep",
    iconBg: "bg-deep",
    iconText: "text-ivory",
    iconGlow: "rgba(71,103,106,0.45)",
    titleColor: "text-deep",
    bodyColor: "text-deep/70",
    numberColor: "text-deep/20",
    lineColor: "bg-gradient-to-r from-deep to-transparent",
    accent: "text-deep",
    isDark: false,
  },
] as const;

interface TrustCardProps {
  point: TrustPoint;
  index: number;
}

function TrustCard({ point, index }: TrustCardProps): React.ReactElement {
  const Icon = point.icon;
  const palette = TRUST_PALETTES[index % TRUST_PALETTES.length]!;

  // Stagger cards 2 & 4 down for an asymmetric mosaic
  const offset = index % 2 === 1 ? "sm:mt-10" : "sm:mt-0";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.75,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn("group relative", offset)}
    >
      <div
        className={cn(
          "relative h-full p-8 rounded-3xl border-2 backdrop-blur-xl transition-all duration-700 overflow-hidden hover:shadow-glass-lg",
          palette.bg,
          palette.border,
          palette.borderHover
        )}
      >
        {/* Giant decorative number */}
        <span
          className={cn(
            "absolute -top-2 -right-2 font-display text-[9rem] leading-none font-light tracking-tighter pointer-events-none select-none transition-all duration-700 group-hover:scale-110 group-hover:-translate-y-1",
            palette.numberColor
          )}
        >
          0{index + 1}
        </span>

        {/* Icon with halo */}
        <div className="relative mb-6 inline-block">
          <div
            className="absolute -inset-4 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-700"
            style={{ background: `radial-gradient(circle, ${palette.iconGlow} 0%, transparent 70%)` }}
          />
          <div
            className={cn(
              "relative h-14 w-14 rounded-2xl flex items-center justify-center shadow-glass transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6",
              palette.iconBg
            )}
          >
            <Icon
              className={cn("h-6 w-6", palette.iconText)}
              strokeWidth={1.5}
            />
          </div>
        </div>

        <h3
          className={cn(
            "relative font-display text-2xl font-light tracking-tight",
            palette.titleColor
          )}
        >
          {point.title}
        </h3>
        <p
          className={cn(
            "relative mt-3 text-sm font-light leading-relaxed max-w-[90%]",
            palette.bodyColor
          )}
        >
          {point.description}
        </p>

        <div className="relative mt-6 flex items-center gap-3">
          <div
            className={cn(
              "h-px w-12 transition-all duration-700 group-hover:w-24",
              palette.lineColor
            )}
          />
          <span className={cn("eyebrow text-[10px]", palette.accent)}>
            Pillar {String(index + 1).padStart(2, "0")}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

export function WhyChooseUs(): React.ReactElement {
  return (
    <section className="relative py-24 sm:py-32 section-padding overflow-hidden">
      {/* Ambient gradient wash */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 20% 30%, rgba(192,169,189,0.12) 0%, transparent 60%), radial-gradient(ellipse 60% 50% at 80% 70%, rgba(148,167,174,0.12) 0%, transparent 60%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
          {/* Inverted heading card — deep teal with mauve/sage accents */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 lg:sticky lg:top-32"
          >
            <div className="relative rounded-3xl bg-deep text-ivory p-10 sm:p-12 overflow-hidden shadow-lift border border-deep-dark">
              {/* Floating palette orbs inside the dark card */}
              <div
                className="absolute -top-20 -right-20 h-64 w-64 rounded-full blur-3xl opacity-40 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)",
                }}
                aria-hidden
              />
              <div
                className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full blur-3xl opacity-30 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #4F7288 0%, transparent 70%)",
                }}
                aria-hidden
              />

              <div className="relative">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory/10 border border-ivory/20 mb-8">
                  <Sparkles className="h-3 w-3 text-mauve" />
                  <span className="eyebrow text-mauve text-[10px]">
                    Our Philosophy
                  </span>
                </div>

                <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.02] tracking-tight text-balance">
                  Why we're your{" "}
                  <em className="not-italic text-mauve">sanctuary</em>.
                </h2>

                <p className="mt-6 text-base sm:text-lg text-ivory/75 font-light leading-relaxed">
                  Four pillars hold up every experience we craft — precision, conscience, mastery, and intimacy. Each one sculpted with the same rigor we apply to your skin.
                </p>

                {/* Color swatch row representing the four pillars */}
                <div className="mt-10 pt-8 border-t border-ivory/15">
                  <p className="eyebrow text-mauve text-[10px] mb-4">
                    Four pillars
                  </p>
                  <div className="flex items-center gap-3">
                    {[
                      { color: "#8A6F88", label: "Precision" },
                      { color: "#4F7288", label: "Conscience" },
                      { color: "#F4F2F3", label: "Mastery" },
                      { color: "#8A6F88", label: "Intimacy" },
                    ].map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span
                          className="h-2 w-2 rounded-full"
                          style={{ backgroundColor: s.color }}
                        />
                        <span className="text-[11px] text-ivory/60 font-light tracking-wide">
                          {s.label}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Colored trust cards */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
            {TRUST_POINTS.map((point, i) => (
              <TrustCard key={point.id} point={point} index={i} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
