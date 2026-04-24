"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  Sparkles,
  Star,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { formatShopPrice } from "@/lib/shop-data";
import { cn } from "@/lib/utils";

interface ShopHeroSlide {
  id: number;
  numeral: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  image: string;
  // Teaser product
  productName: string;
  productTagline: string;
  productPrice: number;
  productImage: string;
  ctaPrimary: string;
  ctaSecondary: string;
}

const HERO_SLIDES: readonly ShopHeroSlide[] = [
  {
    id: 1,
    numeral: "01",
    eyebrow: "Signature — The Golden Ritual",
    title: (
      <>
        Liquid{" "}
        <em className="not-italic text-mauve">gold</em>,<br className="hidden sm:block" />
        in a bottle.
      </>
    ),
    subtitle:
      "Our signature 24K gold-infused glow mask — formulated in our Lagos atelier, loved by clients across three continents.",
    image:
      "https://images.unsplash.com/photo-1614859275264-4a9dc8a61e58?w=2400&q=90&auto=format&fit=crop",
    productName: "24K Gold Glow Mask",
    productTagline: "Luminous treatment mask",
    productPrice: 35000,
    productImage:
      "https://images.unsplash.com/photo-1614859275264-4a9dc8a61e58?w=600&q=85&auto=format&fit=crop",
    ctaPrimary: "Shop the mask",
    ctaSecondary: "Browse all",
  },
  {
    id: 2,
    numeral: "02",
    eyebrow: "Best Seller — Radiance Serum",
    title: (
      <>
        The brightening{" "}
        <em className="not-italic text-sage">obsession</em>.
      </>
    ),
    subtitle:
      "15% stabilized Vitamin C. The serum that launched a thousand glow-ups — over 400 reviews and counting.",
    image:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=2400&q=90&auto=format&fit=crop",
    productName: "Radiance Vitamin C Serum",
    productTagline: "Brightening antioxidant · 30ml",
    productPrice: 42000,
    productImage:
      "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=600&q=85&auto=format&fit=crop",
    ctaPrimary: "Shop the serum",
    ctaSecondary: "View routine",
  },
  {
    id: 3,
    numeral: "03",
    eyebrow: "New Arrival — LED Mask",
    title: (
      <>
        Clinical glow,{" "}
        <em className="not-italic text-mauve">at home</em>.
      </>
    ),
    subtitle:
      "Medical-grade 7-mode LED therapy. The only tool you'll need between our in-studio sessions.",
    image:
      "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=2400&q=90&auto=format&fit=crop",
    productName: "LED Light Therapy Mask",
    productTagline: "7-mode treatment device",
    productPrice: 165000,
    productImage:
      "https://images.unsplash.com/photo-1576426863848-c21f53c60b19?w=600&q=85&auto=format&fit=crop",
    ctaPrimary: "Pre-order now",
    ctaSecondary: "Learn more",
  },
  {
    id: 4,
    numeral: "04",
    eyebrow: "Bundle — The Brightening Edit",
    title: (
      <>
        Three steps,{" "}
        <em className="not-italic text-sage">one glow</em>.
      </>
    ),
    subtitle:
      "Serum, niacinamide, and SPF day cream — curated by our clinicians. Save ₦19,000 when bought together.",
    image:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=2400&q=90&auto=format&fit=crop",
    productName: "The Brightening Edit",
    productTagline: "3-product curated bundle",
    productPrice: 89000,
    productImage:
      "https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600&q=85&auto=format&fit=crop",
    ctaPrimary: "Shop the bundle",
    ctaSecondary: "Build your own",
  },
] as const;

const AUTOPLAY_DELAY = 6500;

