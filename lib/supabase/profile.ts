import type { SupabaseClient, User } from "@supabase/supabase-js";

/** New users are always student. Promote to admin only via SQL: UPDATE profiles SET role = 'admin' */
export async function ensureUserProfile(
  supabase: SupabaseClient,
  user: User
): Promise<{ role: "student" | "admin" }> {
  const email = user.email ?? "";
  const fullName = (user.user_metadata?.full_name as string) ?? "";

  const { data: existing } = await supabase
    .from("profiles")
    .select("id, role")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("profiles").insert({
      id: user.id,
      email,
      full_name: fullName,
      role: "student",
    });
    return { role: "student" };
  }

  return { role: (existing.role as "student" | "admin") ?? "student" };
}

export async function resolvePostAuthRedirect(
  supabase: SupabaseClient,
  userId: string
): Promise<string> {
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", userId)
    .maybeSingle();

  return profile?.role === "admin" ? "/dashboard/admin" : "/dashboard";
}
