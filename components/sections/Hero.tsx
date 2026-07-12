"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import HeroLottie from "@/components/sections/HeroLottie";

const headlineWords = ["Unlock", "Your", "Potential.", "Learn,", "Earn,", "and", "Dominate."];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.2 },
  },
};

const wordVariants = {
  hidden: { opacity: 0, y: 30, filter: "blur(8px)" },
  visible: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: { duration: 0.5, ease: "easeOut" as const },
  },
};

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen overflow-hidden bg-mesh pt-8 pb-16 md:pt-12">
      {/* Background orbs */}
      <div className="glow-orb glow-orb-purple -top-32 left-1/4 h-96 w-96" />
      <div className="glow-orb glow-orb-cyan top-1/3 -right-32 h-80 w-80" />

      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 lg:grid-cols-2 lg:gap-8 lg:px-8">
        {/* Left Content */}
        <div className="flex flex-col gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex w-fit items-center gap-2 rounded-full glass px-4 py-2 text-sm text-cyan-neon"
          >
            <Sparkles size={16} />
            <span>India&apos;s #1 Ed-Tech & Affiliate Platform</span>
          </motion.div>

          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="font-heading text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl"
          >
            {headlineWords.map((word, i) => (
              <motion.span
                key={i}
                variants={wordVariants}
                className={`mr-3 inline-block last:mr-0 ${
                  i >= 3 ? "gradient-text" : "text-slate-900"
                }`}
              >
                {word}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
            className="max-w-lg text-lg leading-relaxed text-slate-600"
          >
            The ultimate ed-tech platform combining top-notch skill development with an
            industry-leading affiliate program. Start learning today and earn while you grow.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="flex flex-wrap gap-4"
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/auth"
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-purple-vibrant to-cyan-neon px-8 py-4 text-base font-semibold text-white shadow-glow-lg"
              >
                Get Started Free
                <ArrowRight size={18} />
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.98 }}>
              <a
                href="#courses"
                className="inline-flex items-center gap-2 rounded-2xl glass px-8 py-4 text-base font-semibold text-slate-900 transition-all hover:border-purple-vibrant/50"
              >
                <TrendingUp size={18} className="text-cyan-neon" />
                Explore Courses
              </a>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="flex items-center gap-6 pt-4"
          >
            <div className="flex -space-x-3">
              {["SM", "RJ", "SP", "AG"].map((initials, i) => (
                <div
                  key={i}
                  className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-navy bg-gradient-to-br from-purple-vibrant to-cyan-neon text-xs font-bold text-white"
                >
                  {initials}
                </div>
              ))}
            </div>
            <p className="text-sm text-slate-600">
              <span className="font-semibold text-slate-900">2 Lakh+</span> students already learning
            </p>
          </motion.div>
        </div>

        {/* Right - Student Lottie carousel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="relative flex h-[480px] items-center justify-center sm:h-[520px] lg:h-[600px]"
        >
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-purple-vibrant/10 to-cyan-neon/10 blur-3xl" />
          <motion.div
            animate={{ y: [0, -12, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative h-full w-full overflow-hidden rounded-3xl glass"
          >
            <HeroLottie />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
