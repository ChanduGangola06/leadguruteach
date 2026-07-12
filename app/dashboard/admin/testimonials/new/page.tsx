import SetupNotice from "@/components/admin/SetupNotice";
import TestimonialForm from "@/components/admin/TestimonialForm";

export default function NewTestimonialPage() {
  return (
    <>
        <SetupNotice />
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-slate-900">New Testimonial</h1>
          <p className="text-sm text-slate-600">Add a student success story</p>
        </div>
        <TestimonialForm />
    </>
  );
}
