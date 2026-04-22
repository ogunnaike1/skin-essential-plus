"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Pause,
  Play,
} from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { HERO_SLIDES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const AUTOPLAY_DELAY = 6500;

export function HeroCarousel(): React.ReactElement {
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
  const [isPlaying, setIsPlaying] = useState<boolean>(true);
  const [progressKey, setProgressKey] = useState<number>(0);

  const scrollPrev = useCallback((): void => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback((): void => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback(
    (index: number): void => {
      emblaApi?.scrollTo(index);
    },
    [emblaApi]
  );

  const togglePlay = useCallback((): void => {
    const ap = autoplayRef.current;
    if (!ap) return;
    if (isPlaying) {
      ap.stop();
      setIsPlaying(false);
    } else {
      ap.play();
      setIsPlaying(true);
    }
  }, [isPlaying]);

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

  // Keyboard nav
  useEffect(() => {
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === "ArrowLeft") scrollPrev();
      if (e.key === "ArrowRight") scrollNext();
      if (e.key === " " && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        togglePlay();
      }
    };
    window.addEventListener("keydown", handleKey);
    return (): void => window.removeEventListener("keydown", handleKey);
  }, [scrollPrev, scrollNext, togglePlay]);

  const activeSlide = HERO_SLIDES[selectedIndex] ?? HERO_SLIDES[0];
  const totalSlides = HERO_SLIDES.length;

  return (
    <section
      id="top"
      className="relative h-screen min-h-[720px] w-full overflow-hidden bg-deep"
      aria-label="Featured services carousel"
    >
      {/* Embla viewport — image stage */}
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
                  alt={slide.title}
                  fill
                  priority={idx === 0}
                  sizes="100vw"
                  className="object-cover"
                  quality={92}
                />
              </motion.div>
              {/* Soft diagonal wash using palette colors */}
              <div
                className="absolute inset-0"
                style={{
                  background:
                    "linear-gradient(100deg, rgba(71,103,106,0.78) 0%, rgba(71,103,106,0.5) 35%, rgba(71,103,106,0.2) 62%, transparent 100%)",
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/55 via-transparent to-transparent" />
              {/* Grain for texture */}
              <div
                className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
                aria-hidden
              />
            </div>
          ))}
        </div>
      </div>

      {/* Ambient floating glow — palette-tinted orbs */}
      <div
        className="pointer-events-none absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-30 animate-float"
        style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -bottom-48 right-[-8%] h-[600px] w-[600px] rounded-full blur-3xl opacity-25 animate-float"
        style={{
          background: "radial-gradient(circle, #4F7288 0%, transparent 70%)",
          animationDelay: "3s",
        }}
        aria-hidden
      />

      {/* LEFT vertical meta strip — sits flush to the left edge */}
      <div className="hidden md:flex absolute left-6 lg:left-10 top-1/2 -translate-y-1/2 z-20 flex-col items-center gap-6">
        <div className="flex flex-col items-center gap-2">
          <span className="font-display text-5xl font-light text-ivory tabular-nums leading-none">
            {String(selectedIndex + 1).padStart(2, "0")}
          </span>
          <span className="h-12 w-px bg-gradient-to-b from-ivory/60 to-transparent" />
          <span className="font-sans text-xs text-ivory/50 tabular-nums tracking-[0.2em]">
            / {String(totalSlides).padStart(2, "0")}
          </span>
        </div>

        <div className="h-16 w-px bg-ivory/15" />

        <div className="flex items-center gap-2 [writing-mode:vertical-rl] rotate-180">
          <span className="eyebrow text-ivory/60 text-[10px]">
            Skin Essential Plus
          </span>
          <span className="eyebrow text-mauve text-[10px]">— est. 2024</span>
        </div>
      </div>

      {/* CONTENT — editorial layout, full-width */}
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
                {/* Clear glass panel — thinner, crisper, less saturated */}
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
                  {/* Eyebrow with palette dot + category */}
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.6,
                      delay: 0.15,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="flex items-center gap-3 mb-5"
                  >
                    <span className="h-1.5 w-1.5 rounded-full bg-mauve animate-pulse-soft" />
                    <span className="eyebrow text-mauve text-[10px]">
                      {activeSlide.eyebrow}
                    </span>
                  </motion.div>

                  {/* Title */}
                  <motion.h1
                    initial={{ opacity: 0, y: 22 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.9,
                      delay: 0.25,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="font-display text-[2.5rem] sm:text-5xl lg:text-6xl font-light leading-[0.98] text-ivory tracking-[-0.02em]"
                  >
                    {activeSlide.title}
                  </motion.h1>

                  {/* Subtitle */}
                  <motion.p
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.4,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="mt-5 text-sm sm:text-base font-light text-ivory/80 leading-[1.6] max-w-lg text-balance"
                  >
                    {activeSlide.subtitle}
                  </motion.p>

                  {/* CTAs */}
                  <motion.div
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      duration: 0.8,
                      delay: 0.55,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="mt-7 flex flex-wrap items-center gap-3"
                  >
                    <button
                      type="button"
                      className="group relative inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-ivory text-deep font-sans text-[11px] uppercase tracking-[0.22em] shadow-[0_4px_30px_rgba(244,242,243,0.25)] hover:shadow-[0_8px_40px_rgba(192,169,189,0.5)] transition-all duration-500"
                    >
                      <span>{activeSlide.ctaPrimary}</span>
                      <span className="h-9 w-9 rounded-full bg-deep text-ivory flex items-center justify-center transition-all duration-500 group-hover:bg-mauve group-hover:rotate-[22deg]">
                        <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                      </span>
                    </button>
                    <button
                      type="button"
                      className="group inline-flex items-center gap-2 px-5 py-3 rounded-full border border-ivory/30 text-ivory font-sans text-[11px] uppercase tracking-[0.22em] hover:bg-ivory/10 hover:border-ivory/60 transition-all duration-500"
                    >
                      <span>{activeSlide.ctaSecondary}</span>
                      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-0.5" />
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>
      </div>

      {/* BOTTOM BAR — progress indicators + nav controls */}
      <div className="absolute bottom-0 inset-x-0 z-20 px-6 sm:px-12 md:pl-28 lg:pl-36 xl:pl-44 lg:pr-16 pb-8">
        <div className="w-full flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
          {/* Progress-bar indicators */}
          <div className="flex items-center gap-3 sm:gap-4 w-full sm:w-auto">
            {HERO_SLIDES.map((slide, idx) => {
              const isActive = selectedIndex === idx;
              return (
                <button
                  key={slide.id}
                  type="button"
                  onClick={() => scrollTo(idx)}
                  className="group flex-1 sm:flex-none sm:w-28 lg:w-36 py-3 text-left"
                  aria-label={`Slide ${idx + 1}: ${slide.title}`}
                  aria-current={isActive}
                >
                  <div className="relative h-[2px] w-full bg-ivory/20 overflow-hidden rounded-full">
                    {isActive ? (
                      <motion.span
                        key={progressKey}
                        initial={{ width: "0%" }}
                        animate={{ width: isPlaying ? "100%" : "30%" }}
                        transition={{
                          duration: isPlaying ? AUTOPLAY_DELAY / 1000 : 0.4,
                          ease: isPlaying ? "linear" : [0.16, 1, 0.3, 1],
                        }}
                        className="absolute inset-y-0 left-0 bg-ivory rounded-full"
                      />
                    ) : (
                      <span
                        className="absolute inset-y-0 left-0 w-0 bg-ivory/60 rounded-full group-hover:w-1/4 transition-[width] duration-500"
                      />
                    )}
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span
                      className={cn(
                        "font-sans text-[10px] tabular-nums tracking-[0.2em] transition-colors duration-500",
                        isActive ? "text-ivory" : "text-ivory/40"
                      )}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={cn(
                        "hidden lg:block font-sans text-[10px] uppercase tracking-[0.18em] transition-colors duration-500 truncate max-w-[80px]",
                        isActive ? "text-mauve" : "text-ivory/30"
                      )}
                    >
                      {slide.eyebrow.split(" ")[0]}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Nav controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={togglePlay}
              className="group h-11 w-11 rounded-full border border-ivory/25 hover:border-ivory flex items-center justify-center transition-all duration-500 hover:bg-ivory/10 backdrop-blur-md"
              aria-label={isPlaying ? "Pause carousel" : "Play carousel"}
            >
              {isPlaying ? (
                <Pause className="h-3.5 w-3.5 text-ivory" strokeWidth={1.5} />
              ) : (
                <Play className="h-3.5 w-3.5 text-ivory ml-0.5" strokeWidth={1.5} />
              )}
            </button>
            <span className="h-6 w-px bg-ivory/20 mx-1" aria-hidden />
            <button
              type="button"
              onClick={scrollPrev}
              className="group h-11 w-11 rounded-full border border-ivory/25 hover:border-ivory flex items-center justify-center transition-all duration-500 hover:bg-ivory/10 backdrop-blur-md"
              aria-label="Previous slide"
            >
              <ArrowLeft className="h-4 w-4 text-ivory transition-transform duration-500 group-hover:-translate-x-0.5" />
            </button>
            <button
              type="button"
              onClick={scrollNext}
              className="group h-11 w-11 rounded-full border border-ivory/25 hover:border-ivory flex items-center justify-center transition-all duration-500 hover:bg-mauve hover:border-mauve backdrop-blur-md"
              aria-label="Next slide"
            >
              <ArrowRight className="h-4 w-4 text-ivory transition-transform duration-500 group-hover:translate-x-0.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}