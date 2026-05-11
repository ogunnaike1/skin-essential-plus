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
  const isLowAvailability =
    service.slotsAvailable > 0 && service.slotsAvailable <= 1;

  const isOnSale = !!(service.originalPrice && service.originalPrice > service.price);
  const discountPct = isOnSale
    ? Math.round(((service.originalPrice! - service.price) / service.originalPrice!) * 100)
    : 0;

  const accentBg: Record<typeof accentColor, string> = {
    mauve: "bg-mauve",
    sage: "bg-sage",
    deep: "bg-deep",
    mixed: "bg-deep",
  };

  const accentStripe: Record<typeof accentColor, string> = {
    mauve: "bg-mauve",
    sage: "bg-sage",
    deep: "bg-deep",
    mixed: "bg-mauve",
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex flex-col h-full rounded-2xl bg-ivory border border-deep/10 overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-deep/25 hover:shadow-[0_10px_30px_rgba(71,103,106,0.1)]"
    >
      {/* Top accent stripe */}
      <div
        className={cn(
          "absolute top-0 inset-x-0 h-0.5 z-10",
          accentStripe[accentColor]
        )}
      />

      {/* Image — compact height */}
      <div className="relative aspect-[16/10] overflow-hidden bg-deep/5">
        <Image
          src={service.image}
          alt={service.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-deep/50 to-transparent pointer-events-none" />

        {/* Top-left: single tag + optional popular/new/sale */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          <span className="inline-flex self-start px-2 py-0.5 rounded-full bg-ivory text-deep text-[9px] uppercase tracking-[0.15em] font-medium shadow-sm">
            {service.tag}
          </span>
          {isOnSale ? (
            <span className="inline-flex self-start px-2 py-0.5 rounded-full bg-mauve text-ivory text-[9px] uppercase tracking-[0.15em] font-medium shadow-sm">
              -{discountPct}% off
            </span>
          ) : service.popular ? (
            <span className="inline-flex self-start items-center gap-1 px-2 py-0.5 rounded-full bg-mauve text-ivory text-[9px] uppercase tracking-[0.15em] font-medium shadow-sm">
              <Sparkles className="h-2.5 w-2.5" strokeWidth={1.75} />
              Popular
            </span>
          ) : null}
          {service.isNew ? (
            <span className="inline-flex self-start px-2 py-0.5 rounded-full bg-sage text-ivory text-[9px] uppercase tracking-[0.15em] font-medium shadow-sm">
              New
            </span>
          ) : null}
        </div>

        {/* Top-right: favorite + availability */}
        <div className="absolute top-3 right-3 flex flex-col items-end gap-1.5 z-10">
          <button
            type="button"
            onClick={() => onToggleFavorite(service.id)}
            aria-label={
              isFavorite ? "Remove from favorites" : "Save to favorites"
            }
            aria-pressed={isFavorite}
            className="h-7 w-7 rounded-full bg-ivory flex items-center justify-center transition-colors duration-200 hover:bg-mauve/20 cursor-pointer shadow-sm"
          >
            <Heart
              className={cn(
                "h-3.5 w-3.5 transition-colors duration-200",
                isFavorite ? "fill-mauve text-mauve" : "text-deep"
              )}
              strokeWidth={1.5}
            />
          </button>

          <span
            className={cn(
              "inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.15em] font-medium shadow-sm",
              isFullyBooked
                ? "bg-deep text-ivory"
                : isLowAvailability
                  ? "bg-mauve text-ivory"
                  : "bg-ivory text-deep"
            )}
          >
            <span
              className={cn(
                "h-1 w-1 rounded-full",
                isFullyBooked || isLowAvailability
                  ? "bg-ivory"
                  : "bg-sage animate-pulse-soft"
              )}
            />
            {isFullyBooked
              ? "Booked"
              : isLowAvailability
                ? "Almost gone"
                : "Available"}
          </span>
        </div>
      </div>

      {/* Body */}
      <div className="relative flex flex-col flex-1 p-4 bg-ivory">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-1.5">
          <div className="flex items-center gap-px">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                className={cn(
                  "h-2.5 w-2.5",
                  i < Math.round(service.rating)
                    ? "fill-mauve text-mauve"
                    : "text-deep/20"
                )}
                strokeWidth={0}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-deep tabular-nums">
            {service.rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-deep font-light">
            ({service.reviewCount})
          </span>
        </div>

        {/* Name */}
        <h3 className="font-display text-base sm:text-lg font-normal text-deep leading-tight tracking-tight mb-1">
          {service.name}
        </h3>

        {/* Description */}
        <p className="text-xs font-light text-deep leading-relaxed line-clamp-2 mb-3">
          {service.description}
        </p>

        {/* Meta — inline compact row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-deep mb-3 pb-3 border-b border-deep/10">
          <span className="inline-flex items-center gap-1">
            <Clock className="h-3 w-3 text-deep" strokeWidth={1.5} />
            <span className="font-light">
              {formatDuration(service.durationMinutes)}
            </span>
          </span>
          <span className="text-deep/20">·</span>
          <span className="inline-flex items-center gap-1">
            <Users className="h-3 w-3 text-deep" strokeWidth={1.5} />
            <span className="font-light tabular-nums">
              {service.slotsAvailable}/{service.slotsTotal}
            </span>
          </span>
          <span className="text-deep/20">·</span>
          <span className="inline-flex items-center gap-1 min-w-0">
            <MapPin className="h-3 w-3 text-deep shrink-0" strokeWidth={1.5} />
            <span className="font-light truncate">{service.location}</span>
          </span>
        </div>

        {/* Price row in body */}
        <div className="flex items-center gap-2 mb-3">
          <span className={cn("font-display text-xl font-light leading-none tabular-nums", isOnSale ? "text-mauve" : "text-deep")}>
            {formatPrice(service.price)}
          </span>
          {isOnSale && (
            <>
              <span className="font-display text-sm font-light leading-none tabular-nums text-deep/40 line-through">
                {formatPrice(service.originalPrice!)}
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-mauve text-ivory text-[9px] font-medium tabular-nums">
                −{discountPct}%
              </span>
            </>
          )}
        </div>
        {isOnSale && (
          <p className="text-[10px] text-mauve/80 font-medium mb-3">
            You save {formatPrice(service.originalPrice! - service.price)}
          </p>
        )}

        {/* CTAs */}
        <div className="mt-auto flex items-stretch gap-1.5 mb-3">
          <button
            type="button"
            onClick={() => onViewEmployees(service)}
            className="flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 rounded-full bg-ivory border border-deep/20 text-deep font-sans text-[9px] uppercase tracking-[0.15em] hover:bg-deep hover:text-ivory hover:border-deep transition-colors duration-200 cursor-pointer"
          >
            <Users className="h-2.5 w-2.5" strokeWidth={1.5} />
            <span>Staff</span>
          </button>
          <button
            type="button"
            onClick={() => onBook(service)}
            disabled={isFullyBooked}
            className={cn(
              "flex-1 inline-flex items-center justify-center gap-1 px-2 py-2 rounded-full font-sans text-[9px] uppercase tracking-[0.15em] transition-colors duration-200 cursor-pointer border",
              isFullyBooked
                ? "bg-deep/10 text-deep cursor-not-allowed border-deep/10"
                : cn(accentBg[accentColor], "text-ivory border-transparent hover:opacity-90")
            )}
          >
            <CalendarCheck className="h-2.5 w-2.5" strokeWidth={1.75} />
            <span>{isFullyBooked ? "Waitlist" : "Book"}</span>
          </button>
        </div>
      </div>

      {/* Coloured price footer — mirrors ProductCard */}
      <div
        className={cn(
          "shrink-0 px-4 py-2.5 flex items-center justify-between",
          accentBg[accentColor]
        )}
      >
        <div className="flex items-baseline gap-1.5">
          {isOnSale ? (
            <span className="text-[10px] text-ivory/50 line-through tabular-nums">
              {formatPrice(service.originalPrice!)}
            </span>
          ) : null}
          <span className="font-display text-xl font-light tabular-nums tracking-tight text-ivory">
            {formatPrice(service.price)}
          </span>
          {isOnSale ? (
            <span className="text-[9px] text-ivory/70 font-medium tabular-nums">
              −{discountPct}%
            </span>
          ) : null}
        </div>
        <a
          href={`#details-${service.id}`}
          className="text-[9px] uppercase tracking-[0.12em] text-ivory/70 hover:text-ivory transition-colors inline-flex items-center gap-0.5 font-medium"
        >
          Details
          <ArrowUpRight className="h-2.5 w-2.5" strokeWidth={1.5} />
        </a>
      </div>
    </motion.article>
  );
}