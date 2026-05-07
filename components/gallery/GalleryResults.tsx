'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Sparkles, Star } from 'lucide-react';

const RESULTS = [
  {
    src: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?w=1200&q=90&auto=format&fit=crop",
    alt: "Glowing skin result",
    treatment: "Brightening Protocol",
    duration: "8 weeks",
    result: "Radiant Glow",
  },
  {
    src: "https://images.unsplash.com/photo-1602192509154-0b900ee1f851?w=1200&q=90&auto=format&fit=crop",
    alt: "Clear skin transformation",
    treatment: "Acne Treatment Program",
    duration: "6 weeks",
    result: "Clear & Balanced",
  },
  {
    src: "https://images.unsplash.com/photo-1616683693504-3ea7e9ad6fec?w=1200&q=90&auto=format&fit=crop",
    alt: "Hydrated skin result",
    treatment: "Intensive Moisture Therapy",
    duration: "4 weeks",
    result: "Deep Hydration",
  },
  {
    src: "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=1200&q=90&auto=format&fit=crop",
    alt: "Smooth skin texture result",
    treatment: "Retinaldehyde Treatment",
    duration: "10 weeks",
    result: "Refined Texture",
  },
] as const;

const STATS = [
  { value: "500+", label: "Clients Transformed" },
  { value: "4.9★", label: "Average Rating" },
  { value: "5+", label: "Years of Excellence" },
  { value: "15+", label: "Expert Treatments" },
] as const;

export function GalleryResults() {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-deep via-deep/95 to-mauve/75" />
      <div
        className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="absolute bottom-0 left-0 w-[500px] h-[500px] rounded-full blur-3xl opacity-10 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4F7288 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ivory/10 backdrop-blur-sm border border-ivory/20 mb-6">
            <Sparkles className="h-4 w-4 text-ivory" />
            <span className="text-xs uppercase tracking-[0.15em] text-ivory font-medium">
              Real Transformations
            </span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-ivory leading-tight mb-4">
            Results that <span className="italic">speak.</span>
          </h2>
          <p className="text-ivory/60 font-light text-lg max-w-xl mx-auto">
            Every treatment is a commitment — to your skin, your confidence, and your story.
          </p>
        </motion.div>

        {/* Stats row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14"
        >
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="flex flex-col items-center text-center p-5 sm:p-6 rounded-2xl bg-white/5 border border-ivory/15 backdrop-blur-sm"
            >
              <span className="font-display text-3xl sm:text-4xl font-light text-ivory mb-1">
                {stat.value}
              </span>
              <span className="text-[10px] uppercase tracking-[0.12em] text-ivory/50 font-medium">
                {stat.label}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Results grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {RESULTS.map((result, i) => (
            <motion.div
              key={result.src}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="group relative overflow-hidden rounded-2xl aspect-[3/4]"
            >
              <Image
                src={result.src}
                alt={result.alt}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/15 to-transparent" />

              {/* Stars */}
              <div className="absolute top-4 right-4 flex gap-0.5">
                {[0, 1, 2, 3, 4].map((j) => (
                  <Star key={j} className="h-3 w-3 fill-ivory text-ivory" />
                ))}
              </div>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <p className="text-ivory/55 text-[10px] uppercase tracking-[0.14em] font-medium mb-1">
                  {result.treatment}
                </p>
                <h3 className="font-display text-xl font-light text-ivory leading-tight mb-1">
                  {result.result}
                </h3>
                <p className="text-ivory/45 text-xs font-light">{result.duration} program</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
