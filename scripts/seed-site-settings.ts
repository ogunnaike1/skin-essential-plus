import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

const DEFAULT_SETTINGS = {
  general: {
    storeName: "Skin Essential Plus",
    tagline: "Where Science Meets Serenity",
    email: "skinessentialsp@gmail.com",
    phone: "+234 814 830 3684",
    address: "No 2, Alaafia Avenue, Opposite IDC Primary School",
    city: "Ibadan",
    state: "Oyo",
    postalCode: "",
    country: "Nigeria",
  },
  social: {
    instagram: "",
    facebook: "",
    twitter: "",
    website: "https://skinessentialplus.com",
  },
  notifications: {
    emailOnNewOrder: true,
    emailOnLowStock: true,
    emailOnNewCustomer: false,
    emailOnNewReview: false,
  },
};

async function run() {
  console.log("Creating site_settings table row...");

  const { error } = await supabase
    .from("site_settings")
    .upsert({ id: 1, data: DEFAULT_SETTINGS, updated_at: new Date().toISOString() }, { onConflict: "id" });

  if (error) {
    console.error("Failed:", error.message);
    console.log("\nIf the table doesn't exist yet, run this SQL in your Supabase SQL editor:\n");
    console.log(`CREATE TABLE IF NOT EXISTS site_settings (
  id      integer PRIMARY KEY DEFAULT 1,
  data    jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz DEFAULT now()
);`);
  } else {
    console.log("site_settings seeded successfully.");
  }
}

run();
