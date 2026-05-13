import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";

export async function GET() {
  const { data, error } = await supabaseAdmin
    .from("blocked_dates")
    .select("*")
    .order("date");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dates: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const { date, reason } = await req.json();
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("blocked_dates")
    .insert([{ date, reason: reason || null }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ date: data }, { status: 201 });
}
