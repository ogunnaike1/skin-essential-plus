"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Filter,
  Search,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { CategoryNav } from "@/components/services/CategoryNav";
import { EmployeeModal } from "@/components/services/EmployeeModal";
import { ServiceCard } from "./ServicesCard";
import {
  SERVICE_CATEGORIES,
  SERVICES_CATALOG,
} from "@/lib/services-data";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/types";

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

/**
 * MOBILE: Pure accordion — tap a category, services expand below.
 * DESKTOP: Full filter panel + category nav + grid.
 */
export function ServicesGrid(): React.ReactElement {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRangeId>("any");
  const [durationRange, setDurationRange] = useState<DurationRangeId>("any");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);

  const [favorites, setFavorites] = useState<ReadonlySet<string>>(new Set());
  const [modalService, setModalService] = useState<ServiceItem | null>(null);

  // Mobile accordion state
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleBook = (service: ServiceItem) => {
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
      map.get(s.categoryId)?.push(s);
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

  const clearAll = () => {
    setSearch("");
    setPriceRange("any");
    setDurationRange("any");
    setAvailableOnly(false);
    setFavoritesOnly(false);
  };

  return (
    <>
      <section className="relative bg-ivory">
        <div className="mx-auto max-w-[1600px]">
          {/* DESKTOP LAYOUT */}
          <div className="hidden lg:grid lg:grid-cols-12 lg:gap-6">
            {/* Left sidebar */}
            <aside className="lg:col-span-3 lg:sticky lg:top-24 lg:h-[calc(100vh-9rem)] lg:overflow-y-auto lg:pr-2 pb-6">
              <FilterSidebar
                search={search}
                setSearch={setSearch}
                priceRange={priceRange}
                setPriceRange={setPriceRange}
                durationRange={durationRange}
                setDurationRange={setDurationRange}
                availableOnly={availableOnly}
                setAvailableOnly={setAvailableOnly}
                favoritesOnly={favoritesOnly}
                setFavoritesOnly={setFavoritesOnly}
                hasActiveFilters={hasActiveFilters}
                clearAll={clearAll}
                totalResults={totalResults}
              />
            </aside>

            {/* Right grid column */}
            <div className="lg:col-span-9 lg:h-[calc(100vh-9rem)] lg:overflow-y-auto lg:scroll-smooth pb-6">
              <CategoryNav />
              <div className="mt-6 space-y-12">
                {SERVICE_CATEGORIES.map((cat) => {
                  const services = servicesByCategory.get(cat.id) ?? [];
                  if (services.length === 0) return null;
                  return (
                    <CategorySection
                      key={cat.id}
                      category={cat}
                      services={services}
                      favorites={favorites}
                      toggleFavorite={toggleFavorite}
                      handleBook={handleBook}
                      setModalService={setModalService}
                    />
                  );
                })}
                {totalResults === 0 ? <EmptyState clearAll={clearAll} /> : null}
              </div>
            </div>
          </div>

          {/* MOBILE ACCORDION LAYOUT */}
          <div className="lg:hidden px-6 py-10">
            <motion.div
              initial={{ opacity: 1, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="mb-8"
            >
              <div className="flex items-center gap-2 mb-3">
                <span className="h-1 w-8 rounded-full bg-mauve" />
                <span className="eyebrow text-mauve text-[10px]">
                  — Browse by category
                </span>
              </div>
              <h2 className="font-display text-3xl font-light text-deep leading-tight tracking-tight">
                Our service menu
              </h2>
              <p className="mt-2 text-sm font-light text-deep">
                Tap a category to see available treatments.
              </p>
            </motion.div>

            {/* Accordion list */}
            <div className="space-y-3">
              {SERVICE_CATEGORIES.map((cat) => {
                const allServicesInCat = SERVICES_CATALOG.filter(
                  (s) => s.categoryId === cat.id
                );
                const isExpanded = expandedCategory === cat.id;
                const Icon = cat.icon;

                const accentBg: Record<typeof cat.color, string> = {
                  mauve: "bg-mauve",
                  sage: "bg-sage",
                  deep: "bg-deep",
                  mixed: "bg-mauve",
                };
                const accentText: Record<typeof cat.color, string> = {
                  mauve: "text-mauve",
                  sage: "text-sage",
                  deep: "text-deep",
                  mixed: "text-deep",
                };
                const accentBorder: Record<typeof cat.color, string> = {
                  mauve: "border-mauve",
                  sage: "border-sage",
                  deep: "border-deep",
                  mixed: "border-deep",
                };

                return (
                  <motion.div
                    key={cat.id}
                    initial={{ opacity: 1, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.4,
                      delay: SERVICE_CATEGORIES.indexOf(cat) * 0.06,
                    }}
                    className={cn(
                      "overflow-hidden rounded-2xl border-2 transition-colors duration-300",
                      isExpanded
                        ? accentBorder[cat.color]
                        : "border-deep/10 hover:border-deep/20"
                    )}
                  >
                    {/* Accordion header */}
                    <button
                      type="button"
                      onClick={() =>
                        setExpandedCategory(isExpanded ? null : cat.id)
                      }
                      className="w-full flex items-center justify-between gap-4 p-5 bg-ivory text-left"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <div
                          className={cn(
                            "shrink-0 h-11 w-11 rounded-xl flex items-center justify-center",
                            accentBg[cat.color]
                          )}
                        >
                          <Icon className="h-5 w-5 text-ivory" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={cn(
                              "font-display text-xl font-light leading-tight tracking-tight",
                              isExpanded ? accentText[cat.color] : "text-deep"
                            )}
                          >
                            {cat.name}
                          </h3>
                          <p className="text-[11px] text-deep font-light truncate">
                            {allServicesInCat.length} service
                            {allServicesInCat.length === 1 ? "" : "s"}
                          </p>
                        </div>
                      </div>
                      <ChevronDown
                        className={cn(
                          "h-5 w-5 shrink-0 transition-transform duration-300",
                          isExpanded
                            ? cn("rotate-180", accentText[cat.color])
                            : "text-deep"
                        )}
                        strokeWidth={1.5}
                      />
                    </button>

                    {/* Accordion panel */}
                    <AnimatePresence initial={false}>
                      {isExpanded ? (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="p-5 pt-0 space-y-3 bg-ivory">
                            {allServicesInCat.map((service, idx) => (
                              <ServiceCard
                                key={service.id}
                                service={service}
                                index={idx}
                                accentColor={cat.color}
                                isFavorite={favorites.has(service.id)}
                                onToggleFavorite={toggleFavorite}
                                onBook={handleBook}
                                onViewEmployees={() => setModalService(service)}
                              />
                            ))}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <EmployeeModal
        service={modalService}
        onClose={() => setModalService(null)}
        onBook={handleBook}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────
// Desktop filter sidebar
// ──────────────────────────────────────────────────────────────
interface FilterSidebarProps {
  search: string;
  setSearch: (s: string) => void;
  priceRange: PriceRangeId;
  setPriceRange: (p: PriceRangeId) => void;
  durationRange: DurationRangeId;
  setDurationRange: (d: DurationRangeId) => void;
  availableOnly: boolean;
  setAvailableOnly: (b: boolean) => void;
  favoritesOnly: boolean;
  setFavoritesOnly: (b: boolean) => void;
  hasActiveFilters: boolean;
  clearAll: () => void;
  totalResults: number;
}

function FilterSidebar({
  search,
  setSearch,
  priceRange,
  setPriceRange,
  durationRange,
  setDurationRange,
  availableOnly,
  setAvailableOnly,
  favoritesOnly,
  setFavoritesOnly,
  hasActiveFilters,
  clearAll,
  totalResults,
}: FilterSidebarProps): React.ReactElement {
  return (
    <div className="rounded-3xl overflow-hidden bg-ivory shadow-[0_20px_50px_rgba(71,103,106,0.12)]">
      <div className="flex h-1.5">
        <span className="flex-1 bg-mauve" />
        <span className="flex-1 bg-sage" />
        <span className="flex-1 bg-deep" />
      </div>

      <div className="p-5 bg-deep">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="h-3 w-3 text-mauve" strokeWidth={1.75} />
          <span className="eyebrow text-ivory text-[9px]">— Filter</span>
        </div>
        <h3 className="font-display text-xl font-light text-ivory leading-tight">
          Refine services
        </h3>
        <p className="mt-2 text-[11px] text-ivory uppercase tracking-[0.15em] tabular-nums">
          <span className="font-medium">{totalResults}</span> shown
        </p>
      </div>

      <div className="p-5 space-y-5">
        <div>
          <label htmlFor="search" className="eyebrow text-deep text-[9px] block mb-2">
            — Search
          </label>
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deep pointer-events-none"
              strokeWidth={1.5}
            />
            <input
              id="search"
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Name, tag, location..."
              className="w-full h-11 pl-10 pr-4 rounded-full bg-mauve-tint border-2 border-transparent text-deep placeholder:text-deep text-sm font-light focus:border-mauve focus:outline-none transition-colors"
            />
          </div>
        </div>

        <div>
          <p className="eyebrow text-deep text-[9px] mb-2">— Price range</p>
          <select
            value={priceRange}
            onChange={(e) => setPriceRange(e.target.value as PriceRangeId)}
            className="w-full h-11 px-4 rounded-full bg-sage-tint border-2 border-transparent text-deep text-sm font-medium appearance-none cursor-pointer focus:border-sage focus:outline-none transition-colors"
          >
            {PRICE_RANGES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <p className="eyebrow text-deep text-[9px] mb-2">— Duration</p>
          <select
            value={durationRange}
            onChange={(e) => setDurationRange(e.target.value as DurationRangeId)}
            className="w-full h-11 px-4 rounded-full bg-deep-tint border-2 border-transparent text-deep text-sm font-medium appearance-none cursor-pointer focus:border-deep focus:outline-none transition-colors"
          >
            {DURATION_RANGES.map((r) => (
              <option key={r.id} value={r.id}>
                {r.label}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={availableOnly}
              onChange={(e) => setAvailableOnly(e.target.checked)}
              className="h-4 w-4 rounded border-2 border-mauve text-mauve focus:ring-2 focus:ring-mauve cursor-pointer"
            />
            <span className="text-sm font-medium text-deep">Available today</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={favoritesOnly}
              onChange={(e) => setFavoritesOnly(e.target.checked)}
              className="h-4 w-4 rounded border-2 border-mauve text-mauve focus:ring-2 focus:ring-mauve cursor-pointer"
            />
            <span className="text-sm font-medium text-deep">Favorites only</span>
          </label>
        </div>

        {hasActiveFilters ? (
          <button
            type="button"
            onClick={clearAll}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-mauve-tint text-deep text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-mauve hover:text-ivory transition-colors"
          >
            <X className="h-3 w-3" strokeWidth={1.75} />
            Clear filters
          </button>
        ) : null}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Desktop category section
// ──────────────────────────────────────────────────────────────
interface CategorySectionProps {
  category: (typeof SERVICE_CATEGORIES)[number];
  services: readonly ServiceItem[];
  favorites: ReadonlySet<string>;
  toggleFavorite: (id: string) => void;
  handleBook: (s: ServiceItem) => void;
  setModalService: (s: ServiceItem) => void;
}

function CategorySection({
  category,
  services,
  favorites,
  toggleFavorite,
  handleBook,
  setModalService,
}: CategorySectionProps): React.ReactElement {
  const Icon = category.icon;
  const accentText: Record<typeof category.color, string> = {
    mauve: "text-mauve",
    sage: "text-sage",
    deep: "text-deep",
    mixed: "text-deep",
  };
  const accentBg: Record<typeof category.color, string> = {
    mauve: "bg-mauve",
    sage: "bg-sage",
    deep: "bg-deep",
    mixed: "bg-mauve",
  };

  return (
    <div id={category.id} className="scroll-mt-24">
      <div className="flex items-center gap-3 mb-5">
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center",
            accentBg[category.color]
          )}
        >
          <Icon className="h-4 w-4 text-ivory" strokeWidth={1.5} />
        </div>
        <div className="flex-1">
          <h3
            className={cn(
              "font-display text-2xl font-light leading-tight tracking-tight",
              accentText[category.color]
            )}
          >
            {category.name}
          </h3>
          <p className="text-[11px] text-deep font-light">
            {services.length} service{services.length === 1 ? "" : "s"}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {services.map((service, idx) => (
          <ServiceCard
            key={service.id}
            service={service}
            index={idx}
            accentColor={category.color}
            isFavorite={favorites.has(service.id)}
            onToggleFavorite={toggleFavorite}
            onBook={handleBook}
            onViewEmployees={() => setModalService(service)}
          />
        ))}
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Empty state
// ──────────────────────────────────────────────────────────────
function EmptyState({ clearAll }: { clearAll: () => void }): React.ReactElement {
  return (
    <div className="text-center py-20 px-6 rounded-2xl border-2 border-mauve bg-mauve-tint">
      <h3 className="font-display text-2xl font-light text-deep mb-2">
        No services match your filters.
      </h3>
      <p className="text-sm font-light text-deep max-w-md mx-auto mb-6">
        Try widening your search or clearing filters.
      </p>
      <button
        type="button"
        onClick={clearAll}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-deep text-ivory text-[11px] uppercase tracking-[0.2em] hover:bg-deep-dark transition-colors"
      >
        Clear all filters
      </button>
    </div>
  );
}