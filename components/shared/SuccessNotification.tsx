"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle2, 
  X, 
  ShoppingBag, 
  Calendar, 
  Upload, 
  LogIn,
  Package,
  Sparkles,
  Heart,
  Trash2,
  Edit,
  Send
} from "lucide-react";
import React from "react";

export type NotificationType = 
  | "appointment-booked"
  | "cart-added"
  | "login-success"
  | "service-uploaded"
  | "product-uploaded"
  | "item-deleted"
  | "item-updated"
  | "favorite-added"
  | "message-sent"
  | "generic-success";

interface SuccessNotificationProps {
  isOpen: boolean;
  onClose: () => void;
  type: NotificationType;
  title?: string;
  message?: string;
  details?: string;
  autoClose?: boolean;
  duration?: number;
}

const notificationConfig: Record<NotificationType, {
  icon: React.ReactNode;
  color: "mauve" | "sage" | "deep";
  defaultTitle: string;
  defaultMessage: string;
}> = {
  "appointment-booked": {
    icon: <Calendar className="h-6 w-6" />,
    color: "mauve",
    defaultTitle: "Appointment Booked!",
    defaultMessage: "Your appointment has been successfully scheduled. We'll send you a confirmation shortly.",
  },
  "cart-added": {
    icon: <ShoppingBag className="h-6 w-6" />,
    color: "sage",
    defaultTitle: "Added to Cart!",
    defaultMessage: "Item has been added to your shopping cart.",
  },
  "login-success": {
    icon: <LogIn className="h-6 w-6" />,
    color: "deep",
    defaultTitle: "Welcome Back!",
    defaultMessage: "You've successfully logged in to your account.",
  },
  "service-uploaded": {
    icon: <Upload className="h-6 w-6" />,
    color: "mauve",
    defaultTitle: "Service Uploaded!",
    defaultMessage: "Your service has been successfully added to the catalog.",
  },
  "product-uploaded": {
    icon: <Package className="h-6 w-6" />,
    color: "sage",
    defaultTitle: "Product Uploaded!",
    defaultMessage: "Your product has been successfully added to the shop.",
  },
  "item-deleted": {
    icon: <Trash2 className="h-6 w-6" />,
    color: "deep",
    defaultTitle: "Item Deleted!",
    defaultMessage: "The item has been permanently removed.",
  },
  "item-updated": {
    icon: <Edit className="h-6 w-6" />,
    color: "sage",
    defaultTitle: "Changes Saved!",
    defaultMessage: "Your updates have been successfully saved.",
  },
  "favorite-added": {
    icon: <Heart className="h-6 w-6" />,
    color: "mauve",
    defaultTitle: "Added to Favorites!",
    defaultMessage: "This item has been saved to your favorites.",
  },
  "message-sent": {
    icon: <Send className="h-6 w-6" />,
    color: "deep",
    defaultTitle: "Message Sent!",
    defaultMessage: "Your message has been delivered successfully.",
  },
  "generic-success": {
    icon: <CheckCircle2 className="h-6 w-6" />,
    color: "sage",
    defaultTitle: "Success!",
    defaultMessage: "Operation completed successfully.",
  },
};

export function SuccessNotification({
  isOpen,
  onClose,
  type,
  title,
  message,
  details,
  autoClose = true,
  duration = 4000,
}: SuccessNotificationProps) {
  const config = notificationConfig[type];
  const displayTitle = title || config.defaultTitle;
  const displayMessage = message || config.defaultMessage;

  useEffect(() => {
    if (isOpen && autoClose) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isOpen, autoClose, duration, onClose]);

  const colorClasses = {
    mauve: {
      bg: "bg-mauve",
      text: "text-mauve",
      tint: "bg-mauve-tint",
      border: "border-mauve",
      glow: "bg-mauve/20",
    },
    sage: {
      bg: "bg-sage",
      text: "text-sage",
      tint: "bg-sage-tint",
      border: "border-sage",
      glow: "bg-sage/20",
    },
    deep: {
      bg: "bg-deep",
      text: "text-deep",
      tint: "bg-deep-tint",
      border: "border-deep",
      glow: "bg-deep/20",
    },
  };

  const colors = colorClasses[config.color];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-[200] bg-deep/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Notification Card */}
          <div className="fixed inset-0 z-[201] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ 
                type: "spring", 
                stiffness: 300, 
                damping: 25,
                duration: 0.3 
              }}
              className="pointer-events-auto relative w-full max-w-md"
            >
              {/* Decorative glow */}
              <div className={`absolute inset-0 rounded-[32px] blur-2xl ${colors.glow} -z-10`} />

              {/* Card */}
              <div className="relative overflow-hidden rounded-[28px] border border-ivory/40 bg-ivory shadow-2xl">
                {/* Top accent bar */}
                <div className="h-1.5 w-full flex">
                  <span className={`flex-1 ${colors.bg}`} />
                  <span className="flex-1 bg-ivory/30" />
                  <span className="flex-1 bg-ivory/20" />
                </div>

                {/* Content */}
                <div className="p-8">
                  {/* Icon */}
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ 
                      type: "spring", 
                      stiffness: 200, 
                      damping: 15,
                      delay: 0.1 
                    }}
                    className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl ${colors.bg} text-ivory mb-6 relative`}
                  >
                    {config.icon}
                    
                    {/* Success checkmark overlay */}
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.2 }}
                      className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-ivory border-2 border-sage flex items-center justify-center"
                    >
                      <CheckCircle2 className="h-4 w-4 text-sage" strokeWidth={3} />
                    </motion.div>
                  </motion.div>

                  {/* Text */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.3 }}
                  >
                    <h3 className="font-display text-2xl font-light text-deep mb-2 leading-tight">
                      {displayTitle}
                    </h3>
                    <p className="text-sm text-deep/70 leading-relaxed mb-1">
                      {displayMessage}
                    </p>
                    {details && (
                      <p className="text-xs text-deep/50 mt-2 font-mono">
                        {details}
                      </p>
                    )}
                  </motion.div>

                  {/* Sparkles decoration */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="absolute top-6 right-6 opacity-20"
                  >
                    <Sparkles className={`h-8 w-8 ${colors.text}`} />
                  </motion.div>
                </div>

                {/* Progress bar (for auto-close) */}
                {autoClose && (
                  <motion.div
                    initial={{ scaleX: 1 }}
                    animate={{ scaleX: 0 }}
                    transition={{ duration: duration / 1000, ease: "linear" }}
                    className={`h-1 ${colors.bg} origin-left`}
                  />
                )}

                {/* Close button */}
                <button
                  onClick={onClose}
                  className={`absolute top-4 right-4 p-2 rounded-full ${colors.tint} ${colors.text} hover:${colors.bg} hover:text-ivory transition-all duration-200`}
                  aria-label="Close notification"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

// Hook for easy usage
export function useSuccessNotification() {
  const [notification, setNotification] = React.useState<{
    isOpen: boolean;
    type: NotificationType;
    title?: string;
    message?: string;
    details?: string;
  }>({
    isOpen: false,
    type: "generic-success",
  });

  const showSuccess = (
    type: NotificationType,
    options?: {
      title?: string;
      message?: string;
      details?: string;
    }
  ) => {
    setNotification({
      isOpen: true,
      type,
      ...options,
    });
  };

  const hideSuccess = () => {
    setNotification((prev) => ({ ...prev, isOpen: false }));
  };

  return {
    notification,
    showSuccess,
    hideSuccess,
  };
}