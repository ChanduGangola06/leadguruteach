"use client";

import { useEffect, useState, useCallback } from "react";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2, BookOpen, Megaphone, Video, Mic, Share2, Briefcase } from "lucide-react";

const courseAnimations = [
  {
    id: "digital-marketing",
    course: "Digital Marketing",
    description: "Master ads, SEO & social media",
    lottieUrl: "https://assets1.lottiefiles.com/packages/lf20_2glqweqs.json",
    icon: Megaphone,
    color: "from-purple-vibrant to-pink-500",
  },
  {
    id: "public-speaking",
    course: "Public Speaking",
    description: "Build confidence & communication",
    lottieUrl: "https://assets1.lottiefiles.com/packages/lf20_touohxv0.json",
    icon: Mic,
    color: "from-cyan-neon to-blue-500",
  },
  {
    id: "video-editing",
    course: "Video Editing",
    description: "Create stunning content",
    lottieUrl: "https://assets1.lottiefiles.com/packages/lf20_yr6zz3wv.json",
    icon: Video,
    color: "from-orange-500 to-red-500",
  },
  {
    id: "linkedin",
    course: "LinkedIn Branding",
    description: "Grow your professional network",
    lottieUrl: "https://assets1.lottiefiles.com/packages/lf20_myejiggj.json",
    icon: Briefcase,
    color: "from-blue-500 to-indigo-500",
  },
  {
    id: "affiliate",
    course: "Affiliate Marketing",
    description: "Learn, refer & earn commissions",
    lottieUrl: "https://assets1.lottiefiles.com/packages/lf20_kkflmtur.json",
    icon: Share2,
    color: "from-emerald-500 to-teal-400",
  },
  {
    id: "business",
    course: "Business Strategy",
    description: "Scale your entrepreneurial skills",
    lottieUrl: "https://assets1.lottiefiles.com/packages/lf20_DMgKk1.json",
    icon: BookOpen,
    color: "from-amber-500 to-yellow-500",
  },
];

const ROTATE_INTERVAL = 4000;

function LottieSlide({ url }: { url: string }) {
  const [data, setData] = useState<object | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setData(null);
    fetch(url)
      .then((res) => res.json())
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [url]);

  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-vibrant" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <BookOpen className="h-16 w-16 text-purple-vibrant/50" />
      </div>
    );
  }

  return <Lottie animationData={data} loop autoplay className="h-full w-full" />;
}

export default function HeroLottie() {
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    setCurrent((prev) => (prev + 1) % courseAnimations.length);
  }, []);

  useEffect(() => {
    const timer = setInterval(next, ROTATE_INTERVAL);
    return () => clearInterval(timer);
  }, [next]);

  const active = courseAnimations[current];
  const Icon = active.icon;

  return (
    <div className="relative flex h-full w-full flex-col">
      {/* Course badge */}
      <AnimatePresence mode="wait">
        <motion.div
          key={active.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 10 }}
          transition={{ duration: 0.3 }}
          className="absolute left-4 right-4 top-4 z-10 flex items-center gap-3 rounded-2xl glass-strong px-4 py-3"
        >
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${active.color}`}
          >
            <Icon size={20} className="text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate font-heading text-sm font-semibold text-white">
              {active.course}
            </p>
            <p className="truncate text-xs text-slate-400">{active.description}</p>
          </div>
          <div className="ml-auto flex shrink-0 gap-1">
            {courseAnimations.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === current ? "w-5 bg-cyan-neon" : "w-1.5 bg-white/30 hover:bg-white/60"
                }`}
                aria-label={`Show ${courseAnimations[i].course} animation`}
              />
            ))}
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Lottie animation area */}
      <div className="flex flex-1 items-center justify-center p-6 pt-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={active.id}
            initial={{ opacity: 0, scale: 0.92, x: 30 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.92, x: -30 }}
            transition={{ duration: 0.45, ease: "easeInOut" }}
            className="h-[280px] w-full max-w-sm sm:h-[320px] lg:h-[380px]"
          >
            <LottieSlide url={active.lottieUrl} />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Course type pills */}
      <div className="flex flex-wrap justify-center gap-2 px-4 pb-4">
        {courseAnimations.map((item, i) => (
          <button
            key={item.id}
            onClick={() => setCurrent(i)}
            className={`rounded-full px-3 py-1 text-[11px] font-medium transition-all sm:text-xs ${
              i === current
                ? "bg-gradient-to-r from-purple-vibrant/30 to-cyan-neon/30 text-white ring-1 ring-cyan-neon/40"
                : "bg-white/5 text-slate-500 hover:bg-white/10 hover:text-slate-300"
            }`}
          >
            {item.course}
          </button>
        ))}
      </div>
    </div>
  );
}
