"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { getPackageBySlug } from "@/lib/queries/packages";
import { userOwnsPackage } from "@/lib/queries/userPackages";

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

  const { error } = await supabase.from("user_packages").insert({
    user_id: user.id,
    package_id: bundle.id,
    status: "active",
    amount_paid: bundle.price,
  });

  if (error) {
    if (error.code === "23505") {
      redirect("/dashboard/courses?owned=1");
    }
    return { error: "Unable to complete purchase. Please try again." };
  }

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/courses");
  revalidatePath(`/checkout/${packageSlug}`);
  revalidatePath(`/bundle/${packageSlug}`);

  redirect("/dashboard/courses?purchased=1");
}
