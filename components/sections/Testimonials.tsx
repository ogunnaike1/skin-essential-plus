"use client";

import Autoplay from "embla-carousel-autoplay";
import useEmblaCarousel from "embla-carousel-react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Quote, Star } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { TESTIMONIALS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Testimonials(): React.ReactElement {
  const autoplayRef = useRef(
    Autoplay({ delay: 7000, stopOnInteraction: false, stopOnMouseEnter: true })
  );
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center", duration: 35 },
    [autoplayRef.current]
  );
  const [selected, setSelected] = useState<number>(0);

  const prev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const next = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = (): void => setSelected(emblaApi.selectedScrollSnap());
    onSelect();
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
  }, [emblaApi]);

  return (
    <section
      id="testimonials"
      className="relative py-24 sm:py-32 section-padding overflow-hidden"
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(138,111,136,0.15) 0%, transparent 70%)",
        }}
        aria-hidden
      />

      <div className="relative max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Voices of Radiance"
          title="Whispered by those who know."
          description="Unscripted reflections from clients who've walked through our doors — and walked out transformed."
        />

        <div className="mt-16 relative">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex -mx-3">
              {TESTIMONIALS.map((t, idx) => (
                <div
                  key={t.id}
                  className="flex-[0_0_100%] md:flex-[0_0_80%] lg:flex-[0_0_60%] px-3"
                >
                  <motion.div
                    animate={{
                      scale: selected === idx ? 1 : 0.93,
                      opacity: selected === idx ? 1 : 0.55,
                    }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                    className="relative rounded-3xl bg-ivory/50 backdrop-blur-2xl border border-white/60 shadow-glass-lg p-8 sm:p-12"
                  >
                    <div className="noise-overlay rounded-3xl" />
                    <Quote
                      className="absolute top-8 right-8 h-16 w-16 text-mauve/25"
                      strokeWidth={1}
                    />

                    <div className="relative">
                      <div className="flex gap-1 mb-6">
                        {Array.from({ length: t.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-mauve text-mauve"
                            strokeWidth={0}
                          />
                        ))}
                      </div>

                      <p className="font-display text-2xl sm:text-3xl lg:text-4xl font-light text-deep leading-[1.25] tracking-tight text-balance">
                        "{t.quote}"
                      </p>

                      <div className="mt-10 flex items-center gap-4 pt-8 border-t border-deep/10">
                        <div className="relative h-14 w-14 rounded-full overflow-hidden ring-2 ring-white shadow-glass">
                          <Image
                            src={t.image}
                            alt={t.name}
                            fill
                            sizes="56px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <p className="font-sans text-sm font-medium text-deep tracking-wide">
                            {t.name}
                          </p>
                          <p className="eyebrow text-mauve mt-1">{t.role}</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {TESTIMONIALS.map((t, i) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => emblaApi?.scrollTo(i)}
                  className={cn(
                    "h-1.5 rounded-full transition-all duration-500",
                    selected === i ? "w-10 bg-deep" : "w-1.5 bg-deep/25 hover:bg-deep/50"
                  )}
                  aria-label={`View testimonial ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={prev}
                className="group h-12 w-12 rounded-full border border-deep/25 hover:border-deep flex items-center justify-center transition-all duration-500 hover:bg-deep hover:scale-105"
                aria-label="Previous testimonial"
              >
                <ArrowLeft className="h-4 w-4 text-deep group-hover:text-ivory transition-colors" />
              </button>
              <button
                type="button"
                onClick={next}
                className="group h-12 w-12 rounded-full border border-deep/25 hover:border-deep flex items-center justify-center transition-all duration-500 hover:bg-deep hover:scale-105"
                aria-label="Next testimonial"
              >
                <ArrowRight className="h-4 w-4 text-deep group-hover:text-ivory transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
