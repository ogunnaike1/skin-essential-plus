"use client";

import { useState } from "react";
import { Lock, Mail, Eye, EyeOff, ShieldCheck } from "lucide-react";
import { SuccessNotification, useSuccessNotification } from "@/components/shared/SuccessNotification";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { notification, showSuccess, hideSuccess } = useSuccessNotification();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🚀 Starting login...");

      const res = await fetch("/api/admin/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
        credentials: 'include', // CRITICAL: Include cookies
      });

      console.log("📡 Response status:", res.status);

      const data = await res.json();
      console.log("📦 Response data:", data);

      if (!res.ok) {
        throw new Error(data.error || "Login failed");
      }

      console.log("✅ Login successful!");

      // Show success notification
      showSuccess("login-success", {
        title: "Welcome Back!",
        message: "Redirecting to dashboard...",
      });

      // Wait a bit, then redirect with full page reload
      setTimeout(() => {
        console.log("🔄 Redirecting to /admin/dashboard...");
        window.location.href = "/admin/dashboard";
      }, 1000); // Increased to 1 second to ensure cookie is set

    } catch (err: any) {
      console.error("❌ Login error:", err);
      showSuccess("generic-success", {
        title: "Login Failed",
        message: err.message || "Invalid email or password. Please try again.",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-ivory via-mauve-tint/30 to-sage-tint/30 flex items-center justify-center p-6">
      {/* Decorative background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 h-64 w-64 rounded-full bg-mauve/10 blur-3xl" />
        <div className="absolute bottom-20 right-10 h-64 w-64 rounded-full bg-sage/10 blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-deep/5 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md">
        {/* Top accent bar */}
        <div className="h-1.5 w-full flex rounded-t-3xl overflow-hidden">
          <span className="flex-1 bg-mauve" />
          <span className="flex-1 bg-sage" />
          <span className="flex-1 bg-deep" />
        </div>

        <div className="bg-ivory rounded-b-3xl shadow-2xl border-2 border-deep/10 overflow-hidden">
          {/* Header */}
          <div className="p-8 pb-6 text-center">
            <div className="inline-flex h-16 w-16 rounded-2xl bg-gradient-to-br from-mauve to-deep items-center justify-center mb-4">
              <ShieldCheck className="h-8 w-8 text-ivory" strokeWidth={1.5} />
            </div>
            
            <h1 className="font-display text-3xl font-light text-deep mb-2">
              Admin Access
            </h1>
            <p className="text-sm text-deep/60">
              Sign in to manage Skin Essential Plus
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="px-8 pb-8 space-y-5">
            {/* Email Field */}
            <div>
              <label className="block text-sm font-medium text-deep mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-mauve" />
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="admin@skinessentialplus.com"
                  className="w-full h-12 pl-11 pr-4 rounded-xl border-2 border-deep/10 bg-ivory text-deep placeholder:text-deep/40 focus:border-mauve focus:outline-none transition-colors"
                />
              </div>
            </div>

            {/* Password Field */}
            <div>
              <label className="block text-sm font-medium text-deep mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-deep" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-11 pr-12 rounded-xl border-2 border-deep/10 bg-ivory text-deep placeholder:text-deep/40 focus:border-deep focus:outline-none transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-deep/40 hover:text-deep transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-2 border-deep/20 text-mauve focus:ring-mauve"
                />
                <span className="text-deep/70">Remember me</span>
              </label>
              <button
                type="button"
                className="text-mauve hover:text-mauve-dark transition-colors"
              >
                Forgot password?
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 rounded-full bg-gradient-to-r from-mauve to-deep text-ivory font-medium hover:shadow-lg hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-ivory/30 border-t-ivory rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <ShieldCheck className="h-4 w-4" />
                  Sign In
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="px-8 pb-8 pt-4 border-t border-deep/10">
            <p className="text-xs text-center text-deep/50">
              Protected by enterprise-grade security
            </p>
          </div>
        </div>

        {/* Bottom info */}
        <p className="text-center text-xs text-deep/40 mt-6">
          Need access? Contact the system administrator
        </p>
      </div>

      {/* Success Notification */}
      <SuccessNotification {...notification} onClose={hideSuccess} />
    </div>
  );
}