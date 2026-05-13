"use client";

import { useState, useEffect, useCallback } from "react";
import { X, Upload, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { createProduct, updateProduct, uploadProductImage } from "@/lib/supabase/products-api";
import type { Product } from "@/lib/supabase/types";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";

const PRODUCT_CATEGORIES = [
  { id: "cleansers", name: "Cleansers" },
  { id: "serums", name: "Serums" },
  { id: "moisturizers", name: "Moisturizers" },
  { id: "masks", name: "Masks" },
  { id: "tools", name: "Tools" },
  { id: "bundles", name: "Bundles" },
  { id: "bath-body", name: "Bath & Body" },
];

const STOCK_STATUS = [
  { id: "in-stock", name: "In Stock" },
  { id: "low-stock", name: "Low Stock" },
  { id: "pre-order", name: "Pre-order" },
];

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editProduct?: Product | null;
}

export function ProductModal({ isOpen, onClose, onSuccess, editProduct }: ProductModalProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  
  const { notification, showSuccess, hideSuccess } = useSuccessNotification();

  const [formData, setFormData] = useState({
    name: "",
    tagline: "",
    category: "",
    price: 0,
    original_price: 0,
    volume: "",
    key_ingredient: "",
    description: "",
    stock: 0,
    stock_status: "in-stock" as "in-stock" | "low-stock" | "pre-order" | "out-of-stock",
    is_new_arrival: false,
    is_bestseller: false,
    is_exclusive: false,
    accent: "mauve" as "mauve" | "sage" | "deep",
    image_url: "",
    rating: 4.8,
    review_count: 0,
  });

  useEffect(() => {
    hideSuccess();
    if (editProduct) {
      setFormData({
        name: editProduct.name,
        tagline: editProduct.tagline,
        category: editProduct.category,
        price: editProduct.price,
        original_price: editProduct.original_price || 0,
        volume: editProduct.volume,
        key_ingredient: editProduct.key_ingredient,
        description: editProduct.description,
        stock: editProduct.stock,
        stock_status: editProduct.stock_status,
        is_new_arrival: editProduct.is_new_arrival || false,
        is_bestseller: editProduct.is_bestseller || false,
        is_exclusive: editProduct.is_exclusive || false,
        accent: editProduct.accent,
        image_url: editProduct.image_url,
        rating: editProduct.rating,
        review_count: editProduct.review_count,
      });
      setImagePreview(editProduct.image_url);
      setImageFile(null);
    } else {
      setFormData({
        name: "",
        tagline: "",
        category: "",
        price: 0,
        original_price: 0,
        volume: "",
        key_ingredient: "",
        description: "",
        stock: 0,
        stock_status: "in-stock",
        is_new_arrival: false,
        is_bestseller: false,
        is_exclusive: false,
        accent: "mauve",
        image_url: "",
        rating: 4.8,
        review_count: 0,
      });
      setImagePreview("");
      setImageFile(null);
    }
  }, [editProduct, isOpen]);

  const handleImageChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      if (imageFile) {
        const tempId = editProduct?.id || `temp-${Date.now()}`;
        imageUrl = await uploadProductImage(imageFile, tempId);
      }

      const productData = {
        ...formData,
        image_url: imageUrl,
        original_price: formData.original_price || undefined,
      };

      if (editProduct) {
        await updateProduct(editProduct.id, productData);
        showSuccess("item-updated", {
          title: "Product Updated!",
          message: `${formData.name} has been successfully updated`,
        });
      } else {
        await createProduct(productData as any);
        showSuccess("product-uploaded", {
          title: "Product Created!",
          message: `${formData.name} has been added to your shop`,
        });
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error saving product:", error);
      showSuccess("generic-success", {
        title: "Error",
        message: "Failed to save product. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  }, [formData, imageFile, editProduct, onSuccess, onClose, showSuccess]);

  const handleBackdropClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-mauve to-sage px-6 py-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-light text-white">
              {editProduct ? "Edit Product" : "Add New Product"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:text-white/80 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Scrollable Form */}
          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {/* Image Upload */}
              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  Product Image
                </label>
                <div className="flex gap-4">
                  {imagePreview && (
                    <div className="relative h-32 w-32 rounded-xl overflow-hidden bg-deep-tint shrink-0">
                      <Image
                        src={imagePreview}
                        alt="Preview"
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <label className="flex-1 flex flex-col items-center justify-center h-32 border-2 border-dashed border-deep/20 rounded-xl hover:border-mauve cursor-pointer transition-colors">
                    <Upload className="h-8 w-8 text-deep/40 mb-2" />
                    <span className="text-sm text-deep/60">Click to upload image</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                  </label>
                </div>
              </div>

              {/* Name & Tagline */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deep mb-2">
                    Product Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                    placeholder="Vitamin C Serum"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep mb-2">
                    Tagline
                  </label>
                  <input
                    type="text"
                    value={formData.tagline}
                    onChange={(e) => setFormData({ ...formData, tagline: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                    placeholder="Radiant skin, daily"
                  />
                </div>
              </div>

              {/* Category & Stock */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deep mb-2">
                    Category *
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                  >
                    <option value="">Select category</option>
                    {PRODUCT_CATEGORIES.map((cat) => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep mb-2">
                    Stock Quantity
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                    placeholder="100"
                  />
                </div>
              </div>

              {/* Stock Status */}
              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  Stock Status
                </label>
                <select
                  value={formData.stock_status}
                  onChange={(e) => setFormData({ ...formData, stock_status: e.target.value as any })}
                  className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                >
                  {STOCK_STATUS.map((status) => (
                    <option key={status.id} value={status.id}>
                      {status.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Price & Original Price */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deep mb-2">
                    Price (₦) *
                  </label>
                  <input
                    type="number"
                    required
                    min="0"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                    placeholder="45000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep mb-2">
                    Original Price (for sale)
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={formData.original_price}
                    onChange={(e) => setFormData({ ...formData, original_price: Number(e.target.value) })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                    placeholder="50000"
                  />
                </div>
              </div>

              {/* Volume & Key Ingredient */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-deep mb-2">
                    Volume
                  </label>
                  <input
                    type="text"
                    value={formData.volume}
                    onChange={(e) => setFormData({ ...formData, volume: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                    placeholder="30ml"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep mb-2">
                    Key Ingredient
                  </label>
                  <input
                    type="text"
                    value={formData.key_ingredient}
                    onChange={(e) => setFormData({ ...formData, key_ingredient: e.target.value })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                    placeholder="Vitamin C"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  Description *
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors resize-none"
                  placeholder="A potent vitamin C serum that brightens and evens skin tone..."
                />
              </div>

              {/* Featured Options */}
              <div className="space-y-3 p-4 rounded-xl bg-mauve-tint/30 border border-mauve/20">
                <p className="text-sm font-medium text-deep mb-3">Featured Options</p>
                
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_new_arrival"
                    checked={formData.is_new_arrival}
                    onChange={(e) => setFormData({ ...formData, is_new_arrival: e.target.checked })}
                    className="h-5 w-5 rounded border-2 border-deep/20 text-sage focus:ring-sage"
                  />
                  <label htmlFor="is_new_arrival" className="text-sm font-medium text-deep cursor-pointer">
                    ⭐ Mark as NEW ARRIVAL (shows on homepage)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_bestseller"
                    checked={formData.is_bestseller}
                    onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked })}
                    className="h-5 w-5 rounded border-2 border-deep/20 text-mauve focus:ring-mauve"
                  />
                  <label htmlFor="is_bestseller" className="text-sm font-medium text-deep cursor-pointer">
                    🏆 Mark as BESTSELLER (shows on homepage)
                  </label>
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="is_exclusive"
                    checked={formData.is_exclusive}
                    onChange={(e) => setFormData({ ...formData, is_exclusive: e.target.checked })}
                    className="h-5 w-5 rounded border-2 border-deep/20 text-deep focus:ring-deep"
                  />
                  <label htmlFor="is_exclusive" className="text-sm font-medium text-deep cursor-pointer">
                    💎 Mark as EXCLUSIVE
                  </label>
                </div>
              </div>

              {/* Accent Color */}
              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  Accent Color
                </label>
                <div className="flex gap-3">
                  {(["mauve", "sage", "deep"] as const).map((color) => {
                    const activeClasses = { mauve: "bg-mauve text-ivory", sage: "bg-sage text-ivory", deep: "bg-deep text-ivory" };
                    const inactiveClasses = { mauve: "bg-mauve-tint text-deep hover:bg-mauve/20", sage: "bg-sage-tint text-deep hover:bg-sage/20", deep: "bg-deep-tint text-deep hover:bg-deep/20" };
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => setFormData({ ...formData, accent: color })}
                        className={`px-4 py-2 rounded-full text-xs font-medium capitalize transition-colors ${
                          formData.accent === color ? activeClasses[color] : inactiveClasses[color]
                        }`}
                      >
                        {color}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-12 rounded-full border-2 border-deep/10 bg-ivory text-deep hover:bg-mauve-tint transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-12 rounded-full bg-mauve text-ivory hover:bg-mauve-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    editProduct ? "Update Product" : "Create Product"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      <SuccessNotification {...notification} onClose={hideSuccess} />
    </>
  );
}