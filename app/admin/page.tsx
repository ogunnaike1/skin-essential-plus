"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import { Gift } from "lucide-react";

export default function BundlesManagement() {
  return (
    <AdminLayout
      title="Bundles Management"
      subtitle="Product bundles and packages"
    >
      <div className="text-center py-20 rounded-2xl border-2 border-dashed border-deep/20">
        <Gift className="h-12 w-12 text-deep/20 mx-auto mb-4" />
        <h3 className="font-display text-xl font-light text-deep mb-2">
          Bundles feature coming soon
        </h3>
        <p className="text-sm text-deep/60">
          Bundle management will be available in a future update
        </p>
      </div>
    </AdminLayout>
  );
}