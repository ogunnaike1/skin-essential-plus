"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { LoadingScreen } from "./LoadingScreen";

export function ClientLayout({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Mark as ready immediately so content can load
    setIsReady(true);

    // Hide loading screen after animation completes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      <AnimatePresence mode="wait">
        {isLoading && <LoadingScreen key="loading" />}
      </AnimatePresence>
      {/* Render children immediately but fade in */}
      <div 
        style={{ 
          opacity: isReady ? (isLoading ? 0 : 1) : 0,
          transition: "opacity 0.5s ease-in-out"
        }}
      >
        {children}
      </div>
    </>
  );
}