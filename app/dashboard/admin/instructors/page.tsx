import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import SetupNotice from "@/components/admin/SetupNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import { getAllInstructorsAdmin } from "@/lib/queries/instructors";
import { deleteInstructorAction, toggleInstructorActiveAction } from "@/app/actions/instructors";

export default async function AdminInstructorsPage() {
  const instructors = await getAllInstructorsAdmin();

  return (
    <>
        <SetupNotice />
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">Instructors</h1>
            <p className="text-sm text-slate-600">Expert mentors marquee on homepage</p>
          </div>
          <Link href="/dashboard/admin/instructors/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-4 py-2.5 text-sm font-semibold text-white">
            <Plus size={16} /> New Instructor
          </Link>
        </div>

        {instructors.length === 0 ? (
          <div className="glass-strong rounded-2xl p-12 text-center text-slate-500">
            No instructors yet.{" "}
            <Link href="/dashboard/admin/instructors/new" className="text-cyan-neon hover:underline">
              Add your first instructor
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {instructors.map((instructor) => (
              <div key={instructor.id} className="glass-strong rounded-2xl p-5">
                <div className="mb-3 flex items-center gap-3">
                  {instructor.image_url ? (
                    <div className="relative h-12 w-12 overflow-hidden rounded-full">
                      <Image src={instructor.image_url} alt={instructor.name} fill className="object-cover" sizes="48px" />
                    </div>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-purple-vibrant to-cyan-neon text-sm font-bold text-white">
                      {instructor.avatar || instructor.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <p className="font-medium text-slate-900">{instructor.name}</p>
                    <p className="text-xs text-slate-500">{instructor.title}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <form action={toggleInstructorActiveAction}>
                    <input type="hidden" name="id" value={instructor.id} />
                    <input type="hidden" name="is_active" value={String(!instructor.is_active)} />
                    <button type="submit"
                      className={`rounded-full px-3 py-1 text-xs font-medium ${
                        instructor.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                      }`}>
                      {instructor.is_active ? "Active" : "Inactive"}
                    </button>
                  </form>
                  <div className="flex gap-2">
                    <Link href={`/dashboard/admin/instructors/${instructor.id}/edit`}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-purple-vibrant hover:bg-purple-vibrant/10">
                      <Pencil size={14} /> Edit
                    </Link>
                    <form action={deleteInstructorAction}>
                      <input type="hidden" name="id" value={instructor.id} />
                      <DeleteButton label="Delete" className="rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-50" />
                    </form>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </>
  );
}
