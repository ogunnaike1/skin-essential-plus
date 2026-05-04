"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
      <span className="font-display text-5xl sm:text-6xl font-light text-deep tracking-tight leading-none">
        {value}
      </span>
      <span className="eyebrow text-mauve mt-3">{label}</span>
    </motion.div>
  );
}

export function About(): React.ReactElement {
  return (
    <section
      id="about"
      className="relative py-24 sm:py-32 section-padding overflow-hidden"
    >
      {/* Vibrant animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-mauve-tint via-sage-tint to-ivory">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'linear',
          }}
          className="absolute inset-0 opacity-50"
          style={{
            background: 'linear-gradient(135deg, #E6DCE4 0%, #DCE4E8 25%, #FCFBFC 50%, #E6DCE4 75%, #DCE4E8 100%)',
            backgroundSize: '400% 400%',
          }}
        />
      </div>

      {/* Floating color orbs */}
      <motion.div
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-20 left-10 h-96 w-96 rounded-full bg-gradient-to-br from-mauve/30 to-transparent blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -50, 0],
          y: [0, 40, 0],
          scale: [1, 1.3, 1],
        }}
        transition={{
          duration: 12,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
        className="absolute bottom-20 right-10 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-sage/40 to-transparent blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 30, 0],
          y: [0, -20, 0],
          scale: [1, 1.15, 1],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 2,
        }}
        className="absolute top-1/2 right-1/4 h-80 w-80 rounded-full bg-gradient-to-br from-deep/20 to-transparent blur-3xl"
      />

      <div className="relative max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Image stack */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 relative"
          >
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-glass-lg ring-1 ring-ivory/50">
              <Image
                src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=1200&q=85&auto=format&fit=crop"
                alt="The Skin Essential Plus sanctuary interior"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/30 to-transparent" />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="absolute -bottom-8 -right-4 sm:right-8 w-40 sm:w-56 aspect-square rounded-3xl overflow-hidden shadow-lift border-4 border-ivory ring-2 ring-mauve/20"
            >
              <Image
                src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=600&q=85&auto=format&fit=crop"
                alt="Skincare ritual detail"
                fill
                sizes="224px"
                className="object-cover"
              />
            </motion.div>

            {/* Additional decorative glow */}
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.3, 0.6, 0.3],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="absolute -top-6 -left-6 h-40 w-40 rounded-full blur-2xl bg-gradient-to-br from-mauve/60 via-sage/40 to-transparent pointer-events-none"
            />
          </motion.div>

          {/* Copy */}
          <div className="lg:col-span-6">
            <motion.span
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="eyebrow text-deep block mb-5"
            >
              — Our Story
            </motion.span>

            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.05] tracking-tight text-deep text-balance"
            >
              A sanctuary where <em className="text-mauve not-italic">science</em> meets <em className="text-sage not-italic">serenity</em>.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="mt-6 text-base sm:text-lg text-deep font-light leading-relaxed"
            >
              Born from a conviction that true beauty lives at the intersection of clinical precision and contemplative ritual, Skin Essential Plus was founded to redefine what luxury skincare could be — evidence-based, deeply personal, and unapologetically exquisite.
            </motion.p>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="mt-4 text-base sm:text-lg text-deep font-light leading-relaxed"
            >
              Every protocol, every ingredient, every breath of ambience is considered. This is not a service — it's a philosophy.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
              className="mt-10"
            >
              <Link href="/about" className="btn-outline">
                Our Full Story
                <ArrowRight className="h-4 w-4" />
              </Link>
            </motion.div>

            <div className="mt-14 grid grid-cols-3 gap-6 border-t border-deep/15 pt-10">
              <Stat value="2,500+" label="Transformations" delay={0.3} />
              <Stat value="15" label="Master Artisans" delay={0.4} />
              <Stat value="98%" label="Return Rate" delay={0.5} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}