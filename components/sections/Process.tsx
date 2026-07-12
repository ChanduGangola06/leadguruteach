"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import Lottie from "lottie-react";
import { Loader2 } from "lucide-react";
import { processSteps } from "@/lib/data";

function LottieCard({
  lottieUrl,
  title,
  description,
  index,
}: {
  lottieUrl: string;
  title: string;
  description: string;
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });
  const [animationData, setAnimationData] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(lottieUrl)
      .then((res) => res.json())
      .then((data) => {
        setAnimationData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [lottieUrl]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: index * 0.15 }}
      className="group glass-strong flex flex-col items-center rounded-3xl p-8 text-center transition-all hover:border-purple-vibrant/30 hover:shadow-glow"
    >
      <div className="mb-6 flex h-40 w-40 items-center justify-center">
        {loading ? (
          <Loader2 className="h-8 w-8 animate-spin text-purple-vibrant" />
        ) : animationData ? (
          <Lottie animationData={animationData} loop autoplay className="h-full w-full" />
        ) : (
          <div className="flex h-24 w-24 animate-pulse-glow items-center justify-center rounded-full bg-gradient-to-br from-purple-vibrant/30 to-cyan-neon/30">
            <span className="font-heading text-3xl font-bold gradient-text">{title[0]}</span>
          </div>
        )}
      </div>
      <h3 className="font-heading mb-3 text-2xl font-bold text-white">{title}</h3>
      <p className="text-sm leading-relaxed text-slate-400">{description}</p>
    </motion.div>
  );
}

export default function Process() {
  const headerRef = useRef<HTMLDivElement>(null);
  const headerInView = useInView(headerRef, { once: true });

  return (
    <section className="section-padding bg-navy-light/50">
      <div className="mx-auto max-w-7xl">
        <motion.div
          ref={headerRef}
          initial={{ opacity: 0, y: 30 }}
          animate={headerInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="mb-16 text-center"
        >
          <span className="mb-4 inline-block rounded-full glass px-4 py-1.5 text-sm text-cyan-neon">
            How It Works
          </span>
          <h2 className="font-heading text-4xl font-bold text-white md:text-5xl">
            Educate. <span className="gradient-text">Innovate.</span> Dominate.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-slate-400">
            Transform your career in three powerful steps with industry-leading training and
            affiliate opportunities.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {processSteps.map((step, index) => (
            <LottieCard
              key={step.id}
              lottieUrl={step.lottieUrl}
              title={step.title}
              description={step.description}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
