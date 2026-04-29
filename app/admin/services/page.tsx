"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ServiceModal } from "@/components/admin/ServiceModal";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { getServices, deleteService } from "@/lib/supabase/services-api";
import type { Service } from "@/lib/supabase/types";

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  // Load services from Supabase
  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
      alert("Failed to load services");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this service?")) return;

    try {
      await deleteService(id);
      await loadServices(); // Reload services
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
    }
  };

  const handleModalSuccess = () => {
    loadServices(); // Reload services after create/update
    setShowAddModal(false);
    setEditingService(null);
  };

  const filteredServices = services.filter((service) =>
    service.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout
      title="Services Management"
      subtitle={`Manage your ${services.length} services`}
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        {/* Search */}
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search services..."
            className="w-full h-12 pl-11 pr-4 rounded-full border-2 border-deep/10 bg-ivory text-sm text-deep placeholder:text-deep/40 focus:border-mauve focus:outline-none transition-colors"
          />
        </div>

        {/* Filter */}
        <button className="h-12 px-6 rounded-full border-2 border-deep/10 bg-ivory hover:bg-mauve-tint transition-colors flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter</span>
        </button>

        {/* Add Service */}
        <button
          onClick={() => setShowAddModal(true)}
          className="h-12 px-6 rounded-full bg-mauve text-ivory hover:bg-mauve-dark transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add Service</span>
        </button>
      </div>

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-mauve" />
        </div>
      ) : (
        /* Services Table */
        <div className="rounded-2xl border-2 border-deep/10 bg-ivory overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-deep/10">
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs uppercase tracking-wider text-deep/60 font-medium">
                      Service
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs uppercase tracking-wider text-deep/60 font-medium">
                      Category
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs uppercase tracking-wider text-deep/60 font-medium">
                      Price
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs uppercase tracking-wider text-deep/60 font-medium">
                      Duration
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs uppercase tracking-wider text-deep/60 font-medium">
                      Slots
                    </span>
                  </th>
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs uppercase tracking-wider text-deep/60 font-medium">
                      Status
                    </span>
                  </th>
                  <th className="px-6 py-4 text-right">
                    <span className="text-xs uppercase tracking-wider text-deep/60 font-medium">
                      Actions
                    </span>
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredServices.map((service) => (
                  <tr
                    key={service.id}
                    className="border-b border-deep/5 hover:bg-mauve-tint/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-deep-tint shrink-0">
                          {service.image_url && (
                            <Image
                              src={service.image_url}
                              alt={service.name}
                              fill
                              className="object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-deep">{service.name}</p>
                          <p className="text-xs text-deep/60 line-clamp-1">
                            {service.description}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-mauve-tint text-mauve text-xs font-medium">
                        {service.category_name}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-deep">
                        ₦{service.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-deep/80">{service.duration_minutes} min</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-deep/80">{service.slots_available}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          service.available
                            ? "bg-sage text-ivory"
                            : "bg-deep/10 text-deep/60"
                        }`}
                      >
                        {service.available ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingService(service);
                            setShowAddModal(true);
                          }}
                          className="h-8 w-8 rounded-lg bg-sage-tint text-sage hover:bg-sage hover:text-ivory transition-colors flex items-center justify-center"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(service.id)}
                          className="h-8 w-8 rounded-lg bg-mauve-tint text-mauve hover:bg-mauve hover:text-ivory transition-colors flex items-center justify-center"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Service Modal */}
      <ServiceModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingService(null);
        }}
        onSuccess={handleModalSuccess}
        editService={editingService}
      />
    </AdminLayout>
  );
}