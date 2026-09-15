import "server-only";
import { createClient } from "@supabase/supabase-js";

/** Service-role client. Never import this module from client components —
 * the "server-only" import throws a build error if that happens. */
export function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  return createClient(url, key, {
    auth: { persistSession: false },
  });
}
