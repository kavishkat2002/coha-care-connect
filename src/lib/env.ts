/**
 * Environment Variable Accessor
 *
 * Provides a typed, validated interface for all VITE_* environment variables.
 * Throws a descriptive error at access time if a required variable is missing,
 * rather than silently failing or producing cryptic API errors.
 *
 * @example
 *   import { env } from "@/lib/env";
 *   const key = env.GROQ_API_KEY; // throws if VITE_GROQ_API_KEY is not set
 */

// @ts-ignore — Vite injects import.meta.env at build time
const meta = import.meta.env;

function requireEnv(key: string): string {
  // @ts-ignore
  const value = meta[key] as string | undefined;
  if (!value) {
    throw new Error(
      `[env] Missing required environment variable: ${key}\n` +
        `Add it to your .env file (see .env.example for a template).`,
    );
  }
  return value;
}

function optionalEnv(key: string): string | undefined {
  // @ts-ignore
  return meta[key] as string | undefined;
}

export const env = {
  /** Supabase project URL */
  get SUPABASE_URL() {
    return requireEnv("VITE_SUPABASE_URL");
  },

  /** Supabase anonymous/public key */
  get SUPABASE_ANON_KEY() {
    return requireEnv("VITE_SUPABASE_ANON_KEY");
  },

  /** Groq API key — optional; AI features degrade gracefully when absent */
  get GROQ_API_KEY() {
    return optionalEnv("VITE_GROQ_API_KEY");
  },

  /** Returns true when running in development mode */
  get isDev() {
    return meta.DEV === true;
  },

  /** Returns true when running in production mode */
  get isProd() {
    return meta.PROD === true;
  },
} as const;
