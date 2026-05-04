"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export interface LoadingScreenProps {
  onComplete?: () => void;
}

export function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setIsLoading(false);
      // Wait for exit animation before calling onComplete
      setTimeout(() => {
        onComplete?.();
      }, 800);
    }, 2000); // 2 seconds loading time

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence mode="wait">
      {isLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-ivory"
        >
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-br from-ivory via-mauve-tint/20 to-sage-tint/20" />

          {/* Animated floating orbs */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute top-20 left-20 h-64 w-64 rounded-full bg-mauve/20 blur-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.5, 0.3],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1,
            }}
            className="absolute bottom-20 right-20 h-80 w-80 rounded-full bg-sage/20 blur-3xl"
          />

          {/* Main content */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Logo with elegant entrance */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-8 relative"
            >
              {/* Glow effect */}
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute inset-0 blur-2xl"
              >
                <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-mauve/40 via-sage/40 to-deep/40" />
              </motion.div>

              {/* Logo */}
              <motion.div
                animate={{
                  y: [0, -8, 0],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="relative"
              >
                <Image
                  src="/images/skin-essential.png"
                  alt="Skin Essential Plus"
                  width={160}
                  height={160}
                  className="w-32 h-32 sm:w-40 sm:h-40 drop-shadow-2xl"
                  priority
                />
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.8,
                delay: 0.4,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="mb-12 text-center"
            >
              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-deep mb-2">
                Skin Essential Plus
              </h1>
              <p className="text-xs sm:text-sm font-light text-deep/60 tracking-[0.3em] uppercase">
                Where Science Meets Serenity
              </p>
            </motion.div>

            {/* Elegant spinner */}
            <div className="relative">
              {/* Rotating rings */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="relative h-16 w-16"
              >
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="45"
                    fill="none"
                    stroke="#8A6F88"
                    strokeWidth="2"
                    strokeDasharray="70 200"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              </motion.div>

              <motion.div
                animate={{ rotate: -360 }}
                transition={{
                  duration: 4,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 h-16 w-16"
              >
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="38"
                    fill="none"
                    stroke="#4F7288"
                    strokeWidth="2"
                    strokeDasharray="50 200"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              </motion.div>

              <motion.div
                animate={{ rotate: 360 }}
                transition={{
                  duration: 5,
                  repeat: Infinity,
                  ease: "linear",
                }}
                className="absolute inset-0 h-16 w-16"
              >
                <svg className="h-full w-full" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="31"
                    fill="none"
                    stroke="#47676A"
                    strokeWidth="2"
                    strokeDasharray="30 200"
                    strokeLinecap="round"
                    opacity="0.6"
                  />
                </svg>
              </motion.div>
            </div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 1, 1, 0.7, 1] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.6,
              }}
              className="mt-8 text-sm font-light text-deep/60"
            >
              Preparing your sanctuary...
            </motion.p>
          </div>

          {/* Decorative corner accents */}
          <div className="absolute top-0 left-0 h-24 w-24">
            <div className="absolute top-8 left-8 h-16 w-16 rounded-full border border-mauve/20" />
            <div className="absolute top-10 left-10 h-12 w-12 rounded-full border border-sage/20" />
          </div>
          <div className="absolute bottom-0 right-0 h-24 w-24">
            <div className="absolute bottom-8 right-8 h-16 w-16 rounded-full border border-sage/20" />
            <div className="absolute bottom-10 right-10 h-12 w-12 rounded-full border border-deep/20" />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}