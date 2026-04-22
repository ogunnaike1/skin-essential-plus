"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { Service } from "@/types";

/**
 * Per-card palette identity. Each card owns a distinct combination
 * so the four services feel like a set, not duplicates.
 */
interface CardPalette {
  cardBg: string;        // card background (tailwind class)
  border: string;        // resting border
  borderHover: string;   // hover border
  glowColor: string;     // rgba value for radial halo
  accent: string;        // tailwind color class for accent text
  accentHex: string;     // hex for decorative elements
  titleColor: string;    // title text class
  bodyColor: string;     // body paragraph class
  eyebrowColor: string;  // "Discover" label
  arrowBg: string;       // arrow circle resting
  arrowBgHover: string;  // arrow circle hover
  arrowBorder: string;
  arrowText: string;
  arrowTextHover: string;
  iconBg: string;
  iconText: string;
  overlayGradient: string; // image overlay
  priceBg: string;
  priceText: string;
  priceBorder: string;
  isDark: boolean;
}

const CARD_PALETTES: readonly CardPalette[] = [
  // Card 1 — Mauve blush (light)
  {
    cardBg: "bg-ivory/70",
    border: "border-mauve/30",
    borderHover: "hover:border-mauve",
    glowColor: "rgba(192,169,189,0.45)",
    accent: "text-mauve",
    accentHex: "#8A6F88",
    titleColor: "text-deep",
    bodyColor: "text-deep/70",
    eyebrowColor: "text-mauve",
    arrowBg: "bg-transparent",
    arrowBgHover: "group-hover:bg-mauve",
    arrowBorder: "border-mauve/40",
    arrowText: "text-mauve",
    arrowTextHover: "group-hover:text-ivory",
    iconBg: "bg-mauve",
    iconText: "text-ivory",
    overlayGradient: "from-mauve/70 via-mauve/10 to-transparent",
    priceBg: "bg-ivory",
    priceText: "text-mauve",
    priceBorder: "border-mauve/30",
    isDark: false,
  },
  // Card 2 — Sage serenity (light)
  {
    cardBg: "bg-sage/15",
    border: "border-sage/30",
    borderHover: "hover:border-sage",
    glowColor: "rgba(148,167,174,0.55)",
    accent: "text-sage",
    accentHex: "#4F7288",
    titleColor: "text-deep-dark",
    bodyColor: "text-deep/75",
    eyebrowColor: "text-sage",
    arrowBg: "bg-transparent",
    arrowBgHover: "group-hover:bg-sage",
    arrowBorder: "border-sage/40",
    arrowText: "text-sage",
    arrowTextHover: "group-hover:text-ivory",
    iconBg: "bg-sage",
    iconText: "text-ivory",
    overlayGradient: "from-sage/75 via-sage/15 to-transparent",
    priceBg: "bg-ivory",
    priceText: "text-sage",
    priceBorder: "border-sage/30",
    isDark: false,
  },
  // Card 3 — Deep teal premium (DARK card — breaks the rhythm)
  {
    cardBg: "bg-deep",
    border: "border-deep-dark",
    borderHover: "hover:border-mauve/50",
    glowColor: "rgba(71,103,106,0.6)",
    accent: "text-mauve",
    accentHex: "#8A6F88",
    titleColor: "text-ivory",
    bodyColor: "text-ivory/70",
    eyebrowColor: "text-mauve",
    arrowBg: "bg-ivory/10",
    arrowBgHover: "group-hover:bg-ivory",
    arrowBorder: "border-ivory/30",
    arrowText: "text-ivory",
    arrowTextHover: "group-hover:text-deep",
    iconBg: "bg-ivory",
    iconText: "text-deep",
    overlayGradient: "from-deep via-deep/40 to-transparent",
    priceBg: "bg-mauve",
    priceText: "text-ivory",
    priceBorder: "border-mauve",
    isDark: true,
  },
  // Card 4 — Mauve-deep duotone (light)
  {
    cardBg: "bg-gradient-to-br from-ivory via-mauve/20 to-sage/20",
    border: "border-deep/20",
    borderHover: "hover:border-deep",
    glowColor: "rgba(192,169,189,0.4)",
    accent: "text-deep",
    accentHex: "#47676A",
    titleColor: "text-deep",
    bodyColor: "text-deep/70",
    eyebrowColor: "text-deep",
    arrowBg: "bg-transparent",
    arrowBgHover: "group-hover:bg-deep",
    arrowBorder: "border-deep/40",
    arrowText: "text-deep",
    arrowTextHover: "group-hover:text-ivory",
    iconBg: "bg-deep",
    iconText: "text-ivory",
    overlayGradient: "from-deep/80 via-deep/25 to-transparent",
    priceBg: "bg-deep",
    priceText: "text-ivory",
    priceBorder: "border-deep",
    isDark: false,
  },
] as const;

