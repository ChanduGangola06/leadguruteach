import { notFound } from "next/navigation";
import SetupNotice from "@/components/admin/SetupNotice";
import InstructorForm from "@/components/admin/InstructorForm";
import { getInstructorByIdAdmin } from "@/lib/queries/instructors";

export default async function EditInstructorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const instructor = await getInstructorByIdAdmin(id);
  if (!instructor) notFound();

  return (
    <>
        <SetupNotice />
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-slate-900">Edit Instructor</h1>
          <p className="text-sm text-slate-600">{instructor.name}</p>
        </div>
        <InstructorForm initial={instructor} />
    </>
  );
}
