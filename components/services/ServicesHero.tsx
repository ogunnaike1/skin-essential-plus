"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  CalendarCheck,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface HeroSlide {
  id: number;
  numeral: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  image: string;
  tag: string;
  priceFrom: string;
  href: string;
}

const HERO_SLIDES: readonly HeroSlide[] = [
  {
    id: 1,
    numeral: "01",
    eyebrow: "Signature — Skin Treatment",
    title: (
      <>
        Skin,{" "}
        <em className="not-italic text-mauve">rewritten</em>.
      </>
    ),
    subtitle:
      "Clinical protocols calibrated to your skin's unique signature — from brightening and acne clarity to regenerative PRP therapy.",
    image:
      "https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=2400&q=90&auto=format&fit=crop",
    tag: "Clinical",
    priceFrom: "from ₦75,000",
    href: "#skin-treatment",
  },
  {
    id: 2,
    numeral: "02",
    eyebrow: "Ritual — Spa Therapy",
    title: (
      <>
        Stillness,{" "}
        <em className="not-italic text-sage">practiced</em>.
      </>
    ),
    subtitle:
      "Swedish, deep tissue, aromatherapy, and body contouring — rituals designed to restore equilibrium.",
    image:
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=2400&q=90&auto=format&fit=crop",
    tag: "Therapy",
    priceFrom: "from ₦45,000",
    href: "#massage",
  },
  {
    id: 3,
    numeral: "03",
    eyebrow: "Artistry — Lash & Brow",
    title: (
      <>
        Expression,{" "}
        <em className="not-italic text-mauve">elevated</em>.
      </>
    ),
    subtitle:
      "Hand-crafted lash extensions, Russian volume sets, and semi-permanent brows — drawn with intention.",
    image:
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?w=2400&q=90&auto=format&fit=crop",
    tag: "Artistry",
    priceFrom: "from ₦22,000",
    href: "#lash-extension",
  },
  {
    id: 4,
    numeral: "04",
    eyebrow: "Wellness — IV & Clinical",
    title: (
      <>
        Luminosity,{" "}
        <em className="not-italic text-sage">infused</em>.
      </>
    ),
    subtitle:
      "Vitamin drips, glutathione therapy, tattoo removal, and clinical treatments administered by Dr. Amaka's team.",
    image:
      "https://images.unsplash.com/photo-1519751138087-5bf79df62d5b?w=2400&q=90&auto=format&fit=crop",
    tag: "Clinical",
    priceFrom: "from ₦65,000",
    href: "#iv-drips",
  },
] as const;

const AUTOPLAY_DELAY = 6500;

