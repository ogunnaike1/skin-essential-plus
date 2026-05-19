"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/app/contexts/CartContext";
import { useState } from "react";
import { CartDrawer } from "./CartDrawer";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CartIconProps {
  variant?: "light" | "dark";
}

export function CartIcon({ variant = "dark" }: CartIconProps) {
  const { itemCount } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={cn(
          "relative p-2 rounded-full transition-colors",
          variant === "light"
            ? "hover:bg-ivory/10"
            : "hover:bg-deep/5"
        )}
        aria-label="Shopping cart"
      >
        <ShoppingBag
          className={cn("h-5 w-5", variant === "light" ? "text-ivory" : "text-deep")}
          strokeWidth={1.5}
        />
        
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