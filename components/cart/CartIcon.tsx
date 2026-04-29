"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/contexts/CartContext";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { motion, AnimatePresence } from "framer-motion";

export function CartIcon() {
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 rounded-full hover:bg-mauve-tint transition-colors"
        aria-label="Shopping cart"
      >
        <ShoppingBag className="h-5 w-5 text-deep" strokeWidth={1.5} />
        
        {/* Badge */}
        <AnimatePresence>
          {itemCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-mauve text-ivory text-[10px] font-medium flex items-center justify-center"
            >
              {itemCount > 9 ? '9+' : itemCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <CartDrawer isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}