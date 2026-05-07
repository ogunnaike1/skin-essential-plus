"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

const WHATSAPP_NUMBER = "2348148303684";
const WHATSAPP_MESSAGE = "Hello! I'd like to book an appointment at Skin Essential Plus.";

export function WhatsAppButton() {
  const [hovered, setHovered] = useState(false);

  const href = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center justify-end gap-3">
      {/* Tooltip label */}
      <AnimatePresence>
        {hovered && (
          <motion.span
            initial={{ opacity: 0, x: 8, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8, scale: 0.95 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="whitespace-nowrap rounded-full bg-[#25D366] px-4 py-2 text-[11px] font-medium uppercase tracking-[0.15em] text-white shadow-lg"
          >
            Chat with us
          </motion.span>
        )}
      </AnimatePresence>

      {/* Button */}
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-[0_4px_24px_rgba(37,211,102,0.45)] transition-shadow hover:shadow-[0_8px_32px_rgba(37,211,102,0.6)]"
      >
        {/* Ping ring */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] animate-ping opacity-30" />
        {/* WhatsApp SVG */}
        <svg
          viewBox="0 0 32 32"
          className="relative h-7 w-7"
          fill="white"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M16 2C8.268 2 2 8.268 2 16c0 2.49.65 4.83 1.79 6.86L2 30l7.35-1.77A13.94 13.94 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2Zm0 25.5a11.45 11.45 0 0 1-5.83-1.59l-.42-.25-4.36 1.05 1.08-4.25-.28-.44A11.5 11.5 0 1 1 16 27.5Zm6.3-8.62c-.34-.17-2.02-.99-2.34-1.1-.31-.11-.54-.17-.77.17-.23.34-.88 1.1-1.08 1.33-.2.22-.4.25-.74.08-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.01-1.9-2.35-.2-.34-.02-.52.15-.69.15-.15.34-.4.51-.6.17-.2.22-.34.34-.57.11-.23.06-.43-.03-.6-.08-.17-.77-1.85-1.05-2.54-.28-.67-.56-.58-.77-.59h-.65c-.23 0-.6.08-.91.4-.31.32-1.2 1.17-1.2 2.85s1.23 3.3 1.4 3.53c.17.22 2.41 3.68 5.84 5.16.82.35 1.45.56 1.95.72.82.26 1.57.22 2.16.13.66-.1 2.02-.82 2.3-1.62.29-.8.29-1.48.2-1.62-.08-.14-.31-.22-.65-.39Z" />
        </svg>
      </motion.a>
    </div>
  );
}
