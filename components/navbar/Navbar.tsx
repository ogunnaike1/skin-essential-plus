"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Menu, ShoppingBag, X } from "lucide-react";
import { useEffect, useState } from "react";

import { Logo } from "@/components/ui/Logo";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";

export function Navbar(): React.ReactElement {
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 60);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return (): void => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return (): void => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <>
      {/* Full-width navbar — transparent over hero, solid ivory on scroll */}
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className={cn(
          "fixed top-0 inset-x-0 z-50 w-full transition-all duration-700 ease-cinematic",
          scrolled
            ? "bg-ivory shadow-[0_4px_30px_rgba(71,103,106,0.08)]"
            : "bg-transparent"
        )}
      >
        <nav
          aria-label="Primary navigation"
          className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14"
        >
          <div
            className={cn(
              "flex items-center justify-between gap-4 transition-all duration-500",
              scrolled ? "h-[70px]" : "h-[84px]"
            )}
          >
            {/* Logo */}
            <a
              href="#top"
              className="group relative z-10 flex items-center gap-3 shrink-0"
              aria-label="Skin Essential Plus — home"
            >
              <Logo variant={scrolled ? "forest" : "light"} size="md" />
              <div className="hidden sm:flex flex-col leading-none">
                <span
                  className={cn(
                    "font-display text-[15px] font-medium tracking-[0.15em] uppercase transition-colors duration-500",
                    scrolled ? "text-deep" : "text-ivory"
                  )}
                >
                  Skin Essential
                </span>
                <span className="font-sans text-[9px] tracking-[0.42em] uppercase mt-1 text-mauve">
                  · Plus ·
                </span>
              </div>
            </a>

            {/* Center menu */}
            <ul className="hidden lg:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
              {NAV_LINKS.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    className={cn(
                      "group relative px-4 py-2 rounded-full text-[12px] uppercase tracking-[0.2em] font-light transition-all duration-500",
                      scrolled
                        ? "text-deep hover:text-ivory"
                        : "text-ivory/90 hover:text-deep"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute inset-0 rounded-full transition-all duration-500 scale-90 opacity-0 group-hover:scale-100 group-hover:opacity-100",
                        scrolled ? "bg-deep" : "bg-ivory"
                      )}
                      aria-hidden
                    />
                    <span className="relative">{link.label}</span>
                  </a>
                </li>
              ))}
            </ul>

            {/* Right cluster */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Shop bag icon button */}
              <button
                type="button"
                aria-label="Shop"
                className={cn(
                  "hidden md:inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-500",
                  scrolled
                    ? "border-deep/20 text-deep hover:bg-deep hover:text-ivory hover:border-deep"
                    : "border-ivory/40 text-ivory hover:bg-ivory hover:text-deep hover:border-ivory"
                )}
              >
                <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              </button>

              {/* Divider */}
              <span
                className={cn(
                  "hidden md:block h-6 w-px transition-colors duration-500",
                  scrolled ? "bg-deep/15" : "bg-ivory/25"
                )}
                aria-hidden
              />

              {/* Book Appointment CTA — split pill */}
              <button
                type="button"
                className={cn(
                  "group relative inline-flex items-center gap-2 pl-4 pr-1 py-1 rounded-full font-sans text-[11px] uppercase tracking-[0.22em] transition-all duration-500",
                  scrolled
                    ? "bg-deep text-ivory hover:bg-deep-dark"
                    : "bg-ivory text-deep hover:bg-mauve hover:text-ivory"
                )}
              >
                <span className="relative hidden sm:inline">
                  Book Appointment
                </span>
                <span className="relative sm:hidden">Book</span>
                <span
                  className={cn(
                    "relative h-9 w-9 rounded-full flex items-center justify-center transition-all duration-500 group-hover:rotate-[22deg]",
                    scrolled
                      ? "bg-mauve text-ivory"
                      : "bg-deep text-ivory group-hover:bg-ivory group-hover:text-deep"
                  )}
                >
                  <CalendarCheck className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </button>

              {/* Mobile menu toggle */}
              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className={cn(
                  "lg:hidden h-10 w-10 -mr-1 rounded-full flex items-center justify-center transition-colors duration-500",
                  scrolled
                    ? "text-deep hover:bg-deep/5"
                    : "text-ivory hover:bg-ivory/10"
                )}
                aria-label="Open menu"
              >
                <Menu className="h-5 w-5" strokeWidth={1.5} />
              </button>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[60] lg:hidden"
          >
            <div
              className="absolute inset-0 bg-deep/50 backdrop-blur-xl"
              onClick={() => setMobileOpen(false)}
              aria-hidden
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute top-0 right-0 h-full w-full sm:w-[440px] bg-ivory/95 backdrop-blur-2xl shadow-[0_20px_50px_rgba(71,103,106,0.25)] border-l border-white/50 overflow-y-auto"
            >
              {/* Palette accent strip */}
              <div className="flex h-1">
                <span className="flex-1 bg-mauve" />
                <span className="flex-1 bg-sage" />
                <span className="flex-1 bg-deep" />
              </div>

              <div className="flex items-center justify-between h-20 px-6 border-b border-deep/10">
                <Logo variant="forest" size="md" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="h-10 w-10 rounded-full flex items-center justify-center text-deep hover:bg-deep hover:text-ivory transition-all duration-300"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="px-6 py-8">
                {NAV_LINKS.map((link, i) => (
                  <motion.li
                    key={link.href}
                    initial={{ opacity: 0, x: 24 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.5,
                      delay: 0.12 + i * 0.06,
                      ease: [0.16, 1, 0.3, 1],
                    }}
                    className="border-b border-deep/10 last:border-0"
                  >
                    <a
                      href={link.href}
                      onClick={() => setMobileOpen(false)}
                      className="group flex items-center justify-between py-5"
                    >
                      <span className="font-display text-3xl font-light text-deep group-hover:text-mauve transition-colors">
                        {link.label}
                      </span>
                      <span className="eyebrow text-mauve text-[10px] tabular-nums">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                    </a>
                  </motion.li>
                ))}
              </ul>

              <div className="px-6 pb-10 space-y-3">
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 h-14 bg-deep text-ivory rounded-full font-sans text-[12px] uppercase tracking-[0.22em] hover:bg-deep-dark transition-colors"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Book Appointment
                </button>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="w-full inline-flex items-center justify-center gap-2 h-14 border border-deep/25 text-deep rounded-full font-sans text-[12px] uppercase tracking-[0.22em] hover:bg-deep hover:text-ivory transition-colors"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Visit Shop
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  );
}