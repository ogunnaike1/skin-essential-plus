"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Image from "next/image";

export function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 4; // Faster progress
      });
    }, 25); // Faster interval

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-gradient-to-br from-mauve via-ivory to-sage overflow-hidden"
    >
      {/* Animated background gradient orbs - OPTIMIZED */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 100, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-0 left-0 h-[500px] w-[500px] rounded-full bg-mauve/40 blur-3xl"
        />
        <motion.div
          animate={{
            scale: [1, 1.3, 1],
            x: [0, -100, 0],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-0 right-0 h-[500px] w-[500px] rounded-full bg-sage/40 blur-3xl"
        />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Animated Logo with scale and glow */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{
            duration: 1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="mb-8 relative"
        >
          <motion.div
            animate={{
              scale: [1, 1.08, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            {/* Glow effect behind logo */}
            <div className="absolute inset-0 blur-2xl opacity-50">
              <Image
                src="/images/logo.png"
                alt=""
                width={120}
                height={120}
                className="w-24 h-24 sm:w-28 sm:h-28"
              />
            </div>
            {/* Main logo */}
            <Image
              src="/images/logo.png"
              alt="Skin Essential Plus Logo"
              width={120}
              height={120}
              className="relative w-24 h-24 sm:w-28 sm:h-28 drop-shadow-2xl"
              priority
            />
          </motion.div>

          {/* Orbiting colored dots around logo */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0 w-24 h-24 sm:w-28 sm:h-28"
          >
            <div className="relative h-full w-full">
              <div className="absolute -top-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-mauve shadow-lg shadow-mauve/50" />
              <div className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rounded-full bg-sage shadow-lg shadow-sage/50" />
              <div className="absolute -left-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-deep shadow-lg shadow-deep/50" />
              <div className="absolute -right-2 top-1/2 h-3 w-3 -translate-y-1/2 rounded-full bg-mauve shadow-lg shadow-mauve/50" />
            </div>
          </motion.div>
        </motion.div>

        {/* Brand name with colorful letters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-center leading-tight">
            <span className="text-deep">Skin </span>
            <span className="text-mauve">Essential </span>
            <span className="text-sage block sm:inline mt-1 sm:mt-0">Plus</span>
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-3 text-center text-xs sm:text-sm font-medium text-deep tracking-[0.3em] uppercase"
          >
            Luxury Skincare & Spa
          </motion.p>
        </motion.div>

        {/* Colorful animated spinner with multiple rings */}
        <div className="relative h-28 w-28 mb-8">
          {/* Outer mauve ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-0"
          >
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#8A6F88"
                strokeWidth="3"
                strokeDasharray="80 200"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </motion.div>

          {/* Middle sage ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-2"
          >
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#4F7288"
                strokeWidth="3"
                strokeDasharray="60 200"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </motion.div>

          {/* Inner deep ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{
              duration: 5,
              repeat: Infinity,
              ease: "linear",
            }}
            className="absolute inset-4"
          >
            <svg className="h-full w-full" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="45"
                fill="none"
                stroke="#47676A"
                strokeWidth="3"
                strokeDasharray="40 200"
                strokeLinecap="round"
                opacity="0.8"
              />
            </svg>
          </motion.div>

          {/* Center pulsing glow */}
          <motion.div
            animate={{
              scale: [1, 1.3, 1],
              opacity: [0.3, 0.6, 0.3],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div className="h-12 w-12 rounded-full bg-gradient-to-br from-mauve via-sage to-deep" />
          </motion.div>
        </div>

        {/* Colorful gradient progress bar */}
        <div className="w-72 sm:w-96">
          <div className="h-2 w-full overflow-hidden rounded-full bg-ivory shadow-inner">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-mauve via-sage to-deep shadow-lg"
            />
          </div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-4 text-center text-base font-medium text-deep tabular-nums"
          >
            {progress}%
          </motion.p>
        </div>

        {/* Animated loading text with color shift */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 1, 0] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="mt-6"
        >
          <p className="text-sm font-medium bg-gradient-to-r from-mauve via-sage to-deep bg-clip-text text-transparent">
            Preparing your experience...
          </p>
        </motion.div>
      </div>

      {/* Decorative corner elements - OPTIMIZED */}
      <div className="absolute top-8 left-8 h-16 w-16 rounded-full border-4 border-mauve/30" />
      <div className="absolute top-8 right-8 h-12 w-12 rounded-full border-4 border-sage/30" />
      <div className="absolute bottom-8 left-8 h-14 w-14 rounded-full border-4 border-deep/30" />
      <div className="absolute bottom-8 right-8 h-20 w-20 rounded-full border-4 border-mauve/30" />
    </motion.div>
  );
}