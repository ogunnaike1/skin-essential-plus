"use client";

import { motion } from "framer-motion";
import { Clock, Mail, MapPin, Phone } from "lucide-react";

import { SectionHeading } from "@/components/ui/SectionHeading";
import { SITE } from "@/lib/constants";

interface ContactLineProps {
  icon: typeof MapPin;
  label: string;
  value: string;
  href?: string;
  delay: number;
}

function ContactLine({
  icon: Icon,
  label,
  value,
  href,
  delay,
}: ContactLineProps): React.ReactElement {
  const content = (
    <div className="group flex items-start gap-4 py-5 border-b border-deep/10 last:border-0">
      <div className="h-11 w-11 flex-shrink-0 rounded-full bg-ivory border border-deep/15 flex items-center justify-center shadow-glass transition-all duration-500 group-hover:bg-deep group-hover:border-deep">
        <Icon
          className="h-4 w-4 text-deep transition-colors duration-500 group-hover:text-ivory"
          strokeWidth={1.5}
        />
      </div>
      <div>
        <p className="eyebrow text-mauve mb-1">{label}</p>
        <p className="text-deep font-light text-base leading-relaxed">
          {value}
        </p>
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.6, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {href ? (
        <a href={href} className="block">
          {content}
        </a>
      ) : (
        content
      )}
    </motion.div>
  );
}

export function Contact(): React.ReactElement {
  return (
    <section
      id="contact"
      className="relative py-24 sm:py-32 section-padding overflow-hidden"
    >
      <div className="relative max-w-7xl mx-auto">
        <SectionHeading
          eyebrow="Visit Us"
          title="Step into the sanctuary."
          description="Our doors open onto a curated world of calm. We'd be delighted to welcome you."
          align="left"
        />

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative aspect-[4/3] lg:aspect-auto lg:min-h-[500px] rounded-3xl overflow-hidden shadow-glass-lg border border-white/50 bg-ivory"
          >
            <iframe
              src="https://www.openstreetmap.org/export/embed.html?bbox=3.4058%2C6.4230%2C3.4380%2C6.4400&layer=mapnik&marker=6.4315%2C3.4219"
              className="absolute inset-0 h-full w-full grayscale-[0.3] contrast-[0.95] saturate-[0.85]"
              style={{ filter: "hue-rotate(-10deg)" }}
              loading="lazy"
              title="Skin Essential Plus location"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-mauve/10 via-transparent to-sage/15 pointer-events-none" />
            <div className="absolute top-6 left-6 pointer-events-none">
              <div className="px-4 py-3 rounded-xl bg-ivory/90 backdrop-blur-xl border border-white/60 shadow-glass">
                <p className="eyebrow text-mauve mb-1">Visit</p>
                <p className="font-display text-lg text-deep leading-tight">
                  {SITE.name}
                </p>
              </div>
            </div>
          </motion.div>

          <div className="lg:col-span-5">
            <div className="rounded-3xl bg-ivory/50 backdrop-blur-xl border border-white/50 shadow-glass p-8 sm:p-10">
              <ContactLine
                icon={MapPin}
                label="Our Address"
                value={SITE.address}
                delay={0.1}
              />
              <ContactLine
                icon={Phone}
                label="Call Us"
                value={SITE.phone}
                href={`tel:${SITE.phone.replace(/\s/g, "")}`}
                delay={0.2}
              />
              <ContactLine
                icon={Mail}
                label="Write to Us"
                value={SITE.email}
                href={`mailto:${SITE.email}`}
                delay={0.3}
              />
              <ContactLine
                icon={Clock}
                label="Hours"
                value={SITE.hours}
                delay={0.4}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
