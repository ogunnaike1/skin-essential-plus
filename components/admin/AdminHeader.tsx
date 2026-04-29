"use client";

import { Bell, Search } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
}

export function AdminHeader({ title, subtitle }: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 border-b border-deep/10 bg-ivory/95 backdrop-blur-sm">
      <div className="flex h-full items-center justify-between px-8">
        <div>
          <h1 className="font-display text-2xl font-light text-deep">{title}</h1>
          {subtitle && (
            <p className="text-xs text-deep/60 mt-0.5">{subtitle}</p>
          )}
        </div>

        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-deep/40" />
            <input
              type="search"
              placeholder="Search..."
              className="h-10 w-64 pl-10 pr-4 rounded-full border border-deep/20 bg-ivory text-sm text-deep placeholder:text-deep/40 focus:border-mauve focus:outline-none transition-colors"
            />
          </div>

          {/* Notifications */}
          <button
            type="button"
            className="relative h-10 w-10 rounded-full border border-deep/20 bg-ivory flex items-center justify-center hover:bg-mauve-tint transition-colors"
          >
            <Bell className="h-4 w-4 text-deep" strokeWidth={1.75} />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-mauve text-[9px] font-bold text-ivory flex items-center justify-center">
              3
            </span>
          </button>

          {/* User */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-sage to-deep" />
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-deep">Admin User</p>
              <p className="text-xs text-deep/60">admin@skinessentialplus.com</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}