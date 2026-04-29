"use client";

import { motion } from "framer-motion";
import { ArrowRight, ArrowUpRight, ShoppingBag, Sparkles } from "lucide-react";
import Image from "next/image";
import { useRef, useState, useEffect } from "react";
import { getPublicProducts } from "@/lib/supabase/products-api";
import type { Product } from "@/lib/supabase/types";
import { formatShopPrice } from "@/lib/shop-data";
import { cn } from "@/lib/utils";
import { useCart } from "@/app/contexts/CartContext";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";

/**
 * Just-landed row — horizontal scroll of new products on a dark mauve band.
 * Fetches products marked as is_new_arrival from Supabase.
 */
export function NewArrivals(): React.ReactElement {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();
  const { notification, showSuccess, hideSuccess } = useSuccessNotification();

  // Load new arrival products
  useEffect(() => {
    loadNewArrivals();
  }, []);

  const loadNewArrivals = async () => {
    try {
      setLoading(true);
      const allProducts = await getPublicProducts();
      // Filter products marked as new arrivals
      const newArrivals = allProducts.filter(p => p.is_new_arrival).slice(0, 6);
      setProducts(newArrivals);
    } catch (error) {
      console.error('Error loading new arrivals:', error);
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

  const scrollBy = (dir: "left" | "right"): void => {
    const el = scrollRef.current;
    if (!el) return;
    const delta = dir === "left" ? -el.clientWidth * 0.7 : el.clientWidth * 0.7;
    el.scrollBy({ left: delta, behavior: "smooth" });
  };

  if (loading || products.length === 0) return <></>;

  return (
    <>
      <section className="relative py-16 sm:py-20 overflow-hidden bg-mauve">
        {/* Top + bottom palette stripes */}
        <div className="absolute top-0 inset-x-0 flex h-1">
          <span className="flex-1 bg-deep" />
          <span className="flex-1 bg-sage" />
          <span className="flex-1 bg-ivory" />
        </div>
        <div className="absolute bottom-0 inset-x-0 flex h-1">
          <span className="flex-1 bg-ivory" />
          <span className="flex-1 bg-sage" />
          <span className="flex-1 bg-deep" />
        </div>

        <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
          {/* Header */}
          <motion.div
            initial={{ opacity: 1, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            className="mb-8 sm:mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-5"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory mb-4">
                <span className="h-1.5 w-1.5 rounded-full bg-mauve animate-pulse-soft" />
                <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-mauve">
                  Just landed
                </span>
              </div>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-ivory leading-tight tracking-tight">
                Fresh off the{" "}
                <em className="not-italic">formulation bench</em>.
              </h2>
              <p className="mt-3 text-sm sm:text-base font-light text-ivory max-w-lg">
                New arrivals selected by our clinicians —{" "}
                {products.length} products worth knowing about this season.
              </p>
            </div>

            {/* Scroll arrows */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => scrollBy("left")}
                aria-label="Scroll left"
                className="h-11 w-11 rounded-full bg-ivory text-mauve hover:bg-deep hover:text-ivory transition-colors duration-200 flex items-center justify-center"
              >
                <ArrowRight className="h-4 w-4 rotate-180" strokeWidth={1.5} />
              </button>
              <button
                type="button"
                onClick={() => scrollBy("right")}
                aria-label="Scroll right"
                className="h-11 w-11 rounded-full bg-ivory text-mauve hover:bg-deep hover:text-ivory transition-colors duration-200 flex items-center justify-center"
              >
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>

          {/* Horizontal scroll rail */}
          <div
            ref={scrollRef}
            className="new-arrivals-scroll flex gap-4 lg:gap-5 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory"
            style={{ scrollbarWidth: "none" }}
          >
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

              return (
                <motion.article
                  key={product.id}
                  initial={{ opacity: 1, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.5,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="group relative shrink-0 w-[280px] sm:w-[320px] snap-start flex flex-col rounded-2xl bg-ivory overflow-hidden shadow-[0_12px_30px_rgba(53,79,82,0.25)]"
                >
                  {/* Image */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-deep-tint">
                    {product.image_url ? (
                      <Image
                        src={product.image_url}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 280px, 320px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-mauve-tint">
                        <Sparkles className="h-12 w-12 text-mauve" strokeWidth={1.5} />
                      </div>
                    )}

                    {/* NEW ribbon — corner flag */}
                    <div className="absolute top-0 left-0 z-10">
                      <div className="relative">
                        <span className="inline-flex items-center gap-1 px-3 py-1 bg-sage text-ivory text-[9px] uppercase tracking-[0.2em] font-semibold rounded-br-xl">
                          <Sparkles className="h-2.5 w-2.5" strokeWidth={2} />
                          New
                        </span>
                      </div>
                    </div>

                    {/* Volume badge top-right */}
                    <span className="absolute top-3 right-3 z-10 inline-flex items-center px-2.5 py-0.5 rounded-full bg-ivory text-deep text-[9px] uppercase tracking-[0.15em] font-medium shadow-sm">
                      {product.volume}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="flex-1 flex flex-col p-5 bg-ivory">
                    <p className={cn("eyebrow text-[9px] mb-1", accentText[product.accent])}>
                      {product.tagline}
                    </p>
                    <h3 className="font-display text-lg sm:text-xl font-light text-deep leading-tight tracking-tight mb-2 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-[12px] font-light text-deep leading-relaxed line-clamp-2 mb-4">
                      {product.description}
                    </p>

                    {/* Ingredient pill */}
                    <div className="inline-flex items-center gap-1.5 self-start px-2.5 py-1 rounded-full bg-mauve-tint mb-4">
                      <span className="h-1 w-1 rounded-full bg-mauve" />
                      <span className="text-[10px] uppercase tracking-[0.1em] text-mauve font-medium">
                        {product.key_ingredient}
                      </span>
                    </div>

                    {/* Price + CTA */}
                    <div className="mt-auto flex items-center justify-between gap-3 pt-4 border-t border-deep/10">
                      <span
                        className={cn(
                          "font-display text-xl font-light tabular-nums",
                          accentText[product.accent]
                        )}
                      >
                        {formatShopPrice(product.price)}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleAddToCart(product)}
                        aria-label={`Add ${product.name} to cart`}
                        className={cn(
                          "group/btn inline-flex items-center gap-1.5 pl-4 pr-1 py-1 rounded-full text-ivory text-[10px] uppercase tracking-[0.15em] font-medium transition-colors duration-200",
                          accentBg[product.accent]
                        )}
                      >
                        <span>Add</span>
                        <span className="h-7 w-7 rounded-full bg-ivory flex items-center justify-center transition-transform duration-300 group-hover/btn:rotate-90">
                          <ShoppingBag
                            className={cn("h-3 w-3", accentText[product.accent])}
                            strokeWidth={1.75}
                          />
                        </span>
                      </button>
                    </div>
                  </div>
                </motion.article>
              );
            })}

            {/* End-of-rail "view all" card */}
            <motion.a
              href="#products-grid"
              initial={{ opacity: 1, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.5,
                delay: products.length * 0.06,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group shrink-0 w-[280px] sm:w-[320px] snap-start flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-ivory text-center p-8 hover:border-solid hover:bg-ivory transition-colors duration-300"
            >
              <div className="h-14 w-14 rounded-full bg-ivory text-mauve flex items-center justify-center mb-4 transition-transform duration-300 group-hover:rotate-45 group-hover:bg-mauve group-hover:text-ivory">
                <ArrowUpRight className="h-5 w-5" strokeWidth={1.5} />
              </div>
              <p className="font-display text-xl font-light text-ivory group-hover:text-deep transition-colors mb-1">
                Browse the full library
              </p>
              <p className="text-[11px] uppercase tracking-[0.15em] text-ivory group-hover:text-mauve transition-colors">
                Explore all products
              </p>
            </motion.a>
          </div>
        </div>

        <style jsx global>{`
          .new-arrivals-scroll::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </section>

      <SuccessNotification {...notification} onClose={hideSuccess} />
    </>
  );
}