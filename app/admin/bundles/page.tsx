"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { BundleModal } from "@/components/admin/BundleModal";
import {
  Plus,
  Edit2,
  Trash2,
  Loader2,
  Gift,
  Package,
  DollarSign,
  Eye,
  EyeOff,
} from "lucide-react";
import Image from "next/image";
import { getBundles, deleteBundle } from "@/lib/supabase/bundles-api";
import type { Bundle } from "@/lib/supabase/bundles-api";

export default function BundlesManagement() {
  const [bundles, setBundles] = useState<Bundle[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingBundle, setEditingBundle] = useState<Bundle | null>(null);

  const loadBundles = async () => {
    try {
      setLoading(true);
      const data = await getBundles();
      setBundles(data);
    } catch (error) {
      console.error("Error loading bundles:", error);
      alert("Failed to load bundles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBundles();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this bundle?")) return;

    try {
      await deleteBundle(id);
      await loadBundles();
    } catch (error) {
      console.error("Error deleting bundle:", error);
      alert("Failed to delete bundle");
    }
  };

  const handleModalSuccess = () => {
    loadBundles();
    setShowAddModal(false);
    setEditingBundle(null);
  };

  // Calculate stats
  const activeBundles = bundles.filter(b => b.is_active).length;
  const totalSavings = bundles.reduce((sum, b) => sum + (b.original_price - b.bundle_price), 0);

  return (
    <AdminLayout
      title="Bundles Management"
      subtitle={`Manage your ${bundles.length} routine bundles`}
    >
      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="px-4 py-3 rounded-xl bg-mauve-tint border border-mauve/20">
          <div className="flex items-center gap-2 mb-1">
            <Package className="h-4 w-4 text-mauve" />
            <span className="text-xs uppercase tracking-wider text-mauve font-medium">Total</span>
          </div>
          <p className="text-2xl font-display font-light text-deep">{bundles.length}</p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-sage-tint border border-sage/20">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-4 w-4 text-sage" />
            <span className="text-xs uppercase tracking-wider text-sage font-medium">Active</span>
          </div>
          <p className="text-2xl font-display font-light text-deep">{activeBundles}</p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-mauve-tint border border-mauve/20">
          <div className="flex items-center gap-2 mb-1">
            <Gift className="h-4 w-4 text-mauve" />
            <span className="text-xs uppercase tracking-wider text-mauve font-medium">Total Savings</span>
          </div>
          <p className="text-2xl font-display font-light text-deep">₦{totalSavings.toLocaleString()}</p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-sage-tint border border-sage/20">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-sage" />
            <span className="text-xs uppercase tracking-wider text-sage font-medium">Avg Bundle Price</span>
          </div>
          <p className="text-2xl font-display font-light text-deep">
            ₦{bundles.length > 0 ? Math.round(bundles.reduce((sum, b) => sum + b.bundle_price, 0) / bundles.length).toLocaleString() : 0}
          </p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex justify-end mb-6">
        <button
          onClick={() => setShowAddModal(true)}
          className="h-12 px-6 rounded-full bg-mauve text-ivory hover:bg-mauve-dark transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add Bundle</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-mauve" />
        </div>
      ) : bundles.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border-2 border-dashed border-deep/20">
          <Gift className="h-12 w-12 text-deep/20 mx-auto mb-4" />
          <h3 className="font-display text-xl font-light text-deep mb-2">
            No bundles yet
          </h3>
          <p className="text-sm text-deep/60 mb-6">
            Create your first routine bundle to get started
          </p>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-6 py-3 rounded-full bg-mauve text-ivory hover:bg-mauve-dark transition-colors"
          >
            Create Bundle
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bundles.map((bundle) => {
            const savings = bundle.original_price - bundle.bundle_price;
            const savingsPercent = Math.round((savings / bundle.original_price) * 100);
            
            const accentBg: Record<typeof bundle.accent, string> = {
              mauve: "bg-mauve",
              sage: "bg-sage",
              deep: "bg-deep",
            };

            return (
              <div
                key={bundle.id}
                className="rounded-2xl border-2 border-deep/10 bg-ivory overflow-hidden hover:shadow-lg transition-shadow"
              >
                {/* Bundle Image */}
                {bundle.image_url ? (
                  <div className="relative h-48 bg-deep-tint">
                    <Image
                      src={bundle.image_url}
                      alt={bundle.name}
                      fill
                      className="object-cover"
                    />
                    {/* Savings Badge */}
                    <div className="absolute top-3 right-3">
                      <div className={`h-14 w-14 rounded-full flex flex-col items-center justify-center text-ivory shadow-lg ${accentBg[bundle.accent]}`}>
                        <span className="text-sm font-bold leading-none">−{savingsPercent}%</span>
                        <span className="text-[8px] uppercase mt-0.5">Save</span>
                      </div>
                    </div>
                    {/* Status Badge */}
                    {!bundle.is_active && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-deep/80 text-ivory text-[10px] font-medium">
                          <EyeOff className="h-2.5 w-2.5" />
                          Hidden
                        </span>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="h-48 bg-mauve-tint flex items-center justify-center">
                    <Gift className="h-12 w-12 text-mauve" />
                  </div>
                )}
                
                <div className="p-6">
                  {/* Bundle Info */}
                  <div className="mb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-medium text-ivory ${accentBg[bundle.accent]}`}>
                        {bundle.step}
                      </span>
                      <span className="text-xs text-deep/60">
                        {bundle.product_ids.length} products
                      </span>
                    </div>
                    <h3 className="font-display text-xl font-light text-deep mb-2">
                      {bundle.name}
                    </h3>
                    <p className="text-sm text-deep/70 line-clamp-2">
                      {bundle.description}
                    </p>
                  </div>
                  
                  {/* Pricing */}
                  <div className="flex items-center gap-3 mb-4 pb-4 border-b border-deep/10">
                    <span className="text-sm text-deep/60 line-through">
                      ₦{bundle.original_price.toLocaleString()}
                    </span>
                    <span className="font-display text-2xl text-mauve">
                      ₦{bundle.bundle_price.toLocaleString()}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setEditingBundle(bundle);
                        setShowAddModal(true);
                      }}
                      className="flex-1 h-10 rounded-lg bg-sage-tint text-sage hover:bg-sage hover:text-ivory transition-colors flex items-center justify-center gap-2"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                      <span className="text-sm font-medium">Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(bundle.id)}
                      className="flex-1 h-10 rounded-lg bg-mauve-tint text-mauve hover:bg-mauve hover:text-ivory transition-colors flex items-center justify-center gap-2"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      <span className="text-sm font-medium">Delete</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <BundleModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingBundle(null);
        }}
        onSuccess={handleModalSuccess}
        editBundle={editingBundle}
      />
    </AdminLayout>
  );
}