"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, ShoppingBag, Sparkles, Star } from "lucide-react";
import Image from "next/image";
import { useState, useEffect } from "react";
import { getBestSellers } from "@/lib/supabase/products-api";
import type { Product } from "@/lib/supabase/types";
import { formatShopPrice } from "@/lib/shop-data";
import { cn } from "@/lib/utils";
import { useCart } from "@/app/contexts/CartContext";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";

/**
 * Best sellers row — 4 top-rated products on a palette-gradient section.
 * Fetches products marked as is_bestseller from Supabase dynamically.
 */
export function BestSellers(): React.ReactElement {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { notification, showSuccess, hideSuccess } = useSuccessNotification();

  // Load bestseller products
  useEffect(() => {
    loadBestSellers();
  }, []);

  const loadBestSellers = async () => {
    try {
      setLoading(true);
      const data = await getBestSellers(4); // Get up to 4 bestsellers
      setProducts(data);
    } catch (error) {
      console.error('Error loading bestsellers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product);
    showSuccess("cart-added", {
      message: `${product.name} added to your cart`
    });
  };

  if (loading || products.length === 0) return <></>;

  return (
    <>
      <section
        className="relative py-16 sm:py-20 overflow-hidden"
        style={{
          background:
            "linear-gradient(180deg, #FCFBFC 0%, rgba(79,114,136,0.12) 50%, #FCFBFC 100%)",
        }}
      >
        {/* Ambient palette orbs */}
        <div
          className="absolute top-20 -left-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
          aria-hidden
        />
        <div
          className="absolute bottom-20 -right-40 h-[480px] w-[480px] rounded-full blur-3xl opacity-20 pointer-events-none"
          style={{ background: "radial-gradient(circle, #4F7288 0%, transparent 70%)" }}
          aria-hidden
        />

        <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 sm:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mauve text-ivory mb-4">
                <Sparkles className="h-3 w-3" strokeWidth={1.75} />
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium">
                  Best Sellers
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-deep leading-tight tracking-tight">
                Loved by{" "}
                <em className="not-italic text-mauve">thousands</em>.
              </h2>
              <p className="mt-3 text-sm sm:text-base font-light text-deep max-w-lg">
                The products our community returns to, again and again — tested by reviews, earned by results.
              </p>
            </div>
            <a
              href="#products-grid"
              className="group shrink-0 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-deep font-medium hover:text-mauve transition-colors"
            >
              <span>View all</span>
              <span className="h-8 w-8 rounded-full bg-deep text-ivory flex items-center justify-center group-hover:bg-mauve transition-colors">
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
              </span>
            </a>
          </motion.div>

          {/* Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {products.map((product, i) => {
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
              const stripeHex: Record<typeof product.accent, string> = {
                mauve: "#8A6F88",
                sage: "#4F7288",
                deep: "#47676A",
              };

              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.6,
                    delay: i * 0.08,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative flex flex-col rounded-2xl bg-ivory border-2 border-deep/10 overflow-hidden transition-[border-color,box-shadow] duration-300 hover:border-deep/25 hover:shadow-[0_12px_30px_rgba(71,103,106,0.1)]"
                >
                  {/* Ranking number — top-left */}
                  <span
                    className={cn(
                      "absolute top-3 left-3 z-10 h-8 w-8 rounded-full flex items-center justify-center text-ivory font-display text-sm font-light tabular-nums shadow-[0_2px_8px_rgba(0,0,0,0.2)]",
                      accentBg[product.accent]
                    )}
                  >
                    #{i + 1}
                  </span>

                  {/* Top accent stripe */}
                  <div
                    className="h-0.5 w-full shrink-0"
                    style={{ backgroundColor: stripeHex[product.accent] }}
                  />

                  {/* Image */}
                  <div className="relative aspect-square overflow-hidden bg-deep/5">
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

                    {/* Quick-shop button — bottom-right */}
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      aria-label={`Add ${product.name} to cart`}
                      className={cn(
                        "absolute bottom-3 right-3 h-10 w-10 rounded-full flex items-center justify-center text-ivory opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300",
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
                        ({product.review_count})
                      </span>
                    </div>

                    {/* Tagline */}
                    <p
                      className={cn(
                        "eyebrow text-[9px] mb-1",
                        accentText[product.accent]
                      )}
                    >
                      {product.tagline}
                    </p>

                    {/* Name */}
                    <h3 className="font-display text-lg font-light text-deep leading-tight tracking-tight mb-2 line-clamp-2">
                      {product.name}
                    </h3>

                    {/* Key ingredient + volume */}
                    <div className="flex items-center gap-2 text-[11px] text-deep font-light mb-4 mt-auto pb-4 border-b border-deep/10">
                      <span className="truncate">{product.key_ingredient}</span>
                      <span className="text-deep/20">·</span>
                      <span>{product.volume}</span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        {product.original_price ? (
                          <span className="text-[10px] text-deep line-through mr-1.5">
                            {formatShopPrice(product.original_price)}
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
                      <span className="text-[10px] uppercase tracking-[0.15em] text-deep">
                        View
                      </span>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      <SuccessNotification {...notification} onClose={hideSuccess} />
    </>
  );
}