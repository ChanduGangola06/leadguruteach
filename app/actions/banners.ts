"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient, requireAdmin } from "@/lib/supabase/server";
import type { BannerInsert, BannerUpdate } from "@/lib/types/database";

export async function createBanner(data: BannerInsert) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("banners").insert(data);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard/admin/banners");
}

export async function updateBanner(id: string, data: BannerUpdate) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("banners").update(data).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard/admin/banners");
}

export async function deleteBanner(id: string) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("banners").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard/admin/banners");
}

export async function toggleBannerActiveAction(formData: FormData) {
  const id = formData.get("id") as string;
  const isActive = formData.get("is_active") === "true";
  await toggleBannerActive(id, isActive);
}

async function toggleBannerActive(id: string, isActive: boolean) {
  await updateBanner(id, { is_active: isActive });
}

export async function deleteBannerAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) await deleteBanner(id);
  redirect("/dashboard/admin/banners");
}

export async function uploadBannerImage(formData: FormData): Promise<string> {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("banners")
    .upload(fileName, file, { upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data: { publicUrl } } = supabase.storage
    .from("banners")
    .getPublicUrl(fileName);

  return publicUrl;
}
