import { redirect } from "next/navigation";
import DashboardShell from "@/components/dashboard/DashboardShell";
import AdminShell from "@/components/dashboard/AdminShell";
import { getProfile } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  if (isSupabaseConfigured()) {
    const profile = await getProfile();
    if (!profile) {
      redirect("/login");
    }
    if (profile.role === "admin") {
      return <AdminShell profile={profile}>{children}</AdminShell>;
    }
    return <DashboardShell profile={profile}>{children}</DashboardShell>;
  }

  return <DashboardShell profile={null}>{children}</DashboardShell>;
}
