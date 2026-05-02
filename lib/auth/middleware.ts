import { NextRequest } from "next/server";
import { verify } from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production";

export interface AdminUser {
  email: string;
  role: string;
}

export async function verifyAdmin(request: NextRequest): Promise<AdminUser | null> {
  try {
    const token = request.cookies.get("admin_token")?.value;

    if (!token) {
      return null;
    }

    const decoded = verify(token, JWT_SECRET) as AdminUser;
    
    if (decoded.role !== "admin") {
      return null;
    }

    return decoded;
  } catch (error) {
    console.error("Token verification error:", error);
    return null;
  }
}

export function unauthorizedResponse() {
  return new Response(
    JSON.stringify({ error: "Unauthorized" }),
    { status: 401, headers: { "Content-Type": "application/json" } }
  );
}