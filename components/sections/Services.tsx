"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Droplets,
  Eye,
  Flower2,
  HandMetal,
  Sparkles,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { SERVICES } from "@/lib/constants";
import { cn } from "@/lib/utils";
import type { HomeService } from "@/lib/supabase/types";

interface DbService {
  id: string;
  name: string;
  category: string;
  description: string;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
}

function resolveIcon(name: string, category: string): LucideIcon {
  const text = `${name} ${category}`.toLowerCase();
  if (/massage|body/.test(text)) return HandMetal;
  if (/spa|therapy|aroma/.test(text)) return Flower2;
  if (/laser|hair removal|wax/.test(text)) return Zap;
  if (/lash|brow|microblad|eyelash/.test(text)) return Eye;
  if (/skincare|full care|regimen/.test(text)) return Droplets;
  return Sparkles;
}

interface CardPalette {
  cardBg: string;
  border: string;
  borderHover: string;
  glowColor: string;
  accent: string;
  accentHex: string;
  titleColor: string;
  bodyColor: string;
  eyebrowColor: string;
  arrowBg: string;
  arrowBgHover: string;
  arrowBorder: string;
  arrowText: string;
  arrowTextHover: string;
  iconBg: string;
  iconText: string;
  overlayGradient: string;
  accentBar: string;
  bodyTint: string;
  isDark: boolean;
}

const CARD_PALETTES: readonly CardPalette[] = [
  {
    // Mauve luxe
    cardBg: "bg-gradient-to-br from-mauve-tint via-ivory to-mauve-wash",
    border: "border-mauve/35",
    borderHover: "hover:border-mauve hover:shadow-glow",
    glowColor: "rgba(138,111,136,0.50)",
    accent: "text-mauve",
    accentHex: "#8A6F88",
    titleColor: "text-deep-dark",
    bodyColor: "text-deep/80",
    eyebrowColor: "text-mauve",
    arrowBg: "bg-white/40",
    arrowBgHover: "group-hover:bg-mauve",
    arrowBorder: "border-mauve/35",
    arrowText: "text-mauve",
    arrowTextHover: "group-hover:text-ivory",
    iconBg: "bg-gradient-to-br from-mauve to-mauve/80",
    iconText: "text-ivory",
    overlayGradient:
      "from-mauve/85 via-mauve/25 via-35% to-transparent",
    accentBar: "bg-gradient-to-r from-mauve via-mauve/70 to-sage/50",
    bodyTint: "bg-white/45",
    isDark: false,
  },
  {
    // Sage fresh
    cardBg: "bg-gradient-to-br from-sage-tint via-ivory to-sage-wash",
    border: "border-sage/35",
    borderHover: "hover:border-sage hover:shadow-glow-sage",
    glowColor: "rgba(79,114,136,0.58)",
    accent: "text-sage",
    accentHex: "#4F7288",
    titleColor: "text-deep-dark",
    bodyColor: "text-deep/80",
    eyebrowColor: "text-sage",
    arrowBg: "bg-white/40",
    arrowBgHover: "group-hover:bg-sage",
    arrowBorder: "border-sage/35",
    arrowText: "text-sage",
    arrowTextHover: "group-hover:text-ivory",
    iconBg: "bg-gradient-to-br from-sage to-deep",
    iconText: "text-ivory",
    overlayGradient:
      "from-sage/85 via-sage/25 via-35% to-transparent",
    accentBar: "bg-gradient-to-r from-sage via-deep-light to-mauve/60",
    bodyTint: "bg-white/45",
    isDark: false,
  },
  {
    // Deep dramatic
    cardBg: "bg-gradient-to-br from-deep via-deep-light to-deep-dark",
    border: "border-mauve/25",
    borderHover: "hover:border-mauve/60 hover:shadow-glow-deep",
    glowColor: "rgba(71,103,106,0.68)",
    accent: "text-mauve-wash",
    accentHex: "#8A6F88",
    titleColor: "text-ivory",
    bodyColor: "text-ivory/80",
    eyebrowColor: "text-mauve-wash",
    arrowBg: "bg-ivory/10",
    arrowBgHover: "group-hover:bg-mauve",
    arrowBorder: "border-ivory/25",
    arrowText: "text-ivory",
    arrowTextHover: "group-hover:text-ivory",
    iconBg: "bg-gradient-to-br from-ivory to-mauve-wash",
    iconText: "text-deep",
    overlayGradient:
      "from-deep-dark/95 via-deep/45 via-40% to-transparent",
    accentBar: "bg-gradient-to-r from-mauve via-deep-light to-forest",
    bodyTint: "bg-white/5",
    isDark: true,
  },
  {
    // Multi-tone premium
    cardBg: "bg-gradient-to-br from-ivory via-mauve-tint to-sage-tint",
    border: "border-deep/20",
    borderHover: "hover:border-forest hover:shadow-lift",
    glowColor: "rgba(15,95,46,0.28)",
    accent: "text-forest",
    accentHex: "#0F5F2E",
    titleColor: "text-deep-dark",
    bodyColor: "text-deep/80",
    eyebrowColor: "text-forest",
    arrowBg: "bg-white/40",
    arrowBgHover: "group-hover:bg-forest",
    arrowBorder: "border-forest/30",
    arrowText: "text-forest",
    arrowTextHover: "group-hover:text-ivory",
    iconBg: "bg-gradient-to-br from-forest to-deep",
    iconText: "text-ivory",
    overlayGradient:
      "from-forest/75 via-deep/20 via-35% to-transparent",
    accentBar: "bg-gradient-to-r from-forest via-sage to-mauve",
    bodyTint: "bg-white/45",
    isDark: false,
  },
] as const;

