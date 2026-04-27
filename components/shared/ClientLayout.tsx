"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { LoadingScreen } from "./LoadingScreen";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check sessionStorage synchronously-ish via lazy initializer
  const [isLoading, setIsLoading] = useState(() => {
    // During SSR there's no sessionStorage — default to false
    if (typeof window === "undefined") return false;
    const alreadyShown = sessionStorage.getItem("loadingShown");
    return pathname === "/" && !alreadyShown;
  });

  useEffect(() => {
    if (isLoading) {
      sessionStorage.setItem("loadingShown", "true");
    }
  }, [isLoading]);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && (
          <LoadingScreen key="loading" onComplete={handleLoadingComplete} />
        )}
      </AnimatePresence>
      <div
        style={{
          opacity: isLoading ? 0 : 1,
          transition: "opacity 0.5s ease-in-out",
        }}
      >
        {children}
      </div>
    </>
  );
}