import { notFound } from "next/navigation";
import SetupNotice from "@/components/admin/SetupNotice";
import PackageForm from "@/components/admin/PackageForm";
import { getPackageByIdAdmin } from "@/lib/queries/packages";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditPackagePage({ params }: PageProps) {
  const { id } = await params;
  const pkg = await getPackageByIdAdmin(id);
  if (!pkg) notFound();

  return (
    <>
        <SetupNotice />
        <h1 className="font-heading mb-6 text-2xl font-bold text-slate-900">Edit: {pkg.name}</h1>
        <PackageForm initial={pkg} />
    </>
  );
}
