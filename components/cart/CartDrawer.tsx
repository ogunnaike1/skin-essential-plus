"use client";

import { X, Minus, Plus, Trash2, Tag, ShoppingBag, ArrowRight } from "lucide-react";
import { useCart } from "@/app/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useState } from "react";
import { formatShopPrice } from "@/lib/shop-data";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";

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
    total
  } = useCart();

  const [couponInput, setCouponInput] = useState("");
  const [couponError, setCouponError] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
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
    // TODO: Navigate to checkout page or open checkout modal
    alert("Proceeding to checkout...");
  };

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop - ONLY THIS should close the drawer */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-deep/80 backdrop-blur-md z-[90]"
            />

            {/* Drawer - Stop ALL propagation at the root */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="fixed right-0 top-0 h-full w-full sm:w-[480px] bg-ivory shadow-2xl z-[100] flex flex-col border-l-2 border-deep/10"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-deep/10 bg-ivory">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-xl bg-mauve flex items-center justify-center">
                    <ShoppingBag className="h-5 w-5 text-ivory" strokeWidth={1.5} />
                  </div>
                  <div>
                    <h2 className="font-display text-2xl font-light text-deep">
                      Your Cart
                    </h2>
                    <p className="text-xs text-deep/60">
                      {itemCount} {itemCount === 1 ? 'item' : 'items'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-mauve-tint transition-colors"
                  aria-label="Close cart"
                >
                  <X className="h-5 w-5 text-deep" />
                </button>
              </div>

              {/* Empty State */}
              {items.length === 0 && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center bg-ivory">
                  <div className="h-20 w-20 rounded-full bg-mauve-tint flex items-center justify-center mb-4">
                    <ShoppingBag className="h-10 w-10 text-mauve" strokeWidth={1.5} />
                  </div>
                  <h3 className="font-display text-xl font-light text-deep mb-2">
                    Your cart is empty
                  </h3>
                  <p className="text-sm text-deep/60 mb-6">
                    Add some products to get started
                  </p>
                  <button
                    onClick={onClose}
                    className="px-6 py-3 rounded-full bg-mauve text-ivory text-sm font-medium hover:bg-mauve-dark transition-colors"
                  >
                    Continue Shopping
                  </button>
                </div>
              )}

              {/* Cart Items */}
              {items.length > 0 && (
                <>
                  <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-ivory">
                    {items.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex gap-4 p-4 rounded-2xl border-2 border-deep/10 bg-ivory hover:border-mauve/30 transition-colors"
                      >
                        {/* Product Image */}
                        <div className="relative h-20 w-20 rounded-xl overflow-hidden bg-mauve-tint shrink-0">
                          {item.product.image_url ? (
                            <Image
                              src={item.product.image_url}
                              alt={item.product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <ShoppingBag className="h-8 w-8 text-mauve" strokeWidth={1.5} />
                            </div>
                          )}
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-display text-sm font-light text-deep mb-1 line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="text-xs text-deep/60 mb-2">
                            {item.product.volume}
                          </p>

                          <div className="flex items-center justify-between">
                            {/* Quantity Controls */}
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                                className="h-7 w-7 rounded-full bg-mauve-tint hover:bg-mauve hover:text-ivory text-deep flex items-center justify-center transition-colors"
                                aria-label="Decrease quantity"
                              >
                                <Minus className="h-3 w-3" strokeWidth={2} />
                              </button>
                              <span className="text-sm font-medium text-deep w-6 text-center">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                                className="h-7 w-7 rounded-full bg-mauve-tint hover:bg-mauve hover:text-ivory text-deep flex items-center justify-center transition-colors"
                                aria-label="Increase quantity"
                              >
                                <Plus className="h-3 w-3" strokeWidth={2} />
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <p className="font-display text-sm font-medium text-mauve">
                                {formatShopPrice(item.product.price * item.quantity)}
                              </p>
                              {item.quantity > 1 && (
                                <p className="text-[10px] text-deep/50">
                                  {formatShopPrice(item.product.price)} each
                                </p>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(item.product.id)}
                          className="p-2 rounded-full hover:bg-mauve-tint text-deep/40 hover:text-deep transition-colors self-start"
                          aria-label="Remove from cart"
                        >
                          <Trash2 className="h-4 w-4" strokeWidth={1.5} />
                        </button>
                      </div>
                    ))}
                  </div>

                  {/* Footer - Coupon & Checkout */}
                  <div className="border-t border-deep/10 p-6 space-y-4 bg-ivory">
                    {/* Coupon Code */}
                    {!couponCode && (
                      <div>
                        <label className="text-xs font-medium text-deep mb-2 block">
                          Have a coupon code?
                        </label>
                        <div className="flex gap-2">
                          <div className="flex-1 relative">
                            <Tag className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-mauve" />
                            <input
                              type="text"
                              value={couponInput}
                              onChange={(e) => {
                                setCouponInput(e.target.value.toUpperCase());
                                setCouponError("");
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  e.preventDefault();
                                  handleApplyCoupon();
                                }
                              }}
                              placeholder="COUPON CODE"
                              className="w-full h-10 pl-9 pr-3 rounded-full border border-deep/20 text-sm focus:border-mauve focus:outline-none uppercase"
                            />
                          </div>
                          <button
                            onClick={handleApplyCoupon}
                            disabled={isApplyingCoupon}
                            className="px-4 py-2 rounded-full bg-sage text-ivory text-xs font-medium hover:bg-sage-dark transition-colors disabled:opacity-50"
                          >
                            {isApplyingCoupon ? "..." : "Apply"}
                          </button>
                        </div>
                        {couponError && (
                          <p className="text-xs text-mauve mt-1">{couponError}</p>
                        )}
                      </div>
                    )}

                    {/* Applied Coupon */}
                    {couponCode && (
                      <div className="p-3 rounded-xl bg-sage-tint border border-sage/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4 text-sage" />
                          <div>
                            <p className="text-xs font-medium text-deep">{couponCode}</p>
                            <p className="text-[10px] text-deep/60">
                              Saved {formatShopPrice(discount)}
                            </p>
                          </div>
                        </div>
                        <button
                          onClick={() => applyCoupon("")}
                          className="text-xs text-deep/60 hover:text-deep"
                        >
                          Remove
                        </button>
                      </div>
                    )}

                    {/* Totals */}
                    <div className="space-y-2 py-3 border-y border-deep/10">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-deep/70">Subtotal</span>
                        <span className="text-deep">{formatShopPrice(subtotal)}</span>
                      </div>
                      {discount > 0 && (
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-sage">Discount</span>
                          <span className="text-sage">-{formatShopPrice(discount)}</span>
                        </div>
                      )}
                      <div className="flex items-center justify-between pt-2">
                        <span className="text-deep font-medium">Total</span>
                        <span className="font-display text-2xl font-medium text-mauve">
                          {formatShopPrice(total)}
                        </span>
                      </div>
                    </div>

                    {/* Checkout Button */}
                    <button
                      onClick={handleCheckout}
                      className="w-full py-4 rounded-full bg-mauve text-ivory font-medium hover:bg-mauve-dark transition-colors flex items-center justify-center gap-2"
                    >
                      Proceed to Checkout
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    {/* Clear Cart */}
                    <button
                      onClick={() => {
                        if (confirm("Are you sure you want to clear your cart?")) {
                          clearCart();
                        }
                      }}
                      className="w-full text-xs text-deep/60 hover:text-deep transition-colors"
                    >
                      Clear Cart
                    </button>
                  </div>
                </>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <SuccessNotification {...notification} onClose={hideSuccess} />
    </>
  );
}