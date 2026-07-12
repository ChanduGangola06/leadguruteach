import { createBrowserClient } from "@supabase/ssr";

const PLACEHOLDER_KEYS = [
  "your-anon-key-here",
  "your_anon_key",
  "paste-your-anon-key",
];

/** Accepts legacy JWT anon keys (eyJ...) and new publishable keys (sb_publishable_...) */
export function isValidSupabaseAnonKey(key: string | undefined): boolean {
  if (!key?.trim()) return false;
  const trimmed = key.trim();
  if (PLACEHOLDER_KEYS.includes(trimmed.toLowerCase())) return false;
  if (trimmed.startsWith("sb_publishable_") && trimmed.length > 24) return true;
  if (trimmed.startsWith("eyJ") && trimmed.length > 100) return true;
  return false;
}

export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (!url || !key) return false;
  if (!url.includes("supabase.co") || url.includes("your-project")) return false;
  return isValidSupabaseAnonKey(key);
}

export function getSupabaseConfigError(): string | null {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();

  if (!url || url.includes("your-project")) {
    return "Set NEXT_PUBLIC_SUPABASE_URL in .env.local (from Supabase → Settings → API).";
  }
  if (!key || !isValidSupabaseAnonKey(key)) {
    return "Set NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local — copy the anon / publishable key from Supabase → Settings → API.";
  }
  return null;
}

export function createClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!.trim();
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!.trim();

  if (!isValidSupabaseAnonKey(key)) {
    throw new Error("Invalid Supabase configuration");
  }

  return createBrowserClient(url, key);
}
