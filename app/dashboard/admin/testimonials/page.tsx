import Link from "next/link";
import { Plus, Pencil, Star } from "lucide-react";
import SetupNotice from "@/components/admin/SetupNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import { getAllTestimonialsAdmin } from "@/lib/queries/testimonials";
import { deleteTestimonialAction, toggleTestimonialActiveAction } from "@/app/actions/testimonials";

export default async function AdminTestimonialsPage() {
  const testimonials = await getAllTestimonialsAdmin();

  return (
    <>
        <SetupNotice />
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">Testimonials</h1>
            <p className="text-sm text-slate-600">Student success stories on homepage</p>
          </div>
          <Link href="/dashboard/admin/testimonials/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-4 py-2.5 text-sm font-semibold text-white">
            <Plus size={16} /> New Testimonial
          </Link>
        </div>

        {testimonials.length === 0 ? (
          <div className="glass-strong rounded-2xl p-12 text-center text-slate-500">
            No testimonials yet.{" "}
            <Link href="/dashboard/admin/testimonials/new" className="text-cyan-neon hover:underline">
              Add your first testimonial
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonials.map((t) => (
              <div key={t.id} className="glass-strong rounded-2xl p-5">
                <p className="mb-3 text-sm leading-relaxed text-slate-700">&ldquo;{t.quote}&rdquo;</p>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="font-medium text-slate-900">{t.name}</p>
                    <p className="text-xs text-slate-500">{t.role}</p>
                  </div>
                  <div className="flex items-center gap-1 text-yellow-500">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={14} className="fill-yellow-400" />
                    ))}
                  </div>
                  <div className="flex items-center gap-2">
                    <form action={toggleTestimonialActiveAction}>
                      <input type="hidden" name="id" value={t.id} />
                      <input type="hidden" name="is_active" value={String(!t.is_active)} />
                      <button type="submit"
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          t.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}>
                        {t.is_active ? "Active" : "Inactive"}
                      </button>
                    </form>
                    <Link href={`/dashboard/admin/testimonials/${t.id}/edit`}
                      className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-purple-vibrant hover:bg-purple-vibrant/10">
                      <Pencil size={14} /> Edit
                    </Link>
                    <form action={deleteTestimonialAction}>
                      <input type="hidden" name="id" value={t.id} />
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
