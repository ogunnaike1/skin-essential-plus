import { createClient } from '@supabase/supabase-js';
import type { SupabaseClient } from '@supabase/supabase-js';

// Admin client with service role key - bypasses RLS policies
// This should ONLY be used in server-side code (API routes, server actions)

// Lazy initialization - only throw error when actually trying to use the client
let _supabaseAdmin: SupabaseClient | null = null;

function getAdminClient(): SupabaseClient {
  if (_supabaseAdmin) {
    return _supabaseAdmin;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing Supabase environment variables. Make sure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local'
    );
  }

  _supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  });

  return _supabaseAdmin;
}

// Export a proxy that only initializes when methods are called
export const supabaseAdmin = new Proxy({} as SupabaseClient, {
  get(_target, prop) {
    const client = getAdminClient();
    const value = (client as any)[prop];
    
    // If it's a function, bind it to the client
    if (typeof value === 'function') {
      return value.bind(client);
    }
    
    return value;
  }
});