'use client';

import { motion } from 'framer-motion';

export function GalleryHero() {
  return (
    <section className="relative py-24 md:py-32 overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-96 h-96 bg-mauve rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-sage rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-7xl font-serif font-light text-deep mb-6">
            Our Gallery
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 font-light leading-relaxed">
            A visual journey through treatments, transformations, and the art of skincare
          </p>
        </motion.div>
      </div>
    </section>
  );
}