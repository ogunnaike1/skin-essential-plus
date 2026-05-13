import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const BRAND_EMAIL = "ogunnaikeusman17@gmail.com";
const BRAND_NAME  = "Skin Essential Plus";
const BANK_NAME   = process.env.NEXT_PUBLIC_BANK_NAME    ?? "";
const ACCT_NAME   = process.env.NEXT_PUBLIC_ACCOUNT_NAME ?? "";
const ACCT_NO     = process.env.NEXT_PUBLIC_ACCOUNT_NUMBER ?? "";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const { appointmentId, reference, isBankTransfer = false } = await request.json();

    if (!appointmentId) {
      return NextResponse.json({ error: "appointmentId is required" }, { status: 400 });
    }

    const client = getClient();

    // ── 1. Fetch the appointment ──────────────────────────────────
    const { data: appointment, error: fetchError } = await client
      .from("appointments")
      .select("*")
      .eq("id", appointmentId)
      .single();

    if (fetchError || !appointment) {
      console.error("Appointment not found:", fetchError);
      return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
    }

    // ── 2. Update status depending on payment method ──────────────
    if (!isBankTransfer && reference) {
      const { error: updateError } = await client
        .from("appointments")
        .update({
          status: "confirmed",
          payment_status: "paid",
          payment_reference: reference,
        })
        .eq("id", appointmentId);

      if (updateError) {
        console.error("Failed to update appointment:", updateError);
      }

      // Upsert customer record on paid bookings
      const { data: existingCustomer } = await client
        .from("customers")
        .select("id, phone, total_orders, total_spent")
        .eq("email", appointment.customer_email)
        .single();

      if (existingCustomer) {
        await client
          .from("customers")
          .update({
            full_name: appointment.customer_name,
            phone: appointment.customer_phone ?? existingCustomer.phone,
            total_orders: (existingCustomer.total_orders ?? 0) + 1,
            total_spent: (existingCustomer.total_spent ?? 0) + appointment.service_price,
            last_order_date: new Date().toISOString(),
          })
          .eq("id", existingCustomer.id);
      } else {
        await client
          .from("customers")
          .insert([{
            email: appointment.customer_email,
            full_name: appointment.customer_name,
            phone: appointment.customer_phone ?? null,
            total_orders: 1,
            total_spent: appointment.service_price,
            last_order_date: new Date().toISOString(),
          }]);
      }
    }

    // ── 3. Format date/time ───────────────────────────────────────
    const formattedDate = appointment.appointment_date
      ? new Date(appointment.appointment_date + "T12:00:00").toLocaleDateString("en-NG", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        })
      : "—";

    const formattedTime = appointment.start_time
      ? new Date(`2000-01-01T${appointment.start_time}`).toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          hour12: true,
        })
      : "—";

    const formattedAmount = `₦${Number(appointment.service_price).toLocaleString("en-NG")}`;
    const firstName = appointment.customer_name.split(" ")[0] ?? appointment.customer_name;

    // ── 4. Customer email ─────────────────────────────────────────
    const customerSubject = isBankTransfer
      ? `Booking Received — Complete Payment to Confirm | ${appointment.service_name}`
      : `Your Appointment is Confirmed — ${appointment.service_name}`;

    const customerHtml = isBankTransfer
      ? bankTransferCustomerHtml({ appointment, firstName, formattedDate, formattedTime, formattedAmount })
      : paidCustomerHtml({ appointment, firstName, formattedDate, formattedTime, formattedAmount, reference });

    const { error: customerEmailError } = await resend.emails.send({
      from: `${BRAND_NAME} <onboarding@resend.dev>`,
      to: [appointment.customer_email],
      subject: customerSubject,
      html: customerHtml,
    });

    if (customerEmailError) {
      console.error("Customer email send failed:", customerEmailError);
    }

    // ── 5. Brand notification email ───────────────────────────────
    const brandSubject = isBankTransfer
      ? `New Bank Transfer Booking — ${appointment.service_name} (Awaiting Payment)`
      : `New Paid Appointment — ${appointment.service_name}`;

    const { error: brandEmailError } = await resend.emails.send({
      from: `${BRAND_NAME} Bookings <onboarding@resend.dev>`,
      to: [BRAND_EMAIL],
      replyTo: appointment.customer_email,
      subject: brandSubject,
      html: brandNotificationHtml({ appointment, formattedDate, formattedTime, formattedAmount, reference, isBankTransfer }),
    });

    if (brandEmailError) {
      console.error("Brand email send failed:", brandEmailError);
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notify route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── Email templates ───────────────────────────────────────────

function accentBar() {
  return `<tr><td style="padding:0;height:5px;background:linear-gradient(to right,#8A6F88,#4F7288,#47676A);"></td></tr>`;
}

function emailWrapper(content: string) {
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Arial,sans-serif;line-height:1.6;color:#2D2D2D;background-color:#FAF9F7;margin:0;padding:0;">
<table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:40px auto;background-color:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 8px 24px rgba(71,103,106,0.10);">
${accentBar()}
${content}
<tr><td style="padding:20px 36px;background:#F5F3F1;text-align:center;border-top:1px solid #E8E4E0;">
  <p style="margin:0 0 4px;font-size:11px;color:#8A6F88;">Questions? Reply to this email or WhatsApp us at <strong>+234 814 830 3684</strong>.</p>
  <p style="margin:0;font-size:11px;color:#aaa;">© ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
</td></tr>
</table></body></html>`;
}

interface TemplateData {
  appointment: Record<string, any>;
  firstName: string;
  formattedDate: string;
  formattedTime: string;
  formattedAmount: string;
  reference?: string;
}

function bookingDetailsCard(data: Omit<TemplateData, "firstName" | "reference">) {
  const { appointment, formattedDate, formattedTime, formattedAmount } = data;
  return `
<tr><td style="padding:0 36px 20px;">
  <div style="background:#F0F4F5;border-radius:14px;padding:22px;">
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#4F7288;">— Booking Details</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;width:40%;">Service</td>
        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#2D2D2D;text-align:right;">${appointment.service_name}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Date</td>
        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#2D2D2D;text-align:right;">${formattedDate}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Time</td>
        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#2D2D2D;text-align:right;">${formattedTime}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Amount</td>
        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#47676A;text-align:right;">${formattedAmount}</td>
      </tr>
      ${appointment.notes ? `<tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;vertical-align:top;">Notes</td>
        <td style="padding:6px 0;font-size:13px;color:#2D2D2D;text-align:right;">${appointment.notes}</td>
      </tr>` : ""}
    </table>
  </div>
</td></tr>`;
}

function locationCard() {
  return `
<tr><td style="padding:0 36px 28px;">
  <div style="background:#F5F3F1;border-radius:14px;padding:22px;">
    <p style="margin:0 0 10px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8A6F88;">— Find Us</p>
    <p style="margin:0 0 4px;font-size:13px;font-weight:600;color:#2D2D2D;">No 2, Alaafia Avenue</p>
    <p style="margin:0 0 10px;font-size:13px;color:#6B6B6B;">Opposite IDC Primary School, Akobo, Ibadan</p>
    <p style="margin:0;font-size:13px;color:#6B6B6B;">📞 +234 814 830 3684 &nbsp;·&nbsp; Mon–Sat · 9:00 AM – 8:00 PM</p>
  </div>
</td></tr>`;
}

function paidCustomerHtml(data: TemplateData) {
  const { firstName, formattedAmount, reference } = data;
  return emailWrapper(`
<tr><td style="padding:36px 36px 24px;">
  <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#8A6F88;">${BRAND_NAME}</p>
  <h1 style="margin:0;font-size:26px;font-weight:300;color:#2D2D2D;line-height:1.2;">Your Appointment is Confirmed ✓</h1>
  <p style="margin:8px 0 0;font-size:14px;color:#6B6B6B;">Hi ${firstName}, we're looking forward to seeing you!</p>
</td></tr>
${bookingDetailsCard(data)}
<tr><td style="padding:0 36px 20px;">
  <div style="border:2px solid #E8EAE8;border-radius:14px;padding:22px;">
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#47676A;">— Payment</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;width:40%;">Amount Paid</td>
        <td style="padding:6px 0;font-size:20px;font-weight:600;color:#47676A;text-align:right;">${formattedAmount}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Status</td>
        <td style="padding:6px 0;text-align:right;">
          <span style="display:inline-block;padding:3px 10px;border-radius:20px;background:#D4EDDA;color:#155724;font-size:11px;font-weight:700;letter-spacing:0.05em;">PAID</span>
        </td>
      </tr>
      ${reference ? `<tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Reference</td>
        <td style="padding:6px 0;font-size:12px;font-family:monospace;color:#2D2D2D;text-align:right;">${reference}</td>
      </tr>` : ""}
    </table>
  </div>
</td></tr>
${locationCard()}`);
}

function bankTransferCustomerHtml(data: TemplateData) {
  const { firstName, formattedAmount } = data;
  return emailWrapper(`
<tr><td style="padding:36px 36px 24px;">
  <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#8A6F88;">${BRAND_NAME}</p>
  <h1 style="margin:0;font-size:26px;font-weight:300;color:#2D2D2D;line-height:1.2;">Booking Received — Action Required</h1>
  <p style="margin:8px 0 0;font-size:14px;color:#6B6B6B;">Hi ${firstName}, your booking request is received. Complete your payment below to confirm your slot.</p>
</td></tr>
${bookingDetailsCard(data)}
<tr><td style="padding:0 36px 20px;">
  <div style="background:#EEF4F0;border:2px solid #B2D8BC;border-radius:14px;padding:22px;">
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#2D6A4F;">— Payment Instructions</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;width:40%;">Bank</td>
        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#2D2D2D;text-align:right;">${BANK_NAME}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Account Name</td>
        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#2D2D2D;text-align:right;">${ACCT_NAME}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Account Number</td>
        <td style="padding:6px 0;font-size:16px;font-weight:700;color:#2D6A4F;text-align:right;letter-spacing:0.05em;">${ACCT_NO}</td>
      </tr>
      <tr>
        <td style="padding:8px 0 0;font-size:13px;color:#6B6B6B;border-top:1px solid #C8E6CE;">Exact Amount</td>
        <td style="padding:8px 0 0;font-size:20px;font-weight:700;color:#2D6A4F;text-align:right;border-top:1px solid #C8E6CE;">${formattedAmount}</td>
      </tr>
    </table>
    <div style="margin-top:16px;padding:12px;background:#ffffff;border-radius:10px;">
      <p style="margin:0;font-size:12px;color:#6B6B6B;line-height:1.6;">
        After transferring, send your payment proof (screenshot) to us on WhatsApp at
        <strong style="color:#2D2D2D;">+234 814 830 3684</strong>.
        We will confirm your booking within a few hours.
      </p>
    </div>
  </div>
</td></tr>
${locationCard()}`);
}

interface BrandTemplateData {
  appointment: Record<string, any>;
  formattedDate: string;
  formattedTime: string;
  formattedAmount: string;
  reference?: string;
  isBankTransfer: boolean;
}

function brandNotificationHtml(data: BrandTemplateData) {
  const { appointment, formattedDate, formattedTime, formattedAmount, reference, isBankTransfer } = data;
  const statusBadge = isBankTransfer
    ? `<span style="display:inline-block;padding:3px 10px;border-radius:20px;background:#FFF3CD;color:#856404;font-size:11px;font-weight:700;">AWAITING PAYMENT</span>`
    : `<span style="display:inline-block;padding:3px 10px;border-radius:20px;background:#D4EDDA;color:#155724;font-size:11px;font-weight:700;">PAID</span>`;

  return emailWrapper(`
<tr><td style="padding:36px 36px 24px;">
  <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#8A6F88;">${BRAND_NAME}</p>
  <h1 style="margin:0;font-size:26px;font-weight:300;color:#2D2D2D;line-height:1.2;">${isBankTransfer ? "New Bank Transfer Booking" : "New Paid Appointment ✓"}</h1>
  <p style="margin:8px 0 0;font-size:14px;color:#6B6B6B;">${isBankTransfer ? "A booking was received — awaiting bank transfer payment." : "A booking was confirmed via online payment."}</p>
</td></tr>
<tr><td style="padding:0 36px 20px;">
  <div style="background:#F5F3F1;border-radius:14px;padding:22px;">
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8A6F88;">— Customer</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;width:40%;">Name</td>
        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#2D2D2D;text-align:right;">${appointment.customer_name}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Email</td>
        <td style="padding:6px 0;font-size:13px;text-align:right;"><a href="mailto:${appointment.customer_email}" style="color:#4F7288;text-decoration:none;">${appointment.customer_email}</a></td>
      </tr>
      ${appointment.customer_phone ? `<tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Phone</td>
        <td style="padding:6px 0;font-size:13px;text-align:right;"><a href="tel:${appointment.customer_phone}" style="color:#4F7288;text-decoration:none;">${appointment.customer_phone}</a></td>
      </tr>` : ""}
    </table>
  </div>
</td></tr>
<tr><td style="padding:0 36px 20px;">
  <div style="background:#F0F4F5;border-radius:14px;padding:22px;">
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#4F7288;">— Booking</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;width:40%;">Service</td>
        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#2D2D2D;text-align:right;">${appointment.service_name}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Date</td>
        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#2D2D2D;text-align:right;">${formattedDate}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Time</td>
        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#2D2D2D;text-align:right;">${formattedTime}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Amount</td>
        <td style="padding:6px 0;font-size:14px;font-weight:600;color:#47676A;text-align:right;">${formattedAmount}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Status</td>
        <td style="padding:6px 0;text-align:right;">${statusBadge}</td>
      </tr>
      ${reference ? `<tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Reference</td>
        <td style="padding:6px 0;font-size:12px;font-family:monospace;color:#2D2D2D;text-align:right;">${reference}</td>
      </tr>` : ""}
      ${appointment.notes ? `<tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;vertical-align:top;">Notes</td>
        <td style="padding:6px 0;font-size:13px;color:#2D2D2D;text-align:right;">${appointment.notes}</td>
      </tr>` : ""}
    </table>
  </div>
</td></tr>
<tr><td style="padding:0 36px 36px;text-align:center;">
  <a href="https://skinessentialplus.com/admin/appointments" style="display:inline-block;padding:14px 36px;background:#47676A;color:#FAF9F7;text-decoration:none;border-radius:28px;font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;">
    View in Admin Panel →
  </a>
</td></tr>`);
}
