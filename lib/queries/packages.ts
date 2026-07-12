import { createServerSupabaseClient } from "@/lib/supabase/server";
import { dbPackageToBundleDetail, dbPackageToCoursePackage } from "@/lib/supabase/mappers";
import { coursePackages } from "@/lib/data";
import { bundleDetails, getBundleBySlug as getStaticBundle } from "@/lib/bundles";
import type { BundleDetail, CoursePackage } from "@/lib/types";
import type { DbPackage } from "@/lib/types/database";

export async function getActivePackages(): Promise<CoursePackage[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return coursePackages;

  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return coursePackages;
  return (data as DbPackage[]).map(dbPackageToCoursePackage);
}

export async function getAllPackagesAdmin(): Promise<DbPackage[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return data as DbPackage[];
}

export async function getPackageBySlug(slug: string): Promise<BundleDetail | undefined> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return getStaticBundle(slug);

  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (error || !data) return getStaticBundle(slug);
  return dbPackageToBundleDetail(data as DbPackage);
}

export async function getPackageByIdAdmin(id: string): Promise<DbPackage | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("packages")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as DbPackage;
}

export async function getAllBundleSlugs(): Promise<string[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return bundleDetails.map((b) => b.slug);

  const { data } = await supabase
    .from("packages")
    .select("slug")
    .eq("is_active", true);

  if (!data?.length) return bundleDetails.map((b) => b.slug);
  return data.map((p) => p.slug);
}
