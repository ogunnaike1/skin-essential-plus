'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

const BRAND_IMAGES = [
  {
    src: "https://res.cloudinary.com/dhmqhless/image/upload/v1778092806/skin-ig3_og3xnh.jpg",
    alt: "Skin Essential Plus signature treatment",
    gridClass: "col-span-2 row-span-2",
  },
  {
    src: "https://res.cloudinary.com/dhmqhless/image/upload/v1778092844/skin-ig1_ksvzcl.jpg",
    alt: "Skincare ritual in progress",
    gridClass: "",
  },
  {
    src: "https://res.cloudinary.com/dhmqhless/image/upload/v1778093141/skin-ig4_ihjvl0.jpg",
    alt: "Premium treatment detail",
    gridClass: "",
  },
  {
    src: "https://res.cloudinary.com/dhmqhless/image/upload/v1778092844/skin-ig2_w7tvnk.jpg",
    alt: "Treatment close-up",
    gridClass: "",
  },
  {
    src: "https://res.cloudinary.com/dhmqhless/image/upload/v1778093837/skin-ig5_qfrkfe.jpg",
    alt: "Studio ambiance and care",
    gridClass: "",
  },
  {
    src: "https://res.cloudinary.com/dhmqhless/image/upload/v1778028814/skin-essential-plus/homepage/hero/home-page-hero4.jpg",
    alt: "Skin Essential Plus experience",
    gridClass: "",
  },
] as const;

export function GalleryShowcase() {
  return (
    <section className="relative py-16 sm:py-20 bg-ivory overflow-hidden">
      {/* Subtle background orb */}
      <div
        className="absolute top-0 left-0 w-[400px] h-[400px] rounded-full blur-3xl opacity-8 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
        aria-hidden
      />

      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4"
        >
          <div>
            <span className="eyebrow text-mauve text-[11px] block mb-3">— From our studio</span>
            <h2 className="font-display text-3xl sm:text-4xl font-light text-deep leading-tight">
              Moments from{" "}
              <span className="italic">Skin Essential Plus</span>
            </h2>
          </div>
          <p className="text-sm text-deep/50 font-light sm:max-w-xs sm:text-right">
            A glimpse into the rituals, spaces, and experiences that define us.
          </p>
        </motion.div>

        {/* Mosaic grid — large feature top-left, smaller tiles filling in */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-3 auto-rows-[220px] sm:auto-rows-[260px] gap-3 sm:gap-4"
        >
          {BRAND_IMAGES.map((img, i) => (
            <motion.div
              key={img.src}
              initial={{ opacity: 0, scale: 0.97 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.7, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`relative overflow-hidden rounded-2xl ${img.gridClass}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                className="object-cover transition-transform duration-700 hover:scale-[1.04]"
                sizes="(max-width: 768px) 100vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/25 via-transparent to-transparent" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
