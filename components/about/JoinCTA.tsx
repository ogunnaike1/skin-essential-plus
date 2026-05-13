"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, CalendarCheck, MapPin } from "lucide-react";
import Image from "next/image";

export function JoinCTA(): React.ReactElement {
  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-ivory">
      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] shadow-[0_40px_90px_rgba(71,103,106,0.22)]"
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?w=2400&q=90&auto=format&fit=crop"
              alt=""
              fill
              sizes="100vw"
              className="object-cover"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(135deg, rgba(71,103,106,0.92) 0%, rgba(71,103,106,0.75) 45%, rgba(138,111,136,0.55) 100%)",
              }}
            />
          </div>

          {/* Orbs */}
          <div
            className="absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full blur-3xl opacity-40 animate-float pointer-events-none"
            style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
            aria-hidden
          />
          <div
            className="absolute -bottom-40 right-[-8%] h-[500px] w-[500px] rounded-full blur-3xl opacity-35 animate-float pointer-events-none"
            style={{
              background: "radial-gradient(circle, #4F7288 0%, transparent 70%)",
              animationDelay: "2s",
            }}
            aria-hidden
          />

          {/* Noise */}
          <div
            className="absolute inset-0 opacity-[0.05] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
            aria-hidden
          />

          {/* Palette accent strip top */}
          <div className="absolute top-0 inset-x-0 flex h-1">
            <span className="flex-1" style={{ backgroundColor: "#8A6F88" }} />
            <span className="flex-1" style={{ backgroundColor: "#4F7288" }} />
            <span className="flex-1" style={{ backgroundColor: "#FCFBFC" }} />
            <span className="flex-1" style={{ backgroundColor: "#47676A" }} />
          </div>

          <div className="relative px-8 sm:px-16 lg:px-20 py-20 sm:py-28 lg:py-32">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
              {/* Main copy */}
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-ivory/10 backdrop-blur-md border border-ivory/20 mb-8"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-mauve animate-pulse-soft" />
                  <span className="eyebrow text-mauve text-[10px]">
                    Limited slots this season
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-5xl sm:text-6xl lg:text-7xl xl:text-[5.5rem] font-light text-ivory leading-[0.95] tracking-[-0.02em] text-balance"
                >
                  Now you know us. <br />
                  We'd love to{" "}
                  <em className="not-italic text-mauve">know you</em>.
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-7 text-base sm:text-lg font-light text-ivory leading-[1.65] max-w-xl text-balance"
                >
                  Start with a complimentary 45-minute consultation. No commitment — just a conversation about your skin, your goals, and how we might serve them.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-10 flex flex-wrap items-center gap-3"
                >
                  <button
                    type="button"
                    className="group relative inline-flex items-center gap-2 pl-6 pr-1.5 py-1.5 rounded-full bg-ivory text-deep font-sans text-[11px] uppercase tracking-[0.22em] shadow-[0_4px_30px_rgba(252,251,252,0.25)] hover:shadow-[0_8px_40px_rgba(138,111,136,0.5)] transition-all duration-500"
                  >
                    <CalendarCheck className="h-4 w-4" />
                    <span>Book an Appointment</span>
                    <span className="h-9 w-9 rounded-full bg-deep text-ivory flex items-center justify-center transition-all duration-500 group-hover:bg-mauve group-hover:rotate-[22deg]">
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.75} />
                    </span>
                  </button>
                  <button
                    type="button"
                    className="group inline-flex items-center gap-2 px-5 py-3 rounded-full border border-ivory/30 text-ivory font-sans text-[11px] uppercase tracking-[0.22em] hover:bg-ivory/10 hover:border-ivory/60 transition-all duration-500"
                  >
                    <MapPin className="h-3.5 w-3.5" />
                    <span>Visit the sanctuary</span>
                  </button>
                </motion.div>
              </div>

              {/* Right info card */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5"
              >
                <div
                  className="relative rounded-[1.75rem] p-8 border overflow-hidden"
                  style={{
                    background: "rgba(252, 251, 252, 0.1)",
                    backdropFilter: "blur(20px) saturate(140%)",
                    WebkitBackdropFilter: "blur(20px) saturate(140%)",
                    borderColor: "rgba(252, 251, 252, 0.25)",
                    boxShadow: "inset 0 1px 0 rgba(255,255,255,0.25)",
                  }}
                >
                  <span className="eyebrow text-mauve text-[10px] block mb-6">
                    — What to expect
                  </span>

                  <ul className="space-y-5">
                    {[
                      {
                        label: "A conversation, not a sales pitch",
                        detail: "45 minutes, complimentary",
                        color: "#8A6F88",
                      },
                      {
                        label: "A look at your skin under clinical light",
                        detail: "Honest observations, no pressure",
                        color: "#4F7288",
                      },
                      {
                        label: "A ritual recommendation — or not",
                        detail: "We'll say so if you don't need one",
                        color: "#FCFBFC",
                      },
                    ].map((item) => (
                      <li key={item.label} className="flex gap-4">
                        <span
                          className="mt-2 h-2 w-2 rounded-full shrink-0"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          <p className="text-sm font-light text-ivory leading-snug">
                            {item.label}
                          </p>
                          <p className="mt-1 text-[11px] font-sans uppercase tracking-[0.2em] text-ivory/85">
                            {item.detail}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 pt-6 border-t border-ivory/15">
                    <p className="eyebrow text-mauve text-[10px] mb-2">
                      — Open
                    </p>
                    <p className="font-display text-lg font-light text-ivory">
                      Mon–Sat · 10:00 AM – 8:00 PM
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}