"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, Clock, Users } from "lucide-react";
import type { BundleDetail } from "@/lib/types";

interface BundleHeroProps {
  bundle: BundleDetail;
}

export default function BundleHero({ bundle }: BundleHeroProps) {
  return (
    <section className={`relative overflow-hidden bg-mesh pb-12 pt-8 md:pb-16 md:pt-12`}>
      <div className="glow-orb glow-orb-purple -top-20 left-1/4 h-64 w-64 opacity-50" />
      <div className="glow-orb glow-orb-cyan top-0 right-1/4 h-48 w-48 opacity-40" />

      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <Link
          href="/#courses"
          className="mb-6 inline-flex items-center gap-2 text-sm text-slate-600 transition-colors hover:text-cyan-neon"
        >
          <ArrowLeft size={16} />
          Back to Packages
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid items-center gap-8 lg:grid-cols-2"
        >
          <div>
            <span
              className={`mb-4 inline-block rounded-full bg-gradient-to-r ${bundle.gradient} px-4 py-1.5 text-sm font-medium text-white`}
            >
              {bundle.name}
            </span>
            <h1 className="font-heading text-3xl font-bold text-slate-900 md:text-5xl">
              {bundle.tagline}
            </h1>

            <div className="mt-8 flex flex-wrap gap-6">
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-vibrant/20">
                  <BookOpen size={18} className="text-cyan-neon" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{bundle.courses} Courses</p>
                  <p className="text-xs text-slate-500">In this bundle</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-vibrant/20">
                  <Clock size={18} className="text-cyan-neon" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{bundle.hours} Hours</p>
                  <p className="text-xs text-slate-500">Total content</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-vibrant/20">
                  <Users size={18} className="text-cyan-neon" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900">{bundle.enrollments}</p>
                  <p className="text-xs text-slate-500">Students enrolled</p>
                </div>
              </div>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className={`relative flex h-56 items-center justify-center overflow-hidden rounded-3xl bg-gradient-to-br ${bundle.gradient} md:h-72`}
          >
            {bundle.imageUrl ? (
              <Image
                src={bundle.imageUrl}
                alt={bundle.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            ) : (
              <>
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=800&q=80')] bg-cover bg-center opacity-30 mix-blend-overlay" />
                <div className="relative text-center">
                  <p className="font-heading text-5xl font-bold gradient-text md:text-6xl">
                    {bundle.courses}
                  </p>
                  <p className="mt-1 text-lg text-white/80">Premium Courses</p>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
