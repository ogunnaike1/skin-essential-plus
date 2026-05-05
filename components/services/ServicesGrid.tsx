"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Search,
  X,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useMemo, useState, useEffect } from "react";

import { CategoryNav } from "@/components/services/CategoryNav";
import { EmployeeModal } from "@/components/services/EmployeeModal";
import { ServiceCard } from "./ServicesCard";
import BookAppointmentModal from "@/components/shared/BookAppointmentModal";
import { SERVICE_CATEGORIES } from "@/lib/services-data";
import { cn } from "@/lib/utils";
import type { ServiceItem } from "@/types";
import { getPublicServices, type Service } from "@/lib/supabase/services-api-public";
import { transformServicesToItems } from "@/lib/supabase/transform-services";

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
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRangeId>("any");
  const [durationRange, setDurationRange] = useState<DurationRangeId>("any");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [favorites, setFavorites] = useState<ReadonlySet<string>>(new Set());
  const [modalService, setModalService] = useState<ServiceItem | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedServiceForBooking, setSelectedServiceForBooking] = useState<Service | null>(null);

  const [services, setServices] = useState<ServiceItem[]>([]);
  const [rawServices, setRawServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublicServices();
      setRawServices(data);
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
    setExpandedCategories((prev) => {
      const next = new Set(prev);
      if (next.has(categoryId)) {
        next.delete(categoryId);
      } else {
        next.add(categoryId);
      }
      return next;
    });
  };

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleBook = (service: ServiceItem) => {
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

  const serviceCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    servicesByCategory.forEach((items, catId) => {
      counts[catId] = items.length;
    });
    return counts;
  }, [servicesByCategory]);

  const totalResults = filteredServices.length;

  const clearFilters = () => {
    setSearch("");
    setPriceRange("any");
    setDurationRange("any");
    setAvailableOnly(false);
    setFavoritesOnly(false);
  };

  return (
    <>
      {/* HERO SECTION WITH SEARCH */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        {/* Vibrant animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-mauve via-sage/80 to-deep">
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
            className="absolute inset-0 opacity-50"
            style={{
              background: 'linear-gradient(135deg, #8A6F88, #4F7288, #47676A, #0F5F2E)',
              backgroundSize: '400% 400%',
            }}
          />
        </div>

        {/* Floating color orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-mauve/40 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -80, 0],
            y: [0, 80, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-sage/50 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full bg-gradient-to-br from-forest/30 to-transparent blur-3xl"
        />

        <div className="relative section-padding max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-4xl mx-auto"
          >
            {/* Eyebrow */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ivory/10 backdrop-blur-sm mb-6">
              <Sparkles className="h-4 w-4 text-ivory" />
              <span className="text-xs uppercase tracking-wider text-ivory font-medium">
                Our Services
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-ivory mb-4 leading-tight">
              Discover Your <span className="italic">Perfect</span> Ritual
            </h1>

            <p className="text-lg text-ivory/80 mb-10 max-w-2xl mx-auto">
              {loading ? 'Loading our curated treatments...' : `${totalResults} premium treatments await you`}
            </p>

            {/* Enhanced Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="max-w-2xl mx-auto"
            >
              <div className="relative group">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-mauve via-sage to-deep rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-deep/40 z-10" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="relative w-full h-16 pl-14 pr-14 rounded-full border-2 border-ivory/20 bg-ivory/95 backdrop-blur-xl text-deep placeholder:text-deep/40 text-lg font-light focus:border-ivory focus:outline-none focus:ring-4 focus:ring-ivory/20 transition-all shadow-xl"
                    placeholder="Search for treatments, skincare, spa..."
                    disabled={loading}
                  />
                  {search && (
                    <button
                      onClick={() => setSearch("")}
                      className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full hover:bg-deep/5 transition-colors"
                    >
                      <X className="h-5 w-5 text-deep/60" />
                    </button>
                  )}
                </div>
              </div>

              {/* Search results count */}
              {search && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-4 text-sm text-ivory/80"
                >
                  {totalResults} result{totalResults === 1 ? "" : "s"} found
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-ivory/30 rounded-tl-2xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-ivory/30 rounded-br-2xl" />
      </section>

      {/* SERVICES GRID SECTION */}
      <section
        id="services-grid"
        className="relative py-8 sm:py-12 bg-ivory"
      >
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
          {/* DESKTOP LAYOUT */}
          <div className="hidden lg:block">
            {error && (
              <div className="mb-8 p-6 rounded-2xl bg-mauve-tint border-2 border-mauve">
                <p className="text-deep text-sm mb-3">{error}</p>
                <button
                  onClick={loadServices}
                  className="px-6 py-2.5 rounded-full bg-mauve text-ivory text-sm font-medium hover:bg-mauve-dark transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-32">
                <Loader2 className="h-12 w-12 animate-spin text-mauve mb-4" />
                <p className="text-deep/60 font-light">Loading treatments...</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <CategoryNav serviceCounts={serviceCounts} totalServices={totalResults} />

                <div className="lg:col-span-9 space-y-16">
                  {SERVICE_CATEGORIES.map((cat) => {
                    const items = servicesByCategory.get(cat.id) ?? [];
                    if (!items.length) return null;

                    return (
                      <section key={cat.id} id={cat.id} className="scroll-mt-28">
                        <div className="mb-6">
                          <h3 className="font-display text-3xl font-light text-deep mb-2">
                            {cat.name}
                          </h3>
                          <p className="text-sm text-deep/60">
                            {items.length} treatment{items.length === 1 ? "" : "s"} available
                          </p>
                        </div>

                        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
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

          {/* MOBILE LAYOUT */}
          <div className="lg:hidden">
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

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-mauve mb-3" />
                <p className="text-deep/60 text-sm font-light">Loading treatments...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {SERVICE_CATEGORIES.map((cat) => {
                  const items = servicesByCategory.get(cat.id) ?? [];
                  if (!items.length) return null;

                  const isExpanded = expandedCategories.has(cat.id);
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
                        "relative overflow-hidden rounded-2xl border-2 transition-colors duration-300",
                        isExpanded ? accentBorder[cat.color] : "border-deep/10"
                      )}
                    >
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

                      <AnimatePresence initial={false}>
                        {isExpanded ? (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ 
                              duration: 0.4, 
                              ease: [0.16, 1, 0.3, 1]
                            }}
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

      <EmployeeModal
        service={modalService}
        onClose={() => setModalService(null)}
        onBook={(s) => {
          setModalService(null);
          handleBook(s);
        }}
      />

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