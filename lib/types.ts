export interface CoursePackage {
  id: string;
  slug?: string;
  name: string;
  price: number;
  originalPrice: number;
  courses: number;
  hours: number;
  enrollments: string;
  features: string[];
  gradient: string;
  popular?: boolean;
  imageUrl?: string;
}

export interface BundleCourse {
  title: string;
  description?: string;
}

export interface BundleDetail extends CoursePackage {
  slug: string;
  tagline: string;
  description: string;
  specialization: string[];
  journeyPoints: { title: string; description: string }[];
  bundleCourses: BundleCourse[];
  lectures: number;
  includes: string[];
  certificateSteps: string[];
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  avatar: string;
  imageUrl?: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  name: string;
  role: string;
  rating: number;
}

export interface ProcessStep {
  id: string;
  title: string;
  description: string;
  lottieUrl: string;
}

export interface DashboardCourse {
  id: string;
  title: string;
  progress: number;
  totalLessons: number;
  completedLessons: number;
  gradient: string;
  description?: string;
  packageName?: string;
  packageSlug?: string;
}

export interface EnrolledPackage {
  id: string;
  packageId: string;
  slug: string;
  name: string;
  gradient: string;
  price: number;
  coursesCount: number;
  hours: number;
  purchasedAt: string;
  courses: BundleCourse[];
}

export interface ChartDataPoint {
  day: string;
  earnings: number;
}

export interface FAQ {
  question: string;
  answer: string;
}
