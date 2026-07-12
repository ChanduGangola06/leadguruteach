"use client";

import { motion } from "framer-motion";
import { Award, CheckCircle2 } from "lucide-react";
import type { BundleDetail } from "@/lib/types";

interface BundleOverviewProps {
  bundle: BundleDetail;
}

export default function BundleOverview({ bundle }: BundleOverviewProps) {
  return (
    <div className="space-y-8">
      {/* Overview */}
      <section className="glass-strong rounded-3xl p-6 md:p-8">
        <h2 className="font-heading mb-4 text-2xl font-bold text-slate-900">Course Overview</h2>
        <p className="leading-relaxed text-slate-600">{bundle.description}</p>

        <h3 className="font-heading mb-3 mt-8 text-lg font-semibold text-slate-900">
          Bundle Specialization
        </h3>
        <ul className="space-y-3">
          {bundle.specialization.map((item) => (
            <li key={item} className="flex items-start gap-3 text-sm text-slate-600">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-purple-vibrant" />
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Journey */}
      <section className="glass-strong rounded-3xl p-6 md:p-8">
        <h2 className="font-heading mb-6 text-2xl font-bold text-slate-900">
          How Does This Bundle Add Up to Your Journey?
        </h2>
        <div className="space-y-4">
          {bundle.journeyPoints.map((point, i) => (
            <motion.div
              key={point.title}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-4 rounded-xl border border-amber-200/40 bg-white/90 p-4"
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-purple-vibrant to-cyan-neon text-sm font-bold text-slate-900">
                {i + 1}
              </div>
              <div>
                <h4 className="font-semibold text-slate-900">{point.title}</h4>
                <p className="mt-1 text-sm text-slate-600">{point.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Bundle courses list */}
      <section className="glass-strong rounded-3xl p-6 md:p-8">
        <h2 className="font-heading mb-6 text-2xl font-bold text-slate-900">Bundle Content</h2>
        <h3 className="mb-4 text-sm font-medium uppercase tracking-wider text-cyan-neon">
          Specific Courses
        </h3>
        <div className="grid gap-3 sm:grid-cols-2">
          {bundle.bundleCourses.map((course, i) => (
            <motion.div
              key={course.title}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.03 }}
              className="flex items-start gap-3 rounded-xl border border-amber-200/40 bg-white/90 p-4"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-purple-vibrant/20 text-xs font-bold text-purple-glow">
                {i + 1}
              </span>
              <div>
                <p className="text-sm font-medium text-slate-900">{course.title}</p>
                {course.description && (
                  <p className="mt-1 text-xs text-slate-500">{course.description}</p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Certificate */}
      <section className="glass-strong rounded-3xl p-6 md:p-8">
        <div className="flex items-center gap-3 mb-6">
          <Award size={28} className="text-cyan-neon" />
          <h2 className="font-heading text-2xl font-bold text-slate-900">
            Earn the Certificate of Completion
          </h2>
        </div>
        <p className="mb-6 text-slate-600">
          Embark on a learning journey and earn your Certificate of Completion with our
          comprehensive program.
        </p>
        <div className="grid gap-4 sm:grid-cols-2">
          {bundle.certificateSteps.map((step, i) => (
            <div
              key={step}
              className="flex items-start gap-3 rounded-xl border border-amber-200/40 bg-white/90 p-4"
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-cyan-neon/20 text-xs font-bold text-cyan-neon">
                {i + 1}
              </span>
              <p className="text-sm text-slate-600">{step}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
