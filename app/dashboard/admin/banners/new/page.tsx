import SetupNotice from "@/components/admin/SetupNotice";
import BannerForm from "@/components/admin/BannerForm";

export default function NewBannerPage() {
  return (
    <>
        <SetupNotice />
        <h1 className="font-heading mb-6 text-2xl font-bold text-slate-900">Create Banner</h1>
        <BannerForm />
    </>
  );
}
