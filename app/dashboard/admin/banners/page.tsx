import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil } from "lucide-react";
import SetupNotice from "@/components/admin/SetupNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import { getAllBannersAdmin } from "@/lib/queries/banners";
import { deleteBannerAction, toggleBannerActiveAction } from "@/app/actions/banners";

export default async function AdminBannersPage() {
  const banners = await getAllBannersAdmin();

  return (
    <>
        <SetupNotice />
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">Banners</h1>
            <p className="text-sm text-slate-600">Homepage carousel images</p>
          </div>
          <Link href="/dashboard/admin/banners/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-4 py-2.5 text-sm font-semibold text-white">
            <Plus size={16} /> New Banner
          </Link>
        </div>

        {banners.length === 0 ? (
          <div className="glass-strong rounded-2xl p-12 text-center text-slate-500">
            No banners yet.{" "}
            <Link href="/dashboard/admin/banners/new" className="text-cyan-neon hover:underline">
              Add your first banner
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {banners.map((banner) => (
              <div key={banner.id} className="glass-strong overflow-hidden rounded-2xl">
                <div className="relative h-36">
                  <Image src={banner.image_url} alt={banner.title} fill className="object-cover" sizes="400px" />
                </div>
                <div className="p-4">
                  <p className="font-medium text-slate-900">{banner.title || "Untitled"}</p>
                  <p className="text-xs text-slate-500">→ {banner.href}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <form action={toggleBannerActiveAction}>
                      <input type="hidden" name="id" value={banner.id} />
                      <input type="hidden" name="is_active" value={String(!banner.is_active)} />
                      <button type="submit"
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          banner.is_active ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"
                        }`}>
                        {banner.is_active ? "Active" : "Inactive"}
                      </button>
                    </form>
                    <div className="flex gap-2">
                      <Link href={`/dashboard/admin/banners/${banner.id}/edit`}
                        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-purple-vibrant hover:bg-purple-vibrant/10">
                        <Pencil size={14} /> Edit
                      </Link>
                      <form action={deleteBannerAction}>
                        <input type="hidden" name="id" value={banner.id} />
                        <DeleteButton label="Delete" className="rounded-lg px-3 py-1.5 text-sm text-red-500 hover:bg-red-50" />
                      </form>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
    </>
  );
}
