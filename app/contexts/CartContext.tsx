"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { Product } from '@/lib/supabase/types';

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  subtotal: number;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string; discount?: number }>;
  couponCode: string | null;
  discount: number;
  total: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'skin-essential-cart';
const COUPON_STORAGE_KEY = 'skin-essential-coupon';

// Mock coupon codes - replace with API call to your backend
const VALID_COUPONS: Record<string, { discount: number; type: 'percentage' | 'fixed' }> = {
  'WELCOME10': { discount: 10, type: 'percentage' },
  'SAVE5000': { discount: 5000, type: 'fixed' },
  'SPRING20': { discount: 20, type: 'percentage' },
  'FIRSTORDER': { discount: 15, type: 'percentage' },
};

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponCode, setCouponCode] = useState<string | null>(null);
  const [discount, setDiscount] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    const savedCoupon = localStorage.getItem(COUPON_STORAGE_KEY);
    
    if (savedCart) {
      try {
        setItems(JSON.parse(savedCart));
      } catch (error) {
        console.error('Error loading cart:', error);
      }
    }

    if (savedCoupon) {
      try {
        const { code, discount: savedDiscount } = JSON.parse(savedCoupon);
        setCouponCode(code);
        setDiscount(savedDiscount);
      } catch (error) {
        console.error('Error loading coupon:', error);
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (items.length > 0) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } else {
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, [items]);

  // Save coupon to localStorage
  useEffect(() => {
    if (couponCode && discount > 0) {
      localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify({ code: couponCode, discount }));
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [couponCode, discount]);

  const addToCart = (product: Product, quantity: number = 1) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((item) => item.product.id === product.id);

      if (existingItem) {
        // Update quantity if product already in cart
        return currentItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        // Add new product to cart
        return [...currentItems, { product, quantity }];
      }
    });
  };

  const removeFromCart = (productId: string) => {
    setItems((currentItems) => currentItems.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((currentItems) =>
      currentItems.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setItems([]);
    setCouponCode(null);
    setDiscount(0);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string; discount?: number }> => {
    const upperCode = code.toUpperCase().trim();
    
    // Check if coupon is valid
    const coupon = VALID_COUPONS[upperCode];
    
    if (!coupon) {
      return { success: false, message: 'Invalid coupon code' };
    }

    // Calculate discount
    const calculatedDiscount = coupon.type === 'percentage' 
      ? (subtotal * coupon.discount) / 100 
      : coupon.discount;

    setCouponCode(upperCode);
    setDiscount(calculatedDiscount);

    return { 
      success: true, 
      message: `Coupon applied! You saved ₦${calculatedDiscount.toLocaleString()}`,
      discount: calculatedDiscount
    };
  };

  // Calculate totals
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);
  const total = Math.max(0, subtotal - discount);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemCount,
        subtotal,
        applyCoupon,
        couponCode,
        discount,
        total,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}