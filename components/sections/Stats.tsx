"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Users, GraduationCap, Video, IndianRupee } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { stats } from "@/lib/data";

const icons = [Users, GraduationCap, Video, IndianRupee];

export default function Stats() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative z-10 -mt-8 px-4 pb-8">
      <motion.div
        ref={ref}
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="mx-auto max-w-7xl"
      >
        <div className="glass-strong grid grid-cols-2 gap-6 rounded-3xl p-6 md:grid-cols-4 md:gap-8 md:p-10">
          {stats.map((stat, index) => {
            const Icon = icons[index];
            return (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.1 + 0.2 }}
                className="flex flex-col items-center gap-2 text-center md:items-start md:text-left"
              >
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-vibrant/20 to-cyan-neon/20">
                  <Icon className="h-6 w-6 text-cyan-neon" />
                </div>
                <p className="font-heading text-2xl font-bold text-white md:text-3xl">
                  <AnimatedCounter
                    value={stat.value}
                    prefix={stat.prefix}
                    suffix={stat.suffix}
                    display={stat.display}
                  />
                </p>
                <p className="text-sm text-slate-400">{stat.label}</p>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
