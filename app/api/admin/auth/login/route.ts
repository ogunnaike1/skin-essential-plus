import { NextRequest, NextResponse } from "next/server";
import { SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-secret-key-change-in-production"
);

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@skinessentialplus.com";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "admin123";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    console.log("📧 Login attempt:", { email });

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Simple credential check
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      console.log("❌ Invalid credentials");
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create JWT token with jose (Edge Runtime compatible)
    const token = await new SignJWT({ 
      email,
      role: "admin"
    })
      .setProtectedHeader({ alg: "HS256" })
      .setIssuedAt()
      .setExpirationTime("7d") // 7 days
      .sign(JWT_SECRET);

    console.log("✅ Token created");
    console.log("🔑 Token preview:", token.substring(0, 30) + "...");

    // Create response
    const response = NextResponse.json({
      success: true,
      message: "Login successful",
    });

    // Set HTTP-only cookie with 7-day expiration
    response.cookies.set({
      name: "admin_token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days in seconds
      path: "/",
    });

    console.log("🍪 Cookie set with 7-day expiration");

    return response;
  } catch (error) {
    console.error("💥 Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}