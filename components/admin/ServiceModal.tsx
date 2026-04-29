"use client";

import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { createService, updateService, uploadServiceImage } from "@/lib/supabase/services-api";
import type { Service } from "@/lib/supabase/types";

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editService?: Service | null;
}

const SERVICE_CATEGORIES = [
  { id: "pedicure", name: "Pedicure Treatment" },
  { id: "advanced-facial", name: "Advanced Facial" },
  { id: "facial", name: "Facial Treatment" },
  { id: "skin-treatment", name: "Skin Treatment" },
  { id: "massage", name: "Massage Therapy" },
  { id: "lash-extension", name: "Lash Extension" },
  { id: "hair", name: "Hair & Scalp" },
  { id: "body", name: "Body Enhancement" },
  { id: "nails", name: "Nail Care" },
  { id: "waxing", name: "Waxing & Hair Removal" },
  { id: "makeup", name: "Makeup & Styling" },
];

export function ServiceModal({ isOpen, onClose, onSuccess, editService }: ServiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    category_name: "",
    description: "",
    price: 0,
    duration_minutes: 60,
    image_url: "",
    available: true,
    slots_total: 10,
    slots_available: 10,
    location: "Main Studio",
    tag: "",
    rating: 4.8,
    review_count: 0,
    popular: false,
  });

  useEffect(() => {
    if (editService) {
      setFormData({
        name: editService.name,
        category_id: editService.category_id,
        category_name: editService.category_name,
        description: editService.description,
        price: editService.price,
        duration_minutes: editService.duration_minutes,
        image_url: editService.image_url,
        available: editService.available,
        slots_total: editService.slots_total,
        slots_available: editService.slots_available,
        location: editService.location,
        tag: editService.tag,
        rating: editService.rating,
        review_count: editService.review_count,
        popular: editService.popular || false,
      });
      setImagePreview(editService.image_url);
    } else {
      // Reset form for new service
      setFormData({
        name: "",
        category_id: "",
        category_name: "",
        description: "",
        price: 0,
        duration_minutes: 60,
        image_url: "",
        available: true,
        slots_total: 10,
        slots_available: 10,
        location: "Main Studio",
        tag: "",
        rating: 4.8,
        review_count: 0,
        popular: false,
      });
      setImagePreview("");
      setImageFile(null);
    }
  }, [editService, isOpen]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCategoryChange = (categoryId: string) => {
    const category = SERVICE_CATEGORIES.find((c) => c.id === categoryId);
    setFormData({
      ...formData,
      category_id: categoryId,
      category_name: category?.name || "",
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (imageFile) {
        const tempId = editService?.id || `temp-${Date.now()}`;
        imageUrl = await uploadServiceImage(imageFile, tempId);
      }

      const serviceData = {
        ...formData,
        image_url: imageUrl,
      };

      if (editService) {
        await updateService(editService.id, serviceData);
      } else {
        await createService(serviceData);
      }

      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error saving service:", error);
      alert("Failed to save service. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="bg-gradient-to-r from-mauve to-sage px-6 py-4 flex items-center justify-between">
          <h2 className="font-display text-2xl font-light text-white">
            {editService ? "Edit Service" : "Add New Service"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-white hover:text-white/80 transition-colors"
            aria-label="Close"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Scrollable Form Container */}
        <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-deep mb-2">
              Service Image
            </label>
            <div className="flex items-start gap-4">
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
              <div className="flex-1">
                <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-deep/20 rounded-xl cursor-pointer hover:border-mauve transition-colors">
                  <Upload className="h-6 w-6 text-deep/40 mb-2" />
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
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-deep mb-2">
              Service Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
              placeholder="e.g., Signature Facial"
            />
          </div>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-deep mb-2">
              Category *
            </label>
            <select
              required
              value={formData.category_id}
              onChange={(e) => handleCategoryChange(e.target.value)}
              className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
            >
              <option value="">Select category</option>
              {SERVICE_CATEGORIES.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-deep mb-2">
              Description *
            </label>
            <textarea
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
              className="w-full px-4 py-3 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors resize-none"
              placeholder="Describe the service..."
            />
          </div>

          {/* Price and Duration */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-deep mb-2">
                Price (₦) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="1000"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                placeholder="35000"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep mb-2">
                Duration (minutes) *
              </label>
              <input
                type="number"
                required
                min="15"
                step="15"
                value={formData.duration_minutes}
                onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
                className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                placeholder="60"
              />
            </div>
          </div>

          {/* Tag and Location */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-deep mb-2">
                Tag
              </label>
              <input
                type="text"
                value={formData.tag}
                onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                placeholder="e.g., Popular, Relaxing"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep mb-2">
                Location
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                placeholder="Main Studio"
              />
            </div>
          </div>

          {/* Slots */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-deep mb-2">
                Total Slots
              </label>
              <input
                type="number"
                min="0"
                value={formData.slots_total}
                onChange={(e) => setFormData({ ...formData, slots_total: Number(e.target.value) })}
                className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                placeholder="10"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-deep mb-2">
                Available Slots
              </label>
              <input
                type="number"
                min="0"
                value={formData.slots_available}
                onChange={(e) => setFormData({ ...formData, slots_available: Number(e.target.value) })}
                className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none transition-colors"
                placeholder="10"
              />
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="available"
                checked={formData.available}
                onChange={(e) => setFormData({ ...formData, available: e.target.checked })}
                className="h-5 w-5 rounded border-2 border-deep/20 text-mauve focus:ring-mauve"
              />
              <label htmlFor="available" className="text-sm font-medium text-deep">
                Service is available for booking
              </label>
            </div>

            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="popular"
                checked={formData.popular}
                onChange={(e) => setFormData({ ...formData, popular: e.target.checked })}
                className="h-5 w-5 rounded border-2 border-deep/20 text-mauve focus:ring-mauve"
              />
              <label htmlFor="popular" className="text-sm font-medium text-deep">
                Mark as popular service
              </label>
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
                editService ? "Update Service" : "Create Service"
              )}
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
  );
}