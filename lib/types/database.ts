export interface JourneyPoint {
  title: string;
  description: string;
}

export interface DbPackage {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  image_url: string;
  price: number;
  original_price: number;
  courses_count: number;
  hours: number;
  enrollments: string;
  lectures: number;
  gradient: string;
  popular: boolean;
  features: string[];
  specialization: string[];
  journey_points: JourneyPoint[];
  bundle_courses: { title: string; description?: string }[];
  includes: string[];
  certificate_steps: string[];
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface DbBanner {
  id: string;
  title: string;
  image_url: string;
  href: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbFeaturedCourse {
  id: string;
  title: string;
  image_url: string;
  category: string;
  href: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbTestimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbInstructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  image_url: string;
  sort_order: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface DbProfile {
  id: string;
  email: string;
  full_name: string | null;
  role: "student" | "admin";
  created_at: string;
  updated_at: string;
}

export interface DbUserPackage {
  id: string;
  user_id: string;
  package_id: string;
  purchased_at: string;
  status: "active" | "refunded" | "cancelled";
  amount_paid: number | null;
}

export interface DbAuditLog {
  id: string;
  event_type: string;
  event_category: "auth" | "api" | "button";
  success: boolean;
  user_id: string | null;
  email: string | null;
  api_endpoint: string | null;
  api_method: string | null;
  button_label: string | null;
  page_path: string | null;
  error_code: string | null;
  error_message: string | null;
  user_agent: string | null;
  ip_address: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
}

export type AuditLogInsert = Omit<DbAuditLog, "id" | "created_at">;

export type PackageInsert = Omit<DbPackage, "id" | "created_at" | "updated_at">;
export type PackageUpdate = Partial<PackageInsert>;
export type BannerInsert = Omit<DbBanner, "id" | "created_at" | "updated_at">;
export type BannerUpdate = Partial<BannerInsert>;
export type FeaturedCourseInsert = Omit<DbFeaturedCourse, "id" | "created_at" | "updated_at">;
export type FeaturedCourseUpdate = Partial<FeaturedCourseInsert>;
export type TestimonialInsert = Omit<DbTestimonial, "id" | "created_at" | "updated_at">;
export type TestimonialUpdate = Partial<TestimonialInsert>;
export type InstructorInsert = Omit<DbInstructor, "id" | "created_at" | "updated_at">;
export type InstructorUpdate = Partial<InstructorInsert>;
export type ProfileUpdate = Partial<Omit<DbProfile, "id" | "created_at" | "updated_at">>;
export type UserPackageInsert = Omit<DbUserPackage, "id" | "purchased_at"> & {
  id?: string;
  purchased_at?: string;
};

export type Database = {
  public: {
    Tables: {
      packages: {
        Row: DbPackage;
        Insert: PackageInsert & { id?: string };
        Update: PackageUpdate;
        Relationships: [];
      };
      banners: {
        Row: DbBanner;
        Insert: BannerInsert & { id?: string };
        Update: BannerUpdate;
        Relationships: [];
      };
      featured_courses: {
        Row: DbFeaturedCourse;
        Insert: FeaturedCourseInsert & { id?: string };
        Update: FeaturedCourseUpdate;
        Relationships: [];
      };
      testimonials: {
        Row: DbTestimonial;
        Insert: TestimonialInsert & { id?: string };
        Update: TestimonialUpdate;
        Relationships: [];
      };
      instructors: {
        Row: DbInstructor;
        Insert: InstructorInsert & { id?: string };
        Update: InstructorUpdate;
        Relationships: [];
      };
      profiles: {
        Row: DbProfile;
        Insert: Omit<DbProfile, "created_at" | "updated_at">;
        Update: ProfileUpdate;
        Relationships: [];
      };
      user_packages: {
        Row: DbUserPackage;
        Insert: UserPackageInsert;
        Update: Partial<UserPackageInsert>;
        Relationships: [];
      };
      audit_logs: {
        Row: DbAuditLog;
        Insert: AuditLogInsert & { id?: string };
        Update: Partial<AuditLogInsert>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
