"use client";

import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  Sparkles,
  Package,
  ShoppingBag,
  Users,
  Settings,
  TrendingUp,
  DollarSign,
  Eye,
} from "lucide-react";

export default function AdminDashboard() {
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
            <span className="text-xs text-sage font-medium">+12.5%</span>
          </div>
          <p className="text-sm text-deep/60 mb-1">Total Revenue</p>
          <p className="font-display text-2xl font-light text-deep">₦2,450,000</p>
        </div>

        {/* Total Orders */}
        <div className="bg-ivory rounded-2xl border-2 border-sage/20 p-6 hover:border-sage transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-sage/10 flex items-center justify-center">
              <ShoppingBag className="h-6 w-6 text-sage" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-sage font-medium">+8.2%</span>
          </div>
          <p className="text-sm text-deep/60 mb-1">Total Orders</p>
          <p className="font-display text-2xl font-light text-deep">342</p>
        </div>

        {/* Total Products */}
        <div className="bg-ivory rounded-2xl border-2 border-deep/20 p-6 hover:border-deep transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-deep/10 flex items-center justify-center">
              <Package className="h-6 w-6 text-deep" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-deep/60 font-medium">156 active</span>
          </div>
          <p className="text-sm text-deep/60 mb-1">Total Products</p>
          <p className="font-display text-2xl font-light text-deep">189</p>
        </div>

        {/* Appointments */}
        <div className="bg-ivory rounded-2xl border-2 border-mauve/20 p-6 hover:border-mauve transition-colors">
          <div className="flex items-start justify-between mb-4">
            <div className="h-12 w-12 rounded-xl bg-mauve/10 flex items-center justify-center">
              <Calendar className="h-6 w-6 text-mauve" strokeWidth={1.5} />
            </div>
            <span className="text-xs text-mauve font-medium">23 today</span>
          </div>
          <p className="text-sm text-deep/60 mb-1">Appointments</p>
          <p className="font-display text-2xl font-light text-deep">147</p>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Recent Orders */}
        <div className="bg-ivory rounded-2xl border-2 border-deep/10 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display text-xl font-light text-deep">Recent Orders</h2>
            <button className="text-xs text-mauve hover:text-mauve-dark transition-colors uppercase tracking-wider">
              View All
            </button>
          </div>
          
          <div className="space-y-4">
            {[
              { id: "#12345", customer: "Sarah Johnson", amount: "₦45,000", status: "Processing" },
              { id: "#12344", customer: "Michael Brown", amount: "₦32,500", status: "Shipped" },
              { id: "#12343", customer: "Emily Davis", amount: "₦28,000", status: "Delivered" },
            ].map((order) => (
              <div key={order.id} className="flex items-center justify-between p-4 rounded-xl bg-mauve-tint/30 hover:bg-mauve-tint/50 transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-medium text-deep">{order.customer}</p>
                  <p className="text-xs text-deep/60">{order.id}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-deep">{order.amount}</p>
                  <span className={`text-xs ${
                    order.status === 'Delivered' ? 'text-sage' :
                    order.status === 'Shipped' ? 'text-deep' :
                    'text-mauve'
                  }`}>
                    {order.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div className="bg-ivory rounded-2xl border-2 border-deep/10 p-6">
          <h2 className="font-display text-xl font-light text-deep mb-6">Quick Actions</h2>
          
          <div className="grid grid-cols-2 gap-3">
            <a
              href="/admin/products"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-mauve-tint/30 hover:bg-mauve hover:text-ivory transition-all group"
            >
              <Package className="h-6 w-6 mb-2 text-mauve group-hover:text-ivory" strokeWidth={1.5} />
              <span className="text-xs font-medium">Products</span>
            </a>
            
            <a
              href="/admin/services"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-sage-tint/30 hover:bg-sage hover:text-ivory transition-all group"
            >
              <Sparkles className="h-6 w-6 mb-2 text-sage group-hover:text-ivory" strokeWidth={1.5} />
              <span className="text-xs font-medium">Services</span>
            </a>
            
            <a
              href="/admin/appointments"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-deep-tint/30 hover:bg-deep hover:text-ivory transition-all group"
            >
              <Calendar className="h-6 w-6 mb-2 text-deep group-hover:text-ivory" strokeWidth={1.5} />
              <span className="text-xs font-medium">Appointments</span>
            </a>
            
            <a
              href="/admin/customers"
              className="flex flex-col items-center justify-center p-4 rounded-xl bg-mauve-tint/30 hover:bg-mauve hover:text-ivory transition-all group"
            >
              <Users className="h-6 w-6 mb-2 text-mauve group-hover:text-ivory" strokeWidth={1.5} />
              <span className="text-xs font-medium">Customers</span>
            </a>
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="bg-ivory rounded-2xl border-2 border-deep/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-xl font-light text-deep">Top Performing Products</h2>
          <button className="text-xs text-mauve hover:text-mauve-dark transition-colors uppercase tracking-wider">
            View All
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-deep/10">
                <th className="text-left py-3 px-4 text-xs font-medium text-deep/60 uppercase tracking-wider">Product</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-deep/60 uppercase tracking-wider">Sales</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-deep/60 uppercase tracking-wider">Revenue</th>
                <th className="text-left py-3 px-4 text-xs font-medium text-deep/60 uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-deep/5">
              {[
                { name: "Hydrating Serum", sales: 156, revenue: "₦780,000", status: "In Stock" },
                { name: "Vitamin C Brightening Cream", sales: 142, revenue: "₦710,000", status: "Low Stock" },
                { name: "Retinol Night Treatment", sales: 128, revenue: "₦640,000", status: "In Stock" },
              ].map((product, i) => (
                <tr key={i} className="hover:bg-mauve-tint/20 transition-colors">
                  <td className="py-4 px-4 text-sm text-deep font-medium">{product.name}</td>
                  <td className="py-4 px-4 text-sm text-deep">{product.sales}</td>
                  <td className="py-4 px-4 text-sm text-deep font-medium">{product.revenue}</td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      product.status === 'In Stock' ? 'bg-sage-tint text-sage' : 'bg-mauve-tint text-mauve'
                    }`}>
                      {product.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}