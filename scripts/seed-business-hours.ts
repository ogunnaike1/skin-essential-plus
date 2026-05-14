import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

// 0 = Sun, 1 = Mon, ..., 6 = Sat
const BUSINESS_HOURS = [
  { day_of_week: 0, is_open: false, open_time: "10:00:00", close_time: "18:00:00" }, // Sun
  { day_of_week: 1, is_open: true,  open_time: "10:00:00", close_time: "18:00:00" }, // Mon
  { day_of_week: 2, is_open: true,  open_time: "10:00:00", close_time: "18:00:00" }, // Tue
  { day_of_week: 3, is_open: true,  open_time: "10:00:00", close_time: "18:00:00" }, // Wed
  { day_of_week: 4, is_open: true,  open_time: "10:00:00", close_time: "18:00:00" }, // Thu
  { day_of_week: 5, is_open: true,  open_time: "10:00:00", close_time: "18:00:00" }, // Fri
  { day_of_week: 6, is_open: true,  open_time: "10:00:00", close_time: "18:00:00" }, // Sat
];

const BOOKING_SETTINGS = {
  id: 1,
  slot_duration_minutes: 120, // 2-hour slots → 4 slots per day (10-12, 12-2, 2-4, 4-6)
  max_per_slot: 4,
};

async function run() {
  console.log("Seeding business hours...");

  const { error: hoursError } = await supabase
    .from("business_hours")
    .upsert(BUSINESS_HOURS, { onConflict: "day_of_week" });

  if (hoursError) {
    console.error("Failed to upsert business_hours:", hoursError.message);
  } else {
    console.log("business_hours updated — Mon–Sat: 10:00 AM to 6:00 PM (4 slots/day)");
  }

  console.log("Seeding booking settings...");

  const { error: settingsError } = await supabase
    .from("booking_settings")
    .upsert(BOOKING_SETTINGS, { onConflict: "id" });

  if (settingsError) {
    console.error("Failed to upsert booking_settings:", settingsError.message);
  } else {
    console.log("booking_settings updated — 120 min slots, 4 spots per slot");
  }

  console.log("Done.");
}

run();
