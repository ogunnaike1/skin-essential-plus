'use client';

import { useState, useEffect, useCallback } from 'react';
import { GalleryHero } from '@/components/gallery/GalleryHero';
import { GalleryShowcase } from '@/components/gallery/GalleryShowcase';
import { CategoryFilter } from '@/components/gallery/CategoryFilter';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox';
import { GalleryResults } from '@/components/gallery/GalleryResults';
import { GalleryCTA } from '@/components/gallery/GalleryCTA';
import { CATEGORIES, GALLERY_IMAGES } from '@/components/gallery/data';
import type { GalleryCategory, GalleryImage } from '@/components/gallery/types';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  const filteredImages =
    activeCategory === 'all'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  const handleImageClick = (image: GalleryImage) => {
    const idx = filteredImages.findIndex((img) => img.id === image.id);
    setImageIndex(idx);
    setSelectedImage(image);
  };

  const handleNavigate = useCallback(
    (direction: 'prev' | 'next') => {
      const next =
        direction === 'prev'
          ? (imageIndex - 1 + filteredImages.length) % filteredImages.length
          : (imageIndex + 1) % filteredImages.length;
      setImageIndex(next);
      setSelectedImage(filteredImages[next] ?? null);
    },
    [imageIndex, filteredImages]
  );

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!selectedImage) return;
      if (e.key === 'Escape') setSelectedImage(null);
      if (e.key === 'ArrowLeft') handleNavigate('prev');
      if (e.key === 'ArrowRight') handleNavigate('next');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [selectedImage, handleNavigate]);

  return (
    <div className="min-h-screen bg-ivory">
      <GalleryHero />
      <GalleryShowcase />

      <CategoryFilter
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      <GalleryGrid
        images={filteredImages}
        activeCategory={activeCategory}
        onImageClick={handleImageClick}
      />

      <GalleryResults />
      <GalleryCTA />

      <GalleryLightbox
        selectedImage={selectedImage}
        imageIndex={imageIndex}
        totalImages={filteredImages.length}
        onClose={() => setSelectedImage(null)}
        onNavigate={handleNavigate}
      />
    </div>
  );
}
