"use client";

import { X, Minus, Plus, Trash2, Tag, ShoppingBag, ArrowRight, Sparkles, ChevronDown } from "lucide-react";
import { useCart } from "@/app/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { formatShopPrice } from "@/lib/shop-data";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";
import { CheckoutModal } from "@/components/cart/CheckoutModal";

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartDrawer({ isOpen, onClose }: CartDrawerProps) {
  const {
    items,
    removeFromCart,
    updateQuantity,
    clearCart,
    itemCount,
    subtotal,
    applyCoupon,
    couponCode,
    discount,
    total,
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  const [couponOpen, setCouponOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);

  const { notification, showSuccess, hideSuccess } = useSuccessNotification();

  const handleApplyCoupon = async () => {
    if (!couponInput.trim()) {
      setCouponError("Please enter a coupon code");
      return;
    }
    setIsApplyingCoupon(true);
    setCouponError("");
    const result = await applyCoupon(couponInput);
    if (result.success) {
      setCouponInput("");
      setCouponOpen(false);
      showSuccess("generic-success", {
        title: "Coupon Applied!",
        message: result.message,
      });
    } else {
      setCouponError(result.message);
    }
    setIsApplyingCoupon(false);
  };

  const handleCheckout = () => {
    onClose();
    setCheckoutOpen(true);
  };

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cart-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-deep/60 backdrop-blur-sm z-[90]"
          />
        )}
      </AnimatePresence>

      {/* Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="cart-drawer"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
            className="fixed right-0 top-0 h-[100dvh] w-full sm:w-[440px] z-[100] flex flex-col bg-ivory shadow-glass-lg"
          >
            {/* ── HEADER ── */}
            <div className="relative bg-gradient-deep px-6 pt-8 pb-6 shrink-0 overflow-hidden">
              <div
                className="absolute -top-10 -right-10 h-40 w-40 rounded-full opacity-20 pointer-events-none"
                style={{ background: "radial-gradient(circle, #8A6F88 0%, transparent 70%)" }}
              />
              <div
                className="absolute bottom-0 left-0 h-24 w-24 rounded-full opacity-10 pointer-events-none"
                style={{ background: "radial-gradient(circle, #4F7288 0%, transparent 70%)" }}
              />

              {/* Close */}
              <button
                onClick={onClose}
                className="absolute top-5 right-5 h-8 w-8 rounded-full bg-ivory/10 hover:bg-ivory/20 flex items-center justify-center transition-colors z-10"
                aria-label="Close cart"
              >
                <X className="h-4 w-4 text-ivory" />
              </button>

              <div className="relative pr-10">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-3.5 w-3.5 text-mauve-tint" strokeWidth={1.5} />
                  <span className="text-[10px] tracking-widest text-ivory/50 uppercase font-light">
                    Skin Essential Plus
                  </span>
                </div>
                <h2 className="font-display text-3xl font-light text-ivory leading-tight">
                  Shopping Bag
                </h2>
                <p className="mt-1 text-xs text-ivory/50 font-light">
                  {itemCount === 0
                    ? "Nothing here yet"
                    : `${itemCount} ${itemCount === 1 ? "item" : "items"} selected`}
                </p>
              </div>
            </div>

            {/* ── BODY ── */}
            <div className="flex-1 flex flex-col overflow-hidden">

              {/* Empty state */}
              {items.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center px-8 py-12 text-center">
                  <div className="relative mb-6">
                    <div className="h-24 w-24 rounded-full bg-mauve-tint flex items-center justify-center">
                      <ShoppingBag className="h-10 w-10 text-mauve" strokeWidth={1} />
                    </div>
                    <div className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full bg-deep-tint flex items-center justify-center">
                      <Sparkles className="h-4 w-4 text-deep/60" strokeWidth={1.5} />
                    </div>
                  </div>
                  <h3 className="font-display text-2xl font-light text-deep mb-2">
                    Your bag is empty
                  </h3>
                  <p className="text-sm text-deep/50 font-light mb-8 max-w-xs leading-relaxed">
                    Discover our curated collection of premium skincare and beauty rituals.
                  </p>
                  <button
                    onClick={onClose}
                    className="px-8 py-3 rounded-full bg-gradient-deep text-ivory text-sm font-light tracking-wide hover:opacity-90 transition-opacity"
                  >
                    Explore Products
                  </button>
                </div>
              )}

              {/* Items + Summary */}
              {items.length > 0 && (
                <>
                  {/* Scrollable items — flex-col + gap avoids space-y margin conflicts with layout animation */}
                  <div className="flex-1 overflow-y-auto px-5 py-4">
                    <div className="flex flex-col gap-3">
                      <AnimatePresence initial={false}>
                        {items.map((item) => (
                          <motion.div
                            key={item.product.id}
                            layout="position"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.96 }}
                            transition={{
                              layout: { type: "spring", damping: 28, stiffness: 300 },
                              opacity: { duration: 0.18 },
                              scale: { duration: 0.18 },
                              y: { duration: 0.18 },
                            }}
                            className="relative flex gap-4 p-4 rounded-2xl bg-white shadow-glass border border-deep/5 hover:border-mauve/20 transition-colors"
                          >
                            {/* Image */}
                            <div className="relative h-[84px] w-[84px] rounded-xl overflow-hidden bg-mauve-tint shrink-0">
                              {item.product.image_url ? (
                                <Image
                                  src={item.product.image_url}
                                  alt={item.product.name}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center">
                                  <ShoppingBag className="h-8 w-8 text-mauve/50" strokeWidth={1} />
                                </div>
                              )}
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0 flex flex-col justify-between">
                              <div className="pr-8">
                                <h4 className="font-display text-base font-light text-deep leading-snug line-clamp-2">
                                  {item.product.name}
                                </h4>
                                {item.product.volume && (
                                  <p className="text-[11px] uppercase tracking-wider text-deep/40 mt-0.5 font-light">
                                    {item.product.volume}
                                  </p>
                                )}
                              </div>

                              <div className="flex items-center justify-between mt-3">
                                {/* Quantity stepper */}
                                <div className="flex items-center gap-1 bg-deep-tint rounded-full px-1.5 py-1">
                                  <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                    className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-mauve hover:text-ivory text-deep transition-colors"
                                    aria-label="Decrease quantity"
                                  >
                                    <Minus className="h-2.5 w-2.5" strokeWidth={2.5} />
                                  </button>
                                  <span className="text-xs font-medium text-deep w-5 text-center tabular-nums">
                                    {item.quantity}
                                  </span>
                                  <button
                                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                    className="h-6 w-6 rounded-full flex items-center justify-center hover:bg-mauve hover:text-ivory text-deep transition-colors"
                                    aria-label="Increase quantity"
                                  >
                                    <Plus className="h-2.5 w-2.5" strokeWidth={2.5} />
                                  </button>
                                </div>

                                {/* Price */}
                                <div className="text-right">
                                  <p className="font-display text-base text-mauve">
                                    {formatShopPrice(item.product.price * item.quantity)}
                                  </p>
                                  {item.quantity > 1 && (
                                    <p className="text-[10px] text-deep/40 font-light">
                                      {formatShopPrice(item.product.price)} each
                                    </p>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Remove — always visible, not hover-only (works on touch too) */}
                            <button
                              onClick={() => removeFromCart(item.product.id)}
                              className="absolute top-3 right-3 h-7 w-7 rounded-full flex items-center justify-center text-deep/30 hover:text-mauve hover:bg-mauve-tint transition-all"
                              aria-label="Remove item"
                            >
                              <Trash2 className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </button>
                          </motion.div>
                        ))}
                      </AnimatePresence>
                    </div>
                  </div>

                  {/* ── SUMMARY PANEL ── */}
                  <div className="shrink-0 bg-deep-tint border-t border-deep/10 px-5 pt-4 pb-6 space-y-4">

                    {/* Coupon */}
                    {!couponCode ? (
                      <div>
                        <button
                          onClick={() => setCouponOpen((v) => !v)}
                          className="flex items-center gap-2 text-xs text-deep/60 hover:text-deep transition-colors w-full text-left"
                        >
                          <Tag className="h-3.5 w-3.5 text-sage shrink-0" strokeWidth={1.5} />
                          <span>Have a promo code?</span>
                          <ChevronDown
                            className={`h-3.5 w-3.5 ml-auto transition-transform duration-200 ${couponOpen ? "rotate-180" : ""}`}
                            strokeWidth={1.5}
                          />
                        </button>

                        <AnimatePresence>
                          {couponOpen && (
                            <motion.div
                              key="coupon-input"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.22, ease: "easeInOut" }}
                              style={{ overflow: "hidden" }}
                            >
                              <div className="pt-3 flex gap-2">
                                <input
                                  type="text"
                                  value={couponInput}
                                  onChange={(e) => {
                                    setCouponInput(e.target.value.toUpperCase());
                                    setCouponError("");
                                  }}
                                  onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                      e.preventDefault();
                                      handleApplyCoupon();
                                    }
                                  }}
                                  placeholder="ENTER CODE"
                                  className="flex-1 h-9 px-3 rounded-full border border-deep/20 bg-white text-xs uppercase tracking-wider text-deep placeholder:text-deep/30 focus:border-sage focus:outline-none transition-colors"
                                />
                                <button
                                  onClick={handleApplyCoupon}
                                  disabled={isApplyingCoupon}
                                  className="px-5 h-9 rounded-full bg-sage text-ivory text-xs font-medium hover:opacity-90 transition-opacity disabled:opacity-50 shrink-0"
                                >
                                  {isApplyingCoupon ? "…" : "Apply"}
                                </button>
                              </div>
                              {couponError && (
                                <p className="text-[11px] text-mauve mt-1.5 pl-1">{couponError}</p>
                              )}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between px-3 py-2.5 rounded-xl bg-sage-tint border border-sage/30">
                        <div className="flex items-center gap-2">
                          <Tag className="h-3.5 w-3.5 text-sage shrink-0" strokeWidth={1.5} />
                          <div>
                            <p className="text-xs font-medium text-deep tracking-wider">{couponCode}</p>
                            <p className="text-[10px] text-deep/50 font-light">
                              You saved {formatShopPrice(discount)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => applyCoupon("")}
                          className="text-[11px] text-deep/50 hover:text-deep transition-colors"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Totals */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-deep/60 font-light">Subtotal</span>
                        <span className="text-deep font-light">{formatShopPrice(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-sage font-light">Discount</span>
                          <span className="text-sage font-light">−{formatShopPrice(discount)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-3 border-t border-deep/10">
                        <span className="text-sm text-deep font-light tracking-wide">Total</span>
                        <span className="font-display text-2xl text-deep">
                          {formatShopPrice(total)}
                        </span>
                      </div>
                    </div>

                    {/* Checkout */}
                    <button
                      onClick={handleCheckout}
                      className="w-full py-4 rounded-full bg-gradient-deep text-ivory font-light text-sm tracking-wide flex items-center justify-center gap-2 hover:opacity-90 active:scale-[0.98] transition-all"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                    </button>

                    {/* Clear */}
                    <div className="text-center">
                      <button
                        onClick={() => {
                          if (confirm("Clear your entire bag?")) clearCart();
                        }}
                        className="text-[11px] text-deep/40 hover:text-deep/70 transition-colors tracking-wide"
                      >
                        Clear bag
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <CheckoutModal
        isOpen={checkoutOpen}
        onClose={() => setCheckoutOpen(false)}
        items={items}
        subtotal={subtotal}
        discount={discount}
        total={total}
        couponCode={couponCode}
        clearCart={clearCart}
      />

      <SuccessNotification {...notification} onClose={hideSuccess} />
    </>
  );
}
