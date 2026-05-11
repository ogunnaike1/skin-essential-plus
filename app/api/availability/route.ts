import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin-client";

// ── Defaults used when DB tables don't exist yet ─────────────────
const DEFAULT_OPEN_DAYS = new Set([1, 2, 3, 4, 5, 6]); // Mon–Sat
const DEFAULT_OPEN_TIME = "10:00";
const DEFAULT_CLOSE_TIME = "16:00";
const DEFAULT_SLOT_MINS = 120;
const DEFAULT_MAX_PER_SLOT = 4;

function toMins(t: string) {
  const [h, m] = t.split(":").map(Number);
  return (h ?? 0) * 60 + (m ?? 0);
}

function toTime(mins: number) {
  return `${String(Math.floor(mins / 60)).padStart(2, "0")}:${String(mins % 60).padStart(2, "0")}`;
}

function fmt12h(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = (h ?? 0) >= 12 ? "PM" : "AM";
  const h12 = (h ?? 0) % 12 || 12;
  return `${h12}:${String(m ?? 0).padStart(2, "0")} ${period}`;
}

function generateSlots(openTime: string, closeTime: string, durationMins: number) {
  const open = toMins(openTime);
  const close = toMins(closeTime);
  const slots = [];
  for (let cursor = open; cursor + durationMins <= close; cursor += durationMins) {
    const start = toTime(cursor);
    const end = toTime(cursor + durationMins);
    slots.push({ start, end, label: `${fmt12h(start)} – ${fmt12h(end)}` });
  }
  return slots;
}

export async function GET(req: NextRequest) {
  const date = req.nextUrl.searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "date required (YYYY-MM-DD)" }, { status: 400 });
  }

  try {
    const dayOfWeek = new Date(`${date}T12:00:00Z`).getUTCDay();

    // ── Business hours ────────────────────────────────────────────
    let isOpen = DEFAULT_OPEN_DAYS.has(dayOfWeek);
    let openTime = DEFAULT_OPEN_TIME;
    let closeTime = DEFAULT_CLOSE_TIME;

    const hoursRes = await supabaseAdmin
      .from("business_hours")
      .select("*")
      .eq("day_of_week", dayOfWeek)
      .single();

    if (!hoursRes.error && hoursRes.data) {
      isOpen = hoursRes.data.is_open;
      openTime = (hoursRes.data.open_time as string).substring(0, 5);
      closeTime = (hoursRes.data.close_time as string).substring(0, 5);
    } else if (hoursRes.error) {
      console.warn("business_hours query issue (using defaults):", hoursRes.error.message);
    }

    if (!isOpen) {
      return NextResponse.json({ isOpen: false, reason: "We are closed on this day.", slots: [] });
    }

    // ── Blocked dates ─────────────────────────────────────────────
    const blockedRes = await supabaseAdmin
      .from("blocked_dates")
      .select("*")
      .eq("date", date)
      .maybeSingle();

    if (!blockedRes.error && blockedRes.data) {
      return NextResponse.json({
        isOpen: false,
        reason: blockedRes.data.reason || "This date is unavailable.",
        slots: [],
      });
    }

    // ── Booking settings ──────────────────────────────────────────
    let durationMins = DEFAULT_SLOT_MINS;
    let maxPerSlot = DEFAULT_MAX_PER_SLOT;

    const settingsRes = await supabaseAdmin
      .from("booking_settings")
      .select("*")
      .eq("id", 1)
      .single();

    if (!settingsRes.error && settingsRes.data) {
      durationMins = settingsRes.data.slot_duration_minutes ?? DEFAULT_SLOT_MINS;
      maxPerSlot = settingsRes.data.max_per_slot ?? DEFAULT_MAX_PER_SLOT;
    }

    // ── Generate slots ────────────────────────────────────────────
    const rawSlots = generateSlots(openTime, closeTime, durationMins);

    // ── Count existing bookings per slot ──────────────────────────
    const { data: appts } = await supabaseAdmin
      .from("appointments")
      .select("start_time")
      .eq("appointment_date", date)
      .not("status", "eq", "cancelled");

    const countMap: Record<string, number> = {};
    for (const a of appts ?? []) {
      const key = (a.start_time as string).substring(0, 5);
      countMap[key] = (countMap[key] ?? 0) + 1;
    }

    const slots = rawSlots.map((s) => {
      const count = countMap[s.start] ?? 0;
      const full = count >= maxPerSlot;
      return { ...s, count, max: maxPerSlot, full, locked: false };
    });

    return NextResponse.json({ isOpen: true, slots });
  } catch (err) {
    console.error("Availability API error:", err);
    return NextResponse.json({ error: "Failed to load availability" }, { status: 500 });
  }
}
