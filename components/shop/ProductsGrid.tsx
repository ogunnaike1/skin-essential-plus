"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  Heart,
  ShoppingBag,
  Sparkles,
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

export function ProductsGrid(): React.ReactElement {
  const [activeCategory, setActiveCategory] = useState<ProductCategory | "all">("all");
  const [stockFilter, setStockFilter] = useState<StockFilter>("all");
  const [sort, setSort] = useState<SortOption>("featured");
  const [favorites, setFavorites] = useState<ReadonlySet<string>>(new Set());
  const [search, setSearch] = useState("");
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());

  const [products, setProducts] = useState<SupabaseProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { notification, showSuccess, hideSuccess } = useSuccessNotification();

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
      {/* HERO SECTION WITH SEARCH */}
      <section className="relative py-12 sm:py-16 overflow-hidden">
        {/* Vibrant animated gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-sage via-mauve/80 to-deep">
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
              background: 'linear-gradient(135deg, #4F7288, #8A6F88, #47676A, #0F5F2E)',
              backgroundSize: '400% 400%',
            }}
          />
        </div>

        {/* Floating color orbs */}
        <motion.div
          animate={{
            x: [0, 80, 0],
            y: [0, -80, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-gradient-to-br from-sage/40 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -70, 0],
            y: [0, 70, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] rounded-full bg-gradient-to-br from-mauve/50 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 40, 0],
            y: [0, -40, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/2 right-1/3 w-80 h-80 rounded-full bg-gradient-to-br from-deep/30 to-transparent blur-3xl"
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
              <ShoppingBag className="h-4 w-4 text-ivory" />
              <span className="text-xs uppercase tracking-wider text-ivory font-medium">
                Our Shop
              </span>
            </div>

            {/* Title */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-ivory mb-4 leading-tight">
              Curated <span className="italic">Skincare</span> Collection
            </h1>

            <p className="text-lg text-ivory/80 mb-10 max-w-2xl mx-auto">
              {loading ? 'Loading our luxury products...' : `${products.length} clinician-approved products across ${PRODUCT_CATEGORIES.length} categories`}
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
                <div className="absolute -inset-1 bg-gradient-to-r from-sage via-mauve to-deep rounded-full blur opacity-25 group-hover:opacity-40 transition duration-1000" />
                
                {/* Search input */}
                <div className="relative">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-deep/40 z-10" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="relative w-full h-16 pl-14 pr-14 rounded-full border-2 border-ivory/20 bg-ivory/95 backdrop-blur-xl text-deep placeholder:text-deep/40 text-lg font-light focus:border-ivory focus:outline-none focus:ring-4 focus:ring-ivory/20 transition-all shadow-xl"
                    placeholder="Search for serums, cleansers, moisturizers..."
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
                  {filteredProducts.length} product{filteredProducts.length === 1 ? "" : "s"} found
                </motion.p>
              )}
            </motion.div>
          </motion.div>
        </div>

        {/* Decorative corner accents */}
        <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-ivory/30 rounded-tl-2xl" />
        <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-ivory/30 rounded-br-2xl" />
      </section>

      {/* PRODUCTS GRID SECTION */}
      <section id="products-grid" className="relative bg-ivory py-8 sm:py-12">
        <div className="mx-auto max-w-[1600px]">
          {/* DESKTOP LAYOUT */}
          <div className="hidden lg:block px-6 sm:px-10 lg:px-14">
            {error && (
              <div className="mb-8 p-6 rounded-2xl bg-mauve-tint border-2 border-mauve">
                <p className="text-deep text-sm mb-3">{error}</p>
                <button
                  onClick={loadProducts}
                  className="px-6 py-2.5 rounded-full bg-mauve text-ivory text-sm font-medium hover:bg-mauve-dark transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {/* Fixed-height grid wrapper with independent scroll */}
            <div className="grid grid-cols-12 gap-8 h-[calc(100vh-12rem)]">
              {/* Sidebar */}
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

              {/* Product grid */}
              <div className="col-span-9 h-full overflow-y-auto scrollbar-thin scrollbar-thumb-mauve scrollbar-track-transparent">
                {loading ? (
                  <div className="flex flex-col items-center justify-center py-32">
                    <Loader2 className="h-12 w-12 animate-spin text-mauve mb-4" />
                    <p className="text-deep/60 font-light">Loading products...</p>
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
            {error && (
              <div className="mb-6 p-4 rounded-2xl bg-mauve-tint border-2 border-mauve">
                <p className="text-deep text-sm">{error}</p>
                <button
                  onClick={loadProducts}
                  className="mt-2 px-4 py-2 rounded-full bg-mauve text-ivory text-sm hover:bg-mauve-dark transition-colors"
                >
                  Retry
                </button>
              </div>
            )}

            {loading ? (
              <div className="flex flex-col items-center justify-center py-20">
                <Loader2 className="h-10 w-10 animate-spin text-mauve mb-3" />
                <p className="text-deep/60 text-sm font-light">Loading products...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {PRODUCT_CATEGORIES.map((cat) => {
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
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      <SuccessNotification
        {...notification}
        onClose={hideSuccess}
      />
    </>
  );
}

// Filter Panel Component (unchanged)
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

// ProductCard Component (unchanged - keeping your existing implementation)
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
      className="group relative flex flex-col rounded-xl bg-white/60 backdrop-blur-md border border-white/80 overflow-hidden shadow-[0_8px_32px_rgba(71,103,106,0.12),inset_0_1px_0_rgba(255,255,255,0.8)] transition-[border-color,box-shadow] duration-300 hover:border-white hover:shadow-[0_16px_48px_rgba(71,103,106,0.18),inset_0_1px_0_rgba(255,255,255,0.9)]"
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
          <span className="text-[10px] font-medium uppercase tracking-wider">Add to Cart</span>
        </button>
      </div>

      <div className="flex-1 flex flex-col p-3 bg-white/50">
        <p className={cn("eyebrow text-[8px] mb-1", accentText[product.accent])}>
          {product.tagline}
        </p>

        <h3 className="font-display text-lg font-semibold text-deep leading-snug tracking-tight mb-1.5 line-clamp-2">
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