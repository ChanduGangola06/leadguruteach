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
      <h2 className="font-heading mb-6 text-2xl font-bold text-white">
        Frequently Asked Questions
      </h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div
            key={faq.question}
            className="overflow-hidden rounded-xl border border-white/5 bg-white/[0.02]"
          >
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="flex w-full items-center justify-between gap-4 px-4 py-4 text-left transition-colors hover:bg-white/5"
            >
              <span className="font-medium text-white">{faq.question}</span>
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
                  <p className="border-t border-white/5 px-4 py-4 text-sm leading-relaxed text-slate-400">
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
