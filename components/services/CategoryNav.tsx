"use client";

import { motion } from "framer-motion";
import { ChevronRight, Sparkles } from "lucide-react";
import { useEffect, useState } from "react";

import {
  SERVICE_CATEGORIES,
  SERVICES_CATALOG,
} from "@/lib/services-data";
import { cn } from "@/lib/utils";

/**
 * Colorful category navigator.
 * Desktop: vertical sidebar with color-tinted rows and a full-color active state.
 * Mobile: horizontal scroll of colorful category pills.
 */
export function CategoryNav(): React.ReactElement {
  const [activeId, setActiveId] = useState<string>(
    SERVICE_CATEGORIES[0]?.id ?? ""
  );

  useEffect(() => {
    const sections = SERVICE_CATEGORIES.map((c) =>
      document.getElementById(c.id)
    ).filter((el): el is HTMLElement => el !== null);
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
        if (visible[0]) setActiveId(visible[0].target.id);
      },
      { rootMargin: "-20% 0px -60% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    sections.forEach((s) => observer.observe(s));
    return (): void => observer.disconnect();
  }, []);

  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    id: string
  ): void => {
    e.preventDefault();
    const target = document.getElementById(id);
    if (!target) return;
    const top = target.getBoundingClientRect().top + window.scrollY - 100;
    window.scrollTo({ top, behavior: "smooth" });
  };

  const getServiceCount = (catId: string): number =>
    SERVICES_CATALOG.filter((s) => s.categoryId === catId).length;

  return (
    <>
      {/* ===== DESKTOP VERTICAL SIDEBAR — colorful edition ===== */}
      <aside className="hidden lg:block lg:col-span-3">
        <div className="sticky top-24 max-h-[calc(100vh-7rem)]">
          <div className="relative rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(71,103,106,0.15)]">
            {/* Palette accent strip top */}
            <div className="flex h-1.5">
              <span className="flex-1 bg-mauve" />
              <span className="flex-1 bg-sage" />
              <span className="flex-1 bg-deep" />
            </div>

            {/* Header — deep teal with mauve orb */}
            <div className="relative p-5 bg-deep overflow-hidden">
              <div
                className="absolute -top-10 -right-10 h-32 w-32 rounded-full blur-2xl opacity-40 pointer-events-none"
                style={{
                  background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)",
                }}
                aria-hidden
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-3 w-3 text-mauve" strokeWidth={1.75} />
                  <span className="eyebrow text-mauve text-[9px]">
                    — Browse
                  </span>
                </div>
                <h3 className="font-display text-xl font-light text-ivory leading-tight">
                  Our full menu
                </h3>
                <div className="mt-3 flex items-center gap-3 text-[10px] text-ivory/60 uppercase tracking-[0.15em]">
                  <span>
                    <span className="text-ivory font-medium">
                      {SERVICE_CATEGORIES.length}
                    </span>{" "}
                    categories
                  </span>
                  <span className="h-3 w-px bg-ivory/20" aria-hidden />
                  <span>
                    <span className="text-ivory font-medium">
                      {SERVICES_CATALOG.length}
                    </span>{" "}
                    services
                  </span>
                </div>
              </div>
            </div>

            {/* List — each row on a soft palette tint */}
            <nav className="bg-ivory max-h-[calc(100vh-280px)] overflow-y-auto">
              <ul>
                {SERVICE_CATEGORIES.map((cat, i) => {
                  const Icon = cat.icon;
                  const isActive = cat.id === activeId;
                  const count = getServiceCount(cat.id);

                  // Resting tint — soft palette wash on every row
                  const restingTint: Record<typeof cat.color, string> = {
                    mauve: "bg-mauve/[0.08]",
                    sage: "bg-sage/[0.10]",
                    deep: "bg-deep/[0.05]",
                    mixed: "bg-mauve/[0.06]",
                  };

                  // Active — full saturated color
                  const activeBg: Record<typeof cat.color, string> = {
                    mauve: "bg-mauve",
                    sage: "bg-sage",
                    deep: "bg-deep",
                    mixed: "bg-deep",
                  };

                  // Icon tile resting
                  const iconRestBg: Record<typeof cat.color, string> = {
                    mauve: "bg-mauve/20 text-mauve",
                    sage: "bg-sage/25 text-sage",
                    deep: "bg-deep/15 text-deep",
                    mixed: "bg-deep/15 text-deep",
                  };

                  return (
                    <li
                      key={cat.id}
                      className="border-b border-deep/5 last:border-0"
                    >
                      <a
                        href={`#${cat.id}`}
                        onClick={(e) => handleClick(e, cat.id)}
                        className={cn(
                          "relative group flex items-center gap-3 px-4 py-3.5 transition-colors duration-300",
                          isActive
                            ? cn(activeBg[cat.color], "text-ivory")
                            : cn(restingTint[cat.color], "text-deep hover:bg-opacity-[0.15]")
                        )}
                      >
                        {/* Number */}
                        <span
                          className={cn(
                            "font-sans text-[10px] tabular-nums tracking-[0.15em] shrink-0 transition-colors duration-300",
                            isActive ? "text-ivory/70" : "text-deep/40"
                          )}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>

                        {/* Icon tile */}
                        <span
                          className={cn(
                            "shrink-0 h-9 w-9 rounded-xl flex items-center justify-center transition-colors duration-300",
                            isActive
                              ? "bg-ivory/20 text-ivory"
                              : iconRestBg[cat.color]
                          )}
                        >
                          <Icon className="h-4 w-4" strokeWidth={1.5} />
                        </span>

                        {/* Name + count */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={cn(
                              "text-[13px] font-medium leading-tight truncate transition-colors duration-300",
                              isActive ? "text-ivory" : "text-deep"
                            )}
                          >
                            {cat.name}
                          </p>
                          <p
                            className={cn(
                              "text-[10px] font-light mt-0.5 transition-colors duration-300",
                              isActive ? "text-ivory/70" : "text-deep/55"
                            )}
                          >
                            {count} {count === 1 ? "service" : "services"}
                          </p>
                        </div>

                        {/* Active indicator — animated dot */}
                        {isActive ? (
                          <span className="shrink-0 h-2 w-2 rounded-full bg-ivory animate-pulse-soft" />
                        ) : (
                          <ChevronRight
                            className="h-3.5 w-3.5 shrink-0 text-deep/30 group-hover:text-deep/60 transition-colors duration-200"
                            strokeWidth={1.5}
                          />
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Footer — gradient mauve to sage */}
            <div className="relative p-4 bg-gradient-to-r from-mauve to-sage overflow-hidden">
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-ivory animate-pulse-soft" />
                  <span className="text-[10px] uppercase tracking-[0.15em] text-ivory font-medium">
                    All services live
                  </span>
                </div>
                <span className="text-[10px] uppercase tracking-[0.15em] text-ivory/80 tabular-nums">
                  {SERVICES_CATALOG.length} total
                </span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* ===== MOBILE HORIZONTAL PILL SCROLL — colorful ===== */}
      <MobileCategoryScroller activeId={activeId} onClick={handleClick} />
    </>
  );
}

// ──────────────────────────────────────────────────────────────
interface MobileCategoryScrollerProps {
  activeId: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, id: string) => void;
}

function MobileCategoryScroller({
  activeId,
  onClick,
}: MobileCategoryScrollerProps): React.ReactElement {
  const [isSticky, setIsSticky] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => setIsSticky(window.scrollY > 600);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return (): void => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.div
      className={cn(
        "lg:hidden sticky z-40 transition-all duration-300",
        isSticky ? "top-[70px]" : "top-0"
      )}
    >
      <div
        className={cn(
          "bg-ivory transition-shadow duration-300",
          isSticky
            ? "shadow-[0_4px_20px_rgba(71,103,106,0.08)]"
            : "border-b border-deep/10"
        )}
      >
        <div
          className="flex items-center gap-2 overflow-x-auto px-6 sm:px-10 py-3"
          style={{ scrollbarWidth: "none" }}
        >
          {SERVICE_CATEGORIES.map((cat) => {
            const Icon = cat.icon;
            const isActive = cat.id === activeId;

            // Resting palette tint + active full color
            const restingClasses: Record<typeof cat.color, string> = {
              mauve: "bg-mauve/15 border-mauve/30 text-deep",
              sage: "bg-sage/20 border-sage/35 text-deep",
              deep: "bg-deep/10 border-deep/25 text-deep",
              mixed: "bg-mauve/12 border-mauve/30 text-deep",
            };
            const activeClasses: Record<typeof cat.color, string> = {
              mauve: "bg-mauve border-mauve text-ivory",
              sage: "bg-sage border-sage text-ivory",
              deep: "bg-deep border-deep text-ivory",
              mixed: "bg-deep border-deep text-ivory",
            };

            return (
              <a
                key={cat.id}
                href={`#${cat.id}`}
                onClick={(e) => onClick(e, cat.id)}
                className={cn(
                  "shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-full border-2 text-[11px] uppercase tracking-[0.15em] font-medium transition-colors duration-200 whitespace-nowrap",
                  isActive ? activeClasses[cat.color] : restingClasses[cat.color]
                )}
              >
                <Icon className="h-3 w-3" strokeWidth={1.5} />
                <span>{cat.name}</span>
              </a>
            );
          })}
        </div>

        <style jsx>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </div>
    </motion.div>
  );
}