"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import Image from "next/image";

export function FounderLetter(): React.ReactElement {
  return (
    <section className="relative py-24 sm:py-36 overflow-hidden bg-deep">
      {/* Ambient orbs in palette colors */}
      <div
        className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
        aria-hidden
      />
      <div
        className="absolute -bottom-40 -right-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, #4F7288 0%, transparent 70%)" }}
        aria-hidden
      />

      {/* Noise overlay */}
      <div
        className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
        aria-hidden
      />

      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 sm:mb-20 text-center"
        >
          <span className="eyebrow text-mauve text-[11px] block mb-5">
            — Chapter Four
          </span>
          <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.02] tracking-tight text-ivory text-balance">
            A Personal Note from Our Founder.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Portrait card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative flex flex-col"
          >
            <div className="relative flex-1 min-h-[480px] rounded-[2rem] overflow-hidden shadow-[0_30px_70px_rgba(0,0,0,0.25)]">
              <Image
                src="/ceo-skinessential.jpg"
                alt="Ifeoluwa Peters Kanyinsola, founder of Skin Essential Plus"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-deep/80 via-deep/20 to-transparent" />

              {/* Name card overlay */}
              <div className="absolute bottom-6 left-6 right-6">
                <div
                  className="rounded-2xl p-5 border"
                  style={{
                    background: "rgba(252, 251, 252, 0.12)",
                    backdropFilter: "blur(20px) saturate(140%)",
                    WebkitBackdropFilter: "blur(20px) saturate(140%)",
                    borderColor: "rgba(252, 251, 252, 0.25)",
                  }}
                >
                  <span className="eyebrow text-mauve text-[10px]">
                    — Founder & Lead Clinician
                  </span>
                  <p className="mt-2 font-display text-3xl font-light text-ivory leading-tight">
                   Ifeoluwa Peters Kanyinsola
                  </p>
                  <p className="mt-1 text-sm font-light text-ivory">
                    MBBS, MSc Dermatology
                  </p>
                </div>
              </div>
            </div>

            {/* Credentials strip */}
            <div className="mt-6 grid grid-cols-3 gap-3">
              {[
                { label: "Years", value: "6+", color: "#8A6F88" },
                { label: "Trained", value: "Lagos", color: "#4F7288" },
                { label: "Certified", value: "AAD", color: "#FCFBFC" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="rounded-2xl p-4 border border-ivory/15"
                  style={{ background: "rgba(252, 251, 252, 0.05)" }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <span
                      className="h-1.5 w-1.5 rounded-full"
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="eyebrow text-ivory/85 text-[9px]">
                      {item.label}
                    </span>
                  </div>
                  <p className="font-display text-xl font-light text-ivory">
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Letter card — warm ivory/mauve gradient */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 relative"
          >
            <div
              className="relative h-full rounded-[2rem] p-10 sm:p-12 lg:p-14 overflow-hidden border border-mauve/30 shadow-[0_30px_70px_rgba(0,0,0,0.2)]"
              style={{
                background:
                  "linear-gradient(135deg, #FCFBFC 0%, #FCFBFC 40%, rgba(138,111,136,0.3) 100%)",
              }}
            >
              {/* Giant quote mark */}
              <Quote
                className="absolute top-8 right-10 h-24 w-24 text-mauve/20"
                strokeWidth={1}
              />

              {/* Corner palette swatch decoration */}
              <div className="absolute top-0 left-0 flex">
                <span className="h-1 w-16 bg-mauve" />
                <span className="h-1 w-16 bg-sage" />
                <span className="h-1 w-16 bg-deep" />
              </div>

              <div className="relative">
                <span className="eyebrow text-mauve text-[10px] block mb-6">
                  — Skin Essential Plus
                </span>

                <div className="space-y-5 text-base sm:text-lg font-light text-deep/80 leading-[1.75]">
                  <p className="font-display text-2xl sm:text-3xl font-light text-deep leading-[1.3] italic">
                    Friend,
                  </p>
                  <p>
                    My foundation in dermatology taught me early on that true beauty isn't superficial; it's a profound reflection of your internal health and self-respect.
                  </p>
                  <p>
                    When I created Skin Essential Plus, it was to move away from overly sterile medical protocols towards a more personalized, holistic approach. My time in clinical practice showed me that every person's skin is entirely unique, requiring far more than just generic rules and one-size-fits-all treatments.
                  </p>
                  <p>
                    We use our medical expertise not as a shield, but as a map—a detailed understanding of cellular health to guide you through intentional, supportive skincare routines that actually work for your daily life. Every ingredient, every formula, and every step we recommend is selected with a single purpose: to build a bridge between science and soul.
                  </p>
                  <p className="text-deep/90">
                    Thank you for trusting us with something as precious as your skin. We do not take this lightly.
                  </p>
                </div>

                {/* Signature */}
                <div className="mt-10 pt-8 border-t border-deep/15 flex items-center justify-between">
                  <div>
                    <p className="font-display text-3xl sm:text-4xl italic font-light text-deep leading-none">
                      Ifeoluwa
                    </p>
                    <p className="mt-3 text-xs font-sans uppercase tracking-[0.25em] text-mauve">
                     Ifeoluwa Peters Kanyinsola · Founder
                    </p>
                  </div>

                  {/* Decorative palette dots */}
                  <div className="flex items-center gap-1.5">
                    {["#8A6F88", "#4F7288", "#47676A"].map((c) => (
                      <span
                        key={c}
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: c }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}