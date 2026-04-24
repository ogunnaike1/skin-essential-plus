"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Heart,
  ShoppingBag,
  SlidersHorizontal,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import {
  PRODUCT_CATEGORIES,
  PRODUCTS,
  formatShopPrice,
} from "@/lib/shop-data";
import { cn } from "@/lib/utils";
import type { Product, ProductCategory } from "@/types";

type StockFilter = "all" | "in-stock" | "on-sale";
type SortOption = "featured" | "price-low" | "price-high" | "rating";

/**
 * Full product catalog with left-rail filters.
 * Every background is a SOLID palette-tint color — never translucent.
 */
export function ProductsGrid(): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState<
    ProductCategory | "all"
  >("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [favorites, setFavorites] = useState<ReadonlySet<string>>(new Set());
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const filteredProducts = useMemo(() => {
    let list = [...PRODUCTS];

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (stockFilter === "in-stock") {
      list = list.filter((p) => p.stockStatus === "in-stock");
    } else if (stockFilter === "on-sale") {
      list = list.filter((p) => p.originalPrice !== undefined);
    }

    switch (sort) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "rating":
        list.sort((a, b) => b.rating - a.rating);
        break;
      default:
        // featured — bestsellers first
        list.sort(
          (a, b) => Number(b.isBestSeller ?? 0) - Number(a.isBestSeller ?? 0)
        );
    }

    return list;
  }, [activeCategory, stockFilter, sort]);

  const hasActiveFilters = activeCategory !== "all" || stockFilter !== "all";
  const clearAll = () => {
    setActiveCategory("all");
    setStockFilter("all");
    setSort("featured");
  };

  return (
    <section id="products-grid" className="relative py-16 sm:py-20 bg-ivory">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1 w-8 rounded-full bg-mauve" />
              <span className="h-1 w-8 rounded-full bg-sage" />
              <span className="h-1 w-8 rounded-full bg-deep" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-deep leading-tight tracking-tight">
              The full <em className="not-italic text-mauve">library</em>.
            </h2>
            <p className="mt-3 text-sm sm:text-base font-light text-deep max-w-lg">
              Browse {PRODUCTS.length} clinician-approved products across{" "}
              {PRODUCT_CATEGORIES.length} categories.
            </p>
          </div>

          {/* Sort + mobile filter button */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-11 pl-4 pr-10 rounded-full bg-ivory border-2 border-mauve text-deep text-[11px] uppercase tracking-[0.15em] font-medium appearance-none cursor-pointer focus:border-deep focus:outline-none transition-colors"
                aria-label="Sort products"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="rating">Top rated</option>
              </select>
              <ArrowUpRight className="absolute right-3 top-1/2 -translate-y-1/2 h-3 w-3 text-mauve rotate-90 pointer-events-none" />
            </div>

            <button
              type="button"
              onClick={() => setMobileFilterOpen(true)}
              className="lg:hidden h-11 px-4 rounded-full bg-deep text-ivory text-[11px] uppercase tracking-[0.15em] font-medium inline-flex items-center gap-2"
              aria-label="Open filters"
            >
              <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={1.5} />
              Filter
            </button>
          </div>
        </motion.div>

        {/* Sidebar + grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* FILTER SIDEBAR — desktop */}
          <aside className="hidden lg:block lg:col-span-3">
            <FilterPanel
              activeCategory={activeCategory}
              setActiveCategory={setActiveCategory}
              stockFilter={stockFilter}
              setStockFilter={setStockFilter}
              hasActiveFilters={hasActiveFilters}
              clearAll={clearAll}
              productCount={filteredProducts.length}
            />
          </aside>

          {/* PRODUCT GRID */}
          <div className="lg:col-span-9">
            {filteredProducts.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center py-24 px-6 rounded-2xl border-2 border-mauve bg-mauve-tint"
              >
                <div className="inline-flex h-14 w-14 rounded-full bg-mauve items-center justify-center mb-5">
                  <Sparkles
                    className="h-5 w-5 text-ivory"
                    strokeWidth={1.5}
                  />
                </div>
                <h3 className="font-display text-2xl font-light text-deep mb-2">
                  Nothing matches quite yet.
                </h3>
                <p className="text-sm font-light text-deep max-w-md mx-auto mb-6">
                  Try widening your filters to see more of the library.
                </p>
                <button
                  type="button"
                  onClick={clearAll}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-deep text-ivory text-[11px] uppercase tracking-[0.2em] hover:bg-deep-dark transition-colors"
                >
                  Clear filters
                </button>
              </motion.div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5">
                {filteredProducts.map((product, i) => (
                  <ProductCard
                    key={product.id}
                    product={product}
                    index={i}
                    isFavorite={favorites.has(product.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* MOBILE FILTER DRAWER */}
      <AnimatePresence>
        {mobileFilterOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-deep-dark"
              style={{ opacity: 0.85 }}
              onClick={() => setMobileFilterOpen(false)}
              aria-hidden
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-ivory overflow-y-auto p-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-display text-2xl font-light text-deep">
                  Filters
                </h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  aria-label="Close filters"
                  className="h-10 w-10 rounded-full bg-mauve-tint flex items-center justify-center text-deep hover:bg-mauve hover:text-ivory transition-colors"
                >
                  <X className="h-4 w-4" strokeWidth={1.5} />
                </button>
              </div>
              <FilterPanel
                activeCategory={activeCategory}
                setActiveCategory={setActiveCategory}
                stockFilter={stockFilter}
                setStockFilter={setStockFilter}
                hasActiveFilters={hasActiveFilters}
                clearAll={clearAll}
                productCount={filteredProducts.length}
              />
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-full bg-deep text-ivory text-[11px] uppercase tracking-[0.2em] hover:bg-deep-dark transition-colors"
              >
                Show {filteredProducts.length} products
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </section>
  );
}

// ──────────────────────────────────────────────────────────────
// Filter Panel
// ──────────────────────────────────────────────────────────────
interface FilterPanelProps {
  activeCategory: ProductCategory | "all";
  setActiveCategory: (c: ProductCategory | "all") => void;
  stockFilter: StockFilter;
  setStockFilter: (s: StockFilter) => void;
  hasActiveFilters: boolean;
  clearAll: () => void;
  productCount: number;
}

function FilterPanel({
  activeCategory,
  setActiveCategory,
  stockFilter,
  setStockFilter,
  hasActiveFilters,
  clearAll,
  productCount,
}: FilterPanelProps): React.ReactElement {
  return (
    <div className="rounded-3xl overflow-hidden bg-ivory shadow-[0_20px_50px_rgba(71,103,106,0.12)]">
      {/* Stripe */}
      <div className="flex h-1.5">
        <span className="flex-1 bg-mauve" />
        <span className="flex-1 bg-sage" />
        <span className="flex-1 bg-deep" />
      </div>

      {/* Header */}
      <div className="p-5 bg-deep">
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="h-3 w-3 text-mauve" strokeWidth={1.75} />
          <span className="eyebrow text-ivory text-[9px]">— Refine</span>
        </div>
        <h3 className="font-display text-xl font-light text-ivory leading-tight">
          Curate the shelf
        </h3>
        <p className="mt-2 text-[11px] text-ivory uppercase tracking-[0.15em] tabular-nums">
          <span className="font-medium">{productCount}</span> products shown
        </p>
      </div>

      {/* Categories */}
      <div className="p-5 border-b border-mauve-tint">
        <p className="eyebrow text-deep text-[9px] mb-3">— Category</p>
        <ul className="space-y-1.5">
          <li>
            <button
              type="button"
              onClick={() => setActiveCategory("all")}
              className={cn(
                "w-full text-left px-3 py-2 rounded-full text-[12px] font-medium transition-colors duration-200",
                activeCategory === "all"
                  ? "bg-deep text-ivory"
                  : "bg-mauve-tint text-deep hover:bg-mauve hover:text-ivory"
              )}
            >
              All products
            </button>
          </li>
          {PRODUCT_CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat.id;
            const activeCls: Record<typeof cat.color, string> = {
              mauve: "bg-mauve text-ivory",
              sage: "bg-sage text-ivory",
              deep: "bg-deep text-ivory",
            };
            const tintCls: Record<typeof cat.color, string> = {
              mauve: "bg-mauve-tint hover:bg-mauve hover:text-ivory",
              sage: "bg-sage-tint hover:bg-sage hover:text-ivory",
              deep: "bg-deep-tint hover:bg-deep hover:text-ivory",
            };
            return (
              <li key={cat.id}>
                <button
                  type="button"
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "w-full text-left px-3 py-2 rounded-full text-[12px] font-medium transition-colors duration-200",
                    isActive ? activeCls[cat.color] : cn(tintCls[cat.color], "text-deep")
                  )}
                >
                  {cat.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      {/* Stock */}
      <div className="p-5 border-b border-mauve-tint">
        <p className="eyebrow text-deep text-[9px] mb-3">— Availability</p>
        <div className="space-y-1.5">
          {(
            [
              { id: "all", label: "All products" },
              { id: "in-stock", label: "In stock only" },
              { id: "on-sale", label: "On sale" },
            ] as { id: StockFilter; label: string }[]
          ).map((opt) => (
            <button
              key={opt.id}
              type="button"
              onClick={() => setStockFilter(opt.id)}
              className={cn(
                "w-full inline-flex items-center gap-2 px-3 py-2 rounded-full text-[12px] font-medium transition-colors duration-200",
                stockFilter === opt.id
                  ? "bg-sage text-ivory"
                  : "bg-sage-tint text-deep hover:bg-sage hover:text-ivory"
              )}
            >
              {stockFilter === opt.id ? (
                <CheckCircle2 className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <span className="h-3.5 w-3.5 rounded-full border-2 border-sage" />
              )}
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Clear all */}
      {hasActiveFilters ? (
        <div className="p-5">
          <button
            type="button"
            onClick={clearAll}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-full bg-mauve-tint text-deep text-[11px] uppercase tracking-[0.15em] font-medium hover:bg-mauve hover:text-ivory transition-colors duration-200"
          >
            <X className="h-3 w-3" strokeWidth={1.75} />
            Clear all filters
          </button>
        </div>
      ) : null}
    </div>
  );
}

// ──────────────────────────────────────────────────────────────
// Product Card
// ──────────────────────────────────────────────────────────────
interface ProductCardProps {
  product: Product;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

function ProductCard({
  product,
  index,
  isFavorite,
  onToggleFavorite,
}: ProductCardProps): React.ReactElement {
  const isLowStock = product.stockStatus === "low-stock";
  const isPreOrder = product.stockStatus === "pre-order";
  const hasDiscount = product.originalPrice !== undefined;
  const discountPercent = hasDiscount
    ? Math.round(
        ((product.originalPrice! - product.price) / product.originalPrice!) *
          100
      )
    : 0;

  const accentBg: Record<typeof product.accent, string> = {
    mauve: "bg-mauve",
    sage: "bg-sage",
    deep: "bg-deep",
  };
  const accentText: Record<typeof product.accent, string> = {
    mauve: "text-mauve",
    sage: "text-sage",
    deep: "text-deep",
  };

  return (
    <motion.article
      initial={{ opacity: 1, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.5,
        delay: (index % 3) * 0.05,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative flex flex-col rounded-2xl bg-ivory border-2 border-deep/15 overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-deep hover:shadow-[0_12px_30px_rgba(71,103,106,0.12)]"
    >
      {/* Top accent stripe */}
      <div className={cn("h-0.5 w-full shrink-0", accentBg[product.accent])} />

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-deep-tint">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* Top-left: status tags */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isNew ? (
            <span className="inline-flex self-start px-2 py-0.5 rounded-full bg-sage text-ivory text-[9px] uppercase tracking-[0.15em] font-medium shadow-sm">
              New
            </span>
          ) : null}
          {product.isBestSeller ? (
            <span className="inline-flex self-start items-center gap-1 px-2 py-0.5 rounded-full bg-mauve text-ivory text-[9px] uppercase tracking-[0.15em] font-medium shadow-sm">
              <Sparkles className="h-2.5 w-2.5" strokeWidth={1.75} />
              Bestseller
            </span>
          ) : null}
          {product.isExclusive ? (
            <span className="inline-flex self-start px-2 py-0.5 rounded-full bg-deep text-ivory text-[9px] uppercase tracking-[0.15em] font-medium shadow-sm">
              Exclusive
            </span>
          ) : null}
          {hasDiscount ? (
            <span className="inline-flex self-start px-2 py-0.5 rounded-full bg-ivory text-mauve text-[9px] uppercase tracking-[0.15em] font-semibold shadow-sm tabular-nums">
              −{discountPercent}%
            </span>
          ) : null}
        </div>

        {/* Top-right: favorite */}
        <button
          type="button"
          onClick={() => onToggleFavorite(product.id)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-ivory flex items-center justify-center transition-colors duration-200 hover:bg-mauve-tint shadow-sm"
        >
          <Heart
            className={cn(
              "h-3.5 w-3.5 transition-colors duration-200",
              isFavorite ? "fill-mauve text-mauve" : "text-deep"
            )}
            strokeWidth={1.5}
          />
        </button>

        {/* Quick-shop button — appears on hover */}
        <button
          type="button"
          aria-label={`Add ${product.name} to cart`}
          className={cn(
            "absolute bottom-3 right-3 z-10 h-10 w-10 rounded-full flex items-center justify-center text-ivory opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 shadow-sm",
            accentBg[product.accent]
          )}
        >
          <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 flex flex-col p-4 bg-ivory">
        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-2">
          <div className="flex items-center gap-px">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={cn(
                  "h-2.5 w-2.5",
                  idx < Math.round(product.rating)
                    ? "fill-mauve text-mauve"
                    : "text-deep/20"
                )}
                strokeWidth={0}
              />
            ))}
          </div>
          <span className="text-[11px] font-medium text-deep tabular-nums">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-[11px] text-deep font-light">
            ({product.reviewCount})
          </span>
        </div>

        {/* Tagline */}
        <p className={cn("eyebrow text-[9px] mb-1", accentText[product.accent])}>
          {product.tagline}
        </p>

        {/* Name */}
        <h3 className="font-display text-base sm:text-lg font-light text-deep leading-tight tracking-tight mb-2 line-clamp-2">
          {product.name}
        </h3>

        {/* Ingredient + volume */}
        <div className="flex items-center gap-2 text-[11px] text-deep font-light mb-3">
          <span className="truncate">{product.keyIngredient}</span>
          <span className="text-deep/30">·</span>
          <span>{product.volume}</span>
        </div>

        {/* Stock status */}
        {(isLowStock || isPreOrder) && (
          <div
            className={cn(
              "inline-flex items-center gap-1.5 self-start px-2 py-0.5 rounded-full text-[9px] uppercase tracking-[0.15em] font-medium mb-3",
              isLowStock ? "bg-mauve-tint text-mauve" : "bg-sage-tint text-sage"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full animate-pulse-soft",
                isLowStock ? "bg-mauve" : "bg-sage"
              )}
            />
            {isLowStock ? "Low stock" : "Pre-order"}
          </div>
        )}

        {/* Price — pushed to bottom */}
        <div className="mt-auto pt-3 border-t border-deep/10 flex items-baseline justify-between">
          <div className="flex items-baseline gap-2">
            {hasDiscount ? (
              <span className="text-[11px] text-deep/50 line-through tabular-nums">
                {formatShopPrice(product.originalPrice!)}
              </span>
            ) : null}
            <span
              className={cn(
                "font-display text-xl font-light tabular-nums",
                accentText[product.accent]
              )}
            >
              {formatShopPrice(product.price)}
            </span>
          </div>
          <a
            href={`#product-${product.id}`}
            className="text-[10px] uppercase tracking-[0.15em] text-deep hover:text-mauve transition-colors inline-flex items-center gap-1"
          >
            Details
            <ArrowUpRight className="h-2.5 w-2.5" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}