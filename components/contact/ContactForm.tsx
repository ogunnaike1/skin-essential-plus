"use client";

import { motion } from "framer-motion";
import { Send, Sparkles, AlertCircle } from "lucide-react";
import { useState } from "react";

export function ContactForm(): React.ReactElement {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    serviceInterest: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to send message");
      }

      // Success!
      setIsSuccess(true);
      setIsSubmitting(false);

      // Reset form after 3 seconds
      setTimeout(() => {
        setFormData({ 
          name: "", 
          email: "", 
          phone: "", 
          serviceInterest: "", 
          message: "" 
        });
        setIsSuccess(false);
      }, 3000);
    } catch (err) {
      console.error("Form submission error:", err);
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
      setIsSubmitting(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError(null);
  };

  return (
    <section id="contact-form" className="relative py-16 sm:py-20 bg-mauve">
      <div className="mx-auto max-w-[900px] px-6 sm:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="text-center mb-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <span className="h-1 w-8 rounded-full bg-ivory" />
              <span className="h-1 w-8 rounded-full bg-sage" />
              <span className="h-1 w-8 rounded-full bg-deep" />
            </div>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-light text-ivory leading-tight tracking-tight mb-4">
              Send us a <em className="not-italic text-sage">message</em>
            </h2>
            <p className="text-sm sm:text-base font-light text-ivory max-w-xl mx-auto">
              Fill out the form below and we'll get back to you within 24 hours.
            </p>
          </div>

          <div className="relative rounded-3xl overflow-hidden bg-ivory shadow-[0_20px_60px_rgba(71,103,106,0.3)] border-2 border-ivory">
            <div className="flex h-2">
              <span className="flex-1 bg-mauve" />
              <span className="flex-1 bg-sage" />
              <span className="flex-1 bg-deep" />
            </div>

            <form onSubmit={handleSubmit} className="p-6 sm:p-8 lg:p-10">
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 p-4 rounded-xl bg-red-50 border-2 border-red-200 flex items-start gap-3"
                >
                  <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-red-900">Failed to send message</p>
                    <p className="text-xs text-red-700 mt-1">{error}</p>
                  </div>
                </motion.div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label htmlFor="name" className="eyebrow text-deep text-[9px] block mb-2">
                    — Your name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Ada Okafor"
                    disabled={isSubmitting}
                    className="w-full h-12 px-4 rounded-full bg-mauve-tint border-2 border-transparent text-deep placeholder:text-deep/50 text-sm font-light focus:border-mauve focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="eyebrow text-deep text-[9px] block mb-2">
                    — Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder="ada@example.com"
                    disabled={isSubmitting}
                    className="w-full h-12 px-4 rounded-full bg-mauve-tint border-2 border-transparent text-deep placeholder:text-deep/50 text-sm font-light focus:border-mauve focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
                <div>
                  <label htmlFor="phone" className="eyebrow text-deep text-[9px] block mb-2">
                    — Phone number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 (0) 901 234 5678"
                    disabled={isSubmitting}
                    className="w-full h-12 px-4 rounded-full bg-sage-tint border-2 border-transparent text-deep placeholder:text-deep/50 text-sm font-light focus:border-sage focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  />
                </div>
                <div>
                  <label htmlFor="serviceInterest" className="eyebrow text-deep text-[9px] block mb-2">
                    — I'm interested in
                  </label>
                  <select
                    id="serviceInterest"
                    name="serviceInterest"
                    value={formData.serviceInterest}
                    onChange={handleChange}
                    disabled={isSubmitting}
                    className="w-full h-12 px-4 rounded-full bg-sage-tint border-2 border-transparent text-deep text-sm font-medium appearance-none cursor-pointer focus:border-sage focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">Select a service</option>
                    <option value="Facial Treatments">Facial Treatments</option>
                    <option value="Body Treatments">Body Treatments</option>
                    <option value="Nail Care">Nail Care</option>
                    <option value="Waxing & Hair Removal">Waxing & Hair Removal</option>
                    <option value="Product Inquiry">Product Inquiry</option>
                    <option value="Free Consultation">Free Consultation</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mb-6">
                <label htmlFor="message" className="eyebrow text-deep text-[9px] block mb-2">
                  — Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={6}
                  placeholder="Tell us how we can help..."
                  disabled={isSubmitting}
                  className="w-full px-4 py-3 rounded-2xl bg-deep-tint border-2 border-transparent text-deep placeholder:text-deep/50 text-sm font-light focus:border-deep focus:outline-none transition-colors resize-none disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-4">
                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-deep text-ivory text-[11px] uppercase tracking-[0.2em] font-medium transition-all duration-300 hover:bg-deep-dark disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                      </motion.div>
                      Sending...
                    </>
                  ) : isSuccess ? (
                    <>
                      <Sparkles className="h-4 w-4" strokeWidth={1.5} />
                      Message sent!
                    </>
                  ) : (
                    <>
                      <Send className="h-4 w-4" strokeWidth={1.5} />
                      Send message
                    </>
                  )}
                </button>
                {isSuccess && (
                  <motion.p
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="text-sm font-light text-sage"
                  >
                    Thank you! We'll be in touch soon.
                  </motion.p>
                )}
              </div>

              <p className="mt-6 text-[11px] font-light text-deep text-center">
                We respect your privacy. Your information will never be shared with third parties.
              </p>
            </form>
          </div>
        </motion.div>
      </div>
    </section>
  );
}