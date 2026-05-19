import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const resend = new Resend(process.env.RESEND_API_KEY);

const BRAND_EMAIL = "skinessentialsp@gmail.com";
const BRAND_NAME  = "Skin Essential Plus";
const FROM_EMAIL  = process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Accept both new multi-ID format and legacy single-ID format
    const appointmentIds: string[] =
      body.appointmentIds ??
      (body.appointmentId ? [body.appointmentId] : []);
    const reference: string | undefined = body.reference;

    if (appointmentIds.length === 0) {
      return NextResponse.json({ error: "appointmentIds is required" }, { status: 400 });
    }

    const client = getClient();

    // ── 1. Fetch all appointments ─────────────────────────────────
    const { data: appointments, error: fetchError } = await client
      .from("appointments")
      .select("*")
      .in("id", appointmentIds);

    if (fetchError || !appointments || appointments.length === 0) {
      console.error("Appointments not found:", fetchError);
      return NextResponse.json({ error: "Appointments not found" }, { status: 404 });
    }

    const primary = appointments[0]!;
    const totalPrice = appointments.reduce((sum, a) => sum + (a.service_price ?? 0), 0);

    // ── 2. Mark all confirmed + paid ──────────────────────────────
    if (reference) {
      await client
        .from("appointments")
        .update({ status: "confirmed", payment_status: "paid", payment_reference: reference })
        .in("id", appointmentIds);

      // Upsert customer — count the whole booking as 1 order
      const { data: existing } = await client
        .from("customers")
        .select("id, phone, total_orders, total_spent")
        .eq("email", primary.customer_email)
        .single();

      if (existing) {
        await client.from("customers").update({
          full_name:        primary.customer_name,
          phone:            primary.customer_phone ?? existing.phone,
          total_orders:     (existing.total_orders ?? 0) + 1,
          total_spent:      (existing.total_spent ?? 0) + totalPrice,
          last_order_date:  new Date().toISOString(),
        }).eq("id", existing.id);
      } else {
        await client.from("customers").insert([{
          email:            primary.customer_email,
          full_name:        primary.customer_name,
          phone:            primary.customer_phone ?? null,
          total_orders:     1,
          total_spent:      totalPrice,
          last_order_date:  new Date().toISOString(),
        }]);
      }
    }

    // ── 3. Format shared date / time ──────────────────────────────
    const formattedDate = primary.appointment_date
      ? new Date(primary.appointment_date + "T12:00:00").toLocaleDateString("en-NG", {
          weekday: "long", day: "numeric", month: "long", year: "numeric",
        })
      : "—";

    const formattedTime = primary.start_time
      ? new Date(`2000-01-01T${primary.start_time}`).toLocaleTimeString("en-US", {
          hour: "numeric", minute: "2-digit", hour12: true,
        })
      : "—";

    const formattedTotal = `₦${Number(totalPrice).toLocaleString("en-NG")}`;
    const firstName      = primary.customer_name.split(" ")[0] ?? primary.customer_name;
    const subjectLabel   = appointments.length === 1
      ? appointments[0]!.service_name
      : `${appointments.length} services`;

    // ── 4. Customer confirmation email ────────────────────────────
    const { error: customerEmailError } = await resend.emails.send({
      from:    `${BRAND_NAME} <${FROM_EMAIL}>`,
      to:      [primary.customer_email],
      subject: `Your Appointment is Confirmed — ${subjectLabel}`,
      html:    paidCustomerHtml({ appointments, firstName, formattedDate, formattedTime, formattedTotal, reference }),
    });

    if (customerEmailError) console.error("Customer email send failed:", customerEmailError);

    // ── 5. Brand notification email ───────────────────────────────
    const { error: brandEmailError } = await resend.emails.send({
      from:    `${BRAND_NAME} Bookings <${FROM_EMAIL}>`,
      to:      [BRAND_EMAIL],
      replyTo: primary.customer_email,
      subject: `New Paid Appointment — ${subjectLabel}`,
      html:    brandNotificationHtml({ appointments, primary, formattedDate, formattedTime, formattedTotal, reference }),
    });

    if (brandEmailError) console.error("Brand email send failed:", brandEmailError);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Notify route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ── Shared helpers ────────────────────────────────────────────────

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
  <p style="margin:0 0 4px;font-size:11px;color:#8A6F88;">Questions? Reply to this email or WhatsApp us at <strong>+234 812 973 9806</strong>.</p>
  <p style="margin:0;font-size:11px;color:#aaa;">© ${new Date().getFullYear()} ${BRAND_NAME}. All rights reserved.</p>
