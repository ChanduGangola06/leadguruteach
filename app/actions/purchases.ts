"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPackageBySlug } from "@/lib/queries/packages";
import { userOwnsPackage } from "@/lib/queries/userPackages";
import { COMMISSION_PERCENT, REF_COOKIE_NAME } from "@/lib/affiliate/constants";

async function resolveReferrerId(
  supabase: NonNullable<Awaited<ReturnType<typeof createServerSupabaseClient>>>,
  buyerId: string
): Promise<string | null> {
  const { data: buyerProfile } = await supabase
    .from("profiles")
    .select("referred_by")
    .eq("id", buyerId)
    .maybeSingle();

  if (buyerProfile?.referred_by && buyerProfile.referred_by !== buyerId) {
    return buyerProfile.referred_by as string;
  }

  try {
    const cookieStore = await cookies();
    const refCode = cookieStore.get(REF_COOKIE_NAME)?.value?.trim().toUpperCase();
    if (!refCode) return null;

    const { data: referrer } = await supabase
      .from("profiles")
      .select("id")
      .eq("referral_code", refCode)
      .neq("id", buyerId)
      .maybeSingle();

    return referrer?.id ?? null;
  } catch {
    return null;
  }
}

export async function purchasePackageAction(packageSlug: string) {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return { error: "Unable to complete purchase. Please try again later." };
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/login?next=/checkout/${packageSlug}`);
  }

  const bundle = await getPackageBySlug(packageSlug);
  if (!bundle?.id) {
    return { error: "Package not found." };
  }

  const UUID_RE =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  if (!UUID_RE.test(bundle.id)) {
    return {
      error:
        "Packages must be loaded from Supabase to purchase. Run supabase/schema.sql and seed packages in your project.",
    };
  }

  const alreadyOwned = await userOwnsPackage(user.id, bundle.id);
  if (alreadyOwned) {
    redirect("/dashboard/courses?owned=1");
  }

  const referrerId = await resolveReferrerId(supabase, user.id);

  const { data: purchase, error } = await supabase
    .from("user_packages")
    .insert({
      user_id: user.id,
      package_id: bundle.id,
      referrer_id: referrerId,
      status: "active",
      amount_paid: bundle.price,
    })
    .select("id")
    .single();

  if (error) {
    if (error.code === "23505") {
      redirect("/dashboard/courses?owned=1");
    }
    return { error: "Unable to complete purchase. Please try again." };
  }

  if (referrerId && purchase?.id) {
    const commissionAmount =
      Math.round(((bundle.price * COMMISSION_PERCENT) / 100) * 100) / 100;

    await supabase.from("affiliate_commissions").insert({
      affiliate_id: referrerId,
      buyer_id: user.id,
      package_id: bundle.id,
      user_package_id: purchase.id,
      package_name: bundle.name,
      package_price: bundle.price,
      commission_percent: COMMISSION_PERCENT,
      commission_amount: commissionAmount,
      status: "credited",
    });

    // Persist referral on buyer if missing
    await supabase
      .from("profiles")
      .update({ referred_by: referrerId })
      .eq("id", user.id)
      .is("referred_by", null);
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/courses");
  revalidatePath("/dashboard/affiliate");
  revalidatePath("/dashboard/earnings");
  revalidatePath("/dashboard/admin/leads");
  revalidatePath(`/checkout/${packageSlug}`);
  revalidatePath(`/bundle/${packageSlug}`);

  redirect("/dashboard/courses?purchased=1");
}
