"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";
import { createInstructor, updateInstructor, uploadInstructorImage } from "@/app/actions/instructors";
import type { DbInstructor } from "@/lib/types/database";

interface InstructorFormProps {
  initial?: DbInstructor;
}

function initialsFromName(name: string) {
  return name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export default function InstructorForm({ initial }: InstructorFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    name: initial?.name ?? "",
    title: initial?.title ?? "",
    avatar: initial?.avatar ?? "",
    image_url: initial?.image_url ?? "",
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
      const url = await uploadInstructorImage(fd);
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
      name: form.name,
      title: form.title,
      avatar: form.avatar || initialsFromName(form.name),
      image_url: form.image_url,
      sort_order: parseInt(form.sort_order) || 0,
      is_active: form.is_active,
    };

    try {
      if (initial) {
        await updateInstructor(initial.id, payload);
      } else {
        await createInstructor(payload);
      }
      router.push("/dashboard/admin/instructors");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  };

  const inputClass =
    "input-glow w-full rounded-xl border border-amber-200/60 bg-white px-4 py-2.5 text-sm text-slate-900";

  const avatarPreview = form.avatar || (form.name ? initialsFromName(form.name) : "??");

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">{error}</div>
      )}

      <div className="glass-strong space-y-4 rounded-2xl p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Name</label>
            <input className={inputClass} value={form.name} required
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-slate-600">Title / Role</label>
            <input className={inputClass} placeholder="Digital Marketing Expert" value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })} />
          </div>
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Photo URL</label>
          <input className={inputClass} placeholder="https://..." value={form.image_url}
            onChange={(e) => setForm({ ...form, image_url: e.target.value })} />
        </div>

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Or upload photo</label>
          <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-amber-300/60 bg-amber-50/50 px-4 py-6 text-sm text-slate-600 hover:bg-amber-50">
            <Upload size={18} />
            {uploading ? "Uploading..." : "Choose instructor photo"}
            <input type="file" accept="image/*" className="hidden" onChange={handleUpload} disabled={uploading} />
          </label>
        </div>

        {form.image_url ? (
          <div className="relative mx-auto h-32 w-32 overflow-hidden rounded-full border-4 border-white shadow-glow">
            <Image src={form.image_url} alt="Instructor preview" fill className="object-cover" sizes="128px" />
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-purple-vibrant to-cyan-neon text-lg font-bold text-white">
              {avatarPreview}
            </div>
            <p className="text-sm text-slate-500">Initials fallback when no photo is uploaded</p>
          </div>
        )}

        <div>
          <label className="mb-1 block text-xs font-medium text-slate-600">Avatar Initials (optional fallback)</label>
          <input className={inputClass} placeholder="Auto-generated from name" maxLength={3}
            value={form.avatar}
            onChange={(e) => setForm({ ...form, avatar: e.target.value.toUpperCase() })} />
        </div>

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
        {loading ? <><Loader2 size={18} className="animate-spin" /> Saving...</> : initial ? "Update Instructor" : "Create Instructor"}
      </button>
    </form>
  );
}
