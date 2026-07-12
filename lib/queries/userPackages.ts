import { createServerSupabaseClient } from "@/lib/supabase/server";
import { dbPackageToCoursePackage } from "@/lib/supabase/mappers";
import type { CoursePackage, DashboardCourse, EnrolledPackage } from "@/lib/types";
import type { DbPackage, DbUserPackage } from "@/lib/types/database";

const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function isUuid(value: string) {
  return UUID_RE.test(value);
}

function mapEnrolledPackage(row: DbUserPackage, pkg: DbPackage): EnrolledPackage {
  const courses = pkg.bundle_courses ?? [];

  return {
    id: row.id,
    packageId: pkg.id,
    slug: pkg.slug,
    name: pkg.name,
    gradient: pkg.gradient,
    price: Number(pkg.price),
    coursesCount: pkg.courses_count,
    hours: pkg.hours,
    purchasedAt: row.purchased_at,
    courses,
  };
}

export async function getUserEnrolledPackages(userId: string): Promise<EnrolledPackage[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data: purchases, error } = await supabase
    .from("user_packages")
    .select("*")
    .eq("user_id", userId)
    .eq("status", "active")
    .order("purchased_at", { ascending: false });

  if (error || !purchases?.length) return [];

  const packageIds = purchases.map((p) => p.package_id);
  const { data: packages } = await supabase
    .from("packages")
    .select("*")
    .in("id", packageIds);

  if (!packages?.length) return [];

  const packageMap = new Map((packages as DbPackage[]).map((p) => [p.id, p]));

  return (purchases as DbUserPackage[])
    .map((row) => {
      const pkg = packageMap.get(row.package_id);
      if (!pkg) return null;
      return mapEnrolledPackage(row, pkg);
    })
    .filter((item): item is EnrolledPackage => item !== null);
}

export function enrolledPackagesToCourses(enrollments: EnrolledPackage[]): DashboardCourse[] {
  const courses: DashboardCourse[] = [];

  for (const enrollment of enrollments) {
    const lessonsPerCourse = Math.max(
      1,
      Math.floor(
        (enrollment.coursesCount || enrollment.courses.length || 1) /
          Math.max(enrollment.courses.length, 1)
      )
    );

    enrollment.courses.forEach((course, index) => {
      courses.push({
        id: `${enrollment.packageId}-${index}`,
        title: course.title,
        description: course.description,
        packageName: enrollment.name,
        packageSlug: enrollment.slug,
        progress: 0,
        totalLessons: lessonsPerCourse,
        completedLessons: 0,
        gradient: enrollment.gradient,
      });
    });
  }

  return courses;
}

export async function getUserCourses(userId: string): Promise<DashboardCourse[]> {
  const enrollments = await getUserEnrolledPackages(userId);
  return enrolledPackagesToCourses(enrollments);
}

export async function getAvailablePackagesForUser(userId: string): Promise<CoursePackage[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data: purchases } = await supabase
    .from("user_packages")
    .select("package_id")
    .eq("user_id", userId)
    .eq("status", "active");

  const ownedIds = new Set((purchases ?? []).map((p) => p.package_id));

  const { data: packages, error } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !packages?.length) return [];

  return (packages as DbPackage[])
    .filter((pkg) => !ownedIds.has(pkg.id))
    .map(dbPackageToCoursePackage);
}

export async function userOwnsPackage(userId: string, packageId: string): Promise<boolean> {
  if (!isUuid(packageId)) return false;

  const supabase = await createServerSupabaseClient();
  if (!supabase) return false;

  const { data } = await supabase
    .from("user_packages")
    .select("id")
    .eq("user_id", userId)
    .eq("package_id", packageId)
    .eq("status", "active")
    .maybeSingle();

  return Boolean(data);
}

export async function userOwnsPackageBySlug(userId: string, slug: string): Promise<boolean> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return false;

  const { data: pkg } = await supabase
    .from("packages")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  if (!pkg) return false;
  return userOwnsPackage(userId, pkg.id);
}

export async function getPackageIdBySlug(slug: string): Promise<string | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data } = await supabase
    .from("packages")
    .select("id")
    .eq("slug", slug)
    .eq("is_active", true)
    .maybeSingle();

  return data?.id ?? null;
}
