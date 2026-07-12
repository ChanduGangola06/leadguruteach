"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { IndianRupee, BookOpen, Coins, TrendingUp } from "lucide-react";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { dashboardCourses, earningsChartData } from "@/lib/data";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

const statCards = [
  {
    label: "Total Earnings",
    value: 24500,
    prefix: "₹",
    suffix: "",
    icon: IndianRupee,
    gradient: "from-emerald-500/20 to-teal-500/20",
    iconColor: "text-emerald-400",
  },
  {
    label: "Courses Enrolled",
    value: 4,
    prefix: "",
    suffix: "",
    icon: BookOpen,
    gradient: "from-purple-vibrant/20 to-indigo-500/20",
    iconColor: "text-purple-glow",
  },
  {
    label: "Active LeadsCoins",
    value: 1250,
    prefix: "",
    suffix: "",
    icon: Coins,
    gradient: "from-amber-500/20 to-orange-500/20",
    iconColor: "text-amber-400",
  },
  {
    label: "Completion Rate",
    value: 68,
    prefix: "",
    suffix: "%",
    icon: TrendingUp,
    gradient: "from-cyan-neon/20 to-blue-500/20",
    iconColor: "text-cyan-neon",
  },
];

function ProgressBar({ progress, gradient }: { progress: number; gradient: string }) {
  return (
    <div className="h-2 overflow-hidden rounded-full bg-white/80">
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
        className={`h-full rounded-full bg-gradient-to-r ${gradient}`}
      />
    </div>
  );
}

function EarningsChart() {
  const ref = useRef<SVGSVGElement>(null);
  const isInView = useInView(ref, { once: true });

  const maxEarnings = Math.max(...earningsChartData.map((d) => d.earnings));
  const chartHeight = 160;
  const chartWidth = 100;
  const padding = 10;

  const points = earningsChartData.map((d, i) => {
    const x = padding + (i / (earningsChartData.length - 1)) * (chartWidth - padding * 2);
    const y =
      chartHeight - padding - (d.earnings / maxEarnings) * (chartHeight - padding * 2);
    return { x, y, ...d };
  });

  const pathD = points.reduce((acc, point, i) => {
    if (i === 0) return `M ${point.x} ${point.y}`;
    const prev = points[i - 1];
    const cpx1 = prev.x + (point.x - prev.x) / 3;
    const cpx2 = prev.x + (2 * (point.x - prev.x)) / 3;
    return `${acc} C ${cpx1} ${prev.y}, ${cpx2} ${point.y}, ${point.x} ${point.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - padding} L ${points[0].x} ${chartHeight - padding} Z`;

  return (
    <div className="glass-strong rounded-3xl p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-heading text-lg font-semibold text-slate-900">
            Affiliate Performance
          </h3>
          <p className="text-sm text-slate-500">Earnings over the last 7 days</p>
        </div>
        <div className="rounded-xl bg-emerald-500/10 px-3 py-1.5 text-sm font-medium text-emerald-400">
          +24.5% this week
        </div>
      </div>

      <div className="relative">
        <svg
          ref={ref}
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="h-48 w-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#7C3AED" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
          </defs>

          {[0.25, 0.5, 0.75].map((ratio) => (
            <line
              key={ratio}
              x1={padding}
              y1={padding + ratio * (chartHeight - padding * 2)}
              x2={chartWidth - padding}
              y2={padding + ratio * (chartHeight - padding * 2)}
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="0.5"
            />
          ))}

          <motion.path
            d={areaD}
            fill="url(#chartGradient)"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <motion.path
            d={pathD}
            fill="none"
            stroke="url(#lineGradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isInView ? { pathLength: 1, opacity: 1 } : {}}
            transition={{ duration: 2, ease: "easeInOut" }}
          />

          {points.map((point, i) => (
            <motion.circle
              key={i}
              cx={point.x}
              cy={point.y}
              r="2"
              fill="#06B6D4"
              initial={{ scale: 0, opacity: 0 }}
              animate={isInView ? { scale: 1, opacity: 1 } : {}}
              transition={{ delay: 0.5 + i * 0.1 }}
            />
          ))}
        </svg>

        <div className="mt-2 flex justify-between px-2">
          {earningsChartData.map((d) => (
            <span key={d.day} className="text-xs text-slate-500">
              {d.day}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="mx-auto max-w-7xl space-y-8"
    >
      {/* Stats Row */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.label}
              variants={itemVariants}
              className={`glass-strong rounded-2xl bg-gradient-to-br p-5 ${stat.gradient}`}
            >
              <div className="mb-4 flex items-center justify-between">
                <div className={`rounded-xl bg-white/80 p-2.5 ${stat.iconColor}`}>
                  <Icon size={20} />
                </div>
              </div>
              <p className="font-heading text-2xl font-bold text-slate-900">
                <AnimatedCounter
                  value={stat.value}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                />
              </p>
              <p className="mt-1 text-sm text-slate-600">{stat.label}</p>
            </motion.div>
          );
        })}
      </div>

      {/* Course Progress */}
      <motion.div variants={itemVariants}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-xl font-semibold text-slate-900">My Courses</h2>
          <Link href="/dashboard/courses" className="text-sm text-cyan-neon hover:underline">
            View All
          </Link>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {dashboardCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + index * 0.1 }}
              className="glass-strong rounded-2xl p-5"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="font-medium text-slate-900">{course.title}</h3>
                  <p className="mt-1 text-xs text-slate-500">
                    {course.completedLessons} of {course.totalLessons} lessons completed
                  </p>
                </div>
                <span className="rounded-lg bg-white/80 px-2.5 py-1 text-sm font-semibold text-cyan-neon">
                  {course.progress}%
                </span>
              </div>
              <ProgressBar progress={course.progress} gradient={course.gradient} />
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Affiliate Chart */}
      <motion.div variants={itemVariants}>
        <EarningsChart />
      </motion.div>
    </motion.div>
  );
}
