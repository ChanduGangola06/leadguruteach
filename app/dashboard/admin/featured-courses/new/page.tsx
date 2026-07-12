import SetupNotice from "@/components/admin/SetupNotice";
import FeaturedCourseForm from "@/components/admin/FeaturedCourseForm";

export default function NewFeaturedCoursePage() {
  return (
    <>
        <SetupNotice />
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-slate-900">New Featured Course</h1>
          <p className="text-sm text-slate-600">Add a course to the homepage grid</p>
        </div>
        <FeaturedCourseForm />
    </>
  );
}
