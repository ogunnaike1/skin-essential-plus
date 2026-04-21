"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Filter,
  Search,
  SlidersHorizontal,
  Sparkles,
  X,
} from "lucide-react";
import { useMemo, useState } from "react";

import { CategoryNav } from "@/components/services/CategoryNav";
import { EmployeeModal } from "@/components/services/EmployeeModal";
import { ServiceCard } from "./ServicesCard"
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

export function ServicesGrid(): React.ReactElement {
  const [search, setSearch] = useState("");
  const [priceRange, setPriceRange] = useState<PriceRangeId>("any");
  const [durationRange, setDurationRange] =
    useState<DurationRangeId>("any");
  const [availableOnly, setAvailableOnly] = useState(false);
  const [favoritesOnly, setFavoritesOnly] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  const [favorites, setFavorites] = useState<ReadonlySet<string>>(
    new Set()
  );
  const [modalService, setModalService] =
    useState<ServiceItem | null>(null);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
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
            "linear-gradient(180deg, #F4F2F3 0%, rgba(192,169,189,0.08) 50%, rgba(148,167,174,0.08) 100%)",
        }}
      >
        <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
          {/* HEADER */}
          <div className="mb-8">
            <h2 className="text-4xl font-light text-deep">
              Find your <span className="text-mauve">ritual</span>
            </h2>
            <p className="text-sm text-deep/60 mt-2">
              {totalResults} services match
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
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  <X />
                </button>
              )}
            </div>

            <button
              onClick={() => setShowFilters((v) => !v)}
              className="px-4 rounded-full border"
            >
              Filters
            </button>
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <CategoryNav />

            <div className="lg:col-span-9 space-y-12">
              {SERVICE_CATEGORIES.map((cat, i) => {
                const items = servicesByCategory.get(cat.id) ?? [];
                if (!items.length) return null;

                return (
                  <section
                    key={cat.id}
                    id={cat.id}
                    className="scroll-mt-28"
                  >
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
    </>
  );
}