import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, ExternalLink } from "lucide-react";
import SetupNotice from "@/components/admin/SetupNotice";
import DeleteButton from "@/components/admin/DeleteButton";
import { getAllPackagesAdmin } from "@/lib/queries/packages";
import { deletePackageAction, togglePackageActiveAction } from "@/app/actions/packages";

export default async function AdminPackagesPage() {
  const packages = await getAllPackagesAdmin();

  return (
    <>
        <SetupNotice />
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="font-heading text-2xl font-bold text-slate-900">Packages</h1>
            <p className="text-sm text-slate-600">{packages.length} packages in database</p>
          </div>
          <Link href="/dashboard/admin/packages/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-4 py-2.5 text-sm font-semibold text-white">
            <Plus size={16} /> New Package
          </Link>
        </div>

        <div className="glass-strong overflow-hidden rounded-2xl">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-amber-200/40 bg-amber-50/50 text-left text-slate-600">
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Price</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {packages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-500">
                    No packages yet.{" "}
                    <Link href="/dashboard/admin/packages/new" className="text-cyan-neon hover:underline">
                      Create your first package
                    </Link>
                  </td>
                </tr>
              ) : (
                packages.map((pkg) => (
                  <tr key={pkg.id} className="border-b border-amber-200/30 hover:bg-amber-50/30">
                    <td className="p-4">
                      <div className="relative h-12 w-16 overflow-hidden rounded-lg bg-amber-50">
                        {pkg.image_url ? (
                          <Image src={pkg.image_url} alt={pkg.name} fill className="object-cover" sizes="64px" />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center text-xs text-slate-400">—</div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="font-medium text-slate-900">{pkg.name}</p>
                      <p className="text-xs text-slate-500">{pkg.slug}</p>
                    </td>
                    <td className="p-4 text-slate-700">
                      ₹{Number(pkg.price).toLocaleString("en-IN")}
                    </td>
                    <td className="p-4">
                      <form action={togglePackageActiveAction}>
                        <input type="hidden" name="id" value={pkg.id} />
                        <input type="hidden" name="is_active" value={String(!pkg.is_active)} />
                        <button type="submit"
                          className={`rounded-full px-3 py-1 text-xs font-medium ${
                            pkg.is_active
                              ? "bg-emerald-100 text-emerald-700"
                              : "bg-slate-100 text-slate-500"
                          }`}>
                          {pkg.is_active ? "Active" : "Inactive"}
                        </button>
                      </form>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <Link href={`/dashboard/admin/packages/${pkg.id}/edit`}
                          className="rounded-lg p-2 text-slate-600 hover:bg-amber-50 hover:text-purple-vibrant">
                          <Pencil size={16} />
                        </Link>
                        <Link href={`/bundle/${pkg.slug}`} target="_blank"
                          className="rounded-lg p-2 text-slate-600 hover:bg-amber-50 hover:text-cyan-neon">
                          <ExternalLink size={16} />
                        </Link>
                        <form action={deletePackageAction}>
                          <input type="hidden" name="id" value={pkg.id} />
                          <DeleteButton />
                        </form>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
    </>
  );
}
