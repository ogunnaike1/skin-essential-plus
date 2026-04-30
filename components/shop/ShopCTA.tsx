"use client";

import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Mail,
  Package,
  Sparkles,
  Truck,
  AlertCircle,
} from "lucide-react";
import { useState } from "react";

import { cn } from "@/lib/utils";

const PERKS = [
  {
    icon: Sparkles,
    label: "First access",
    detail: "Be first to try new formulations",
  },
  {
    icon: Truck,
    label: "Complimentary shipping",
    detail: "On orders over ₦50,000",
  },
  {
    icon: Package,
    label: "Personal guidance",
    detail: "Skincare routine from our clinicians",
  },
];

export function ShopCTA(): React.ReactElement {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus('loading');
    setErrorMessage('');

    try {
      const response = await fetch('/api/newsletter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to subscribe');
      }

      setStatus('success');
      setEmail('');

      // Reset success state after 5 seconds
      setTimeout(() => {
        setStatus('idle');
      }, 5000);
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || 'Something went wrong. Please try again.');

      // Reset error state after 5 seconds
      setTimeout(() => {
        setStatus('idle');
        setErrorMessage('');
      }, 5000);
    }
  };

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden bg-ivory">
      <div className="relative mx-auto max-w-[1600px] px-6 sm:px-10 lg:px-14">
        {/* Outer card */}
        <motion.div
          initial={{ opacity: 1, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative overflow-hidden rounded-[2.5rem] bg-deep shadow-[0_40px_90px_rgba(53,79,82,0.3)]"
        >
          {/* Top stripe */}
          <div className="absolute top-0 inset-x-0 flex h-1.5 z-10">
            <span className="flex-1 bg-mauve" />
            <span className="flex-1 bg-sage" />
            <span className="flex-1 bg-ivory" />
            <span className="flex-1 bg-mauve" />
          </div>

          {/* Bottom stripe */}
          <div className="absolute bottom-0 inset-x-0 flex h-1.5 z-10">
            <span className="flex-1 bg-mauve" />
            <span className="flex-1 bg-ivory" />
            <span className="flex-1 bg-sage" />
            <span className="flex-1 bg-mauve" />
          </div>

          {/* Noise texture for depth */}
          <div
            className="absolute inset-0 opacity-[0.04] mix-blend-overlay pointer-events-none"
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='3'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
            }}
            aria-hidden
          />

          <div className="relative px-6 sm:px-12 lg:px-20 py-16 sm:py-20 lg:py-24">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
              {/* LEFT — copy + form */}
              <div className="lg:col-span-7">
                <motion.div
                  initial={{ opacity: 1, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-mauve mb-8"
                >
                  <Sparkles className="h-3 w-3 text-ivory" strokeWidth={1.75} />
                  <span className="text-[10px] uppercase tracking-[0.2em] font-medium text-ivory">
                    Exclusive member perks
                  </span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 1, y: 26 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-[4.5rem] font-light text-ivory leading-[1] tracking-[-0.02em] text-balance"
                >
                  Join the{" "}
                  <em className="not-italic text-mauve">Essential</em> list.
                </motion.h2>

                <motion.p
                  initial={{ opacity: 1, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-7 text-base sm:text-lg font-light text-ivory leading-[1.65] max-w-xl text-balance"
                >
                  Be the first to hear about new formulations, seasonal rituals, and members-only editions. Receive personalized skincare guidance and exclusive perks with your first order.
                </motion.p>

                {/* Form or success state */}
                <motion.div
                  initial={{ opacity: 1, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  className="mt-10"
                >
                  {status === 'success' ? (
                    <div className="inline-flex items-center gap-3 px-6 py-4 rounded-full bg-sage border-2 border-sage">
                      <div className="h-8 w-8 rounded-full bg-ivory flex items-center justify-center">
                        <Sparkles
                          className="h-4 w-4 text-sage"
                          strokeWidth={2}
                        />
                      </div>
                      <div className="text-left">
                        <p className="text-[11px] uppercase tracking-[0.15em] text-ivory font-medium">
                          You're in
                        </p>
                        <p className="text-xs font-light text-ivory">
                          Check your inbox for your welcome letter.
                        </p>
                      </div>
                    </div>
                  ) : (
                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col sm:flex-row items-stretch gap-2 max-w-xl"
                    >
                      <div className="flex-1 relative">
                        <Mail
                          className="absolute left-5 top-1/2 -translate-y-1/2 h-4 w-4 text-mauve pointer-events-none"
                          strokeWidth={1.5}
                        />
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="Your email address"
                          disabled={status === 'loading'}
                          className="w-full h-14 pl-12 pr-5 rounded-full bg-ivory text-deep placeholder:text-deep/50 text-sm font-light focus:outline-none focus:ring-2 focus:ring-mauve transition-all disabled:opacity-50"
                          aria-label="Email address"
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={status === 'loading'}
                        className="group inline-flex items-center justify-center gap-2 pl-6 pr-1.5 h-14 rounded-full bg-mauve text-ivory font-sans text-[11px] uppercase tracking-[0.22em] font-medium hover:bg-ivory hover:text-deep transition-colors duration-300 whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <span>{status === 'loading' ? 'Subscribing...' : 'Subscribe'}</span>
                        <span className="h-11 w-11 rounded-full bg-ivory text-mauve flex items-center justify-center transition-colors duration-300 group-hover:bg-deep group-hover:text-ivory">
                          {status === 'loading' ? (
                            <span className="h-4 w-4 border-2 border-mauve/30 border-t-mauve rounded-full animate-spin" />
                          ) : (
                            <ArrowUpRight className="h-4 w-4" strokeWidth={1.75} />
                          )}
                        </span>
                      </button>
                    </form>
                  )}

                  {/* Error Message */}
                  {status === 'error' && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-4 p-4 bg-red-100 border border-red-300 rounded-2xl"
                    >
                      <p className="text-sm text-red-700 font-medium flex items-center gap-2">
                        <AlertCircle className="h-4 w-4" />
                        {errorMessage}
                      </p>
                    </motion.div>
                  )}

                  {/* Fine print */}
                  <p className="mt-4 text-[11px] text-ivory font-light">
                    No spam, ever. One thoughtful letter per month, unsubscribe anytime.
                  </p>
                </motion.div>
              </div>

              {/* RIGHT — perks list */}
              <motion.div
                initial={{ opacity: 1, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.9, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                className="lg:col-span-5 space-y-3"
              >
                {PERKS.map((perk, i) => {
                  const Icon = perk.icon;
                  const palette = ["mauve", "sage", "ivory"] as const;
                  const accent = palette[i % palette.length]!;
                  const iconBg: Record<typeof accent, string> = {
                    mauve: "bg-mauve text-ivory",
                    sage: "bg-sage text-ivory",
                    ivory: "bg-ivory text-deep",
                  };
                  return (
                    <motion.div
                      key={i}
                      initial={{ opacity: 1, x: 20 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.6,
                        delay: 0.55 + i * 0.1,
                        ease: [0.16, 1, 0.3, 1],
                      }}
                      className="flex items-start gap-4 p-5 rounded-2xl bg-deep-dark border border-ivory/10"
                    >
                      <div
                        className={cn(
                          "shrink-0 h-11 w-11 rounded-xl flex items-center justify-center",
                          iconBg[accent]
                        )}
                      >
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-display text-lg font-light text-ivory leading-tight mb-0.5">
                          {perk.label}
                        </p>
                        <p className="text-xs font-light text-ivory leading-relaxed">
                          {perk.detail}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}

                {/* Trust line */}
                <div className="flex items-center gap-2 pt-4 pl-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-mauve animate-pulse-soft" />
                  <span className="text-[10px] uppercase tracking-[0.2em] text-ivory font-medium">
                    Joined by 12,400+ skin lovers
                  </span>
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}