</td></tr>
</table></body></html>`;
}

function serviceRows(appointments: Record<string, any>[]) {
  const rows = appointments.map((a) => `
    <tr>
      <td style="padding:7px 0;font-size:13px;color:#2D2D2D;font-weight:600;">${a.service_name}</td>
      <td style="padding:7px 0;font-size:13px;font-weight:600;color:#2D2D2D;text-align:right;">₦${Number(a.service_price).toLocaleString("en-NG")}</td>
    </tr>`).join("");

  if (appointments.length === 1) return rows;

  const total = appointments.reduce((s, a) => s + (a.service_price ?? 0), 0);
  return rows + `
    <tr>
      <td colspan="2" style="padding:0;"><hr style="border:none;border-top:1px solid #D8D4D0;margin:6px 0;" /></td>
    </tr>
    <tr>
      <td style="padding:7px 0;font-size:12px;font-weight:700;letter-spacing:0.06em;text-transform:uppercase;color:#4F7288;">Total Paid</td>
      <td style="padding:7px 0;font-size:16px;font-weight:700;color:#47676A;text-align:right;">₦${Number(total).toLocaleString("en-NG")}</td>
    </tr>`;
}

function bookingDetailsCard(data: {
  appointments: Record<string, any>[];
  formattedDate: string;
  formattedTime: string;
  formattedTotal: string;
  notes?: string;
}) {
  const { appointments, formattedDate, formattedTime, notes } = data;
  const heading = appointments.length === 1 ? "— Booking Details" : `— Booking Details (${appointments.length} Services)`;
  return `
<tr><td style="padding:0 36px 20px;">
  <div style="background:#F0F4F5;border-radius:14px;padding:22px;">
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#4F7288;">${heading}</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      ${serviceRows(appointments)}
      <tr><td colspan="2" style="padding:0;"><hr style="border:none;border-top:1px solid #D8D4D0;margin:10px 0 4px;" /></td></tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Date</td>
        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#2D2D2D;text-align:right;">${formattedDate}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Time</td>
        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#2D2D2D;text-align:right;">${formattedTime}</td>
      </tr>
      ${notes ? `<tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;vertical-align:top;">Notes</td>
        <td style="padding:6px 0;font-size:13px;color:#2D2D2D;text-align:right;">${notes}</td>
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
    <p style="margin:0;font-size:13px;color:#6B6B6B;">📞 +234 812 973 9806 &nbsp;·&nbsp; Mon–Sat · 10:00 AM – 6:00 PM</p>
  </div>
</td></tr>`;
}

// ── Customer receipt email ─────────────────────────────────────────

