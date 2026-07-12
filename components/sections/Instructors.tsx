"use client";

import { motion } from "framer-motion";
import { instructors } from "@/lib/data";

function InstructorCard({ name, title, avatar }: { name: string; title: string; avatar: string }) {
  return (
    <div className="glass mx-3 flex w-56 shrink-0 flex-col items-center rounded-2xl p-6 transition-all hover:border-purple-vibrant/30 hover:shadow-glow">
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-purple-vibrant to-cyan-neon text-xl font-bold text-white shadow-glow">
        {avatar}
      </div>
      <h4 className="font-heading text-center text-base font-semibold text-white">{name}</h4>
      <p className="mt-1 text-center text-xs text-slate-400">{title}</p>
    </div>
  );
}

export default function Instructors() {
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
          <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
            Learn from <span className="gradient-text">Industry Leaders</span>
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            100+ expert trainers ready to guide your journey to success.
          </p>
        </motion.div>

        <div className="marquee-container relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-24 bg-gradient-to-r from-navy-light/30 to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-24 bg-gradient-to-l from-navy-light/30 to-transparent" />

          <div className="marquee-track flex animate-marquee py-4">
            {doubled.map((instructor, i) => (
              <InstructorCard
                key={`${instructor.id}-${i}`}
                name={instructor.name}
                title={instructor.title}
                avatar={instructor.avatar}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
