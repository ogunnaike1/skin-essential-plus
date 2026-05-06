// lib/cloudinary.ts
/**
 * Cloudinary helper utilities for Skin Essential Plus
 * Generates optimized image URLs with transformations
 */

const CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const BASE_URL = `https://res.cloudinary.com/${CLOUD_NAME}/image/upload`;

export interface CloudinaryOptions {
  width?: number;
  height?: number;
  crop?: 'fill' | 'fit' | 'scale' | 'crop' | 'thumb';
  quality?: 'auto' | number;
  format?: 'auto' | 'webp' | 'jpg' | 'png';
  gravity?: 'auto' | 'face' | 'center' | 'north' | 'south' | 'east' | 'west';
  blur?: number;
  sharpen?: boolean;
  dpr?: number; // Device pixel ratio (1.0, 2.0, 3.0)
}

/**
 * Generate Cloudinary image URL with transformations
 * 
 * @example
 * getCloudinaryUrl('products/serums/vitamin-c.jpg', { width: 800, height: 600 })
 * // Returns: https://res.cloudinary.com/[cloud]/image/upload/w_800,h_600,c_fill,q_auto,f_auto/products/serums/vitamin-c.jpg
 */
export function getCloudinaryUrl(
  publicId: string,
  options: CloudinaryOptions = {}
): string {
  if (!CLOUD_NAME) {
    console.error('NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME is not set');
    return '';
  }

  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
    gravity = 'auto',
    blur,
    sharpen,
    dpr,
  } = options;

  const transformations: string[] = [];

  // Dimensions
  if (width) transformations.push(`w_${width}`);
  if (height) transformations.push(`h_${height}`);
  if (width || height) transformations.push(`c_${crop}`);

  // Gravity (for cropping focus)
  if (gravity !== 'auto') transformations.push(`g_${gravity}`);

  // Quality & Format (always add these for optimization)
  transformations.push(`q_${quality}`);
  transformations.push(`f_${format}`);

  // Effects
  if (blur) transformations.push(`e_blur:${blur}`);
  if (sharpen) transformations.push('e_sharpen');

  // Device pixel ratio (for retina displays)
  if (dpr) transformations.push(`dpr_${dpr}`);

  const transformString = transformations.join(',');
  
  // Remove leading slash if present
  const cleanPublicId = publicId.startsWith('/') ? publicId.slice(1) : publicId;

  return `${BASE_URL}/${transformString}/${cleanPublicId}`;
}

/**
 * Preset transformations for common use cases
 */
export const cloudinaryPresets = {
  // Product images
  productThumbnail: (publicId: string) =>
    getCloudinaryUrl(publicId, { width: 400, height: 400, crop: 'fill', quality: 'auto' }),

  productCard: (publicId: string) =>
    getCloudinaryUrl(publicId, { width: 600, height: 450, crop: 'fill', quality: 'auto' }),

  productFull: (publicId: string) =>
    getCloudinaryUrl(publicId, { width: 1200, height: 900, crop: 'fit', quality: 'auto' }),

  // Service images
  serviceCard: (publicId: string) =>
    getCloudinaryUrl(publicId, { width: 800, height: 600, crop: 'fill', quality: 'auto' }),

  serviceHero: (publicId: string) =>
    getCloudinaryUrl(publicId, { width: 1600, height: 900, crop: 'fill', quality: 'auto' }),

  // Gallery images
  galleryThumbnail: (publicId: string) =>
    getCloudinaryUrl(publicId, { width: 400, height: 300, crop: 'fill', quality: 'auto' }),

  galleryLightbox: (publicId: string) =>
    getCloudinaryUrl(publicId, { width: 1920, height: 1080, crop: 'fit', quality: 'auto' }),

  // Homepage images
  heroImage: (publicId: string) =>
    getCloudinaryUrl(publicId, { width: 1920, height: 1080, crop: 'fill', quality: 'auto' }),

  aboutImage: (publicId: string) =>
    getCloudinaryUrl(publicId, { width: 1200, height: 800, crop: 'fill', quality: 'auto' }),

  // Profile/Avatar images
  avatar: (publicId: string) =>
    getCloudinaryUrl(publicId, { width: 200, height: 200, crop: 'thumb', gravity: 'face' }),

  // Logo/Branding
  logo: (publicId: string) =>
    getCloudinaryUrl(publicId, { width: 400, format: 'png', quality: 100 }),

  // Open Graph images (social sharing)
  ogImage: (publicId: string) =>
    getCloudinaryUrl(publicId, { width: 1200, height: 630, crop: 'fill', quality: 'auto' }),
};

/**
 * Get responsive srcset for Next.js Image component
 */
export function getCloudinarySrcSet(
  publicId: string,
  widths: number[] = [640, 750, 828, 1080, 1200, 1920, 2048, 3840]
): string {
  return widths
    .map((width) => {
      const url = getCloudinaryUrl(publicId, { width });
      return `${url} ${width}w`;
    })
    .join(', ');
}

/**
 * Generate blur placeholder for Next.js Image
 */
export function getCloudinaryBlurUrl(publicId: string): string {
  return getCloudinaryUrl(publicId, {
    width: 10,
    height: 10,
    blur: 1000,
    quality: 1,
  });
}