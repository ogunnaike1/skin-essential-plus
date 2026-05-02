"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Heart,
  ShoppingBag,
  Sparkles,
  Star,
  X,
  Loader2,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState, useEffect } from "react";

import {
  PRODUCT_CATEGORIES,
  formatShopPrice,
} from "@/lib/shop-data";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types";
import { getPublicProducts } from "@/lib/supabase/products-api";
import type { Product as SupabaseProduct } from "@/lib/supabase/types";
import { useCart } from "@/app/contexts/CartContext";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";

type StockFilter = "all" | "in-stock" | "on-sale";
type SortOption = "featured" | "price-low" | "price-high" | "rating";

/**
 * MOBILE: Pure accordion — tap a category, products expand below.
 * DESKTOP: Full filter panel + product grid.
 */
export function ProductsGrid(): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [favorites, setFavorites] = useState<ReadonlySet<string>>(new Set());
  const [search, setSearch] = useState("");

  // Mobile accordion state - CHANGED TO SET
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  // Supabase products state
  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Success notification for favorites and cart
  const { notification, showSuccess, hideSuccess } = useSuccessNotification();

  // Load products from Supabase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPublicProducts();
      setProducts(data);
    } catch (err) {
      console.error('Error loading products:', err);
      setError('Failed to load products');
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

  const toggleFavorite = (id: string, productName: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
        showSuccess("favorite-added", {
          message: `${productName} saved to your favorites`
        });
      }
      return next;
    });
  };

  const filteredProducts = useMemo(() => {
    let list = [...products];

    // Apply search filter
    const q = search.trim().toLowerCase();
    if (q) {
      list = list.filter((p) => {
        const searchableText = `${p.name} ${p.tagline} ${p.key_ingredient}`.toLowerCase();
        return searchableText.includes(q);
      });
    }

    if (activeCategory !== "all") {
      list = list.filter((p) => p.category === activeCategory);
    }

    if (stockFilter === "in-stock") {
      list = list.filter((p) => p.stock_status === "in-stock");
    } else if (stockFilter === "on-sale") {
      list = list.filter((p) => p.original_price !== undefined);
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
        list.sort((a, b) => Number(b.is_bestseller ?? 0) - Number(a.is_bestseller ?? 0));
    }

    return list;
  }, [activeCategory, stockFilter, sort, products, search]);

  const hasActiveFilters = activeCategory !== "all" || stockFilter !== "all";
  const clearAll = () => {
    setActiveCategory("all");
    setStockFilter("all");
    setSort("featured");
    setSearch("");
  };

  return (
    <>
      <section id="products-grid" className="relative bg-ivory">
        <div className="mx-auto max-w-[1600px]">
          {/* DESKTOP LAYOUT */}
          <div className="hidden lg:block px-6 sm:px-10 lg:px-14 py-16 sm:py-20">
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
                  {loading ? 'Loading products...' : `Browse ${products.length} clinician-approved products across ${PRODUCT_CATEGORIES.length} categories.`}
                </p>
              </div>

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
            </motion.div>

            {/* Fixed-height grid wrapper with independent scroll */}
            <div className="grid grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
              {/* Sidebar — fills parent height, internal scroll */}
              <aside className="col-span-3 h-full overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-mauve scrollbar-track-transparent">
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

              {/* Product grid — fills parent height, scrolls independently */}
              <div className="col-span-9 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-mauve scrollbar-track-transparent">
                {loading ? (
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="h-8 w-8 animate-spin text-mauve" />
                  </div>
                ) : error ? (
                  <div className="text-center py-20">
                    <p className="text-deep mb-4">{error}</p>
                    <button
                      onClick={loadProducts}
                      className="px-6 py-3 rounded-full bg-mauve text-ivory hover:bg-mauve-dark transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                ) : filteredProducts.length === 0 ? (
                  <EmptyState clearAll={clearAll} />
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 pb-6">
                    {filteredProducts.map((product, i) => (
                      <ProductCard
                        key={product.id}
                        product={product}
                        index={i}
                        isFavorite={favorites.has(product.id)}
                        onToggleFavorite={toggleFavorite}
                        showSuccess={showSuccess}
                      />
                    ))}
                  </div>
                )}
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
                Shop the collection
              </h2>
              <p className="mt-2 text-sm font-light text-deep">
                Search or tap a category to see products.
              </p>
            </motion.div>

            {/* Mobile Search Bar */}
            <div className="mb-6">
              <div className="relative">
                <Search
                  className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep"
                  strokeWidth={1.5}
                />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full h-12 pl-11 pr-10 rounded-full bg-mauve-tint border-2 border-transparent text-deep placeholder:text-deep/50 text-sm font-light focus:border-mauve focus:outline-none transition-colors"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-deep/10 transition-colors"
                  >
                    <X className="h-4 w-4 text-deep" strokeWidth={1.5} />
                  </button>
                )}
              </div>
              {search && (
                <p className="text-xs text-deep mt-2">
                  {filteredProducts.length} result{filteredProducts.length === 1 ? "" : "s"} found
                </p>
              )}
            </div>

            {/* Accordion list */}
            <div className="space-y-3">
              {loading ? (
                <div className="flex items-center justify-center py-20">
                  <Loader2 className="h-8 w-8 animate-spin text-mauve" />
                </div>
              ) : (
                PRODUCT_CATEGORIES.map((cat) => {
                  const allProductsInCat = filteredProducts.filter((p) => p.category === cat.id);
                  if (allProductsInCat.length === 0) return null;
                  
                  const isExpanded = expandedCategories.has(cat.id);

                const accentBg: Record<typeof cat.color, string> = {
                  mauve: "bg-mauve",
                  sage: "bg-sage",
                  deep: "bg-deep",
                };
                const accentText: Record<typeof cat.color, string> = {
                  mauve: "text-mauve",
                  sage: "text-sage",
                  deep: "text-deep",
                };
                const accentBorder: Record<typeof cat.color, string> = {
                  mauve: "border-mauve",
                  sage: "border-sage",
                  deep: "border-deep",
                };

                return (
                  <div
                    key={cat.id}
                    className={cn(
                      "relative overflow-hidden rounded-2xl border-2 transition-colors duration-300",
                      isExpanded
                        ? accentBorder[cat.color]
                        : "border-deep/10 hover:border-deep/20"
                    )}
                  >
                    {/* Accordion header */}
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
                          <Sparkles className="h-5 w-5 text-ivory" strokeWidth={1.5} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3
                            className={cn(
                              "font-display text-xl font-light leading-tight tracking-tight",
                              isExpanded ? accentText[cat.color] : "text-deep"
                            )}
                          >
                            {cat.label}
                          </h3>
                          <p className="text-[11px] text-deep font-light truncate">
                            {allProductsInCat.length} product
                            {allProductsInCat.length === 1 ? "" : "s"}
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

                    {/* Accordion panel */}
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
                            {allProductsInCat.map((product, idx) => (
                              <ProductCard
                                key={product.id}
                                product={product}
                                index={idx}
                                isFavorite={favorites.has(product.id)}
                                onToggleFavorite={toggleFavorite}
                                showSuccess={showSuccess}
                              />
                            ))}
                          </div>
                        </motion.div>
                      ) : null}
                    </AnimatePresence>
                  </div>
                );
              })
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Success Notification - Single instance for entire grid */}
      <SuccessNotification
        {...notification}
        onClose={hideSuccess}
      />
    </>
  );
}

