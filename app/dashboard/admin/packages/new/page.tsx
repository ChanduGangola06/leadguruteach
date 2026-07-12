import SetupNotice from "@/components/admin/SetupNotice";
import PackageForm from "@/components/admin/PackageForm";

export default function NewPackagePage() {
  return (
    <>
        <SetupNotice />
        <h1 className="font-heading mb-6 text-2xl font-bold text-slate-900">Create Package</h1>
        <PackageForm />
    </>
  );
}
