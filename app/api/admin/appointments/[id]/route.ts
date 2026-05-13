import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;

  if (!id) {
    return NextResponse.json({ error: "Appointment ID is required" }, { status: 400 });
  }

  try {
    const { error } = await getClient()
      .from("appointments")
      .delete()
      .eq("id", id);

    if (error) {
      console.error("Failed to delete appointment:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Delete appointment error:", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
