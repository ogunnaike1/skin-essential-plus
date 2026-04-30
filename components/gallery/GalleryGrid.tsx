'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { ZoomIn } from 'lucide-react';
import type { GalleryImage, GalleryCategory } from './types';

interface GalleryGridProps {
  images: GalleryImage[];
  activeCategory: GalleryCategory;
  onImageClick: (image: GalleryImage) => void;
}

export function GalleryGrid({ images, activeCategory, onImageClick }: GalleryGridProps) {
  const getGridClass = (span?: string) => {
    switch (span) {
      case 'wide':
        return 'md:col-span-2';
      case 'tall':
        return 'md:row-span-2';
      case 'large':
        return 'md:col-span-2 md:row-span-2';
      default:
        return '';
    }
  };

  return (
    <section className="py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-4 auto-rows-[300px]"
          >
            {images.map((image, index) => (
              <motion.div
                key={image.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05, duration: 0.4 }}
                className={`
                  relative group cursor-pointer overflow-hidden rounded-2xl
                  ${getGridClass(image.span)}
                `}
                onClick={() => onImageClick(image)}
              >
                {/* Image */}
                <div className="relative w-full h-full">
                  <Image
                    src={image.src}
                    alt={image.alt}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-deep/90 via-deep/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Content */}
                  <div className="absolute inset-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                    <div className="transform translate-y-10 group-hover:translate-y-0 transition-transform duration-500">
                      <h3 className="text-white text-xl md:text-2xl font-serif mb-2">
                        {image.title}
                      </h3>
                      {image.description && (
                        <p className="text-white/80 text-sm md:text-base opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                          {image.description}
                        </p>
                      )}
                    </div>

                    {/* Zoom Icon */}
                    <div className="absolute top-6 right-6 w-10 h-10 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      <ZoomIn className="w-5 h-5 text-white" />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        {images.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-500 text-lg">No images found in this category</p>
          </div>
        )}
      </div>
    </section>
  );
}