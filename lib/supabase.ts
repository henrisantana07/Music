import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null as any;

// Helper functions for auth
export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session?.user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("user_id", session.user.id)
    .single();

  return { ...session.user, profile };
}

export async function signOut() {
  return await supabase.auth.signOut();
}
