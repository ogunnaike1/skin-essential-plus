"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Filter,
  Search,
  X,
  Loader2,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import { CategoryNav } from "@/components/services/CategoryNav";
import { EmployeeModal } from "@/components/services/EmployeeModal";
import { ServiceCard } from "./ServicesCard";
import BookAppointmentModal from "@/components/shared/BookAppointmentModal";
import {
  SERVICE_CATEGORIES,
} from "@/lib/services-data";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/types";
import { getPublicServices } from "@/lib/supabase/public-services-api";
import { transformServicesToItems } from "@/lib/supabase/transform-services";
import type { Service } from "@/lib/supabase/types";

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
 * DESKTOP: Original design with sidebar filters and category sections
 * MOBILE: Vertical category list - click category → sub-services grid expands below
 */
export function ServicesGrid(): React.ReactElement {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRangeId>("any");
  const [durationRange, setDurationRange] = useState<DurationRangeId>("any");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [favorites, setFavorites] = useState<ReadonlySet<string>>(new Set());
  const [modalService, setModalService] = useState<ServiceItem | null>(null);

  // Mobile accordion - which category is expanded
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  // Booking modal state
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);

  // Supabase data state
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [rawServices, setRawServices] = useState<Service[]>([]); // Store raw Service objects
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load services from Supabase on mount
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublicServices();
      setRawServices(data); // Store raw services
      const transformedServices = transformServicesToItems(data);
      setServices(transformedServices);
    } catch (err) {
      console.error('Error loading services:', err);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    if (expandedCategory === categoryId) {
      // Just close if clicking the same category
      setExpandedCategory(null);
    } else {
      // Close current, then open new one after a delay
      setExpandedCategory(null);
      setTimeout(() => {
        setExpandedCategory(categoryId);
      }, 100);
    }
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBook = (service: ServiceItem) => {
    // Find the raw Service object that matches this ServiceItem
    const rawService = rawServices.find(s => s.id === service.id);
    
    if (rawService) {
      setSelectedServiceForBooking(rawService);
      setShowBookingModal(true);
    } else {
      console.error('Could not find raw service for booking');
      alert('Unable to open booking. Please try again.');
    }
  };

  const filteredServices = useMemo(() => {
    const priceR = PRICE_RANGES.find((r) => r.id === priceRange)!;
    const durR = DURATION_RANGES.find((r) => r.id === durationRange)!;
    const q = search.trim().toLowerCase();

    return services.filter((s) => {
      if (q) {
        const hay = `${s.name} ${s.description} ${s.tag} ${s.location}`.toLowerCase();
        if (!hay.includes(q)) return false;
      }
      if (s.price < priceR.min || s.price > priceR.max) return false;
      if (s.durationMinutes < durR.min || s.durationMinutes > durR.max) return false;
      if (availableOnly && s.slotsAvailable === 0) return false;
      if (favoritesOnly && !favorites.has(s.id)) return false;
      return true;
    });
  }, [search, priceRange, durationRange, availableOnly, favoritesOnly, favorites, services]);

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
    search ||
    priceRange !== "any" ||
    durationRange !== "any" ||
    availableOnly ||
    favoritesOnly;

  const clearFilters = () => {
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
        className="relative py-12 sm:py-16"
        style={{
          background:
            "linear-gradient(180deg, #FCFBFC 0%, rgba(138,111,136,0.08) 50%, rgba(79,114,136,0.08) 100%)",
        }}
      >
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
          {/* DESKTOP LAYOUT - UNCHANGED */}
          <div className="hidden lg:block">
            {/* HEADER */}
            <div className="mb-8">
              <h2 className="text-4xl font-light text-deep">
                Find your <span className="text-mauve">ritual</span>
              </h2>
              <p className="text-sm text-deep mt-2">
                {loading ? 'Loading services...' : `${totalResults} services match`}
              </p>
            </div>

            {/* SEARCH */}
            <div className="flex gap-3 mb-6">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-mauve" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-10 pr-10 rounded-full border border-mauve/30"
                  placeholder="Search services..."
                  disabled={loading}
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowFilters((v) => !v)}
                className="px-4 rounded-full border"
                disabled={loading}
              >
                Filters
              </button>
            </div>

            {/* ERROR STATE */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-mauve-tint border-2 border-mauve">
                <p className="text-deep text-sm">{error}</p>
                <button
                  onClick={loadServices}
                  className="mt-2 px-4 py-2 rounded-full bg-mauve text-ivory text-sm hover:bg-mauve-dark transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* LOADING STATE */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-mauve" />
              </div>
            ) : (
              /* GRID */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <CategoryNav />

                <div className="lg:col-span-9 space-y-12">
                  {SERVICE_CATEGORIES.map((cat) => {
                    const items = servicesByCategory.get(cat.id) ?? [];
                    if (!items.length) return null;

                    return (
                      <section key={cat.id} id={cat.id} className="scroll-mt-28">
                        <h3 className="text-2xl mb-4">{cat.name}</h3>

                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
                          {items.map((s, idx) => (
                            <ServiceCard
                              key={s.id}
                              service={s}
                              index={idx}
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
              </div>
            )}
          </div>

          {/* MOBILE LAYOUT - VERTICAL CATEGORY ACCORDION */}
          <div className="lg:hidden">
            {/* HEADER */}
            <div className="mb-6">
              <h2 className="text-3xl font-light text-deep">
                Our <span className="text-mauve">services</span>
              </h2>
              <p className="text-sm text-deep mt-2">
                {loading ? 'Loading...' : 'Tap a category to view treatments'}
              </p>
            </div>

            {/* ERROR STATE */}
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-mauve-tint border-2 border-mauve">
                <p className="text-deep text-sm">{error}</p>
                <button
                  onClick={loadServices}
                  className="mt-2 px-4 py-2 rounded-full bg-mauve text-ivory text-sm hover:bg-mauve-dark transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* LOADING STATE */}
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-mauve" />
              </div>
            ) : (
              /* CATEGORY ACCORDION LIST */
              <div className="space-y-3">
                {SERVICE_CATEGORIES.map((cat) => {
                  const items = servicesByCategory.get(cat.id) ?? [];
                  if (!items.length) return null;

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
                    <div
                      key={cat.id}
                      className={cn(
                        "overflow-hidden rounded-2xl border-2 transition-colors duration-300",
                        isExpanded ? accentBorder[cat.color] : "border-deep/10"
                      )}
                    >
                      {/* Category header - clickable */}
                      <button
                        type="button"
                        onClick={() => handleCategoryClick(cat.id)}
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
                              {items.length} treatment{items.length === 1 ? "" : "s"}
                            </p>
                          </div>
                        </div>
                        <ChevronDown
                          className={cn(
                            "h-5 w-5 shrink-0 transition-transform duration-300",
                            isExpanded ? cn("rotate-180", accentText[cat.color]) : "text-deep"
                          )}
                          strokeWidth={1.5}
                        />
                      </button>

                      {/* Sub-services grid - expands below */}
                      <AnimatePresence initial={false}>
                        {isExpanded ? (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: "auto" }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.3, ease: [0.04, 0.62, 0.23, 0.98] }}
                            style={{ overflow: "hidden" }}
                          >
                            <div className="p-5 pt-0 grid grid-cols-1 sm:grid-cols-2 gap-3 bg-ivory">
                              {items.map((s, idx) => (
                                <ServiceCard
                                  key={s.id}
                                  service={s}
                                  index={idx}
                                  accentColor={cat.color}
                                  isFavorite={favorites.has(s.id)}
                                  onToggleFavorite={toggleFavorite}
                                  onViewEmployees={setModalService}
                                  onBook={handleBook}
                                />
                              ))}
                            </div>
                          </motion.div>
                        ) : null}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Employee Modal */}
      <EmployeeModal
        service={modalService}
        onClose={() => setModalService(null)}
        onBook={(s) => {
          setModalService(null);
          handleBook(s);
        }}
      />

      {/* Booking Modal */}
      <BookAppointmentModal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          setSelectedServiceForBooking(null);
        }}
        preselectedService={selectedServiceForBooking}
      />
    </>
  );
}