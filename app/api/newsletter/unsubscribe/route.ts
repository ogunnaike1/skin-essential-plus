import { NextRequest, NextResponse } from "next/server";
import { unsubscribeByToken } from "@/lib/supabase/newsletter-api";
import { removeContactFromBrevoList, isBrevoConfigured } from "@/lib/brevo";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.skinessentialplus.com";

async function processUnsubscribe(token: string | null): Promise<boolean> {
  if (!token) return false;

  const subscriber = await unsubscribeByToken(token);
  if (!subscriber) return false;

  // Mirror the opt-out into Brevo so a campaign can never reach them anyway.
  if (isBrevoConfigured()) {
    const result = await removeContactFromBrevoList(subscriber.email);
    if (!result.ok) {
      console.error("Brevo unsubscribe sync failed:", result.error);
    }
  }

  return true;
}

// Gmail and Outlook POST here when the reader uses their built-in unsubscribe
// button. It must work without any confirmation screen, per RFC 8058.
export async function POST(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");

  try {
    await processUnsubscribe(token);
  } catch (error) {
    console.error("One-click unsubscribe failed:", error);
  }

  // Always 200 — telling a mail client the opt-out failed only makes it more
  // likely the reader reports us as spam instead.
  return new NextResponse(null, { status: 200 });
}

// Someone clicking the raw header link in a browser lands here.
export async function GET(request: NextRequest) {
  const token = request.nextUrl.searchParams.get("token");
  const target = token
    ? `${SITE_URL}/unsubscribe?token=${token}`
    : `${SITE_URL}/unsubscribe`;

  return NextResponse.redirect(target);
}