// ──────────────────────────────────────────────────────────────
// Desktop filter sidebar
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
      <div className="flex h-1.5">
        <span className="flex-1 bg-mauve" />
        <span className="flex-1 bg-sage" />
        <span className="flex-1 bg-deep" />
      </div>

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
// Product Card - WITH ADD TO CART (ALWAYS VISIBLE)
// ──────────────────────────────────────────────────────────────
interface ProductCardProps {
  product: SupabaseProduct;
  index: number;
  isFavorite: boolean;
  onToggleFavorite: (id: string, productName: string) => void;
  showSuccess: (type: any, options: any) => void;
}

function ProductCard({
  product,
  index,
  isFavorite,
  onToggleFavorite,
  showSuccess,
}: ProductCardProps): React.ReactElement {
  const { addToCart } = useCart();
  
  const isLowStock = product.stock_status === "low-stock";
  const isPreOrder = product.stock_status === "pre-order";
  const hasDiscount = product.original_price !== undefined;
  const discountPercent = hasDiscount
    ? Math.round(((product.original_price! - product.price) / product.original_price!) * 100)
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

  // Add to cart handler
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product);
    showSuccess("cart-added", {
      message: `${product.name} added to your cart`
    });
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
      className="group relative flex flex-col rounded-xl bg-ivory border-2 border-deep/15 overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-deep hover:shadow-[0_12px_30px_rgba(71,103,106,0.12)]"
    >
      <div className={cn("h-0.5 w-full shrink-0", accentBg[product.accent])} />

      <div className="relative aspect-[4/3] overflow-hidden bg-deep-tint">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-mauve-tint">
            <Sparkles className="h-12 w-12 text-mauve" strokeWidth={1.5} />
          </div>
        )}

        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {product.is_new ? (
            <span className="inline-flex self-start px-1.5 py-0.5 rounded-full bg-sage text-ivory text-[8px] uppercase tracking-[0.15em] font-medium shadow-sm">
              New
            </span>
          ) : null}
          {product.is_bestseller ? (
            <span className="inline-flex self-start items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-mauve text-ivory text-[8px] uppercase tracking-[0.15em] font-medium shadow-sm">
              <Sparkles className="h-2 w-2" strokeWidth={1.75} />
              Bestseller
            </span>
          ) : null}
          {product.is_exclusive ? (
            <span className="inline-flex self-start px-1.5 py-0.5 rounded-full bg-deep text-ivory text-[8px] uppercase tracking-[0.15em] font-medium shadow-sm">
              Exclusive
            </span>
          ) : null}
          {hasDiscount ? (
            <span className="inline-flex self-start px-1.5 py-0.5 rounded-full bg-ivory text-mauve text-[8px] uppercase tracking-[0.15em] font-semibold shadow-sm tabular-nums">
              −{discountPercent}%
            </span>
          ) : null}
        </div>

        <button
          type="button"
          onClick={() => onToggleFavorite(product.id, product.name)}
          aria-label={isFavorite ? "Remove from favorites" : "Add to favorites"}
          aria-pressed={isFavorite}
          className="absolute top-2 right-2 z-10 h-7 w-7 rounded-full bg-ivory flex items-center justify-center transition-colors duration-200 hover:bg-mauve-tint shadow-sm"
        >
          <Heart
            className={cn(
              "h-3 w-3 transition-colors duration-200",
              isFavorite ? "fill-mauve text-mauve" : "text-deep"
            )}
            strokeWidth={1.5}
          />
        </button>

        {/* ADD TO CART BUTTON - ALWAYS VISIBLE */}
        <button
          type="button"
          onClick={handleAddToCart}
          aria-label={`Add ${product.name} to cart`}
          className={cn(
            "absolute bottom-2 right-2 z-10 px-3 py-2 rounded-full flex items-center justify-center gap-1.5 text-ivory shadow-lg hover:scale-105 transition-transform duration-200",
            accentBg[product.accent]
          )}
        >
          <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.75} />
          <span className="text-[10px] font-medium uppercase tracking-wider">Add</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col p-3 bg-ivory">
        <div className="flex items-center gap-1 mb-1.5">
          <div className="flex items-center gap-px">
            {Array.from({ length: 5 }).map((_, idx) => (
              <Star
                key={idx}
                className={cn(
                  "h-2 w-2",
                  idx < Math.round(product.rating) ? "fill-mauve text-mauve" : "text-deep/20"
                )}
                strokeWidth={0}
              />
            ))}
          </div>
          <span className="text-[10px] font-medium text-deep tabular-nums">
            {product.rating.toFixed(1)}
          </span>
          <span className="text-[10px] text-deep font-light">({product.review_count})</span>
        </div>

        <p className={cn("eyebrow text-[8px] mb-1", accentText[product.accent])}>
          {product.tagline}
        </p>

        <h3 className="font-display text-sm font-light text-deep leading-tight tracking-tight mb-1.5 line-clamp-2">
          {product.name}
        </h3>

        <div className="flex items-center gap-2 text-[10px] text-deep font-light mb-2">
          <span className="truncate">{product.key_ingredient}</span>
          <span className="text-deep/30">·</span>
          <span>{product.volume}</span>
        </div>

        {(isLowStock || isPreOrder) && (
          <div
            className={cn(
              "inline-flex items-center gap-1 self-start px-1.5 py-0.5 rounded-full text-[8px] uppercase tracking-[0.15em] font-medium mb-2",
              isLowStock ? "bg-mauve-tint text-mauve" : "bg-sage-tint text-sage"
            )}
          >
            <span
              className={cn(
                "h-1 w-1 rounded-full animate-pulse-soft",
                isLowStock ? "bg-mauve" : "bg-sage"
              )}
            />
            {isLowStock ? "Low stock" : "Pre-order"}
          </div>
        )}

        <div className="mt-auto pt-2 border-t border-deep/10 flex items-baseline justify-between">
          <div className="flex items-baseline gap-1.5">
            {hasDiscount ? (
              <span className="text-[10px] text-deep/50 line-through tabular-nums">
                {formatShopPrice(product.original_price!)}
              </span>
            ) : null}
            <span className={cn("font-display text-lg font-light tabular-nums", accentText[product.accent])}>
              {formatShopPrice(product.price)}
            </span>
          </div>
          <a
            href={`#product-${product.id}`}
            className="text-[9px] uppercase tracking-[0.15em] text-deep hover:text-mauve transition-colors inline-flex items-center gap-0.5"
          >
            Details
            <ArrowUpRight className="h-2 w-2" strokeWidth={1.5} />
          </a>
        </div>
      </div>
    </motion.article>
  );
}

// ──────────────────────────────────────────────────────────────
// Empty state
// ──────────────────────────────────────────────────────────────
function EmptyState({ clearAll }: { clearAll: () => void }): React.ReactElement {
  return (
    <div className="text-center py-24 px-6 rounded-2xl border-2 border-mauve bg-mauve-tint">
      <div className="inline-flex h-14 w-14 rounded-full bg-mauve items-center justify-center mb-5">
        <Sparkles className="h-5 w-5 text-ivory" strokeWidth={1.5} />
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
    </div>
  );
}