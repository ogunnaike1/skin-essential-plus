import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const BRAND_EMAIL = "skinessentialsp@gmail.com";
const BRAND_NAME  = "Skin Essential Plus";
const FROM_EMAIL  = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export async function POST(request: NextRequest) {
  try {
    const {
      customerName,
      customerEmail,
      customerPhone,
      items,
      subtotal,
      discount,
      total,
      couponCode,
      reference,
    }: {
      customerName: string;
      customerEmail: string;
      customerPhone: string;
      items: OrderItem[];
      subtotal: number;
      discount: number;
      total: number;
      couponCode: string | null;
      reference: string;
    } = await request.json();

    if (!customerEmail || !items?.length || !reference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // ── Upsert customer record in Supabase ─────────────────────────
    try {
      const client = getClient();
      const { data: existing } = await client
        .from("customers")
        .select("id, phone, total_orders, total_spent")
        .eq("email", customerEmail)
        .single();

      if (existing) {
        await client.from("customers").update({
          full_name: customerName,
          phone: customerPhone ?? existing.phone,
          total_orders: (existing.total_orders ?? 0) + 1,
          total_spent: (existing.total_spent ?? 0) + total,
          last_order_date: new Date().toISOString(),
        }).eq("id", existing.id);
      } else {
        await client.from("customers").insert([{
          email: customerEmail,
          full_name: customerName,
          phone: customerPhone ?? null,
          total_orders: 1,
          total_spent: total,
          last_order_date: new Date().toISOString(),
        }]);
      }
    } catch (dbErr) {
      console.error("Customer upsert failed:", dbErr);
    }

    const fmt = (n: number) => `₦${Number(n).toLocaleString("en-NG")}`;

    const itemRows = items
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px 0; font-size: 13px; color: #2D2D2D; border-bottom: 1px solid #F0EDE9;">${item.name}</td>
          <td style="padding: 8px 0; font-size: 13px; color: #6B6B6B; text-align: center; border-bottom: 1px solid #F0EDE9;">×${item.quantity}</td>
          <td style="padding: 8px 0; font-size: 13px; color: #2D2D2D; font-weight: 600; text-align: right; border-bottom: 1px solid #F0EDE9;">${fmt(item.price * item.quantity)}</td>
        </tr>`
      )
      .join("");

    const discountRow = discount > 0
      ? `<tr>
          <td colspan="2" style="padding: 6px 0; font-size: 13px; color: #6B6B6B;">Discount${couponCode ? ` (${couponCode})` : ""}</td>
          <td style="padding: 6px 0; font-size: 13px; color: #47676A; text-align: right;">−${fmt(discount)}</td>
        </tr>`
      : "";

    // ── 1. Customer confirmation email ─────────────────────────────
    const { error: customerEmailError } = await resend.emails.send({
      from: `${BRAND_NAME} <${FROM_EMAIL}>`,
      to: [customerEmail],
      subject: `Your Order is Confirmed — ${BRAND_NAME}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #2D2D2D; background-color: #FAF9F7; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 24px rgba(71,103,106,0.10);">
    <tr><td style="height: 5px; background: linear-gradient(to right, #8A6F88, #4F7288, #47676A);"></td></tr>
    <tr>
      <td style="padding: 36px 36px 20px;">
        <p style="margin: 0 0 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #8A6F88;">${BRAND_NAME}</p>
        <h1 style="margin: 0; font-size: 26px; font-weight: 300; color: #2D2D2D; line-height: 1.2;">Order Confirmed ✓</h1>
        <p style="margin: 8px 0 0; font-size: 14px; color: #6B6B6B;">Hi ${customerName.split(" ")[0]}, thank you for your order! We're getting it ready.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 36px 20px;">
        <div style="background: #F5F3F1; border-radius: 14px; padding: 22px;">
          <p style="margin: 0 0 14px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #4F7288;">— Your Items</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <th style="padding: 0 0 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #aaa; font-weight: 500; text-align: left;">Product</th>
              <th style="padding: 0 0 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #aaa; font-weight: 500; text-align: center;">Qty</th>
              <th style="padding: 0 0 8px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #aaa; font-weight: 500; text-align: right;">Price</th>
            </tr>
            ${itemRows}
            ${discountRow}
            <tr>
              <td colspan="2" style="padding: 10px 0 0; font-size: 13px; color: #6B6B6B;">Subtotal</td>
              <td style="padding: 10px 0 0; font-size: 13px; color: #2D2D2D; text-align: right;">${fmt(subtotal)}</td>
            </tr>
            <tr>
              <td colspan="2" style="padding: 6px 0 0; font-size: 15px; font-weight: 600; color: #2D2D2D; border-top: 2px solid #E8E4E0;">Total Paid</td>
              <td style="padding: 6px 0 0; font-size: 20px; font-weight: 700; color: #47676A; text-align: right; border-top: 2px solid #E8E4E0;">${fmt(total)}</td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 36px 20px;">
        <div style="border: 2px solid #E8EAE8; border-radius: 14px; padding: 18px 22px;">
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#47676A;padding-bottom:10px;">Payment</td>
              <td style="text-align:right;padding-bottom:10px;">
                <span style="display:inline-block;padding:3px 10px;border-radius:20px;background:#D4EDDA;color:#155724;font-size:11px;font-weight:700;letter-spacing:0.05em;">PAID</span>
              </td>
            </tr>
            <tr>
              <td style="padding:4px 0;font-size:13px;color:#6B6B6B;">Reference</td>
              <td style="padding:4px 0;font-size:12px;font-family:monospace;color:#2D2D2D;text-align:right;">${reference}</td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 36px 32px;">
        <div style="background: #F0F4F5; border-radius: 14px; padding: 18px 22px;">
          <p style="margin: 0 0 6px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #8A6F88;">— Need Help?</p>
          <p style="margin: 0; font-size: 13px; color: #6B6B6B;">Reply to this email or WhatsApp us at <strong style="color: #2D2D2D;">+234 812 973 9806</strong>. We'll get back to you within a few hours.</p>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 18px 36px; background: #F5F3F1; text-align: center; border-top: 1px solid #E8E4E0;">
        <p style="margin: 0 0 2px; font-size: 11px; color: #8A6F88;"><strong>${BRAND_NAME}</strong> — No 2, Alaafia Avenue, Akobo, Ibadan</p>
        <p style="margin: 0; font-size: 11px; color: #aaa;">© ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    if (customerEmailError) console.error("Customer order email failed:", customerEmailError);

    // ── 2. Brand notification email ────────────────────────────────
    const { error: brandEmailError } = await resend.emails.send({
      from: `${BRAND_NAME} Shop <${FROM_EMAIL}>`,
      to: [BRAND_EMAIL],
      replyTo: customerEmail,
      subject: `New Shop Order — ${items.map((i) => i.name).join(", ")}`,
      html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif; line-height: 1.6; color: #2D2D2D; background-color: #FAF9F7; margin: 0; padding: 0;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 40px auto; background-color: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 8px 24px rgba(71,103,106,0.10);">
    <tr><td style="height: 5px; background: linear-gradient(to right, #8A6F88, #4F7288, #47676A);"></td></tr>
    <tr>
      <td style="padding: 36px 36px 20px;">
        <p style="margin: 0 0 6px; font-size: 11px; font-weight: 600; letter-spacing: 0.15em; text-transform: uppercase; color: #8A6F88;">${BRAND_NAME} Shop</p>
        <h1 style="margin: 0; font-size: 26px; font-weight: 300; color: #2D2D2D;">New Paid Order ✓</h1>
        <p style="margin: 8px 0 0; font-size: 14px; color: #6B6B6B;">A customer just completed a purchase.</p>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 36px 20px;">
        <div style="background: #F5F3F1; border-radius: 14px; padding: 22px;">
          <p style="margin: 0 0 14px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #8A6F88;">— Customer</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 5px 0; font-size: 13px; color: #6B6B6B; width: 40%;">Name</td>
              <td style="padding: 5px 0; font-size: 13px; font-weight: 600; color: #2D2D2D; text-align: right;">${customerName}</td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-size: 13px; color: #6B6B6B;">Email</td>
              <td style="padding: 5px 0; font-size: 13px; text-align: right;"><a href="mailto:${customerEmail}" style="color: #4F7288; text-decoration: none;">${customerEmail}</a></td>
            </tr>
            <tr>
              <td style="padding: 5px 0; font-size: 13px; color: #6B6B6B;">Phone</td>
              <td style="padding: 5px 0; font-size: 13px; text-align: right;"><a href="tel:${customerPhone}" style="color: #4F7288; text-decoration: none;">${customerPhone}</a></td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 36px 20px;">
        <div style="background: #F0F4F5; border-radius: 14px; padding: 22px;">
          <p style="margin: 0 0 14px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #4F7288;">— Order Items</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            ${itemRows}
            ${discountRow}
            <tr>
              <td colspan="2" style="padding: 10px 0 0; font-size: 15px; font-weight: 600; color: #2D2D2D; border-top: 2px solid #D8E0E2;">Total</td>
              <td style="padding: 10px 0 0; font-size: 20px; font-weight: 700; color: #47676A; text-align: right; border-top: 2px solid #D8E0E2;">${fmt(total)}</td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 0 36px 32px;">
        <div style="border: 2px solid #E8EAE8; border-radius: 14px; padding: 18px 22px;">
          <p style="margin: 0 0 10px; font-size: 10px; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #47676A;">— Payment</p>
          <table width="100%" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding: 4px 0; font-size: 13px; color: #6B6B6B;">Reference</td>
              <td style="padding: 4px 0; font-size: 12px; font-family: monospace; color: #2D2D2D; text-align: right;">${reference}</td>
            </tr>
            <tr>
              <td style="padding: 4px 0; font-size: 13px; color: #6B6B6B;">Status</td>
              <td style="padding: 4px 0; text-align: right;">
                <span style="display:inline-block;padding:3px 10px;border-radius:20px;background:#D4EDDA;color:#155724;font-size:11px;font-weight:700;letter-spacing:0.05em;">PAID</span>
              </td>
            </tr>
          </table>
        </div>
      </td>
    </tr>
    <tr>
      <td style="padding: 18px 36px; background: #F5F3F1; text-align: center; border-top: 1px solid #E8E4E0;">
        <p style="margin: 0; font-size: 11px; color: #8A6F88;">Automated notification from <strong>${BRAND_NAME}</strong> shop system.</p>
      </td>
    </tr>
  </table>
</body>
</html>`,
    });

    if (brandEmailError) console.error("Brand order email failed:", brandEmailError);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Order notify route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
