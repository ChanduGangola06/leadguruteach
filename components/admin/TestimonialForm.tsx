"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { createTestimonial, updateTestimonial } from "@/app/actions/testimonials";
import type { DbTestimonial } from "@/lib/types/database";

interface TestimonialFormProps {
  initial?: DbTestimonial;
}

export default function TestimonialForm({ initial }: TestimonialFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    quote: initial?.quote ?? "",
    name: initial?.name ?? "",
    role: initial?.role ?? "Student",
    rating: initial?.rating?.toString() ?? "5",
    sort_order: initial?.sort_order?.toString() ?? "0",
    is_active: initial?.is_active ?? true,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      quote: form.quote,
      name: form.name,
      role: form.role,
      rating: Math.min(5, Math.max(1, parseInt(form.rating) || 5)),
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    };

    try {
      if (initial) {
        await updateTestimonial(initial.id, payload);
      } else {
        await createTestimonial(payload);
      }
      router.push("/dashboard/admin/testimonials");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const inputClass =
    "input-glow w-full rounded-xl border border-amber-200/60 bg-white px-4 py-2.5 text-sm text-slate-900";

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="glass-strong space-y-4 rounded-2xl p-6">
        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Quote</label>
          <textarea className={`${inputClass} min-h-[120px] resize-y`} value={form.quote} required
            onChange={(e) => setForm({ ...form, quote: e.target.value })} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Name</label>
            <input className={inputClass} value={form.name} required
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Role</label>
            <input className={inputClass} value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })} />
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Rating (1–5)</label>
            <input type="number" min={1} max={5} className={inputClass} value={form.rating}
              onChange={(e) => setForm({ ...form, rating: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Sort Order</label>
            <input type="number" className={inputClass} value={form.sort_order}
              onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
          </div>
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          Active (show on homepage)
        </label>
      </div>

      <button type="submit" disabled={loading}
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-8 py-3.5 text-sm font-semibold text-white disabled:opacity-70">
        {loading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : initial ? "Update Testimonial" : "Create Testimonial"}
      </button>
    </form>
  );
}
