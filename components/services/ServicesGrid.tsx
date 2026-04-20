"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { CategoryNav } from "@/components/services/CategoryNav";
import { EmployeeModal } from "@/components/services/EmployeeModal";
import { ServiceCard } from "../services/ServicesCard";

import {
  SERVICE_CATEGORIES,
  SERVICES_CATALOG,
} from "@/lib/services-data";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/types";

// Filter buckets
const PRICE_RANGES = [
  { id: "any", label: "Any price", min: 0, max: Infinity },
  { id: "under-20k", label: "Under ₦20K", min: 0, max: 20000 },
  { id: "20k-50k", label: "₦20K – ₦50K", min: 20000, max: 50000 },
  { id: "50k-100k", label: "₦50K – ₦100K", min: 50000, max: 100000 },
  { id: "over-100k", label: "Over ₦100K", min: 100000, max: Infinity },
] as const;

const DURATION_RANGES = [
  { id: "any", label: "Any duration", min: 0, max: Infinity },
  { id: "under-30", label: "< 30 min", min: 0, max: 30 },
  { id: "30-60", label: "30 – 60 min", min: 30, max: 60 },
  { id: "60-90", label: "1 – 1.5 hr", min: 60, max: 90 },
  { id: "over-90", label: "Over 1.5 hr", min: 90, max: Infinity },
] as const;

type PriceRangeId = (typeof PRICE_RANGES)[number]["id"];
type DurationRangeId = (typeof DURATION_RANGES)[number]["id"];