interface ServiceCardProps {
  service: HomeService;
  index: number;
}

function ServiceCard({ service, index }: ServiceCardProps): React.ReactElement {
  const Icon = service.icon;
  const palette = CARD_PALETTES[index % CARD_PALETTES.length]!;
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
        "relative overflow-hidden rounded-[2rem] border-2 backdrop-blur-xl shadow-glass transition-all duration-700 ease-cinematic hover:shadow-lift",
        offset
      )}
    >
      <Link
        href="/services"
        className={cn(
          "group block",
          palette.cardBg,
          palette.border,
          palette.borderHover
        )}
      >
        {/* Top color accent */}
        <div className={cn("absolute inset-x-0 top-0 h-1.5", palette.accentBar)} />

        {/* Hover glow */}
        <div
          className="pointer-events-none absolute -inset-20 opacity-0 blur-3xl transition-opacity duration-1000 group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle at 50% 0%, ${palette.glowColor} 0%, transparent 58%)`,
          }}
          aria-hidden
        />

        {/* Secondary inner wash */}
        <div
          className={cn(
            "pointer-events-none absolute inset-x-6 bottom-6 top-[42%] rounded-[1.5rem] blur-2xl opacity-50",
            palette.bodyTint
          )}
          aria-hidden
        />

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
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

          {/* Floating accent orb */}
          <div
            className="absolute -right-8 top-8 h-24 w-24 rounded-full blur-2xl opacity-40 transition-all duration-700 group-hover:scale-125"
            style={{ backgroundColor: palette.accentHex }}
            aria-hidden
          />

          {/* Icon tile */}
          <div className="absolute left-5 top-5">
            <div
              className={cn(
                "flex h-12 w-12 items-center justify-center rounded-2xl shadow-glass transition-all duration-500 group-hover:-rotate-6 group-hover:scale-110",
                palette.iconBg
              )}
            >
              <Icon className={cn("h-5 w-5", palette.iconText)} strokeWidth={1.5} />
            </div>
          </div>

          {/* Decorative number */}
          <span
            className="pointer-events-none absolute bottom-4 left-5 font-display text-6xl font-light leading-none tracking-tighter text-ivory opacity-50 transition-opacity duration-500 group-hover:opacity-80"
          >
            0{index + 1}
          </span>
        </div>

        <div className="relative p-7 sm:p-8">
          <div
            className={cn(
              "mb-5 h-px w-14 transition-all duration-700 group-hover:w-24",
              palette.isDark ? "bg-mauve/80" : "bg-gradient-to-r from-mauve via-sage to-deep"
            )}
          />

          <h3
            className={cn(
              "font-display text-2xl font-light tracking-tight sm:text-3xl",
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
            <span className={cn("eyebrow", palette.eyebrowColor)}>Discover</span>

            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500 group-hover:scale-110",
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
      </Link>
    </motion.article>
  );
}

export function Services(): React.ReactElement {
  const [displayServices, setDisplayServices] = useState<HomeService[]>([...SERVICES]);

  useEffect(() => {
    fetch("/api/services")
      .then((r) => r.json())
      .then((rows: DbService[]) => {
        if (!Array.isArray(rows) || rows.length === 0) return;
        const active = rows.filter((r) => r.is_active);
        if (active.length === 0) return;
        setDisplayServices(
          active.map((svc, i) => ({
            id: i + 1,
            title: svc.name,
            description: svc.description,
            image: svc.image_url ?? SERVICES[i % SERVICES.length]?.image ?? "",
            icon: resolveIcon(svc.name, svc.category),
          }))
        );
      })
      .catch(() => {});
  }, []);

  return (
    <section
      id="services"
      className="relative overflow-hidden py-24 sm:py-32 section-padding"
    >
      {/* Larger colorful ambient backdrop */}
      <div
        className="pointer-events-none absolute -right-40 top-10 h-[620px] w-[620px] rounded-full blur-3xl opacity-30"
        style={{
          background: "radial-gradient(circle, rgba(138,111,136,0.9) 0%, rgba(138,111,136,0.18) 35%, transparent 72%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -left-40 bottom-10 h-[560px] w-[560px] rounded-full blur-3xl opacity-25"
        style={{
          background: "radial-gradient(circle, rgba(79,114,136,0.95) 0%, rgba(79,114,136,0.18) 35%, transparent 72%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(71,103,106,0.9) 0%, rgba(71,103,106,0.14) 40%, transparent 75%)",
        }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute bottom-24 right-1/4 h-[260px] w-[260px] rounded-full blur-3xl opacity-20"
        style={{
          background: "radial-gradient(circle, rgba(15,95,46,0.8) 0%, rgba(15,95,46,0.12) 40%, transparent 75%)",
        }}
        aria-hidden
      />

      {/* Soft mesh veil */}
      <div className="absolute inset-0 bg-gradient-mesh opacity-20" aria-hidden />

      <div className="relative mx-auto max-w-7xl">
        <div className="relative">
          <SectionHeading
            eyebrow="Signature Rituals"
            title="Curated experiences, crafted for you."
            description="A constellation of treatments — each one engineered, refined, and personalized to reveal your most radiant self."
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 flex items-center justify-center gap-2"
          >
            {["#8A6F88", "#4F7288", "#47676A", "#0F5F2E", "#FCFBFC"].map((c) => (
              <span
                key={c}
                className="h-2 w-2 rounded-full ring-1 ring-deep/15"
                style={{ backgroundColor: c }}
              />
            ))}
          </motion.div>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4 lg:gap-7">
          {displayServices.map((service, i) => (
            <ServiceCard key={service.id} service={service} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}