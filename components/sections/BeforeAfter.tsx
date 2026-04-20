"use client";

import { motion, useMotionValue, useTransform } from "framer-motion";
import { Move } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { BEFORE_AFTER } from "@/lib/constants";

function Comparison({
  before,
  after,
  label,
}: {
  before: string;
  after: string;
  label: string;
}): React.ReactElement {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0.5);
  const [isDragging, setIsDragging] = useState<boolean>(false);

  const clipRight = useTransform(x, (v) => `inset(0 0 0 ${v * 100}%)`);
  const handleLeft = useTransform(x, (v) => `${v * 100}%`);

  const updateFromClientX = (clientX: number): void => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const rel = (clientX - rect.left) / rect.width;
    x.set(Math.max(0, Math.min(1, rel)));
  };

  return (
    <motion.div
      ref={containerRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="relative aspect-[16/10] sm:aspect-[16/9] w-full rounded-3xl overflow-hidden shadow-glass-lg border border-white/50 select-none cursor-ew-resize"
      onPointerDown={(e) => {
        setIsDragging(true);
        updateFromClientX(e.clientX);
        (e.target as HTMLElement).setPointerCapture(e.pointerId);
      }}
      onPointerMove={(e) => {
        if (isDragging) updateFromClientX(e.clientX);
      }}
      onPointerUp={(e) => {
        setIsDragging(false);
        (e.target as HTMLElement).releasePointerCapture(e.pointerId);
      }}
    >
      {/* After image (base) */}
      <Image
        src={after}
        alt={`${label} — after`}
        fill
        sizes="(max-width: 1024px) 100vw, 80vw"
        className="object-cover pointer-events-none"
      />
      <div className="absolute bottom-5 right-5 z-20 px-3 py-1.5 rounded-full bg-ivory/90 backdrop-blur-md text-deep eyebrow text-[10px] border border-white/60 pointer-events-none">
        After
      </div>

      {/* Before image (clipped) */}
      <motion.div style={{ clipPath: clipRight }} className="absolute inset-0">
        <Image
          src={before}
          alt={`${label} — before`}
          fill
          sizes="(max-width: 1024px) 100vw, 80vw"
          className="object-cover pointer-events-none"
        />
        <div className="absolute bottom-5 left-5 z-20 px-3 py-1.5 rounded-full bg-deep/90 backdrop-blur-md text-ivory eyebrow text-[10px] border border-white/20 pointer-events-none">
          Before
        </div>
      </motion.div>

      {/* Divider + handle */}
      <motion.div
        style={{ left: handleLeft }}
        className="absolute top-0 bottom-0 w-px bg-ivory/90 shadow-[0_0_20px_rgba(244,242,243,0.6)] pointer-events-none"
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-14 w-14 rounded-full bg-ivory/95 backdrop-blur-md border border-white shadow-glow flex items-center justify-center">
          <Move className="h-5 w-5 text-deep" strokeWidth={1.5} />
        </div>
      </motion.div>
    </motion.div>
  );
}

export function BeforeAfter(): React.ReactElement {
  return (
    <section
      id="results"
      className="relative py-24 sm:py-32 section-padding overflow-hidden"
    >
      <div
        className="absolute top-1/2 left-0 h-[500px] w-[500px] rounded-full blur-3xl opacity-20 -translate-y-1/2 pointer-events-none"
        style={{ background: "radial-gradient(circle, #94A7AE, transparent 70%)" }}
        aria-hidden
      />

      <div className="relative max-w-6xl mx-auto">
        <SectionHeading
          eyebrow="Real Results"
          title="The proof is in the pores."
          description="Drag to reveal the transformation. Real clients, real protocols, real radiance — documented with unfiltered honesty."
        />

        <div className="mt-16 space-y-10">
          {BEFORE_AFTER.map((item) => (
            <div key={item.id}>
              <div className="mb-5 flex items-center justify-between">
                <h3 className="font-display text-xl sm:text-2xl font-light text-deep">
                  {item.label}
                </h3>
                <span className="hidden sm:block eyebrow text-deep/50">
                  Drag to compare →
                </span>
              </div>
              <Comparison
                before={item.before}
                after={item.after}
                label={item.label}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