interface ServiceCardProps {
  service: Service;
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps): React.ReactElement {
  const Icon = service.icon;
  const palette = CARD_PALETTES[index % CARD_PALETTES.length]!;

  // Asymmetric vertical offset — cards 2 & 4 sit lower on desktop
  const offset = index % 2 === 1 ? "lg:mt-16" : "lg:mt-0";

  return (
    <motion.article
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{
        duration: 0.75,
        delay: index * 0.12,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -10 }}
      className={cn(
        "group relative overflow-hidden rounded-[2rem] backdrop-blur-xl border-2 shadow-glass transition-all duration-700 ease-cinematic hover:shadow-lift",
        palette.cardBg,
        palette.border,
        palette.borderHover,
        offset
      )}
    >
      {/* Radial halo on hover — per-card color */}
      <div
        className="absolute -inset-20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${palette.glowColor} 0%, transparent 55%)`,
        }}
        aria-hidden
      />

      {/* Image + colored overlay */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.image}
          alt={service.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
          className="object-cover transition-transform duration-[1.4s] ease-cinematic group-hover:scale-110"
        />
        <div
          className={cn(
            "absolute inset-0 bg-gradient-to-t mix-blend-multiply",
            palette.overlayGradient
          )}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/15 via-transparent to-transparent" />

        {/* Icon tile */}
        <div className="absolute top-5 left-5">
          <div
            className={cn(
              "h-12 w-12 rounded-2xl flex items-center justify-center shadow-glass transition-all duration-500 group-hover:scale-110 group-hover:-rotate-6",
              palette.iconBg
            )}
          >
            <Icon
              className={cn("h-5 w-5", palette.iconText)}
              strokeWidth={1.5}
            />
          </div>
        </div>

        {/* Price pill */}
        <div className="absolute top-5 right-5">
          <span
            className={cn(
              "eyebrow px-3 py-1.5 rounded-full text-[10px] border backdrop-blur-md",
              palette.priceBg,
              palette.priceText,
              palette.priceBorder
            )}
          >
            {service.price}
          </span>
        </div>

        {/* Decorative number — bottom left of image */}
        <span
          className={cn(
            "absolute bottom-4 left-5 font-display text-6xl font-light leading-none tracking-tighter opacity-40 pointer-events-none transition-opacity duration-500 group-hover:opacity-70",
            palette.isDark ? "text-ivory" : "text-ivory"
          )}
        >
          0{index + 1}
        </span>
      </div>

      {/* Body */}
      <div className="relative p-7 sm:p-8">
        <div
          className={cn(
            "h-px w-12 mb-5 transition-all duration-700 group-hover:w-20",
            palette.isDark ? "bg-mauve" : "bg-deep/30"
          )}
        />

        <h3
          className={cn(
            "font-display text-2xl sm:text-3xl font-light tracking-tight",
            palette.titleColor
          )}
        >
          {service.title}
        </h3>
        <p
          className={cn(
            "mt-3 text-sm font-light leading-relaxed",
            palette.bodyColor
          )}
        >
          {service.description}
        </p>

        <div className="mt-7 flex items-center justify-between">
          <span className={cn("eyebrow", palette.eyebrowColor)}>
            Discover
          </span>
          <div
            className={cn(
              "h-10 w-10 rounded-full border flex items-center justify-center transition-all duration-500",
              palette.arrowBg,
              palette.arrowBorder,
              palette.arrowBgHover
            )}
          >
            <ArrowUpRight
              className={cn(
                "h-4 w-4 transition-all duration-500 group-hover:rotate-45",
                palette.arrowText,
                palette.arrowTextHover
              )}
              strokeWidth={1.5}
            />
          </div>
        </div>
      </div>
    </motion.article>
  );
}

export function Services(): React.ReactElement {
  return (
    <section
      id="services"
      className="relative py-24 sm:py-32 section-padding overflow-hidden"
    >
      {/* Layered ambient backdrop using all four palette colors */}
      <div
        className="absolute top-20 -right-40 h-[600px] w-[600px] rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="absolute bottom-20 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4F7288 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[300px] w-[300px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #47676A 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto">
        {/* Heading with decorative palette swatch row */}
        <div className="relative">
          <SectionHeading
            eyebrow="Signature Rituals"
            title="Curated experiences, crafted for you."
            description="A constellation of treatments — each one engineered, refined, and personalized to reveal your most radiant self."
          />

          {/* Decorative color dot row */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center justify-center gap-2 mt-8"
          >
            {["#8A6F88", "#4F7288", "#47676A", "#F4F2F3"].map((c) => (
              <span
                key={c}
                className="h-1.5 w-1.5 rounded-full ring-1 ring-deep/15"
                style={{ backgroundColor: c }}
              />
            ))}
          </motion.div>
        </div>

        <div className="mt-16 lg:mt-20 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-7">
          {SERVICES.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
