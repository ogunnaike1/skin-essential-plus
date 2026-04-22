"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface TimelineEntry {
  year: string;
  title: string;
  description: string;
  color: string;
}

const TIMELINE: readonly TimelineEntry[] = [
  {
    year: "2018",
    title: "A quiet beginning",
    description:
      "Ifeoluwa Peters Kanyinsola opened a single-room studio in Victoria Island, convinced that skincare could be both clinical and contemplative.",
    color: "#8A6F88",
  },
  {
    year: "2020",
    title: "The ritual takes form",
    description:
      "We developed our signature 5-stage ritual — the framework that still underpins every treatment we offer today.",
    color: "#4F7288",
  },
  {
    year: "2022",
    title: "A full sanctuary",
    description:
      "Expansion into our current flagship — eight treatment rooms, a therapy suite, and a dedicated lash artistry atelier.",
    color: "#47676A",
  },
  {
    year: "2024",
    title: "Redefining luxury",
    description:
      "Introduction of the Skin Essential Plus complete skincare program — a year-long journey, not a transaction.",
    color: "#8A6F88",
  },
] as const;

export function OurStory(): React.ReactElement {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden">
      {/* Palette orb */}
      <div
        className="absolute top-40 right-0 h-[500px] w-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start mb-16 sm:mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5"
          >
            <span className="eyebrow text-mauve text-[11px] block mb-5">
              — Chapter Two
            </span>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.02] tracking-tight text-deep">
              Our story, told in chapters.
            </h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 lg:col-start-7"
          >
            <p className="text-base sm:text-lg font-light text-deep/70 leading-[1.65]">
              What began in a single room with a borrowed treatment bed has become a sanctuary serving thousands. But our fundamental belief hasn't shifted in seven years: that genuine transformation requires patience, presence, and protocols built on science rather than trend. Here are the moments that shaped us.
            </p>
          </motion.div>
        </div>

        {/* Visual story block */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mb-20 sm:mb-28">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative aspect-[4/3] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(71,103,106,0.15)]"
          >
            <Image
              src="https://images.unsplash.com/photo-1616394584738-fc6e612e71b9?w=1400&q=85&auto=format&fit=crop"
              alt="A treatment ritual in progress"
              fill
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-tr from-deep/50 via-transparent to-transparent" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between gap-8"
          >
            <div className="relative aspect-[4/5] rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(71,103,106,0.15)]">
              <Image
                src="https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800&q=85&auto=format&fit=crop"
                alt="Detail of a skincare treatment"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-mauve/25 to-transparent" />
            </div>

            {/* Pull quote */}
            <div className="rounded-2xl bg-sage/15 p-7 border border-sage/25">
              <span className="eyebrow text-sage text-[10px] block mb-3">
                — Our conviction
              </span>
              <p className="font-display text-xl sm:text-2xl font-light text-deep leading-[1.25] text-balance">
                "Radiance isn't a destination. It's a practice — and we're honored to be your guides."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Timeline */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative"
        >
          <div className="mb-10">
            <span className="eyebrow text-deep text-[10px]">
              — Milestones along the way
            </span>
          </div>

          {/* Timeline rail */}
          <div className="relative">
            <div className="hidden md:block absolute top-[30px] left-0 right-0 h-px bg-gradient-to-r from-mauve via-sage to-deep" />

            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
              {TIMELINE.map((entry, i) => (
                <motion.div
                  key={entry.year}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.7,
                    delay: i * 0.12,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="relative"
                >
                  {/* Dot */}
                  <div className="relative h-[60px] flex items-center justify-start md:justify-center mb-4">
                    <span
                      className="relative h-4 w-4 rounded-full ring-4 ring-ivory"
                      style={{ backgroundColor: entry.color }}
                    >
                      <span
                        className="absolute inset-0 rounded-full animate-pulse-soft opacity-40 blur-sm"
                        style={{ backgroundColor: entry.color }}
                      />
                    </span>
                  </div>

                  <div className="relative">
                    <p
                      className="font-display text-4xl sm:text-5xl font-light leading-none tracking-tight mb-3"
                      style={{ color: entry.color }}
                    >
                      {entry.year}
                    </p>
                    <h3 className="font-display text-xl font-light text-deep leading-tight mb-2">
                      {entry.title}
                    </h3>
                    <p className="text-sm font-light text-deep/65 leading-relaxed">
                      {entry.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}