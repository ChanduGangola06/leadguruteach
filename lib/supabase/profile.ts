import type { SupabaseClient, User } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { REF_COOKIE_NAME } from "@/lib/affiliate/constants";

function generateReferralCode(userId: string) {
  return userId.replace(/-/g, "").slice(0, 8).toUpperCase();
}

/** New users are always student. Promote to admin only via SQL: UPDATE profiles SET role = 'admin' */
export async function ensureUserProfile(
  supabase: SupabaseClient,
  user: User
): Promise<{ role: "student" | "admin" }> {
  const email = user.email ?? "";
  const fullName = (user.user_metadata?.full_name as string) ?? "";
  const referralCode = generateReferralCode(user.id);

  let referredBy: string | null = null;
  try {
    const cookieStore = await cookies();
    const refCode = cookieStore.get(REF_COOKIE_NAME)?.value?.trim().toUpperCase();
    if (refCode) {
      const { data: referrer } = await supabase
        .from("profiles")
        .select("id")
        .eq("referral_code", refCode)
        .neq("id", user.id)
        .maybeSingle();
      if (referrer) referredBy = referrer.id;
    }
  } catch {
    // cookies() may fail outside a request context
  }

  const { data: existing } = await supabase
    .from("profiles")
    .select("id, role, referral_code, referred_by")
    .eq("id", user.id)
    .maybeSingle();

  if (!existing) {
    await supabase.from("profiles").insert({
      id: user.id,
      email,
      full_name: fullName,
      role: "student",
      referral_code: referralCode,
      referred_by: referredBy,
    });
    return { role: "student" };
  }

  const updates: Record<string, string | null> = {};
  if (!existing.referral_code) updates.referral_code = referralCode;
  if (!existing.referred_by && referredBy) updates.referred_by = referredBy;
  if (Object.keys(updates).length) {
    await supabase.from("profiles").update(updates).eq("id", user.id);
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

export async function getReferralCodeFromCookies(): Promise<string | null> {
  try {
    const cookieStore = await cookies();
    return cookieStore.get(REF_COOKIE_NAME)?.value?.trim().toUpperCase() ?? null;
  } catch {
    return null;
  }
}
