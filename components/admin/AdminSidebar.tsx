"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Sparkles,
  ShoppingBag,
  CalendarDays,
  Users,
  Settings,
  LogOut,
  Package,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  {
    label: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Services",
    href: "/admin/services",
    icon: Sparkles,
  },
  {
    label: "Products",
    href: "/admin/products",
    icon: ShoppingBag,
  },
  {
    label: "Bundles",
    href: "/admin/bundles",
    icon: Package,
  },
  {
    label: "Appointments",
    href: "/admin/appointments",
    icon: CalendarDays,
  },
  {
    label: "Customers",
    href: "/admin/customers",
    icon: Users,
  },
  {
    label: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-64 border-r border-deep/10 bg-ivory">
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 border-b border-deep/10 px-6">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-mauve to-sage flex items-center justify-center">
          <Sparkles className="h-5 w-5 text-ivory" strokeWidth={2} />
        </div>
        <div>
          <h1 className="font-display text-lg font-light text-deep leading-tight">
            Admin Panel
          </h1>
          <p className="text-[10px] text-deep/60 uppercase tracking-wider">
            Skin Essential Plus
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || pathname?.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors duration-200",
                isActive
                  ? "bg-mauve text-ivory"
                  : "text-deep hover:bg-mauve-tint hover:text-mauve"
              )}
            >
              <Icon className="h-4 w-4" strokeWidth={1.75} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      {/* Logout */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-deep/10">
        <button
          type="button"
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-deep hover:bg-mauve-tint hover:text-mauve transition-colors duration-200"
        >
          <LogOut className="h-4 w-4" strokeWidth={1.75} />
          Sign Out
        </button>
      </div>
    </aside>
  );
}