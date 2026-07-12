"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Plus, Trash2, Upload } from "lucide-react";
import { createPackage, updatePackage, uploadPackageImage } from "@/app/actions/packages";
import type { DbPackage } from "@/lib/types/database";

interface PackageFormProps {
  initial?: DbPackage;
}

function linesToArray(text: string): string[] {
  return text.split("\n").map((l) => l.trim()).filter(Boolean);
}

function arrayToLines(arr: string[] | null | undefined): string {
  return (arr ?? []).join("\n");
}

export default function PackageForm({ initial }: PackageFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    slug: initial?.slug ?? "",
    name: initial?.name ?? "",
    tagline: initial?.tagline ?? "",
    description: initial?.description ?? "",
    image_url: initial?.image_url ?? "",
    price: initial?.price?.toString() ?? "",
    original_price: initial?.original_price?.toString() ?? "",
    courses_count: initial?.courses_count?.toString() ?? "",
    hours: initial?.hours?.toString() ?? "",
    enrollments: initial?.enrollments ?? "",
    lectures: initial?.lectures?.toString() ?? "",
    gradient: initial?.gradient ?? "from-purple-500/20 to-indigo-600/20",
    popular: initial?.popular ?? false,
    is_active: initial?.is_active ?? true,
    sort_order: initial?.sort_order?.toString() ?? "0",
    features: arrayToLines(initial?.features),
    specialization: arrayToLines(initial?.specialization),
    includes: arrayToLines(initial?.includes),
    bundle_courses: initial?.bundle_courses?.length
      ? initial.bundle_courses
      : [{ title: "", description: "" }],
    journey_points: initial?.journey_points?.length
      ? initial.journey_points
      : [{ title: "", description: "" }],
  });

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      fd.append("file", file);
      const url = await uploadPackageImage(fd);
      setForm((prev) => ({ ...prev, image_url: url }));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed");
    }
    setUploading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const payload = {
      slug: form.slug,
      name: form.name,
      tagline: form.tagline,
      description: form.description,
      image_url: form.image_url,
      price: parseFloat(form.price) || 0,
      original_price: parseFloat(form.original_price) || 0,
      courses_count: parseInt(form.courses_count) || 0,
      hours: parseInt(form.hours) || 0,
      enrollments: form.enrollments,
      lectures: parseInt(form.lectures) || 0,
      gradient: form.gradient,
      popular: form.popular,
      is_active: form.is_active,
      sort_order: parseInt(form.sort_order) || 0,
      features: linesToArray(form.features),
      specialization: linesToArray(form.specialization),
      includes: linesToArray(form.includes),
      bundle_courses: form.bundle_courses.filter((c) => c.title.trim()),
      journey_points: form.journey_points.filter((j) => j.title.trim()),
      certificate_steps: initial?.certificate_steps ?? [],
    };

    try {
      if (initial) {
        await updatePackage(initial.id, payload);
        router.push("/dashboard/admin/packages");
      } else {
        await createPackage(payload);
        router.push("/dashboard/admin/packages");
      }
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const inputClass =
    "input-glow w-full rounded-xl border border-amber-200/60 bg-white px-4 py-2.5 text-sm text-slate-900";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="glass-strong rounded-2xl p-6">
        <h3 className="font-heading mb-4 text-lg font-semibold text-slate-900">Basic Info</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Name *</label>
            <input required className={inputClass} value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Slug *</label>
            <input required className={inputClass} placeholder="gold-package" value={form.slug}
              onChange={(e) => setForm({ ...form, slug: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-600">Tagline</label>
            <input className={inputClass} value={form.tagline}
              onChange={(e) => setForm({ ...form, tagline: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-600">Description</label>
            <textarea rows={4} className={inputClass} value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-600">Package Image URL</label>
            <input className={inputClass} placeholder="https://..." value={form.image_url}
              onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
          </div>
          <div className="sm:col-span-2">
            <label className="mb-1 block text-xs font-medium text-slate-600">Or upload image</label>
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-amber-300/60 bg-amber-50/50 px-4 py-6 text-sm text-slate-600 hover:bg-amber-50">
              <Upload size={18} />
              {uploading ? "Uploading..." : "Choose package cover image"}
              <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
            </label>
          </div>
          {form.image_url && (
            <div className="relative h-44 overflow-hidden rounded-xl border border-amber-200/60 sm:col-span-2">
              <Image src={form.image_url} alt="Package preview" fill className="object-cover" sizes="600px" />
            </div>
          )}
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-6">
        <h3 className="font-heading mb-4 text-lg font-semibold text-slate-900">Pricing & Stats</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["price", "Price (₹)"],
            ["original_price", "Original Price (₹)"],
            ["courses_count", "Courses Count"],
            ["hours", "Hours"],
            ["lectures", "Lectures"],
            ["enrollments", "Enrollments"],
            ["sort_order", "Sort Order"],
            ["gradient", "Gradient Class"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
              <input className={inputClass}
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-6">
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.popular}
              onChange={(e) => setForm({ ...form, popular: e.target.checked })} />
            Most Popular
          </label>
          <label className="flex items-center gap-2 text-sm text-slate-700">
            <input type="checkbox" checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })} />
            Active (visible on site)
          </label>
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-6">
        <h3 className="font-heading mb-4 text-lg font-semibold text-slate-900">Lists (one item per line)</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            ["features", "Features"],
            ["specialization", "Specialization"],
            ["includes", "Includes"],
          ].map(([key, label]) => (
            <div key={key}>
              <label className="mb-1 block text-xs font-medium text-slate-600">{label}</label>
              <textarea rows={5} className={inputClass}
                value={form[key as keyof typeof form] as string}
                onChange={(e) => setForm({ ...form, [key]: e.target.value })} />
            </div>
          ))}
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-slate-900">Bundle Courses</h3>
          <button type="button" onClick={() => setForm({
            ...form, bundle_courses: [...form.bundle_courses, { title: "", description: "" }],
          })} className="flex items-center gap-1 text-sm text-cyan-neon">
            <Plus size={16} /> Add Course
          </button>
        </div>
        <div className="space-y-3">
          {form.bundle_courses.map((course, i) => (
            <div key={i} className="flex gap-2">
              <input placeholder="Course title" className={inputClass} value={course.title}
                onChange={(e) => {
                  const updated = [...form.bundle_courses];
                  updated[i] = { ...updated[i], title: e.target.value };
                  setForm({ ...form, bundle_courses: updated });
                }} />
              <input placeholder="Description (optional)" className={inputClass} value={course.description ?? ""}
                onChange={(e) => {
                  const updated = [...form.bundle_courses];
                  updated[i] = { ...updated[i], description: e.target.value };
                  setForm({ ...form, bundle_courses: updated });
                }} />
              <button type="button" onClick={() => setForm({
                ...form, bundle_courses: form.bundle_courses.filter((_, idx) => idx !== i),
              })} className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-strong rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="font-heading text-lg font-semibold text-slate-900">Journey Points</h3>
          <button type="button" onClick={() => setForm({
            ...form, journey_points: [...form.journey_points, { title: "", description: "" }],
          })} className="flex items-center gap-1 text-sm text-cyan-neon">
            <Plus size={16} /> Add Point
          </button>
        </div>
        <div className="space-y-3">
          {form.journey_points.map((point, i) => (
            <div key={i} className="flex gap-2">
              <input placeholder="Title" className={inputClass} value={point.title}
                onChange={(e) => {
                  const updated = [...form.journey_points];
                  updated[i] = { ...updated[i], title: e.target.value };
                  setForm({ ...form, journey_points: updated });
                }} />
              <input placeholder="Description" className={inputClass} value={point.description}
                onChange={(e) => {
                  const updated = [...form.journey_points];
                  updated[i] = { ...updated[i], description: e.target.value };
                  setForm({ ...form, journey_points: updated });
                }} />
              <button type="button" onClick={() => setForm({
                ...form, journey_points: form.journey_points.filter((_, idx) => idx !== i),
              })} className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50">
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      </div>

      <button type="submit" disabled={loading || uploading}
        className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-vibrant to-cyan-neon py-3.5 text-sm font-semibold text-white disabled:opacity-70 sm:w-auto sm:px-10">
        {loading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : initial ? "Update Package" : "Create Package"}
      </button>
    </form>
  );
}
