"use client";

import { motion } from "framer-motion";
import { Instagram as InstagramIcon } from "lucide-react";
import Image from "next/image";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { SOCIAL_IMAGES } from "@/lib/constants";
import type { SocialImage } from "@/types";

interface TileProps {
  image: SocialImage;
  index: number;
}

function Tile({ image, index }: TileProps): React.ReactElement {
  return (
    <motion.a
      href="#"
      initial={{ opacity: 0, scale: 0.92 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.6,
        delay: (index % 4) * 0.08,
        ease: [0.16, 1, 0.3, 1],
      }}
      className="group relative aspect-square overflow-hidden rounded-2xl"
      aria-label={`View ${image.alt} on Instagram`}
    >
      <Image
        src={image.src}
        alt={image.alt}
        fill
        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
        className="object-cover transition-transform duration-[1.2s] ease-cinematic group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-br from-deep/0 via-deep/0 to-deep/90 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
        <div className="h-12 w-12 rounded-full bg-ivory/95 backdrop-blur-md flex items-center justify-center transform scale-75 group-hover:scale-100 transition-transform duration-500 shadow-glow">
          <InstagramIcon className="h-5 w-5 text-deep" strokeWidth={1.5} />
        </div>
      </div>
    </motion.a>
  );
}

export function Instagram(): React.ReactElement {
  return (
    <section className="relative py-24 sm:py-32 section-padding overflow-hidden">
      <div className="relative max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="@skinessentialplus"
          title="Follow our daily rituals."
          description="A living journal of treatments, textures, and small moments of beauty — captured from behind our doors."
        />

        <div className="mt-16 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {SOCIAL_IMAGES.map((img, i) => (
            <Tile key={img.id} image={img} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 text-center"
        >
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="btn-outline"
          >
            <InstagramIcon className="h-4 w-4" />
            Follow us on Instagram
          </a>
        </motion.div>
      </div>
    </section>
  );
}
