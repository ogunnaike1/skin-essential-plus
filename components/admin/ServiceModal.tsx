"use client";

import { useState, useEffect } from "react";
import { X, Upload, Loader2 } from "lucide-react";
import Image from "next/image";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";

interface Service {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image_url: string | null;
  is_active: boolean;
}

interface ServiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  editService?: Service | null;
}

const SERVICE_CATEGORIES = [
  "Pedicure Treatment",
  "Advanced Facial",
  "Skin Treatment",
  "Massage",
  "Lash Extension",
  "Semi Permanent Brows",
  "Facial Treatment",
  "Skin IV Drips",
  "Tattoo Removal",
  "PRP Stretch Mark Treatment",
  "Body Enhancement",
  "Face Waxing",
  "Bikini & Brazilian Waxing",
  "Body Waxing",
  "Teeth Whitening",
];

export function ServiceModal({ isOpen, onClose, onSuccess, editService }: ServiceModalProps) {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>("");
  
  const { notification, showSuccess, hideSuccess } = useSuccessNotification();
  
  const [formData, setFormData] = useState({
    name: "",
    category: "",
    description: "",
    price: 0,
    duration: 60,
    image_url: "",
    is_active: true,
  });

  useEffect(() => {
    if (editService) {
      setFormData({
        name: editService.name,
        category: editService.category,
        description: editService.description,
        price: editService.price,
        duration: editService.duration,
        image_url: editService.image_url || "",
        is_active: editService.is_active,
      });
      setImagePreview(editService.image_url || "");
    } else {
      setFormData({
        name: "",
        category: "",
        description: "",
        price: 0,
        duration: 60,
        image_url: "",
        is_active: true,
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

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', 'services');

    const res = await fetch('/api/admin/services', {
      method: 'PUT',
      body: formData,
    });

    if (!res.ok) {
      throw new Error('Failed to upload image');
    }

    const data = await res.json();
    return data.url;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = formData.image_url;

      // Upload new image if selected
      if (imageFile) {
        setUploading(true);
        try {
          imageUrl = await uploadImage(imageFile);
          console.log('Image uploaded successfully:', imageUrl);
        } catch (error) {
          console.error('Image upload failed:', error);
          showSuccess("generic-success", {
            title: "Image Upload Failed",
            message: "Failed to upload image. Continuing without image.",
          });
        } finally {
          setUploading(false);
        }
      }

      const serviceData = {
        ...formData,
        image_url: imageUrl || null,
      };

      if (editService) {
        // Update existing service
        const res = await fetch(`/api/admin/services/${editService.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData),
        });

        if (!res.ok) throw new Error('Failed to update service');

        showSuccess("item-updated", {
          title: "Service Updated!",
          message: `${formData.name} has been successfully updated`,
        });
      } else {
        // Create new service
        const res = await fetch('/api/admin/services', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(serviceData),
        });

        if (!res.ok) throw new Error('Failed to create service');

        showSuccess("service-uploaded", {
          title: "Service Created!",
          message: `${formData.name} has been added to your services`,
        });
      }

      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1500);
    } catch (error) {
      console.error("Error saving service:", error);
      showSuccess("generic-success", {
        title: "Error",
        message: "Failed to save service. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

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
    <>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
        onClick={handleBackdropClick}
      >
        <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden shadow-2xl">
          <div className="bg-gradient-to-r from-mauve to-sage px-6 py-4 flex items-center justify-between">
            <h2 className="font-display text-2xl font-light text-white">
              {editService ? "Edit Service" : "Add New Service"}
            </h2>
            <button
              type="button"
              onClick={onClose}
              className="text-white hover:text-white/80 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <div className="overflow-y-auto max-h-[calc(90vh-80px)]">
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
                      {uploading && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Loader2 className="h-6 w-6 text-white animate-spin" />
                        </div>
                      )}
                    </div>
                  )}
                  <div className="flex-1">
                    <label className="flex flex-col items-center justify-center h-32 border-2 border-dashed border-deep/20 rounded-xl cursor-pointer hover:border-mauve transition-colors">
                      <Upload className="h-6 w-6 text-deep/40 mb-2" />
                      <span className="text-sm text-deep/60">
                        {uploading ? 'Uploading...' : 'Click to upload'}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                        disabled={uploading}
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
                  className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none"
                  placeholder="e.g., Boom Pedicure"
                />
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-deep mb-2">
                  Category *
                </label>
                <select
                  required
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none"
                >
                  <option value="">Select category</option>
                  {SERVICE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
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
                  rows={3}
                  className="w-full px-4 py-3 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none resize-none"
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
                    step="100"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none"
                    placeholder="15000"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-deep mb-2">
                    Duration (min) *
                  </label>
                  <input
                    type="number"
                    required
                    min="15"
                    step="15"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: Number(e.target.value) })}
                    className="w-full h-12 px-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep focus:border-mauve focus:outline-none"
                    placeholder="60"
                  />
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="is_active"
                  checked={formData.is_active}
                  onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                  className="h-5 w-5 rounded border-2 border-deep/20 text-mauve focus:ring-mauve"
                />
                <label htmlFor="is_active" className="text-sm font-medium text-deep">
                  Service is active and visible to customers
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 h-12 rounded-full border-2 border-deep/10 bg-ivory text-deep hover:bg-mauve-tint transition-colors"
                  disabled={loading || uploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading || uploading}
                  className="flex-1 h-12 rounded-full bg-mauve text-ivory hover:bg-mauve-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading || uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      {uploading ? 'Uploading...' : 'Saving...'}
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

      {/* Success Notification */}
      <SuccessNotification {...notification} onClose={hideSuccess} />
    </>
  );
}