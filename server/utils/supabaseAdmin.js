import { createClient } from "@supabase/supabase-js";

let client;

export const supabaseAdmin = () => {
  if (!client) {
    client = createClient(
      process.env.VITE_SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { autoRefreshToken: false, persistSession: false } }
    );
  }
  return client;
};
