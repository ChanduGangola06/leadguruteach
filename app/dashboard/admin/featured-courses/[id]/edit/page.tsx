import { notFound } from "next/navigation";
import SetupNotice from "@/components/admin/SetupNotice";
import FeaturedCourseForm from "@/components/admin/FeaturedCourseForm";
import { getFeaturedCourseByIdAdmin } from "@/lib/queries/featuredCourses";

export default async function EditFeaturedCoursePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const course = await getFeaturedCourseByIdAdmin(id);
  if (!course) notFound();

  return (
    <>
        <SetupNotice />
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-slate-900">Edit Featured Course</h1>
          <p className="text-sm text-slate-600">{course.title}</p>
        </div>
        <FeaturedCourseForm initial={course} />
    </>
  );
}
