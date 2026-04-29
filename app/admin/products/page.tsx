"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import { ProductModal } from "@/components/admin/ProductModal";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Filter,
  Loader2,
} from "lucide-react";
import Image from "next/image";
import { getProducts, deleteProduct } from "@/lib/supabase/products-api";
import type { Product } from "@/lib/supabase/types";

export default function ProductsManagement() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await getProducts();
      setProducts(data);
    } catch (error) {
      console.error("Error loading products:", error);
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      await deleteProduct(id);
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Failed to delete product");
    }
  };

  const handleModalSuccess = () => {
    loadProducts();
    setShowAddModal(false);
    setEditingProduct(null);
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <AdminLayout
      title="Products Management"
      subtitle={`Manage your ${products.length} products`}
    >
      {/* Actions Bar */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40" />
          <input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search products..."
            className="w-full h-12 pl-11 pr-4 rounded-full border-2 border-deep/10 bg-ivory text-sm text-deep placeholder:text-deep/40 focus:border-mauve focus:outline-none transition-colors"
          />
        </div>

        <button className="h-12 px-6 rounded-full border-2 border-deep/10 bg-ivory hover:bg-mauve-tint transition-colors flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filter</span>
        </button>

        <button
          onClick={() => setShowAddModal(true)}
          className="h-12 px-6 rounded-full bg-mauve text-ivory hover:bg-mauve-dark transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          <span className="text-sm font-medium">Add Product</span>
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-mauve" />
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-deep/10 bg-ivory overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-deep/10">
                  <th className="px-6 py-4 text-left">
                    <span className="text-xs uppercase tracking-wider text-deep/60 font-medium">
                      Product
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
                      Stock
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
                {filteredProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="border-b border-deep/5 hover:bg-mauve-tint/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
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
                        <div>
                          <p className="font-medium text-deep">{product.name}</p>
                          <p className="text-xs text-deep/60">{product.tagline}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 rounded-full bg-mauve-tint text-mauve text-xs font-medium capitalize">
                        {product.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-deep">
                        ₦{product.price.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        product.stock_status === 'in-stock' ? 'bg-sage-tint text-sage' :
                        product.stock_status === 'low-stock' ? 'bg-mauve-tint text-mauve' :
                        'bg-deep-tint text-deep'
                      }`}>
                        {product.stock_status}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => {
                            setEditingProduct(product);
                            setShowAddModal(true);
                          }}
                          className="h-8 w-8 rounded-lg bg-sage-tint text-sage hover:bg-sage hover:text-ivory transition-colors flex items-center justify-center"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
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

      <ProductModal
        isOpen={showAddModal}
        onClose={() => {
          setShowAddModal(false);
          setEditingProduct(null);
        }}
        onSuccess={handleModalSuccess}
        editProduct={editingProduct}
      />
    </AdminLayout>
  );
}