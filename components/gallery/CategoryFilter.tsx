'use client';

import { motion } from 'framer-motion';
import type { GalleryCategory } from './types';

interface CategoryFilterProps {
  categories: {
    id: GalleryCategory;
    label: string;
    color: string;
  }[];
  activeCategory: GalleryCategory;
  onCategoryChange: (category: GalleryCategory) => void;
}

export function CategoryFilter({
  categories,
  activeCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <section className="sticky top-0 z-30 bg-ivory/95 backdrop-blur-md border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-center gap-2 py-6 overflow-x-auto">
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => onCategoryChange(category.id)}
              className={`
                px-6 py-2.5 rounded-full text-sm font-medium transition-all whitespace-nowrap
                ${
                  activeCategory === category.id
                    ? `bg-${category.color} text-white shadow-lg shadow-${category.color}/20`
                    : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200'
                }
              `}
              style={
                activeCategory === category.id
                  ? {
                      backgroundColor: `var(--${category.color})`,
                      boxShadow: `0 10px 25px -5px rgba(var(--${category.color}-rgb), 0.2)`,
                    }
                  : undefined
              }
            >
              {category.label}
            </motion.button>
          ))}
        </div>
      </div>
    </section>
  );
}