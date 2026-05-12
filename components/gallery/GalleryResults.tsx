'use client';

import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

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

      </div>
    </section>
  );
}
