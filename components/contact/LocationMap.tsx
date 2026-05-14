"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Navigation, Phone } from "lucide-react";

export function LocationMap(): React.ReactElement {
  const locationDetails = [
    {
      icon: MapPin,
      label: "Address",
      value: "No 2, Alaafia Avenue\nOpposite IDC Primary School\nAkobo, Ibadan",
      color: "mauve" as const,
    },
    {
      icon: Clock,
      label: "Hours",
      value: "Monday – Saturday\n10:00 AM – 8:00 PM\nSunday: Closed",
      color: "sage" as const,
    },
    {
      icon: Phone,
      label: "Reception",
      value: "+234 814 830 3684\nskinessentialsp@gmail.com",
      color: "deep" as const,
    },
  ];

  return (
    <section className="relative py-16 sm:py-20 bg-deep-tint">
      <div className="mx-auto max-w-[1400px] px-6 sm:px-10 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-mauve" strokeWidth={1.5} />
              <span className="eyebrow text-mauve text-[10px]">— Visit us</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-deep leading-tight tracking-tight mb-4">
              Our <em className="not-italic text-deep">location</em>
            </h2>
            <p className="text-sm sm:text-base font-light text-deep max-w-2xl mx-auto">
              Find us in Akobo, Ibadan. Walk-ins welcome, but appointments are recommended.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            <div className="lg:col-span-2 rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(71,103,106,0.12)] border-2 border-deep/10">
              <div className="relative aspect-[16/10]">
                <iframe
                  src="https://www.openstreetmap.org/export/embed.html?bbox=3.9193%2C7.4127%2C3.9593%2C7.4427&layer=mapnik&marker=7.4277%2C3.9393"
                  className="absolute inset-0 h-full w-full"
                  loading="lazy"
                  title="Skin Essential Plus location — Akobo, Ibadan"
                />
              </div>
            </div>

            <div className="space-y-4">
              {locationDetails.map((detail, idx) => {
                const Icon = detail.icon;
                const accentTint = detail.color === "mauve" ? "bg-mauve-tint" : detail.color === "sage" ? "bg-sage-tint" : "bg-deep-tint";
                const accentText = detail.color === "mauve" ? "text-mauve" : detail.color === "sage" ? "text-sage" : "text-deep";

                return (
                  <motion.div
                    key={detail.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.5, delay: idx * 0.1, ease: [0.16, 1, 0.3, 1] }}
                    className="p-5 rounded-2xl bg-ivory border-2 border-deep/10 shadow-[0_8px_24px_rgba(71,103,106,0.08)]"
                  >
                    <div className={`inline-flex h-10 w-10 rounded-xl items-center justify-center mb-3 ${accentTint}`}>
                      <Icon className={`h-4 w-4 ${accentText}`} strokeWidth={1.5} />
                    </div>
                    <p className="eyebrow text-deep text-[9px] mb-2">— {detail.label}</p>
                    <p className="text-sm font-light text-deep whitespace-pre-line leading-relaxed">{detail.value}</p>
                  </motion.div>
                );
              })}

              <motion.a
                href="https://maps.google.com/?q=No+2+Alaafia+Avenue+Akobo+Ibadan+Nigeria"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-deep text-ivory text-[11px] uppercase tracking-[0.2em] font-medium hover:bg-deep-dark transition-colors"
              >
                <Navigation className="h-3.5 w-3.5" strokeWidth={1.5} />
                Navigate to spa
              </motion.a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}