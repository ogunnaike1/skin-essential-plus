"use client";

import { useState, useEffect } from "react";
import { ProductModal } from "@/components/admin/ProductModal";
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  Sparkles,
  Star,
  Award,
  AlertTriangle,
  X,
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
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  const [deleting, setDeleting] = useState(false);

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

  const handleDelete = async () => {
    if (!productToDelete) return;
    setDeleting(true);
    try {
      await deleteProduct(productToDelete.id);
      setProductToDelete(null);
      await loadProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    } finally {
      setDeleting(false);
    }
  };

  const handleModalSuccess = () => {
    loadProducts();
    setShowAddModal(false);
    setEditingProduct(null);
  };

  const [filterCategory, setFilterCategory] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "in-stock" | "low-stock" | "out-of-stock">("all");

  const categories = Array.from(new Set(products.map((p) => p.category))).sort();

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === "all" || product.category === filterCategory;
    const matchesStatus = filterStatus === "all" || product.stock_status === filterStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Count featured products
  const newArrivalsCount = products.filter(p => p.is_new_arrival).length;
  const bestsellersCount = products.filter(p => p.is_bestseller).length;

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="font-display text-3xl lg:text-4xl font-light text-deep mb-2">
          Products Management
        </h1>
        <p className="text-sm text-deep/60">
          Manage your {products.length} products
        </p>
      </div>

      {/* Stats Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
        <div className="px-4 py-3 rounded-xl bg-mauve-tint border border-mauve/20">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-mauve" />
            <span className="text-xs uppercase tracking-wider text-mauve font-medium">Total</span>
          </div>
          <p className="text-2xl font-display font-light text-deep">{products.length}</p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-sage-tint border border-sage/20">
          <div className="flex items-center gap-2 mb-1">
            <Star className="h-4 w-4 text-sage" />
            <span className="text-xs uppercase tracking-wider text-sage font-medium">New Arrivals</span>
          </div>
          <p className="text-2xl font-display font-light text-deep">{newArrivalsCount}</p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-mauve-tint border border-mauve/20">
          <div className="flex items-center gap-2 mb-1">
            <Award className="h-4 w-4 text-mauve" />
            <span className="text-xs uppercase tracking-wider text-mauve font-medium">Bestsellers</span>
          </div>
          <p className="text-2xl font-display font-light text-deep">{bestsellersCount}</p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-sage-tint border border-sage/20">
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-4 w-4 text-sage" />
            <span className="text-xs uppercase tracking-wider text-sage font-medium">In Stock</span>
          </div>
          <p className="text-2xl font-display font-light text-deep">
            {products.filter(p => p.stock_status === 'in-stock').length}
          </p>
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
            placeholder="Search products..."
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
            <option key={cat} value={cat} className="capitalize">{cat}</option>
          ))}
        </select>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as "all" | "in-stock" | "low-stock" | "out-of-stock")}
          className="h-12 px-4 rounded-full border-2 border-deep/10 bg-ivory text-sm text-deep focus:border-mauve focus:outline-none transition-colors"
        >
          <option value="all">All Stock</option>
          <option value="in-stock">In Stock</option>
          <option value="low-stock">Low Stock</option>
          <option value="out-of-stock">Out of Stock</option>
        </select>

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
                <tr className="border-b-2 border-deep/10 bg-deep-tint/30">
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
                      Featured
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
                          {product.image_url ? (
                            <Image
                              src={product.image_url}
                              alt={product.name}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Sparkles className="h-5 w-5 text-deep/20" />
                            </div>
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
                      <div className="flex gap-2">
                        {product.is_new_arrival && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-sage-tint text-sage text-[10px] font-medium uppercase tracking-wider">
                            <Star className="h-2.5 w-2.5" />
                            New
                          </span>
                        )}
                        {product.is_bestseller && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-mauve-tint text-mauve text-[10px] font-medium uppercase tracking-wider">
                            <Sparkles className="h-2.5 w-2.5" />
                            Best
                          </span>
                        )}
                        {product.is_exclusive && (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-deep-tint text-deep text-[10px] font-medium uppercase tracking-wider">
                            <Award className="h-2.5 w-2.5" />
                            Excl.
                          </span>
                        )}
                        {!product.is_new_arrival && !product.is_bestseller && !product.is_exclusive && (
                          <span className="text-xs text-deep/40">—</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-deep">
                          ₦{product.price.toLocaleString()}
                        </span>
                        {product.original_price && (
                          <span className="text-xs text-deep/40 line-through">
                            ₦{product.original_price.toLocaleString()}
                          </span>
                        )}
                      </div>
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
                          title="Edit product"
                        >
                          <Edit2 className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setProductToDelete(product)}
                          className="h-8 w-8 rounded-lg bg-mauve-tint text-mauve hover:bg-mauve hover:text-ivory transition-colors flex items-center justify-center"
                          title="Delete product"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredProducts.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-6 py-12 text-center">
                      <div className="flex flex-col items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-mauve-tint flex items-center justify-center">
                          <Search className="h-5 w-5 text-mauve" />
                        </div>
                        <p className="text-sm text-deep/60">No products found</p>
                      </div>
                    </td>
                  </tr>
                )}
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

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative bg-ivory rounded-3xl w-full max-w-md shadow-2xl overflow-hidden">
            {/* Top accent */}
            <div className="h-1.5 w-full bg-gradient-to-r from-mauve via-mauve/60 to-transparent" />

            <div className="p-8">
              {/* Icon */}
              <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-mauve-tint mb-6">
                <AlertTriangle className="h-7 w-7 text-mauve" strokeWidth={1.5} />
              </div>

              <h3 className="font-display text-2xl font-light text-deep mb-2">
                Delete product?
              </h3>
              <p className="text-sm text-deep/60 leading-relaxed mb-1">
                You are about to permanently delete:
              </p>
              <p className="text-sm font-medium text-deep mb-6">
                "{productToDelete.name}"
              </p>
              <p className="text-xs text-deep/40 mb-8">
                This action cannot be undone.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => setProductToDelete(null)}
                  disabled={deleting}
                  className="flex-1 h-12 rounded-full border-2 border-deep/10 bg-white text-deep text-sm font-medium hover:bg-deep-tint transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="flex-1 h-12 rounded-full bg-mauve text-ivory text-sm font-medium hover:bg-mauve-dark transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {deleting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Deleting...
                    </>
                  ) : (
                    <>
                      <Trash2 className="h-4 w-4" />
                      Delete
                    </>
                  )}
                </button>
              </div>
            </div>

            <button
              onClick={() => setProductToDelete(null)}
              disabled={deleting}
              className="absolute top-4 right-4 p-2 rounded-full bg-deep-tint text-deep hover:bg-mauve-tint hover:text-mauve transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}