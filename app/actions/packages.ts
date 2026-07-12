"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient, requireAdmin } from "@/lib/supabase/server";
import type { PackageInsert, PackageUpdate } from "@/lib/types/database";

export async function createPackage(data: PackageInsert) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("packages").insert(data);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/#courses");
  revalidatePath("/dashboard/admin/packages");
  revalidatePath(`/bundle/${data.slug}`);
}

export async function updatePackage(id: string, data: PackageUpdate) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("packages").update(data).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/#courses");
  revalidatePath("/dashboard/admin/packages");
  if (data.slug) revalidatePath(`/bundle/${data.slug}`);
}

export async function deletePackage(id: string) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard/admin/packages");
}

async function togglePackageActive(id: string, isActive: boolean) {
  await updatePackage(id, { is_active: isActive });
}

export async function togglePackageActiveAction(formData: FormData) {
  const id = formData.get("id") as string;
  const isActive = formData.get("is_active") === "true";
  await togglePackageActive(id, isActive);
}

export async function deletePackageAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) await deletePackage(id);
  redirect("/dashboard/admin/packages");
}

export async function uploadPackageImage(formData: FormData): Promise<string> {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `packages/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(fileName, file, { upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(fileName);

  return publicUrl;
}
