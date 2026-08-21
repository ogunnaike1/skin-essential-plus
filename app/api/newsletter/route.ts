import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { addContactToBrevo, isBrevoConfigured } from "@/lib/brevo";
import {
  subscribeToNewsletter,
  recordBrevoSync,
} from "@/lib/supabase/newsletter-api";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";
const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.skinessentialplus.com";

// Which system sends the welcome email.
//   "resend" - the hardcoded template below (default)
//   "brevo"  - a Brevo automation triggered by the contact joining the list
//   "none"   - no welcome email at all
// Only ever one of them, so a new subscriber cannot receive duplicates.
const WELCOME_PROVIDER = (
  process.env.WELCOME_EMAIL_PROVIDER ?? "resend"
).toLowerCase();

export async function POST(request: NextRequest) {
  const ip = getClientIp(request);
  const { allowed } = rateLimit(`newsletter:${ip}`, 3, 60 * 60 * 1000); // 3 per hour
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

  try {
    const { email, fullName, source } = await request.json();

    if (!email || typeof email !== "string") {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // 1. Save to our own database first. This is the only step allowed to fail
    //    the request — if we cannot record the subscriber, we have lost them.
    const { subscriber, isNew } = await subscribeToNewsletter({
      email,
      fullName: typeof fullName === "string" ? fullName : undefined,
      source: typeof source === "string" ? source : "website",
      consentIp: ip,
    });

    // Already on the list. Report success without sending a second welcome —
    // re-subscribing should never feel like an error to the visitor.
    if (!isNew) {
      return NextResponse.json({
        success: true,
        message: "You're already subscribed — thank you for being with us.",
      });
    }

    // 2. Push to Brevo for campaigns. A failure here is recorded and retried
    //    later; it must not cost us the signup we just captured.
    if (isBrevoConfigured()) {
      const syncResult = await addContactToBrevo(
        subscriber.email,
        subscriber.full_name ?? undefined
      );
      await recordBrevoSync(subscriber.id, syncResult);

      if (!syncResult.ok) {
        console.error("Brevo sync failed:", syncResult.error);
      }
    }

    // 3. Welcome email — unless a Brevo automation is the one sending it.
    //    Also non-fatal: they are subscribed either way.
    if (WELCOME_PROVIDER !== "resend") {
      return NextResponse.json({
        success: true,
        message:
          "Successfully subscribed! Check your email for a welcome message.",
      });
    }

    // Human-facing page with a confirmation step...
    const unsubscribeUrl = `${SITE_URL}/unsubscribe?token=${subscriber.unsubscribe_token}`;
    // ...and a machine endpoint the mail clients POST to for one-click opt-out.
    const listUnsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?token=${subscriber.unsubscribe_token}`;

    const { error: sendError } = await resend.emails.send({
      from: `Skin Essential Plus <${FROM_EMAIL}>`,
      to: [subscriber.email],
      subject: "Welcome to Skin Essential Plus Newsletter",
      headers: {
        // Lets Gmail and Outlook show a native unsubscribe button, which keeps
        // people from reporting us as spam just to make the emails stop.
        "List-Unsubscribe": `<${listUnsubscribeUrl}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #47676A; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #8A6F88 0%, #4F7288 100%); padding: 40px 20px; text-align: center; border-radius: 12px 12px 0 0;">
              <h1 style="color: #FCFBFC; margin: 0; font-size: 28px; font-weight: 300;">Welcome to Skin Essential Plus</h1>
            </div>

            <div style="background: #FCFBFC; padding: 40px 30px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 12px rgba(71, 103, 106, 0.1);">
              <h2 style="color: #47676A; font-size: 20px; font-weight: 300; margin-top: 0;">Thank you for subscribing! ✨</h2>

              <p style="color: #47676A; margin: 16px 0;">You're now part of our exclusive community of skincare enthusiasts.</p>

              <p style="color: #47676A; margin: 16px 0;">Here's what you can expect:</p>

              <ul style="color: #47676A; margin: 16px 0; padding-left: 20px;">
                <li style="margin: 8px 0;">🌟 Early access to new product launches</li>
                <li style="margin: 8px 0;">💡 Expert skincare tips and routines</li>
                <li style="margin: 8px 0;">🎁 Exclusive subscriber-only offers</li>
                <li style="margin: 8px 0;">📚 Science-backed skincare education</li>
              </ul>

              <div style="margin: 30px 0; padding: 20px; background: rgba(138, 111, 136, 0.1); border-radius: 8px; text-align: center;">
                <p style="color: #8A6F88; margin: 0; font-weight: 500;">Get 10% off your first order!</p>
                <p style="color: #47676A; margin: 8px 0 0 0; font-size: 14px;">Use code: <strong>WELCOME10</strong></p>
              </div>

              <div style="text-align: center; margin-top: 30px;">
                <a href="${SITE_URL}/shop" style="display: inline-block; background: linear-gradient(135deg, #8A6F88 0%, #4F7288 100%); color: #FCFBFC; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 500;">Shop Now</a>
              </div>

              <p style="color: #47676A; margin-top: 30px; font-size: 14px; text-align: center;">
                Stay radiant,<br>
                <strong>The Skin Essential Plus Team</strong>
              </p>
            </div>

            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #47676A; opacity: 0.6; font-size: 12px;">
              <p style="margin: 4px 0;">You received this email because you subscribed to our newsletter.</p>
              <p style="margin: 4px 0;">Skin Essential Plus | Lagos, Nigeria</p>
              <p style="margin: 12px 0 4px 0;">
                <a href="${unsubscribeUrl}" style="color: #47676A;">Unsubscribe</a>
              </p>
            </div>
          </body>
        </html>
      `,
    });

    if (sendError) {
      console.error("Resend error:", sendError);
    }

    return NextResponse.json({
      success: true,
      message: "Successfully subscribed! Check your email for a welcome message.",
    });
  } catch (error) {
    console.error("Newsletter error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
