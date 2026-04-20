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

import { EmployeeModal } from "./EmployeeModal";
import { ServiceCard } from "./ServicesCard";
import {
  SERVICE_CATEGORIES,
  SERVICES_CATALOG,
} from "@/lib/services-data";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/types";

// Price range filter buckets
const PRICE_RANGES = [
  { id: "any", label: "Any price", min: 0, max: Infinity },
  { id: "under-20k", label: "Under ₦20,000", min: 0, max: 20000 },
  { id: "20k-50k", label: "₦20K – ₦50K", min: 20000, max: 50000 },
  { id: "50k-100k", label: "₦50K – ₦100K", min: 50000, max: 100000 },
  { id: "over-100k", label: "Over ₦100K", min: 100000, max: Infinity },
] as const;

// Duration filter buckets
const DURATION_RANGES = [
  { id: "any", label: "Any duration", min: 0, max: Infinity },
  { id: "under-30", label: "Under 30 min", min: 0, max: 30 },
  { id: "30-60", label: "30 – 60 min", min: 30, max: 60 },
  { id: "60-90", label: "1 – 1.5 hours", min: 60, max: 90 },
  { id: "over-90", label: "Over 1.5 hours", min: 90, max: Infinity },
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
    // Placeholder — wire up to real booking flow later
    alert(`Starting booking for: ${service.name}`);
  };

  // Filter services
  const filteredServices = useMemo(() => {
    const priceR = PRICE_RANGES.find((r) => r.id === priceRange)!;
    const durR = DURATION_RANGES.find((r) => r.id === durationRange)!;
    const q = search.trim().toLowerCase();

    return SERVICES_CATALOG.filter((s) => {
      if (q) {
        const hay =
          `${s.name} ${s.description} ${s.tag} ${s.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (s.price < priceR.min || s.price > priceR.max) return false;
      if (
        s.durationMinutes < durR.min ||
        s.durationMinutes > durR.max
      )
        return false;
      if (availableOnly && s.slotsAvailable === 0) return false;
      if (favoritesOnly && !favorites.has(s.id)) return false;
      return true;
    });
  }, [search, priceRange, durationRange, availableOnly, favoritesOnly, favorites]);

  // Group filtered services by category, preserving category order
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
        className="relative py-20 sm:py-28 overflow-hidden bg-ivory"
      >
        {/* Ambient */}
        <div
          className="absolute top-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #C0A9BD 0%, transparent 70%)" }}
          aria-hidden
        />
        <div
          className="absolute bottom-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-15 pointer-events-none"
          style={{ background: "radial-gradient(circle, #94A7AE 0%, transparent 70%)" }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
          {/* ===== Toolbar ===== */}
          <div className="mb-12 sm:mb-16">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5 mb-6">
              <div>
                <span className="eyebrow text-mauve text-[11px] block mb-3">
                  — Our Full Menu
                </span>
                <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light leading-tight tracking-tight text-deep">
                  Find your ritual.
                </h2>
              </div>

              {/* Results count */}
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-mauve animate-pulse-soft" />
                <span className="text-sm font-light text-deep/70 tabular-nums">
                  <span className="font-medium text-deep">{totalResults}</span>
                  {" "}services match
                </span>
              </div>
            </div>

            {/* Search + filter toggle row */}
            <div className="flex flex-col sm:flex-row gap-3">
              {/* Search input */}
              <div className="flex-1 relative">
                <Search
                  className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40"
                  strokeWidth={1.5}
                />
                <input
                  type="search"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search for a treatment, a therapist, a feeling…"
                  className="w-full h-14 pl-12 pr-14 rounded-full bg-ivory border-2 border-deep/15 focus:border-mauve focus:outline-none text-sm font-light text-deep placeholder:text-deep/40 transition-colors"
                  aria-label="Search services"
                />
                {search ? (
                  <button
                    type="button"
                    onClick={() => setSearch("")}
                    aria-label="Clear search"
                    className="absolute right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full hover:bg-deep/10 flex items-center justify-center text-deep/60 transition-colors"
                  >
                    <X className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                ) : null}
              </div>

              {/* Filter toggle button */}
              <button
                type="button"
                onClick={() => setShowFilters((v) => !v)}
                className={cn(
                  "inline-flex items-center justify-center gap-2 h-14 px-6 rounded-full border-2 text-sm font-medium uppercase tracking-[0.12em] transition-all duration-300",
                  showFilters || hasActiveFilters
                    ? "bg-deep text-ivory border-deep"
                    : "bg-ivory text-deep border-deep/15 hover:border-deep"
                )}
                aria-expanded={showFilters}
              >
                <SlidersHorizontal className="h-4 w-4" strokeWidth={1.5} />
                <span>Filters</span>
                {hasActiveFilters ? (
                  <span className="ml-1 h-5 min-w-5 px-1.5 rounded-full bg-mauve text-ivory text-[10px] font-bold inline-flex items-center justify-center">
                    {
                      [
                        search.trim() !== "",
                        priceRange !== "any",
                        durationRange !== "any",
                        availableOnly,
                        favoritesOnly,
                      ].filter(Boolean).length
                    }
                  </span>
                ) : null}
                <ChevronDown
                  className={cn(
                    "h-3.5 w-3.5 transition-transform duration-300",
                    showFilters && "rotate-180"
                  )}
                  strokeWidth={1.5}
                />
              </button>
            </div>

            {/* Filters panel */}
            <AnimatePresence initial={false}>
              {showFilters ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 p-6 sm:p-8 rounded-[1.75rem] bg-gradient-to-br from-ivory via-mauve/10 to-sage/10 border border-deep/15">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-2 text-deep">
                        <Filter className="h-4 w-4" strokeWidth={1.5} />
                        <span className="eyebrow text-[10px]">
                          Refine your search
                        </span>
                      </div>
                      {hasActiveFilters ? (
                        <button
                          type="button"
                          onClick={clearFilters}
                          className="text-xs text-mauve hover:text-deep font-medium uppercase tracking-[0.12em] transition-colors"
                        >
                          Clear all
                        </button>
                      ) : null}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Price range */}
                      <div>
                        <p className="eyebrow text-deep/60 text-[9px] mb-3">
                          Price
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {PRICE_RANGES.map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setPriceRange(r.id)}
                              className={cn(
                                "px-4 py-2 rounded-full border text-[12px] font-light transition-all duration-300",
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

                      {/* Duration */}
                      <div>
                        <p className="eyebrow text-deep/60 text-[9px] mb-3">
                          Duration
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {DURATION_RANGES.map((r) => (
                            <button
                              key={r.id}
                              type="button"
                              onClick={() => setDurationRange(r.id)}
                              className={cn(
                                "px-4 py-2 rounded-full border text-[12px] font-light transition-all duration-300",
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

                    {/* Toggles */}
                    <div className="mt-6 pt-6 border-t border-deep/10 flex flex-wrap gap-3">
                      <button
                        type="button"
                        onClick={() => setAvailableOnly((v) => !v)}
                        className={cn(
                          "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[12px] font-light transition-all duration-300",
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
                          "inline-flex items-center gap-2 px-4 py-2 rounded-full border text-[12px] font-light transition-all duration-300",
                          favoritesOnly
                            ? "bg-mauve border-mauve text-ivory"
                            : "bg-ivory border-deep/15 text-deep/75 hover:border-deep/40"
                        )}
                      >
                        <svg
                          className={cn(
                            "h-3.5 w-3.5",
                            favoritesOnly ? "fill-ivory" : "fill-none"
                          )}
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        >
                          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                        </svg>
                        Favorites only ({favorites.size})
                      </button>
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>

            {/* Active filter chips summary */}
            {hasActiveFilters && !showFilters ? (
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="eyebrow text-deep/50 text-[10px]">
                  Active:
                </span>
                {search.trim() ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mauve/20 text-deep text-xs font-light border border-mauve/30">
                    Search: "{search.slice(0, 20)}{search.length > 20 ? "…" : ""}"
                    <button type="button" onClick={() => setSearch("")} aria-label="Remove">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : null}
                {priceRange !== "any" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mauve/20 text-deep text-xs font-light border border-mauve/30">
                    {PRICE_RANGES.find((r) => r.id === priceRange)?.label}
                    <button type="button" onClick={() => setPriceRange("any")} aria-label="Remove">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : null}
                {durationRange !== "any" ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sage/25 text-deep text-xs font-light border border-sage/35">
                    {DURATION_RANGES.find((r) => r.id === durationRange)?.label}
                    <button type="button" onClick={() => setDurationRange("any")} aria-label="Remove">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : null}
                {availableOnly ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-deep/15 text-deep text-xs font-light border border-deep/25">
                    Available only
                    <button type="button" onClick={() => setAvailableOnly(false)} aria-label="Remove">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : null}
                {favoritesOnly ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-mauve/20 text-deep text-xs font-light border border-mauve/30">
                    Favorites only
                    <button type="button" onClick={() => setFavoritesOnly(false)} aria-label="Remove">
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* ===== Category sections ===== */}
          {totalResults === 0 ? (
            <EmptyState onClear={clearFilters} />
          ) : (
            <div className="space-y-16 sm:space-y-24">
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
                    className="scroll-mt-[160px]"
                    aria-label={cat.name}
                  >
                    {/* Category header */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-80px" }}
                      transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                      className="flex items-end justify-between mb-8 sm:mb-10 gap-6"
                    >
                      <div className="flex items-center gap-5">
                        <div
                          className={cn(
                            "shrink-0 h-14 w-14 sm:h-16 sm:w-16 rounded-2xl flex items-center justify-center shadow-[0_8px_20px_rgba(71,103,106,0.15)]",
                            catAccentBg[cat.color]
                          )}
                        >
                          <Icon className="h-6 w-6 text-ivory" strokeWidth={1.25} />
                        </div>
                        <div>
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className={cn("eyebrow text-[10px]", catAccent[cat.color])}>
                              {String(catIndex + 1).padStart(2, "0")} · Category
                            </span>
                            <span className="text-xs text-deep/40 tabular-nums">
                              {items.length} {items.length === 1 ? "service" : "services"}
                            </span>
                          </div>
                          <h3 className="font-display text-2xl sm:text-3xl lg:text-4xl font-light leading-tight tracking-tight text-deep">
                            {cat.name}
                          </h3>
                          <p className="mt-1.5 text-sm font-light text-deep/60 italic">
                            {cat.tagline}
                          </p>
                        </div>
                      </div>
                      <div
                        className={cn(
                          "hidden md:block h-px flex-1 max-w-xs",
                          catAccentBg[cat.color]
                        )}
                        style={{ opacity: 0.25 }}
                      />
                    </motion.div>

                    {/* Card grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5 lg:gap-6">
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
      </section>

      {/* Employee modal */}
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
      transition={{ duration: 0.6 }}
      className="text-center py-24 px-6 rounded-[2rem] bg-gradient-to-br from-ivory via-mauve/10 to-sage/10 border border-deep/10"
    >
      <div className="inline-flex h-16 w-16 rounded-full bg-mauve/15 border border-mauve/25 items-center justify-center mb-6">
        <Search className="h-6 w-6 text-mauve" strokeWidth={1.5} />
      </div>
      <h3 className="font-display text-3xl font-light text-deep mb-3">
        No services match your search.
      </h3>
      <p className="text-sm font-light text-deep/65 max-w-md mx-auto mb-8">
        Try adjusting your filters, or browse our full menu — we have something for every ritual.
      </p>
      <button
        type="button"
        onClick={onClear}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-deep text-ivory text-[11px] uppercase tracking-[0.22em] hover:bg-deep-dark transition-colors"
      >
        Clear all filters
      </button>
    </motion.div>
  );
}