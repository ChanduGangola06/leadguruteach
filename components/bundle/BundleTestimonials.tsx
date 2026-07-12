"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Quote, BadgeCheck } from "lucide-react";
import { testimonials } from "@/lib/data";

export default function BundleTestimonials() {
  const selected = testimonials.slice(0, 3);

  return (
    <section className="glass-strong rounded-3xl p-6 md:p-8">
      <h2 className="font-heading mb-8 text-center text-2xl font-bold text-slate-900">
        What Our Students Say
      </h2>
      <div className="grid gap-6 md:grid-cols-3">
        {selected.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="rounded-2xl border border-amber-200/40 bg-white/90 p-6"
          >
            <Quote size={24} className="mb-4 text-purple-vibrant/50" />
            <p className="mb-6 text-sm leading-relaxed text-slate-600">
              &ldquo;{t.quote}&rdquo;
            </p>
            <div>
              <p className="font-semibold text-slate-900">{t.name}</p>
              <div className="mt-1 flex items-center gap-1.5">
                <BadgeCheck size={14} className="text-cyan-neon" />
                <span className="text-xs text-slate-500">Verified {t.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function MobileBuyBar({
  slug,
  price,
  originalPrice,
  owned = false,
}: {
  slug: string;
  price: number;
  originalPrice: number;
  owned?: boolean;
}) {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-amber-200/60 bg-[#FFFBF0]/95 p-4 backdrop-blur-lg lg:hidden">
      <div className="flex items-center justify-between gap-4">
        <div>
          <span className="font-heading text-xl font-bold gradient-text">
            ₹{price.toLocaleString("en-IN")}
          </span>
          <span className="ml-2 text-sm text-slate-500 line-through">
            ₹{originalPrice.toLocaleString("en-IN")}
          </span>
        </div>
        <motion.div whileTap={{ scale: 0.98 }}>
          <Link
            href={owned ? "/dashboard/courses" : `/checkout/${slug}`}
            className="rounded-xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-8 py-3 text-sm font-semibold text-white"
          >
            {owned ? "My Courses" : "Buy Now"}
          </Link>
        </motion.div>
      </div>
    </div>
  );
}
