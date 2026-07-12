import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/client";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  if (!isSupabaseConfigured()) {
    return <>{children}</>;
  }

  const admin = await isAdmin();
  if (!admin) {
    redirect("/dashboard");
  }

  return <>{children}</>;
}
