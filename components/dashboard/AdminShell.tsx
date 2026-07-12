"use client";

import { useState } from "react";
import AdminSidebar from "@/components/admin/AdminSidebar";
import TopNav from "@/components/dashboard/TopNav";
import type { DbProfile } from "@/lib/types/database";

interface AdminShellProps {
  children: React.ReactNode;
  profile: DbProfile | null;
}

export default function AdminShell({ children, profile }: AdminShellProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-navy bg-mesh">
      <AdminSidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />

      <div className="flex min-h-screen flex-col lg:ml-[260px]">
        <TopNav
          variant="admin"
          onMenuClick={() => setMobileOpen(true)}
          sidebarCollapsed={false}
          profile={profile}
        />
        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
