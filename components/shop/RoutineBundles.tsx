"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  CheckCircle2,
  Gift,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import {
  PRODUCTS,
  ROUTINE_BUNDLES,
  formatShopPrice,
} from "@/lib/shop-data";
import { cn } from "@/lib/utils";

/**
 * Editorial bundle showcase — tabs at top, huge split panel below.
 * Left: image + savings badge. Right: product checklist + pricing + CTA.
 */
export function RoutineBundles(): React.ReactElement {
  const [activeIndex, setActiveIndex] = useState(0);
  const active = ROUTINE_BUNDLES[activeIndex];
  if (!active) return <></>;

  const savings = active.originalPrice - active.bundlePrice;
  const savingsPercent = Math.round(
    (savings / active.originalPrice) * 100
  );
  const bundleProducts = active.productIds
    .map((id) => PRODUCTS.find((p) => p.id === id))
    .filter((p): p is NonNullable<typeof p> => p !== undefined);

  const accentBg: Record<typeof active.accent, string> = {
    mauve: "bg-mauve",
    sage: "bg-sage",
    deep: "bg-deep",
  };
  const accentText: Record<typeof active.accent, string> = {
    mauve: "text-mauve",
    sage: "text-sage",
    deep: "text-deep",
  };
  const accentTint: Record<typeof active.accent, string> = {
    mauve: "bg-mauve-tint",
    sage: "bg-sage-tint",
    deep: "bg-deep-tint",
  };
  const accentBorder: Record<typeof active.accent, string> = {
    mauve: "border-mauve",
    sage: "border-sage",
    deep: "border-deep",
  };

  return (
    <section id="bundles" className="relative py-16 sm:py-20 bg-ivory">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 1, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-14 text-center"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-mauve-tint border border-mauve mb-4">
            <Gift className="h-3 w-3 text-mauve" strokeWidth={1.75} />
            <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-mauve">
              Curated sets · Save up to 25%
            </span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-deep leading-tight tracking-tight max-w-3xl mx-auto">
            Three rituals, one <em className="not-italic text-mauve">commitment</em>.
          </h2>
          <p className="mt-4 text-sm sm:text-base font-light text-deep max-w-xl mx-auto">
            Complete routines designed by our clinicians. Each bundle pairs products that amplify each other — and the bundle price is always less than the individual sum.
          </p>
        </motion.div>

        {/* TABS — select a bundle */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-2 mb-10 sm:mb-12">
          {ROUTINE_BUNDLES.map((bundle, i) => {
            const isActive = i === activeIndex;
            const tabActiveBg: Record<typeof bundle.accent, string> = {
              mauve: "bg-mauve text-ivory border-mauve",
              sage: "bg-sage text-ivory border-sage",
              deep: "bg-deep text-ivory border-deep",
            };
            const tabRestingBg: Record<typeof bundle.accent, string> = {
              mauve: "bg-mauve-tint text-deep border-mauve hover:bg-mauve hover:text-ivory",
              sage: "bg-sage-tint text-deep border-sage hover:bg-sage hover:text-ivory",
              deep: "bg-deep-tint text-deep border-deep hover:bg-deep hover:text-ivory",
            };
            return (
              <button
                key={bundle.id}
                type="button"
                onClick={() => setActiveIndex(i)}
                className={cn(
                  "inline-flex items-center gap-2.5 px-5 py-3 rounded-full border-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-colors duration-300",
                  isActive ? tabActiveBg[bundle.accent] : tabRestingBg[bundle.accent]
                )}
              >
                <span className="font-display text-sm font-medium tabular-nums">
                  0{i + 1}
                </span>
                <span className="h-3 w-px bg-current opacity-40" />
                <span>{bundle.name.replace("The ", "")}</span>
              </button>
            );
          })}
        </div>

        {/* SPLIT PANEL */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8"
          >
            {/* LEFT — image panel */}
            <div
              className={cn(
                "lg:col-span-6 relative rounded-3xl overflow-hidden border-2",
                accentBorder[active.accent]
              )}
            >
              <div className="relative aspect-[4/5] lg:aspect-auto lg:h-[640px]">
                <Image
                  src={active.image}
                  alt={active.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
                {/* Solid dark slab at bottom for text */}
                <div
                  className="absolute inset-x-0 bottom-0 h-1/2 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(to top, #354F52 0%, #354F52 30%, transparent 100%)",
                  }}
                />

                {/* Step label top-left */}
                <div className="absolute top-6 left-6 right-6 flex items-start justify-between">
                  <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-ivory">
                    <span
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        accentBg[active.accent]
                      )}
                    />
                    <span
                      className={cn(
                        "text-[10px] uppercase tracking-[0.18em] font-medium",
                        accentText[active.accent]
                      )}
                    >
                      {active.step}
                    </span>
                  </div>

                  {/* Savings badge */}
                  <div
                    className={cn(
                      "h-16 w-16 rounded-full flex flex-col items-center justify-center text-ivory shadow-[0_8px_20px_rgba(0,0,0,0.25)]",
                      accentBg[active.accent]
                    )}
                  >
                    <span className="font-display text-lg font-medium leading-none tabular-nums">
                      −{savingsPercent}%
                    </span>
                    <span className="text-[8px] uppercase tracking-[0.12em] mt-0.5">
                      Save
                    </span>
                  </div>
                </div>

                {/* Bundle name at bottom */}
                <div className="absolute inset-x-0 bottom-0 p-6 lg:p-8">
                  <span className="eyebrow text-ivory text-[10px] block mb-3">
                    — Bundle · {bundleProducts.length} products
                  </span>
                  <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-ivory leading-[1.05] tracking-tight">
                    {active.name}
                  </h3>
                </div>
              </div>
            </div>

            {/* RIGHT — bundle contents + pricing */}
            <div className="lg:col-span-6 flex flex-col">
              <div
                className={cn(
                  "relative flex-1 flex flex-col rounded-3xl overflow-hidden border-2",
                  accentBorder[active.accent],
                  accentTint[active.accent]
                )}
              >
                {/* Top palette stripe */}
                <div className="flex h-1 shrink-0">
                  <span className="flex-1 bg-mauve" />
                  <span className="flex-1 bg-sage" />
                  <span className="flex-1 bg-deep" />
                </div>

                <div className="flex-1 flex flex-col p-6 sm:p-8 lg:p-10">
                  {/* Description */}
                  <p className="font-display text-xl sm:text-2xl font-light text-deep leading-snug mb-6 sm:mb-8 italic">
                    &ldquo;{active.description}&rdquo;
                  </p>

                  {/* Included products */}
                  <div className="mb-6">
                    <p className="eyebrow text-deep text-[10px] mb-4">
                      — What's included
                    </p>
                    <ul className="space-y-3">
                      {bundleProducts.map((product, idx) => (
                        <motion.li
                          key={product.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{
                            duration: 0.4,
                            delay: 0.15 + idx * 0.08,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          className="flex items-center gap-4 p-3 rounded-2xl bg-ivory border border-deep/10"
                        >
                          <div className="relative h-14 w-14 shrink-0 rounded-xl overflow-hidden bg-deep-tint">
                            <Image
                              src={product.image}
                              alt={product.name}
                              fill
                              sizes="56px"
                              className="object-cover"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p
                              className={cn(
                                "eyebrow text-[9px] mb-0.5",
                                accentText[active.accent]
                              )}
                            >
                              {product.keyIngredient} · {product.volume}
                            </p>
                            <p className="font-display text-base font-light text-deep leading-tight truncate">
                              {product.name}
                            </p>
                          </div>
                          <div className="shrink-0 flex items-center gap-2">
                            <span className="text-[13px] font-medium text-deep tabular-nums">
                              {formatShopPrice(product.price)}
                            </span>
                            <CheckCircle2
                              className={cn("h-4 w-4", accentText[active.accent])}
                              strokeWidth={2}
                            />
                          </div>
                        </motion.li>
                      ))}
                    </ul>
                  </div>

                  {/* Price block */}
                  <div className="mt-auto pt-6 border-t-2 border-deep/10">
                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                      <div>
                        <div className="flex items-baseline gap-3 mb-1">
                          <span className="text-sm text-deep/60 line-through tabular-nums">
                            {formatShopPrice(active.originalPrice)}
                          </span>
                          <span
                            className={cn(
                              "inline-flex items-center px-2 py-0.5 rounded-full text-ivory text-[9px] uppercase tracking-[0.15em] font-semibold tabular-nums",
                              accentBg[active.accent]
                            )}
                          >
                            Save {formatShopPrice(savings)}
                          </span>
                        </div>
                        <div className="flex items-baseline gap-2">
                          <span
                            className={cn(
                              "font-display text-4xl sm:text-5xl font-light tabular-nums leading-none",
                              accentText[active.accent]
                            )}
                          >
                            {formatShopPrice(active.bundlePrice)}
                          </span>
                          <span className="text-[11px] text-deep uppercase tracking-[0.15em]">
                            Bundle
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={cn(
                          "group inline-flex items-center justify-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full text-ivory font-sans text-[11px] uppercase tracking-[0.22em] transition-colors duration-300",
                          accentBg[active.accent]
                        )}
                      >
                        <ShoppingBag className="h-3.5 w-3.5" strokeWidth={1.75} />
                        <span>Add bundle to cart</span>
                        <span className="h-9 w-9 rounded-full bg-ivory flex items-center justify-center transition-transform duration-500 group-hover:rotate-[22deg]">
                          <ArrowUpRight
                            className={cn("h-3.5 w-3.5", accentText[active.accent])}
                            strokeWidth={1.75}
                          />
                        </span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Trust strip under panel */}
              <div className="mt-4 grid grid-cols-3 gap-2">
                {[
                  { icon: Sparkles, label: "Clinician-curated" },
                  { icon: Gift, label: "Free gift wrap" },
                  { icon: CheckCircle2, label: "30-day returns" },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 rounded-xl bg-ivory border border-deep/10"
                  >
                    <item.icon
                      className={cn("h-4 w-4", accentText[active.accent])}
                      strokeWidth={1.5}
                    />
                    <span className="text-[9px] uppercase tracking-[0.12em] text-deep text-center">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}