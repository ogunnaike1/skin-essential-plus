"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowDown, ArrowLeft, ArrowRight } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

interface AboutSlide {
  id: number;
  numeral: string;
  eyebrow: string;
  title: React.ReactNode;
  subtitle: string;
  image: string;
}

const ABOUT_SLIDES: readonly AboutSlide[] = [
  {
    id: 1,
    numeral: "01",
    eyebrow: "Chapter One — Our Sanctuary",
    title: (
      <>
        A sanctuary sculpted from{" "}
        <em className="not-italic text-mauve">intention</em>.
      </>
    ),
    subtitle:
      "We don't sell treatments. We compose rituals — each one a dialogue between clinical precision and contemplative stillness.",
    image:
      "https://images.unsplash.com/photo-1591343395082-e120087004b4?w=2400&q=90&auto=format&fit=crop",
  },
  {
    id: 2,
    numeral: "02",
    eyebrow: "Chapter Two — Our Craft",
    title: (
      <>
        Where <em className="not-italic text-sage">science</em> meets the sacred.
      </>
    ),
    subtitle:
      "Every protocol is grounded in peer-reviewed dermatology and delivered through the patience of ritual. One without the other is incomplete.",
    image:
      "https://images.unsplash.com/photo-1512290923902-8a9f81dc236c?w=2400&q=90&auto=format&fit=crop",
  },
  {
    id: 3,
    numeral: "03",
    eyebrow: "Chapter Three — Our Promise",
    title: (
      <>
        Radiance isn't given. It's <em className="not-italic text-mauve">revealed</em>.
      </>
    ),
    subtitle:
      "We're not here to manufacture sameness. We're here to help you recognize what was always yours — to reveal rather than remake.",
    image:
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=2400&q=90&auto=format&fit=crop",
  },
] as const;

const AUTOPLAY_DELAY = 7000;

export function AboutHero(): React.ReactElement {
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

  const activeSlide = ABOUT_SLIDES[selectedIndex] ?? ABOUT_SLIDES[0];
  const totalSlides = ABOUT_SLIDES.length;

  return (
    <section
      id="top"
      className="relative h-screen min-h-[720px] w-full overflow-hidden bg-deep"
      aria-label="About us — featured chapters"
    >
      {/* Image stage */}
      <div ref={emblaRef} className="absolute inset-0 h-full w-full">
        <div className="flex h-full">
          {ABOUT_SLIDES.map((slide, idx) => (
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
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(100deg, rgba(71,103,106,0.82) 0%, rgba(71,103,106,0.55) 35%, rgba(71,103,106,0.25) 62%, transparent 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/60 via-transparent to-transparent" />
            </div>
          ))}
        </div>
      </div>

      {/* Ambient orbs */}
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

      {/* Left meta strip */}
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
          <span className="eyebrow text-ivory/60 text-[10px]">About</span>
          <span className="eyebrow text-mauve text-[10px]">— Skin Essential Plus</span>
        </div>
      </div>

      {/* Content */}
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
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    className="flex items-center gap-3 mb-5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-mauve animate-pulse-soft" />
                    <span className="eyebrow text-mauve text-[10px]">
                      {activeSlide.eyebrow}
                    </span>
                  </motion.div>

                  <motion.h1
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="font-display text-[2.5rem] sm:text-5xl lg:text-6xl font-light leading-[0.98] text-ivory tracking-[-0.02em] text-balance"
                  >
                    {activeSlide.title}
                  </motion.h1>

                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-5 text-sm sm:text-base font-light text-ivory/80 leading-[1.6] max-w-lg text-balance"
                  >
                    {activeSlide.subtitle}
                  </motion.p>

                  {/* Meta strip in glass panel */}
                  <motion.div
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="mt-7 pt-6 border-t border-ivory/15 flex flex-wrap items-center gap-x-8 gap-y-3"
                  >
                    {[
                      { label: "Est. 2018", color: "#C0A9BD" },
                      { label: "Lagos, NG", color: "#94A7AE" },
                      { label: "12K+ clients", color: "#F4F2F3" },
                    ].map((m) => (
                      <div key={m.label} className="flex items-center gap-2">
                        <span
                          className="h-1.5 w-1.5 rounded-full"
                          style={{ backgroundColor: m.color }}
                        />
                        <span className="text-[11px] font-light tracking-wide text-ivory/65 uppercase">
                          {m.label}
                        </span>
                      </div>
                    ))}
                  </motion.div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="absolute bottom-0 inset-x-0 z-20 px-6 sm:px-12 md:pl-28 lg:pl-36 xl:pl-44 lg:pr-16 pb-8">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          {/* Progress bars */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {ABOUT_SLIDES.map((slide, idx) => {
              const isActive = selectedIndex === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => scrollTo(idx)}
                  className="group flex-1 sm:flex-none sm:w-28 lg:w-36 py-3 text-left"
                  aria-label={`Chapter ${idx + 1}`}
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
                        "font-sans text-[10px] tabular-nums tracking-[0.2em] transition-colors duration-500",
                        isActive ? "text-ivory" : "text-ivory/40"
                      )}
                    >
                      {slide.numeral}
                    </span>
                    <span
                      className={cn(
                        "hidden lg:block font-sans text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 truncate max-w-[80px]",
                        isActive ? "text-mauve" : "text-ivory/30"
                      )}
                    >
                      {slide.eyebrow.split("—")[1]?.trim().split(" ")[0] ?? ""}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Arrow controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={scrollPrev}
              className="group h-11 w-11 rounded-full border border-ivory/25 hover:border-ivory flex items-center justify-center transition-all duration-500 hover:bg-ivory/10 backdrop-blur-md"
              aria-label="Previous chapter"
            >
              <ArrowLeft className="h-4 w-4 text-ivory transition-transform duration-500 group-hover:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="group h-11 w-11 rounded-full border border-ivory/25 hover:border-ivory flex items-center justify-center transition-all duration-500 hover:bg-mauve hover:border-mauve backdrop-blur-md"
              aria-label="Next chapter"
            >
              <ArrowRight className="h-4 w-4 text-ivory transition-transform duration-500 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="hidden xl:flex absolute right-10 top-1/2 -translate-y-1/2 flex-col items-center gap-2 text-ivory/60"
          aria-hidden
        >
          <span className="eyebrow text-[10px]">Scroll</span>
          <ArrowDown className="h-4 w-4" />
        </motion.div>
      </div>
    </section>
  );
}