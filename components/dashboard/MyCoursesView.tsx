"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { BookOpen, Clock, ShoppingBag, Sparkles, CheckCircle2 } from "lucide-react";
import type { CoursePackage, DashboardCourse, EnrolledPackage } from "@/lib/types";

function ProgressBar({ progress, gradient }: { progress: number; gradient: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/80">
      <div
        className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

interface MyCoursesViewProps {
  courses: DashboardCourse[];
  enrollments: EnrolledPackage[];
  availablePackages: CoursePackage[];
  purchased?: boolean;
  alreadyOwned?: boolean;
}

export default function MyCoursesView({
  courses,
  enrollments,
  availablePackages,
  purchased,
  alreadyOwned,
}: MyCoursesViewProps) {
  return (
    <div className="mx-auto max-w-7xl space-y-10">
      <div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">My Courses</h1>
        <p className="mt-2 text-slate-600">
          Buy a package to unlock courses, then track your learning here.
        </p>
      </div>

      {(purchased || alreadyOwned) && (
        <div className="flex items-center gap-3 rounded-2xl border border-emerald-200/60 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-700">
          <CheckCircle2 size={18} className="shrink-0" />
          {purchased
            ? "Purchase successful! Your courses are now available below."
            : "You already own this package. Your courses are listed below."}
        </div>
      )}

      {/* Enrolled courses */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-slate-900">
            Enrolled Courses
          </h2>
          <span className="text-sm text-slate-500">{courses.length} courses</span>
        </div>

        {courses.length === 0 ? (
          <div className="glass-strong rounded-2xl p-8 text-center">
            <BookOpen size={40} className="mx-auto mb-4 text-slate-400" />
            <p className="font-medium text-slate-900">No courses yet</p>
            <p className="mt-1 text-sm text-slate-600">
              Browse packages below and purchase one to unlock your courses.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {courses.map((course, index) => (
              <motion.div
                key={course.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-strong rounded-2xl p-5"
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-purple-vibrant">
                      {course.packageName}
                    </p>
                    <h3 className="mt-1 font-medium text-slate-900">{course.title}</h3>
                    {course.description && (
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                        {course.description}
                      </p>
                    )}
                  </div>
                  <span className="shrink-0 rounded-lg bg-white/80 px-2.5 py-1 text-sm font-semibold text-cyan-neon">
                    {course.progress}%
                  </span>
                </div>
                <p className="mb-3 text-xs text-slate-500">
                  {course.completedLessons} of {course.totalLessons} lessons completed
                </p>
                <ProgressBar progress={course.progress} gradient={course.gradient} />
              </motion.div>
            ))}
          </div>
        )}
      </section>

      {/* Owned packages summary */}
      {enrollments.length > 0 && (
        <section>
          <h2 className="font-heading mb-4 text-xl font-semibold text-slate-900">My Packages</h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {enrollments.map((pkg) => (
              <div
                key={pkg.id}
                className={`glass-strong rounded-2xl bg-gradient-to-br p-5 ${pkg.gradient}`}
              >
                <div className="flex items-center gap-2 text-sm text-emerald-600">
                  <Sparkles size={16} />
                  Active
                </div>
                <h3 className="mt-2 font-heading text-lg font-semibold text-slate-900">
                  {pkg.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600">
                  {pkg.courses.length} courses · {pkg.hours}h
                </p>
                <Link
                  href={`/bundle/${pkg.slug}`}
                  className="mt-4 inline-block text-sm font-medium text-purple-vibrant hover:underline"
                >
                  View package details
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Browse & buy */}
      <section>
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="font-heading text-xl font-semibold text-slate-900">Browse Packages</h2>
            <p className="mt-1 text-sm text-slate-600">
              Select a package and purchase to add courses to your account.
            </p>
          </div>
          <Link
            href="/#courses"
            className="hidden text-sm text-cyan-neon hover:underline sm:block"
          >
            View on website
          </Link>
        </div>

        {availablePackages.length === 0 ? (
          <div className="glass-strong rounded-2xl p-6 text-center text-sm text-slate-600">
            You own all available packages. Check back when new ones are added!
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {availablePackages.map((pkg) => (
              <div
                key={pkg.id}
                className={`glass-strong rounded-2xl bg-gradient-to-br p-5 ${pkg.gradient}`}
              >
                {pkg.popular && (
                  <span className="mb-2 inline-block rounded-full bg-purple-vibrant/15 px-2.5 py-0.5 text-xs font-semibold text-purple-vibrant">
                    Popular
                  </span>
                )}
                <h3 className="font-heading text-lg font-semibold text-slate-900">{pkg.name}</h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="font-heading text-2xl font-bold text-slate-900">
                    ₹{pkg.price.toLocaleString("en-IN")}
                  </span>
                  <span className="text-sm text-slate-500 line-through">
                    ₹{pkg.originalPrice.toLocaleString("en-IN")}
                  </span>
                </div>
                <div className="mt-3 flex gap-4 text-xs text-slate-600">
                  <span className="flex items-center gap-1">
                    <BookOpen size={14} />
                    {pkg.courses} courses
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    {pkg.hours}h
                  </span>
                </div>
                <div className="mt-5 flex gap-2">
                  <Link
                    href={pkg.slug ? `/bundle/${pkg.slug}` : "/#courses"}
                    className="flex-1 rounded-xl border border-amber-200/60 bg-white/80 py-2.5 text-center text-sm font-medium text-slate-700 hover:bg-white"
                  >
                    Details
                  </Link>
                  <Link
                    href={pkg.slug ? `/checkout/${pkg.slug}` : "/#courses"}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-gradient-to-r from-purple-vibrant to-cyan-neon py-2.5 text-sm font-semibold text-white"
                  >
                    <ShoppingBag size={15} />
                    Buy
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