function paidCustomerHtml(data: {
  appointments: Record<string, any>[];
  firstName: string;
  formattedDate: string;
  formattedTime: string;
  formattedTotal: string;
  reference?: string;
}) {
  const { appointments, firstName, formattedTotal, reference } = data;
  const primary = appointments[0]!;
  const isMulti = appointments.length > 1;
  const headingService = isMulti
    ? `${appointments.length} Services`
    : appointments[0]!.service_name;

  return emailWrapper(`
<tr><td style="padding:36px 36px 24px;">
  <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#8A6F88;">${BRAND_NAME}</p>
  <h1 style="margin:0;font-size:26px;font-weight:300;color:#2D2D2D;line-height:1.2;">Your Appointment is Confirmed ✓</h1>
  <p style="margin:8px 0 0;font-size:14px;color:#6B6B6B;">Hi ${firstName}, we're looking forward to seeing you for <strong>${headingService}</strong>!</p>
</td></tr>
${bookingDetailsCard({ ...data, notes: primary.notes })}
<tr><td style="padding:0 36px 20px;">
  <div style="border:2px solid #E8EAE8;border-radius:14px;padding:22px;">
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#47676A;">— Payment</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;width:40%;">Amount Paid</td>
        <td style="padding:6px 0;font-size:20px;font-weight:600;color:#47676A;text-align:right;">${formattedTotal}</td>
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

// ── Brand notification email ──────────────────────────────────────

function brandNotificationHtml(data: {
  appointments: Record<string, any>[];
  primary: Record<string, any>;
  formattedDate: string;
  formattedTime: string;
  formattedTotal: string;
  reference?: string;
}) {
  const { appointments, primary, formattedDate, formattedTime, formattedTotal, reference } = data;
  const isMulti = appointments.length > 1;
  const headingService = isMulti
    ? `${appointments.length} Services`
    : appointments[0]!.service_name;

  return emailWrapper(`
<tr><td style="padding:36px 36px 24px;">
  <p style="margin:0 0 6px;font-size:11px;font-weight:600;letter-spacing:0.15em;text-transform:uppercase;color:#8A6F88;">${BRAND_NAME}</p>
  <h1 style="margin:0;font-size:26px;font-weight:300;color:#2D2D2D;line-height:1.2;">New Paid Appointment ✓</h1>
  <p style="margin:8px 0 0;font-size:14px;color:#6B6B6B;">A booking for <strong>${headingService}</strong> was confirmed via online payment.</p>
</td></tr>
<tr><td style="padding:0 36px 20px;">
  <div style="background:#F5F3F1;border-radius:14px;padding:22px;">
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#8A6F88;">— Customer</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;width:40%;">Name</td>
        <td style="padding:6px 0;font-size:13px;font-weight:600;color:#2D2D2D;text-align:right;">${primary.customer_name}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Email</td>
        <td style="padding:6px 0;font-size:13px;text-align:right;"><a href="mailto:${primary.customer_email}" style="color:#4F7288;text-decoration:none;">${primary.customer_email}</a></td>
      </tr>
      ${primary.customer_phone ? `<tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Phone</td>
        <td style="padding:6px 0;font-size:13px;text-align:right;"><a href="tel:${primary.customer_phone}" style="color:#4F7288;text-decoration:none;">${primary.customer_phone}</a></td>
      </tr>` : ""}
    </table>
  </div>
</td></tr>
${bookingDetailsCard({ appointments, formattedDate, formattedTime, formattedTotal, notes: primary.notes })}
<tr><td style="padding:0 36px 20px;">
  <div style="border:2px solid #E8EAE8;border-radius:14px;padding:22px;">
    <p style="margin:0 0 14px;font-size:10px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#47676A;">— Payment</p>
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;width:40%;">Total Paid</td>
        <td style="padding:6px 0;font-size:20px;font-weight:600;color:#47676A;text-align:right;">${formattedTotal}</td>
      </tr>
      <tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Status</td>
        <td style="padding:6px 0;text-align:right;">
          <span style="display:inline-block;padding:3px 10px;border-radius:20px;background:#D4EDDA;color:#155724;font-size:11px;font-weight:700;">PAID</span>
        </td>
      </tr>
      ${reference ? `<tr>
        <td style="padding:6px 0;font-size:13px;color:#6B6B6B;">Reference</td>
        <td style="padding:6px 0;font-size:12px;font-family:monospace;color:#2D2D2D;text-align:right;">${reference}</td>
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
