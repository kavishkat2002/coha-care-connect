import type { Role } from "@/data/mock";
import { supabase, adminAuthClient } from "@/lib/supabase";

export type Session = { id: string; name: string; email: string; role: Role; registration_id?: string };

// Helper to map Supabase User to our local Session type
const mapUserToSession = (user: any): Session | null => {
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    role: (user.user_metadata?.role as Role) || "patient",
    name: user.user_metadata?.name || user.user_metadata?.full_name || user.email?.split("@")[0] || "Member",
    registration_id: user.user_metadata?.registration_id,
  };
};

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession();
  if (error || !data.session) return null;
  return mapUserToSession(data.session.user);
}

const generateRegId = (role: Role) => {
  if (role === "doctor") {
    return `DOC-${Math.floor(Math.random() * 900000) + 100000}`;
  }
  if (role === "patient") {
    return `PAT-${Math.floor(Math.random() * 900000) + 100000}`;
  }
  return undefined;
};

export async function signUp(email: string, password: string, role: Role, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        name,
        registration_id: generateRegId(role),
      },
    },
  });
  if (error) throw error;
  return mapUserToSession(data.user);
}

export async function adminCreateAccount(email: string, password: string, role: Role, name: string) {
  // Save current active session to prevent hijacking
  const { data: currentSessionData } = await supabase.auth.getSession();

  // Use the secondary client to prevent logging the Admin out!
  const { data, error } = await adminAuthClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        role,
        name,
        registration_id: generateRegId(role),
      },
    },
  });
  
  if (error) throw error;
  
  // Note: Since email confirmations might be turned off, Supabase might auto-login this secondary client.
  // Because it has persistSession: false, it just sits in memory. To be extra safe, we sign it out immediately.
  await adminAuthClient.auth.signOut();
  
  // Defensively restore the original main session just in case the Supabase client broadcasted a sign-in event
  if (currentSessionData.session) {
    await supabase.auth.setSession({
      access_token: currentSessionData.session.access_token,
      refresh_token: currentSessionData.session.refresh_token,
    });
  }
  
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
