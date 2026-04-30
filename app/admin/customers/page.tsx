"use client";

import { useState, useEffect } from "react";
import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Users,
  Search,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ShoppingBag,
  DollarSign,
  Loader2,
  Eye,
  Edit2,
  Trash2,
  X,
  Plus,
  TrendingUp,
} from "lucide-react";
import {
  getCustomers,
  getCustomerStats,
  deleteCustomer,
  searchCustomers,
  type Customer,
} from "@/lib/supabase/customers-api";

export default function CustomersManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [filteredCustomers, setFilteredCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [stats, setStats] = useState({
    totalCustomers: 0,
    totalRevenue: 0,
    totalOrders: 0,
    newThisMonth: 0,
    averageOrderValue: 0,
  });

  const loadCustomers = async () => {
    try {
      setLoading(true);
      const [customersData, statsData] = await Promise.all([
        getCustomers(),
        getCustomerStats(),
      ]);
      setCustomers(customersData);
      setFilteredCustomers(customersData);
      setStats(statsData);
    } catch (error) {
      console.error("Error loading customers:", error);
      alert("Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCustomers();
  }, []);

  // Search handler
  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    
    if (!query.trim()) {
      setFilteredCustomers(customers);
      return;
    }

    try {
      const results = await searchCustomers(query);
      setFilteredCustomers(results);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this customer? This cannot be undone.")) return;

    try {
      await deleteCustomer(id);
      await loadCustomers();
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Error deleting customer:", error);
      alert("Failed to delete customer");
    }
  };

  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <AdminLayout
      title="Customers"
      subtitle={`Manage your ${stats.totalCustomers} customers`}
    >
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="px-4 py-3 rounded-xl bg-mauve-tint border border-mauve/20">
          <div className="flex items-center gap-2 mb-1">
            <Users className="h-4 w-4 text-mauve" />
            <span className="text-xs uppercase tracking-wider text-mauve font-medium">
              Total Customers
            </span>
          </div>
          <p className="text-2xl font-display font-light text-deep">
            {stats.totalCustomers}
          </p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-sage-tint border border-sage/20">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="h-4 w-4 text-sage" />
            <span className="text-xs uppercase tracking-wider text-sage font-medium">
              New This Month
            </span>
          </div>
          <p className="text-2xl font-display font-light text-deep">
            {stats.newThisMonth}
          </p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-mauve-tint border border-mauve/20">
          <div className="flex items-center gap-2 mb-1">
            <ShoppingBag className="h-4 w-4 text-mauve" />
            <span className="text-xs uppercase tracking-wider text-mauve font-medium">
              Total Orders
            </span>
          </div>
          <p className="text-2xl font-display font-light text-deep">
            {stats.totalOrders}
          </p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-sage-tint border border-sage/20">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-sage" />
            <span className="text-xs uppercase tracking-wider text-sage font-medium">
              Total Revenue
            </span>
          </div>
          <p className="text-2xl font-display font-light text-deep">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>

        <div className="px-4 py-3 rounded-xl bg-mauve-tint border border-mauve/20">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="h-4 w-4 text-mauve" />
            <span className="text-xs uppercase tracking-wider text-mauve font-medium">
              Avg Order Value
            </span>
          </div>
          <p className="text-2xl font-display font-light text-deep">
            {formatCurrency(Math.round(stats.averageOrderValue))}
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-deep/40" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 rounded-xl border-2 border-deep/10 focus:border-mauve focus:outline-none bg-ivory text-deep"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-mauve" />
        </div>
      ) : filteredCustomers.length === 0 ? (
        <div className="text-center py-20 rounded-2xl border-2 border-dashed border-deep/20">
          <Users className="h-12 w-12 text-deep/20 mx-auto mb-4" />
          <h3 className="font-display text-xl font-light text-deep mb-2">
            {searchQuery ? "No customers found" : "No customers yet"}
          </h3>
          <p className="text-sm text-deep/60">
            {searchQuery
              ? "Try adjusting your search query"
              : "Customers will appear here once they make purchases"}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border-2 border-deep/10 bg-ivory overflow-hidden">
          {/* Table Header */}
          <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-4 bg-deep-tint border-b-2 border-deep/10">
            <div className="col-span-3 text-xs uppercase tracking-wider font-medium text-deep">
              Customer
            </div>
            <div className="col-span-2 text-xs uppercase tracking-wider font-medium text-deep">
              Contact
            </div>
            <div className="col-span-2 text-xs uppercase tracking-wider font-medium text-deep">
              Location
            </div>
            <div className="col-span-2 text-xs uppercase tracking-wider font-medium text-deep text-center">
              Orders
            </div>
            <div className="col-span-2 text-xs uppercase tracking-wider font-medium text-deep text-center">
              Total Spent
            </div>
            <div className="col-span-1 text-xs uppercase tracking-wider font-medium text-deep text-center">
              Actions
            </div>
          </div>

          {/* Table Body */}
          <div className="divide-y divide-deep/10">
            {filteredCustomers.map((customer) => (
              <div
                key={customer.id}
                className="grid grid-cols-1 md:grid-cols-12 gap-4 px-6 py-4 hover:bg-mauve-tint/30 transition-colors"
              >
                {/* Customer Info */}
                <div className="col-span-1 md:col-span-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-mauve text-ivory flex items-center justify-center font-medium">
                      {customer.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-medium text-deep">{customer.full_name}</p>
                      <p className="text-xs text-deep/60">
                        Joined {formatDate(customer.created_at)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact */}
                <div className="col-span-1 md:col-span-2">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-3.5 w-3.5 text-deep/40" />
                      <span className="text-deep/80 truncate">{customer.email}</span>
                    </div>
                    {customer.phone && (
                      <div className="flex items-center gap-2 text-sm">
                        <Phone className="h-3.5 w-3.5 text-deep/40" />
                        <span className="text-deep/80">{customer.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Location */}
                <div className="col-span-1 md:col-span-2">
                  {customer.city || customer.state ? (
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="h-3.5 w-3.5 text-deep/40 mt-0.5" />
                      <span className="text-deep/80">
                        {[customer.city, customer.state].filter(Boolean).join(", ")}
                      </span>
                    </div>
                  ) : (
                    <span className="text-sm text-deep/40">No location</span>
                  )}
                </div>

                {/* Orders */}
                <div className="col-span-1 md:col-span-2 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-lg font-display text-deep">
                      {customer.total_orders}
                    </span>
                    <span className="text-xs text-deep/60">orders</span>
                  </div>
                </div>

                {/* Total Spent */}
                <div className="col-span-1 md:col-span-2 text-center">
                  <div className="inline-flex flex-col items-center">
                    <span className="text-lg font-display text-mauve">
                      {formatCurrency(customer.total_spent)}
                    </span>
                    {customer.last_order_date && (
                      <span className="text-xs text-deep/60">
                        Last: {formatDate(customer.last_order_date)}
                      </span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="col-span-1 md:col-span-1 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setSelectedCustomer(customer)}
                    className="h-8 w-8 rounded-lg bg-sage-tint text-sage hover:bg-sage hover:text-ivory transition-colors flex items-center justify-center"
                    title="View Details"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    className="h-8 w-8 rounded-lg bg-mauve-tint text-mauve hover:bg-mauve hover:text-ivory transition-colors flex items-center justify-center"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Customer Detail Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 bg-deep/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-ivory rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="sticky top-0 bg-ivory border-b-2 border-deep/10 px-6 py-4 flex items-center justify-between">
              <h3 className="font-display text-2xl font-light text-deep">
                Customer Details
              </h3>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="h-10 w-10 rounded-full hover:bg-deep-tint transition-colors flex items-center justify-center"
              >
                <X className="h-5 w-5 text-deep" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              {/* Profile Section */}
              <div className="flex items-center gap-4 pb-6 border-b border-deep/10">
                <div className="h-16 w-16 rounded-full bg-mauve text-ivory flex items-center justify-center text-2xl font-medium">
                  {selectedCustomer.full_name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-display text-xl text-deep">
                    {selectedCustomer.full_name}
                  </h4>
                  <p className="text-sm text-deep/60">
                    Customer since {formatDate(selectedCustomer.created_at)}
                  </p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="px-4 py-3 rounded-xl bg-mauve-tint">
                  <p className="text-xs uppercase tracking-wider text-mauve font-medium mb-1">
                    Total Orders
                  </p>
                  <p className="text-2xl font-display text-deep">
                    {selectedCustomer.total_orders}
                  </p>
                </div>
                <div className="px-4 py-3 rounded-xl bg-sage-tint">
                  <p className="text-xs uppercase tracking-wider text-sage font-medium mb-1">
                    Total Spent
                  </p>
                  <p className="text-2xl font-display text-deep">
                    {formatCurrency(selectedCustomer.total_spent)}
                  </p>
                </div>
              </div>

              {/* Contact Information */}
              <div>
                <h5 className="text-sm uppercase tracking-wider font-medium text-deep mb-3">
                  Contact Information
                </h5>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-mauve" />
                    <div>
                      <p className="text-xs text-deep/60">Email</p>
                      <p className="text-sm text-deep">{selectedCustomer.email}</p>
                    </div>
                  </div>
                  {selectedCustomer.phone && (
                    <div className="flex items-center gap-3">
                      <Phone className="h-5 w-5 text-mauve" />
                      <div>
                        <p className="text-xs text-deep/60">Phone</p>
                        <p className="text-sm text-deep">{selectedCustomer.phone}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              {(selectedCustomer.address || selectedCustomer.city || selectedCustomer.state) && (
                <div>
                  <h5 className="text-sm uppercase tracking-wider font-medium text-deep mb-3">
                    Address
                  </h5>
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-mauve mt-0.5" />
                    <div className="text-sm text-deep">
                      {selectedCustomer.address && <p>{selectedCustomer.address}</p>}
                      <p>
                        {[
                          selectedCustomer.city,
                          selectedCustomer.state,
                          selectedCustomer.postal_code,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Last Order */}
              {selectedCustomer.last_order_date && (
                <div>
                  <h5 className="text-sm uppercase tracking-wider font-medium text-deep mb-3">
                    Last Order
                  </h5>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-5 w-5 text-mauve" />
                    <div>
                      <p className="text-xs text-deep/60">Date</p>
                      <p className="text-sm text-deep">
                        {formatDate(selectedCustomer.last_order_date)}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="sticky bottom-0 bg-ivory border-t-2 border-deep/10 px-6 py-4 flex gap-3">
              <button
                onClick={() => handleDelete(selectedCustomer.id)}
                className="flex-1 h-12 rounded-xl bg-mauve-tint text-mauve hover:bg-mauve hover:text-ivory transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                <span className="font-medium">Delete Customer</span>
              </button>
              <button
                onClick={() => setSelectedCustomer(null)}
                className="flex-1 h-12 rounded-xl bg-sage text-ivory hover:bg-sage-dark transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  );
}