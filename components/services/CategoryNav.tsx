"use client";

import { motion, useMotionValueEvent, useScroll } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

import { SERVICE_CATEGORIES } from "@/lib/services-data";
import { cn } from "@/lib/utils";

/**
 * Sticky horizontal nav of service categories.
 * Clicks scroll the page to the category section. Visible category
 * tracks as the user scrolls through sections below.
 */
export function CategoryNav(): React.ReactElement {
  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const [isSticky, setIsSticky] = useState<boolean>(false);
  const [activeId, setActiveId] = useState<string>(SERVICE_CATEGORIES[0]?.id ?? "");
  const [canScrollLeft, setCanScrollLeft] = useState<boolean>(false);
  const [canScrollRight, setCanScrollRight] = useState<boolean>(true);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsSticky(latest > 600);
  });

  // Track which category section is currently in viewport
  useEffect(() => {
    const sections = SERVICE_CATEGORIES
      .map((c) => document.getElementById(c.id))
      .filter((el): el is HTMLElement => el !== null);

    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio ||
              a.boundingClientRect.top - b.boundingClientRect.top
          );
        if (visible[0]) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.2, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return (): void => observer.disconnect();
  }, []);

  // Update scroll arrow states
  const updateScrollButtons = useCallback((): void => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 1);
  }, []);

  // Scroll functions
  const scrollLeft = useCallback((): void => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: -200, behavior: "smooth" });
  }, []);

  const scrollRight = useCallback((): void => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: 200, behavior: "smooth" });
  }, []);

  // Scroll to category section
  const scrollToCategory = useCallback((categoryId: string): void => {
    const element = document.getElementById(categoryId);
    if (!element) return;

    const headerOffset = 120; // Account for sticky nav
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }, []);

  // Update scroll buttons on scroll
  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;

    const handleScroll = (): void => updateScrollButtons();
    el.addEventListener("scroll", handleScroll, { passive: true });
    updateScrollButtons();

    return (): void => el.removeEventListener("scroll", handleScroll);
  }, [updateScrollButtons]);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className={cn(
        "fixed left-0 right-0 top-20 z-40 w-full transition-all duration-500",
        isSticky
          ? "bg-ivory/95 backdrop-blur-xl shadow-glass border-b border-deep/10"
          : "bg-transparent"
      )}
    >
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        <div className="relative flex items-center">
          {/* Left scroll button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            className={cn(
              "absolute left-0 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-glass backdrop-blur-sm transition-all duration-300 hover:shadow-lift",
              canScrollLeft
                ? "text-deep opacity-100"
                : "pointer-events-none text-deep/30 opacity-0"
            )}
            aria-label="Scroll categories left"
          >
            <ChevronLeft className="h-5 w-5" />
          </motion.button>

          {/* Categories scroller */}
          <div
            ref={scrollerRef}
            className="flex w-full gap-2 overflow-x-auto scroll-smooth px-16 py-4 scrollbar-hide"
          >
            {SERVICE_CATEGORIES.map((category) => {
              const Icon = category.icon;
              const isActive = activeId === category.id;

              return (
                <motion.button
                  key={category.id}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => scrollToCategory(category.id)}
                  className={cn(
                    "flex shrink-0 items-center gap-3 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-300 whitespace-nowrap",
                    isActive
                      ? "border-deep bg-deep text-ivory shadow-glow-deep"
                      : "border-deep/20 bg-white/80 text-deep hover:border-deep/40 hover:bg-white hover:shadow-glass"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{category.name}</span>
                </motion.button>
              );
            })}
          </div>

          {/* Right scroll button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={scrollRight}
            disabled={!canScrollRight}
            className={cn(
              "absolute right-0 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/90 shadow-glass backdrop-blur-sm transition-all duration-300 hover:shadow-lift",
              canScrollRight
                ? "text-deep opacity-100"
                : "pointer-events-none text-deep/30 opacity-0"
            )}
            aria-label="Scroll categories right"
          >
            <ChevronRight className="h-5 w-5" />
          </motion.button>
        </div>
      </div>
    </motion.nav>
  );
}