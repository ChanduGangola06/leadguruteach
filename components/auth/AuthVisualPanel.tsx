"use client";

import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Trophy,
  Wallet,
  Users,
  Video,
  TrendingUp,
  BookOpen,
  Loader2,
} from "lucide-react";
import BrandLogo from "@/components/BrandLogo";

const lottieSlides = [
  {
    id: "learn",
    url: "https://assets1.lottiefiles.com/packages/lf20_iorpbol0.json",
    label: "Live Learning",
  },
  {
    id: "grow",
    url: "https://assets1.lottiefiles.com/packages/lf20_49rdyysj.json",
    label: "Skill Growth",
  },
  {
    id: "earn",
    url: "https://assets1.lottiefiles.com/packages/lf20_kkflmtur.json",
    label: "Earn While You Learn",
  },
];

const orbitItems = [
  { icon: GraduationCap, label: "Certificates", color: "from-purple-vibrant to-purple-glow" },
  { icon: Video, label: "Live Classes", color: "from-cyan-neon to-blue-500" },
  { icon: Trophy, label: "Top Skills", color: "from-amber-500 to-orange-500" },
  { icon: Wallet, label: "Affiliate Pay", color: "from-emerald-500 to-teal-400" },
  { icon: Users, label: "2L+ Students", color: "from-pink-500 to-rose-500" },
  { icon: TrendingUp, label: "Career Boost", color: "from-indigo-500 to-violet-500" },
];

const floatingCards = [
  { title: "Digital Marketing", progress: 78, delay: 0 },
  { title: "Public Speaking", progress: 45, delay: 0.4 },
  { title: "Affiliate Pro", progress: 92, delay: 0.8 },
];

function AuthLottie({ url }: { url: string }) {
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

  if (loading || !data) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-vibrant" />
      </div>
    );
  }

  return <Lottie animationData={data} loop className="h-full w-full" />;
}

interface AuthVisualPanelProps {
  mode?: "login" | "signup";
}

