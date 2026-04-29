"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar/Navbar";
import { Footer } from "@/components/sections/Footer";

export function ConditionalLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    // Admin pages: no navbar/footer
    return <>{children}</>;
  }

  // Public pages: with navbar/footer
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}