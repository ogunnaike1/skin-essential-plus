"use client";

import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark" | "forest";
  size?: "sm" | "md" | "lg";
}

/**
 * Logo renders the Skin Essential Plus SP monogram.
 *
 * Uses the source PNG (/images/logo-mask.png) as a CSS mask so the logo
 * can be painted in any brand color and stays crisp at any size.
 *
 * Variants:
 * - `forest` — original brand green (#0F5F2E), for light backdrops
 * - `light`  — ivory, for dark backdrops (hero, CTA, footer)
 * - `dark`   — deep teal, alternate accent
 */
export function Logo({
  className,
  variant = "forest",
  size = "md",
}: LogoProps): React.ReactElement {
  const sizeClasses: Record<NonNullable<LogoProps["size"]>, string> = {
    sm: "h-9 w-9",
    md: "h-12 w-12",
    lg: "h-16 w-16",
  };

  const colorMap: Record<NonNullable<LogoProps["variant"]>, string> = {
    forest: "bg-forest",
    light: "bg-ivory",
    dark: "bg-deep",
  };

  return (
    <div
      className={cn("inline-flex items-center select-none group", className)}
      aria-label="Skin Essential Plus"
      role="img"
    >
      <div
        className={cn(
          "transition-all duration-700 ease-cinematic group-hover:scale-[1.04]",
          sizeClasses[size],
          colorMap[variant]
        )}
        style={{
          WebkitMaskImage: "url('/images/logo-mask.png')",
          maskImage: "url('/images/logo-mask.png')",
          WebkitMaskSize: "contain",
          maskSize: "contain",
          WebkitMaskRepeat: "no-repeat",
          maskRepeat: "no-repeat",
          WebkitMaskPosition: "center",
          maskPosition: "center",
        }}
      />
    </div>
  );
}
