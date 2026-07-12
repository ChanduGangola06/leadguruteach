"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import {
  createFeaturedCourse,
  updateFeaturedCourse,
  uploadMediaImage,
} from "@/app/actions/featuredCourses";
import type { DbFeaturedCourse } from "@/lib/types/database";

interface FeaturedCourseFormProps {
  initial?: DbFeaturedCourse;
}

export default function FeaturedCourseForm({ initial }: FeaturedCourseFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    title: initial?.title ?? "",
    image_url: initial?.image_url ?? "",
    category: initial?.category ?? "",
    href: initial?.href ?? "/",
    sort_order: initial?.sort_order?.toString() ?? "0",
    is_active: initial?.is_active ?? true,
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const url = await uploadMediaImage(fd);
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.image_url) {
      setError("Please provide or upload a course image");
      return;
    }
    setLoading(true);
    setError("");

    const payload = {
      title: form.title,
      image_url: form.image_url,
      category: form.category,
      href: form.href,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    };

    try {
      if (initial) {
        await updateFeaturedCourse(initial.id, payload);
      } else {
        await createFeaturedCourse(payload);
      }
      router.push("/dashboard/admin/featured-courses");
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
          <label className="mb-1 block text-xs font-medium text-slate-600">Course Title</label>
          <input className={inputClass} value={form.title} required
            onChange={(e) => setForm({ ...form, title: e.target.value })} />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Category</label>
            <input className={inputClass} placeholder="Marketing" value={form.category}
              onChange={(e) => setForm({ ...form, category: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Link (href)</label>
            <input className={inputClass} value={form.href}
              onChange={(e) => setForm({ ...form, href: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Image URL</label>
          <input className={inputClass} placeholder="https://..." value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Or upload image</label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-amber-300/60 bg-amber-50/50 px-4 py-6 text-sm text-slate-600 hover:bg-amber-50">
            <Upload size={18} />
            {uploading ? "Uploading..." : "Choose image file"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        {form.image_url && (
          <div className="relative h-40 overflow-hidden rounded-xl border border-amber-200/60">
            <Image src={form.image_url} alt="Preview" fill className="object-cover" sizes="600px" />
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Sort Order</label>
          <input type="number" className={inputClass} value={form.sort_order}
            onChange={(e) => setForm({ ...form, sort_order: e.target.value })} />
        </div>

        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input type="checkbox" checked={form.is_active}
            onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
          Active (show on homepage)
        </label>
      </div>

      <button type="submit" disabled={loading || uploading}
        className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-8 py-3.5 text-sm font-semibold text-white disabled:opacity-70">
        {loading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : initial ? "Update Course" : "Create Course"}
      </button>
    </form>
  );
}
