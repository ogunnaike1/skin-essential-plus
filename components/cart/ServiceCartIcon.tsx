"use client";

import { CalendarCheck } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useServiceCart } from "@/app/contexts/ServiceCartContext";
import { ServiceCartDrawer } from "./ServiceCartDrawer";
import { cn } from "@/lib/utils";

interface ServiceCartIconProps {
  variant?: "light" | "dark";
}

export function ServiceCartIcon({ variant = "dark" }: ServiceCartIconProps) {
  const { serviceCount } = useServiceCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "relative p-2 rounded-full transition-colors",
          variant === "light" ? "hover:bg-ivory/10" : "hover:bg-deep/5"
        )}
        aria-label="Bookings cart"
      >
        <CalendarCheck
          className={cn("h-5 w-5", variant === "light" ? "text-ivory" : "text-deep")}
          strokeWidth={1.5}
        />

        <AnimatePresence>
          {serviceCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-mauve text-ivory text-[10px] font-medium flex items-center justify-center"
            >
              {serviceCount > 9 ? "9+" : serviceCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <ServiceCartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
