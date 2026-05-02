import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // CRITICAL: Skip middleware for login page and ALL auth routes
  if (
    pathname === "/admin/login" || 
    pathname.startsWith("/api/admin/auth")
  ) {
    return NextResponse.next();
  }

  // Check if this is an admin route
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      // Redirect to login for page requests
      if (pathname.startsWith("/admin")) {
        const loginUrl = new URL("/admin/login", request.url);
        return NextResponse.redirect(loginUrl);
      }
      // Return 401 for API requests
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
      verify(token, JWT_SECRET);
      return NextResponse.next();
    } catch (error) {
      console.error("Token verification failed:", error);
      // Invalid token - redirect to login
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