"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import type { FAQ } from "@/lib/types";

interface BundleFAQProps {
  faqs: FAQ[];
}

export default function BundleFAQ({ faqs }: BundleFAQProps) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section className="glass-strong rounded-3xl p-6 md:p-8">
      <h2 className="font-heading mb-6 text-2xl font-bold text-slate-900">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={faq.question}
            className="overflow-hidden rounded-xl border border-amber-200/40 bg-white/90"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-white/80"
            >
              <span className="font-medium text-slate-900">{faq.question}</span>
              <ChevronDown
                size={18}
                className={`shrink-0 text-cyan-neon transition-transform ${
                  open === i ? "rotate-180" : ""
                }`}
              />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <p className="border-t border-amber-200/40 px-4 py-4 text-sm leading-relaxed text-slate-600">
                    {faq.answer}
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
