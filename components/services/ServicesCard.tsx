"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  CalendarCheck,
  Clock,
  Heart,
  MapPin,
  Sparkles,
  Star,
  Users,
} from "lucide-react";
import Image from "next/image";

import { formatDuration, formatPrice } from "@/lib/services-data";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/types";

interface ServiceCardProps {
  service: ServiceItem;
  index: number;
  accentColor: "mauve" | "sage" | "deep" | "mixed";
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onViewEmployees: (service: ServiceItem) => void;
  onBook: (service: ServiceItem) => void;
}

export function ServiceCard({
  service,
  index,
  accentColor,
  isFavorite,
  onToggleFavorite,
  onViewEmployees,
  onBook,
}: ServiceCardProps): React.ReactElement {
  const isFullyBooked = service.slotsAvailable === 0;
  const isLowAvailability = service.slotsAvailable > 0 && service.slotsAvailable <= 1;

  // Accent color mapping
  const accentText: Record<typeof accentColor, string> = {
    mauve: "text-mauve",
    sage: "text-sage",
    deep: "text-deep",
    mixed: "text-deep",
  };

  const accentBg: Record<typeof accentColor, string> = {
    mauve: "bg-mauve",
    sage: "bg-sage",
    deep: "bg-deep",
    mixed: "bg-deep",
  };

  const accentHex: Record<typeof accentColor, string> = {
    mauve: "#C0A9BD",
    sage: "#94A7AE",
    deep: "#47676A",
    mixed: "#47676A",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.7,
        delay: (index % 3) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      whileHover={{ y: -6 }}
      className="group relative flex flex-col h-full rounded-[1.75rem] bg-ivory border-2 border-deep/10 overflow-hidden transition-all duration-500 hover:border-deep/25 hover:shadow-[0_20px_50px_rgba(71,103,106,0.15)]"
    >
      {/* Halo on hover */}
      <div
        className="absolute -inset-16 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none blur-3xl"
        style={{
          background: `radial-gradient(circle at 50% 0%, ${accentHex[accentColor]}40 0%, transparent 60%)`,
        }}
        aria-hidden
      />

      {/* Image */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-[1.2s] ease-cinematic group-hover:scale-105"
        />
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 mix-blend-multiply transition-opacity duration-500"
          style={{ backgroundColor: accentHex[accentColor] }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-deep/30 via-transparent to-transparent" />

        {/* Top-left tags */}
        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="inline-flex self-start px-3 py-1 rounded-full bg-ivory/95 backdrop-blur-sm text-deep text-[10px] uppercase tracking-[0.18em] border border-white/60 font-medium">
            {service.tag}
          </span>
          {service.popular ? (
            <span className="inline-flex self-start items-center gap-1 px-3 py-1 rounded-full bg-mauve text-ivory text-[10px] uppercase tracking-[0.18em]">
              <Sparkles className="h-3 w-3" strokeWidth={1.75} />
              Popular
            </span>
          ) : null}
          {service.isNew ? (
            <span className="inline-flex self-start px-3 py-1 rounded-full bg-sage text-ivory text-[10px] uppercase tracking-[0.18em]">
              New
            </span>
          ) : null}
        </div>

        {/* Top-right: availability + favorite */}
        <div className="absolute top-4 right-4 flex flex-col items-end gap-2">
          <button
            type="button"
            onClick={() => onToggleFavorite(service.id)}
            aria-label={isFavorite ? "Remove from favorites" : "Save to favorites"}
            aria-pressed={isFavorite}
            className="h-9 w-9 rounded-full bg-ivory/95 backdrop-blur-sm border border-white/60 flex items-center justify-center hover:scale-110 transition-transform duration-300 cursor-pointer"
          >
            <Heart
              className={cn(
                "h-4 w-4 transition-all duration-300",
                isFavorite ? "fill-mauve text-mauve" : "text-deep/70"
              )}
              strokeWidth={1.5}
            />
          </button>

          <span
            className={cn(
              "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] uppercase tracking-[0.18em] font-medium border",
              isFullyBooked
                ? "bg-deep/90 text-ivory border-deep"
                : isLowAvailability
                  ? "bg-mauve text-ivory border-mauve"
                  : "bg-ivory/95 text-deep border-white/60"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                isFullyBooked ? "bg-ivory/60" : "bg-ivory animate-pulse-soft"
              )}
            />
            {isFullyBooked
              ? "Fully booked"
              : isLowAvailability
                ? "Almost gone"
                : "Available"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-col flex-1 p-6">
        {/* Rating */}
        <div className="flex items-center gap-2 mb-3">
          <div className="flex items-center gap-0.5">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-3 w-3",
                  i < Math.round(service.rating)
                    ? "fill-mauve text-mauve"
                    : "text-deep/20"
                )}
                strokeWidth={0}
              />
            ))}
          </div>
          <span className="text-xs font-medium text-deep tabular-nums">
            {service.rating.toFixed(1)}
          </span>
          <span className="text-xs text-deep/50 font-light">
            ({service.reviewCount})
          </span>
        </div>

        {/* Name */}
        <h3 className="font-display text-xl sm:text-2xl font-light text-deep leading-tight tracking-tight mb-2">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-sm font-light text-deep/65 leading-relaxed line-clamp-2 mb-5">
          {service.description}
        </p>

        {/* Meta grid — duration, slots, location */}
        <div className="space-y-2.5 mb-5 pb-5 border-b border-deep/10">
          <div className="flex items-center gap-2 text-[13px] text-deep/75">
            <Clock className="h-3.5 w-3.5 shrink-0 text-deep/50" strokeWidth={1.5} />
            <span className="font-light">{formatDuration(service.durationMinutes)}</span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-deep/75">
            <Users className="h-3.5 w-3.5 shrink-0 text-deep/50" strokeWidth={1.5} />
            <span className="font-light tabular-nums">
              {service.slotsAvailable}/{service.slotsTotal} slots available
            </span>
          </div>
          <div className="flex items-center gap-2 text-[13px] text-deep/75">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-deep/50" strokeWidth={1.5} />
            <span className="font-light truncate">{service.location}</span>
          </div>
        </div>

        {/* Price + CTAs — pushed to bottom */}
        <div className="mt-auto">
          <div className="flex items-baseline justify-between mb-4">
            <div>
              <p className="eyebrow text-deep/50 text-[9px] mb-1">Price</p>
              <p
                className={cn(
                  "font-display text-2xl sm:text-3xl font-light leading-none tabular-nums",
                  accentText[accentColor]
                )}
              >
                {formatPrice(service.price)}
              </p>
            </div>
            <a
              href={`#details-${service.id}`}
              className="text-[11px] uppercase tracking-[0.18em] text-deep/60 hover:text-deep transition-colors inline-flex items-center gap-1"
            >
              View details
              <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
            </a>
          </div>

          <div className="flex items-stretch gap-2">
            <button
              type="button"
              onClick={() => onViewEmployees(service)}
              className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-3 rounded-full border border-deep/20 text-deep font-sans text-[10px] uppercase tracking-[0.18em] hover:bg-deep hover:text-ivory hover:border-deep transition-all duration-400 cursor-pointer"
            >
              <Users className="h-3.5 w-3.5" strokeWidth={1.5} />
              <span className="hidden sm:inline">View employees</span>
              <span className="sm:hidden">Employees</span>
            </button>
            <button
              type="button"
              onClick={() => onBook(service)}
              disabled={isFullyBooked}
              className={cn(
                "flex-1 group/btn inline-flex items-center justify-center gap-2 px-3 py-3 rounded-full font-sans text-[10px] uppercase tracking-[0.18em] transition-all duration-400",
                isFullyBooked
                  ? "bg-deep/20 text-deep/40 cursor-not-allowed"
                  : cn(
                      accentBg[accentColor],
                      "text-ivory hover:shadow-[0_6px_20px_rgba(71,103,106,0.25)] hover:scale-[1.02] cursor-pointer"
                    )
              )}
            >
              <CalendarCheck className="h-3.5 w-3.5" strokeWidth={1.75} />
              <span>{isFullyBooked ? "Waitlist" : "Book service"}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.article>
  );
}