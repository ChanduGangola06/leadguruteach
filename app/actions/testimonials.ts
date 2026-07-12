"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createServerSupabaseClient, requireAdmin } from "@/lib/supabase/server";
import type { TestimonialInsert, TestimonialUpdate } from "@/lib/types/database";

export async function createTestimonial(data: TestimonialInsert) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("testimonials").insert(data);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard/admin/testimonials");
}

export async function updateTestimonial(id: string, data: TestimonialUpdate) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("testimonials").update(data).eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard/admin/testimonials");
}

export async function deleteTestimonial(id: string) {
  await requireAdmin();
  const supabase = await createServerSupabaseClient();
  if (!supabase) throw new Error("Supabase not configured");

  const { error } = await supabase.from("testimonials").delete().eq("id", id);
  if (error) throw new Error(error.message);

  revalidatePath("/");
  revalidatePath("/dashboard/admin/testimonials");
}

export async function toggleTestimonialActiveAction(formData: FormData) {
  const id = formData.get("id") as string;
  const isActive = formData.get("is_active") === "true";
  await updateTestimonial(id, { is_active: isActive });
}

export async function deleteTestimonialAction(formData: FormData) {
  const id = formData.get("id") as string;
  if (id) await deleteTestimonial(id);
  redirect("/dashboard/admin/testimonials");
}
