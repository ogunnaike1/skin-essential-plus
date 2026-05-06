// components/shared/CloudinaryImage.tsx
"use client";

import Image from "next/image";
import { getCloudinaryUrl, getCloudinaryBlurUrl } from "@/lib/cloudinary";
import type { CloudinaryOptions } from "@/lib/cloudinary";

interface CloudinaryImageProps {
  src: string; // Cloudinary public ID (e.g., "products/serums/vitamin-c.jpg")
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  priority?: boolean;
  sizes?: string;
  quality?: number;
  cloudinaryOptions?: CloudinaryOptions;
}

/**
 * Cloudinary-optimized Next.js Image component
 * 
 * @example
 * <CloudinaryImage
 *   src="products/serums/vitamin-c-serum.jpg"
 *   alt="Vitamin C Serum"
 *   width={800}
 *   height={600}
 *   cloudinaryOptions={{ crop: 'fill', quality: 'auto' }}
 * />
 */
export function CloudinaryImage({
  src,
  alt,
  width,
  height,
  className,
  fill = false,
  priority = false,
  sizes,
  quality = 80,
  cloudinaryOptions = {},
}: CloudinaryImageProps) {
  // Generate optimized URL
  const imageUrl = getCloudinaryUrl(src, {
    width,
    height,
    quality: quality === 80 ? 'auto' : quality,
    format: 'auto',
    ...cloudinaryOptions,
  });

  // Generate blur placeholder
  const blurUrl = getCloudinaryBlurUrl(src);

  if (fill) {
    return (
      <Image
        src={imageUrl}
        alt={alt}
        fill
        className={className}
        priority={priority}
        sizes={sizes}
        placeholder="blur"
        blurDataURL={blurUrl}
      />
    );
  }

  return (
    <Image
      src={imageUrl}
      alt={alt}
      width={width}
      height={height}
      className={className}
      priority={priority}
      sizes={sizes}
      placeholder="blur"
      blurDataURL={blurUrl}
    />
  );
}