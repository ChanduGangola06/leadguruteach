"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Check, Loader2, BookOpen, Clock, ShieldCheck } from "lucide-react";
import { purchasePackageAction } from "@/app/actions/purchases";
import type { BundleDetail } from "@/lib/types";

interface CheckoutFormProps {
  bundle: BundleDetail;
  owned: boolean;
}

export default function CheckoutForm({ bundle, owned }: CheckoutFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const discount = Math.round(
    ((bundle.originalPrice - bundle.price) / bundle.originalPrice) * 100
  );

  async function handlePurchase() {
    setLoading(true);
    setError("");
    try {
      const result = await purchasePackageAction(bundle.slug);
      if (result?.error) setError(result.error);
    } catch {
      // redirect() throws — expected on success
    } finally {
      setLoading(false);
    }
  }

  if (owned) {
    return (
      <div className="glass-strong rounded-3xl p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/15 text-emerald-500">
          <ShieldCheck size={28} />
        </div>
        <h1 className="font-heading text-2xl font-bold text-slate-900">Already enrolled</h1>
        <p className="mt-2 text-slate-600">
          You already own <span className="font-medium text-slate-900">{bundle.name}</span>.
        </p>
        <Link
          href="/dashboard/courses"
          className="mt-6 inline-block rounded-2xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-8 py-3.5 text-sm font-semibold text-white"
        >
          Go to My Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="glass-strong rounded-3xl p-6 md:p-8">
      <p className="text-sm font-medium uppercase tracking-wide text-cyan-neon">Checkout</p>
      <h1 className="font-heading mt-2 text-2xl font-bold text-slate-900">{bundle.name}</h1>
      <p className="mt-1 text-slate-600">{bundle.tagline}</p>

      <div className="mt-6 flex items-baseline gap-3">
        <span className="font-heading text-4xl font-bold gradient-text">
          ₹{bundle.price.toLocaleString("en-IN")}
        </span>
        <span className="text-lg text-slate-500 line-through">
          ₹{bundle.originalPrice.toLocaleString("en-IN")}
        </span>
        {discount > 0 && (
          <span className="rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-xs font-semibold text-emerald-600">
            {discount}% OFF
          </span>
        )}
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3 rounded-xl bg-white/80 p-4">
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <BookOpen size={16} className="text-cyan-neon" />
          {bundle.courses} courses
        </div>
        <div className="flex items-center gap-2 text-sm text-slate-700">
          <Clock size={16} className="text-cyan-neon" />
          {bundle.hours} hours
        </div>
      </div>

      <h2 className="mt-6 font-semibold text-slate-900">What you get</h2>
      <ul className="mt-3 space-y-2">
        {bundle.includes.slice(0, 5).map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
            <Check size={16} className="mt-0.5 shrink-0 text-purple-vibrant" />
            {item}
          </li>
        ))}
      </ul>

      {error && (
        <p className="mt-4 rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-600">{error}</p>
      )}

      <motion.button
        type="button"
        disabled={loading}
        onClick={handlePurchase}
        whileHover={{ scale: loading ? 1 : 1.02 }}
        whileTap={{ scale: loading ? 1 : 0.98 }}
        className="mt-8 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-purple-vibrant to-cyan-neon py-4 text-base font-semibold text-white shadow-glow-lg disabled:opacity-70"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin" />
            Processing…
          </>
        ) : (
          "Confirm Purchase"
        )}
      </motion.button>

      <p className="mt-4 text-center text-xs text-slate-500">
        Demo checkout — no payment gateway. Purchase unlocks courses in your dashboard instantly.
      </p>

      <Link
        href={`/bundle/${bundle.slug}`}
        className="mt-4 block text-center text-sm text-slate-500 hover:text-slate-800"
      >
        ← Back to package details
      </Link>
    </div>
  );
}
