"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, PlayCircle } from "lucide-react";
import type { BundleDetail } from "@/lib/types";

interface BundleContentProps {
  bundle: BundleDetail;
}

export default function BundleContent({ bundle }: BundleContentProps) {
  const [expanded, setExpanded] = useState<number | null>(0);

  return (
    <section className="glass-strong rounded-3xl p-6 md:p-8">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="font-heading text-2xl font-bold text-slate-900">Course Content</h2>
        <div className="flex items-center gap-4 text-sm text-slate-600">
          <span>{bundle.lectures} Lectures</span>
          <span className="text-slate-300">|</span>
          <span>{bundle.hours} Hours</span>
        </div>
      </div>

      <div className="space-y-2">
        {bundle.bundleCourses.map((course, i) => (
          <div
            key={course.title}
            className="overflow-hidden rounded-xl border border-amber-200/40 bg-white/90"
          >
            <button
              onClick={() => setExpanded(expanded === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-white/80"
            >
              <div className="flex items-center gap-3">
                <PlayCircle size={18} className="shrink-0 text-cyan-neon" />
                <span className="font-medium text-slate-900">{course.title}</span>
              </div>
              <ChevronDown
                size={18}
                className={`shrink-0 text-slate-600 transition-transform ${
                  expanded === i ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {expanded === i && course.description && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="border-t border-amber-200/40 px-4 py-3 pl-11 text-sm text-slate-600">
                    {course.description}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </section>
  );
}
