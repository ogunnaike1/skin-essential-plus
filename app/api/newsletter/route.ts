import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

// Check if API key exists (prevents build errors)
const RESEND_API_KEY = process.env.RESEND_API_KEY;

// Only initialize Resend if API key exists
const resend = RESEND_API_KEY ? new Resend(RESEND_API_KEY) : null;

export async function POST(request: NextRequest) {
  // Runtime check for API key
  if (!resend || !RESEND_API_KEY) {
    console.error("RESEND_API_KEY not configured");
    return NextResponse.json(
      { error: "Email service not configured. Please contact support." },
      { status: 500 }
    );
  }

  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format" },
        { status: 400 }
      );
    }

    // Send welcome email
    const { data, error } = await resend.emails.send({
      from: "Skin Essential Plus <newsletter@skinessentialplus.com>",
      to: [email],
      subject: "Welcome to Skin Essential Plus Newsletter",
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
                <a href="https://skinessentialplus.com/shop" style="display: inline-block; background: linear-gradient(135deg, #8A6F88 0%, #4F7288 100%); color: #FCFBFC; padding: 14px 32px; text-decoration: none; border-radius: 50px; font-weight: 500;">Shop Now</a>
              </div>
              
              <p style="color: #47676A; margin-top: 30px; font-size: 14px; text-align: center;">
                Stay radiant,<br>
                <strong>The Skin Essential Plus Team</strong>
              </p>
            </div>
            
            <div style="text-align: center; margin-top: 20px; padding: 20px; color: #47676A; opacity: 0.6; font-size: 12px;">
              <p style="margin: 4px 0;">You received this email because you subscribed to our newsletter.</p>
              <p style="margin: 4px 0;">Skin Essential Plus | Lagos, Nigeria</p>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send confirmation email" },
        { status: 500 }
      );
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