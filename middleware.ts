import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  console.log("🔍 Middleware:", pathname);

  // Skip middleware for login page and ALL auth routes
  if (
    pathname === "/admin/login" || 
    pathname.startsWith("/api/admin/auth")
  ) {
    console.log("✅ Skipping auth check for:", pathname);
    return NextResponse.next();
  }

  // Check if this is an admin route
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("admin_token")?.value;

    console.log("🍪 Cookie present:", !!token);

    if (!token) {
      console.log("❌ No token found, redirecting to login");
      if (pathname.startsWith("/admin")) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      // Use jose for Edge Runtime compatibility
      const { payload } = await jwtVerify(token, JWT_SECRET);
      console.log("✅ Token verified successfully:", payload);
      return NextResponse.next();
    } catch (error) {
      console.error("❌ Token verification failed:", error);
      if (pathname.startsWith("/admin")) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"],
};