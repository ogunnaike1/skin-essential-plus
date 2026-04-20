"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  CalendarCheck,
  Clock,
  MapPin,
  Star,
  UserCheck,
  X,
} from "lucide-react";
import Image from "next/image";
import { useEffect } from "react";

import {
  formatDuration,
  formatPrice,
  getEmployeesForService,
} from "@/lib/services-data";
import { cn } from "@/lib/utils";
import type { Employee, ServiceItem } from "@/types";

interface EmployeeModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onBook: (service: ServiceItem) => void;
}

export function EmployeeModal({
  service,
  onClose,
  onBook,
}: EmployeeModalProps): React.ReactElement {
  // Lock body scroll + close on Escape
  useEffect(() => {
    if (!service) return;

    document.body.style.overflow = "hidden";
    const handleKey = (e: KeyboardEvent): void => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKey);

    return (): void => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKey);
    };
  }, [service, onClose]);

  const employees = service ? getEmployeesForService(service) : [];

  return (
    <AnimatePresence>
      {service ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center"
          role="dialog"
          aria-modal="true"
          aria-label={`Available therapists for ${service.name}`}
        >
          {/* Backdrop */}
          <motion.div
            className="absolute inset-0 bg-deep/60 backdrop-blur-xl"
            onClick={onClose}
            aria-hidden
          />

          {/* Panel */}
          <motion.div
            initial={{ y: 40, opacity: 0, scale: 0.98 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: 20, opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full sm:max-w-3xl max-h-[92vh] flex flex-col overflow-hidden rounded-t-[2rem] sm:rounded-[2rem] bg-ivory shadow-[0_40px_100px_rgba(71,103,106,0.35)] border border-white/50 mx-0 sm:mx-6"
          >
            {/* Palette accent strip */}
            <div className="flex h-1 shrink-0">
              <span className="flex-1 bg-mauve" />
              <span className="flex-1 bg-sage" />
              <span className="flex-1 bg-deep" />
            </div>

            {/* Header */}
            <div className="relative shrink-0 p-6 sm:p-8 border-b border-deep/10 bg-gradient-to-br from-ivory to-mauve/10">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close"
                className="absolute top-4 right-4 sm:top-6 sm:right-6 h-10 w-10 rounded-full bg-ivory border border-deep/15 hover:bg-deep hover:text-ivory hover:border-deep flex items-center justify-center text-deep transition-all duration-300"
              >
                <X className="h-4 w-4" strokeWidth={1.5} />
              </button>

              <span className="eyebrow text-mauve text-[10px] block mb-2">
                — {service.tag} · Choose your therapist
              </span>
              <h2 className="font-display text-2xl sm:text-3xl font-light text-deep leading-tight tracking-tight pr-12">
                {service.name}
              </h2>

              {/* Service quick meta */}
              <div className="mt-4 flex flex-wrap items-center gap-4 gap-y-2 text-[13px] text-deep/70 font-light">
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5 text-deep/50" strokeWidth={1.5} />
                  {formatDuration(service.durationMinutes)}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-3.5 w-3.5 text-deep/50" strokeWidth={1.5} />
                  {service.location}
                </span>
                <span className="inline-flex items-center gap-1.5 ml-auto font-display text-lg font-light text-mauve">
                  {formatPrice(service.price)}
                </span>
              </div>
            </div>

            {/* Body — scrollable employee list */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {employees.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-deep/60 font-light">
                    No therapists are currently assigned to this service.
                  </p>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2 mb-5 sm:mb-6">
                    <UserCheck className="h-4 w-4 text-mauve" strokeWidth={1.5} />
                    <span className="eyebrow text-deep/60 text-[10px]">
                      {employees.length} available therapist{employees.length > 1 ? "s" : ""}
                    </span>
                  </div>

                  <div className="space-y-4">
                    {employees.map((emp, i) => (
                      <EmployeeRow
                        key={emp.id}
                        employee={emp}
                        index={i}
                        onBook={() => onBook(service)}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Footer — any-therapist option */}
            <div className="shrink-0 p-6 sm:p-8 border-t border-deep/10 bg-gradient-to-br from-ivory to-sage/10">
              <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <p className="text-sm font-light text-deep/70">
                    Happy with any available therapist?
                  </p>
                  <p className="eyebrow text-sage text-[10px] mt-1">
                    We'll match you with the next available slot
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => onBook(service)}
                  className="group inline-flex items-center justify-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-deep text-ivory font-sans text-[11px] uppercase tracking-[0.22em] hover:bg-deep-dark transition-all duration-500"
                >
                  <span>Book any therapist</span>
                  <span className="h-9 w-9 rounded-full bg-mauve flex items-center justify-center transition-transform duration-500 group-hover:rotate-[22deg]">
                    <CalendarCheck className="h-3.5 w-3.5 text-ivory" strokeWidth={1.75} />
                  </span>
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

// ──────────────────────────────────────────────────────────────
interface EmployeeRowProps {
  employee: Employee;
  index: number;
  onBook: () => void;
}

const ROW_ACCENTS = ["mauve", "sage", "deep"] as const;

function EmployeeRow({
  employee,
  index,
  onBook,
}: EmployeeRowProps): React.ReactElement {
  const accent = ROW_ACCENTS[index % ROW_ACCENTS.length]!;

  const accentBg: Record<typeof accent, string> = {
    mauve: "bg-mauve",
    sage: "bg-sage",
    deep: "bg-deep",
  };
  const accentText: Record<typeof accent, string> = {
    mauve: "text-mauve",
    sage: "text-sage",
    deep: "text-deep",
  };
  const accentBorderHover: Record<typeof accent, string> = {
    mauve: "hover:border-mauve",
    sage: "hover:border-sage",
    deep: "hover:border-deep",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={cn(
        "group relative flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-4 sm:p-5 rounded-2xl bg-ivory border border-deep/10 transition-all duration-400 hover:shadow-[0_10px_30px_rgba(71,103,106,0.12)]",
        accentBorderHover[accent]
      )}
    >
      {/* Avatar */}
      <div className="relative shrink-0">
        <div className="relative h-16 w-16 rounded-full overflow-hidden ring-4 ring-ivory shadow-[0_4px_12px_rgba(71,103,106,0.15)]">
          <Image
            src={employee.avatar}
            alt={employee.name}
            fill
            sizes="64px"
            className="object-cover"
          />
        </div>
        <span
          className={cn(
            "absolute -bottom-1 -right-1 h-5 w-5 rounded-full ring-2 ring-ivory flex items-center justify-center",
            accentBg[accent]
          )}
        >
          <span className="h-1.5 w-1.5 rounded-full bg-ivory animate-pulse-soft" />
        </span>
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-display text-lg font-light text-deep leading-tight tracking-tight">
            {employee.name}
          </h4>
          <span className="inline-flex items-center gap-0.5 text-xs text-deep/60 tabular-nums">
            <Star className="h-3 w-3 fill-mauve text-mauve" strokeWidth={0} />
            {employee.rating.toFixed(1)}
          </span>
        </div>
        <p className={cn("eyebrow text-[10px] mb-2", accentText[accent])}>
          {employee.role}
        </p>

        {/* Specialties */}
        <div className="flex flex-wrap items-center gap-1.5 mb-2">
          {employee.specialties.map((sp) => (
            <span
              key={sp}
              className="text-[10px] px-2 py-0.5 rounded-full bg-deep/5 text-deep/70 font-light border border-deep/10"
            >
              {sp}
            </span>
          ))}
        </div>

        {/* Next available */}
        <div className="flex items-center gap-1.5 text-xs text-deep/65 font-light">
          <span
            className={cn("h-1.5 w-1.5 rounded-full", accentBg[accent])}
          />
          <span>Next available: </span>
          <span className="font-medium text-deep">{employee.nextAvailable}</span>
        </div>
      </div>

      {/* CTA */}
      <button
        type="button"
        onClick={onBook}
        className={cn(
          "shrink-0 inline-flex items-center gap-2 pl-4 pr-1 py-1 rounded-full text-[10px] uppercase tracking-[0.2em] transition-all duration-400 border-2 whitespace-nowrap",
          "bg-ivory text-deep border-deep/15 group-hover:text-ivory",
          accent === "mauve" &&
            "group-hover:bg-mauve group-hover:border-mauve",
          accent === "sage" &&
            "group-hover:bg-sage group-hover:border-sage",
          accent === "deep" &&
            "group-hover:bg-deep group-hover:border-deep"
        )}
      >
        <span className="hidden sm:inline">Book with</span>
        <span className="sm:hidden">Book</span>
        <span className="hidden sm:inline">{employee.name.split(" ")[0]}</span>
        <span
          className={cn(
            "h-7 w-7 rounded-full flex items-center justify-center transition-all duration-400",
            accentBg[accent],
            "text-ivory group-hover:bg-ivory",
            accent === "mauve" && "group-hover:text-mauve",
            accent === "sage" && "group-hover:text-sage",
            accent === "deep" && "group-hover:text-deep"
          )}
        >
          <ArrowRight className="h-3 w-3" strokeWidth={1.75} />
        </span>
      </button>
    </motion.div>
  );
}