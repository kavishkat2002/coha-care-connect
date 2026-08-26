import { createClient } from '@supabase/supabase-js';

// @ts-ignore
const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || "";
// @ts-ignore
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || "";

// Guard: detect missing environment variables at runtime and produce a
// meaningful error message instead of the cryptic "Failed to fetch"
// that occurs when the client silently points to a non-existent URL.
if (!supabaseUrl || !supabaseAnonKey) {
  console.error(
    "[MedDoc] Supabase environment variables are missing.\n" +
    "Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your Vercel " +
    "(or .env) environment, then redeploy."
  );
}

const SAFE_URL = supabaseUrl || "https://placeholder.supabase.co";
const SAFE_KEY = supabaseAnonKey || "placeholder-key";

export const supabase = createClient(SAFE_URL, SAFE_KEY);

// Secondary client specifically for Admin account provisioning to prevent auto-login
export const adminAuthClient = createClient(SAFE_URL, SAFE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
    storageKey: "admin-auth-token",
  },
});

/**
 * Returns true when Supabase env vars are properly configured.
 * Use this to show a user-facing error before attempting auth operations.
 */
export const isSupabaseConfigured = (): boolean =>
  Boolean(supabaseUrl && supabaseAnonKey);
