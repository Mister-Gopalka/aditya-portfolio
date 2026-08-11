import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

/**
 * Public client. Ships in the browser bundle, so assume anyone can read
 * anything it can read. Row-level security is what actually limits it:
 * `site_settings` is public-read, and nothing else is reachable at all.
 */
export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

/**
 * Server-only client. Bypasses row-level security, so it must never be
 * imported into a client component — the key has no NEXT_PUBLIC_ prefix
 * precisely so that a slip like that fails loudly instead of leaking it.
 *
 * Every write to `site_settings`, and every read of `contact_submissions` or
 * `pageviews`, goes through this.
 */
export const supabaseAdmin =
  supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey, {
        auth: { persistSession: false, autoRefreshToken: false },
      })
    : null;

export async function getProjectVisibility(): Promise<Record<string, boolean>> {
  if (!supabase) return {};
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "project_visibility")
    .single();
  if (!data?.value) return {};
  try {
    return JSON.parse(data.value);
  } catch {
    return {};
  }
}

export async function setProjectVisibility(visibility: Record<string, boolean>) {
  if (!supabaseAdmin) throw new Error("SUPABASE_SERVICE_ROLE_KEY is not set");
  const { error } = await supabaseAdmin
    .from("site_settings")
    .upsert({ key: "project_visibility", value: JSON.stringify(visibility) });
  if (error) throw new Error(error.message);
}
