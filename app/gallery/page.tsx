'use client';

import { useState } from 'react';
import { GalleryHero } from '@/components/gallery/GalleryHero';
import { CategoryFilter } from '@/components/gallery/CategoryFilter';
import { GalleryGrid } from '@/components/gallery/GalleryGrid';
import { GalleryLightbox } from '@/components/gallery/GalleryLightbox';
import { GalleryCTA } from '@/components/gallery/GalleryCTA';
import { CATEGORIES, GALLERY_IMAGES } from '@/components/gallery/data';
import type { GalleryCategory, GalleryImage } from '@/components/gallery/types';

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<GalleryCategory>('all');
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);
  const [imageIndex, setImageIndex] = useState(0);

  // Filter images based on active category
  const filteredImages =
    activeCategory === 'all'
      ? GALLERY_IMAGES
      : GALLERY_IMAGES.filter((img) => img.category === activeCategory);

  // Open lightbox with selected image
  const openLightbox = (image: GalleryImage) => {
    setSelectedImage(image);
    const index = filteredImages.findIndex((img) => img.id === image.id);
    setImageIndex(index);
  };

  // Close lightbox
  const closeLightbox = () => {
    setSelectedImage(null);
  };

  // Navigate between images in lightbox
  const navigateImage = (direction: 'prev' | 'next') => {
    const newIndex =
      direction === 'next'
        ? (imageIndex + 1) % filteredImages.length
        : (imageIndex - 1 + filteredImages.length) % filteredImages.length;
    setImageIndex(newIndex);
    setSelectedImage(filteredImages[newIndex]);
  };

  return (
    <div className="min-h-screen bg-ivory">
      {/* Hero Section */}
      <GalleryHero />

      {/* Category Filter */}
      <CategoryFilter
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {/* Gallery Grid */}
      <GalleryGrid
        images={filteredImages}
        activeCategory={activeCategory}
        onImageClick={openLightbox}
      />

      {/* Lightbox */}
      <GalleryLightbox
        selectedImage={selectedImage}
        imageIndex={imageIndex}
        totalImages={filteredImages.length}
        onClose={closeLightbox}
        onNavigate={navigateImage}
      />

      {/* CTA Section */}
      <GalleryCTA />
    </div>
  );
}