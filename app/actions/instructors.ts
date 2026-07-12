"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient, requireAdmin } from "@/lib/supabase/server";
import type { InstructorInsert, InstructorUpdate } from "@/lib/types/database";

export async function createInstructor(data: InstructorInsert) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("instructors").insert(data);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard/admin/instructors");
}

export async function updateInstructor(id: string, data: InstructorUpdate) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("instructors").update(data).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard/admin/instructors");
}

export async function deleteInstructor(id: string) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("instructors").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard/admin/instructors");
}

export async function toggleInstructorActiveAction(formData: FormData) {
  const id = formData.get("id") as string;
  const isActive = formData.get("is_active") === "true";
  await updateInstructor(id, { is_active: isActive });
}

export async function deleteInstructorAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) await deleteInstructor(id);
  redirect("/dashboard/admin/instructors");
}

export async function uploadInstructorImage(formData: FormData): Promise<string> {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const file = formData.get("file") as File;
  if (!file) throw new Error("No file provided");

  const ext = file.name.split(".").pop() ?? "jpg";
  const fileName = `instructors/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("media")
    .upload(fileName, file, { upsert: false });

  if (uploadError) throw new Error(uploadError.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("media").getPublicUrl(fileName);

  return publicUrl;
}
