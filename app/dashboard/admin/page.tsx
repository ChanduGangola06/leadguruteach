import Link from "next/link";
import {
  Package,
  ImageIcon,
  Plus,
  BookOpen,
  MessageSquareQuote,
  Users,
  Share2,
  Wallet,
} from "lucide-react";
import SetupNotice from "@/components/admin/SetupNotice";
import { getAdminStats } from "@/lib/queries/admin";
import { getAdminAffiliateOverview } from "@/lib/queries/affiliate";

export default async function AdminOverviewPage() {
  const [stats, affiliate] = await Promise.all([
    getAdminStats(),
    getAdminAffiliateOverview(),
  ]);

  const cards = [
    {
      label: "Packages",
      value: stats.packages,
      active: stats.activePackages,
      activeLabel: "active",
      href: "/dashboard/admin/packages",
      icon: Package,
    },
    {
      label: "Banners",
      value: stats.banners,
      active: stats.activeBanners,
      activeLabel: "active",
      href: "/dashboard/admin/banners",
      icon: ImageIcon,
    },
    {
      label: "Featured Courses",
      value: stats.featuredCourses,
      active: stats.activeFeaturedCourses,
      activeLabel: "active",
      href: "/dashboard/admin/featured-courses",
      icon: BookOpen,
    },
    {
      label: "Testimonials",
      value: stats.testimonials,
      active: stats.activeTestimonials,
      activeLabel: "active",
      href: "/dashboard/admin/testimonials",
      icon: MessageSquareQuote,
    },
    {
      label: "Instructors",
      value: stats.instructors,
      active: stats.activeInstructors,
      activeLabel: "active",
      href: "/dashboard/admin/instructors",
      icon: Users,
    },
    {
      label: "Affiliate Sales",
      value: affiliate.totalSales,
      active: affiliate.pendingPayments,
      activeLabel: "pending payments",
      href: "/dashboard/admin/leads",
      icon: Share2,
    },
    {
      label: "Payment Requests",
      value: affiliate.pendingPayments,
      active: Math.round(affiliate.pendingAmount),
      activeLabel: "₹ pending",
      href: "/dashboard/admin/payments",
      icon: Wallet,
    },
  ];

  return (
    <>
      <SetupNotice />
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-slate-900">Admin Overview</h1>
          <p className="text-sm text-slate-600">Manage content, leads, and payment requests.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/dashboard/admin/packages/new"
            className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-4 py-2.5 text-sm font-semibold text-white"
          >
            <Plus size={16} /> Add Package
          </Link>
          <Link
            href="/dashboard/admin/payments"
            className="inline-flex items-center gap-2 rounded-xl border border-amber-300/50 px-4 py-2.5 text-sm font-semibold text-slate-800 hover:bg-amber-50"
          >
            Review Payments
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              href={card.href}
              className="glass-strong rounded-2xl p-5 transition-all hover:border-cyan-neon/40 hover:shadow-glow"
            >
              <Icon size={22} className="mb-3 text-cyan-neon" />
              <p className="font-heading text-3xl font-bold text-slate-900">{card.value}</p>
              <p className="text-sm text-slate-600">{card.label}</p>
              <p className="mt-1 text-xs text-emerald-600">
                {card.active} {card.activeLabel}
              </p>
            </Link>
          );
        })}
      </div>
    </>
  );
}
