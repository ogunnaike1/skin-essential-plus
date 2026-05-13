import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

export async function GET() {
  const { data, error } = await getClient()
    .from("blocked_dates")
    .select("*")
    .order("date");

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ dates: data }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const { date, reason } = await req.json();
  if (!date) return NextResponse.json({ error: "date required" }, { status: 400 });
  if (!DATE_RE.test(date) || isNaN(Date.parse(date))) {
    return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
  }

  const sanitizedReason = typeof reason === "string" ? reason.slice(0, 500) : null;

  const { data, error } = await getClient()
    .from("blocked_dates")
    .insert([{ date, reason: sanitizedReason }])
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ date: data }, { status: 201 });
}
