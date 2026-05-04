"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

export function RootLayoutClient({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-[999] overflow-hidden">
        {/* Vibrant animated gradient background */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-gradient-to-br from-mauve via-sage/80 to-deep"
        >
          {/* Animated gradient overlay */}
          <motion.div
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: 'reverse',
              ease: 'linear',
            }}
            className="absolute inset-0 opacity-40"
            style={{
              background: 'linear-gradient(45deg, #8A6F88, #4F7288, #47676A, #0F5F2E)',
              backgroundSize: '400% 400%',
            }}
          />
        </motion.div>

        {/* Floating color orbs */}
        <motion.div
          animate={{
            x: [0, 100, 0],
            y: [0, -100, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute top-1/4 left-1/4 w-64 h-64 rounded-full bg-gradient-to-br from-mauve/60 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, -100, 0],
            y: [0, 100, 0],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute bottom-1/4 right-1/4 w-80 h-80 rounded-full bg-gradient-to-br from-sage/60 to-transparent blur-3xl"
        />
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -50, 0],
            scale: [1, 1.15, 1],
          }}
          transition={{
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute top-1/2 right-1/3 w-72 h-72 rounded-full bg-gradient-to-br from-forest/50 to-transparent blur-3xl"
        />

        {/* Main content */}
        <div className="relative z-10 h-full flex items-center justify-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="text-center"
          >
            {/* Logo with glass morphism container */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="mb-8 relative mx-auto"
            >
              {/* Glass card behind logo */}
              <div className="relative">
                <div className="absolute inset-0 bg-ivory/10 backdrop-blur-xl rounded-3xl border border-ivory/20 shadow-2xl" />
                
                {/* Logo container */}
                <motion.div
                  animate={{
                    y: [0, -10, 0],
                  }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="relative p-8"
                >
                  {/* Rotating ring around logo */}
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 rounded-full"
                  >
                    <div className="absolute inset-8 rounded-full border-2 border-dashed border-ivory/30" />
                  </motion.div>

                  {/* Pulsing glow */}
                  <motion.div
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.8, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute inset-0 bg-ivory/20 rounded-full blur-2xl"
                  />

                  {/* Logo */}
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48">
                    <Image
                      src="/images/skin-essential-transparent.png"
                      alt="Skin Essential Plus"
                      fill
                      className="object-contain drop-shadow-2xl"
                      priority
                    />
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Brand name with gradient text */}
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="mb-8"
            >
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light mb-3 bg-gradient-to-r from-ivory via-ivory/90 to-ivory bg-clip-text text-transparent drop-shadow-lg">
                Skin Essential Plus
              </h1>
              
              {/* Animated decorative line */}
              <div className="flex items-center justify-center gap-3 mb-2">
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-px w-16 bg-gradient-to-r from-transparent via-ivory/60 to-transparent"
                />
                <p className="text-xs sm:text-sm font-light text-ivory/80 tracking-[0.3em] uppercase">
                  Luxury Spa
                </p>
                <motion.div
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ delay: 0.6, duration: 0.8 }}
                  className="h-px w-16 bg-gradient-to-r from-transparent via-ivory/60 to-transparent"
                />
              </div>
            </motion.div>

            {/* Advanced loader - Wave animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="flex items-center justify-center gap-2"
            >
              {[0, 1, 2, 3, 4].map((i) => (
                <motion.div
                  key={i}
                  animate={{
                    scaleY: [1, 1.8, 1],
                    opacity: [0.5, 1, 0.5],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.1,
                  }}
                  className="w-1 h-8 bg-ivory/60 rounded-full"
                />
              ))}
            </motion.div>

            {/* Loading text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="mt-6 text-sm font-light text-ivory/70 tracking-wide"
            >
              Preparing your sanctuary...
            </motion.p>
          </motion.div>
        </div>

        {/* Floating particles */}
        {[...Array(12)].map((_, i) => {
          const startX = Math.random() * 100;
          const startY = Math.random() * 100;
          return (
            <motion.div
              key={i}
              initial={{
                x: `${startX}%`,
                y: `${startY}%`,
              }}
              animate={{
                y: [`${startY}%`, `${startY - 10}%`, `${startY}%`],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeInOut",
              }}
              className="absolute w-1 h-1 bg-ivory/40 rounded-full"
            />
          );
        })}

        {/* Corner decorations */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-ivory/30 rounded-tl-2xl" />
          <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-ivory/30 rounded-br-2xl" />
          <div className="absolute top-8 right-8 w-12 h-12 border-r-2 border-t-2 border-ivory/20 rounded-tr-xl" />
          <div className="absolute bottom-8 left-8 w-12 h-12 border-l-2 border-b-2 border-ivory/20 rounded-bl-xl" />
        </motion.div>
      </div>
    );
  }

  return <>{children}</>;
}