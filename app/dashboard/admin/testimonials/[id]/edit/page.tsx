import { notFound } from "next/navigation";
import SetupNotice from "@/components/admin/SetupNotice";
import TestimonialForm from "@/components/admin/TestimonialForm";
import { getTestimonialByIdAdmin } from "@/lib/queries/testimonials";

export default async function EditTestimonialPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const testimonial = await getTestimonialByIdAdmin(id);
  if (!testimonial) notFound();

  return (
    <>
        <SetupNotice />
        <div className="mb-6">
          <h1 className="font-heading text-2xl font-bold text-slate-900">Edit Testimonial</h1>
          <p className="text-sm text-slate-600">{testimonial.name}</p>
        </div>
        <TestimonialForm initial={testimonial} />
    </>
  );
}
