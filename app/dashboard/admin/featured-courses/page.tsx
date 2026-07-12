import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import SetupNotice from "@/components/admin/SetupNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import { getAllFeaturedCoursesAdmin } from "@/lib/queries/featuredCourses";
import {
  deleteFeaturedCourseAction,
  toggleFeaturedCourseActiveAction,
} from "@/app/actions/featuredCourses";

export default async function AdminFeaturedCoursesPage() {
  const courses = await getAllFeaturedCoursesAdmin();

  return (
    <>
        <SetupNotice />
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">Featured Courses</h1>
            <p className="text-sm text-slate-600">12-card course grid on homepage</p>
          </div>
          <Link href="/dashboard/admin/featured-courses/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-4 py-2.5 text-sm font-semibold text-white">
            <Plus size={16} /> New Course
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="glass-strong rounded-2xl p-12 text-center text-slate-500">
            No featured courses yet.{" "}
            <Link href="/dashboard/admin/featured-courses/new" className="text-cyan-neon hover:underline">
              Add your first course
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courses.map((course) => (
              <div key={course.id} className="glass-strong overflow-hidden rounded-2xl">
                <div className="relative h-32">
                  <Image src={course.image_url} alt={course.title} fill className="object-cover" sizes="300px" />
                </div>
                <div className="p-4">
                  <p className="font-medium text-slate-900">{course.title}</p>
                  <p className="text-xs text-slate-500">{course.category} · {course.href}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <form action={toggleFeaturedCourseActiveAction}>
                      <input type="hidden" name="id" value={course.id} />
                      <input type="hidden" name="is_active" value={String(!course.is_active)} />
                      <button type="submit"
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          course.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}>
                        {course.is_active ? "Active" : "Inactive"}
                      </button>
                    </form>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/admin/featured-courses/${course.id}/edit`}
                        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-purple-vibrant hover:bg-purple-vibrant/10">
                        <Pencil size={14} /> Edit
                      </Link>
                      <form action={deleteFeaturedCourseAction}>
                        <input type="hidden" name="id" value={course.id} />
                        <DeleteButton label="Delete" className="rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-50" />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </>
  );
}
