import { createServerSupabaseClient } from "@/lib/supabase/server";
import { dbBannerToSlide } from "@/lib/supabase/mappers";
import type { BannerSlide } from "@/lib/supabase/mappers";
import type { DbBanner } from "@/lib/types/database";

const fallbackSlides: BannerSlide[] = [
  {
    id: 1,
    src: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1920&q=80",
    alt: "Learn from expert trainers at LeadGuruTeach",
    href: "/auth",
  },
  {
    id: 2,
    src: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1920&q=80",
    alt: "Join 2 Lakh+ students and grow your career",
    href: "#courses",
  },
  {
    id: 3,
    src: "https://images.unsplash.com/photo-1434030216441-b6ab76378458?w=1920&q=80",
    alt: "Master in-demand skills with live trainings",
    href: "/auth",
  },
  {
    id: 4,
    src: "https://images.unsplash.com/photo-1516321318423-f06f85b504e3?w=1920&q=80",
    alt: "Earn through our affiliate program",
    href: "#affiliate",
  },
];

export async function getActiveBanners(): Promise<BannerSlide[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return fallbackSlides;

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("is_active", true)
    .order("sort_order", { ascending: true });

  if (error || !data?.length) return fallbackSlides;
  return (data as DbBanner[]).map(dbBannerToSlide);
}

export async function getAllBannersAdmin(): Promise<DbBanner[]> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return [];

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return [];
  return data as DbBanner[];
}

export async function getBannerByIdAdmin(id: string): Promise<DbBanner | null> {
  const supabase = await createServerSupabaseClient();
  if (!supabase) return null;

  const { data, error } = await supabase
    .from("banners")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !data) return null;
  return data as DbBanner;
}

export { fallbackSlides };
