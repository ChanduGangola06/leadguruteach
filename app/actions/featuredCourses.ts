"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient, requireAdmin } from "@/lib/supabase/server";
import type { FeaturedCourseInsert, FeaturedCourseUpdate } from "@/lib/types/database";

export async function createFeaturedCourse(data: FeaturedCourseInsert) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("featured_courses").insert(data);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard/admin/featured-courses");
}

export async function updateFeaturedCourse(id: string, data: FeaturedCourseUpdate) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("featured_courses").update(data).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard/admin/featured-courses");
}

export async function deleteFeaturedCourse(id: string) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("featured_courses").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard/admin/featured-courses");
}

export async function toggleFeaturedCourseActiveAction(formData: FormData) {
  const id = formData.get("id") as string;
  const isActive = formData.get("is_active") === "true";
  await updateFeaturedCourse(id, { is_active: isActive });
}

export async function deleteFeaturedCourseAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) await deleteFeaturedCourse(id);
  redirect("/dashboard/admin/featured-courses");
}

export async function uploadMediaImage(formData: FormData): Promise<string> {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(fileName, file, { upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const { data: { publicUrl } } = supabase.storage.from("media").getPublicUrl(fileName);
  return publicUrl;
}
