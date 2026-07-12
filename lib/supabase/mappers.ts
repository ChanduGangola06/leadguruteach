import type { FeaturedCourse } from "@/lib/featuredCourses";
import type { BundleDetail, CoursePackage, Instructor, Testimonial } from "@/lib/types";
import type {
  DbBanner,
  DbFeaturedCourse,
  DbInstructor,
  DbPackage,
  DbTestimonial,
} from "@/lib/types/database";
import { certificateSteps } from "@/lib/bundles";

export function dbPackageToCoursePackage(pkg: DbPackage): CoursePackage {
  return {
    id: pkg.id,
    slug: pkg.slug,
    name: pkg.name,
    price: Number(pkg.price),
    originalPrice: Number(pkg.original_price),
    courses: pkg.courses_count,
    hours: pkg.hours,
    enrollments: pkg.enrollments,
    features: pkg.features ?? [],
    gradient: pkg.gradient,
    popular: pkg.popular,
    imageUrl: pkg.image_url || undefined,
  };
}

export function dbPackageToBundleDetail(pkg: DbPackage): BundleDetail {
  return {
    ...dbPackageToCoursePackage(pkg),
    slug: pkg.slug,
    tagline: pkg.tagline,
    description: pkg.description,
    specialization: pkg.specialization ?? [],
    journeyPoints: pkg.journey_points ?? [],
    bundleCourses: pkg.bundle_courses ?? [],
    lectures: pkg.lectures,
    includes: pkg.includes ?? [],
    certificateSteps: pkg.certificate_steps?.length
      ? pkg.certificate_steps
      : certificateSteps,
  };
}

export function bundleDetailToDbPackage(
  data: Partial<BundleDetail> & { slug: string; name: string }
): Omit<DbPackage, "id" | "created_at" | "updated_at"> {
  return {
    slug: data.slug,
    name: data.name,
    tagline: data.tagline ?? "",
    description: data.description ?? "",
    image_url: data.imageUrl ?? "",
    price: data.price ?? 0,
    original_price: data.originalPrice ?? 0,
    courses_count: data.courses ?? 0,
    hours: data.hours ?? 0,
    enrollments: data.enrollments ?? "0",
    lectures: data.lectures ?? 0,
    gradient: data.gradient ?? "from-purple-500/20 to-indigo-600/20",
    popular: data.popular ?? false,
    features: data.features ?? [],
    specialization: data.specialization ?? [],
    journey_points: data.journeyPoints ?? [],
    bundle_courses: data.bundleCourses ?? [],
    includes: data.includes ?? [],
    certificate_steps: data.certificateSteps ?? certificateSteps,
    is_active: true,
    sort_order: 0,
  };
}

export interface BannerSlide {
  id: string | number;
  src: string;
  alt: string;
  href: string;
}

export function dbBannerToSlide(banner: DbBanner): BannerSlide {
  return {
    id: banner.id,
    src: banner.image_url,
    alt: banner.title,
    href: banner.href,
  };
}

export function dbFeaturedCourseToFeaturedCourse(row: DbFeaturedCourse): FeaturedCourse {
  return {
    id: row.id,
    title: row.title,
    image: row.image_url,
    category: row.category,
    href: row.href,
  };
}

export function dbTestimonialToTestimonial(row: DbTestimonial): Testimonial {
  return {
    id: row.id,
    quote: row.quote,
    name: row.name,
    role: row.role,
    rating: row.rating,
  };
}

export function dbInstructorToInstructor(row: DbInstructor): Instructor {
  return {
    id: row.id,
    name: row.name,
    title: row.title,
    avatar: row.avatar || row.name.split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase(),
    imageUrl: row.image_url || undefined,
  };
}
