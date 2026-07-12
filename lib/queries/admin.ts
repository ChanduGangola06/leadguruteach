import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function getAdminStats() {
  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      packages: 0,
      banners: 0,
      featuredCourses: 0,
      testimonials: 0,
      instructors: 0,
      activePackages: 0,
      activeBanners: 0,
      activeFeaturedCourses: 0,
      activeTestimonials: 0,
      activeInstructors: 0,
    };
  }

  const [packages, banners, featuredCourses, testimonials, instructors] = await Promise.all([
    supabase.from("packages").select("id, is_active"),
    supabase.from("banners").select("id, is_active"),
    supabase.from("featured_courses").select("id, is_active"),
    supabase.from("testimonials").select("id, is_active"),
    supabase.from("instructors").select("id, is_active"),
  ]);

  const countActive = (rows: { is_active: boolean }[] | null) =>
    (rows ?? []).filter((r) => r.is_active).length;

  const pkgData = packages.data ?? [];
  const bannerData = banners.data ?? [];
  const courseData = featuredCourses.data ?? [];
  const testimonialData = testimonials.data ?? [];
  const instructorData = instructors.data ?? [];

  return {
    packages: pkgData.length,
    banners: bannerData.length,
    featuredCourses: courseData.length,
    testimonials: testimonialData.length,
    instructors: instructorData.length,
    activePackages: countActive(pkgData),
    activeBanners: countActive(bannerData),
    activeFeaturedCourses: countActive(courseData),
    activeTestimonials: countActive(testimonialData),
    activeInstructors: countActive(instructorData),
  };
}
