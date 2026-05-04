"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface StatProps {
  value: string;
  label: string;
  delay: number;
}

function Stat({ value, label, delay }: StatProps): React.ReactElement {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex flex-col"
    >
      <span className="font-display text-4xl sm:text-5xl font-light text-deep tracking-tight leading-none">
        {value}
      </span>
      <span className="eyebrow text-mauve mt-3">{label}</span>
    </motion.div>
  );
}

export function BeforeAfter(): React.ReactElement {
  const [sliderPosition, setSliderPosition] = useState(50);

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <section
      id="lash-transformation"
      className="relative py-24 sm:py-32 section-padding overflow-hidden bg-gradient-to-b from-ivory to-mauve-wash"
    >
      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-glass-lg bg-deep/5">
              <div className="relative w-full h-full">
                <div className="absolute inset-0">
                  <Image
                    src="/images/lash-before.jpg"
                    alt="Natural lashes - Before"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-deep/80 backdrop-blur-sm">
                    <span className="text-xs uppercase tracking-wider text-ivory font-medium">
                      Before
                    </span>
                  </div>
                </div>

                <div 
                  className="absolute inset-0 overflow-hidden"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <Image
                    src="/images/lash-after.jpg"
                    alt="Volume lash extensions - After"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-mauve/80 backdrop-blur-sm">
                    <span className="text-xs uppercase tracking-wider text-ivory font-medium">
                      After
                    </span>
                  </div>
                </div>

                <div 
                  className="absolute top-0 bottom-0 w-1 bg-ivory shadow-lg z-10"
                  style={{ left: `${sliderPosition}%` }}
                >
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-ivory shadow-xl flex items-center justify-center">
                    <div className="flex gap-1">
                      <div className="w-0.5 h-4 bg-deep/40 rounded-full" />
                      <div className="w-0.5 h-4 bg-deep/40 rounded-full" />
                    </div>
                  </div>
                </div>

                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sliderPosition}
                  onChange={handleSliderChange}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
                  aria-label="Before/After slider"
                />
              </div>

              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 0.8, 0.5],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="absolute -top-4 -right-4"
              >
                <Sparkles className="h-8 w-8 text-mauve" />
              </motion.div>
            </div>

            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-4 text-center text-sm text-deep/60 font-light"
            >
              Drag the slider to reveal the transformation
            </motion.p>
          </motion.div>

          <div className="lg:col-span-6">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow text-deep block mb-5"
            >
              — Lash Transformation
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight text-deep text-balance"
            >
              From subtle to <em className="text-mauve not-italic">spectacular</em> in 90 minutes.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg text-deep font-light leading-relaxed"
            >
              Our master lash artists blend precision technique with artistic vision to create dramatic volume that looks effortlessly natural. Each extension is individually applied for a customized look that enhances your unique beauty.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 text-base sm:text-lg text-deep font-light leading-relaxed"
            >
              Wake up every morning with perfectly curled, voluminous lashes that last 4-6 weeks. No mascara needed.
            </motion.p>

            <motion.ul
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.45 }}
              className="mt-6 space-y-3"
            >
              {[
                'Premium synthetic silk fibers',
                'Custom curl, length & volume',
                'Waterproof & sweat-resistant',
                'Lasts 4-6 weeks with fills',
              ].map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-mauve shrink-0" />
                  <span className="text-deep/80 font-light">{feature}</span>
                </li>
              ))}
            </motion.ul>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10"
            >
              <Link href="/services/lash-extensions" className="btn-primary">
                Book Your Transformation
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-deep/15 pt-10">
              <Stat value="90min" label="Application" delay={0.3} />
              <Stat value="4-6wk" label="Lasting" delay={0.4} />
              <Stat value="100+" label="Per Eye" delay={0.5} />
            </div>
          </div>
        </div>
      </div>

      <div
        className="absolute bottom-0 right-0 h-64 w-64 rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8A6F88, transparent 70%)" }}
        aria-hidden
      />
    </section>
  );
}