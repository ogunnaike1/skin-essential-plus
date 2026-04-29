"use client";

import { AdminLayout } from "@/components/admin/AdminLayout";
import {
  Sparkles,
  ShoppingBag,
  CalendarDays,
  TrendingUp,
  DollarSign,
  Users,
} from "lucide-react";

const stats = [
  {
    label: "Total Revenue",
    value: "₦2,450,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
    color: "mauve",
  },
  {
    label: "Appointments",
    value: "156",
    change: "+8.2%",
    trend: "up",
    icon: CalendarDays,
    color: "sage",
  },
  {
    label: "Products Sold",
    value: "342",
    change: "+15.3%",
    trend: "up",
    icon: ShoppingBag,
    color: "deep",
  },
  {
    label: "New Customers",
    value: "48",
    change: "+6.7%",
    trend: "up",
    icon: Users,
    color: "mauve",
  },
];

const recentAppointments = [
  {
    id: "1",
    customer: "Adaeze Okonkwo",
    service: "Signature Facial",
    time: "10:00 AM",
    date: "Today",
    status: "confirmed",
  },
  {
    id: "2",
    customer: "Chioma Nwosu",
    service: "Deep Tissue Massage",
    time: "2:30 PM",
    date: "Today",
    status: "confirmed",
  },
  {
    id: "3",
    customer: "Zainab Mohammed",
    service: "Hair Treatment",
    time: "4:00 PM",
    date: "Tomorrow",
    status: "pending",
  },
];

export default function AdminDashboard() {
  return (
    <AdminLayout title="Dashboard" subtitle="Overview of your spa">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          const colorClasses = {
            mauve: "bg-mauve text-ivory",
            sage: "bg-sage text-ivory",
            deep: "bg-deep text-ivory",
          };

          return (
            <div
              key={stat.label}
              className="rounded-2xl border-2 border-deep/10 bg-ivory p-6 hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`h-12 w-12 rounded-xl flex items-center justify-center ${
                    colorClasses[stat.color as keyof typeof colorClasses]
                  }`}
                >
                  <Icon className="h-5 w-5" strokeWidth={1.75} />
                </div>
                <div className="flex items-center gap-1 text-sage text-sm font-medium">
                  <TrendingUp className="h-3 w-3" />
                  {stat.change}
                </div>
              </div>
              <p className="text-sm text-deep/60 mb-1">{stat.label}</p>
              <p className="font-display text-3xl font-light text-deep">
                {stat.value}
              </p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Recent Appointments */}
        <div className="rounded-2xl border-2 border-deep/10 bg-ivory p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <CalendarDays className="h-5 w-5 text-mauve" strokeWidth={1.75} />
              <h2 className="font-display text-xl font-light text-deep">
                Recent Appointments
              </h2>
            </div>
            <button className="text-sm text-mauve hover:underline">
              View all
            </button>
          </div>

          <div className="space-y-3">
            {recentAppointments.map((apt) => (
              <div
                key={apt.id}
                className="flex items-center justify-between p-4 rounded-xl bg-mauve-tint/50 hover:bg-mauve-tint transition-colors"
              >
                <div>
                  <p className="font-medium text-deep">{apt.customer}</p>
                  <p className="text-sm text-deep/60">{apt.service}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-deep">{apt.time}</p>
                  <p className="text-xs text-deep/60">{apt.date}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    apt.status === "confirmed"
                      ? "bg-sage text-ivory"
                      : "bg-mauve text-ivory"
                  }`}
                >
                  {apt.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="rounded-2xl border-2 border-deep/10 bg-ivory p-6">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="h-5 w-5 text-mauve" strokeWidth={1.75} />
            <h2 className="font-display text-xl font-light text-deep">
              Quick Actions
            </h2>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button className="p-4 rounded-xl bg-mauve text-ivory hover:bg-mauve-dark transition-colors text-left">
              <Sparkles className="h-5 w-5 mb-2" strokeWidth={1.75} />
              <p className="font-medium text-sm">Add Service</p>
            </button>
            <button className="p-4 rounded-xl bg-sage text-ivory hover:bg-sage-dark transition-colors text-left">
              <ShoppingBag className="h-5 w-5 mb-2" strokeWidth={1.75} />
              <p className="font-medium text-sm">Add Product</p>
            </button>
            <button className="p-4 rounded-xl bg-deep text-ivory hover:bg-deep-dark transition-colors text-left">
              <CalendarDays className="h-5 w-5 mb-2" strokeWidth={1.75} />
              <p className="font-medium text-sm">New Booking</p>
            </button>
            <button className="p-4 rounded-xl bg-mauve text-ivory hover:bg-mauve-dark transition-colors text-left">
              <Users className="h-5 w-5 mb-2" strokeWidth={1.75} />
              <p className="font-medium text-sm">Add Customer</p>
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}