export function ServicesHero(): React.ReactElement {
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
      className="relative h-screen min-h-[700px] w-full overflow-hidden bg-deep"
      aria-label="Services"
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

              {/* Overlay — diagonal deep teal wash */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(100deg, rgba(71,103,106,0.82) 0%, rgba(71,103,106,0.55) 38%, rgba(71,103,106,0.2) 65%, transparent 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/60 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Ambient palette orbs */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-30 animate-float"
        style={{ background: "radial-gradient(circle, #C0A9BD 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-40 right-[-8%] h-[600px] w-[600px] rounded-full blur-3xl opacity-25 animate-float"
        style={{
          background: "radial-gradient(circle, #94A7AE 0%, transparent 70%)",
          animationDelay: "3s",
        }}
        aria-hidden
      />

      {/* Vertical meta strip — left edge */}
      <div className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <span className="font-display text-5xl font-light text-ivory tabular-nums leading-none">
            {activeSlide?.numeral ?? "01"}
          </span>
          <span className="h-12 w-px bg-gradient-to-b from-ivory/60 to-transparent" />
          <span className="font-sans text-xs text-ivory/50 tabular-nums tracking-[0.2em]">
            / {String(totalSlides).padStart(2, "0")}
          </span>
        </div>
        <div className="h-16 w-px bg-ivory/15" />
        <div className="flex items-center gap-2 [writing-mode:vertical-rl] rotate-180">
          <span className="eyebrow text-ivory/60 text-[10px]">Services</span>
          <span className="eyebrow text-mauve text-[10px]">— Signature Menu</span>
        </div>
      </div>

      {/* Content — glass panel */}
      <div className="relative z-10 h-full flex items-center px-6 sm:px-12 md:pl-28 lg:pl-36 xl:pl-44 lg:pr-16 pt-24 pb-36">
        <div className="w-full">
          <AnimatePresence mode="wait">
            {activeSlide ? (
              <motion.div
                key={activeSlide.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="max-w-xl lg:max-w-2xl"
              >
                {/* Clean glass panel */}
                <div
                  className="relative rounded-[1.75rem] p-7 sm:p-9 lg:p-10 border overflow-hidden"
                  style={{
                    background: "rgba(244, 242, 243, 0.08)",
                    backdropFilter: "blur(18px) saturate(130%)",
                    WebkitBackdropFilter: "blur(18px) saturate(130%)",
                    borderColor: "rgba(244, 242, 243, 0.22)",
                    boxShadow:
                      "0 20px 50px rgba(0,0,0,0.12), inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  {/* Eyebrow + price */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center justify-between gap-3 mb-5"
                  >
                    <div className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-mauve animate-pulse-soft" />
                      <span className="eyebrow text-mauve text-[10px]">
                        {activeSlide.eyebrow}
                      </span>
                    </div>
                    <span className="inline-flex px-3 py-1 rounded-full bg-ivory text-deep text-[10px] uppercase tracking-[0.18em] font-medium">
                      {activeSlide.priceFrom}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-[2.5rem] sm:text-5xl lg:text-6xl xl:text-7xl font-light leading-[0.98] text-ivory tracking-[-0.02em] text-balance"
                  >
                    {activeSlide.title}
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-5 text-sm sm:text-base font-light text-ivory/80 leading-[1.6] max-w-lg text-balance"
                  >
                    {activeSlide.subtitle}
                  </motion.p>

                  {/* CTAs */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-7 flex flex-wrap items-center gap-3"
                  >
                    <a
                      href={activeSlide.href}
                      className="group inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-ivory text-deep font-sans text-[11px] uppercase tracking-[0.22em] shadow-[0_4px_30px_rgba(244,242,243,0.25)] hover:bg-mauve hover:text-ivory transition-colors duration-300"
                    >
                      <span>View {activeSlide.tag.toLowerCase()} services</span>
                      <span className="h-9 w-9 rounded-full bg-deep text-ivory flex items-center justify-center group-hover:bg-ivory group-hover:text-mauve transition-colors duration-300">
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </span>
                    </a>
                    <a
                      href="#services-grid"
                      className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-ivory/30 text-ivory font-sans text-[11px] uppercase tracking-[0.22em] hover:bg-ivory/10 hover:border-ivory/60 transition-colors duration-300"
                    >
                      <Search className="h-3.5 w-3.5" />
                      <span>Browse all</span>
                    </a>
                    <a
                      href="#consultation"
                      className="hidden sm:inline-flex items-center gap-2 px-5 py-3 rounded-full text-ivory/90 font-sans text-[11px] uppercase tracking-[0.22em] hover:text-mauve transition-colors duration-300"
                    >
                      <CalendarCheck className="h-3.5 w-3.5" />
                      <span>Free consultation</span>
                    </a>
                  </motion.div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar — progress indicators + nav controls */}
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
                        isActive ? "text-ivory" : "text-ivory/40"
                      )}
                    >
                      {slide.numeral}
                    </span>
                    <span
                      className={cn(
                        "hidden lg:block font-sans text-[10px] uppercase tracking-[0.18em] transition-colors duration-300 truncate max-w-[80px]",
                        isActive ? "text-mauve" : "text-ivory/30"
                      )}
                    >
                      {slide.tag}
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
              <ArrowLeft className="h-4 w-4 text-ivory transition-transform duration-300 group-hover:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="group h-11 w-11 rounded-full border border-ivory/25 hover:border-mauve hover:bg-mauve flex items-center justify-center transition-colors duration-300"
              aria-label="Next"
            >
              <ArrowRight className="h-4 w-4 text-ivory transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}