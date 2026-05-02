import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  try {
    // Check API key
    const apiKey = process.env.RESEND_API_KEY;
    
    if (!apiKey) {
      return NextResponse.json({ 
        error: "RESEND_API_KEY is not set in environment variables" 
      }, { status: 500 });
    }

    if (!apiKey.startsWith('re_')) {
      return NextResponse.json({ 
        error: "RESEND_API_KEY is invalid (should start with 're_')" 
      }, { status: 500 });
    }

    // Initialize Resend
    const resend = new Resend(apiKey);

    // Try to send a test email
    const { data, error } = await resend.emails.send({
      from: "Test <onboarding@resend.dev>",
      to: ["delivered@resend.dev"], // Resend's test email
      subject: "Test Email from Skin Essential Plus",
      html: "<p>This is a test email to verify Resend is working!</p>",
    });

    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error,
        apiKeyExists: true,
        apiKeyValid: true
      }, { status: 500 });
    }

    return NextResponse.json({ 
      success: true, 
      message: "Email sent successfully!",
      emailId: data?.id,
      apiKey: apiKey.substring(0, 10) + "...",
    });

  } catch (error) {
    return NextResponse.json({ 
      success: false, 
      error: String(error),
      message: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 });
  }
}