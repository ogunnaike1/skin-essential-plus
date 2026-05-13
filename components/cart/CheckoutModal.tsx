"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ArrowRight,
  ArrowLeft,
  ShoppingBag,
  User,
  Mail,
  Phone,
} from "lucide-react";
import { z } from "zod";
import { formatShopPrice } from "@/lib/shop-data";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";
import type { CartItem } from "@/app/contexts/CartContext";

const checkoutSchema = z.object({
  name: z.string().min(2, "Please enter your full name"),
  email: z.string().email("Please enter a valid email address"),
  phone: z
    .string()
    .min(7, "Please enter a valid phone number")
    .regex(/^[+\d][\d\s\-().]{6,}$/),
});

type CheckoutErrors = Partial<Record<keyof z.infer<typeof checkoutSchema>, string>>;

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: CartItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode: string | null;
  clearCart: () => void;
}

type Step = "details" | "gateway";

export function CheckoutModal({
  isOpen,
  onClose,
  items,
  subtotal,
  discount,
  total,
  couponCode,
  clearCart,
}: CheckoutModalProps) {
  const [step, setStep] = useState<Step>("details");
  const [loading, setLoading] = useState(false);

  const notifyOrder = (reference: string) => {
    fetch("/api/orders/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        customerName: formData.name,
        customerEmail: formData.email,
        customerPhone: formData.phone,
        items: items.map((i) => ({ name: i.product.name, quantity: i.quantity, price: i.product.price })),
        subtotal,
        discount,
        total,
        couponCode,
        reference,
      }),
    }).catch((err) => console.error("Order notify failed:", err));
  };
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [errors, setErrors] = useState<CheckoutErrors>({});

  const { notification, showSuccess, showError, hideSuccess } = useSuccessNotification();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);

  const handleClose = () => {
    setStep("details");
    setFormData({ name: "", email: "", phone: "" });
    setErrors({});
    setLoading(false);
    onClose();
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = checkoutSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: CheckoutErrors = {};
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof CheckoutErrors;
        if (!fieldErrors[field]) fieldErrors[field] = issue.message;
      }
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    setStep("gateway");
  };

  // ── PAYSTACK CARD ──────────────────────────────────────────────
  const handlePaystackCard = () => {
    // @ts-ignore
    if (typeof window.PaystackPop === "undefined") {
      showError({ title: "Payment unavailable", message: "Paystack is still loading. Please wait a moment and try again." });
      return;
    }

    setLoading(true);
    const ref = `SHOP-${Date.now()}`;

    try {
      // @ts-ignore
      const handler = window.PaystackPop.setup({
        key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
        email: formData.email,
        amount: Math.round(total * 100),
        currency: "NGN",
        ref,
        metadata: {
          custom_fields: [
            { display_name: "Customer Name", variable_name: "customer_name", value: formData.name },
            { display_name: "Phone",         variable_name: "phone",         value: formData.phone },
            { display_name: "Items",         variable_name: "items",         value: items.map((i) => `${i.product.name} x${i.quantity}`).join(", ") },
            ...(couponCode ? [{ display_name: "Coupon", variable_name: "coupon_code", value: couponCode }] : []),
          ],
        },
        callback: (response: { reference: string }) => {
          setLoading(false);
          notifyOrder(response.reference);
          showSuccess("generic-success", {
            title: "Payment Successful!",
            message: "Your order has been placed. We'll be in touch shortly.",
            details: `Ref: ${response.reference}`,
          });
          clearCart();
          setTimeout(() => handleClose(), 2500);
        },
        onClose: () => setLoading(false),
      });

      handler.openIframe();
    } catch (err) {
      console.error("Paystack error:", err);
      showError({ title: "Payment failed", message: "Unable to open payment. Please try again." });
      setLoading(false);
    }
  };

  // ── MONIWAVE ───────────────────────────────────────────────────
  const handleMoniwave = () => {
    setLoading(true);
    const ref = `SHOP-MW-${Date.now()}`;

    // @ts-ignore — swap in Moniwave's actual SDK call here
    if (typeof window.MonnifySDK !== "undefined") {
      // @ts-ignore
      window.MonnifySDK.initialize({
        amount: total,
        currency: "NGN",
        reference: ref,
        customerFullName: formData.name,
        customerEmail: formData.email,
        customerMobileNumber: formData.phone,
        apiKey: process.env.NEXT_PUBLIC_MONIWAVE_API_KEY ?? "",
        contractCode: process.env.NEXT_PUBLIC_MONIWAVE_CONTRACT_CODE ?? "",
        paymentDescription: `Skin Essential Plus order — ${items.length} item(s)`,
        onLoadStart: () => {},
        onLoadComplete: () => {},
        onComplete: (response: { paymentStatus: string; transactionReference: string }) => {
          if (response.paymentStatus === "PAID") {
            notifyOrder(response.transactionReference);
            showSuccess("generic-success", {
              title: "Payment Successful!",
              message: "Your order has been placed. Thank you!",
              details: `Ref: ${response.transactionReference}`,
            });
            clearCart();
            setTimeout(() => handleClose(), 2000);
          }
          setLoading(false);
        },
        onClose: () => setLoading(false),
      });
    } else {
      showError({ title: "Moniwave unavailable", message: "Please choose Paystack to continue." });
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const stepLabel: Record<Step, string> = {
    details: "Your Details",
    gateway: "Payment Method",
  };

  const stepNumber: Record<Step, number> = {
    details: 1,
    gateway: 2,
  };

  return (
    <>
      <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-deep/60 backdrop-blur-sm"
          onClick={handleClose}
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.97, y: 12 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-lg bg-ivory rounded-3xl shadow-glass-lg overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Colour bar */}
          <div className="flex h-1.5">
            <span className="flex-1 bg-mauve" />
            <span className="flex-1 bg-sage" />
            <span className="flex-1 bg-deep" />
          </div>

          {/* Header */}
          <div className="flex items-start justify-between px-6 pt-6 pb-4 border-b border-deep/10">
            <div>
              <p className="text-[10px] uppercase tracking-widest text-deep/40 font-light mb-0.5">
                Step {stepNumber[step]} of 2
              </p>
              <h2 className="font-display text-2xl font-light text-deep">
                {stepLabel[step]}
              </h2>
            </div>
            <button
              onClick={handleClose}
              className="h-8 w-8 rounded-full bg-deep-tint hover:bg-mauve-tint flex items-center justify-center transition-colors shrink-0"
            >
              <X className="h-4 w-4 text-deep" />
            </button>
          </div>

          {/* Order mini-summary (always visible) */}
          <div className="flex items-center justify-between px-6 py-3 bg-deep-tint/50 border-b border-deep/10 text-sm">
            <div className="flex items-center gap-2 text-deep/60">
              <ShoppingBag className="h-4 w-4" strokeWidth={1.5} />
              <span className="font-light">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <span className="font-display text-lg text-deep">{formatShopPrice(total)}</span>
          </div>

          {/* Step content */}
          <div className="px-6 py-6">
            <AnimatePresence mode="wait">

              {/* ── STEP 1: DETAILS ── */}
              {step === "details" && (
                <motion.form
                  key="details"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleDetailsSubmit}
                  className="space-y-4"
                >
                  {/* Name */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-deep/50 font-light block mb-1.5">
                      Full name
                    </label>
                    <div className="relative">
                      <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => {
                          setFormData((d) => ({ ...d, name: e.target.value }));
                          setErrors((err) => ({ ...err, name: undefined }));
                        }}
                        placeholder="Ifeoluwa Peters"
                        className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-white text-sm text-deep placeholder:text-deep/30 focus:outline-none transition-colors ${errors.name ? "border-mauve focus:border-mauve" : "border-deep/20 focus:border-mauve"}`}
                      />
                    </div>
                    {errors.name && (
                      <p className="text-[11px] text-mauve mt-1.5 pl-1">{errors.name}</p>
                    )}
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-deep/50 font-light block mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                      <input
                        type="email"
                        value={formData.email}
                        onChange={(e) => {
                          setFormData((d) => ({ ...d, email: e.target.value }));
                          setErrors((err) => ({ ...err, email: undefined }));
                        }}
                        placeholder="you@example.com"
                        className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-white text-sm text-deep placeholder:text-deep/30 focus:outline-none transition-colors ${errors.email ? "border-mauve focus:border-mauve" : "border-deep/20 focus:border-mauve"}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[11px] text-mauve mt-1.5 pl-1">{errors.email}</p>
                    )}
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-deep/50 font-light block mb-1.5">
                      Phone number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => {
                          setFormData((d) => ({ ...d, phone: e.target.value }));
                          setErrors((err) => ({ ...err, phone: undefined }));
                        }}
                        placeholder="+234 800 000 0000"
                        className={`w-full h-11 pl-10 pr-4 rounded-xl border bg-white text-sm text-deep placeholder:text-deep/30 focus:outline-none transition-colors ${errors.phone ? "border-mauve focus:border-mauve" : "border-deep/20 focus:border-mauve"}`}
                      />
                    </div>
                    {errors.phone && (
                      <p className="text-[11px] text-mauve mt-1.5 pl-1">{errors.phone}</p>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-full bg-gradient-deep text-ivory text-sm font-light tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition-opacity mt-2"
                  >
                    Continue to Payment
                    <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
                  </button>
                </motion.form>
              )}

              {/* ── STEP 2: GATEWAY SELECTION ── */}
              {step === "gateway" && (
                <motion.div
                  key="gateway"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-deep/60 font-light mb-5">
                    Choose how you&rsquo;d like to pay for your order.
                  </p>

                  {/* Paystack */}
                  <button
                    onClick={handlePaystackCard}
                    disabled={loading}
                    className="group w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-deep/10 bg-white hover:border-[#00C46E] hover:shadow-[0_0_0_4px_rgba(0,196,110,0.08)] transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <div className="h-12 w-12 rounded-xl bg-[#00C46E]/10 flex items-center justify-center shrink-0">
                      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none">
                        <rect width="32" height="32" rx="6" fill="#00C46E" />
                        <path d="M8 11h16M8 16h12M8 21h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-deep text-sm">Paystack</p>
                      <p className="text-[11px] text-deep/50 font-light mt-0.5">Card, bank transfer, USSD & more</p>
                    </div>
                    {loading ? (
                      <span className="h-4 w-4 border-2 border-[#00C46E]/30 border-t-[#00C46E] rounded-full animate-spin shrink-0" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-deep/30 group-hover:text-[#00C46E] transition-colors shrink-0" strokeWidth={1.5} />
                    )}
                  </button>

                  {/* Moniwave — coming soon */}
                  <div className="relative select-none cursor-not-allowed">
                    <div className="w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-deep/10 bg-white text-left blur-[2px] pointer-events-none">
                      <div className="h-12 w-12 rounded-xl bg-[#FF6B00]/10 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none">
                          <rect width="32" height="32" rx="6" fill="#FF6B00" />
                          <circle cx="16" cy="16" r="6" stroke="white" strokeWidth="2.5" />
                          <path d="M16 10v12M10 16h12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-deep text-sm">Moniwave</p>
                        <p className="text-[11px] text-deep/50 font-light mt-0.5">Fast, secure Nigerian payments</p>
                      </div>
                      <ArrowRight className="h-4 w-4 text-deep/30 shrink-0" strokeWidth={1.5} />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center rounded-2xl">
                      <span className="text-[11px] font-medium px-3 py-1 rounded-full bg-deep/80 text-ivory tracking-wide">Coming Soon</span>
                    </div>
                  </div>

                  <button
                    onClick={() => setStep("details")}
                    className="flex items-center gap-1.5 text-xs text-deep/40 hover:text-deep transition-colors mt-1"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Back to details
                  </button>
                </motion.div>
              )}

            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      <SuccessNotification {...notification} onClose={hideSuccess} />
    </>
  );
}
