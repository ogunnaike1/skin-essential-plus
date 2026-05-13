import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, serviceInterest, message } = body;

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required" },
        { status: 400 }
      );
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: `Contact Form <${FROM_EMAIL}>`,
      to: ["ogunnaikeusman17@gmail.com"], // Your company email
      replyTo: email, // User's email for easy reply
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>New Contact Form Submission</title>
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #354F52; background-color: #FAF9F7; margin: 0; padding: 0;">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 6px rgba(71, 103, 106, 0.1);">
              <!-- Header -->
              <tr>
                <td style="padding: 0;">
                  <div style="height: 4px; display: flex;">
                    <div style="flex: 1; background-color: #8A6F88;"></div>
                    <div style="flex: 1; background-color: #4F7288;"></div>
                    <div style="flex: 1; background-color: #47676A;"></div>
                  </div>
                </td>
              </tr>
              
              <!-- Content -->
              <tr>
                <td style="padding: 40px 32px;">
                  <h1 style="margin: 0 0 8px 0; font-size: 24px; font-weight: 300; color: #354F52;">New Contact Form Submission</h1>
                  <p style="margin: 0 0 32px 0; font-size: 14px; color: #8A6F88;">Someone just reached out through your website!</p>
                  
                  <!-- Customer Details -->
                  <div style="background-color: #F5F3F1; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                    <h2 style="margin: 0 0 16px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #8A6F88;">— Customer Details</h2>
                    
                    <table width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding: 8px 0; font-size: 13px; color: #354F52;">
                          <strong>Name:</strong>
                        </td>
                        <td style="padding: 8px 0; font-size: 13px; color: #354F52; text-align: right;">
                          ${name}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 8px 0; font-size: 13px; color: #354F52;">
                          <strong>Email:</strong>
                        </td>
                        <td style="padding: 8px 0; font-size: 13px; text-align: right;">
                          <a href="mailto:${email}" style="color: #4F7288; text-decoration: none;">${email}</a>
                        </td>
                      </tr>
                      ${phone ? `
                      <tr>
                        <td style="padding: 8px 0; font-size: 13px; color: #354F52;">
                          <strong>Phone:</strong>
                        </td>
                        <td style="padding: 8px 0; font-size: 13px; text-align: right;">
                          <a href="tel:${phone}" style="color: #4F7288; text-decoration: none;">${phone}</a>
                        </td>
                      </tr>
                      ` : ''}
                      ${serviceInterest ? `
                      <tr>
                        <td style="padding: 8px 0; font-size: 13px; color: #354F52;">
                          <strong>Interested In:</strong>
                        </td>
                        <td style="padding: 8px 0; font-size: 13px; color: #354F52; text-align: right;">
                          ${serviceInterest}
                        </td>
                      </tr>
                      ` : ''}
                    </table>
                  </div>
                  
                  <!-- Message -->
                  <div style="background-color: #F5F3F1; border-radius: 12px; padding: 24px;">
                    <h2 style="margin: 0 0 16px 0; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.1em; color: #8A6F88;">— Message</h2>
                    <p style="margin: 0; font-size: 14px; line-height: 1.7; color: #354F52; white-space: pre-wrap;">${message}</p>
                  </div>
                  
                  <!-- Reply Button -->
                  <div style="text-align: center; margin-top: 32px;">
                    <a href="mailto:${email}?subject=Re: Your inquiry to Skin Essential Plus" style="display: inline-block; padding: 14px 32px; background-color: #47676A; color: #FAF9F7; text-decoration: none; border-radius: 24px; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.15em;">Reply to ${name}</a>
                  </div>
                </td>
              </tr>
              
              <!-- Footer -->
              <tr>
                <td style="padding: 24px 32px; background-color: #F5F3F1; text-align: center;">
                  <p style="margin: 0; font-size: 11px; color: #8A6F88;">
                    This email was sent from your contact form at<br>
                    <a href="https://skinessentialplus.com" style="color: #4F7288; text-decoration: none;">skinessentialplus.com</a>
                  </p>
                </td>
              </tr>
            </table>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json(
        { error: "Failed to send email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { 
        success: true, 
        message: "Email sent successfully",
        id: data?.id 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}