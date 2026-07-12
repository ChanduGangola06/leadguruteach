import { createServerSupabaseClient } from "@/lib/supabase/server";
import { dbInstructorToInstructor } from "@/lib/supabase/mappers";
import { instructors } from "@/lib/data";
import type { Instructor } from "@/lib/types";
import type { DbInstructor } from "@/lib/types/database";

export async function getActiveInstructors(): Promise<Instructor[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return instructors;

  const { data, error } = await supabase
    .from("instructors")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return instructors;
  return (data as DbInstructor[]).map(dbInstructorToInstructor);
}

export async function getAllInstructorsAdmin(): Promise<DbInstructor[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("instructors")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return data as DbInstructor[];
}

export async function getInstructorByIdAdmin(id: string): Promise<DbInstructor | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("instructors")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as DbInstructor;
}
