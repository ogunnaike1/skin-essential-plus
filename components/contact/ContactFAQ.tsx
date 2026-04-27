"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, HelpCircle } from "lucide-react";
import { useState } from "react";

const FAQS = [
  {
    question: "Do I need to book an appointment?",
    answer: "While walk-ins are welcome, we highly recommend booking in advance to secure your preferred time slot. You can book online, call us, or send us a message through the contact form.",
  },
  {
    question: "What should I bring to my first appointment?",
    answer: "Just bring yourself! We provide everything you'll need including robes, slippers, and towels. If you have any specific skin concerns or allergies, please mention them when booking.",
  },
  {
    question: "How early should I arrive?",
    answer: "Please arrive 10-15 minutes before your appointment time. This gives you time to complete any necessary forms, change into a robe, and relax before your treatment begins.",
  },
  {
    question: "What is your cancellation policy?",
    answer: "We require at least 24 hours notice for cancellations or rescheduling. Cancellations made with less than 24 hours notice may incur a 50% charge of the service price.",
  },
  {
    question: "Do you offer gift certificates?",
    answer: "Yes! Gift certificates are available for any amount or specific treatments. They make perfect gifts and can be purchased in-person, by phone, or through our online shop.",
  },
  {
    question: "Are your products available for purchase?",
    answer: "Absolutely. All products used during treatments are available in our retail section. Our specialists can recommend the best products for your skin type and concerns.",
  },
];

export function ContactFAQ(): React.ReactElement {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  return (
    <section className="relative py-16 sm:py-20 bg-sage">
      <div className="mx-auto max-w-[900px] px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-2 mb-4">
              <HelpCircle className="h-4 w-4 text-ivory" strokeWidth={1.5} />
              <span className="eyebrow text-ivory text-[10px]">— Common questions</span>
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-ivory leading-tight tracking-tight mb-4">
              Frequently asked <em className="not-italic text-deep">questions</em>
            </h2>
            <p className="text-sm sm:text-base font-light text-ivory max-w-2xl mx-auto">
              Can't find what you're looking for? Send us a message and we'll get back to you shortly.
            </p>
          </div>

          <div className="space-y-3">
            {FAQS.map((faq, idx) => {
              const isExpanded = expandedIndex === idx;

              return (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{
                    duration: 0.4,
                    delay: idx * 0.05,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="rounded-2xl border-2 border-ivory overflow-hidden transition-colors duration-300 hover:border-ivory shadow-[0_8px_24px_rgba(252,251,252,0.2)]"
                >
                  <button
                    type="button"
                    onClick={() => setExpandedIndex(isExpanded ? null : idx)}
                    className="w-full flex items-center justify-between gap-4 p-5 sm:p-6 bg-ivory text-left"
                  >
                    <h3 className="font-display text-lg sm:text-xl font-light text-deep leading-tight tracking-tight pr-4">
                      {faq.question}
                    </h3>
                    <ChevronDown
                      className={`h-5 w-5 shrink-0 text-deep transition-transform duration-300 ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                      strokeWidth={1.5}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 sm:px-6 pb-5 sm:pb-6 border-t border-deep/10">
                          <p className="pt-4 text-sm sm:text-base font-light text-deep leading-relaxed">
                            {faq.answer}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}