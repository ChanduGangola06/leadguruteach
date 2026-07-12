"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  ImageIcon,
  Globe,
  Shield,
  BookOpen,
  MessageSquareQuote,
  Users,
  ScrollText,
  X,
} from "lucide-react";

const adminNav = [
  { href: "/dashboard/admin", label: "Overview", icon: LayoutDashboard },
  { href: "/dashboard/admin/packages", label: "Packages", icon: Package },
  { href: "/dashboard/admin/banners", label: "Banners", icon: ImageIcon },
  { href: "/dashboard/admin/featured-courses", label: "Featured Courses", icon: BookOpen },
  { href: "/dashboard/admin/testimonials", label: "Testimonials", icon: MessageSquareQuote },
  { href: "/dashboard/admin/instructors", label: "Instructors", icon: Users },
  { href: "/dashboard/admin/audit-logs", label: "Audit Logs", icon: ScrollText },
];

interface AdminSidebarProps {
  mobileOpen?: boolean;
  onMobileClose?: () => void;
}

export default function AdminSidebar({ mobileOpen = false, onMobileClose }: AdminSidebarProps) {
  const pathname = usePathname();

  const navContent = (
    <>
      <div className="flex items-center justify-between border-b border-amber-200/40 p-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-purple-vibrant to-cyan-neon">
            <Shield size={18} className="text-white" />
          </div>
          <span className="font-heading text-lg font-bold gradient-text">Admin Panel</span>
        </div>
        <button
          onClick={onMobileClose}
          className="rounded-lg p-1 text-slate-600 hover:text-slate-900 lg:hidden"
          aria-label="Close menu"
        >
          <X size={20} />
        </button>
      </div>

      <nav className="flex-1 space-y-1 p-3">
        {adminNav.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/dashboard/admin"
              ? pathname === "/dashboard/admin"
              : pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onMobileClose}
              className={`flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
                active
                  ? "bg-purple-vibrant/10 text-purple-vibrant"
                  : "text-slate-600 hover:bg-amber-50 hover:text-slate-900"
              }`}
            >
              <Icon size={18} />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-amber-200/40 p-3">
        <Link
          href="/"
          onClick={onMobileClose}
          className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-sm text-slate-500 hover:bg-amber-50 hover:text-cyan-neon"
        >
          <Globe size={16} />
          View Website
        </Link>
      </div>
    </>
  );

  return (
    <>
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onMobileClose}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {mobileOpen && (
          <motion.aside
            initial={{ x: -280 }}
            animate={{ x: 0 }}
            exit={{ x: -280 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="glass-strong fixed left-0 top-0 z-50 flex h-full w-72 flex-col lg:hidden"
          >
            {navContent}
          </motion.aside>
        )}
      </AnimatePresence>

      <aside className="glass-strong fixed left-0 top-0 z-30 hidden h-full w-[260px] flex-col border-r border-amber-200/40 lg:flex">
        {navContent}
      </aside>
    </>
  );
}
