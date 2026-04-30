import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Valid email is required' },
        { status: 400 }
      );
    }

    // Add contact to Resend
    // You can optionally add the contact to an audience if you have one
    const audienceId = process.env.RESEND_AUDIENCE_ID;

    try {
      if (audienceId) {
        // If you have an audience ID, add contact to it
        await resend.contacts.create({
          email,
          audienceId,
        });
      } else {
        // Otherwise just create the contact
        await resend.contacts.create({
          email,
        });
      }
    } catch (contactError: any) {
      // Handle duplicate contact error
      if (contactError.message?.includes('already exists') || contactError.message?.includes('Contact already exists')) {
        return NextResponse.json(
          { error: 'This email is already subscribed' },
          { status: 409 }
        );
      }
      throw contactError;
    }

    // Send welcome email
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev',
      to: email,
      subject: 'Welcome to Skin Essential Plus',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #354F52; background-color: #FCFBFC; margin: 0; padding: 0;">
            <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
              <!-- Header -->
              <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="font-size: 28px; font-weight: 300; color: #354F52; margin: 0;">
                  Skin Essential Plus
                </h1>
                <p style="font-size: 12px; letter-spacing: 0.2em; color: #8A6F88; margin: 8px 0 0;">
                  WHERE SCIENCE MEETS SERENITY
                </p>
              </div>

              <!-- Main Content -->
              <div style="background: white; border-radius: 24px; padding: 40px 32px; box-shadow: 0 4px 20px rgba(53, 79, 82, 0.08);">
                <h2 style="font-size: 24px; font-weight: 300; color: #354F52; margin: 0 0 16px;">
                  Welcome to our sanctuary
                </h2>
                
                <p style="font-size: 16px; color: #354F52; margin: 0 0 24px; line-height: 1.7;">
                  Thank you for joining the Essential list. You're now part of an intimate community of skin enthusiasts who value quality, intention, and transformation.
                </p>

                <div style="background: rgba(138, 111, 136, 0.05); border-left: 4px solid #8A6F88; padding: 24px; margin: 24px 0; border-radius: 8px;">
                  <h3 style="font-size: 16px; font-weight: 500; color: #8A6F88; margin: 0 0 12px;">
                    What to expect:
                  </h3>
                  <ul style="margin: 0; padding-left: 20px; color: #354F52;">
                    <li style="margin-bottom: 8px;">Seasonal rituals and skin wisdom delivered monthly</li>
                    <li style="margin-bottom: 8px;">Early access to new formulations and treatments</li>
                    <li style="margin-bottom: 8px;">Exclusive member-only offers</li>
                    <li>Personal skincare guidance from our clinicians</li>
                  </ul>
                </div>

                <p style="font-size: 16px; color: #354F52; margin: 24px 0 0; line-height: 1.7;">
                  Your first consultation is complimentary — a 45-minute ritual curated entirely around you.
                </p>

                <!-- CTA Button -->
                <div style="text-align: center; margin: 32px 0;">
                  <a href="https://skinessentialplus.com/services" style="display: inline-block; background: #354F52; color: white; padding: 16px 40px; border-radius: 50px; text-decoration: none; font-size: 12px; letter-spacing: 0.15em; text-transform: uppercase; font-weight: 500;">
                    Explore Services
                  </a>
                </div>
              </div>

              <!-- Footer -->
              <div style="text-align: center; margin-top: 40px; padding-top: 24px; border-top: 1px solid rgba(53, 79, 82, 0.1);">
                <p style="font-size: 12px; color: #8A6F88; margin: 0 0 8px;">
                  12 Serenity Avenue, Victoria Island, Lagos
                </p>
                <p style="font-size: 12px; color: #8A6F88; margin: 0 0 16px;">
                  +234 800 123 4567 · hello@skinessentialplus.com
                </p>
                <p style="font-size: 11px; color: #999; margin: 0;">
                  You're receiving this because you subscribed to our newsletter.
                </p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200 }
    );
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);

    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again.' },
      { status: 500 }
    );
  }
}