"use client";

import { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  motion,
  useInView,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import { ArrowUpRight, Play } from "lucide-react";
import { featuredCourses } from "@/lib/featuredCourses";
import type { FeaturedCourse } from "@/lib/featuredCourses";

function CourseCard({ course, index }: { course: FeaturedCourse; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLAnchorElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-40px" });

  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [12, -12]), {
    stiffness: 260,
    damping: 22,
  });
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-12, 12]), {
    stiffness: 260,
    damping: 22,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
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
      initial={{ opacity: 0, y: 50, scale: 0.92 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.55, delay: index * 0.07, ease: [0.22, 1, 0.36, 1] }}
      style={{ perspective: 1200 }}
      className="group"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="h-full"
      >
        <Link
          ref={cardRef}
          href={course.href}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          className="relative block h-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] transition-colors duration-500 hover:border-cyan-neon/40 hover:shadow-[0_0_40px_rgba(6,182,212,0.15)]"
        >
          {/* Image */}
          <div className="relative aspect-[4/3] overflow-hidden">
            <motion.div
              className="absolute inset-0"
              whileHover={{ scale: 1.12 }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            >
              <Image
                src={course.image}
                alt={course.title}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
              />
            </motion.div>

            {/* Gradient overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/20 to-transparent opacity-80 transition-opacity duration-500 group-hover:opacity-90" />
            <div className="absolute inset-0 bg-gradient-to-br from-purple-vibrant/0 to-cyan-neon/0 transition-all duration-500 group-hover:from-purple-vibrant/25 group-hover:to-cyan-neon/15" />

            {/* Shine sweep on hover */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
              <div className="absolute inset-0 -translate-x-full skew-x-12 bg-gradient-to-r from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[200%]" />
            </div>

            {/* Category badge */}
            <span className="absolute left-3 top-3 rounded-full bg-black/50 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-cyan-neon backdrop-blur-md sm:text-xs">
              {course.category}
            </span>

            {/* Play icon on hover */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-all duration-300 group-hover:opacity-100">
              <div className="flex h-14 w-14 scale-75 items-center justify-center rounded-full bg-white/20 backdrop-blur-md ring-2 ring-white/30 transition-transform duration-300 group-hover:scale-100">
                <Play size={24} className="ml-1 fill-white text-white" />
              </div>
            </div>
          </div>

          {/* Title bar */}
          <div className="relative p-4">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-neon/50 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

            <div className="flex items-start justify-between gap-2">
              <motion.h3
                className="font-heading text-sm font-semibold leading-snug text-white sm:text-base"
                style={{ transform: "translateZ(20px)" }}
              >
                <motion.span
                  className="inline-block"
                  whileHover={{ y: -2 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {course.title}
                </motion.span>
              </motion.h3>
              <motion.span
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-slate-400 transition-colors group-hover:bg-cyan-neon/20 group-hover:text-cyan-neon"
                whileHover={{ rotate: 45, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 400 }}
              >
                <ArrowUpRight size={16} />
              </motion.span>
            </div>

            {/* Animated underline */}
            <div className="mt-2 h-0.5 w-full origin-left scale-x-0 rounded-full bg-gradient-to-r from-purple-vibrant to-cyan-neon transition-transform duration-500 group-hover:scale-x-100" />
          </div>

          {/* Corner glow */}
          <div className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-cyan-neon/20 blur-2xl opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function CourseContent() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section id="course-content" className="section-padding bg-navy-light/30">
      <div className="mx-auto max-w-7xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center md:mb-16"
        >
          <span className="mb-4 inline-block rounded-full glass px-4 py-1.5 text-sm text-cyan-neon">
            Explore Courses
          </span>
          <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
            Course <span className="gradient-text">Content</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            12 skill-based courses designed by industry experts. Hover to explore each
            learning path.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {featuredCourses.map((course, index) => (
            <CourseCard key={course.id} course={course} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
