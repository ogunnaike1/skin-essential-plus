"use client";

import { motion } from "framer-motion";
import { ArrowRight, Check, Mail } from "lucide-react";
import { useState, type FormEvent } from "react";

export function Newsletter(): React.ReactElement {
  const [email, setEmail] = useState<string>("");
  const [submitted, setSubmitted] = useState<boolean>(false);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
    }, 4000);
  };

  return (
    <section className="relative py-24 sm:py-32 section-padding overflow-hidden">
      <div
        className="absolute inset-0 pointer-events-none opacity-60"
        style={{ background: "radial-gradient(ellipse at center, rgba(138,111,136,0.15) 0%, transparent 60%)" }}
        aria-hidden
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        className="relative max-w-3xl mx-auto text-center"
      >
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-ivory border border-white shadow-glow mb-8">
          <Mail className="h-5 w-5 text-deep" strokeWidth={1.5} />
        </div>

        <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-light text-deep leading-[1.05] tracking-tight text-balance">
          Letters from the sanctuary.
        </h2>
        <p className="mt-5 text-base sm:text-lg text-deep font-light max-w-xl mx-auto text-balance">
          Seasonal rituals, skin wisdom, and private invitations — delivered with intention, never excess.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-10 max-w-lg mx-auto"
          aria-label="Newsletter signup"
        >
          <div className="relative flex items-center bg-ivory/80 backdrop-blur-xl border border-white/60 rounded-full p-1.5 shadow-glass transition-all duration-500 focus-within:shadow-glow focus-within:border-mauve/50">
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@beautifulemail.com"
              className="flex-1 bg-transparent px-6 py-3 text-sm font-light text-deep placeholder:text-deep focus:outline-none"
              aria-label="Email address"
            />
            <button
              type="submit"
              disabled={submitted}
              className="group inline-flex items-center justify-center h-12 px-6 bg-deep text-ivory rounded-full text-[11px] uppercase tracking-[0.18em] transition-all duration-500 hover:bg-deep-dark hover:shadow-[0_0_30px_rgba(138,111,136,0.5)] disabled:opacity-80"
            >
              {submitted ? (
                <>
                  <Check className="h-4 w-4" />
                  <span className="ml-2">Welcomed</span>
                </>
              ) : (
                <>
                  <span>Subscribe</span>
                  <ArrowRight className="h-3.5 w-3.5 ml-2 transition-transform duration-500 group-hover:translate-x-0.5" />
                </>
              )}
            </button>
          </div>
          <p className="mt-5 text-xs text-deep font-light">
            No noise. Unsubscribe whenever. We respect your inbox.
          </p>
        </form>
      </motion.div>
    </section>
  );
}
