import { notFound } from "next/navigation";
import SetupNotice from "@/components/admin/SetupNotice";
import BannerForm from "@/components/admin/BannerForm";
import { getBannerByIdAdmin } from "@/lib/queries/banners";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditBannerPage({ params }: PageProps) {
  const { id } = await params;
  const banner = await getBannerByIdAdmin(id);
  if (!banner) notFound();

  return (
    <>
        <SetupNotice />
        <h1 className="font-heading mb-6 text-2xl font-bold text-slate-900">Edit Banner</h1>
        <BannerForm initial={banner} />
    </>
  );
}
