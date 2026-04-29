"use client";

import { useState, useEffect } from "react";
import { X, Upload, Loader2, Package, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  createBundle,
  updateBundle,
  uploadBundleImage,
  type Bundle,
  type CreateBundleData,
} from "@/lib/supabase/bundles-api";
import { getProducts } from "@/lib/supabase/products-api";
import type { Product } from "@/lib/supabase/types";

interface BundleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editBundle?: Bundle | null;
}

export function BundleModal({
  isOpen,
  onClose,
  onSuccess,
  editBundle,
}: BundleModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    slug: "",
    description: "",
    step: "",
    accent: "mauve" as "mauve" | "sage" | "deep",
    image_url: "",
    product_ids: [] as string[],
    original_price: 0,
    bundle_price: 0,
    is_active: true,
    display_order: 0,
  });

  // Load products on mount
  useEffect(() => {
    loadProducts();
  }, []);

  // Populate form when editing
  useEffect(() => {
    if (editBundle) {
      setFormData({
        name: editBundle.name,
        slug: editBundle.slug,
        description: editBundle.description,
        step: editBundle.step,
        accent: editBundle.accent,
        image_url: editBundle.image_url || "",
        product_ids: editBundle.product_ids,
        original_price: editBundle.original_price,
        bundle_price: editBundle.bundle_price,
        is_active: editBundle.is_active,
        display_order: editBundle.display_order,
      });
    } else {
      // Reset form for new bundle
      setFormData({
        name: "",
        slug: "",
        description: "",
        step: "",
        accent: "mauve",
        image_url: "",
        product_ids: [],
        original_price: 0,
        bundle_price: 0,
        is_active: true,
        display_order: 0,
      });
    }
  }, [editBundle, isOpen]);

  const loadProducts = async () => {
    try {
      setLoadingProducts(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
    } finally {
      setLoadingProducts(false);
    }
  };

  // Auto-generate slug from name
  const handleNameChange = (name: string) => {
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setFormData({ ...formData, name, slug });
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const imageUrl = await uploadBundleImage(file);
      setFormData({ ...formData, image_url: imageUrl });
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Failed to upload image");
    } finally {
      setUploading(false);
    }
  };

  const toggleProduct = (productId: string) => {
    const newProductIds = formData.product_ids.includes(productId)
      ? formData.product_ids.filter((id) => id !== productId)
      : [...formData.product_ids, productId];
    setFormData({ ...formData, product_ids: newProductIds });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.description) {
      alert("Please fill in all required fields");
      return;
    }

    if (formData.product_ids.length === 0) {
      alert("Please select at least one product");
      return;
    }

    if (formData.bundle_price >= formData.original_price) {
      alert("Bundle price must be less than original price");
      return;
    }

    try {
      setLoading(true);

      const bundleData: CreateBundleData = {
        name: formData.name,
        slug: formData.slug,
        description: formData.description,
        step: formData.step,
        accent: formData.accent,
        image_url: formData.image_url || undefined,
        product_ids: formData.product_ids,
        original_price: formData.original_price,
        bundle_price: formData.bundle_price,
        display_order: formData.display_order,
      };

      if (editBundle) {
        await updateBundle(editBundle.id, bundleData);
      } else {
        await createBundle(bundleData);
      }

      onSuccess();
    } catch (error) {
      console.error("Error saving bundle:", error);
      alert("Failed to save bundle");
    } finally {
      setLoading(false);
    }
  };

  // Calculate savings
  const selectedProducts = products.filter((p) =>
    formData.product_ids.includes(p.id)
  );
  const calculatedOriginalPrice = selectedProducts.reduce(
    (sum, p) => sum + p.price,
    0
  );
  const savings = formData.original_price - formData.bundle_price;
  const savingsPercent =
    formData.original_price > 0
      ? Math.round((savings / formData.original_price) * 100)
      : 0;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-deep/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <div className="flex min-h-full items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative w-full max-w-4xl rounded-3xl bg-ivory shadow-2xl"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-deep/10">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-mauve flex items-center justify-center">
                  <Package className="h-5 w-5 text-ivory" strokeWidth={1.5} />
                </div>
                <div>
                  <h2 className="font-display text-2xl font-light text-deep">
                    {editBundle ? "Edit Bundle" : "Create Bundle"}
                  </h2>
                  <p className="text-xs text-deep/60">
                    {editBundle ? "Update bundle details" : "Add a new routine bundle"}
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-full hover:bg-mauve-tint transition-colors"
              >
                <X className="h-5 w-5 text-deep" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Left Column */}
                <div className="space-y-6">
                  {/* Basic Info */}
                  <div>
                    <label className="block text-sm font-medium text-deep mb-2">
                      Bundle Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleNameChange(e.target.value)}
                      placeholder="The Morning Ritual"
                      className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep mb-2">
                      Slug (auto-generated)
                    </label>
                    <input
                      type="text"
                      value={formData.slug}
                      onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                      className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-deep-tint/30 text-deep/60 focus:border-mauve focus:outline-none transition-colors"
                      readOnly
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-deep mb-2">
                      Description *
                    </label>
                    <textarea
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({ ...formData, description: e.target.value })
                      }
                      placeholder="Complete morning skincare routine..."
                      rows={4}
                      className="w-full px-4 py-3 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors resize-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-deep mb-2">
                        Step Label
                      </label>
                      <input
                        type="text"
                        value={formData.step}
                        onChange={(e) =>
                          setFormData({ ...formData, step: e.target.value })
                        }
                        placeholder="3-step AM"
                        className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-deep mb-2">
                        Accent Color
                      </label>
                      <select
                        value={formData.accent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            accent: e.target.value as "mauve" | "sage" | "deep",
                          })
                        }
                        className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors capitalize"
                      >
                        <option value="mauve">Mauve</option>
                        <option value="sage">Sage</option>
                        <option value="deep">Deep</option>
                      </select>
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div>
                    <label className="block text-sm font-medium text-deep mb-2">
                      Bundle Image
                    </label>
                    <div className="relative">
                      {formData.image_url ? (
                        <div className="relative h-48 rounded-xl overflow-hidden border-2 border-deep/10">
                          <Image
                            src={formData.image_url}
                            alt="Bundle preview"
                            fill
                            className="object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setFormData({ ...formData, image_url: "" })}
                            className="absolute top-2 right-2 p-2 rounded-full bg-deep/80 text-ivory hover:bg-deep transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </div>
                      ) : (
                        <label className="flex flex-col items-center justify-center h-48 rounded-xl border-2 border-dashed border-deep/20 bg-mauve-tint/30 cursor-pointer hover:border-mauve transition-colors">
                          {uploading ? (
                            <Loader2 className="h-8 w-8 animate-spin text-mauve" />
                          ) : (
                            <>
                              <Upload className="h-8 w-8 text-mauve mb-2" />
                              <p className="text-sm text-deep">Upload bundle image</p>
                            </>
                          )}
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="hidden"
                            disabled={uploading}
                          />
                        </label>
                      )}
                    </div>
                  </div>

                  {/* Pricing */}
                  <div className="p-4 rounded-xl bg-sage-tint border border-sage/20">
                    <h3 className="font-medium text-deep mb-3">Pricing</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs text-deep/60 mb-1">
                          Original Price (₦)
                        </label>
                        <input
                          type="number"
                          value={formData.original_price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              original_price: Number(e.target.value),
                            })
                          }
                          className="w-full h-10 px-3 rounded-lg border border-sage/30 bg-ivory text-deep focus:border-sage focus:outline-none"
                          min="0"
                          step="100"
                        />
                      </div>
                      <div>
                        <label className="block text-xs text-deep/60 mb-1">
                          Bundle Price (₦)
                        </label>
                        <input
                          type="number"
                          value={formData.bundle_price}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              bundle_price: Number(e.target.value),
                            })
                          }
                          className="w-full h-10 px-3 rounded-lg border border-sage/30 bg-ivory text-deep focus:border-sage focus:outline-none"
                          min="0"
                          step="100"
                        />
                      </div>
                    </div>
                    {formData.original_price > 0 && formData.bundle_price > 0 && (
                      <div className="mt-3 pt-3 border-t border-sage/20">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-deep/60">Savings:</span>
                          <span className="font-medium text-sage">
                            ₦{savings.toLocaleString()} ({savingsPercent}%)
                          </span>
                        </div>
                      </div>
                    )}
                    {calculatedOriginalPrice > 0 && (
                      <div className="mt-2 p-2 rounded bg-sage/10">
                        <p className="text-xs text-deep/60">
                          💡 Selected products total: ₦{calculatedOriginalPrice.toLocaleString()}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Settings */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        id="is_active"
                        checked={formData.is_active}
                        onChange={(e) =>
                          setFormData({ ...formData, is_active: e.target.checked })
                        }
                        className="h-4 w-4 rounded border-deep/20 text-mauve focus:ring-mauve"
                      />
                      <label htmlFor="is_active" className="text-sm text-deep cursor-pointer">
                        Active (show on website)
                      </label>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-deep mb-2">
                        Display Order
                      </label>
                      <input
                        type="number"
                        value={formData.display_order}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            display_order: Number(e.target.value),
                          })
                        }
                        className="w-full h-10 px-4 rounded-lg border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none"
                        min="0"
                      />
                      <p className="text-xs text-deep/60 mt-1">
                        Lower numbers appear first
                      </p>
                    </div>
                  </div>
                </div>

                {/* Right Column - Product Selection */}
                <div>
                  <h3 className="font-medium text-deep mb-3">
                    Select Products ({formData.product_ids.length} selected)
                  </h3>
                  {loadingProducts ? (
                    <div className="flex items-center justify-center py-12">
                      <Loader2 className="h-6 w-6 animate-spin text-mauve" />
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                      {products.map((product) => {
                        const isSelected = formData.product_ids.includes(product.id);
                        return (
                          <button
                            key={product.id}
                            type="button"
                            onClick={() => toggleProduct(product.id)}
                            className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 transition-colors ${
                              isSelected
                                ? "border-mauve bg-mauve-tint"
                                : "border-deep/10 bg-ivory hover:border-mauve/30"
                            }`}
                          >
                            <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-deep-tint shrink-0">
                              {product.image_url && (
                                <Image
                                  src={product.image_url}
                                  alt={product.name}
                                  fill
                                  className="object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 text-left">
                              <p className="font-medium text-sm text-deep line-clamp-1">
                                {product.name}
                              </p>
                              <p className="text-xs text-deep/60">
                                ₦{product.price.toLocaleString()}
                              </p>
                            </div>
                            <div
                              className={`h-5 w-5 rounded border-2 flex items-center justify-center shrink-0 ${
                                isSelected
                                  ? "bg-mauve border-mauve"
                                  : "border-deep/30"
                              }`}
                            >
                              {isSelected && (
                                <svg
                                  className="h-3 w-3 text-ivory"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={3}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              )}
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-3 mt-6 pt-6 border-t border-deep/10">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-6 py-3 rounded-full border-2 border-deep/10 text-deep hover:bg-mauve-tint transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 rounded-full bg-mauve text-ivory hover:bg-mauve-dark transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  {loading && <Loader2 className="h-4 w-4 animate-spin" />}
                  {editBundle ? "Update Bundle" : "Create Bundle"}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
}