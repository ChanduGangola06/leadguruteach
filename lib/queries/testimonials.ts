import { createServerSupabaseClient } from "@/lib/supabase/server";
import { dbTestimonialToTestimonial } from "@/lib/supabase/mappers";
import { testimonials } from "@/lib/data";
import type { Testimonial } from "@/lib/types";
import type { DbTestimonial } from "@/lib/types/database";

export async function getActiveTestimonials(): Promise<Testimonial[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return testimonials;

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return testimonials;
  return (data as DbTestimonial[]).map(dbTestimonialToTestimonial);
}

export async function getAllTestimonialsAdmin(): Promise<DbTestimonial[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return data as DbTestimonial[];
}

export async function getTestimonialByIdAdmin(id: string): Promise<DbTestimonial | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as DbTestimonial;
}
