import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";

export async function GET() {
  try {
    const { data, error } = await supabaseAdmin
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: false })
      .order("start_time", { ascending: false });

    if (error) {
      console.error("Failed to fetch appointments:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ appointments: data });
  } catch (err) {
    console.error("Admin appointments route error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { id, updates } = await request.json();

    if (!id || !updates) {
      return NextResponse.json({ error: "id and updates are required" }, { status: 400 });
    }

    const { data, error } = await supabaseAdmin
      .from("appointments")
      .update(updates)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Failed to update appointment:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ appointment: data });
  } catch (err) {
    console.error("Admin appointments PATCH error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