export function ServicesGrid(): React.ReactElement {
  const [search, setSearch] = useState<string>("");
  const [priceRange, setPriceRange] = useState<PriceRangeId>("any");
  const [durationRange, setDurationRange] = useState<DurationRangeId>("any");
  const [availableOnly, setAvailableOnly] = useState<boolean>(false);
  const [favoritesOnly, setFavoritesOnly] = useState<boolean>(false);
  const [showFilters, setShowFilters] = useState<boolean>(false);

  const [favorites, setFavorites] = useState<ReadonlySet<string>>(new Set());
  const [modalService, setModalService] = useState<ServiceItem | null>(null);

  const toggleFavorite = (id: string): void => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBook = (service: ServiceItem): void => {
    alert(`Starting booking for: ${service.name}`);
  };

  const filteredServices = useMemo(() => {
    const priceR = PRICE_RANGES.find((r) => r.id === priceRange)!;
    const durR = DURATION_RANGES.find((r) => r.id === durationRange)!;
    const q = search.trim().toLowerCase();

    return SERVICES_CATALOG.filter((s) => {
      if (q) {
        const hay = `${s.name} ${s.description} ${s.tag} ${s.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (s.price < priceR.min || s.price > priceR.max) return false;
      if (s.durationMinutes < durR.min || s.durationMinutes > durR.max)
        return false;
      if (availableOnly && s.slotsAvailable === 0) return false;
      if (favoritesOnly && !favorites.has(s.id)) return false;
      return true;
    });
  }, [search, priceRange, durationRange, availableOnly, favoritesOnly, favorites]);

  const servicesByCategory = useMemo(() => {
    const map = new Map<string, ServiceItem[]>();
    for (const cat of SERVICE_CATEGORIES) map.set(cat.id, []);
    for (const s of filteredServices) {
      const arr = map.get(s.categoryId);
      if (arr) arr.push(s);
    }
    return map;
  }, [filteredServices]);

  const totalResults = filteredServices.length;
  const hasActiveFilters =
    search.trim() !== "" ||
    priceRange !== "any" ||
    durationRange !== "any" ||
    availableOnly ||
    favoritesOnly;

  const clearFilters = (): void => {
    setSearch("");
    setPriceRange("any");
    setDurationRange("any");
    setAvailableOnly(false);
    setFavoritesOnly(false);
  };

  return (
    <>
      <section
        id="services-grid"
        className="relative py-12 sm:py-16 bg-ivory"
      >
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
          {/* Section header */}
          <div className="mb-8 sm:mb-10">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4 mb-5">
              <div>
                <span className="eyebrow text-mauve text-[11px] block mb-2">
                  — Our Full Menu
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light leading-tight tracking-tight text-deep">
                  Find your ritual.
                </h2>
              </div>

              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-mauve animate-pulse-soft" />
                <span className="text-sm font-light text-deep/70 tabular-nums">
                  <span className="font-medium text-deep">{totalResults}</span>{" "}
                  services match
                </span>
              </div>
            </div>

            {/* Search + filter */}
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40"
                  strokeWidth={1.5}
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search name, therapist, concern…"
                  className="w-full h-12 pl-11 pr-12 rounded-full bg-ivory border-2 border-deep/15 focus:border-mauve focus:outline-none text-sm font-light text-deep placeholder:text-deep/40 transition-colors"
                  aria-label="Search services"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear"
                    className="absolute right-3 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full hover:bg-deep/10 flex items-center justify-center text-deep/60 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" strokeWidth={1.5} />
                  </button>
                ) : null}
              </div>

              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 h-12 px-5 rounded-full border-2 text-xs font-medium uppercase tracking-[0.12em] transition-colors duration-200",
                  showFilters || hasActiveFilters
                    ? "bg-deep text-ivory border-deep"
                    : "bg-ivory text-deep border-deep/15 hover:border-deep"
                )}
                aria-expanded={showFilters}
              >
                <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
                <span>Filters</span>
                {hasActiveFilters ? (
                  <span className="ml-1 h-4 min-w-4 px-1 rounded-full bg-mauve text-ivory text-[9px] font-bold inline-flex items-center justify-center">
                    {[
                      search.trim() !== "",
                      priceRange !== "any",
                      durationRange !== "any",
                      availableOnly,
                      favoritesOnly,
                    ].filter(Boolean).length}
                  </span>
                ) : null}
                <ChevronDown
                  className={cn(
                    "h-3 w-3 transition-transform duration-300",
                    showFilters && "rotate-180"
                  )}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {/* Filter panel */}
            <AnimatePresence initial={false}>
              {showFilters ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-3 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-ivory to-mauve/10 border border-deep/15">
                    <div className="flex items-center justify-between mb-5">
                      <div className="flex items-center gap-2 text-deep">
                        <Filter className="h-3.5 w-3.5" strokeWidth={1.5} />
                        <span className="eyebrow text-[10px]">Refine</span>
                      </div>
                      {hasActiveFilters ? (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="text-[11px] text-mauve hover:text-deep font-medium uppercase tracking-[0.12em] transition-colors"
                        >
                          Clear all
                        </button>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div>
                        <p className="eyebrow text-deep/60 text-[9px] mb-2">
                          Price
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {PRICE_RANGES.map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setPriceRange(r.id)}
                              className={cn(
                                "px-3 py-1.5 rounded-full border text-[11px] font-light transition-colors duration-200",
                                priceRange === r.id
                                  ? "bg-mauve border-mauve text-ivory"
                                  : "bg-ivory border-deep/15 text-deep/75 hover:border-deep/40"
                              )}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <p className="eyebrow text-deep/60 text-[9px] mb-2">
                          Duration
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {DURATION_RANGES.map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setDurationRange(r.id)}
                              className={cn(
                                "px-3 py-1.5 rounded-full border text-[11px] font-light transition-colors duration-200",
                                durationRange === r.id
                                  ? "bg-sage border-sage text-ivory"
                                  : "bg-ivory border-deep/15 text-deep/75 hover:border-deep/40"
                              )}
                            >
                              {r.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 pt-5 border-t border-deep/10 flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setAvailableOnly((v) => !v)}
                        className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-light transition-colors duration-200",
                          availableOnly
                            ? "bg-deep border-deep text-ivory"
                            : "bg-ivory border-deep/15 text-deep/75 hover:border-deep/40"
                        )}
                      >
                        <span
                          className={cn(
                            "h-1.5 w-1.5 rounded-full",
                            availableOnly ? "bg-ivory" : "bg-mauve"
                          )}
                        />
                        Available only
                      </button>
                      <button
                        type="button"
                        onClick={() => setFavoritesOnly((v) => !v)}
                        className={cn(
                          "inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[11px] font-light transition-colors duration-200",
                          favoritesOnly
                            ? "bg-mauve border-mauve text-ivory"
                            : "bg-ivory border-deep/15 text-deep/75 hover:border-deep/40"
                        )}
                      >
                        <svg
                          className={cn(
                            "h-3 w-3",
                            favoritesOnly ? "fill-ivory" : "fill-none"
                          )}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        Favorites ({favorites.size})
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>

          {/* ===== Sidebar + grid layout ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            <CategoryNav />

            {/* Main grid area */}
            <div className="lg:col-span-9 xl:col-span-9">
              {totalResults === 0 ? (
                <EmptyState onClear={clearFilters} />
              ) : (
                <div className="space-y-12 sm:space-y-16">
                  {SERVICE_CATEGORIES.map((cat, catIndex) => {
                    const items = servicesByCategory.get(cat.id) ?? [];
                    if (items.length === 0) return null;

                    const Icon = cat.icon;
                    const catAccent: Record<typeof cat.color, string> = {
                      mauve: "text-mauve",
                      sage: "text-sage",
                      deep: "text-deep",
                      mixed: "text-deep",
                    };
                    const catAccentBg: Record<typeof cat.color, string> = {
                      mauve: "bg-mauve",
                      sage: "bg-sage",
                      deep: "bg-deep",
                      mixed: "bg-deep",
                    };

                    return (
                      <section
                        key={cat.id}
                        id={cat.id}
                        className="scroll-mt-28"
                        aria-label={cat.name}
                      >
                        {/* Category header */}
                        <motion.div
                          initial={{ opacity: 0, y: 16 }}
                          whileInView={{ opacity: 1, y: 0 }}
                          viewport={{ once: true, margin: "-60px" }}
                          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                          className="flex items-center gap-4 mb-6"
                        >
                          <div
                            className={cn(
                              "shrink-0 h-11 w-11 rounded-xl flex items-center justify-center",
                              catAccentBg[cat.color]
                            )}
                          >
                            <Icon className="h-5 w-5 text-ivory" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2.5 mb-0.5">
                              <span
                                className={cn(
                                  "eyebrow text-[9px]",
                                  catAccent[cat.color]
                                )}
                              >
                                {String(catIndex + 1).padStart(2, "0")}
                              </span>
                              <span className="text-[11px] text-deep/40 tabular-nums">
                                {items.length}{" "}
                                {items.length === 1 ? "service" : "services"}
                              </span>
                            </div>
                            <h3 className="font-display text-2xl sm:text-3xl font-light leading-tight tracking-tight text-deep">
                              {cat.name}
                            </h3>
                            <p className="mt-0.5 text-xs font-light text-deep/60 italic">
                              {cat.tagline}
                            </p>
                          </div>
                        </motion.div>

                        {/* Card grid — 3 columns max */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          {items.map((s, i) => (
                            <ServiceCard
                              key={s.id}
                              service={s}
                              index={i}
                              accentColor={cat.color}
                              isFavorite={favorites.has(s.id)}
                              onToggleFavorite={toggleFavorite}
                              onViewEmployees={setModalService}
                              onBook={handleBook}
                            />
                          ))}
                        </div>
                      </section>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <EmployeeModal
        service={modalService}
        onClose={() => setModalService(null)}
        onBook={(s: ServiceItem) => {
          setModalService(null);
          handleBook(s);
        }}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────
interface EmptyStateProps {
  onClear: () => void;
}

function EmptyState({ onClear }: EmptyStateProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="text-center py-20 px-6 rounded-2xl bg-gradient-to-br from-ivory to-mauve/10 border border-deep/10"
    >
      <div className="inline-flex h-14 w-14 rounded-full bg-mauve/15 border border-mauve/25 items-center justify-center mb-5">
        <Search className="h-5 w-5 text-mauve" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-2xl font-light text-deep mb-2">
        No services match.
      </h3>
      <p className="text-sm font-light text-deep/65 max-w-md mx-auto mb-6">
        Try adjusting your filters to see more.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-deep text-ivory text-[11px] uppercase tracking-[0.2em] hover:bg-deep-dark transition-colors"
      >
        Clear all filters
      </button>
    </motion.div>
  );
}