import SetupNotice from "@/components/admin/SetupNotice";
import InstructorForm from "@/components/admin/InstructorForm";

export default function NewInstructorPage() {
  return (
    <>
        <SetupNotice />
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-slate-900">New Instructor</h1>
          <p className="text-sm text-slate-600">Add an expert mentor</p>
        </div>
        <InstructorForm />
    </>
  );
}