export default function AuthVisualPanel({ mode = "login" }: AuthVisualPanelProps) {
  const [slideIndex, setSlideIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setSlideIndex((i) => (i + 1) % lottieSlides.length);
    }, 4500);
    return () => clearInterval(timer);
  }, []);

  const headline =
    mode === "signup"
      ? { title: "Start Your", accent: "Learning Journey" }
      : { title: "Continue Your", accent: "Growth Story" };

  return (
    <div className="relative hidden w-1/2 overflow-hidden lg:block">
      <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-[#FFFBF0] to-purple-vibrant/15" />

      {/* Animated mesh grid */}
      <div
        className="absolute inset-0 opacity-[0.35]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(124, 58, 237, 0.07) 1px, transparent 1px),
            linear-gradient(90deg, rgba(124, 58, 237, 0.07) 1px, transparent 1px)
          `,
          backgroundSize: "48px 48px",
        }}
      />

      <div className="glow-orb glow-orb-purple absolute -left-20 top-1/4 h-80 w-80 animate-pulse-glow" />
      <div className="glow-orb glow-orb-cyan absolute -right-16 bottom-1/4 h-72 w-72 animate-pulse-glow" />

      {/* SVG learning path */}
      <svg
        className="pointer-events-none absolute inset-0 h-full w-full"
        viewBox="0 0 600 800"
        preserveAspectRatio="xMidYMid slice"
      >
        <motion.path
          d="M 80 650 Q 200 500 300 420 T 520 180"
          fill="none"
          stroke="url(#pathGrad)"
          strokeWidth="2"
          strokeDasharray="8 6"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 0.5 }}
          transition={{ duration: 2.5, ease: "easeInOut" }}
        />
        <defs>
          <linearGradient id="pathGrad" x1="0%" y1="100%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#06B6D4" />
          </linearGradient>
        </defs>
        <motion.circle
          r="6"
          fill="#06B6D4"
          initial={{ offsetDistance: "0%" }}
          animate={{ offsetDistance: "100%" }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
          style={{ offsetPath: 'path("M 80 650 Q 200 500 300 420 T 520 180")' }}
        />
      </svg>

      <div className="relative flex h-full flex-col items-center justify-center px-10 py-12">
        <div className="mb-6">
          <BrandLogo href="/" size={72} showText={false} priority />
        </div>

        {/* Orbital hub */}
        <div className="relative mb-6 h-[340px] w-[340px]">
          {/* Pulse rings */}
          {[1, 2, 3].map((ring) => (
            <motion.div
              key={ring}
              className="absolute inset-0 rounded-full border border-purple-vibrant/20"
              style={{ margin: ring * 28 }}
              animate={{ scale: [1, 1.04, 1], opacity: [0.3, 0.15, 0.3] }}
              transition={{ duration: 3 + ring, repeat: Infinity, ease: "easeInOut" }}
            />
          ))}

          {/* Orbiting badges — slow rotation */}
          <motion.div
            className="absolute inset-0"
            animate={{ rotate: 360 }}
            transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
          >
            {orbitItems.map((item, i) => {
              const Icon = item.icon;
              const angle = (360 / orbitItems.length) * i;
              const rad = (angle * Math.PI) / 180;
              const x = Math.cos(rad) * 155;
              const y = Math.sin(rad) * 155;

              return (
                <motion.div
                  key={item.label}
                  className="absolute left-1/2 top-1/2"
                  style={{ x: x - 28, y: y - 28 }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 48, repeat: Infinity, ease: "linear" }}
                >
                  <div
                    className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${item.color} shadow-lg ring-2 ring-white/40`}
                    title={item.label}
                  >
                    <Icon size={22} className="text-white" />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Center Lottie card */}
          <motion.div
            className="absolute left-1/2 top-1/2 z-10 h-52 w-52 -translate-x-1/2 -translate-y-1/2"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="glass-strong relative h-full w-full overflow-hidden rounded-3xl border border-amber-200/60 p-4 shadow-glow">
              <AnimatePresence mode="wait">
                <motion.div
                  key={lottieSlides[slideIndex].id}
                  initial={{ opacity: 0, scale: 0.92 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  transition={{ duration: 0.45 }}
                  className="h-full w-full"
                >
                  <AuthLottie url={lottieSlides[slideIndex].url} />
                </motion.div>
              </AnimatePresence>
              <div className="absolute bottom-3 left-0 right-0 text-center">
                <span className="rounded-full bg-white/80 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-purple-vibrant backdrop-blur-sm">
                  {lottieSlides[slideIndex].label}
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Floating progress cards */}
        <div className="relative mb-8 flex w-full max-w-sm gap-3">
          {floatingCards.map((card, i) => (
            <motion.div
              key={card.title}
              className="glass flex-1 rounded-xl p-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 + card.delay }}
            >
              <div className="mb-1.5 flex items-center gap-1.5">
                <BookOpen size={12} className="text-cyan-neon" />
                <p className="truncate text-[10px] font-medium text-slate-700">{card.title}</p>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-amber-100">
                <motion.div
                  className="h-full rounded-full bg-gradient-to-r from-purple-vibrant to-cyan-neon"
                  initial={{ width: 0 }}
                  animate={{ width: `${card.progress}%` }}
                  transition={{ duration: 1.5, delay: 1 + i * 0.2, ease: "easeOut" }}
                />
              </div>
              <p className="mt-1 text-right text-[9px] font-semibold text-purple-vibrant">
                {card.progress}%
              </p>
            </motion.div>
          ))}
        </div>

        {/* Headline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-center"
        >
          <h2 className="font-heading text-3xl font-bold text-slate-900">
            {headline.title}{" "}
            <span className="gradient-text">{headline.accent}</span>
          </h2>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-slate-600">
            Master in-demand skills with live trainers, earn through affiliates, and get
            industry-recognized certificates.
          </p>

          {/* Live stats ticker */}
          <div className="mt-6 flex justify-center gap-6">
            {[
              { value: "2L+", label: "Students" },
              { value: "100+", label: "Trainers" },
              { value: "₹70Cr+", label: "Earned" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.8 + i * 0.15 }}
                className="text-center"
              >
                <p className="font-heading text-lg font-bold gradient-text">{stat.value}</p>
                <p className="text-[10px] uppercase tracking-wider text-slate-500">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
