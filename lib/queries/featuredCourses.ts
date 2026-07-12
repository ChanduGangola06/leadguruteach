import { createServerSupabaseClient } from "@/lib/supabase/server";
import { dbFeaturedCourseToFeaturedCourse } from "@/lib/supabase/mappers";
import { featuredCourses } from "@/lib/featuredCourses";
import type { FeaturedCourse } from "@/lib/featuredCourses";
import type { DbFeaturedCourse } from "@/lib/types/database";

export async function getActiveFeaturedCourses(): Promise<FeaturedCourse[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return featuredCourses;

  const { data, error } = await supabase
    .from("featured_courses")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return featuredCourses;
  return (data as DbFeaturedCourse[]).map(dbFeaturedCourseToFeaturedCourse);
}

export async function getAllFeaturedCoursesAdmin(): Promise<DbFeaturedCourse[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("featured_courses")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return data as DbFeaturedCourse[];
}

export async function getFeaturedCourseByIdAdmin(id: string): Promise<DbFeaturedCourse | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("featured_courses")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as DbFeaturedCourse;
}
