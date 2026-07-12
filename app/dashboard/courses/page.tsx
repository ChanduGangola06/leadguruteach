import MyCoursesView from "@/components/dashboard/MyCoursesView";
import {
  getAvailablePackagesForUser,
  getUserCourses,
  getUserEnrolledPackages,
} from "@/lib/queries/userPackages";
import { getProfile } from "@/lib/supabase/server";

interface PageProps {
  searchParams: Promise<{ purchased?: string; owned?: string }>;
}

export default async function CoursesPage({ searchParams }: PageProps) {
  const profile = await getProfile();
  const params = await searchParams;

  if (!profile) {
    return (
      <MyCoursesView
        courses={[]}
        enrollments={[]}
        availablePackages={[]}
      />
    );
  }

  const [courses, enrollments, availablePackages] = await Promise.all([
    getUserCourses(profile.id),
    getUserEnrolledPackages(profile.id),
    getAvailablePackagesForUser(profile.id),
  ]);

  return (
    <MyCoursesView
      courses={courses}
      enrollments={enrollments}
      availablePackages={availablePackages}
      purchased={params.purchased === "1"}
      alreadyOwned={params.owned === "1"}
    />
  );
}