export function ShopHero(): React.ReactElement {
  const autoplayRef = useRef(
    Autoplay({
      delay: AUTOPLAY_DELAY,
      stopOnInteraction: false,
      stopOnMouseEnter: true,
    })
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 45, align: "start" },
    [autoplayRef.current]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [progressKey, setProgressKey] = useState<number>(0);

  const scrollPrev = useCallback((): void => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback((): void => emblaApi?.scrollNext(), [emblaApi]);
  const scrollTo = useCallback(
    (idx: number): void => emblaApi?.scrollTo(idx),
    [emblaApi]
  );

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = (): void => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setProgressKey((k) => k + 1);
    };
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
    };
    window.addEventListener("keydown", handleKey);
    return (): void => window.removeEventListener("keydown", handleKey);
  }, [scrollPrev, scrollNext]);

  const activeSlide = HERO_SLIDES[selectedIndex] ?? HERO_SLIDES[0];
  const totalSlides = HERO_SLIDES.length;

  return (
    <section
      id="top"
      className="relative h-screen min-h-[720px] w-full overflow-hidden bg-deep"
      aria-label="Shop — featured products"
    >
      {/* Image stage */}
      <div ref={emblaRef} className="absolute inset-0 h-full w-full">
        <div className="flex h-full">
          {HERO_SLIDES.map((slide, idx) => (
            <div
              key={slide.id}
              className="relative flex-[0_0_100%] h-full"
              aria-hidden={selectedIndex !== idx}
            >
              <motion.div
                initial={false}
                animate={
                  selectedIndex === idx
                    ? { scale: 1, opacity: 1 }
                    : { scale: 1.08, opacity: 0.85 }
                }
                transition={{ duration: 8, ease: [0.16, 1, 0.3, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={slide.image}
                  alt=""
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="object-cover"
                  quality={92}
                />
              </motion.div>
              {/* Rich diagonal wash */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(100deg, rgba(71,103,106,0.85) 0%, rgba(71,103,106,0.55) 40%, rgba(71,103,106,0.2) 65%, transparent 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/65 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Palette orbs */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-30 animate-float"
        style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-[-8%] h-[600px] w-[600px] rounded-full blur-3xl opacity-25 animate-float"
        style={{
          background: "radial-gradient(circle, #4F7288 0%, transparent 70%)",
          animationDelay: "3s",
        }}
        aria-hidden
      />

      {/* Left vertical meta strip */}
      <div className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <span className="font-display text-5xl font-light text-ivory tabular-nums leading-none">
            {activeSlide?.numeral ?? "01"}
          </span>
          <span className="h-12 w-px bg-gradient-to-b from-ivory/60 to-transparent" />
          <span className="font-sans text-xs text-ivory/85 tabular-nums tracking-[0.2em]">
            / {String(totalSlides).padStart(2, "0")}
          </span>
        </div>
        <div className="h-16 w-px bg-ivory/15" />
        <div className="flex items-center gap-2 [writing-mode:vertical-rl] rotate-180">
          <span className="eyebrow text-ivory/90 text-[10px]">The Boutique</span>
          <span className="eyebrow text-ivory text-[10px]">— Skin Essential +</span>
        </div>
      </div>

      {/* Content — glass panel + product teaser side-by-side */}
      <div className="relative z-10 h-full flex items-center px-6 sm:px-12 md:pl-28 lg:pl-36 xl:pl-44 lg:pr-16 pt-24 pb-36">
        <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          <AnimatePresence mode="wait">
            {activeSlide ? (
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-7 xl:col-span-7"
              >
                {/* Glass content panel */}
                <div
                  className="relative rounded-[1.75rem] p-7 sm:p-9 lg:p-10 border overflow-hidden"
                  style={{
                    background: "rgba(252, 251, 252, 0.08)",
                    backdropFilter: "blur(18px) saturate(130%)",
                    WebkitBackdropFilter: "blur(18px) saturate(130%)",
                    borderColor: "rgba(252, 251, 252, 0.22)",
                    boxShadow:
                      "0 20px 50px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 mb-5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-mauve animate-pulse-soft" />
                    <span className="eyebrow text-ivory text-[10px]">
                      {activeSlide.eyebrow}
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-[2.75rem] sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-[0.98] text-ivory tracking-[-0.02em] text-balance"
                  >
                    {activeSlide.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-5 text-sm sm:text-base font-light text-ivory leading-[1.6] max-w-lg text-balance"
                  >
                    {activeSlide.subtitle}
                  </motion.p>

                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-7 flex flex-wrap items-center gap-3"
                  >
                    <button
                      type="button"
                      className="group inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-ivory text-deep font-sans text-[11px] uppercase tracking-[0.22em] shadow-[0_4px_30px_rgba(252,251,252,0.25)] hover:bg-mauve hover:text-ivory transition-colors duration-300"
                    >
                      <ShoppingBag className="h-3.5 w-3.5" />
                      <span>{activeSlide.ctaPrimary}</span>
                      <span className="h-9 w-9 rounded-full bg-deep text-ivory flex items-center justify-center group-hover:bg-ivory group-hover:text-mauve transition-colors duration-300">
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </span>
                    </button>
                    <a
                      href="#products-grid"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-ivory/30 text-ivory font-sans text-[11px] uppercase tracking-[0.22em] hover:bg-ivory/10 hover:border-ivory/60 transition-colors duration-300"
                    >
                      <span>{activeSlide.ctaSecondary}</span>
                    </a>
                  </motion.div>

                  {/* Luxury trust line */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-8 pt-6 border-t border-ivory/15 flex flex-wrap items-center gap-x-6 gap-y-2"
                  >
                    {[
                      { label: "Formulated in Lagos", color: "#8A6F88" },
                      { label: "Cruelty-free", color: "#4F7288" },
                      { label: "Free ₦50K+ shipping", color: "#FCFBFC" },
                    ].map((item) => (
                      <div key={item.label} className="flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: item.color }}
                        />
                        <span className="text-[11px] font-light text-ivory uppercase tracking-[0.15em]">
                          {item.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>

          {/* Product teaser card — sits beside the main panel */}
          <AnimatePresence mode="wait">
            {activeSlide ? (
              <motion.div
                key={`product-${activeSlide.id}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                className="hidden lg:block lg:col-span-5 xl:col-span-4 xl:col-start-9"
              >
                <div
                  className="relative rounded-[1.75rem] overflow-hidden border shadow-[0_30px_70px_rgba(0,0,0,0.3)]"
                  style={{
                    background:
                      "linear-gradient(145deg, rgba(252,251,252,0.95) 0%, rgba(252,251,252,0.98) 100%)",
                    borderColor: "rgba(252,251,252,0.3)",
                  }}
                >
                  {/* Product image */}
                  <div className="relative aspect-square overflow-hidden">
                    <Image
                      src={activeSlide.productImage}
                      alt={activeSlide.productName}
                      fill
                      sizes="(max-width: 1024px) 0, 400px"
                      className="object-cover"
                    />
                    {/* Top-right floating badge */}
                    <span className="absolute top-4 right-4 inline-flex items-center gap-1 px-3 py-1 rounded-full bg-mauve text-ivory text-[9px] uppercase tracking-[0.18em] font-medium shadow-md">
                      <Sparkles className="h-3 w-3" strokeWidth={1.75} />
                      Featured
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 bg-ivory">
                    {/* Rating */}
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                          key={i}
                          className="h-3 w-3 fill-mauve text-mauve"
                          strokeWidth={0}
                        />
                      ))}
                      <span className="ml-1.5 text-[10px] uppercase tracking-[0.15em] text-deep">
                        Hand-picked
                      </span>
                    </div>
                    <p className="eyebrow text-mauve text-[10px] mb-1">
                      {activeSlide.productTagline}
                    </p>
                    <h3 className="font-display text-2xl font-light text-deep leading-tight tracking-tight mb-3">
                      {activeSlide.productName}
                    </h3>

                    <div className="flex items-baseline justify-between pt-3 border-t border-deep/10">
                      <div>
                        <p className="eyebrow text-deep text-[9px] mb-0.5">
                          Price
                        </p>
                        <p className="font-display text-2xl font-light text-mauve tabular-nums">
                          {formatShopPrice(activeSlide.productPrice)}
                        </p>
                      </div>
                      <button
                        type="button"
                        className="h-10 w-10 rounded-full bg-deep text-ivory flex items-center justify-center hover:bg-mauve transition-colors duration-300"
                        aria-label="Add to cart"
                      >
                        <ShoppingBag className="h-4 w-4" strokeWidth={1.75} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 inset-x-0 z-20 px-6 sm:px-12 md:pl-28 lg:pl-36 xl:pl-44 lg:pr-16 pb-8">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = selectedIndex === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => scrollTo(idx)}
                  className="group flex-1 sm:flex-none sm:w-28 lg:w-36 py-3 text-left"
                  aria-label={`Slide ${idx + 1}`}
                  aria-current={isActive}
                >
                  <div className="relative h-[2px] w-full bg-ivory/20 overflow-hidden rounded-full">
                    {isActive ? (
                      <motion.span
                        key={progressKey}
                        initial={{ width: "0%" }}
                        animate={{ width: "100%" }}
                        transition={{
                          duration: AUTOPLAY_DELAY / 1000,
                          ease: "linear",
                        }}
                        className="absolute inset-y-0 left-0 bg-ivory rounded-full"
                      />
                    ) : (
                      <span className="absolute inset-y-0 left-0 w-0 bg-ivory/60 rounded-full group-hover:w-1/4 transition-[width] duration-500" />
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={cn(
                        "font-sans text-[10px] tabular-nums tracking-[0.2em] transition-colors duration-300",
                        isActive ? "text-ivory" : "text-ivory"
                      )}
                    >
                      {slide.numeral}
                    </span>
                    <span
                      className={cn(
                        "hidden lg:block font-sans text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 truncate max-w-[90px]",
                        isActive ? "text-mauve" : "text-ivory/30"
                      )}
                    >
                      {slide.eyebrow.split("—")[1]?.trim().split(" ").slice(0, 2).join(" ") ?? ""}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollPrev}
              className="group h-11 w-11 rounded-full border border-ivory/25 hover:border-ivory flex items-center justify-center transition-colors duration-300 hover:bg-ivory/10"
              aria-label="Previous"
            >
              <ArrowLeft className="h-4 w-4 text-ivory" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="group h-11 w-11 rounded-full border border-ivory/25 hover:border-mauve hover:bg-mauve flex items-center justify-center transition-colors duration-300"
              aria-label="Next"
            >
              <ArrowRight className="h-4 w-4 text-ivory" strokeWidth={1.5} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}