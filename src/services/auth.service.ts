/**
 * Placeholder auth service. Session is kept in localStorage so the portals are
 * navigable now; swap these calls for Supabase Auth without changing callers.
 */
import type { Role } from "@/data/mock";

export type Session = { name: string; email: string; role: Role };

const KEY = "coha.session";

export function getSession(): Session | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function signIn(email: string, role: Role, name?: string): Session {
  const session: Session = { email, role, name: name ?? (email.split("@")[0] ?? "Member") };
  window.localStorage.setItem(KEY, JSON.stringify(session));
  return session;
}

export function signOut() {
  window.localStorage.removeItem(KEY);
}

export const portalHome: Record<Role, string> = {
  patient: "/patient",
  doctor: "/doctor",
  hospital: "/hospital",
  admin: "/admin",
};
