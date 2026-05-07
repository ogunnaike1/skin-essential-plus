'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Images } from 'lucide-react';

export function GalleryHero() {
  return (
    <section className="relative pt-28 sm:pt-36 pb-20 sm:pb-28 overflow-hidden min-h-[75vh] flex items-center">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="https://res.cloudinary.com/dhmqhless/image/upload/v1778092806/skin-ig3_og3xnh.jpg"
          alt="Skin Essential Plus gallery"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-br from-deep/80 via-deep/55 to-mauve/65" />
      </div>

      {/* Soft glow orbs */}
      <div
        className="absolute top-1/4 right-1/3 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="absolute bottom-1/4 left-1/4 w-80 h-80 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4F7288 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ivory/10 backdrop-blur-sm border border-ivory/20 mb-6">
            <Images className="h-4 w-4 text-ivory" />
            <span className="text-xs uppercase tracking-[0.15em] text-ivory font-medium">
              Visual Portfolio
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-light text-ivory mb-5 leading-[1.02]">
            Beauty,{" "}
            <span className="italic">captured.</span>
          </h1>
          <p className="text-lg sm:text-xl text-ivory/75 font-light leading-relaxed max-w-xl">
            Every image tells a story of transformation — from the hands that heal to the skin that glows.
          </p>
        </motion.div>
      </div>

      {/* Corner accents */}
      <div className="absolute top-8 left-8 w-14 h-14 border-l-2 border-t-2 border-ivory/30 rounded-tl-2xl" />
      <div className="absolute bottom-8 right-8 w-14 h-14 border-r-2 border-b-2 border-ivory/30 rounded-br-2xl" />

      {/* Wave shape into next section */}
      <div className="absolute bottom-0 left-0 right-0 h-16 pointer-events-none">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" className="w-full h-full" fill="#F5F0EC">
          <path d="M0,64 C360,0 1080,64 1440,28 L1440,64 Z" />
        </svg>
      </div>
    </section>
  );
}
