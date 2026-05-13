import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;

export async function GET() {
  const { data, error } = await getClient()
    .from("business_hours")
    .select("*")
    .order("day_of_week");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ hours: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { hours } = body as { hours: Array<{ day_of_week: number; is_open: boolean; open_time: string; close_time: string }> };

  if (!Array.isArray(hours) || hours.length === 0) {
    return NextResponse.json({ error: "hours array required" }, { status: 400 });
  }

  for (const h of hours) {
    if (typeof h.day_of_week !== "number" || h.day_of_week < 0 || h.day_of_week > 6) {
      return NextResponse.json({ error: "day_of_week must be 0–6" }, { status: 400 });
    }
    if (typeof h.is_open !== "boolean") {
      return NextResponse.json({ error: "is_open must be boolean" }, { status: 400 });
    }
    if (!TIME_RE.test(h.open_time) || !TIME_RE.test(h.close_time)) {
      return NextResponse.json({ error: "times must be HH:MM (24-hour)" }, { status: 400 });
    }

    const { error } = await getClient()
      .from("business_hours")
      .update({ is_open: h.is_open, open_time: h.open_time, close_time: h.close_time })
      .eq("day_of_week", h.day_of_week);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
