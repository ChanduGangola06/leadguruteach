"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Check, BookOpen, Clock, Users, Award } from "lucide-react";
import type { BundleDetail } from "@/lib/types";

interface BundlePricingCardProps {
  bundle: BundleDetail;
}

export default function BundlePricingCard({ bundle }: BundlePricingCardProps) {
  const discount = Math.round(
    ((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100
  );

  return (
    <div className="glass-strong sticky top-28 rounded-3xl p-6 md:p-8">
      <div className="mb-6 flex items-baseline gap-3">
        <span className="font-heading text-4xl font-bold gradient-text">
          ₹{bundle.price.toLocaleString("en-IN")}
        </span>
        <span className="text-lg text-slate-500 line-through">
          ₹{bundle.originalPrice.toLocaleString("en-IN")}
        </span>
        {discount > 0 && (
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-400">
            {discount}% OFF
          </span>
        )}
      </div>

      <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
        <Link
          href="/auth"
          className="mb-6 block w-full rounded-2xl bg-gradient-to-r from-purple-vibrant to-cyan-neon py-4 text-center text-base font-semibold text-white shadow-glow-lg"
        >
          Buy Now
        </Link>
      </motion.div>

      <div className="mb-6 grid grid-cols-3 gap-3 rounded-xl bg-white/80 p-4">
        <div className="text-center">
          <BookOpen size={18} className="mx-auto mb-1 text-cyan-neon" />
          <p className="text-sm font-semibold text-slate-900">{bundle.courses}</p>
          <p className="text-xs text-slate-500">Courses</p>
        </div>
        <div className="text-center">
          <Clock size={18} className="mx-auto mb-1 text-cyan-neon" />
          <p className="text-sm font-semibold text-slate-900">{bundle.hours}h</p>
          <p className="text-xs text-slate-500">Hours</p>
        </div>
        <div className="text-center">
          <Users size={18} className="mx-auto mb-1 text-cyan-neon" />
          <p className="text-sm font-semibold text-slate-900">{bundle.enrollments}</p>
          <p className="text-xs text-slate-500">Enrolled</p>
        </div>
      </div>

      <h4 className="mb-3 font-semibold text-slate-900">Includes</h4>
      <ul className="space-y-2.5">
        {bundle.includes.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-slate-600">
            <Check size={16} className="mt-0.5 shrink-0 text-purple-vibrant" />
            {item}
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center gap-2 rounded-xl bg-purple-vibrant/10 px-4 py-3">
        <Award size={18} className="text-purple-glow" />
        <span className="text-sm text-slate-700">Certificate of Completion included</span>
      </div>
    </div>
  );
}
