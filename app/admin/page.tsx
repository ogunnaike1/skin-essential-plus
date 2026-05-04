"use client";

import { useEffect, useState } from "react";
import {
  DollarSign,
  ShoppingBag,
  Package,
  Calendar,
  TrendingUp,
  Loader2,
  AlertCircle,
} from "lucide-react";
import {
  getDashboardStats,
  getRecentAppointments,
  getTopProducts,
  formatCurrency,
  type DashboardStats,
  type RecentAppointment,
  type TopProduct,
} from "@/lib/supabase/dashboard-api";

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentAppointments, setRecentAppointments] = useState<RecentAppointment[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load dashboard data
  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [statsData, appointmentsData, productsData] = await Promise.all([
        getDashboardStats(),
        getRecentAppointments(3),
        getTopProducts(3),
      ]);

      setStats(statsData);
      setRecentAppointments(appointmentsData);
      setTopProducts(productsData);
    } catch (err) {
      console.error('Error loading dashboard:', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-mauve" />
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-6">
        <AlertCircle className="h-12 w-12 text-mauve mb-4" />
        <h2 className="font-display text-2xl text-deep mb-2">Unable to load dashboard</h2>
        <p className="text-sm text-deep/60 mb-4">{error || 'Unknown error'}</p>
        <button
          onClick={loadDashboardData}
          className="px-6 py-3 rounded-full bg-mauve text-ivory hover:bg-mauve-dark transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Welcome Header */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-3">
          <span className="h-1 w-8 rounded-full bg-mauve" />
          <span className="h-1 w-8 rounded-full bg-sage" />
          <span className="h-1 w-8 rounded-full bg-deep" />
        </div>
        <h1 className="font-display text-3xl lg:text-4xl font-light text-deep mb-2">
          Welcome back, Admin
        </h1>
        <p className="text-sm text-deep/60">
          Here's what's happening with your store today
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
        {/* Total Revenue */}
        <div className="bg-ivory rounded-2xl border-2 border-mauve/20 p-6 hover:border-mauve transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-mauve/10 flex items-center justify-center">
              <DollarSign className="h-6 w-6 text-mauve" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-sage font-medium">
              +{stats.revenueGrowth.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-deep/60 mb-1">Total Revenue</p>
          <p className="font-display text-2xl font-light text-deep">
            {formatCurrency(stats.totalRevenue)}
          </p>
        </div>

        {/* Total Orders/Appointments */}
        <div className="bg-ivory rounded-2xl border-2 border-sage/20 p-6 hover:border-sage transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-sage/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-sage" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-sage font-medium">
              +{stats.ordersGrowth.toFixed(1)}%
            </span>
          </div>
          <p className="text-sm text-deep/60 mb-1">Total Orders</p>
          <p className="font-display text-2xl font-light text-deep">{stats.totalOrders}</p>
        </div>

        {/* Total Products */}
        <div className="bg-ivory rounded-2xl border-2 border-deep/20 p-6 hover:border-deep transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-deep/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-deep" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-deep/60 font-medium">
              {stats.activeProducts} active
            </span>
          </div>
          <p className="text-sm text-deep/60 mb-1">Total Products</p>
          <p className="font-display text-2xl font-light text-deep">
            {stats.totalProducts}
          </p>
        </div>

        {/* Appointments */}
        <div className="bg-ivory rounded-2xl border-2 border-mauve/20 p-6 hover:border-mauve transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-mauve/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-mauve" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-mauve font-medium">
              {stats.todayAppointments} today
            </span>
          </div>
          <p className="text-sm text-deep/60 mb-1">Total Appointments</p>
          <p className="font-display text-2xl font-light text-deep">
            {stats.totalAppointments}
          </p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Appointments */}
        <div className="bg-ivory rounded-2xl border-2 border-deep/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-light text-deep">
              Recent Appointments
            </h2>
            <a
              href="/admin/appointments"
              className="text-xs text-mauve hover:text-mauve-dark transition-colors uppercase tracking-wider"
            >
              View All
            </a>
          </div>

          {recentAppointments.length === 0 ? (
            <div className="text-center py-8">
              <Calendar className="h-8 w-8 text-deep/20 mx-auto mb-2" />
              <p className="text-sm text-deep/60">No appointments yet</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 rounded-xl bg-mauve-tint/30 hover:bg-mauve-tint/50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-deep">
                      {appointment.customer_name}
                    </p>
                    <p className="text-xs text-deep/60">{appointment.service_name}</p>
                    <p className="text-xs text-deep/40">
                      {appointment.appointment_date} at {appointment.start_time}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-deep">
                      {formatCurrency(appointment.service_price)}
                    </p>
                    <span
                      className={`text-xs ${
                        appointment.status === 'completed'
                          ? 'text-sage'
                          : appointment.status === 'confirmed'
                          ? 'text-deep'
                          : appointment.status === 'cancelled'
                          ? 'text-red-500'
                          : 'text-mauve'
                      }`}
                    >
                      {appointment.status.charAt(0).toUpperCase() +
                        appointment.status.slice(1)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Links */}
        <div className="bg-ivory rounded-2xl border-2 border-deep/10 p-6">
          <h2 className="font-display text-xl font-light text-deep mb-6">
            Quick Actions
          </h2>

          <div className="grid grid-cols-2 gap-3">
            <a
              href="/admin/products"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-mauve-tint/30 hover:bg-mauve hover:text-ivory transition-all group"
            >
              <Package
                className="h-6 w-6 mb-2 text-mauve group-hover:text-ivory"
                strokeWidth={1.5}
              />
              <span className="text-xs font-medium">Products</span>
            </a>

            <a
              href="/admin/services"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-sage-tint/30 hover:bg-sage hover:text-ivory transition-all group"
            >
              <TrendingUp
                className="h-6 w-6 mb-2 text-sage group-hover:text-ivory"
                strokeWidth={1.5}
              />
              <span className="text-xs font-medium">Services</span>
            </a>

            <a
              href="/admin/appointments"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-deep-tint/30 hover:bg-deep hover:text-ivory transition-all group"
            >
              <Calendar
                className="h-6 w-6 mb-2 text-deep group-hover:text-ivory"
                strokeWidth={1.5}
              />
              <span className="text-xs font-medium">Appointments</span>
            </a>

            <a
              href="/admin/customers"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-mauve-tint/30 hover:bg-mauve hover:text-ivory transition-all group"
            >
              <ShoppingBag
                className="h-6 w-6 mb-2 text-mauve group-hover:text-ivory"
                strokeWidth={1.5}
              />
              <span className="text-xs font-medium">Customers</span>
            </a>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-ivory rounded-2xl border-2 border-deep/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-light text-deep">
            Top Performing Products
          </h2>
          <a
            href="/admin/products"
            className="text-xs text-mauve hover:text-mauve-dark transition-colors uppercase tracking-wider"
          >
            View All
          </a>
        </div>

        {topProducts.length === 0 ? (
          <div className="text-center py-8">
            <Package className="h-8 w-8 text-deep/20 mx-auto mb-2" />
            <p className="text-sm text-deep/60">No products data available</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-deep/10">
                  <th className="text-left py-3 px-4 text-xs font-medium text-deep/60 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-deep/60 uppercase tracking-wider">
                    Sales
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-deep/60 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="text-left py-3 px-4 text-xs font-medium text-deep/60 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-deep/5">
                {topProducts.map((product) => (
                  <tr
                    key={product.id}
                    className="hover:bg-mauve-tint/20 transition-colors"
                  >
                    <td className="py-4 px-4 text-sm text-deep font-medium">
                      {product.name}
                    </td>
                    <td className="py-4 px-4 text-sm text-deep">{product.sales}</td>
                    <td className="py-4 px-4 text-sm text-deep font-medium">
                      {formatCurrency(product.revenue)}
                    </td>
                    <td className="py-4 px-4">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          product.stock_status === 'in-stock'
                            ? 'bg-sage-tint text-sage'
                            : product.stock_status === 'low-stock'
                            ? 'bg-mauve-tint text-mauve'
                            : 'bg-red-100 text-red-600'
                        }`}
                      >
                        {product.stock_status === 'in-stock'
                          ? 'In Stock'
                          : product.stock_status === 'low-stock'
                          ? 'Low Stock'
                          : product.stock_status === 'out-of-stock'
                          ? 'Out of Stock'
                          : 'Pre-Order'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}