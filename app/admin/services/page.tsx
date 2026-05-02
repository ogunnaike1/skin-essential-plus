"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ServiceModal } from "@/components/admin/ServiceModal";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  Eye,
  EyeOff,
  Sparkles,
} from "lucide-react";
import Image from "next/image";

// Use the admin API - will be created
interface Service {
  id: string;
  name: string;
  slug: string;
  category: string;
  description: string;
  price: number;
  duration: number;
  image_url: string | null;
  is_active: boolean;
  display_order: number;
  created_at: string;
  updated_at: string;
}

// Temporary admin functions - will use API routes
async function getServices(): Promise<Service[]> {
  const res = await fetch('/api/admin/services');
  if (!res.ok) throw new Error('Failed to fetch services');
  return res.json();
}

async function deleteService(id: string): Promise<void> {
  const res = await fetch(`/api/admin/services/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete service');
}

export default function ServicesManagement() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);

  const loadServices = async () => {
    try {
      setLoading(true);
      const data = await getServices();
      setServices(data);
    } catch (error) {
      console.error("Error loading services:", error);
      alert("Failed to load services. Check console for details.");
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
      await loadServices();
    } catch (error) {
      console.error("Error deleting service:", error);
      alert("Failed to delete service");
    }
  };

  const handleModalSuccess = () => {
    loadServices();
    setShowAddModal(false);
    setEditingService(null);
  };

  const filteredServices = services.filter((service) => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  // Get unique categories
  const categories = Array.from(new Set(services.map(s => s.category))).sort();

  // Stats
  const activeServices = services.filter(s => s.is_active).length;
  const avgPrice = services.length > 0 
    ? Math.round(services.reduce((sum, s) => sum + s.price, 0) / services.length)
    : 0;

  return (
    <AdminLayout
      title="Services Management"
      subtitle={`Manage your ${services.length} services across ${categories.length} categories`}
    >
      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="px-4 py-3 rounded-xl bg-mauve-tint border border-mauve/20">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-mauve" />
            <span className="text-xs uppercase tracking-wider text-mauve font-medium">Total</span>
          </div>
          <p className="text-2xl font-display font-light text-deep">{services.length}</p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-sage-tint border border-sage/20">
          <div className="flex items-center gap-2 mb-1">
            <Eye className="h-4 w-4 text-sage" />
            <span className="text-xs uppercase tracking-wider text-sage font-medium">Active</span>
          </div>
          <p className="text-2xl font-display font-light text-deep">{activeServices}</p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-mauve-tint border border-mauve/20">
          <div className="flex items-center gap-2 mb-1">
            <EyeOff className="h-4 w-4 text-mauve" />
            <span className="text-xs uppercase tracking-wider text-mauve font-medium">Inactive</span>
          </div>
          <p className="text-2xl font-display font-light text-deep">{services.length - activeServices}</p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-sage-tint border border-sage/20">
          <div className="flex items-center gap-2 mb-1">
            <span className="h-4 w-4 text-sage text-lg">₦</span>
            <span className="text-xs uppercase tracking-wider text-sage font-medium">Avg Price</span>
          </div>
          <p className="text-2xl font-display font-light text-deep">₦{avgPrice.toLocaleString()}</p>
        </div>
      </div>

      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
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

        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="h-12 px-4 rounded-full border-2 border-deep/10 bg-ivory text-sm text-deep focus:border-mauve focus:outline-none transition-colors"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-12 px-6 rounded-full bg-mauve text-ivory hover:bg-mauve-dark transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add Service</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-mauve" />
        </div>
      ) : filteredServices.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border-2 border-dashed border-deep/20">
          <Sparkles className="h-12 w-12 text-deep/20 mx-auto mb-4" />
          <h3 className="font-display text-xl font-light text-deep mb-2">
            {searchTerm || filterCategory !== "all" ? "No services found" : "No services yet"}
          </h3>
          <p className="text-sm text-deep/60 mb-6">
            {searchTerm || filterCategory !== "all" 
              ? "Try adjusting your search or filter" 
              : "Create your first service to get started"}
          </p>
          {!searchTerm && filterCategory === "all" && (
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 rounded-full bg-mauve text-ivory hover:bg-mauve-dark transition-colors"
            >
              Create Service
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <div
              key={service.id}
              className="rounded-2xl border-2 border-deep/10 bg-ivory overflow-hidden hover:shadow-lg transition-shadow"
            >
              {service.image_url ? (
                <div className="relative h-48 bg-deep-tint">
                  <Image
                    src={service.image_url}
                    alt={service.name}
                    fill
                    className="object-cover"
                  />
                  {!service.is_active && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-deep/80 text-ivory text-[10px] font-medium">
                        <EyeOff className="h-2.5 w-2.5" />
                        Hidden
                      </span>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-48 bg-mauve-tint flex items-center justify-center">
                  <Sparkles className="h-12 w-12 text-mauve" />
                </div>
              )}
              
              <div className="p-6">
                <div className="mb-4">
                  <span className="inline-block px-2 py-0.5 rounded-full text-[9px] uppercase tracking-wider font-medium text-mauve bg-mauve-tint mb-2">
                    {service.category}
                  </span>
                  <h3 className="font-display text-xl font-light text-deep mb-2">
                    {service.name}
                  </h3>
                  <p className="text-sm text-deep/70 line-clamp-2">
                    {service.description}
                  </p>
                </div>
                
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-deep/10">
                  <div>
                    <p className="text-xs text-deep/60">Price</p>
                    <p className="font-display text-2xl text-mauve">
                      ₦{service.price.toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-deep/60">Duration</p>
                    <p className="text-lg text-deep">{service.duration} min</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      setEditingService(service);
                      setShowAddModal(true);
                    }}
                    className="flex-1 h-10 rounded-lg bg-sage-tint text-sage hover:bg-sage hover:text-ivory transition-colors flex items-center justify-center gap-2"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium">Edit</span>
                  </button>
                  <button
                    onClick={() => handleDelete(service.id)}
                    className="flex-1 h-10 rounded-lg bg-mauve-tint text-mauve hover:bg-mauve hover:text-ivory transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="text-sm font-medium">Delete</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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