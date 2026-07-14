"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  IndianRupee,
  BookOpen,
  Users,
  Wallet,
  ShoppingBag,
  ArrowRight,
} from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import type { AffiliateStats } from "@/lib/queries/affiliate";
import type { DashboardCourse } from "@/lib/types";
import { MIN_WITHDRAWAL_AMOUNT } from "@/lib/affiliate/constants";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

interface DashboardOverviewProps {
  courses: DashboardCourse[];
  packagesOwned: number;
  stats: AffiliateStats;
}

export default function DashboardOverview({
  courses,
  packagesOwned,
  stats,
}: DashboardOverviewProps) {
  const previewCourses = courses.slice(0, 4);

  const cards = [
    {
      label: "Total Earnings",
      value: Math.round(stats.totalEarned),
      prefix: "₹",
      suffix: "",
      icon: IndianRupee,
      gradient: "from-emerald-500/20 to-teal-500/20",
      iconColor: "text-emerald-500",
      href: "/dashboard/earnings",
    },
    {
      label: "Available Balance",
      value: Math.round(stats.availableBalance),
      prefix: "₹",
      suffix: "",
      icon: Wallet,
      gradient: "from-amber-500/20 to-orange-500/20",
      iconColor: "text-amber-500",
      href: "/dashboard/earnings",
    },
    {
      label: "Courses Enrolled",
      value: courses.length,
      prefix: "",
      suffix: "",
      icon: BookOpen,
      gradient: "from-purple-vibrant/20 to-indigo-500/20",
      iconColor: "text-purple-glow",
      href: "/dashboard/courses",
    },
    {
      label: "People Referred",
      value: stats.totalReferrals,
      prefix: "",
      suffix: "",
      icon: Users,
      gradient: "from-cyan-neon/20 to-blue-500/20",
      iconColor: "text-cyan-neon",
      href: "/dashboard/affiliate",
    },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl space-y-8"
    >
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div key={stat.label} variants={itemVariants}>
              <Link
                href={stat.href}
                className={`glass-strong block rounded-2xl bg-gradient-to-br p-5 transition hover:border-cyan-neon/40 ${stat.gradient}`}
              >
                <div className="mb-4 flex items-center justify-between">
                  <div className={`rounded-xl bg-white/80 p-2.5 ${stat.iconColor}`}>
                    <Icon size={20} />
                  </div>
                </div>
                <p className="font-heading text-2xl font-bold text-slate-900">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                  />
                </p>
                <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-5 lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="font-heading text-xl font-semibold text-slate-900">My Courses</h2>
              <p className="text-sm text-slate-500">
                {packagesOwned} package{packagesOwned === 1 ? "" : "s"} · {courses.length} course
                {courses.length === 1 ? "" : "s"}
              </p>
            </div>
            <Link href="/dashboard/courses" className="text-sm text-cyan-neon hover:underline">
              View All
            </Link>
          </div>

          {previewCourses.length === 0 ? (
            <div className="rounded-xl border border-dashed border-amber-200/60 px-4 py-10 text-center">
              <BookOpen size={32} className="mx-auto mb-3 text-slate-400" />
              <p className="font-medium text-slate-900">No courses enrolled yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Buy a package to unlock courses in your account.
              </p>
              <Link
                href="/dashboard/courses"
                className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-purple-vibrant hover:underline"
              >
                Browse packages <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid gap-3 sm:grid-cols-2">
              {previewCourses.map((course) => (
                <div key={course.id} className="rounded-xl border border-amber-200/40 bg-white/70 p-4">
                  <p className="text-xs font-medium uppercase tracking-wide text-purple-vibrant">
                    {course.packageName}
                  </p>
                  <h3 className="mt-1 font-medium text-slate-900">{course.title}</h3>
                  {course.description && (
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">{course.description}</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </motion.div>

        <motion.div variants={itemVariants} className="glass-strong space-y-4 rounded-2xl p-5">
          <h2 className="font-heading text-xl font-semibold text-slate-900">Affiliate Snapshot</h2>
          <div className="space-y-3 text-sm">
            <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2.5">
              <span className="text-slate-600">Courses sold</span>
              <span className="font-semibold text-slate-900">{stats.coursesSold}</span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2.5">
              <span className="text-slate-600">Pending payout</span>
              <span className="font-semibold text-amber-600">
                ₹{stats.pendingWithdrawals.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-white/70 px-3 py-2.5">
              <span className="text-slate-600">Paid out</span>
              <span className="font-semibold text-slate-900">
                ₹{stats.paidOut.toLocaleString("en-IN")}
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/affiliate"
            className="flex items-center justify-between rounded-xl border border-amber-200/50 px-3 py-2.5 text-sm text-slate-700 hover:bg-amber-50"
          >
            <span className="inline-flex items-center gap-2">
              <ShoppingBag size={16} className="text-cyan-neon" />
              Affiliate panel
            </span>
            <ArrowRight size={14} />
          </Link>

          <Link
            href="/dashboard/earnings"
            className={`flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-semibold text-white ${
              stats.availableBalance >= MIN_WITHDRAWAL_AMOUNT
                ? "bg-gradient-to-r from-purple-vibrant to-cyan-neon"
                : "bg-slate-400"
            }`}
          >
            {stats.availableBalance >= MIN_WITHDRAWAL_AMOUNT
              ? "Request Payment"
              : `Need ₹${MIN_WITHDRAWAL_AMOUNT}+ to withdraw`}
          </Link>
        </motion.div>
      </div>

      {stats.sales.length > 0 && (
        <motion.div variants={itemVariants} className="glass-strong rounded-2xl p-5">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="font-heading text-xl font-semibold text-slate-900">Recent Sales</h2>
            <Link href="/dashboard/affiliate" className="text-sm text-cyan-neon hover:underline">
              View all
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-amber-200/50 text-left text-slate-500">
                  <th className="pb-3 pr-4 font-medium">Package</th>
                  <th className="pb-3 pr-4 font-medium">Buyer</th>
                  <th className="pb-3 font-medium">Earned</th>
                </tr>
              </thead>
              <tbody>
                {stats.sales.slice(0, 5).map((sale) => (
                  <tr key={sale.id} className="border-b border-amber-100/80">
                    <td className="py-3 pr-4 font-medium text-slate-900">{sale.packageName}</td>
                    <td className="py-3 pr-4 text-slate-600">
                      {sale.buyerName || sale.buyerEmail || "Student"}
                    </td>
                    <td className="py-3 font-semibold text-emerald-600">
                      ₹{sale.commissionAmount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
