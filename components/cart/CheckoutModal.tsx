"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Script from "next/script";
import {
  X,
  ArrowRight,
  ArrowLeft,
  CreditCard,
  Building2,
  Copy,
  Check,
  ShoppingBag,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { formatShopPrice } from "@/lib/shop-data";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";
import type { CartItem } from "@/app/contexts/CartContext";

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

type Step = "details" | "gateway" | "paystack-method" | "transfer";

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
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const { notification, showSuccess, hideSuccess } = useSuccessNotification();

  const handleClose = () => {
    setStep("details");
    setFormData({ name: "", email: "", phone: "" });
    setLoading(false);
    onClose();
  };

  const handleDetailsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep("gateway");
  };

  // ── PAYSTACK CARD ──────────────────────────────────────────────
  const handlePaystackCard = () => {
    setLoading(true);
    const ref = `SHOP-${Date.now()}`;

    // @ts-ignore
    const handler = window.PaystackPop.setup({
      key: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY!,
      email: formData.email,
      amount: total * 100,
      currency: "NGN",
      ref,
      metadata: {
        customer_name: formData.name,
        customer_phone: formData.phone,
        order_items: items.map((i) => `${i.product.name} x${i.quantity}`).join(", "),
        coupon_code: couponCode ?? "",
      },
      callback: (response: { reference: string }) => {
        showSuccess("generic-success", {
          title: "Payment Successful!",
          message: "Your order has been placed. Thank you!",
          details: `Ref: ${response.reference}`,
        });
        clearCart();
        setTimeout(() => handleClose(), 2000);
      },
      onClose: () => setLoading(false),
    });

    handler.openIframe();
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
      alert("Moniwave is not available right now. Please choose Paystack.");
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  const stepLabel: Record<Step, string> = {
    details: "Your Details",
    gateway: "Payment Method",
    "paystack-method": "Pay with Paystack",
    transfer: "Bank Transfer",
  };

  const stepNumber: Record<Step, number> = {
    details: 1,
    gateway: 2,
    "paystack-method": 3,
    transfer: 3,
  };

  return (
    <>
      <Script src="https://js.paystack.co/v1/inline.js" />
      <Script src="https://sdk.monnify.com/plugin/monnify.js" />

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
                Step {stepNumber[step]} of 3
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
                        required
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                        placeholder="Ifeoluwa Peters"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-deep/20 bg-white text-sm text-deep placeholder:text-deep/30 focus:border-mauve focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-deep/50 font-light block mb-1.5">
                      Email address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                      <input
                        required
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                        placeholder="you@example.com"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-deep/20 bg-white text-sm text-deep placeholder:text-deep/30 focus:border-mauve focus:outline-none transition-colors"
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <label className="text-[11px] uppercase tracking-wider text-deep/50 font-light block mb-1.5">
                      Phone number
                    </label>
                    <div className="relative">
                      <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/30" strokeWidth={1.5} />
                      <input
                        required
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => setFormData((d) => ({ ...d, phone: e.target.value }))}
                        placeholder="+234 800 000 0000"
                        className="w-full h-11 pl-10 pr-4 rounded-xl border border-deep/20 bg-white text-sm text-deep placeholder:text-deep/30 focus:border-mauve focus:outline-none transition-colors"
                      />
                    </div>
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
                    onClick={() => setStep("paystack-method")}
                    className="group w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-deep/10 bg-white hover:border-[#00C46E] hover:shadow-[0_0_0_4px_rgba(0,196,110,0.08)] transition-all text-left"
                  >
                    <div className="h-12 w-12 rounded-xl bg-[#00C46E]/10 flex items-center justify-center shrink-0">
                      {/* Paystack wordmark */}
                      <svg viewBox="0 0 32 32" className="h-7 w-7" fill="none">
                        <rect width="32" height="32" rx="6" fill="#00C46E" />
                        <path d="M8 11h16M8 16h12M8 21h8" stroke="white" strokeWidth="2.5" strokeLinecap="round" />
                      </svg>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-deep text-sm">Paystack</p>
                      <p className="text-[11px] text-deep/50 font-light mt-0.5">Card, bank transfer, USSD & more</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-deep/30 group-hover:text-[#00C46E] transition-colors shrink-0" strokeWidth={1.5} />
                  </button>

                  {/* Moniwave */}
                  <button
                    onClick={handleMoniwave}
                    disabled={loading}
                    className="group w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-deep/10 bg-white hover:border-[#FF6B00] hover:shadow-[0_0_0_4px_rgba(255,107,0,0.08)] transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
                  >
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
                    {loading ? (
                      <span className="h-4 w-4 border-2 border-deep/20 border-t-[#FF6B00] rounded-full animate-spin shrink-0" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-deep/30 group-hover:text-[#FF6B00] transition-colors shrink-0" strokeWidth={1.5} />
                    )}
                  </button>

                  <button
                    onClick={() => setStep("details")}
                    className="flex items-center gap-1.5 text-xs text-deep/40 hover:text-deep transition-colors mt-1"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Back to details
                  </button>
                </motion.div>
              )}

              {/* ── STEP 3a: PAYSTACK METHOD ── */}
              {step === "paystack-method" && (
                <motion.div
                  key="paystack-method"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-4"
                >
                  <p className="text-sm text-deep/60 font-light mb-5">
                    How would you like to pay via Paystack?
                  </p>

                  {/* Card */}
                  <button
                    onClick={handlePaystackCard}
                    disabled={loading}
                    className="group w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-deep/10 bg-white hover:border-mauve hover:shadow-[0_0_0_4px_rgba(138,111,136,0.08)] transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed"
                  >
                    <div className="h-12 w-12 rounded-xl bg-mauve-tint flex items-center justify-center shrink-0">
                      <CreditCard className="h-5 w-5 text-mauve" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-deep text-sm">Debit / Credit Card</p>
                      <p className="text-[11px] text-deep/50 font-light mt-0.5">Visa, Mastercard, Verve — secure checkout</p>
                    </div>
                    {loading ? (
                      <span className="h-4 w-4 border-2 border-mauve/30 border-t-mauve rounded-full animate-spin shrink-0" />
                    ) : (
                      <ArrowRight className="h-4 w-4 text-deep/30 group-hover:text-mauve transition-colors shrink-0" strokeWidth={1.5} />
                    )}
                  </button>

                  {/* Transfer */}
                  <button
                    onClick={() => setStep("transfer")}
                    className="group w-full flex items-center gap-4 p-5 rounded-2xl border-2 border-deep/10 bg-white hover:border-sage hover:shadow-[0_0_0_4px_rgba(79,114,136,0.08)] transition-all text-left"
                  >
                    <div className="h-12 w-12 rounded-xl bg-sage-tint flex items-center justify-center shrink-0">
                      <Building2 className="h-5 w-5 text-sage" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-deep text-sm">Bank Transfer</p>
                      <p className="text-[11px] text-deep/50 font-light mt-0.5">Transfer directly from your bank account</p>
                    </div>
                    <ArrowRight className="h-4 w-4 text-deep/30 group-hover:text-sage transition-colors shrink-0" strokeWidth={1.5} />
                  </button>

                  <button
                    onClick={() => setStep("gateway")}
                    className="flex items-center gap-1.5 text-xs text-deep/40 hover:text-deep transition-colors mt-1"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Back to payment options
                  </button>
                </motion.div>
              )}

              {/* ── STEP 3b: TRANSFER DETAILS ── */}
              {step === "transfer" && (
                <motion.div
                  key="transfer"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                  className="space-y-5"
                >
                  <div className="p-4 rounded-2xl bg-sage-tint border border-sage/20 space-y-4">
                    <p className="text-xs text-deep/60 font-light">
                      Transfer exactly <span className="font-medium text-sage">{formatShopPrice(total)}</span> to the account below and send proof to us on WhatsApp.
                    </p>

                    {/* Bank details */}
                    {[
                      { label: "Bank", value: "GTBank (Guaranty Trust Bank)" },
                      { label: "Account name", value: "Skin Essential Plus Ltd" },
                      { label: "Account number", value: "0123456789" },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex items-center justify-between">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-deep/40 font-light">{label}</p>
                          <p className="text-sm font-medium text-deep mt-0.5">{value}</p>
                        </div>
                        {label === "Account number" && (
                          <button
                            onClick={() => copyToClipboard(value)}
                            className="h-8 w-8 rounded-full bg-white border border-sage/30 flex items-center justify-center hover:bg-sage hover:border-sage hover:text-ivory text-sage transition-all"
                          >
                            {copied ? <Check className="h-3.5 w-3.5" strokeWidth={2} /> : <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />}
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Amount to transfer */}
                    <div className="pt-3 border-t border-sage/20">
                      <p className="text-[10px] uppercase tracking-wider text-deep/40 font-light">Amount to transfer</p>
                      <p className="font-display text-2xl text-sage mt-0.5">{formatShopPrice(total)}</p>
                    </div>
                  </div>

                  {/* Reference note */}
                  <div className="flex gap-3 p-3.5 rounded-xl bg-mauve-tint border border-mauve/20">
                    <Sparkles className="h-4 w-4 text-mauve shrink-0 mt-0.5" strokeWidth={1.5} />
                    <p className="text-[11px] text-deep/70 font-light leading-relaxed">
                      Use <strong className="text-deep font-medium">SHOP-{formData.name.split(" ")[0]?.toUpperCase()}</strong> as your transfer narration so we can match your payment quickly.
                    </p>
                  </div>

                  {/* Confirm button */}
                  <button
                    onClick={() => {
                      showSuccess("generic-success", {
                        title: "Order Noted!",
                        message: "We'll confirm your order once your transfer is received.",
                      });
                      clearCart();
                      setTimeout(() => handleClose(), 2000);
                    }}
                    className="w-full py-3.5 rounded-full bg-gradient-deep text-ivory text-sm font-light tracking-wide flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <CheckCircle2 className="h-4 w-4" strokeWidth={1.5} />
                    I&rsquo;ve completed the transfer
                  </button>

                  <button
                    onClick={() => setStep("paystack-method")}
                    className="flex items-center gap-1.5 text-xs text-deep/40 hover:text-deep transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" strokeWidth={1.5} />
                    Back to payment options
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
