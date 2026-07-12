"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Instructor } from "@/lib/types";

function InstructorAvatar({ name, avatar, imageUrl }: { name: string; avatar: string; imageUrl?: string }) {
  if (imageUrl) {
    return (
      <div className="relative mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-white/80 shadow-glow">
        <Image src={imageUrl} alt={name} fill className="object-cover" sizes="80px" />
      </div>
    );
  }

  return (
    <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-vibrant to-cyan-neon text-xl font-bold text-white shadow-glow">
      {avatar}
    </div>
  );
}

function InstructorCard({ name, title, avatar, imageUrl }: Instructor) {
  return (
    <div className="glass mx-3 flex w-56 shrink-0 flex-col items-center rounded-2xl p-6 transition-all hover:border-purple-vibrant/30 hover:shadow-glow">
      <InstructorAvatar name={name} avatar={avatar} imageUrl={imageUrl} />
      <h4 className="font-heading text-center text-base font-semibold text-slate-900">{name}</h4>
      <p className="mt-1 text-center text-xs text-slate-600">{title}</p>
    </div>
  );
}

export default function Instructors({ instructors }: { instructors: Instructor[] }) {
  const doubled = [...instructors, ...instructors];

  return (
    <section id="mentors" className="section-padding overflow-hidden bg-navy-light/30">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-12 text-center"
        >
          <span className="mb-4 inline-block rounded-full glass px-4 py-1.5 text-sm text-cyan-neon">
            Expert Mentors
          </span>
          <h2 className="font-heading text-4xl font-bold text-slate-900 md:text-5xl">
            Learn from <span className="gradient-text">Industry Leaders</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-600">
            100+ expert trainers ready to guide your journey to success.
          </p>
        </motion.div>

        <div className="marquee-container relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-amber-50/80 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-amber-50/80 to-transparent" />

          <div className="marquee-track flex animate-marquee py-4">
            {doubled.map((instructor, i) => (
              <InstructorCard key={`${instructor.id}-${i}`} {...instructor} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
