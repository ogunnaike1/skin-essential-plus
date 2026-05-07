'use client';

import { GalleryHero } from '@/components/gallery/GalleryHero';
import { GalleryShowcase } from '@/components/gallery/GalleryShowcase';
import { GalleryResults } from '@/components/gallery/GalleryResults';
import { GalleryCTA } from '@/components/gallery/GalleryCTA';

export default function GalleryPage() {
  return (
    <div className="min-h-screen bg-ivory">
      <GalleryHero />
      <GalleryShowcase />
      <GalleryResults />
      <GalleryCTA />
    </div>
  );
}
