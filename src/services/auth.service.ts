import type { Role } from "@/data/mock";
import { supabase } from "@/lib/supabase";

export type Session = { name: string; email: string; role: Role };

// Helper to map Supabase User to our local Session type
const mapUserToSession = (user: any): Session | null => {
  if (!user) return null;
  return {
    email: user.email,
    role: (user.user_metadata?.role as Role) || "patient",
    name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Member",
  };
};

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  return mapUserToSession(data.session.user);
}

export async function signUp(email: string, password: string, role: Role, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        name,
      },
    },
  });
  if (error) throw error;
  return mapUserToSession(data.user);
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return mapUserToSession(data.user);
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  const { data } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(mapUserToSession(session?.user));
  });
  return data.subscription;
}

export const portalHome: Record<Role, string> = {
  patient: "/patient",
  doctor: "/doctor",
  hospital: "/hospital",
  admin: "/admin",
};
