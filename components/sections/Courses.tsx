"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView, useMotionValue, useSpring, useTransform } from "framer-motion";
import { BookOpen, Clock, Users, Check, Star } from "lucide-react";
import { coursePackages } from "@/lib/data";
import type { CoursePackage } from "@/lib/types";

const slugMap: Record<string, string> = {
  bronze: "bronze-bundle",
  silver: "silver-package",
  gold: "gold-package",
  platinum: "platinum-package",
  diamond: "diamond-package",
  startup: "startup-package",
};

function TiltCard({ pkg, index }: { pkg: CoursePackage; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [8, -8]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-8, 8]), { stiffness: 300, damping: 30 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
      style={{ rotateX, rotateY, transformPerspective: 1000 }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="group relative"
    >
      {pkg.popular && (
        <div className="absolute -top-3 left-1/2 z-10 -translate-x-1/2">
          <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-purple-vibrant to-cyan-neon px-4 py-1 text-xs font-semibold text-white">
            <Star size={12} fill="currentColor" />
            Most Popular
          </span>
        </div>
      )}

      <div
        className={`glass-strong relative flex h-full flex-col rounded-3xl p-6 transition-all duration-300 group-hover:border-purple-vibrant/40 group-hover:shadow-glow-lg bg-gradient-to-br ${pkg.gradient}`}
      >
        <div className="mb-6">
          <h3 className="font-heading text-xl font-bold text-white">{pkg.name}</h3>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="font-heading text-3xl font-bold gradient-text">
              ₹{pkg.price.toLocaleString("en-IN")}
            </span>
            <span className="text-sm text-slate-500 line-through">
              ₹{pkg.originalPrice.toLocaleString("en-IN")}
            </span>
          </div>
        </div>

        <div className="mb-6 flex flex-col gap-3">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <BookOpen size={16} className="text-cyan-neon" />
            {pkg.courses} Courses
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Clock size={16} className="text-cyan-neon" />
            {pkg.hours} Hours
          </div>
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <Users size={16} className="text-cyan-neon" />
            {pkg.enrollments} Enrollments
          </div>
        </div>

        <ul className="mb-8 flex flex-1 flex-col gap-2">
          {pkg.features.map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-sm text-slate-400">
              <Check size={14} className="shrink-0 text-purple-vibrant" />
              {feature}
            </li>
          ))}
        </ul>

        <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.98 }}>
          <Link
            href={`/bundle/${slugMap[pkg.id]}`}
            className="block w-full rounded-xl border border-white/10 bg-white/5 py-3 text-center text-sm font-semibold text-white transition-all hover:border-cyan-neon/50 hover:bg-white/10"
          >
            View Details
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default function Courses() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section id="courses" className="section-padding bg-mesh">
      <div className="mx-auto max-w-7xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full glass px-4 py-1.5 text-sm text-cyan-neon">
            Exclusive Packages
          </span>
          <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
            Choose Your <span className="gradient-text">Learning Path</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Premium course bundles designed to accelerate your career with industry-leading
            certifications and live support.
          </p>
        </motion.div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {coursePackages.map((pkg, index) => (
            <TiltCard key={pkg.id} pkg={pkg} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
