import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("business_hours")
    .select("*")
    .order("day_of_week");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ hours: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function PUT(req: NextRequest) {
  const body = await req.json();
  const { hours } = body as { hours: Array<{ day_of_week: number; is_open: boolean; open_time: string; close_time: string }> };

  if (!Array.isArray(hours)) {
    return NextResponse.json({ error: "hours array required" }, { status: 400 });
  }

  for (const h of hours) {
    const { error } = await supabaseAdmin
      .from("business_hours")
      .update({ is_open: h.is_open, open_time: h.open_time, close_time: h.close_time })
      .eq("day_of_week", h.day_of_week);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
