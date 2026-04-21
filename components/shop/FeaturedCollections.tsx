"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Image from "next/image";

import { COLLECTIONS } from "@/lib/shop-data";
import { cn } from "@/lib/utils";

/**
 * Three hero collection cards — colorful, solid, zero blur.
 * Each card has a palette-color identity with crisp edges.
 */
export function FeaturedCollections(): React.ReactElement {
  return (
    <section className="relative py-16 sm:py-20 bg-ivory">
      <div className="mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 sm:mb-14 flex flex-col lg:flex-row lg:items-end lg:justify-between gap-5"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="h-1 w-8 rounded-full bg-mauve" />
              <span className="h-1 w-8 rounded-full bg-sage" />
              <span className="h-1 w-8 rounded-full bg-deep" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-deep leading-tight tracking-tight">
              Curated{" "}
              <em className="not-italic text-mauve">collections</em>.
            </h2>
            <p className="mt-3 text-sm sm:text-base font-light text-deep/65 max-w-lg">
              Three worlds of skin: daily rituals, sculpting tools, and thoughtful bundles. Every edit is hand-picked by our clinicians.
            </p>
          </div>
          <span className="eyebrow text-mauve text-[11px] shrink-0">
            — {COLLECTIONS.length} collections
          </span>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6">
          {COLLECTIONS.map((collection, i) => {
            // Per-collection color palette
            const badgeBg: Record<typeof collection.color, string> = {
              mauve: "bg-mauve",
              sage: "bg-sage",
              deep: "bg-deep",
            };
            const accentText: Record<typeof collection.color, string> = {
              mauve: "text-mauve",
              sage: "text-sage",
              deep: "text-deep",
            };
            const footerBg: Record<typeof collection.color, string> = {
              mauve: "bg-gradient-to-r from-mauve to-mauve",
              sage: "bg-gradient-to-r from-sage to-sage",
              deep: "bg-gradient-to-r from-deep to-deep-dark",
            };
            const strokeHex: Record<typeof collection.color, string> = {
              mauve: "#C0A9BD",
              sage: "#94A7AE",
              deep: "#47676A",
            };

            return (
              <motion.a
                key={collection.id}
                href={collection.href}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{
                  duration: 0.7,
                  delay: i * 0.1,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="group relative flex flex-col rounded-2xl overflow-hidden bg-ivory border-2 border-deep/10 transition-[border-color,box-shadow] duration-300 hover:border-deep/25 hover:shadow-[0_16px_40px_rgba(71,103,106,0.12)]"
              >
                {/* Top colored accent strip */}
                <div
                  className="h-1 w-full shrink-0"
                  style={{ backgroundColor: strokeHex[collection.color] }}
                />

                {/* Image */}
                <div className="relative aspect-[4/5] overflow-hidden bg-deep/5">
                  <Image
                    src={collection.image}
                    alt={collection.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  {/* Single clean bottom gradient for text legibility — no blur */}
                  <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-deep/80 via-deep/30 to-transparent pointer-events-none" />

                  {/* Collection number */}
                  <span className="absolute top-5 left-5 font-display text-5xl font-light text-ivory leading-none tabular-nums">
                    0{i + 1}
                  </span>

                  {/* Product count badge — solid color */}
                  <span
                    className={cn(
                      "absolute top-5 right-5 inline-flex items-center px-3 py-1 rounded-full text-ivory text-[10px] uppercase tracking-[0.18em] font-medium shadow-[0_2px_8px_rgba(0,0,0,0.15)]",
                      badgeBg[collection.color]
                    )}
                  >
                    {collection.productCount} products
                  </span>

                  {/* Bottom-aligned title stack on image */}
                  <div className="absolute inset-x-0 bottom-0 p-5 sm:p-6">
                    <span className="eyebrow text-ivory/80 text-[10px] block mb-2">
                      — {collection.subtitle}
                    </span>
                    <h3 className="font-display text-2xl sm:text-3xl font-light text-ivory leading-tight tracking-tight">
                      {collection.title}
                    </h3>
                  </div>
                </div>

                {/* Body */}
                <div className="p-5 sm:p-6 flex-1 flex flex-col bg-ivory">
                  <p className="text-sm font-light text-deep/70 leading-relaxed mb-5 flex-1">
                    {collection.description}
                  </p>

                  {/* CTA footer — solid colored band */}
                  <div
                    className={cn(
                      "inline-flex items-center justify-between gap-3 px-5 py-3 rounded-full text-ivory transition-opacity duration-300 group-hover:opacity-90",
                      footerBg[collection.color]
                    )}
                  >
                    <span className="text-[11px] uppercase tracking-[0.2em] font-medium">
                      Shop the edit
                    </span>
                    <span className="h-8 w-8 rounded-full bg-ivory flex items-center justify-center transition-transform duration-300 group-hover:rotate-45">
                      <ArrowUpRight
                        className={cn("h-3.5 w-3.5", accentText[collection.color])}
                        strokeWidth={1.75}
                      />
                    </span>
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
}