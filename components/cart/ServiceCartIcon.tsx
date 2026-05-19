"use client";

import { CalendarCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface ServiceCartIconProps {
  variant?: "light" | "dark";
  onClick?: () => void;
}

export function ServiceCartIcon({ variant = "dark", onClick }: ServiceCartIconProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative p-2 rounded-full transition-colors",
        variant === "light"
          ? "hover:bg-ivory/10"
          : "hover:bg-deep/5"
      )}
      aria-label="Book appointment"
    >
      <CalendarCheck
        className={cn("h-5 w-5", variant === "light" ? "text-ivory" : "text-deep")}
        strokeWidth={1.5}
      />
    </button>
  );
}
