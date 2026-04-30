// Gallery types
export type GalleryCategory = 'all' | 'treatments' | 'products' | 'ambiance' | 'results';

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  title: string;
  description?: string;
  span?: 'normal' | 'wide' | 'tall' | 'large';
}

export interface CategoryMeta {
  id: GalleryCategory;
  label: string;
  color: string;
}