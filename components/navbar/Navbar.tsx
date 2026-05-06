"use client";

import { AnimatePresence, motion } from "framer-motion";
import { CalendarCheck, Menu, ShoppingBag, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import BookAppointmentModal from "@/components/shared/BookAppointmentModal";
import { Logo } from "@/components/ui/Logo";
import { NAV_LINKS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { CartIcon } from "@/components/cart/CartIcon";

export function Navbar(): React.ReactElement {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);
  const [bookingOpen, setBookingOpen] = useState<boolean>(false);

  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 60);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return (): void => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    if (!mobileOpen) return;

    const handleKeyDown = (e: KeyboardEvent): void => {
      if (e.key === "Escape") setMobileOpen(false);
    };

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return (): void => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const openBookingModal = (): void => {
    setMobileOpen(false);
    setBookingOpen(true);
  };

  return (
    <>
      <motion.header
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
        className={cn(
          "fixed inset-x-0 top-0 z-50 w-full transition-all duration-700 ease-cinematic",
          scrolled
            ? "bg-ivory/95 backdrop-blur-md shadow-[0_4px_30px_rgba(71,103,106,0.08)] border-b border-deep/5"
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
              className="group relative z-10 flex shrink-0 items-center gap-3"
              aria-label="Skin Essential Plus — home"
            >
              <Logo variant={scrolled ? "forest" : "light"} size="md" />
              <div className="hidden flex-col leading-none sm:flex">
                <span
                  className={cn(
                    "font-display text-[15px] font-medium uppercase tracking-[0.15em] transition-colors duration-500",
                    scrolled ? "text-deep" : "text-ivory"
                  )}
                >
                  Skin Essential
                </span>
                <span className="mt-1 font-sans text-[9px] uppercase tracking-[0.42em] text-mauve">
                  · Plus ·
                </span>
              </div>
            </a>

            {/* Center menu */}
            <ul className="absolute left-1/2 hidden -translate-x-1/2 items-center gap-1 lg:flex">
              {NAV_LINKS.map((link) => {
                const isActive = pathname === link.href;
                return (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className={cn(
                        "group relative rounded-full px-4 py-2 text-[12px] font-light uppercase tracking-[0.2em] transition-colors duration-500",
                        isActive
                          ? scrolled ? "text-ivory" : "text-deep"
                          : scrolled ? "text-deep hover:text-ivory" : "text-ivory/90 hover:text-deep"
                      )}
                    >
                      {/* Active spotlight */}
                      {isActive && (
                        <motion.span
                          layoutId="nav-spotlight"
                          className={cn(
                            "absolute inset-0 rounded-full",
                            scrolled
                              ? "bg-deep shadow-[0_0_18px_rgba(71,103,106,0.55),inset_0_1px_0_rgba(255,255,255,0.08)]"
                              : "bg-ivory shadow-[0_0_20px_rgba(252,251,252,0.7)]"
                          )}
                          transition={{ type: "spring", stiffness: 400, damping: 32 }}
                          aria-hidden
                        />
                      )}
                      {/* Hover background (only when not active) */}
                      {!isActive && (
                        <span
                          className={cn(
                            "absolute inset-0 scale-90 rounded-full opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100",
                            scrolled ? "bg-deep" : "bg-ivory"
                          )}
                          aria-hidden
                        />
                      )}
                      <span className="relative">{link.label}</span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            {/* Right cluster */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Cart Icon - Desktop & Mobile */}
              <div
                className={cn(
                  "transition-colors duration-500",
                  scrolled ? "text-deep" : "text-ivory"
                )}
              >
                <CartIcon />
              </div>

              <span
                className={cn(
                  "hidden h-6 w-px transition-colors duration-500 md:block",
                  scrolled ? "bg-deep/15" : "bg-ivory/25"
                )}
                aria-hidden
              />

              {/* Book Appointment CTA */}
              <button
                type="button"
                onClick={openBookingModal}
                aria-label="Book Appointment"
                className={cn(
                  "group relative inline-flex items-center gap-2 rounded-full py-1 pl-4 pr-1 font-sans text-[11px] uppercase tracking-[0.22em] transition-all duration-500",
                  "focus:outline-none focus:ring-2 focus:ring-mauve/40 focus:ring-offset-2",
                  scrolled
                    ? "bg-deep text-ivory hover:bg-deep-dark"
                    : "bg-ivory text-deep hover:bg-mauve hover:text-ivory"
                )}
              >
                <span className="relative hidden sm:inline">Book Appointment</span>
                <span className="relative sm:hidden">Book</span>
                <span
                  className={cn(
                    "relative flex h-9 w-9 items-center justify-center rounded-full transition-all duration-500 group-hover:rotate-[22deg] group-hover:scale-105",
                    scrolled
                      ? "bg-mauve text-ivory"
                      : "bg-deep text-ivory group-hover:bg-ivory group-hover:text-deep"
                  )}
                >
                  <CalendarCheck className="h-4 w-4" strokeWidth={1.75} />
                </span>
              </button>

              <button
                type="button"
                onClick={() => setMobileOpen(true)}
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full transition-colors duration-500 lg:hidden",
                  scrolled
                    ? "text-deep hover:bg-deep/5"
                    : "text-ivory hover:bg-ivory/10"
                )}
                aria-label="Open menu"
                aria-expanded={mobileOpen}
                aria-controls="mobile-nav-drawer"
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
              id="mobile-nav-drawer"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
              className="absolute right-0 top-0 h-full w-full overflow-y-auto border-l border-white/50 bg-ivory/95 shadow-[0_20px_50px_rgba(71,103,106,0.25)] backdrop-blur-2xl sm:w-[440px]"
            >
              {/* Palette accent strip */}
              <div className="flex h-1">
                <span className="flex-1 bg-mauve" />
                <span className="flex-1 bg-sage" />
                <span className="flex-1 bg-deep" />
              </div>

              <div className="flex h-20 items-center justify-between border-b border-deep/10 px-6">
                <Logo variant="forest" size="md" />
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-full text-deep transition-all duration-300 hover:bg-deep hover:text-ivory"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <ul className="px-6 py-8">
                {NAV_LINKS.map((link, i) => {
                  const isActive = pathname === link.href;
                  return (
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
                      <Link
                        href={link.href}
                        onClick={() => setMobileOpen(false)}
                        className="group flex items-center justify-between py-5"
                      >
                        <span className={cn(
                          "font-display text-3xl font-light transition-colors group-hover:text-mauve",
                          isActive ? "text-mauve" : "text-deep"
                        )}>
                          {link.label}
                        </span>
                        <span className={cn(
                          "text-[10px] tabular-nums transition-colors",
                          isActive ? "text-deep font-semibold" : "text-mauve"
                        )}>
                          {isActive ? "●" : String(i + 1).padStart(2, "0")}
                        </span>
                      </Link>
                    </motion.li>
                  );
                })}
              </ul>

              <div className="space-y-3 px-6 pb-10">
                <button
                  type="button"
                  onClick={openBookingModal}
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full bg-deep font-sans text-[12px] uppercase tracking-[0.22em] text-ivory transition-colors hover:bg-deep-dark"
                >
                  <CalendarCheck className="h-4 w-4" />
                  Book Appointment
                </button>

                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="inline-flex h-14 w-full items-center justify-center gap-2 rounded-full border border-deep/25 font-sans text-[12px] uppercase tracking-[0.22em] text-deep transition-colors hover:bg-deep hover:text-ivory"
                >
                  <ShoppingBag className="h-4 w-4" />
                  Visit Shop
                </button>
              </div>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <BookAppointmentModal
        isOpen={bookingOpen}
        onClose={() => setBookingOpen(false)}
      />
    </>
  );
}