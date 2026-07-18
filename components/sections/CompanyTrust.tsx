"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { BadgeCheck, Building2, MapPin, Phone, X } from "lucide-react";

export const COMPANY_NAME = "LeadGuru Tech Private Limited";
export const COMPANY_ADDRESS =
  "147 Marranwala, Nanakpur Shiv Mandir, Panchkula, Haryana, India, 134102";
export const COMPANY_PHONES = ["+91 78958 75484", "+91 83510 83508"];

const trustPoints = [
  {
    icon: BadgeCheck,
    title: "Registered Private Limited Company",
    description:
      "LeadGuru Teach operates under a legally registered Indian private limited company, so your learning and earnings are backed by a real business.",
  },
  {
    icon: Building2,
    title: "Verified Registered Office",
    description: COMPANY_ADDRESS,
  },
];

export default function CompanyTrust() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  const [zoomed, setZoomed] = useState(false);

  return (
    <section className="section-padding bg-navy-light/50">
      <div className="mx-auto max-w-7xl">
        <motion.div
          ref={ref}
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block rounded-full glass px-4 py-1.5 text-sm text-cyan-neon">
            Trust &amp; Transparency
          </span>
          <h2 className="font-heading text-4xl font-bold text-slate-900 md:text-5xl">
            A <span className="gradient-text">Registered Company</span> You Can Trust
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            We are a government-registered private limited company with a verified office in
            Panchkula, Haryana — not just a website.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="glass-strong grid items-center gap-10 rounded-3xl p-8 md:grid-cols-2 md:p-12"
        >
          {/* Company details */}
          <div className="space-y-8">
            {trustPoints.map((point) => (
              <div key={point.title} className="flex gap-4">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-vibrant/20 to-cyan-neon/20">
                  <point.icon className="h-6 w-6 text-purple-vibrant" />
                </span>
                <div>
                  <h3 className="font-heading text-lg font-semibold text-slate-900">
                    {point.title}
                  </h3>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{point.description}</p>
                </div>
              </div>
            ))}

            <div className="flex gap-4">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-vibrant/20 to-cyan-neon/20">
                <Phone className="h-6 w-6 text-purple-vibrant" />
              </span>
              <div>
                <h3 className="font-heading text-lg font-semibold text-slate-900">Talk to Us</h3>
                <p className="mt-1 flex flex-col gap-0.5 text-sm text-slate-600">
                  {COMPANY_PHONES.map((phone) => (
                    <a
                      key={phone}
                      href={`tel:${phone.replace(/\s/g, "")}`}
                      className="transition-colors hover:text-cyan-neon"
                    >
                      {phone}
                    </a>
                  ))}
                </p>
              </div>
            </div>
          </div>

          {/* Certificate */}
          <div className="flex flex-col items-center">
            <button
              type="button"
              onClick={() => setZoomed(true)}
              className="group relative overflow-hidden rounded-2xl border border-amber-200/60 bg-white shadow-lg transition-shadow hover:shadow-glow"
              aria-label="View company certificate"
            >
              <Image
                src="/company-certificate.png"
                alt={`No Objection Certificate for the registered office of ${COMPANY_NAME}`}
                width={627}
                height={1024}
                className="h-auto w-64 object-contain transition-transform duration-300 group-hover:scale-[1.03] md:w-72"
              />
              <span className="absolute inset-x-0 bottom-0 bg-navy/80 py-2 text-center text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100">
                Click to enlarge
              </span>
            </button>
            <p className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin size={14} className="text-cyan-neon" />
              Registered office document — Panchkula, Haryana
            </p>
          </div>
        </motion.div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4"
            onClick={() => setZoomed(false)}
          >
            <button
              type="button"
              className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Close certificate preview"
            >
              <X size={22} />
            </button>
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="max-h-full overflow-auto rounded-xl bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src="/company-certificate.png"
                alt={`No Objection Certificate for the registered office of ${COMPANY_NAME}`}
                width={627}
                height={1024}
                className="h-auto w-[min(90vw,560px)] object-contain"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
